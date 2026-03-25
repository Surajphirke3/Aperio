'use client';

interface Props {
  data: Array<{ stage: string; loss_pct: number }>;
}

function getColor(pct: number): string {
  if (pct > 10) return 'var(--status-danger)';
  if (pct > 5) return 'var(--status-warning)';
  if (pct > 2) return 'var(--accent-secondary)';
  return 'var(--accent-muted)';
}

export function LossHeatmap({ data }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {data.map((d) => (
        <div key={d.stage} className="flex flex-col items-center gap-1">
          <div
            className="w-full aspect-square rounded-lg flex items-center justify-center text-xs font-mono font-bold"
            style={{ backgroundColor: getColor(d.loss_pct), color: 'var(--bg-primary)' }}
          >
            {d.loss_pct.toFixed(1)}%
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)] capitalize">{d.stage}</span>
        </div>
      ))}
    </div>
  );
}