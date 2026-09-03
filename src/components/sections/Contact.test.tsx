import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Contact } from './Contact';

async function completeForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText('Your name'), 'Test Visitor');
  await user.type(screen.getByLabelText('Email'), 'visitor@example.com');
  await user.type(screen.getByLabelText('Tell me about it'), 'A synthetic test enquiry.');
  await user.click(screen.getByRole('button', { name: /Send message/ }));
  return user;
}

describe('contact form states', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('announces a disconnected form without transmitting data', async () => {
    vi.stubEnv('VITE_WEB3FORMS_KEY', '');
    render(<Contact />);
    await completeForm();
    expect(screen.getByRole('status')).toHaveTextContent('Message could not be sent');
    expect(screen.getByText(/form is not connected yet/i)).toBeInTheDocument();
  });

  it('shows submitting and success states for a successful delivery response', async () => {
    vi.stubEnv('VITE_WEB3FORMS_KEY', 'test-key');
    let resolveFetch!: (value: Response) => void;
    vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise((resolve) => { resolveFetch = resolve; }));
    render(<Contact />);
    await completeForm();
    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
    resolveFetch(new Response(JSON.stringify({ success: true }), { status: 200 }));
    expect(await screen.findByRole('heading', { name: 'Message sent' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Message sent successfully');
  });
});
