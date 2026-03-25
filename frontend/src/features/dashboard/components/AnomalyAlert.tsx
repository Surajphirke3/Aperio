import type { AnomalyFlag } from '@/shared/types';
import { cn } from '@/shared/utils/cn';

interface AnomalyAlertProps {
  anomalies: AnomalyFlag[];
}

export function AnomalyAlert({ anomalies }: AnomalyAlertProps) {
  const critical = anomalies.filter((a) => a.severity === 'critical');
  const warnings = anomalies.filter((a) => a.severity === 'warning');

  return (
    <div className="space-y-2">
      {critical.map((a) => (
        <div key={`${a.batch_id}-${a.stage}`} className={cn('rounded-lg border border-red-200 bg-red-50 px-4 py-3')}>
          <span className="text-sm font-medium text-red-800">
            Critical: Batch {a.batch_id} — {a.stage} stage loss {a.loss_pct.toFixed(1)}% (threshold: {a.threshold_pct}%)
          </span>
        </div>
      ))}
      {warnings.map((a) => (
        <div key={`${a.batch_id}-${a.stage}`} className={cn('rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3')}>
          <span className="text-sm font-medium text-yellow-800">
            Warning: Batch {a.batch_id} — {a.stage} stage loss {a.loss_pct.toFixed(1)}% (threshold: {a.threshold_pct}%)
          </span>
        </div>
      ))}
    </div>
  );
}
