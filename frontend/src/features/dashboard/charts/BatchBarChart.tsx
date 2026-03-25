'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface BatchBarChartProps {
  data: { stage: string; quantity_kg: number; loss_kg: number }[];
}

export function BatchBarChart({ data }: BatchBarChartProps) {
  const chartData = data.map((d) => ({
    stage: d.stage.charAt(0).toUpperCase() + d.stage.slice(1),
    Input: d.quantity_kg,
    Loss: d.loss_kg,
  }));

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Stage Input vs Loss</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="stage" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend />
            <Bar dataKey="Input" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Loss" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function BatchBarChart({ data }: BatchBarChartProps) {
  if (!data.length) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Batch Input / Output / Loss</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No data available</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Batch Input / Output / Loss</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="stage" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${v}kg`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="input" name="Input" fill="#22c55e" radius={[4, 4, 0, 0]} />
          <Bar dataKey="output" name="Output" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="loss" name="Loss" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BatchBarChart;
