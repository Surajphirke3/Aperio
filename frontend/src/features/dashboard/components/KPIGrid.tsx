'use client';

import type { DashboardStats } from '../types';
import { KPICard } from './KPICard';
import { formatKg, formatPercentage } from '@/shared/utils/numbers';

interface KPIGridProps {
  stats: DashboardStats;
}

export function KPIGrid({ stats }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard label="Total Input" value={formatKg(stats.totalInput)} />
      <KPICard label="Total Output" value={formatKg(stats.totalOutput)} />
      <KPICard label="Total Loss" value={formatKg(stats.totalLoss)} variant="warning" />
      <KPICard label="Loss %" value={formatPercentage(stats.lossPct)} variant={stats.lossPct > 5 ? 'danger' : 'default'} />
    </div>
  );
}
