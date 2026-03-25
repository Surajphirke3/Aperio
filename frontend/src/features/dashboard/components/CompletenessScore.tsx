import { cn } from '@/shared/utils/cn';

interface CompletenessScoreProps {
  score: number;
}

export function CompletenessScore({ score }: CompletenessScoreProps) {
  const variant = score >= 80 ? 'good' : score >= 50 ? 'fair' : 'poor';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
        variant === 'good' && 'bg-green-100 text-green-800',
        variant === 'fair' && 'bg-yellow-100 text-yellow-800',
        variant === 'poor' && 'bg-red-100 text-red-800',
      )}
    >
      <span>Data Completeness: {score}%</span>
    </div>
  );
}
