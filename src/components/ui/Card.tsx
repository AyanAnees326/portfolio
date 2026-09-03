import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Recessed surface for code wells and insets. */
  inset?: boolean;
  /** Lifts on hover, only for cards that are actually clickable. */
  interactive?: boolean;
  as?: 'div' | 'article' | 'section' | 'li';
}

/**
 * The one surface used across the site.
 *
 * Replaces the old GlassCard. Frosted translucency reads as a dark-UI trick and
 * looks muddy on paper, depth here comes from a hairline border and a soft,
 * wide shadow instead.
 */
export function Card({
  children,
  className,
  inset = false,
  interactive = false,
  as: Tag = 'div',
}: CardProps) {
  return (
    <Tag
      className={cn(
        inset ? 'card-inset' : 'card',
        interactive &&
          'transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
