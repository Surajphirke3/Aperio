'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  Sankey,
  Tooltip,
} from 'recharts';
import type { SankeyData } from '@/shared/types';

interface SankeyDiagramProps {
  data: SankeyData;
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export function SankeyDiagram({ data }: SankeyDiagramProps) {
  const sankeyData = useMemo(() => {
    if (!data.nodes.length) return { nodes: [], links: [] };

    const nodeMap = new Map(data.nodes.map((n, i) => [n.id, i]));
    
    return {
      nodes: data.nodes.map((node, idx) => ({
        name: node.label,
        value: node.value,
        fill: COLORS[idx % COLORS.length],
      })),
      links: data.links.map((link) => ({
        source: nodeMap.get(link.source) ?? 0,
        target: nodeMap.get(link.target) ?? 0,
        value: link.value,
      })),
    };
  }, [data]);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Material Flow (kg)</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={sankeyData}
            node={{ stroke: '#374151', strokeWidth: 1 }}
            nodePadding={48}
            link={{ stroke: '#9ca3af', strokeOpacity: 0.4 }}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value) => [`${Number(value)} kg`, '']}
            />
          </Sankey>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-4">
        {data.nodes.map((node, idx) => (
          <div key={node.id} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[idx % COLORS.length] }}
            />
            <span className="text-gray-600">{node.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
