import { lazy, type LazyExoticComponent, type ComponentType } from 'react';

export type LabCategory = 'Layout' | 'Motion' | 'Data' | 'AI' | 'Forms';

export interface LabDemo {
  id: string;
  title: string;
  category: LabCategory;
  /** The client-facing reason this component earns its place. */
  goodFor: string;
  Component: LazyExoticComponent<ComponentType>;
  /** Some demos need more vertical room than the default card. */
  tall?: boolean;
}

/**
 * Every demo is lazily imported. The Lab is the heaviest part of the site and
 * most visitors never scroll to all twelve — loading them on demand keeps the
 * initial bundle inside budget.
 */
export const labDemos: LabDemo[] = [
  {
    id: 'tilt',
    title: '3D tilt product card',
    category: 'Motion',
    goodFor: 'Product listings and feature cards that need to feel tactile',
    Component: lazy(() => import('./demos/TiltCard')),
  },
  {
    id: 'skins',
    title: 'Live skin switcher',
    category: 'Layout',
    goodFor: 'Seeing your own site in four visual directions before we commit',
    Component: lazy(() => import('./demos/SkinSwitcher')),
    tall: true,
  },
  {
    id: 'dashboard',
    title: 'Live analytics panel',
    category: 'Data',
    goodFor: 'Admin dashboards, reporting views, anything with numbers',
    Component: lazy(() => import('./demos/AnalyticsDashboard')),
    tall: true,
  },
  {
    id: 'magnetic',
    title: 'Magnetic buttons',
    category: 'Motion',
    goodFor: 'Calls to action that pull the eye and the cursor',
    Component: lazy(() => import('./demos/MagneticButtons')),
  },
  {
    id: 'bento',
    title: 'Bento grid',
    category: 'Layout',
    goodFor: 'Feature sections and landing pages with a modern editorial feel',
    Component: lazy(() => import('./demos/BentoGrid')),
  },
  {
    id: 'chat',
    title: 'AI chat with tool calls',
    category: 'AI',
    goodFor: 'Support widgets and sales assistants that answer at 3am',
    Component: lazy(() => import('./demos/ChatWidgetDemo')),
    tall: true,
  },
  {
    id: 'kanban',
    title: 'Drag-to-reorder board',
    category: 'Data',
    goodFor: 'Task boards, priority lists, anything users need to rearrange',
    Component: lazy(() => import('./demos/KanbanBoard')),
  },
  {
    id: 'stepper',
    title: 'Multi-step form',
    category: 'Forms',
    goodFor: 'Onboarding, quote requests and checkout — higher completion rates',
    Component: lazy(() => import('./demos/MultiStepForm')),
  },
  {
    id: 'palette',
    title: 'Command palette (⌘K)',
    category: 'AI',
    goodFor: 'Power users navigating a large app without touching the mouse',
    Component: lazy(() => import('./demos/CommandPaletteDemo')),
  },
  {
    id: 'reveal',
    title: 'Line reveal & letter swap',
    category: 'Motion',
    goodFor: 'Landing pages where copy should land in sequence, not all at once',
    Component: lazy(() => import('./demos/RevealText')),
  },
  {
    id: 'compare',
    title: 'Before / after slider',
    category: 'Layout',
    goodFor: 'Redesigns, renovations, portfolios — proving the change',
    Component: lazy(() => import('./demos/CompareSlider')),
  },
  {
    id: 'marquee',
    title: 'Infinite logo wall',
    category: 'Layout',
    goodFor: 'Social proof — client logos, integrations, press mentions',
    Component: lazy(() => import('./demos/LogoWall')),
  },
];

export const LAB_CATEGORIES: ('All' | LabCategory)[] = [
  'All',
  'Layout',
  'Motion',
  'Data',
  'AI',
  'Forms',
];
