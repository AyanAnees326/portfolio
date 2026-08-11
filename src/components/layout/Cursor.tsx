import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { Hand } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePointerFine } from '@/hooks/usePointerFine';

type MinimalMode = 'quiet' | 'grab' | null;

/**
 * Contextual cursor.
 *
 * A small ink dot tracks exactly; a lagging ring springs behind it. Over an
 * element carrying `data-cursor="VIEW"` (etc.) the ring inflates into an oxide
 * disc showing that word — the gallery-site device that tells you what an
 * element will do before you click it.
 *
 * Two elements ask for less than that:
 *   - `data-cursor-minimal` (masthead) — a bare dot, nothing else. The
 *     wordmark needs to stay fully readable, so even a small badge is too much.
 *   - `data-cursor-minimal="grab"` (the Process drag track) — a compact hand
 *     icon that closes into a fist while a drag is in progress. This region
 *     needs an affordance, just a quieter one than the full labelled disc.
 *
 * Read these off the DOM rather than through React state plumbing so any
 * element anywhere — including lazily-mounted Lab demos — can opt in with a
 * single attribute.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const enabled = !reduced && fine;

  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [minimal, setMinimal] = useState<MinimalMode>(null);
  const [grabbing, setGrabbing] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 320, damping: 28, mass: 0.55 });
  const ringY = useSpring(y, { stiffness: 320, damping: 28, mass: 0.55 });

  useEffect(() => {
    if (!enabled) return;
    document.body.style.cursor = 'none';

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);

      const el = e.target as HTMLElement | null;

      // Minimal wins over a label: some regions (the masthead, the drag
      // track) are dense or interactive enough that a 72px labelled disc
      // would cover the very thing you are meant to be looking at.
      const quiet = el?.closest<HTMLElement>('[data-cursor-minimal]');
      const mode: MinimalMode = quiet
        ? quiet.dataset.cursorMinimal === 'grab'
          ? 'grab'
          : 'quiet'
        : null;
      setMinimal(mode);

      const labelled = mode ? null : el?.closest<HTMLElement>('[data-cursor]');
      setLabel(labelled?.dataset.cursor ?? null);
      setHovering(
        !!el?.closest('a, button, [role="button"], input, textarea, select, [data-cursor]'),
      );
    };
    const leave = () => setVisible(false);
    const down = () => setGrabbing(true);
    const up = () => setGrabbing(false);

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', leave);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);
    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  const expanded = !!label;
  const isGrab = minimal === 'grab';
  const isQuiet = minimal === 'quiet';

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      {/* Precise dot — the whole cursor in the plain-minimal region, and a
          steady anchor point everywhere else while the ring lags behind. */}
      <motion.div
        className="absolute h-1.5 w-1.5 rounded-full bg-ink"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible && (isQuiet || (!isGrab && !hovering)) ? 1 : 0 }}
        transition={{ duration: 0.18 }}
      />

      <motion.div
        className="absolute flex items-center justify-center rounded-full border"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isGrab ? 30 : isQuiet ? 16 : expanded ? 72 : hovering ? 46 : 28,
          height: isGrab ? 30 : isQuiet ? 16 : expanded ? 72 : hovering ? 46 : 28,
          scale: isGrab && grabbing ? 0.82 : 1,
          opacity: visible ? (isQuiet ? 0.5 : 1) : 0,
          backgroundColor: isGrab ? 'var(--paper-2)' : expanded ? 'var(--accent)' : 'rgba(0,0,0,0)',
          borderColor: isGrab
            ? 'var(--rule-strong)'
            : expanded
              ? 'rgba(0,0,0,0)'
              : 'var(--rule-strong)',
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      >
        {isGrab && (
          <Hand className="h-3.5 w-3.5 text-ink" strokeWidth={1.75} />
        )}

        <AnimatePresence mode="wait">
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="text-[9px] font-medium tracking-[0.14em] text-on-accent uppercase"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
