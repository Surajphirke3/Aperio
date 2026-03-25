'use client';

import { useState } from 'react';

interface LossHeatmapProps {
  data: { stage: string; material: string; lossPct: number }[];
}

function getCellColor(pct: number): string {
  if (pct >= 25) return 'bg-red-600 text-white';
  if (pct >= 15) return 'bg-orange-500 text-white';
  if (pct >= 8) return 'bg-yellow-400 text-gray-900';
  return 'bg-green-400 text-gray-900';
}

const STAGES = ['sorting', 'washing', 'shredding', 'melting', 'pelletizing'];
const MATERIALS = ['PET', 'HDPE', 'PP', 'LDPE', 'PS'];

export function LossHeatmap({ data }: LossHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ stage: string; material: string; lossPct: number } | null>(null);

  if (!data.length) {
    return (
      <div className="rounded-xl border bg-white p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Loss % by Stage &amp; Material</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">No data available</div>
      </div>
    );
  }

  const lookup = new Map(data.map((d) => [`${d.stage}-${d.material}`, d.lossPct]));
  const stages = STAGES.filter((s) => data.some((d) => d.stage === s));
  const materials = MATERIALS.filter((m) => data.some((d) => d.material === m));

  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Loss % by Stage &amp; Material</h3>
      <div className="overflow-x-auto">
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `100px repeat(${materials.length}, 70px)` }}>
          {/* Header */}
          <div />
          {materials.map((m) => (
            <div key={m} className="text-xs font-medium text-gray-600 text-center py-1">{m}</div>
          ))}
          {/* Rows */}
          {stages.map((stage) => (
            <>
              <div key={`label-${stage}`} className="text-xs font-medium text-gray-600 flex items-center capitalize">
                {stage}
              </div>
              {materials.map((mat) => {
                const pct = lookup.get(`${stage}-${mat}`) ?? 0;
                return (
                  <div
                    key={`${stage}-${mat}`}
                    className={`text-xs font-semibold rounded flex items-center justify-center h-10 cursor-default transition-transform hover:scale-105 ${getCellColor(pct)}`}
                    onMouseEnter={() => setHoveredCell({ stage, material: mat, lossPct: pct })}
                    onMouseLeave={() => setHoveredCell(null)}
                  >
                    {pct.toFixed(1)}%
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div className="flex gap-3 mt-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400" /> 0-8%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-400" /> 8-15%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500" /> 15-25%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-600" /> 25%+</span>
      </div>
      {/* Tooltip */}
      {hoveredCell && (
        <div className="mt-2 text-xs text-gray-600">
          {hoveredCell.stage} / {hoveredCell.material}: {hoveredCell.lossPct.toFixed(2)}% loss
        </div>
      )}
    </div>
  );
}

export default LossHeatmap;
