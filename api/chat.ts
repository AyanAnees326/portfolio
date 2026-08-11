/**
 * Chat endpoint — the ONLY place provider credentials are read.
 *
 * ⚠️ Nothing in this file may ever be imported from `src/`. Vite would inline
 * the values into the client bundle and a Databricks PAT in a public bundle is
 * a workspace credential, not just a billing risk. Keys live in Vercel env
 * vars; `npm run check:secrets` fails the build if one reaches `dist/`.
 *
 * Cascade:  Databricks Model Serving → OpenRouter free models → 502
 * (the client renders scripted answers on 502, so the UI never breaks).
 */

export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `You are the portfolio assistant for a full-stack and AI-agent developer. You answer questions from potential clients and recruiters browsing the site.

Rules:
- Answer ONLY from the CONTEXT provided. If the context does not cover it, say so plainly and point them to the contact form or email.
- Never invent projects, clients, prices, employers, dates or credentials.
- If context is marked CONFIDENTIALITY, respect it absolutely: never name the client or industry, and never describe agent internals or prompts.
- Speak as the developer's assistant in third person ("he builds…", "his work…"). Never claim to be the developer.
- Be concise: 2-4 sentences. No bullet lists unless asked. No emoji.
- If asked something off-topic, redirect to what this site is about.`;

const MAX_QUESTION_LEN = 500;
const MAX_TOKENS = 400;

// Best-effort per-IP limiting. Edge instances are ephemeral and not shared, so
// this throttles the common case rather than providing a hard guarantee — the
// real cost ceiling is MAX_TOKENS plus the client-side turn cap.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 10;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

function buildMessages(question: string, context: string, history: ChatTurn[]) {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.map((h) => ({ role: h.role, content: String(h.content).slice(0, 1000) })),
    { role: 'user', content: `CONTEXT:\n${context}\n\nQUESTION: ${question}` },
  ];
}

function extractReply(data: unknown): string | null {
  const choice = (data as { choices?: { message?: { content?: string } }[] })?.choices?.[0];
  const content = choice?.message?.content;
  return typeof content === 'string' && content.trim() ? content.trim() : null;
}

/** Tier 1 — Databricks Model Serving (OpenAI-compatible invocations route). */
async function callDatabricks(messages: unknown[]): Promise<string | null> {
  const host = process.env.DATABRICKS_HOST?.replace(/\/+$/, '');
  const endpoint = process.env.DATABRICKS_ENDPOINT;
  const token = process.env.DATABRICKS_TOKEN;
  if (!host || !endpoint || !token) return null;

  const res = await fetch(`${host}/serving-endpoints/${endpoint}/invocations`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages, max_tokens: MAX_TOKENS, temperature: 0.3 }),
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) throw new Error(`databricks ${res.status}`);
  return extractReply(await res.json());
}

/**
 * OpenRouter free-model discovery.
 *
 * Free-tier model ids churn constantly — models get renamed, retired or moved
 * off free tier without notice, so a hardcoded id is a fallback that quietly
 * dies in a few months. We fetch the live list and filter to zero-price, and
 * only fall back to the seed list if that request itself fails.
 */
const SEED_FREE_MODELS = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'deepseek/deepseek-chat-v3-0324:free',
  'google/gemma-3-27b-it:free',
];

let cachedFreeModels: { at: number; ids: string[] } | null = null;
const MODEL_CACHE_MS = 30 * 60_000;

async function freeModels(key: string): Promise<string[]> {
  if (cachedFreeModels && Date.now() - cachedFreeModels.at < MODEL_CACHE_MS) {
    return cachedFreeModels.ids;
  }
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) throw new Error(`models ${res.status}`);

    const json = (await res.json()) as {
      data?: { id: string; pricing?: { prompt?: string; completion?: string } }[];
    };
    const ids = (json.data ?? [])
      .filter(
        (m) =>
          Number(m.pricing?.prompt ?? '1') === 0 &&
          Number(m.pricing?.completion ?? '1') === 0,
      )
      .map((m) => m.id)
      // Prefer instruction-tuned chat models over the long tail.
      .sort((a, b) => Number(b.includes('instruct')) - Number(a.includes('instruct')))
      .slice(0, 6);

    const list = ids.length > 0 ? ids : SEED_FREE_MODELS;
    cachedFreeModels = { at: Date.now(), ids: list };
    return list;
  } catch {
    return SEED_FREE_MODELS;
  }
}

/** Tier 2 — walk the free-model list until one answers. */
async function callOpenRouter(messages: unknown[]): Promise<string | null> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return null;

  for (const model of await freeModels(key)) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model, messages, max_tokens: MAX_TOKENS, temperature: 0.3 }),
        signal: AbortSignal.timeout(12_000),
      });
      if (!res.ok) continue;

      const reply = extractReply(await res.json());
      if (reply) return reply;
    } catch {
      // Try the next candidate rather than giving up on the whole tier.
    }
  }
  return null;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'method not allowed' }, { status: 405 });
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (rateLimited(ip)) {
    return Response.json({ error: 'rate limited' }, { status: 429 });
  }

  let body: { question?: string; context?: string; history?: ChatTurn[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid json' }, { status: 400 });
  }

  const question = String(body.question ?? '').slice(0, MAX_QUESTION_LEN).trim();
  const context = String(body.context ?? '').slice(0, 8_000);
  const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

  if (!question) {
    return Response.json({ error: 'question required' }, { status: 400 });
  }

  const messages = buildMessages(question, context, history);

  try {
    const reply = await callDatabricks(messages);
    if (reply) return Response.json({ reply, provider: 'databricks' });
  } catch {
    // Fall through to tier 2 — quota, expired token, cold endpoint, timeout.
  }

  const orReply = await callOpenRouter(messages);
  if (orReply) return Response.json({ reply: orReply, provider: 'openrouter' });

  // Tier 3 lives on the client so it works even when this route is absent.
  return Response.json({ error: 'no provider available' }, { status: 502 });
}
