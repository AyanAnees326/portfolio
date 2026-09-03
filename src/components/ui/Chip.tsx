import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Small metadata tag. Sans rather than mono, dropping monospace from labels
 * is most of what separates "editorial" from "developer tool".
 */
export function Chip({
  children,
  className,
  active = false,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? 'button' : 'span';
  return (
    <Tag
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1',
        'text-[12px] tracking-wide transition-colors duration-300',
        active
          ? 'border-accent bg-accent text-on-accent'
          : 'border-rule text-ink-3',
        onClick && !active && 'cursor-pointer hover:border-ink hover:text-ink',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
