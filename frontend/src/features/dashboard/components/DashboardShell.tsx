'use client';

import { useDashboardStats } from '../hooks/useDashboardStats';
import { KPIGrid } from './KPIGrid';
import { InsightPanel } from './InsightPanel';
import { AnomalyAlert } from './AnomalyAlert';
import { CompletenessScore } from './CompletenessScore';
import { LoadingState } from '@/shared/components/LoadingState';

export function DashboardShell() {
  const { stats, isLoading, isError } = useDashboardStats();

  if (isLoading) return <LoadingState message="Loading dashboard..." />;
  if (isError || !stats) return <div className="p-8 text-red-500">Failed to load dashboard</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <CompletenessScore score={stats.completenessScore} />
      </div>

      {stats.anomalies.length > 0 && <AnomalyAlert anomalies={stats.anomalies} />}

      <KPIGrid stats={stats} />
      <InsightPanel />
    </div>
  );
}
