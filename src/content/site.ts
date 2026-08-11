/**
 * Identity and global config.
 *
 * ⚠️ PLACEHOLDERS — every value marked TODO needs your real details before
 * launch. They are deliberately concentrated here so filling them in is a
 * five-minute edit to one file, not a hunt through components.
 */
export const site = {
  name: 'Ayan Anees', // TODO: confirm spelling / preferred display name
  initials: 'AA',
  role: 'Full-stack & AI Agent Developer',
  tagline: 'I build web apps, mobile apps, and AI agents that do real work.',

  /** Shown in the hero availability pill. */
  availability: {
    open: true,
    label: 'Open for freelance',
    detail: 'Currently interning',
  },

  location: 'Remote · worldwide', // TODO: add your city if you want local clients

  links: {
    email: 'ayananees326@gmail.com',
    github: 'https://github.com/', // TODO: your GitHub URL
    linkedin: 'https://linkedin.com/in/', // TODO: your LinkedIn URL
    whatsapp: '', // TODO: https://wa.me/<countrycode><number> — leave '' to hide
    resume: '', // TODO: put resume.pdf in /public and set to '/resume.pdf'
  },

  /**
   * Web3Forms access key. Free, no account needed to receive mail.
   * Get one at https://web3forms.com — it is safe to expose publicly by design.
   */
  web3formsKey: '', // TODO

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
