import { site } from '@/content/site';
import { services } from '@/content/services';
import { skillGroups, LEVEL_META } from '@/content/skills';
import { projects } from '@/content/projects';
import { about } from '@/content/about';

export interface Chunk {
  id: string;
  source: string;
  text: string;
}

/**
 * Builds the agent's knowledge base from the same content modules the page
 * renders. Grounding on `src/content/*` rather than a separate hand-written
 * prompt means the agent can never drift from what the site actually claims —
 * update a project, and the agent's answer updates with it.
 */
export function buildCorpus(): Chunk[] {
  const chunks: Chunk[] = [];

  chunks.push({
    id: 'identity',
    source: 'profile',
    text: `${site.name} is a ${site.role}. ${site.tagline} Location: ${site.location}. Availability: ${site.availability.label}, ${site.availability.detail}. Contact email: ${site.links.email}. Typical response time: ${site.responseTime}.`,
  });

  for (const s of services) {
    chunks.push({
      id: `service-${s.id}`,
      source: 'services',
      text: `Service — ${s.title}. ${s.promise} Deliverables: ${s.deliverables.join('; ')}. Typical timeline: ${s.timeline}. Stack: ${s.stack.join(', ')}.`,
    });
  }

  for (const g of skillGroups) {
    const detail = g.skills
      .map((s) => `${s.name} (${LEVEL_META[s.level].label.toLowerCase()}: ${s.plain})`)
      .join(', ');
    chunks.push({
      id: `skills-${g.id}`,
      source: 'skills',
      text: `Skill area — ${g.title}: ${g.blurb} Skills: ${detail}.`,
    });
  }

  for (const p of projects) {
    const base = `Project — ${p.title} (${p.status}, ${p.year}). ${p.summary} Stack: ${p.stack.join(', ')}. Tags: ${p.tags.join(', ')}.`;
    const study = p.study
      ? ` Context: ${p.study.context} ${p.study.blocks
          .map((b) => `${b.heading}: ${b.body} ${b.points?.join('; ') ?? ''}`)
          .join(' ')}`
      : '';
    const nda = p.nda ? ` CONFIDENTIALITY: ${p.nda}` : '';
    chunks.push({ id: `project-${p.id}`, source: 'projects', text: base + study + nda });
  }

  chunks.push({
    id: 'about',
    source: 'about',
    text: `About — ${about.intro.join(' ')} Riding-to-engineering parallels: ${about.parallels
      .map((p) => `${p.title}: ${p.moto} ${p.dev}`)
      .join(' ')} Currently learning: ${about.currentlyLearning.join(', ')}. ${about.closing}`,
  });

  return chunks;
}

const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'do', 'does', 'did', 'you', 'your', 'he',
  'his', 'they', 'them', 'i', 'me', 'my', 'what', 'how', 'can', 'could', 'would',
  'to', 'of', 'in', 'on', 'for', 'with', 'and', 'or', 'it', 'this', 'that', 'have',
  'has', 'about', 'tell', 'me', 'any', 'much', 'many', 'be', 'been',
]);

/**
 * Keyword-overlap retrieval.
 *
 * Deliberately not embeddings: the corpus is ~15 chunks. Vector search here
 * would mean an extra API round-trip and a model dependency to rank fifteen
 * paragraphs — term overlap does the same job instantly and offline.
 */
export function retrieve(query: string, k = 5): Chunk[] {
  const corpus = buildCorpus();
  const terms = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));

  if (terms.length === 0) return corpus.slice(0, k);

  const scored = corpus.map((chunk) => {
    const haystack = chunk.text.toLowerCase();
    let score = 0;
    for (const term of terms) {
      // Count occurrences, with a bonus for whole-word matches.
      const occurrences = haystack.split(term).length - 1;
      if (occurrences > 0) {
        score += occurrences;
        if (new RegExp(`\\b${term}\\b`).test(haystack)) score += 2;
      }
    }
    return { chunk, score };
  });

  const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  // Always include the identity chunk so the model knows whose site it is.
  const identity = corpus.find((c) => c.id === 'identity')!;
  const top = hits.slice(0, k).map((h) => h.chunk);
  return top.some((c) => c.id === 'identity') ? top : [identity, ...top].slice(0, k);
}
