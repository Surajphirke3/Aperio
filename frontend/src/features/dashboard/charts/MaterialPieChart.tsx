'use client';

import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { MATERIAL_COLORS } from '../utils/chartColors';

interface MaterialPieChartProps {
  data: { material: string; quantity_kg: number }[];
}

const FALLBACK_COLORS = ['#2563eb', '#7c3aed', '#16a34a', '#d97706', '#dc2626', '#6b7280'];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { material: string; quantity_kg: number; percent: number } }> }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700">{d.material}</p>
      <p>{d.quantity_kg.toLocaleString()} kg ({(d.percent * 100).toFixed(1)}%)</p>
    </div>
  );
}

export function MaterialPieChart({ data }: MaterialPieChartProps) {
  if (!data.length) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Material Distribution</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No data available</div>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.quantity_kg, 0);
  const chartData = data.map((d) => ({ ...d, percent: total > 0 ? d.quantity_kg / total : 0 }));

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Material Distribution</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="quantity_kg"
            nameKey="material"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            label={((props: { material?: string; percent?: number }) =>
              `${props.material ?? ''} ${((props.percent ?? 0) * 100).toFixed(0)}%`
            ) as unknown as boolean}
            labelLine={{ strokeWidth: 1 }}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.material}
                fill={MATERIAL_COLORS[entry.material] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" className="fill-gray-600 text-sm font-semibold">
            {total.toLocaleString()} kg
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MaterialPieChart;
