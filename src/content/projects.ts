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
  cover?: string;
  alt?: string;
  gallery?: { src: string; alt: string; caption: string }[];
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
      'An internal AI operations and document-processing platform built at NICL, with resilient workflows and role-based views that keep operators in control.',
    status: 'shipped',
    year: '2026',
    tags: ['AI Agents', 'Full-stack', 'Dashboard'],
    stack: ['Python', 'FastAPI', 'React', 'SQLite', 'Azure Document Intelligence', 'Databricks'],
    metrics: [
      { value: 'Azure', label: 'document processing' },
      { value: 'RBAC', label: 'operator views' },
      { value: 'Human', label: 'supervised workflows' },
    ],
    cover: '/evidence/agent-platform-cover.svg',
    alt: 'Abstract workflow diagram showing documents moving through processing, review, and analytics stages',
    gallery: [
      {
        src: '/evidence/agent-processing.svg',
        alt: 'Synthetic processing view with queued, processing, review, and completed document states',
        caption: 'Synthetic workflow reconstruction based on the shipped processing flow; no operational data is shown.',
      },
      {
        src: '/evidence/agent-supervision.svg',
        alt: 'Synthetic role-based operator view showing review and retry controls',
        caption: 'Synthetic operator view illustrating human supervision, retry visibility, and bounded actions.',
      },
      {
        src: '/evidence/agent-analytics.svg',
        alt: 'Synthetic analytics view with local summary cards and an SVG line chart',
        caption: 'Synthetic analytics view reflecting deterministic local calculations and native SVG chart output.',
      },
    ],
    nda: 'Built at NICL. The internal product name, operational data, documents, identifiers, endpoints, prompts, and business details are withheld. Published visuals use synthetic data and describe only verified workflow and technology evidence.',
    study: {
      context:
        'The work focused on an internal platform that turns documents and operational inputs into visible, recoverable workflows. The objective was not autonomous operation at any cost; it was dependable processing with clear operator control.',
      blocks: [
        {
          heading: 'The problem',
          body:
            'Manual, repeatable work spread across multiple tools, with no single view of what was happening. Any automation had to be auditable: the team needed to see what the system decided and why, and be able to step in before anything committed.',
          points: [
            'Documents required structured extraction before downstream use',
            'Batch failures needed to be visible, retryable, and isolated',
            'Different operator roles needed appropriately bounded views',
          ],
        },
        {
          heading: 'Processing architecture',
          body:
            'Python and FastAPI services coordinate processing behind a React interface, with SQLite providing local persistence. Azure Document Intelligence handles document extraction; batch state and retries make failures recoverable instead of silent.',
          points: [
            'Azure Document Intelligence extraction with explicit processing states',
            'Concurrent batch work with retry and per-file failure visibility',
            'SAP and Excel consumption processing through guarded workflows',
            'SQLite-backed state exposed through typed API routes',
          ],
        },
        {
          heading: 'Operator and assistance layers',
          body:
            'The React interface presents role-based workspaces rather than one unrestricted control panel. Databricks-backed assistance sits alongside deterministic local analytics so the product can answer broader questions without giving up predictable totals and chart data.',
          points: [
            'Role-based navigation and operator views',
            'Human-visible review and retry controls',
            'Databricks-backed conversational assistance',
            'Deterministic local analytics rendered as native SVG charts',
          ],
        },
        {
          heading: 'What I took from it',
          body:
            'The useful lesson was that AI capability is only one layer of a production system. Recovery, bounded permissions, deterministic calculations, clear state, and human supervision are what make the surrounding product dependable.',
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
      { value: '12', label: 'live demos' },
      { value: '2', label: 'visual themes' },
      { value: '1', label: 'shared token system' },
    ],
    cover: '/evidence/ui-system-lab.png',
    alt: 'Live portfolio component Lab showing editorial typography, filters, and interactive demo cards',
    gallery: [
      {
        src: '/evidence/ui-system-lab.png',
        alt: 'Screenshot of the live component Lab in this portfolio',
        caption: 'Captured from the live implementation: responsive layouts, shared tokens, motion primitives, and 12 interactive demos.',
      },
    ],
    links: [
      { label: 'Live site', href: 'https://portfoliotemp-phi.vercel.app' },
      { label: 'Source code', href: 'https://github.com/AyanAnees326/portfolio' },
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
