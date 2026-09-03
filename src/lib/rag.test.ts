import { describe, expect, it } from 'vitest';
import { buildCorpus, retrieve } from './rag';
import { shippedProjects } from '@/content/projects';

describe('agent corpus', () => {
  it('gives every project a card chunk and a study chunk', () => {
    const ids = new Set(buildCorpus().map((c) => c.id));
    for (const p of shippedProjects) {
      expect(ids.has(`project-${p.id}-card`)).toBe(true);
      expect(ids.has(`project-${p.id}-study`)).toBe(true);
    }
  });

  it('retrieves the right project card when a project is named', () => {
    for (const p of shippedProjects) {
      const hits = retrieve(p.title).map((c) => c.id);
      expect(hits).toContain(`project-${p.id}-card`);
    }
  });

  it('always includes the identity chunk', () => {
    for (const q of ['what is his rust experience', 'pricing', '???', 'sitemap']) {
      expect(retrieve(q).map((c) => c.id)).toContain('identity');
    }
  });

  it('keeps chunks short enough to rank fairly', () => {
    for (const chunk of buildCorpus()) {
      expect(chunk.text.length, chunk.id).toBeLessThan(4000);
    }
  });
});
