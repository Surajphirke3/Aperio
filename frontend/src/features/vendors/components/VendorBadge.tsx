import { cn } from '@/shared/utils/cn';

interface VendorBadgeProps {
  score: number;
}

export function VendorBadge({ score }: VendorBadgeProps) {
  const variant = score >= 80 ? 'good' : score >= 50 ? 'fair' : 'poor';

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        variant === 'good' && 'bg-green-100 text-green-800',
        variant === 'fair' && 'bg-yellow-100 text-yellow-800',
        variant === 'poor' && 'bg-red-100 text-red-800',
      )}
    >
      {score}%
    </span>
  );
}
