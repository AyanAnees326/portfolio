import type { LucideIcon } from 'lucide-react';
import { Globe, Smartphone, Bot, Layers } from 'lucide-react';

export interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  promise: string;
  deliverables: string[];
  timeline: string;
  stack: string[];
  /** Tailwind gradient stops for the card's accent. */
  accent: string;
}

export const services: Service[] = [
  {
    id: 'web',
    icon: Globe,
    title: 'Web Development',
    promise:
      'Marketing sites and full web apps that load fast, work on every screen, and turn visitors into enquiries.',
    deliverables: [
      'Responsive design, mobile-first',
      'CMS or dashboard so you can edit content yourself',
      'SEO, analytics and performance tuning',
      'Deployment, domain setup and handover docs',
    ],
    timeline: '1–4 weeks',
    stack: ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Node'],
    accent: 'from-violet/30 to-indigo/10',
  },
  {
    id: 'app',
    icon: Smartphone,
    title: 'App Development',
    promise:
      'Cross-platform mobile apps from one codebase: iOS and Android, native feel, no duplicated work.',
    deliverables: [
      'React Native app for both platforms',
      'Offline support and push notifications',
      'Backend API and database',
      'App Store / Play Store submission support',
    ],
    timeline: '3–8 weeks',
    stack: ['React Native', 'Expo', 'TypeScript', 'Supabase'],
    accent: 'from-cyan/25 to-violet/10',
  },
  {
    id: 'agents',
    icon: Bot,
    title: 'AI Agents & Automation',
    promise:
      'Agents that actually touch your systems: reading your data, calling your tools, and doing the repetitive work.',
    deliverables: [
      'Custom agent wired to your tools and data',
      'RAG over your documents and knowledge base',
      'Operator dashboard to watch and correct it',
      'Cost controls, guardrails and evaluation',
    ],
    timeline: '2–6 weeks',
    stack: ['Python', 'LLM APIs', 'RAG', 'MCP', 'FastAPI'],
    accent: 'from-indigo/30 to-cyan/10',
  },
  {
    id: 'uiux',
    icon: Layers,
    title: 'UI/UX Engineering',
    promise:
      'The polish layer: design systems, animation and interaction work that makes a product feel expensive.',
    deliverables: [
      'Reusable component library',
      'Design tokens and theming',
      'Motion and micro-interaction design',
      'Accessibility and keyboard-navigation pass',
    ],
    timeline: '1–3 weeks',
    stack: ['React', 'Tailwind', 'Framer Motion', 'Figma'],
    accent: 'from-violet/25 to-cyan/10',
  },
];
