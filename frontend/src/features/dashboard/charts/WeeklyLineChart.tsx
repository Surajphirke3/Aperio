'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface WeeklyLineChartProps {
  data: { week: string; received?: number; processed?: number; dispatched?: number; throughput?: number }[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {entry.value.toLocaleString()} kg
        </p>
      ))}
    </div>
  );
}

export function WeeklyLineChart({ data }: WeeklyLineChartProps) {
  if (!data.length) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Weekly Throughput Trend</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No data available</div>
      </div>
    );
  }

  const hasMultiLine = data[0] && 'received' in data[0];

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Weekly Throughput Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorProcessed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDispatched" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${v}kg`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {hasMultiLine ? (
            <>
              <Area type="monotone" dataKey="received" name="Received" stroke="#22c55e" fill="url(#colorReceived)" strokeWidth={2} />
              <Area type="monotone" dataKey="processed" name="Processed" stroke="#3b82f6" fill="url(#colorProcessed)" strokeWidth={2} />
              <Area type="monotone" dataKey="dispatched" name="Dispatched" stroke="#f97316" fill="url(#colorDispatched)" strokeWidth={2} />
            </>
          ) : (
            <Area type="monotone" dataKey="throughput" name="Throughput" stroke="#22c55e" fill="url(#colorReceived)" strokeWidth={2} />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeeklyLineChart;
