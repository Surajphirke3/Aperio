'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface WeeklyLineChartProps {
  data: { week: string; throughput: number }[];
}

export function WeeklyLineChart({ data }: WeeklyLineChartProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Weekly Throughput Trend</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value) => [`${Number(value)} kg`, 'Throughput']}
            />
            <Line
              type="monotone"
              dataKey="throughput"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
