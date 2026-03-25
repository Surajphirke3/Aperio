'use client';

import { MATERIAL_OPTIONS } from '@/shared/constants/materials';
import { STAGE_ORDER } from '@/shared/constants/stages';

export function BatchFilters() {
  // TODO: Wire up to useBatches filter state
  return (
    <div className="flex flex-wrap gap-3">
      <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
        <option value="">All Materials</option>
        {MATERIAL_OPTIONS.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>
      <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
        <option value="">All Stages</option>
        {STAGE_ORDER.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <input type="date" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="Start date" />
      <input type="date" className="rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="End date" />
    </div>
  );
}
