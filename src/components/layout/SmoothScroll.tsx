import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** Shared instance so anchor links and the command palette can drive scroll. */
let lenisInstance: Lenis | null = null;

/** Scroll to an element by id, falling back to native scroll when Lenis is off. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -80 });
  } else {
    el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }
}

export function scrollToTop() {
  if (lenisInstance) lenisInstance.scrollTo(0);
  else window.scrollTo({ top: 0 });
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    // Smooth scroll IS motion. If the user asked for less of it, don't
    // hijack their scrolling at all.
    if (reduced) {
      lenisInstance = null;
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });
    lenisInstance = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [reduced]);

  return <>{children}</>;
}
