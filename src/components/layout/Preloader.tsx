import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wheel } from '@/components/ui/Wheel';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { site } from '@/content/site';

const SEEN_KEY = 'portfolio:preloaded';

/**
 * Title-page curtain. Shown once per tab session — a preloader you sit through
 * on every navigation is an annoyance, not an experience.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(() => {
    if (typeof window === 'undefined') return true;
    return sessionStorage.getItem(SEEN_KEY) === '1';
  });
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (done) return;

    if (reduced) {
      sessionStorage.setItem(SEEN_KEY, '1');
      setDone(true);
      return;
    }

    document.body.style.overflow = 'hidden';
    const start = performance.now();
    const DURATION = 1000;

    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem(SEEN_KEY, '1');
        setDone(true);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = '';
    };
  }, [done, reduced]);

  useEffect(() => {
    if (done) document.body.style.overflow = '';
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col justify-between bg-paper px-8 py-10"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-center justify-between">
            <Wheel className="h-7 w-7 text-ink" spinning />
            <span className="eyebrow tabular-nums">{String(pct).padStart(3, '0')}</span>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.5rem,9vw,7rem)]"
            >
              {site.name}
            </motion.h1>
          </div>

          <div className="flex items-end justify-between gap-6">
            <span className="eyebrow max-w-[16rem]">{site.role}</span>
            <div className="h-px flex-1 max-w-md overflow-hidden bg-rule">
              <motion.div className="h-full bg-ink" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
