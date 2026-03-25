'use client';

import { KPICard } from './KPICard';
import type { DashboardStats } from '@/shared/types';
import type { KPIMetric } from '../types';

interface Props {
  stats: DashboardStats;
}

export function KPIGrid({ stats }: Props) {
  const totalKg = Object.values(stats.by_material).reduce((a, b) => a + b, 0);
  const metrics: KPIMetric[] = [
    { label: 'Total Entries', value: stats.total_entries },
    { label: 'Total Material', value: `${Math.round(totalKg).toLocaleString()}`, unit: 'kg' },
    { label: 'Dispatched', value: `${Math.round(stats.total_dispatched_kg).toLocaleString()}`, unit: 'kg' },
    { label: 'Material Types', value: Object.keys(stats.by_material).length },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <KPICard key={m.label} metric={m} />
      ))}
    </div>
  );
}