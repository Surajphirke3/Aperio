'use client';

import type { ParsedIntent } from '../types';

interface StructuredOutputProps {
  data: ParsedIntent;
}

export function StructuredOutput({ data }: StructuredOutputProps) {
  return (
    <div className="mt-2 rounded-lg bg-white/80 p-3 text-xs font-mono border border-gray-200">
      <div className="grid grid-cols-2 gap-1">
        <span className="text-gray-500">Intent:</span>
        <span>{data.intent}</span>
        <span className="text-gray-500">Material:</span>
        <span>{data.material}</span>
        <span className="text-gray-500">Quantity:</span>
        <span>{data.quantity_kg} kg</span>
        {data.vendor && (
          <>
            <span className="text-gray-500">Vendor:</span>
            <span>{data.vendor}</span>
          </>
        )}
        {data.stage && (
          <>
            <span className="text-gray-500">Stage:</span>
            <span>{data.stage}</span>
          </>
        )}
        {data.loss_kg !== undefined && (
          <>
            <span className="text-gray-500">Loss:</span>
            <span>{data.loss_kg} kg</span>
          </>
        )}
      </div>
    </div>
  );
}
