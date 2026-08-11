import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NAV_SECTIONS, site } from '@/content/site';
import { useSectionObserver } from '@/hooks/useSectionObserver';
import { LetterSwap } from '@/components/motion';
import { Wheel } from '@/components/ui/Wheel';
import { ThemeToggle } from './ThemeToggle';
import { scrollToId, scrollToTop } from './SmoothScroll';
import { cn } from '@/lib/cn';

const SECTION_IDS = NAV_SECTIONS.map((s) => s.id);

/**
 * Masthead.
 *
 * Full-width with a hairline underneath rather than a floating glass pill —
 * a masthead is what a publication has, and it makes the page feel like a
 * printed spread rather than an app shell.
 */
export function Nav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const active = useSectionObserver(onHome ? SECTION_IDS : []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function go(id: string) {
    setOpen(false);
    if (onHome) {
      scrollToId(id);
    } else {
      navigate('/');
      setTimeout(() => scrollToId(id), 80);
    }
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 right-0 left-0 z-50 transition-colors duration-500',
          scrolled ? 'border-b border-rule bg-paper/85 backdrop-blur-sm' : 'border-b border-transparent',
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Masthead. data-cursor-minimal shrinks the custom cursor to a dot
              here — a labelled disc would sit right on top of the wordmark,
              which is the one thing that must stay readable. */}
          <div className="group/mast relative flex items-center" data-cursor-minimal>
            <button
              onClick={() => (onHome ? scrollToTop() : navigate('/'))}
              className="group flex items-center gap-2.5"
              aria-label="Back to top"
            >
              <Wheel className="h-10 w-10 shrink-0 text-ink transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-180" />
              <span className="font-display text-[26px] leading-none whitespace-nowrap">
                {site.name}
              </span>
            </button>

            {/* The hidden door. Appears only on masthead hover — findable,
                but not advertised. Keyboard users get it via focus-within. */}
            <Link
              to="/garage"
              className={cn(
                'ml-3 flex shrink-0 items-center gap-1 overflow-hidden whitespace-nowrap',
                'text-[12px] text-accent',
                'max-w-0 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                'group-hover/mast:max-w-[10rem] group-hover/mast:opacity-100',
                'focus-visible:max-w-[10rem] focus-visible:opacity-100',
              )}
              tabIndex={0}
            >
              <span className="h-px w-4 bg-accent" />
              the garage
            </Link>
          </div>

          {/* The link row needs real room — at md it collides with the
              actions cluster, so it only appears from lg up. */}
          <div className="hidden items-center gap-6 lg:flex">
            {NAV_SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className={cn(
                  'relative py-1 text-[13px] tracking-wide transition-colors duration-300',
                  active === s.id && onHome ? 'text-accent' : 'text-ink-2 hover:text-ink',
                )}
              >
                <LetterSwap text={s.label} />
                {active === s.id && onHome && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 h-px w-full bg-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-4">
            <button
              onClick={onOpenPalette}
              className="hidden text-[13px] whitespace-nowrap text-ink-3 transition-colors hover:text-ink lg:block"
              aria-label="Open command palette"
              data-cursor="OPEN"
            >
              Search
            </button>

            <ThemeToggle />

            <button
              onClick={() => go('contact')}
              className="hidden rounded-full bg-ink px-5 py-2 text-[13px] font-medium whitespace-nowrap text-paper transition-colors duration-400 hover:bg-accent hover:text-on-accent sm:block"
            >
              Start a project
            </button>

            <button
              onClick={() => setOpen((v) => !v)}
              className="text-ink-2 lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-1 bg-paper px-8 lg:hidden"
          >
            {NAV_SECTIONS.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => go(s.id)}
                className="flex items-baseline gap-4 border-b border-rule py-3 text-left"
              >
                <span className="eyebrow w-8">({String(i + 1).padStart(2, '0')})</span>
                <span className="font-display text-[2rem]">{s.label}</span>
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => go('contact')}
              className="mt-8 rounded-full bg-ink py-3.5 font-medium text-paper"
            >
              Start a project
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
