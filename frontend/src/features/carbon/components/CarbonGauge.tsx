import { cn } from '@/shared/utils/cn';

interface CarbonGaugeProps {
  net: number;
  total: number;
}

export function CarbonGauge({ net, total }: CarbonGaugeProps) {
  const ratio = total > 0 ? Math.min(net / total, 1) : 0;
  const variant = ratio <= 0.3 ? 'good' : ratio <= 0.7 ? 'fair' : 'poor';

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Net Emission Ratio</h3>
      <div className="h-4 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            variant === 'good' && 'bg-green-500',
            variant === 'fair' && 'bg-yellow-500',
            variant === 'poor' && 'bg-red-500',
          )}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">{(ratio * 100).toFixed(1)}% of total emissions remain after offsets</p>
    </div>
  );
}
