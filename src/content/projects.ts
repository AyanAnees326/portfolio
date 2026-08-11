export type ProjectStatus = 'shipped' | 'in-progress' | 'planned';

export interface CaseStudyBlock {
  heading: string;
  body: string;
  /** Optional bullet list rendered under the body. */
  points?: string[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  /** One line for the card. */
  summary: string;
  status: ProjectStatus;
  year: string;
  tags: string[];
  stack: string[];
  /** Big stat shown on the card, e.g. { value: '6', label: 'internal tools replaced' } */
  metrics?: { value: string; label: string }[];
  links?: { label: string; href: string }[];
  /** Long-form case study. Empty for planned work. */
  study?: {
    context: string;
    blocks: CaseStudyBlock[];
  };
  /** Confidentiality note rendered as a callout on the case study. */
  nda?: string;
}

export const projects: Project[] = [
  {
    id: 'agent-platform',
    slug: 'agent-platform',
    title: 'Agentic Operations Platform',
    summary:
      'A multi-agent system with an operator dashboard, built during an industry internship. Agents handle recurring operational work; humans supervise, correct and approve.',
    status: 'shipped',
    year: '2026',
    tags: ['AI Agents', 'Full-stack', 'Dashboard'],
    stack: ['Python', 'LLM APIs', 'React', 'TypeScript', 'Tailwind', 'REST'],
    metrics: [
      { value: 'Multi', label: 'agent orchestration' },
      { value: 'Live', label: 'operator dashboard' },
      { value: '24/7', label: 'unattended runs' },
    ],
    nda: 'Built under a confidentiality agreement. The client, the industry specifics, and the agents’ internal logic and prompts are deliberately omitted. What follows is the system architecture and dashboard design only — the parts I can show.',
    study: {
      context:
        'An operations team was doing high-volume repetitive work by hand across several disconnected systems. The task was not "add a chatbot" — it was to build agents that could carry out that work end to end, plus a control surface that let the team trust and supervise them.',
      blocks: [
        {
          heading: 'The problem',
          body:
            'Manual, repeatable work spread across multiple tools, with no single view of what was happening. Any automation had to be auditable: the team needed to see what the system decided and why, and be able to step in before anything committed.',
          points: [
            'Work was repetitive but not trivial — it needed judgement, so simple scripting failed',
            'Errors were expensive and hard to trace after the fact',
            'No shared visibility into status, throughput or failures',
          ],
        },
        {
          heading: 'How the system is structured',
          body:
            'A coordinator receives a task, decomposes it, and dispatches to specialised workers. Each worker has a narrow, well-defined tool surface rather than open access, so its blast radius is bounded and its behaviour is testable. Every step — input, tool call, output, decision — is written to a run log before the next step begins.',
          points: [
            'Coordinator → specialised workers → bounded tool surface per worker',
            'Every run fully logged and replayable for debugging',
            'Human-in-the-loop approval gate before any consequential action',
            'Retries with backoff; failures surface to the dashboard instead of dying silently',
          ],
        },
        {
          heading: 'The operator dashboard',
          body:
            'The interface I own. It turns an opaque agent system into something a non-engineer can actually supervise — which is the difference between a demo and a tool people use.',
          points: [
            'Live run feed: what is executing right now, and at which step',
            'Per-run timeline showing each decision and tool call in sequence',
            'Approval queue for actions waiting on a human',
            'Failure view that groups errors by cause rather than listing them raw',
            'Throughput and success-rate metrics over time',
          ],
        },
        {
          heading: 'What I took from it',
          body:
            'The model is the easy part. The hard parts are the boundaries around it: what a worker is allowed to touch, what happens when a tool call fails at 3am, and how you show a non-technical operator enough to trust the system without drowning them in logs. Most of the engineering effort went into observability and failure handling, not prompting.',
        },
      ],
    },
  },
  {
    id: 'ui-system',
    slug: 'ui-system',
    title: 'React + Tailwind Interface System',
    summary:
      'A component library and high-fidelity UI mockup exploring design tokens, responsive layout and motion — the groundwork the Lab on this site is built from.',
    status: 'shipped',
    year: '2026',
    tags: ['Frontend', 'Design System', 'UI/UX'],
    stack: ['React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Vite'],
    metrics: [
      { value: '20+', label: 'components' },
      { value: '100%', label: 'responsive' },
      { value: 'AA', label: 'contrast target' },
    ],
    study: {
      context:
        'A self-directed build to answer one question properly: what does it take for an interface to feel expensive rather than merely functional? The output became the foundation for the component Lab on this site.',
      blocks: [
        {
          heading: 'Design tokens first',
          body:
            'Colour, spacing, type scale and easing curves are defined once as CSS custom properties and consumed everywhere. Changing the accent colour of the entire system is a one-line edit — which is exactly what makes the skin-switcher demo in the Lab possible.',
        },
        {
          heading: 'Composition over configuration',
          body:
            'Rather than one component with thirty props, small primitives compose. A card is a surface plus a border treatment plus an optional spotlight, each independently reusable. This site uses the same approach — Magnetic, Spotlight, Tilt3D and Reveal wrap arbitrary children.',
        },
        {
          heading: 'Motion with rules',
          body:
            'Every animation uses the same two easing curves and animates only transform and opacity. Consistent motion is what separates "designed" from "decorated" — and restricting the properties keeps it smooth on mid-range hardware.',
          points: [
            'One shared easing vocabulary across every component',
            'transform/opacity only — no layout-triggering animation',
            'prefers-reduced-motion honoured globally, not per component',
          ],
        },
      ],
    },
  },

  // ---------------------------------------------------------------- planned
  {
    id: 'restaurant-platform',
    slug: 'restaurant-platform',
    title: 'Restaurant Ordering & Reservations',
    summary:
      'A complete ordering and booking platform for restaurants — menu management, cart and checkout, table reservations, and a live kitchen order board.',
    status: 'planned',
    year: 'Next',
    tags: ['Web App', 'Full-stack', 'Payments'],
    stack: ['React', 'TypeScript', 'Node', 'PostgreSQL', 'Stripe'],
  },
  {
    id: 'ride-companion',
    slug: 'ride-companion',
    title: 'Ride Companion',
    summary:
      'A mobile app for motorcyclists: GPS route recording, ride stats, per-bike maintenance logs, and group ride planning. Built native-first for the things a web app cannot do.',
    status: 'planned',
    year: 'Next',
    tags: ['Mobile', 'React Native', 'Maps'],
    stack: ['React Native', 'Expo', 'SQLite', 'Mapbox'],
  },
  {
    id: 'mcp-tool',
    slug: 'mcp-tool',
    title: 'Open-source MCP Server',
    summary:
      'A developer tool published to npm — an MCP server that gives AI assistants a typed, safe interface to a real system. Infrastructure, not another wrapper.',
    status: 'planned',
    year: 'Next',
    tags: ['Open Source', 'Dev Tool', 'AI'],
    stack: ['TypeScript', 'MCP', 'Node', 'npm'],
  },
];

export const shippedProjects = projects.filter((p) => p.status === 'shipped');
export const plannedProjects = projects.filter((p) => p.status !== 'shipped');

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
