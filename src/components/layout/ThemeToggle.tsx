import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';

const NUDGED_KEY = 'portfolio:toggle-nudged';

/**
 * Light/dark switch.
 *
 * Rebuilt simple after the first version, a disc with a sliding crescent
 * "bite" plus retracting rays, read as visual noise at 32px rather than as a
 * sun or a moon. A knob that slides, carrying a clean icon that swaps with a
 * rotate-and-fade, is legible instantly, which is the entire job.
 *
 * It nudges once per tab session shortly after load so visitors discover the
 * dark mode exists. Once only, a control that keeps waving at you is an
 * irritation, not an affordance.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const reduced = useReducedMotion();
  const dark = theme === 'dark';
  const [nudge, setNudge] = useState(false);

  useEffect(() => {
    if (reduced) return;
    try {
      if (sessionStorage.getItem(NUDGED_KEY)) return;
      sessionStorage.setItem(NUDGED_KEY, '1');
    } catch {
      // Storage blocked, nudge anyway; it just repeats on the next load.
    }
    const start = setTimeout(() => setNudge(true), 2000);
    const stop = setTimeout(() => setNudge(false), 3600);
    return () => {
      clearTimeout(start);
      clearTimeout(stop);
    };
  }, [reduced]);

  return (
    <motion.button
      onClick={(e) => {
        setNudge(false);
        const r = e.currentTarget.getBoundingClientRect();
        toggle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }}
      role="switch"
      aria-checked={dark}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}
      title={`Switch to ${dark ? 'light' : 'dark'} theme`}
      animate={nudge ? { rotate: [0, -7, 6, -4, 0] } : { rotate: 0 }}
      transition={nudge ? { duration: 0.8, ease: 'easeInOut' } : { duration: 0.2 }}
      className={cn(
        'relative flex h-8 w-14 shrink-0 items-center rounded-full border border-rule bg-paper-3 p-1',
        'transition-colors duration-500 hover:border-rule-strong',
        className,
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-full bg-ink text-paper',
          dark ? 'ml-auto' : 'ml-0',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={dark ? 'moon' : 'sun'}
            initial={{ opacity: 0, rotate: -70, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 70, scale: 0.5 }}
            transition={{ duration: 0.25 }}
          >
            {dark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          </motion.span>
        </AnimatePresence>
      </motion.span>

      {/* Shine sweep, only during the nudge. */}
      <AnimatePresence>
        {nudge && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.span
              className="absolute inset-y-0 w-7 skew-x-12 bg-accent/30 blur-[4px]"
              initial={{ x: -34 }}
              animate={{ x: 66 }}
              transition={{ duration: 1, ease: 'easeInOut', delay: 0.25 }}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
