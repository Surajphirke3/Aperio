'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  data: Array<{ week: string; throughput: number }>;
}

export function WeeklyLineChart({ data }: Props) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} />
          <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)' }} />
          <Line type="monotone" dataKey="throughput" stroke="var(--accent-primary)" strokeWidth={2} dot={{ fill: 'var(--accent-primary)', r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}