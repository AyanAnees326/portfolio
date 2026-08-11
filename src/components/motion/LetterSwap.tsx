import { cn } from '@/lib/cn';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Letter-swap hover: the word slides up and out while an identical copy slides
 * in from below, letter by letter.
 *
 * Replaces the old ScrambleText, which decoded text with random glyphs — a
 * pure "hacker terminal" effect that fought the editorial direction.
 *
 * Both copies stay in the DOM but only one is exposed to assistive tech, so
 * screen readers hear the word once.
 */
export function LetterSwap({
  text,
  className,
  stagger = 0.022,
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <span className={className}>{text}</span>;

  const letters = text.split('');

  const row = (hidden: boolean) => (
    <span
      aria-hidden={hidden}
      className={cn('flex', hidden && 'absolute inset-0')}
    >
      {letters.map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className={cn(
            'inline-block transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            hidden
              ? 'translate-y-full group-hover:translate-y-0'
              : 'group-hover:-translate-y-full',
          )}
          style={{ transitionDelay: `${i * stagger}s` }}
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );

  return (
    <span className={cn('group relative inline-flex overflow-hidden', className)}>
      {row(false)}
      {row(true)}
    </span>
  );
}
