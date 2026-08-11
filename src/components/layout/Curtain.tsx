import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getProject } from '@/content/projects';

/**
 * Route curtain.
 *
 * On navigation to a case study an oxide panel sweeps down carrying the
 * project title in reversed serif, then lifts to reveal the page. Editorial
 * equivalent of a page turn.
 *
 * Driven off pathname changes rather than click handlers so it fires for
 * back/forward and command-palette navigation too.
 */
export function Curtain() {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const [showing, setShowing] = useState<string | null>(null);

  useEffect(() => {
    if (reduced) return;

    const match = pathname.match(/^\/work\/(.+)$/);
    if (!match) return;

    const project = getProject(match[1]);
    setShowing(project?.title ?? null);

    const t = setTimeout(() => setShowing(null), 900);
    return () => clearTimeout(t);
  }, [pathname, reduced]);

  return (
    <AnimatePresence>
      {showing && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[130] flex items-center justify-center bg-accent"
          initial={{ y: '-100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.18, duration: 0.35 }}
            className="px-8 text-center font-display text-[clamp(2rem,6vw,4rem)] text-on-accent"
          >
            {showing}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
