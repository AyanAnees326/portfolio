import { useEffect } from 'react';

const SEQUENCE = 'rev';

/**
 * Motorcycle easter egg #5 — type "rev" anywhere on the page.
 *
 * Ignores keystrokes while an input, textarea or contenteditable has focus,
 * so typing "revenue" into the contact form doesn't fire it.
 */
export function useRevEasterEgg(onTrigger: () => void) {
  useEffect(() => {
    let buffer = '';

    function onKey(e: KeyboardEvent) {
      const el = document.activeElement as HTMLElement | null;
      if (
        el &&
        (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
      ) {
        return;
      }
      if (e.key.length !== 1) return;

      buffer = (buffer + e.key.toLowerCase()).slice(-SEQUENCE.length);
      if (buffer === SEQUENCE) {
        buffer = '';
        onTrigger();
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onTrigger]);
}
