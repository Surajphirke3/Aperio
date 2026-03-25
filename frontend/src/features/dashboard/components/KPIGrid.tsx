'use client';

import type { DashboardStats } from '../types';
import { KPICard } from './KPICard';
import { formatKg, formatPercentage } from '@/shared/utils/numbers';

interface KPIGridProps {
  stats: DashboardStats;
}

export function KPIGrid({ stats }: KPIGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <KPICard label="Total Input" value={formatKg(stats.totalInput)} />
      <KPICard label="Total Output" value={formatKg(stats.totalOutput)} />
      <KPICard label="Total Loss" value={formatKg(stats.totalLoss)} variant="warning" />
      <KPICard label="Loss %" value={formatPercentage(stats.lossPct)} variant={stats.lossPct > 5 ? 'danger' : 'default'} />
      <KPICard label="Batches" value={stats.batchCount} />
      <KPICard label="Vendors" value={stats.vendorCount} variant="info" />
    </div>
  );
}
