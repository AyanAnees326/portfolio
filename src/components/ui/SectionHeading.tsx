import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Reveal } from '@/components/motion';

interface SectionHeadingProps {
  /** Catalogue number, e.g. "02". Rendered as (02). */
  index?: string;
  /** Short label beside the number, e.g. "The Lab". */
  label?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

/**
 * Editorial section header: a hairline rule, a catalogue number, then a large
 * serif title. The rule above the heading is the main structural device on the
 * page, it does the work the old glass panels were doing.
 */
export function SectionHeading({
  index,
  label,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col', align === 'center' && 'items-center text-center', className)}>
      {(index || label) && (
        <Reveal from="none">
          <div className="mb-8 flex items-baseline gap-4 border-t border-rule pt-4">
            {index && <span className="eyebrow text-accent">({index})</span>}
            {label && <span className="eyebrow">{label}</span>}
          </div>
        </Reveal>
      )}

      <Reveal delay={0.05}>
        <h2 className="max-w-4xl text-[clamp(2.25rem,5.5vw,4.25rem)] text-balance">
          {title}
        </h2>
      </Reveal>

      {description && (
        <Reveal delay={0.12}>
          <p
            className={cn(
              'mt-6 max-w-xl text-[17px] leading-relaxed text-pretty text-ink-2',
              align === 'center' && 'mx-auto',
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
