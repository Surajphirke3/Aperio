'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  data: Array<{ name: string; input: number; output: number; loss: number }>;
}

export function BatchBarChart({ data }: Props) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} />
          <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }} />
          <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)' }} />
          <Bar dataKey="input" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="output" fill="var(--accent-secondary)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="loss" fill="var(--status-danger)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}