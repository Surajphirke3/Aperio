import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border)]',
        variant === 'default' && 'bg-[var(--bg-secondary)]',
        variant === 'elevated' && 'bg-[var(--bg-tertiary)]',
        className,
      )}
      {...props}
    />
  );
}