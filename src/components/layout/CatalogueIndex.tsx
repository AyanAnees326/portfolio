import { motion } from 'framer-motion';
import { NAV_SECTIONS } from '@/content/site';
import { useSectionObserver } from '@/hooks/useSectionObserver';
import { scrollToId } from './SmoothScroll';
import { cn } from '@/lib/cn';

const IDS = NAV_SECTIONS.map((s) => s.id);

/**
 * Gallery catalogue index, a fixed left rail of numbered sections with the
 * current one marked in oxide.
 *
 * Only on very wide screens, where the margin exists to hold it without
 * crowding the measure. Hidden from assistive tech: it duplicates the nav,
 * which is already a proper landmark.
 */
export function CatalogueIndex() {
  const active = useSectionObserver(IDS);

  return (
    <nav
      aria-hidden
      className="pointer-events-none fixed top-1/2 left-6 z-30 hidden -translate-y-1/2 2xl:block"
    >
      <ul className="flex flex-col gap-3">
        {NAV_SECTIONS.map((s, i) => {
          const on = active === s.id;
          return (
            <li key={s.id} className="pointer-events-auto">
              <button
                onClick={() => scrollToId(s.id)}
                className="group flex items-center gap-3 text-left"
                tabIndex={-1}
              >
                <span
                  className={cn(
                    'w-6 text-[10px] tabular-nums transition-colors duration-400',
                    on ? 'text-accent' : 'text-ink-3',
                  )}
                >
                  ({String(i + 1).padStart(2, '0')})
                </span>

                <span className="relative h-px w-6 overflow-hidden bg-rule">
                  <motion.span
                    className="absolute inset-0 origin-left bg-accent"
                    animate={{ scaleX: on ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>

                <span
                  className={cn(
                    'text-[11px] tracking-[0.12em] uppercase transition-all duration-400',
                    on
                      ? 'text-ink opacity-100'
                      : 'text-ink-3 opacity-0 group-hover:opacity-100',
                  )}
                >
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
