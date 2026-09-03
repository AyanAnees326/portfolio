import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { site } from '@/content/site';
import { techMarquee } from '@/content/skills';
import { Marquee } from '@/components/ui/Marquee';
import { scrollToId } from '@/components/layout/SmoothScroll';

/**
 * Typographic hero.
 *
 * The particle network and gradient mesh are gone. What carries this now is
 * scale, whitespace and a single oxide word, which is what an editorial
 * opening spread does, and it makes the page feel expensive rather than busy.
 */
export function Hero() {
  const line = (text: string, delay: number, accent = false) => (
    <span className="block overflow-hidden">
      <motion.span
        className={accent ? 'inline-block text-accent italic' : 'inline-block'}
        initial={{ y: '108%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );

  return (
    <section
      id="hero"
      className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-between px-6 pt-32 pb-10"
    >
      <div className="flex flex-1 flex-col justify-center">
        {/* Availability */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-10 flex items-center gap-3 border-t border-rule pt-4"
        >
          <span className="h-1.5 w-1.5 animate-[pulse-dot_2.4s_ease-in-out_infinite] rounded-full bg-accent" />
          <span className="eyebrow">{site.availability.label}</span>
        </motion.div>

        <h1 className="text-[clamp(2.75rem,10vw,8.5rem)] leading-[0.92]">
          {line('Web apps,', 0.15)}
          {line('mobile apps,', 0.24)}
          {line('and AI agents.', 0.33, true)}
        </h1>

        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="max-w-lg text-[17px] leading-relaxed text-pretty text-ink-2"
          >
            I&apos;m {site.name.split(' ')[0]}, a developer who builds the whole
            thing: the interface people use, the backend behind it, and the AI
            that does the work nobody wants to do twice.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="flex shrink-0 items-center gap-8"
          >
            <button
              onClick={() => scrollToId('contact')}
              className="link-rule text-[15px] font-medium text-ink"
              data-cursor="HIRE"
            >
              Start a project
            </button>
            <button
              onClick={() => scrollToId('lab')}
              className="link-rule text-[15px] text-ink-2 hover:text-ink"
              data-cursor="VIEW"
            >
              See what I can build
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer strip of the opening spread */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.05 }}
        className="mt-16 border-t border-rule pt-5"
      >
        <div className="flex items-center gap-6">
          <span className="eyebrow hidden shrink-0 sm:block">Built with</span>
          <Marquee speed={55} followScroll className="flex-1">
            {techMarquee.map((t) => (
              <span
                key={t}
                className="px-3 text-[13px] whitespace-nowrap text-ink-3"
              >
                {t}
              </span>
            ))}
          </Marquee>
        </div>

        <button
          onClick={() => scrollToId('services')}
          aria-label="Scroll to services"
          className="mt-6 flex items-center gap-2 text-ink-3 transition-colors hover:text-ink"
        >
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="h-4 w-4" />
          </motion.span>
          <span className="eyebrow">Scroll</span>
        </button>
      </motion.div>
    </section>
  );
}
