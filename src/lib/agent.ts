import { retrieve } from './rag';
import { fallbackAnswer } from './fallback';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AgentResult {
  reply: string;
  /** Which tier answered — surfaced in the UI so the behaviour is honest. */
  provider: 'databricks' | 'openrouter' | 'fallback';
  /** Retrieval trace shown in the UI as visible "tool calls". */
  sources: string[];
}

export const MAX_TURNS = 12;

/**
 * Client half of the agent. Retrieval happens here — the corpus is already in
 * the bundle, so shipping the relevant chunks to the function costs one fewer
 * round trip and keeps the serverless side stateless.
 */
export async function askAgent(
  question: string,
  history: ChatMessage[],
): Promise<AgentResult> {
  const chunks = retrieve(question, 5);
  const sources = chunks.map((c) => c.source);
  const context = chunks.map((c) => `[${c.source}] ${c.text}`).join('\n\n');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        context,
        // Only the last few turns — the corpus does the heavy lifting, and a
        // long history is pure token cost on a pay-per-token endpoint.
        history: history.slice(-6),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`chat endpoint ${res.status}`);

    const data = (await res.json()) as { reply?: string; provider?: string };
    if (!data.reply) throw new Error('empty reply');

    return {
      reply: data.reply,
      provider: data.provider === 'openrouter' ? 'openrouter' : 'databricks',
      sources,
    };
  } catch {
    // Tier 3. Covers no /api route at all (plain `vite preview`, static host),
    // both providers down, and network failure alike.
    return { reply: fallbackAnswer(question), provider: 'fallback', sources };
  }
}
