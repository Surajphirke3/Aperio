import { AlertTriangle } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import type { BatchAnomaly } from '@/shared/types';

interface Props { alert: BatchAnomaly; }

export function AnomalyAlert({ alert }: Props) {
  const severity = alert.value > alert.threshold * 1.5 ? 'critical' : 'warning';
  return (
    <div className={cn('flex items-start gap-3 px-4 py-3 rounded-lg border', severity === 'critical' ? 'border-red-500/30 bg-red-500/10' : 'border-amber-500/30 bg-amber-500/10')}>
      <AlertTriangle size={14} className={cn('shrink-0 mt-0.5', severity === 'critical' ? 'text-red-400' : 'text-amber-400')} />
      <div>
        <p className="text-xs font-mono text-[var(--text-primary)]">
          {alert.stage}: {alert.value.toFixed(1)} {alert.metric} (threshold: {alert.threshold})
        </p>
        <p className="text-[10px] font-mono text-[var(--text-muted)]">Batch: {alert.batch_id}</p>
      </div>
    </div>
  );
}
