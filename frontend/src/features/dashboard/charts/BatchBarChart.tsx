'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface BatchBarChartProps {
  data: { stage: string; quantity_kg: number; loss_kg: number }[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload) return null;
  return (
    <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg text-sm">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color }}>
          {entry.name}: {entry.value}kg
        </p>
      ))}
    </div>
  );
}

export function BatchBarChart({ data }: BatchBarChartProps) {
  if (!data.length) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Stage Input vs Loss</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No data available</div>
      </div>
    );
  }

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
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Input" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Loss" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BatchBarChart;
