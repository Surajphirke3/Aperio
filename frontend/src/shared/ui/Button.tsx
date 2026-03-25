import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-mono text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
          variant === 'primary' && 'bg-[var(--accent-primary)] text-black hover:bg-[var(--accent-secondary)]',
          variant === 'secondary' && 'border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]',
          variant === 'ghost' && 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]',
          variant === 'danger' && 'bg-[var(--status-danger)] text-white hover:opacity-90',
          size === 'sm' && 'px-3 py-1.5 text-xs',
          size === 'md' && 'px-4 py-2',
          size === 'lg' && 'px-6 py-3',
          className,
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';