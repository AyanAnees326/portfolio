import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * Motorcycle easter egg, the page progress hairline redlines.
 *
 * It runs ink for most of the page, then shifts to the reserved redline colour
 * over the last stretch, the way a tacho does approaching the limiter.
 *
 * The pivot forced this change: oxide is now the site's primary accent, so
 * colour alone can no longer mark an easter egg. `--redline` is deliberately
 * hotter and more saturated than oxide so the shift still registers.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  const background = useTransform(
    scrollYProgress,
    [0, 0.9, 0.96, 1],
    ['var(--ink)', 'var(--ink)', 'var(--redline)', 'var(--redline)'],
  );
  const opacity = useTransform(scrollYProgress, [0, 0.02, 0.92, 1], [0, 1, 1, 1]);

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 z-[60] h-[2px] w-full origin-left"
      style={{ scaleX, background, opacity }}
    />
  );
}
