import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Seo } from './Seo';

describe('route metadata', () => {
  it('sets a project-specific title, description, and canonical URL', () => {
    render(<MemoryRouter initialEntries={['/work/agent-platform']}><Seo /></MemoryRouter>);
    expect(document.title).toContain('Invoice and Purchase Order Pipeline');
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toContain('NICL');
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe('https://portfolio-tau-tan-99.vercel.app/work/agent-platform');
  });
});
