import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider',
        variant === 'default' && 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]',
        variant === 'success' && 'bg-[var(--accent-muted)] text-[var(--accent-primary)]',
        variant === 'warning' && 'bg-amber-500/20 text-amber-400',
        variant === 'danger' && 'bg-red-500/20 text-red-400',
        variant === 'info' && 'bg-blue-500/20 text-blue-400',
        className,
      )}
      {...props}
    />
  );
}