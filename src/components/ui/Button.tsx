import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Magnetic } from '@/components/motion';

type Variant = 'primary' | 'outline' | 'quiet';
type Size = 'sm' | 'md' | 'lg';

/**
 * Editorial buttons: solid ink or a hairline outline. No gradients, no glow.
 * The old violet drop-shadow was the single most "startup" element on the page.
 */
const VARIANTS: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-accent hover:text-on-accent',
  outline: 'border border-rule-strong text-ink hover:border-ink hover:bg-ink hover:text-paper',
  quiet: 'text-ink-2 hover:text-accent',
};

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-6 text-[14px]',
  lg: 'h-13 px-8 text-[15px]',
};

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium ' +
  'transition-colors duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ' +
  'disabled:pointer-events-none disabled:opacity-40';

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  magnetic?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  magnetic = true,
  ...props
}: ButtonProps) {
  const btn = (
    <button className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </button>
  );
  return magnetic ? <Magnetic className="inline-block">{btn}</Magnetic> : btn;
}

interface LinkButtonProps extends ComponentPropsWithoutRef<'a'> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  magnetic?: boolean;
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  magnetic = true,
  ...props
}: LinkButtonProps) {
  const link = (
    <a className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </a>
  );
  return magnetic ? <Magnetic className="inline-block">{link}</Magnetic> : link;
}
