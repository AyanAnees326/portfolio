import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MoveHorizontal } from 'lucide-react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const STEPS = [
  {
    n: '01',
    title: 'Discover',
    what: 'We talk about what you actually need, not what you think you should ask for.',
    get: 'A written scope, a fixed price, and a delivery date.',
  },
  {
    n: '02',
    title: 'Design',
    what: 'I map the screens and flows before writing production code.',
    get: 'Clickable layouts you approve before the build starts.',
  },
  {
    n: '03',
    title: 'Build',
    what: 'I build in visible increments, with a live preview link from day one.',
    get: 'A URL you can check any time, plus an update every few days.',
  },
  {
    n: '04',
    title: 'Ship & support',
    what: 'Deploy, hand over every account and credential, then stay reachable.',
    get: 'The code, the accounts, docs, and 30 days of fixes included.',
  },
];

const AUTO_SPEED = 0.25; // px/frame, a drift, not a carousel
const FRICTION = 0.93; // momentum decay after a drag
const RESUME_DELAY = 2600; // ms of stillness before auto-drift resumes

/**
 * Process, as a horizontal spread.
 *
 * Deliberately does NOT intercept the mouse wheel. An earlier version
 * translated vertical wheel into horizontal travel, which made the page feel
 * like it was fighting the reader, the scrollbar would stall for no visible
 * reason. Vertical scroll now belongs entirely to the page.
 *
 * Sideways movement comes from things that are unambiguously sideways:
 * click-and-drag with momentum, trackpad horizontal swipe, shift+wheel, touch,
 * and arrow keys. Plus a slow auto-drift so the affordance is visible before
 * anyone touches it.
 */
export function Process() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const [progress, setProgress] = useState(0);
  const [touched, setTouched] = useState(false);

  const dirRef = useRef(1);
  const draggingRef = useRef(false);
  const idleUntilRef = useRef(0);
  const velocityRef = useRef(0);
  const momentumRaf = useRef(0);

  const updateProgress = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max <= 0 ? 0 : el.scrollLeft / max);
  }, []);

  /** Pause the drift for a beat after any interaction. */
  const holdIdle = useCallback(() => {
    idleUntilRef.current = performance.now() + RESUME_DELAY;
  }, []);

  /** Slow auto-drift, ping-ponging at the ends. */
  useEffect(() => {
    if (reduced) return;
    let raf = 0;

    const tick = () => {
      const el = trackRef.current;
      const idle = performance.now() < idleUntilRef.current;

      if (el && !draggingRef.current && !idle && velocityRef.current === 0) {
        const max = el.scrollWidth - el.clientWidth;
        if (max > 0) {
          let next = el.scrollLeft + AUTO_SPEED * dirRef.current;
          if (next >= max) {
            next = max;
            dirRef.current = -1;
          } else if (next <= 0) {
            next = 0;
            dirRef.current = 1;
          }
          el.scrollLeft = next;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  /** Click-and-drag with momentum, this is what makes it feel flowy. */
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = trackRef.current;
    if (!el || e.pointerType === 'touch') return; // touch pans natively

    cancelAnimationFrame(momentumRaf.current);
    velocityRef.current = 0;
    draggingRef.current = true;
    setTouched(true);
    holdIdle();

    let lastX = e.clientX;
    let lastT = performance.now();
    const startScroll = el.scrollLeft;
    const startX = e.clientX;

    const move = (ev: PointerEvent) => {
      el.scrollLeft = startScroll - (ev.clientX - startX);

      // Velocity in px/frame, smoothed so a single jittery sample cannot
      // throw the release.
      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      const instant = ((ev.clientX - lastX) / dt) * 16.67;
      velocityRef.current = velocityRef.current * 0.7 + instant * 0.3;
      lastX = ev.clientX;
      lastT = now;
    };

    const up = () => {
      draggingRef.current = false;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      holdIdle();

      // Glide out with friction rather than stopping dead.
      const glide = () => {
        const node = trackRef.current;
        if (!node) return;
        velocityRef.current *= FRICTION;

        if (Math.abs(velocityRef.current) < 0.4) {
          velocityRef.current = 0;
          return;
        }

        const max = node.scrollWidth - node.clientWidth;
        const next = node.scrollLeft - velocityRef.current;
        node.scrollLeft = Math.min(Math.max(next, 0), max);

        // Stop at the ends instead of grinding against them.
        if (node.scrollLeft <= 0 || node.scrollLeft >= max) {
          velocityRef.current = 0;
          return;
        }
        momentumRaf.current = requestAnimationFrame(glide);
      };
      momentumRaf.current = requestAnimationFrame(glide);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  useEffect(() => () => cancelAnimationFrame(momentumRaf.current), []);

  return (
    <section id="process" className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <SectionHeading
          index="05"
          label="Process"
          title={
            <>
              How working together <span className="text-accent italic">actually goes</span>
            </>
          }
          description="The most common worry about hiring a developer is not skill, it is silence. Here is exactly what happens and what you get at each stage."
        />

        <motion.div
          animate={{ opacity: touched ? 0.4 : 1 }}
          transition={{ duration: 0.6 }}
          className="mt-10 flex items-center gap-3 text-ink-3"
        >
          <motion.span
            animate={reduced || touched ? { x: 0 } : { x: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: touched ? 0 : Infinity, ease: 'easeInOut' }}
          >
            <MoveHorizontal className="h-4 w-4" />
          </motion.span>
          <span className="eyebrow">Drag sideways</span>

          <span className="relative ml-2 h-px w-24 overflow-hidden bg-rule sm:w-40">
            <span
              className="absolute inset-y-0 left-0 bg-accent"
              style={{ width: `${Math.max(progress * 100, 5)}%` }}
            />
          </span>

          <span className="text-[12px] tabular-nums">
            {Math.min(STEPS.length, Math.round(progress * (STEPS.length - 1)) + 1)}/{STEPS.length}
          </span>
        </motion.div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateProgress}
        onPointerDown={onPointerDown}
        onPointerEnter={holdIdle}
        onWheel={holdIdle}
        /* Minimal cursor, grab variant: a full labelled disc here sat on top
           of the copy, but the section still needs to say "you can drag
           this", so it gets a compact hand icon that closes into a fist
           on pointerdown, instead of either extreme. */
        data-cursor-minimal="grab"
        role="group"
        aria-label="Process steps, scroll horizontally"
        tabIndex={0}
        className={[
          'scrollbar-none mt-10 flex cursor-grab gap-8 overflow-x-auto px-6 pb-4 sm:gap-12',
          'active:cursor-grabbing',
          // Contain horizontal overscroll so dragging past the end cannot
          // trigger the browser's back-navigation gesture.
          'overscroll-x-contain',
          // The focus ring is a full-width 2px accent rule across the section, so
          // it read as a rendering bug. Keyboard users still get a visible cue
          // from the inset ring below.
          'outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-inset',
          'lg:px-[max(1.5rem,calc((100vw-72rem)/2))]',
        ].join(' ')}
      >
        {STEPS.map((s) => (
          <article
            key={s.n}
            className="flex w-[min(26rem,78vw)] shrink-0 flex-col border-l border-rule pl-6 select-none sm:pl-8"
          >
            <span aria-hidden="true" className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-none text-accent">
              {s.n}
            </span>

            <h3 className="mt-8 text-[clamp(1.6rem,3vw,2.5rem)]">{s.title}</h3>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-2">{s.what}</p>

            <div className="mt-8 border-t border-rule pt-4">
              <p className="eyebrow">You get</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{s.get}</p>
            </div>
          </article>
        ))}

        <div className="flex w-[min(18rem,60vw)] shrink-0 items-center pl-2">
          <p className="flex items-center gap-2 text-[14px] text-ink-3">
            That&apos;s the whole thing
            <ArrowRight className="h-4 w-4" />
          </p>
        </div>
      </div>
    </section>
  );
}
