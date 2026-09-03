import { describe, expect, it } from 'vitest';
import { publicProfile } from './publicProfile';
import { projects } from './projects';
import { personal } from './personal';

describe('canonical public content', () => {
  it('contains only approved public contacts', () => {
    expect(publicProfile.contacts.github).toBe('https://github.com/AyanAnees326');
    expect(publicProfile.contacts.whatsapp).toBe('https://wa.me/923234061107');
    expect(publicProfile.contacts).not.toHaveProperty('linkedin');
  });

  it('keeps internship and education facts aligned', () => {
    expect(publicProfile.experience[0]).toMatchObject({ organization: 'NICL', role: 'AI Intern', end: 'Present' });
    expect(publicProfile.education[0]).toMatchObject({ degree: 'BS Computer Science', end: 'Expected 2027' });
  });

  it('publishes galleries with meaningful alt text and captions', () => {
    for (const project of projects.filter((item) => item.status === 'shipped')) {
      expect(project.cover).toBeTruthy();
      expect(project.alt?.length).toBeGreaterThan(20);
      expect(project.gallery?.length).toBeGreaterThan(0);
      expect(project.gallery?.every((item) => item.alt && item.caption)).toBe(true);
    }
  });

  it('has no personal-content placeholders or invented reading/route categories', () => {
    expect(JSON.stringify(personal)).not.toMatch(/TODO|reading|routes/i);
    expect(JSON.stringify(personal)).toContain('Suzuki Bandit 250');
  });
});
