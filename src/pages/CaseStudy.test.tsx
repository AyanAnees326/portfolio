import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import CaseStudy from './CaseStudy';

describe('project evidence', () => {
  it('renders the approved gallery and external links', () => {
    render(<MemoryRouter initialEntries={['/work/ui-system']}><Routes><Route path="/work/:slug" element={<CaseStudy />} /></Routes></MemoryRouter>);
    expect(screen.getByText(/Captured from the live implementation/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Screenshot of the live component Lab/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Source code/ })).toHaveAttribute('href', 'https://github.com/AyanAnees326/portfolio');
  });
});
