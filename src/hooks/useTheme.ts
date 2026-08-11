import { useCallback, useState } from 'react';

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'portfolio:theme';

function current(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/**
 * Theme state.
 *
 * The initial value is read from the DOM rather than recomputed, because
 * index.html already resolved it before first paint — recomputing here would
 * risk disagreeing with what the user is looking at.
 */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(current);

  // Deliberately does NOT follow prefers-color-scheme. The site is designed
  // light-first; dark is something the visitor opts into, not something their
  // OS decides for them on arrival.

  const apply = useCallback((next: Theme) => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode or blocked storage — the theme still applies for
      // this session, it just won't be remembered.
    }
    setThemeState(next);
  }, []);

  /**
   * Toggle with the ink-flood transition.
   *
   * `origin` is the click point; the new theme is revealed as a circle
   * expanding from there. Falls back to an instant swap when View
   * Transitions is unavailable or motion is reduced.
   */
  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark';

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const supported = 'startViewTransition' in document;

      if (!supported || reduced || !origin) {
        apply(next);
        return;
      }

      const { x, y } = origin;
      // Radius needed to cover the furthest corner from the click point.
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      const transition = (
        document as Document & {
          startViewTransition: (cb: () => void) => { ready: Promise<void> };
        }
      ).startViewTransition(() => apply(next));

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${radius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 620,
              easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
              pseudoElement: '::view-transition-new(root)',
            },
          );
        })
        // `ready` rejects whenever the browser skips the transition — a rapid
        // second click, a backgrounded tab, an overlapping transition. The
        // theme has already been applied by then, so there is nothing to
        // recover; swallowing this just stops an unhandled rejection.
        .catch(() => {});
    },
    [theme, apply],
  );

  return { theme, toggle, setTheme: apply };
}
