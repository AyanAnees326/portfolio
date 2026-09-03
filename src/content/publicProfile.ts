import profileData from './public-profile.json';

export interface PublicContact {
  email: string;
  phone: string;
  github: string;
  whatsapp: string;
  resume: string;
  linkedin?: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  end: string;
}

export interface ExperienceEntry {
  organization: string;
  role: string;
  start: string;
  end: string;
  location: string;
  summary: string;
  approvedFacts: string[];
}

export interface PublicProfile {
  name: string;
  initials: string;
  role: string;
  tagline: string;
  location: string;
  remote: string;
  canonicalUrl: string;
  contacts: PublicContact;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  verifiedFacts: string[];
}

export const publicProfile = profileData satisfies PublicProfile;
