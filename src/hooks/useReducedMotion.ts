import { useEffect, useState } from 'react';

/**
 * Single source of truth for motion preference.
 *
 * Framer Motion ships its own `useReducedMotion`, but we need the same answer
 * in plain-DOM code (the cursor, the particle canvas, Lenis), so everything
 * reads this one hook instead of two different mechanisms disagreeing.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
