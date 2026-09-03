import { useEffect, useState } from 'react';
import { useMotionValue, useSpring, useVelocity, useScroll, useTransform } from 'framer-motion';

/**
 * Scroll velocity, exposed two ways:
 *   - `skew`  a springy motion value in degrees, for the velocity-skew effect
 *   - `direction` 1 when scrolling down, -1 when scrolling up
 *
 * The skew is what makes scrolling feel physical rather than mechanical, it's
 * the effect people notice without being able to name.
 */
export function useScrollVelocity(maxSkew = 2.5) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 240, damping: 42, mass: 0.6 });

  // ±2000px/s maps to the full skew range; beyond that it clamps.
  const skew = useTransform(smooth, [-2000, 0, 2000], [maxSkew, 0, -maxSkew], {
    clamp: true,
  });

  const [direction, setDirection] = useState(1);
  useEffect(() => velocity.on('change', (v) => {
    if (Math.abs(v) > 40) setDirection(v > 0 ? 1 : -1);
  }), [velocity]);

  return { skew, direction };
}

/** Static motion value of 0, used to disable skew under reduced motion. */
export function useZero() {
  return useMotionValue(0);
}
