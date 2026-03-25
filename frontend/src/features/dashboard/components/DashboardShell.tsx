'use client';

import { useDashboardStats } from '../hooks/useDashboardStats';
import { KPIGrid } from './KPIGrid';
import { MaterialPieChart } from '../charts/MaterialPieChart';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { Card } from '@/shared/ui';

export function DashboardShell() {
  const { stats, isLoading, isError } = useDashboardStats();

  if (isLoading) return <div className="p-6"><LoadingSkeleton count={4} /></div>;
  if (isError || !stats) return <div className="p-6 text-[var(--text-muted)] font-mono text-sm">Failed to load dashboard data.</div>;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--text-primary)]">Dashboard</h1>
        <p className="text-sm font-mono text-[var(--text-muted)]">Material traceability overview</p>
      </div>

      <KPIGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-4">Material Distribution</h3>
          <MaterialPieChart data={stats.by_material} />
        </Card>
        <Card className="p-4">
          <h3 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-4">Stage Distribution</h3>
          <MaterialPieChart data={stats.by_stage} />
        </Card>
      </div>
    </div>
  );
}