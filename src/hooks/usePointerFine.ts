import { useEffect, useState } from 'react';

/**
 * True only for devices with a precise pointer (mouse/trackpad).
 *
 * Hover-driven effects (the custom cursor, magnetic pull, spotlight, 3D tilt)
 * are actively bad on touch: they fire on tap and leave elements stuck in a
 * hover state. Every such effect gates on this.
 */
export function usePointerFine() {
  const [fine, setFine] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: fine)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return fine;
}
