import { site } from '@/content/site';
import { services } from '@/content/services';
import { shippedProjects } from '@/content/projects';

/**
 * Tier 3 of the agent cascade: canned answers when every model provider is
 * unreachable.
 *
 * A dead AI widget on a site that sells AI services does real damage, so the
 * failure mode is a useful answer plus a route to a human, never a spinner
 * that never resolves or a raw error string.
 */
const RULES: { match: RegExp; answer: string }[] = [
  {
    match: /price|cost|charge|budget|rate|quote|how much/i,
    answer: `Projects are quoted per scope rather than per hour, so you know the number before anything starts. As a rough guide: a landing page is usually under $1k, a full web app with a backend runs $3k to $8k, and AI agent work depends heavily on how many systems it has to touch. Email ${site.links.email} with what you have in mind and you'll get a fixed quote back.`,
  },
  {
    match: /how long|timeline|when|deadline|fast|quick|deliver/i,
    answer: `Typical timelines: ${services
      .map((s) => `${s.title.toLowerCase()} ${s.timeline}`)
      .join(', ')}. You get a live preview link from day one, so you can watch it come together rather than waiting for a reveal.`,
  },
  {
    match: /agent|ai|llm|automat|chatbot|rag|gpt|claude/i,
    answer:
      'Two of these were built at NICL. One reads supplier invoices and matches them line by line against the purchase order in SAP, stopping for a person whenever something disagrees. The other answers HR policy questions and cites the filename and page it took the answer from, or says the policy does not cover it. Both case studies describe the architecture. Neither publishes a document, a vendor or a real number.',
  },
  {
    match: /mobile|app store|ios|android|react native|flutter/i,
    answer:
      'Mobile is React Native, so iOS and Android come from one codebase, roughly 3 to 8 weeks including store submission. That covers offline support, push notifications, and the backend behind it.',
  },
  {
    match: /available|hire|freelance|work with|free|capacity|book/i,
    answer: `${site.availability.label}. ${site.availability.detail}. Email ${site.links.email} and you'll normally get a reply ${site.responseTime}.`,
  },
  {
    match: /skill|tech|stack|language|framework|know|experience/i,
    answer:
      'Frontend is React, TypeScript and Tailwind; backend is Python, FastAPI and Node with Postgres or Mongo; AI work covers LLM APIs, agent architecture, tool calling and RAG. The Skills section on this page labels each one honestly: "working" means shipped with it, "learning" means building with it right now.',
  },
  {
    match: /project|built|portfolio|work|shipped|experience/i,
    answer: `Documented here: ${shippedProjects
      .map((p) => p.title)
      .join(', ')}. Each one has a case study with what was hard about it. The two built at NICL show synthetic data in their screenshots and have no public repository. The rest link to source.`,
  },
  {
    match: /contact|email|reach|talk|call|message/i,
    answer: `Easiest route is email: ${site.links.email}. Or use the contact form at the bottom of this page. It reaches the same inbox, ${site.responseTime}.`,
  },
];

export function fallbackAnswer(question: string): string {
  const hit = RULES.find((r) => r.match.test(question));
  if (hit) return hit.answer;

  return `I can't reach my language model right now, so I'm answering from a script, so I can only cover the common questions: services, pricing, timelines, skills, projects and availability. For anything else, email ${site.links.email} directly and you'll get a real answer ${site.responseTime}.`;
}
