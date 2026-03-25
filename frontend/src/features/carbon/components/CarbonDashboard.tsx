'use client';

import { useCarbon } from '../hooks/useCarbon';
import { CarbonGauge } from './CarbonGauge';
import { LoadingState } from '@/shared/components/LoadingState';
import { formatKg } from '@/shared/utils/numbers';

export function CarbonDashboard() {
  const { summary, isLoading, isError } = useCarbon();

  if (isLoading) return <LoadingState message="Loading carbon data..." />;
  if (isError || !summary) return <div className="text-red-500 p-4">Failed to load carbon data</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Carbon Footprint</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Total Emissions</p>
          <p className="mt-1 text-2xl font-bold">{formatKg(summary.totalEmissions)} CO₂</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Offset Credits</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{formatKg(summary.totalOffset)} CO₂</p>
        </div>
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-500">Net Emissions</p>
          <p className="mt-1 text-2xl font-bold">{formatKg(summary.netEmissions)} CO₂</p>
        </div>
      </div>
      <CarbonGauge net={summary.netEmissions} total={summary.totalEmissions} />
    </div>
  );
}
