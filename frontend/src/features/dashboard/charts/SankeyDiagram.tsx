'use client';

import type { SankeyData } from '@/shared/types';

interface SankeyDiagramProps {
  data: SankeyData;
}

export function SankeyDiagram({ data }: SankeyDiagramProps) {
  // TODO: Integrate with a chart library (e.g., recharts, d3-sankey)
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Material Flow</h3>
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        Sankey diagram — {data.nodes.length} nodes, {data.links.length} links
      </div>
    </div>
  );
}
