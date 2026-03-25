'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#4ade80'];

interface Props {
  data: Record<string, number>;
}

export function MaterialPieChart({ data }: Props) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} strokeWidth={2} stroke="var(--bg-primary)">
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)' }} />
          <Legend wrapperStyle={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}