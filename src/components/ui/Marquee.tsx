import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useScrollVelocity } from '@/hooks/useScrollVelocity';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full pass. */
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  /** Flip travel direction when the page is scrolled upward. */
  followScroll?: boolean;
  className?: string;
}

/**
 * Infinite horizontal scroll. Children render twice and the track translates
 * -50%, so the loop is seamless with no JS measuring.
 *
 * With `followScroll`, the direction inverts when the reader scrolls up, a
 * small physical touch that makes the strip feel attached to the page rather
 * than animating independently of it.
 */
export function Marquee({
  children,
  speed = 40,
  reverse = false,
  pauseOnHover = true,
  followScroll = false,
  className,
}: MarqueeProps) {
  const { direction } = useScrollVelocity();
  const reduced = useReducedMotion();

  const flipped = followScroll && !reduced ? direction < 0 : false;
  const runsReverse = reverse !== flipped;

  return (
    <div
      className={cn(
        'group relative flex overflow-hidden',
        '[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]',
        className,
      )}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className={cn(
            'flex shrink-0 items-center gap-3 pr-3',
            'animate-[marquee_var(--speed)_linear_infinite]',
            'motion-reduce:animate-none',
            runsReverse && '[animation-direction:reverse]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
          )}
          style={{ '--speed': `${speed}s` } as React.CSSProperties}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
