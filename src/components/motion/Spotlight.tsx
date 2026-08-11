import { useRef, useState, type ReactNode } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/cn';
import { usePointerFine } from '@/hooks/usePointerFine';

interface SpotlightProps {
  children: ReactNode;
  className?: string;
  /** Radius of the glow in px. */
  size?: number;
  color?: string;
}

/**
 * Radial glow that follows the cursor across a surface.
 *
 * Deliberately does NOT gate on reduced-motion: it tracks the pointer rather
 * than animating on its own, so it reads as a lighting effect, not movement.
 * It does gate on pointer:fine — on touch it would just be a stuck blob.
 */
export function Spotlight({
  children,
  className,
  size = 380,
  color = 'rgba(124, 58, 237, 0.16)',
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = usePointerFine();
  const [visible, setVisible] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${mx}px ${my}px, ${color}, transparent 70%)`;

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={cn('relative overflow-hidden', className)}
    >
      {fine && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{ background, opacity: visible ? 1 : 0 }}
        />
      )}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
