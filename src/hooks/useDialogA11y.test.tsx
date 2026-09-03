import { useCallback, useRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useDialogA11y } from './useDialogA11y';

function Fixture() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDialogA11y(open, close, ref);
  return <><div id="app-content"><button onClick={() => setOpen(true)}>Open</button></div>{open && <div ref={ref} role="dialog"><button>First</button><button onClick={close}>Close</button></div>}</>;
}

describe('dialog accessibility', () => {
  it('traps focus, closes on Escape, and restores focus', async () => {
    const user = userEvent.setup();
    render(<Fixture />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    expect(document.getElementById('app-content')).toHaveProperty('inert', true);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
