'use client';

interface LossHeatmapProps {
  data: { stage: string; material: string; lossPct: number }[];
}

export function LossHeatmap({ data }: LossHeatmapProps) {
  // TODO: Integrate with a heatmap library
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Loss % by Stage</h3>
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        Heatmap — {data.length} data points
      </div>
    </div>
  );
}
