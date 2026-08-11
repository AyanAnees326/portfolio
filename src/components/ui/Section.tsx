import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** Consistent vertical rhythm and max-width for every top-level section. */
export function Section({
  id,
  children,
  className,
  wide = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative mx-auto w-full px-6 py-20 sm:py-28',
        wide ? 'max-w-7xl' : 'max-w-6xl',
        className,
      )}
    >
      {children}
    </section>
  );
}
