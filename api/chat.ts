/**
 * Chat endpoint, the ONLY place provider credentials are read.
 *
 * ⚠️ Nothing in this file may ever be imported from `src/`. Vite would inline
 * the values into the client bundle and a Databricks PAT in a public bundle is
 * a workspace credential, not just a billing risk. Keys live in Vercel env
 * vars; `npm run check:secrets` fails the build if one reaches `dist/`.
 *
 * Cascade:  Databricks Model Serving → OpenRouter free models → 502
 * (the client renders scripted answers on 502, so the UI never breaks).
 */

import { retrieve } from '../src/lib/rag';

export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `You are the portfolio assistant for a full-stack and AI-agent developer. You answer questions from potential clients and recruiters browsing the site.

Rules:
- Answer ONLY from the CONTEXT provided. If the context does not cover it, say so plainly and point them to the contact form or email.
- Never invent projects, clients, prices, employers, dates or credentials.
- If context is marked CONFIDENTIALITY, respect it absolutely: never name the client or industry, and never describe agent internals or prompts.
- Speak as the developer's assistant in third person ("he builds", "his work"). Never claim to be the developer.
- Be concise: 2-4 sentences. No bullet lists unless asked. No emoji.
- Every project in CONTEXT is labelled shipped or planned. Never describe planned work as if it were built.
- Some projects state their source code is private. Never imply private code can be browsed and never invent a repository URL. Say the code is not public and point to the case study.
- Quote only figures that appear verbatim in CONTEXT. Do not estimate, round or add up numbers yourself.
- The sign shop project is self-directed spec work for a business that does not exist. Never describe it as client work.
- Write plain sentences. No em-dashes, no rule-of-three lists, no marketing adjectives.
- If asked something off-topic, redirect to what this site is about.`;

const MAX_QUESTION_LEN = 500;
const MAX_TOKENS = 400;
const MAX_HISTORY_TURNS = 6;
const MAX_HISTORY_CONTENT = 1_000;
const CANONICAL_ORIGIN = 'https://portfolio-tau-tan-99.vercel.app';
const RESPONSE_HEADERS = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff',
};

// Best-effort per-IP limiting. Edge instances are ephemeral and not shared, so
// this throttles the common case rather than providing a hard guarantee. The
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
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: 'user', content: `CONTEXT:\n${context}\n\nQUESTION: ${question}` },
  ];
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: RESPONSE_HEADERS });
}

function originAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const configured = (process.env.CHAT_ALLOWED_ORIGINS ?? '').split(',').map((value) => value.trim()).filter(Boolean);
  const allowed = new Set([CANONICAL_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173', ...configured]);
  return allowed.has(origin);
}

function parseHistory(value: unknown): ChatTurn[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > MAX_HISTORY_TURNS) return null;
  const turns: ChatTurn[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') return null;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string' || !content.trim() || content.length > MAX_HISTORY_CONTENT) return null;
    turns.push({ role, content: content.trim() });
  }
  return turns;
}

function extractReply(data: unknown): string | null {
  const choice = (data as { choices?: { message?: { content?: string } }[] })?.choices?.[0];
  const content = choice?.message?.content;
  return typeof content === 'string' && content.trim() ? content.trim() : null;
}

let databricksOAuth: { token: string; expiresAt: number } | null = null;

async function databricksToken(host: string): Promise<string | null> {
  if (databricksOAuth && databricksOAuth.expiresAt > Date.now() + 60_000) return databricksOAuth.token;
  const clientId = process.env.DATABRICKS_CLIENT_ID;
  const clientSecret = process.env.DATABRICKS_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  const response = await fetch(`${host}/oidc/v1/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials', scope: 'all-apis' }),
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) throw new Error(`databricks oauth ${response.status}`);
  const data = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) return null;
  databricksOAuth = { token: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return data.access_token;
}

/** Tier 1: least-privilege Databricks service-principal OAuth. */
async function callDatabricks(messages: unknown[]): Promise<string | null> {
  const host = process.env.DATABRICKS_HOST?.replace(/\/+$/, '');
  const endpoint = process.env.DATABRICKS_ENDPOINT;
  if (!host || !endpoint) return null;
  const token = await databricksToken(host);
  if (!token) return null;

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
 * Free-tier model ids churn constantly. Models get renamed, retired or moved
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

/** Tier 2: walk the free-model list until one answers. */
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
    return json({ error: 'method not allowed' }, 405);
  }

  if (!originAllowed(request)) return json({ error: 'origin not allowed' }, 403);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json({ error: 'content-type must be application/json' }, 415);

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (rateLimited(ip)) {
    return json({ error: 'rate limited' }, 429);
  }

  let body: { question?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid json' }, 400);
  }

  if (typeof body.question !== 'string' || body.question.length > MAX_QUESTION_LEN) return json({ error: 'invalid question' }, 400);
  const question = body.question.trim();
  const history = parseHistory(body.history);

  if (!question) return json({ error: 'question required' }, 400);
  if (!history) return json({ error: 'invalid history' }, 400);

  const chunks = retrieve(question, 6);
  const sources = [...new Set(chunks.map((chunk) => chunk.source))];
  const context = chunks.map((chunk) => `[${chunk.source}] ${chunk.text}`).join('\n\n').slice(0, 8_000);
  const messages = buildMessages(question, context, history);

  try {
    const reply = await callDatabricks(messages);
    if (reply) return json({ reply, provider: 'databricks', sources });
  } catch {
    // Fall through to tier 2: quota, expired token, cold endpoint, timeout.
  }

  const orReply = await callOpenRouter(messages);
  if (orReply) return json({ reply: orReply, provider: 'openrouter', sources });

  // Tier 3 lives on the client so it works even when this route is absent.
  return json({ error: 'no provider available' }, 502);
}
