import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Line-art motorcycle for the About section, the one place the moto theme is
 * allowed to be literal. Strokes draw themselves in on scroll-into-view.
 */
export function BikeSilhouette({ className }: { className?: string }) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: i * 0.15, duration: 1.6, ease: [0.16, 1, 0.3, 1] as const },
        opacity: { delay: i * 0.15, duration: 0.3 },
      },
    }),
  };

  return (
    <motion.svg
      viewBox="0 0 400 200"
      fill="none"
      aria-hidden
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={cn('w-full', className)}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Rear wheel */}
      <motion.circle cx="86" cy="140" r="42" variants={draw} custom={0} />
      <motion.circle cx="86" cy="140" r="14" variants={draw} custom={0.6} />
      {/* Front wheel */}
      <motion.circle cx="316" cy="140" r="42" variants={draw} custom={0.3} />
      <motion.circle cx="316" cy="140" r="14" variants={draw} custom={0.9} />

      {/* Frame */}
      <motion.path
        d="M86 140 L150 92 L232 92 L268 62"
        variants={draw}
        custom={1.1}
      />
      <motion.path d="M150 92 L176 140 L86 140" variants={draw} custom={1.3} />
      <motion.path d="M176 140 L246 132 L232 92" variants={draw} custom={1.5} />

      {/* Tank + seat */}
      <motion.path
        d="M176 92 Q196 68 238 74 L248 92"
        variants={draw}
        custom={1.7}
      />
      <motion.path d="M150 88 Q124 78 108 88" variants={draw} custom={1.9} />

      {/* Forks + bars */}
      <motion.path d="M268 62 L316 140" variants={draw} custom={2.1} />
      <motion.path d="M258 56 L292 62" variants={draw} custom={2.3} />

      {/* Exhaust */}
      <motion.path d="M176 140 L118 156" variants={draw} custom={2.5} />
    </motion.svg>
  );
}
