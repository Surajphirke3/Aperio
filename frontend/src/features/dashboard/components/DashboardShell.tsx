'use client';

import useSWR from 'swr';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useBatches } from '@/features/batches/hooks/useBatches';
import { api } from '@/shared/utils/api';
import type { BatchEntry } from '@/shared/types';
import { KPIGrid } from './KPIGrid';
import { BatchBarChart } from '../charts/BatchBarChart';
import { LossHeatmap } from '../charts/LossHeatmap';
import { MaterialPieChart } from '../charts/MaterialPieChart';
import { MaterialSankey } from '../charts/MaterialSankey';
import type { SankeyData } from '../types';
import { WeeklyLineChart } from '../charts/WeeklyLineChart';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { Card } from '@/shared/ui';

export function DashboardShell() {
  const { stats, isLoading, isError } = useDashboardStats();
  const { batches } = useBatches();
  const { data: sankey } = useSWR<SankeyData>('/v1/stats/sankey', () => api.get<SankeyData>('/v1/stats/sankey'));

  const barData = batches.slice(0, 6).reverse().map((batch) => ({
    name: batch.material,
    input: batch.quantity_kg,
    output: Math.max(batch.quantity_kg - (batch.loss_kg ?? 0), 0),
    loss: batch.loss_kg ?? 0,
  }));
  const lossData = buildLossHeatmap(batches);
  const weeklyData = buildWeeklyTrend(batches);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-4">Batch Throughput</h3>
          <BatchBarChart data={barData} />
        </Card>
        <Card className="p-4">
          <h3 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-4">Weekly Trend</h3>
          <WeeklyLineChart data={weeklyData} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-4">Loss Heatmap</h3>
          <LossHeatmap data={lossData} />
        </Card>
        <Card className="p-4">
          <h3 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-4">Material Flow</h3>
          <MaterialSankey data={sankey ?? { nodes: [], links: [] }} />
        </Card>
      </div>
    </div>
  );
}

function buildLossHeatmap(batches: BatchEntry[]) {
  const stageMap = new Map<string, { total: number; loss: number }>();
  for (const batch of batches) {
    const stage = batch.stage ?? 'collection';
    const current = stageMap.get(stage) ?? { total: 0, loss: 0 };
    current.total += batch.quantity_kg;
    current.loss += batch.loss_kg ?? 0;
    stageMap.set(stage, current);
  }

  return Array.from(stageMap.entries()).map(([stage, values]) => ({
    stage,
    loss_pct: values.total > 0 ? (values.loss / values.total) * 100 : 0,
  }));
}

function buildWeeklyTrend(batches: BatchEntry[]) {
  const weekMap = new Map<string, number>();
  for (const batch of batches) {
    const date = new Date(batch.date || batch.created_at);
    const label = `${date.getFullYear()}-W${getWeekNumber(date)}`;
    weekMap.set(label, (weekMap.get(label) ?? 0) + batch.quantity_kg);
  }

  return Array.from(weekMap.entries()).map(([week, throughput]) => ({
    week,
    throughput,
  }));
}

function getWeekNumber(date: Date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
