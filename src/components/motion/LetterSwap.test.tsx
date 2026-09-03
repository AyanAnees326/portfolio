import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LetterSwap } from './LetterSwap';

describe('LetterSwap', () => {
  it('exposes one normal accessible label', () => {
    const { container } = render(<LetterSwap text="Contact" />);
    expect(screen.getByText('Contact')).toHaveClass('sr-only');
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
  });
});
