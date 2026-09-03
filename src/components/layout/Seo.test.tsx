import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Seo } from './Seo';

describe('route metadata', () => {
  it('sets a project-specific title, description, and canonical URL', () => {
    render(<MemoryRouter initialEntries={['/work/agent-platform']}><Seo /></MemoryRouter>);
    expect(document.title).toContain('Agentic Operations Platform');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain('NICL');
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe('https://portfoliotemp-phi.vercel.app/work/agent-platform');
  });
});
