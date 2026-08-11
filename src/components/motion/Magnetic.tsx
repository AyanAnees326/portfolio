import { useRef, useState, type ReactNode } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePointerFine } from '@/hooks/usePointerFine';

interface MagneticProps {
  children: ReactNode;
  /** How far the element travels toward the cursor, as a fraction of distance. */
  strength?: number;
  /** Pointer distance (px) beyond the element's bounds that still attracts. */
  radius?: number;
  className?: string;
}

/**
 * Pulls its child toward the cursor when the pointer comes near.
 * Used on nav links, buttons and social icons.
 */
export function Magnetic({
  children,
  strength = 0.35,
  radius = 80,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const [active, setActive] = useState(false);

  const spring = { stiffness: 260, damping: 20, mass: 0.4 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  const enabled = !reduced && fine;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    // Falls off with distance so the pull eases in rather than snapping.
    const distance = Math.hypot(dx, dy);
    const reach = Math.max(rect.width, rect.height) / 2 + radius;
    const falloff = Math.max(0, 1 - distance / reach);

    x.set(dx * strength * falloff);
    y.set(dy * strength * falloff);
  }

  function reset() {
    x.set(0);
    y.set(0);
    setActive(false);
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={enabled ? { x, y } : undefined}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={reset}
      animate={enabled && active ? { scale: 1.04 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
