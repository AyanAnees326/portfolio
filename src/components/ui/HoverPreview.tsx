import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import { usePointerFine } from '@/hooks/usePointerFine';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface PreviewItem {
  id: string;
  title: string;
  /** Real screenshot once available; falls back to a generated specimen. */
  image?: string;
  caption?: string;
}

/**
 * Floating preview that trails the cursor while a list row is hovered.
 *
 * The classic gallery-site device: the work list stays purely typographic, and
 * the imagery only appears where you are actually looking. Mounted once by the
 * parent list rather than per row, so only one preview can ever be in flight.
 *
 * Until real screenshots exist, `image` is undefined and we draw a paper
 * specimen instead — placeholder, but a deliberate-looking one.
 */
export function HoverPreview({ item }: { item: PreviewItem | null }) {
  const fine = usePointerFine();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const px = useSpring(x, { stiffness: 220, damping: 26, mass: 0.7 });
  const py = useSpring(y, { stiffness: 220, damping: 26, mass: 0.7 });

  useEffect(() => {
    if (!enabled) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key={item.id}
          className="pointer-events-none fixed top-0 left-0 z-[90] w-[min(22rem,32vw)]"
          style={{ x: px, y: py, translateX: '-50%', translateY: '-50%' }}
          initial={{ opacity: 0, scale: 0.94, clipPath: 'inset(0 0 100% 0)' }}
          animate={{ opacity: 1, scale: 1, clipPath: 'inset(0 0 0% 0)' }}
          exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="card overflow-hidden p-1.5">
            {item.image ? (
              <img
                src={item.image}
                alt=""
                className="aspect-[4/3] w-full rounded-[2px] object-cover"
              />
            ) : (
              <Specimen title={item.title} />
            )}
            {item.caption && (
              <p className="px-1.5 py-2 text-[12px] tracking-wide text-ink-3">
                {item.caption}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Placeholder artwork: an abstract wireframe of the kind of interface the
 * project is. Reads as an intentional illustration rather than a broken image,
 * which matters while the real screenshots are still missing.
 */
function Specimen({ title }: { title: string }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] bg-paper-3">
      <div className="absolute inset-0 flex flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="h-1 w-14 rounded-full bg-rule-strong" />
          <span className="ml-auto h-1 w-8 rounded-full bg-rule" />
        </div>

        <div className="mt-2 grid flex-1 grid-cols-3 gap-2">
          <div className="col-span-2 rounded-[2px] border border-rule bg-paper-2" />
          <div className="flex flex-col gap-2">
            <div className="flex-1 rounded-[2px] border border-rule bg-paper-2" />
            <div className="flex-1 rounded-[2px] border border-rule bg-paper-2" />
          </div>
        </div>

        <div className="flex gap-2">
          <span className="h-1 w-1/3 rounded-full bg-rule-strong" />
          <span className="h-1 w-1/4 rounded-full bg-rule" />
        </div>
      </div>

      <span className="absolute right-3 bottom-2.5 font-display text-[13px] text-ink-3">
        {title}
      </span>
    </div>
  );
}
