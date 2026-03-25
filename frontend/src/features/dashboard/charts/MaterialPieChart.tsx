'use client';

interface MaterialPieChartProps {
  data: { material: string; quantity_kg: number }[];
}

export function MaterialPieChart({ data }: MaterialPieChartProps) {
  // TODO: Integrate with recharts
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Material Distribution</h3>
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        Pie chart — {data.length} materials
      </div>
    </div>
  );
}
