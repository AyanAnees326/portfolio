import { useRef, type ReactNode } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePointerFine } from '@/hooks/usePointerFine';

interface Tilt3DProps {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees at the card's corners. */
  max?: number;
  /** Lift toward the viewer on hover, in px. */
  lift?: number;
}

/** Perspective tilt that follows the pointer across the surface. */
export function Tilt3D({ children, className, max = 10, lift = 12 }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = usePointerFine();
  const enabled = !reduced && fine;

  // Normalised pointer position: -0.5 .. 0.5 on each axis.
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 220, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring);
  const z = useSpring(0, spring);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => enabled && z.set(lift)}
      onMouseLeave={() => {
        px.set(0);
        py.set(0);
        z.set(0);
      }}
      style={{ perspective: 900 }}
      className={cn('relative', className)}
    >
      <motion.div
        style={
          enabled
            ? { rotateX, rotateY, translateZ: z, transformStyle: 'preserve-3d' }
            : undefined
        }
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
