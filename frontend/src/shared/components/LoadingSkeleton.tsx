import { cn } from '@/shared/utils/cn';

interface Props { className?: string; count?: number; }

export function LoadingSkeleton({ className, count = 3 }: Props) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn('h-4 rounded bg-[var(--bg-tertiary)] animate-pulse', i === count - 1 && 'w-2/3', className)} />
      ))}
    </div>
  );
}