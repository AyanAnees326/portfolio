/**
 * Skill inventory.
 *
 * `level` is deliberately honest rather than flattering. A student claiming
 * "expert" in nine things is the fastest way to lose a technical buyer;
 * "working / comfortable / learning" reads as self-awareness and holds up in
 * an interview. Adjust these to match what you can actually defend on a call.
 */
export type Level = 'working' | 'comfortable' | 'learning';

export const LEVEL_META: Record<Level, { label: string; pct: number; note: string }> = {
  working: {
    label: 'Working',
    pct: 88,
    note: 'Used in shipped projects. Can build with it unsupervised.',
  },
  comfortable: {
    label: 'Comfortable',
    pct: 62,
    note: 'Built real things with it. Occasionally reach for docs.',
  },
  learning: {
    label: 'Learning',
    pct: 34,
    note: 'Actively building with it right now.',
  },
};

export interface Skill {
  name: string;
  level: Level;
  /** Project ids this skill was used in — drives cross-highlighting. */
  usedIn: string[];
  /** Plain-English version for non-technical visitors. */
  plain: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  blurb: string;
  skills: Skill[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    blurb: 'The part your customers actually touch.',
    skills: [
      { name: 'React', level: 'working', usedIn: ['agent-platform', 'ui-system'], plain: 'Builds fast, app-like websites' },
      { name: 'TypeScript', level: 'working', usedIn: ['agent-platform', 'ui-system'], plain: 'Catches bugs before users do' },
      { name: 'Tailwind CSS', level: 'working', usedIn: ['agent-platform', 'ui-system'], plain: 'Consistent, custom styling at speed' },
      { name: 'Framer Motion', level: 'comfortable', usedIn: ['ui-system'], plain: 'Smooth animation and transitions' },
      { name: 'JavaScript', level: 'working', usedIn: ['agent-platform', 'ui-system'], plain: 'The language the web runs on' },
      { name: 'HTML / CSS', level: 'working', usedIn: ['ui-system'], plain: 'Structure and styling fundamentals' },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Agents',
    blurb: 'Software that reasons, calls tools, and does the boring work.',
    skills: [
      { name: 'LLM APIs', level: 'comfortable', usedIn: ['agent-platform'], plain: 'Wiring AI models into real products' },
      { name: 'Agent architecture', level: 'comfortable', usedIn: ['agent-platform'], plain: 'AI that takes actions, not just chats' },
      { name: 'Tool calling', level: 'comfortable', usedIn: ['agent-platform'], plain: 'Letting AI use your existing systems' },
      { name: 'LangChain', level: 'comfortable', usedIn: ['agent-platform'], plain: 'Framework for chaining AI steps together' },
      { name: 'LangGraph', level: 'comfortable', usedIn: ['agent-platform'], plain: 'Agents with branching, loops and state' },
      { name: 'RAG', level: 'comfortable', usedIn: ['agent-platform'], plain: 'AI that answers from your own documents' },
      { name: 'Prompt engineering', level: 'comfortable', usedIn: ['agent-platform'], plain: 'Getting reliable output from models' },
      { name: 'MCP', level: 'comfortable', usedIn: [], plain: 'Standard way to plug tools into AI' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Data',
    blurb: 'The engine room — APIs, databases, and the glue between them.',
    skills: [
      { name: 'Python', level: 'working', usedIn: ['agent-platform'], plain: 'Backend logic and AI workloads' },
      { name: 'Node.js', level: 'comfortable', usedIn: ['agent-platform'], plain: 'JavaScript on the server' },
      { name: 'FastAPI', level: 'comfortable', usedIn: ['agent-platform'], plain: 'Fast, typed Python APIs' },
      { name: 'REST APIs', level: 'working', usedIn: ['agent-platform'], plain: 'How apps talk to each other' },
      { name: 'PostgreSQL', level: 'comfortable', usedIn: ['agent-platform'], plain: 'Reliable relational database' },
      { name: 'MongoDB', level: 'comfortable', usedIn: [], plain: 'Flexible document database' },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    blurb: 'One codebase, both app stores.',
    skills: [
      { name: 'React Native', level: 'comfortable', usedIn: [], plain: 'iOS and Android from one codebase' },
      { name: 'Expo', level: 'comfortable', usedIn: [], plain: 'Faster mobile builds and releases' },
    ],
  },
  {
    id: 'tooling',
    title: 'Tooling & Practice',
    blurb: 'How the work actually gets shipped.',
    skills: [
      { name: 'Git & GitHub', level: 'working', usedIn: ['agent-platform', 'ui-system'], plain: 'Version control and collaboration' },
      { name: 'Vite', level: 'working', usedIn: ['ui-system'], plain: 'Fast builds and dev tooling' },
      { name: 'Docker', level: 'learning', usedIn: [], plain: 'Consistent deploys across machines' },
      { name: 'Figma', level: 'comfortable', usedIn: ['ui-system'], plain: 'Design handoff and prototyping' },
      { name: 'Vercel', level: 'working', usedIn: [], plain: 'Deployment and hosting' },
    ],
  },
];

/** Flat list of stack names for the hero marquee. */
export const techMarquee = [
  'React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Node.js', 'Python',
  'FastAPI', 'PostgreSQL', 'MongoDB', 'React Native', 'Expo', 'LLM APIs',
  'LangChain', 'LangGraph', 'RAG', 'MCP', 'Docker', 'Git', 'Vite', 'Figma',
  'Vercel', 'Framer Motion',
];
