'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface MaterialPieChartProps {
  data: { material: string; quantity_kg: number }[];
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

export function MaterialPieChart({ data }: MaterialPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.quantity_kg, 0);
  
  const chartData = data.map((item) => ({
    name: item.material,
    value: item.quantity_kg,
    percentage: Math.round((item.quantity_kg / total) * 100),
  }));

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Material Distribution</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              label={({ name, payload }) => `${name}: ${payload.percentage}%`}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${Number(value)} kg`, '']}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {chartData.map((item, idx) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
