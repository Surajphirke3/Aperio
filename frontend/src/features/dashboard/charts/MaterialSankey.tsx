'use client';

import { Sankey, Tooltip, ResponsiveContainer } from 'recharts';
import type { SankeyData } from '../types';

interface Props { data: SankeyData; }

export function MaterialSankey({ data }: Props) {
  if (!data.nodes.length) return null;
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={data}
          nodePadding={20}
          nodeWidth={12}
          link={{ stroke: '#22c55e22' }}
        >
          <Tooltip
            contentStyle={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-primary)',
            }}
          />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
}