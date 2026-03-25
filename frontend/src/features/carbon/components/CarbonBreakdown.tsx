'use client';

import { useCarbon } from '../hooks/useCarbon';
import { CarbonKPI } from './CarbonKPI';
import { CarbonGauge } from './CarbonGauge';

export function CarbonBreakdown() {
  const { summary, isLoading, isError } = useCarbon();

  if (isLoading) return <div className="animate-pulse text-gray-400">Loading carbon data...</div>;
  if (isError) return <div className="text-red-500">Failed to load carbon data</div>;
  if (!summary) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <CarbonKPI label="Total Emissions" value={summary.totalEmissions} unit="kg CO₂" />
        <CarbonKPI label="Total Offset" value={summary.totalOffset} unit="kg CO₂" />
        <CarbonKPI label="Net Emissions" value={summary.netEmissions} unit="kg CO₂" />
      </div>
      <CarbonGauge net={summary.netEmissions} total={summary.totalEmissions} />
    </div>
  );
}
