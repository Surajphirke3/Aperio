import { Card } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import type { KPIMetric } from '../types';

interface Props {
  metric: KPIMetric;
}

export function KPICard({ metric }: Props) {
  return (
    <Card className="p-4 space-y-2">
      <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">{metric.label}</p>
      <p className="text-2xl font-mono font-bold text-[var(--text-primary)]">
        {metric.value}
        {metric.unit && <span className="text-sm text-[var(--text-muted)] ml-1">{metric.unit}</span>}
      </p>
      {metric.change !== undefined && (
        <p className={cn('text-xs font-mono', metric.change >= 0 ? 'text-[var(--accent-primary)]' : 'text-[var(--status-danger)]')}>
          {metric.change >= 0 ? '+' : ''}{metric.change}%
        </p>
      )}
    </Card>
  );
}