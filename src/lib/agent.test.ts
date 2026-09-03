import { afterEach, describe, expect, it, vi } from 'vitest';
import { askAgent } from './agent';

describe('portfolio assistant', () => {
  afterEach(() => vi.restoreAllMocks());

  it('uses local retrieval and scripted answers when the endpoint is offline', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    const result = await askAgent('What AI experience does he have?', []);
    expect(result.provider).toBe('fallback');
    expect(result.sources.length).toBeGreaterThan(0);
    expect(result.reply).toMatch(/AI|agent/i);
  });

  it('accepts provider-selected sources from the server', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ reply: 'Grounded answer', provider: 'openrouter', sources: ['experience'] }), { status: 200 }));
    await expect(askAgent('What did he build?', [])).resolves.toEqual({ reply: 'Grounded answer', provider: 'openrouter', sources: ['experience'] });
  });
});
