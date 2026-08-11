import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Direction the element rises from. */
  from?: 'bottom' | 'left' | 'right' | 'none';
  /** Distance travelled, px. */
  distance?: number;
  once?: boolean;
}

const OFFSETS = {
  bottom: (d: number) => ({ y: d, x: 0 }),
  left: (d: number) => ({ x: -d, y: 0 }),
  right: (d: number) => ({ x: d, y: 0 }),
  none: () => ({ x: 0, y: 0 }),
};

/** Entrance animation on scroll-into-view: fade + rise + slight blur-out. */
export function Reveal({
  children,
  className,
  delay = 0,
  from = 'bottom',
  distance = 28,
  once = true,
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  const offset = OFFSETS[from](distance);

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: 'blur(6px)', ...offset }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', x: 0, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggers direct children of a Reveal-like container.
 * Children must be <RevealItem> for the variants to propagate.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24, filter: 'blur(5px)' },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
