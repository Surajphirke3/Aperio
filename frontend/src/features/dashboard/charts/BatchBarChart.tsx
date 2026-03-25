'use client';

interface BatchBarChartProps {
  data: { stage: string; input: number; output: number; loss: number }[];
}

export function BatchBarChart({ data }: BatchBarChartProps) {
  // TODO: Integrate with recharts
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Batch Input / Output / Loss</h3>
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        Bar chart — {data.length} stages
      </div>
    </div>
  );
}
