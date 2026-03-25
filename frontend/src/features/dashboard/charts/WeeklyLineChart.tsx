'use client';

interface WeeklyLineChartProps {
  data: { week: string; throughput: number }[];
}

export function WeeklyLineChart({ data }: WeeklyLineChartProps) {
  // TODO: Integrate with recharts
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Weekly Throughput Trend</h3>
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        Line chart — {data.length} weeks
      </div>
    </div>
  );
}
