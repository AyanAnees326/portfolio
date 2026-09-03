import { publicProfile } from './publicProfile';

export const site = {
  name: publicProfile.name,
  initials: publicProfile.initials,
  role: publicProfile.role,
  tagline: publicProfile.tagline,

  /** Shown in the hero availability pill. */
  availability: {
    open: true,
    label: 'Open for freelance',
    detail: 'Currently interning',
  },

  location: `${publicProfile.location} · ${publicProfile.remote}`,
  canonicalUrl: publicProfile.canonicalUrl,
  links: publicProfile.contacts,

  /** Typical first-reply time, quoted in the contact section. */
  responseTime: 'within 24 hours',
} as const;

export const NAV_SECTIONS = [
  { id: 'services', label: 'Services' },
  { id: 'lab', label: 'The Lab' },
  { id: 'work', label: 'Work' },
  { id: 'skills', label: 'Skills' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const;
