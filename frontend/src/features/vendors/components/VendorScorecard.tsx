import { Card } from '@/shared/ui';
import type { VendorInfo } from '../types';

interface Props { vendor: VendorInfo; }

export function VendorScorecard({ vendor }: Props) {
  const avgKg = vendor.entry_count > 0 ? Math.round(vendor.total_kg / vendor.entry_count) : 0;

  return (
    <Card className="p-4 space-y-3">
      <h3 className="text-sm font-mono font-bold text-[var(--text-primary)]">{vendor.name}</h3>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-mono font-bold text-[var(--accent-primary)]">{vendor.total_kg.toLocaleString()}</p>
          <p className="text-[10px] font-mono text-[var(--text-muted)]">Total kg</p>
        </div>
        <div>
          <p className="text-lg font-mono font-bold text-[var(--text-secondary)]">{vendor.entry_count}</p>
          <p className="text-[10px] font-mono text-[var(--text-muted)]">Entries</p>
        </div>
        <div>
          <p className="text-lg font-mono font-bold text-[var(--text-secondary)]">{avgKg}</p>
          <p className="text-[10px] font-mono text-[var(--text-muted)]">Avg kg</p>
        </div>
      </div>
    </Card>
  );
}