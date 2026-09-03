import { cn } from '@/lib/cn';

/**
 * Section divider drawn as a drive chain.
 *
 * The pivot made this better, not worse: in an editorial layout a hairline
 * rule between sections is expected, so this reads as a normal rule at a
 * glance and only resolves into chain links when you actually look at it,
 * which is exactly what an easter egg should do.
 */
export function ChainDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none mx-auto w-full max-w-6xl overflow-hidden px-6 opacity-30',
        className,
      )}
    >
      <svg height="14" width="100%" className="text-ink-3">
        <defs>
          <pattern id="chain" width="34" height="14" patternUnits="userSpaceOnUse">
            <rect
              x="1"
              y="3.5"
              width="22"
              height="7"
              rx="3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
            />
            <circle cx="5.5" cy="7" r="1.5" fill="currentColor" />
            <circle cx="18.5" cy="7" r="1.5" fill="currentColor" />
            <rect
              x="12"
              y="5"
              width="21"
              height="4"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
            />
          </pattern>
          <linearGradient id="chainFade" x1="0" x2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="30%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="chainMask">
            <rect width="100%" height="14" fill="url(#chainFade)" />
          </mask>
        </defs>
        <rect width="100%" height="14" fill="url(#chain)" mask="url(#chainMask)" />
      </svg>
    </div>
  );
}
