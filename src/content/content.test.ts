import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { publicProfile } from './publicProfile';
import { projects, shippedProjects } from './projects';
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

  it('gives every project exactly three metrics with distinct labels', () => {
    // CaseStudy renders these in a hardcoded grid-cols-3. Two leaves a hole,
    // four wraps and the left-border rule only draws right on the first row.
    for (const project of shippedProjects) {
      expect(project.metrics).toHaveLength(3);
      const labels = project.metrics!.map((m) => m.label);
      expect(new Set(labels).size).toBe(3);
    }
  });

  it('keeps React keys unique within a project', () => {
    for (const project of shippedProjects) {
      const headings = project.study!.blocks.map((b) => b.heading);
      expect(new Set(headings).size).toBe(headings.length);
      const srcs = project.gallery!.map((g) => g.src);
      expect(new Set(srcs).size).toBe(srcs.length);
    }
  });

  it('lists every shipped project in the sitemap', () => {
    const sitemap = readFileSync('public/sitemap.xml', 'utf8');
    for (const project of shippedProjects) {
      expect(sitemap).toContain(`/work/${project.slug}<`);
    }
  });

  it('says the data is synthetic wherever work screenshots are published', () => {
    for (const project of shippedProjects.filter((p) => p.nda)) {
      for (const item of project.gallery!) {
        expect(item.caption).toMatch(/invented|fabricated|synthetic|made up|scratch/i);
      }
    }
  });

  it('has no personal-content placeholders or invented reading/route categories', () => {
    expect(JSON.stringify(personal)).not.toMatch(/TODO|reading|routes/i);
    expect(JSON.stringify(personal)).toContain('Suzuki Bandit 250');
  });
});
