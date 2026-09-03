import { site } from '../content/site';
import { services } from '../content/services';
import { skillGroups, LEVEL_META } from '../content/skills';
import { projects, shippedProjects } from '../content/projects';
import { about } from '../content/about';
import { publicProfile } from '../content/publicProfile';

export interface Chunk {
  id: string;
  source: string;
  text: string;
}

/**
 * Builds the agent's knowledge base from the same content modules the page
 * renders. Grounding on `src/content/*` rather than a separate hand-written
 * prompt means the agent can never drift from what the site actually claims.
 * Update a project and the agent's answer updates with it.
 */
export function buildCorpus(): Chunk[] {
  const chunks: Chunk[] = [];

  chunks.push({
    id: 'identity',
    source: 'profile',
    text: `${site.name} is a ${site.role}. ${site.tagline} Location: ${site.location}. Availability: ${site.availability.label}. Contact email: ${site.links.email}. Typical response time: ${site.responseTime}.`,
  });

  for (const experience of publicProfile.experience) {
    chunks.push({
      id: `experience-${experience.organization.toLowerCase()}`,
      source: 'experience',
      text: `${experience.role} at ${experience.organization}, ${experience.start}–${experience.end}, ${experience.location}. ${experience.summary} Approved public facts: ${experience.approvedFacts.join('; ')}.`,
    });
  }

  for (const education of publicProfile.education) {
    chunks.push({
      id: `education-${education.institution.toLowerCase().replace(/\W+/g, '-')}`,
      source: 'education',
      text: `${education.degree} at ${education.institution}, ${education.end}.`,
    });
  }

  for (const s of services) {
    chunks.push({
      id: `service-${s.id}`,
      source: 'services',
      text: `Service: ${s.title}. ${s.promise} Deliverables: ${s.deliverables.join('; ')}. Typical timeline: ${s.timeline}. Stack: ${s.stack.join(', ')}.`,
    });
  }

  for (const g of skillGroups) {
    const detail = g.skills
      .map((s) => `${s.name} (${LEVEL_META[s.level].label.toLowerCase()}: ${s.plain})`)
      .join(', ');
    chunks.push({
      id: `skills-${g.id}`,
      source: 'skills',
      text: `Skill area: ${g.title}: ${g.blurb} Skills: ${detail}.`,
    });
  }

  chunks.push({
    id: 'work-index',
    source: 'projects',
    // Without this, "what has he built" retrieves two or three chunks and the
    // model assembles the list out of fragments, which is how a project goes
    // missing from an answer.
    text: `Complete list of projects on this site: ${projects
      .map((p) => `${p.title} (${p.status}, ${p.year}, ${p.tags.join('/')})`)
      .join('. ')}. There are ${shippedProjects.length} shipped projects in total and no others.`,
  });

  for (const p of projects) {
    // Two chunks per project. One long chunk ranks unfairly against short ones
    // and is too coarse to answer a narrow question like "is the code public".
    const repo = p.links?.some((l) => /source/i.test(l.label))
      ? `Source code is public at ${p.links.find((l) => /source/i.test(l.label))!.href}.`
      : 'The source code for this project is private and there is no public repository.';
    const metrics = p.metrics?.map((m) => `${m.value} ${m.label}`).join(', ') ?? '';
    chunks.push({
      id: `project-${p.id}-card`,
      source: 'projects',
      text: `Project: ${p.title} (${p.status}, ${p.year}). ${p.summary} Stack: ${p.stack.join(', ')}. Tags: ${p.tags.join(', ')}. Key numbers: ${metrics}. ${repo} Case study: /work/${p.slug}.`,
    });

    if (!p.study) continue;
    // Gallery captions carry the synthetic-evidence disclaimers, which is
    // exactly the thing the model should be repeating rather than inventing.
    const evidence = p.gallery?.map((g) => g.caption).join(' ') ?? '';
    const nda = p.nda ? ` CONFIDENTIALITY: ${p.nda}` : '';
    chunks.push({
      id: `project-${p.id}-study`,
      source: 'projects',
      text: `Case study for ${p.title}. ${p.study.context} ${p.study.blocks
        .map((b) => `${b.heading}: ${b.body} ${b.points?.join('; ') ?? ''}`)
        .join(' ')} Evidence shown: ${evidence}${nda}`,
    });
  }

  chunks.push({
    id: 'about',
    source: 'about',
    text: `About. ${about.intro.join(' ')} Riding-to-engineering parallels: ${about.parallels
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
 * Deliberately not embeddings: the corpus is around thirty chunks. Vector
 * search would mean an extra API round-trip and a model dependency to rank
 * thirty paragraphs. Term overlap does the same job instantly and offline.
 */
export function retrieve(query: string, k = 6): Chunk[] {
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
    // Longer chunks win on raw counts alone, so the case studies would take
    // every slot. Log, not linear: a chunk twice as long is not half as useful.
    return { chunk, score: score / Math.log(chunk.text.length) };
  });

  const hits = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  const top = hits.slice(0, k).map((h) => h.chunk);
  if (top.some((c) => c.id === 'identity')) return top;
  // Prepend identity without taking a slot from a real hit. The caller caps
  // the context by characters anyway, so one extra chunk costs nothing.
  return [corpus.find((c) => c.id === 'identity')!, ...top];
}
