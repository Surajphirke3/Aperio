'use client';

import type { BatchFiltersState } from '../types';

interface Props {
  filters: BatchFiltersState;
  onChange: (filters: BatchFiltersState) => void;
}

const MATERIALS = ['PET', 'HDPE', 'PP', 'LDPE', 'PVC', 'mixed'];
const STAGES = ['collection', 'sorting', 'processing', 'output', 'dispatch'];

export function BatchFilters({ filters, onChange }: Props) {
  return (
    <div className="flex gap-3 flex-wrap">
      <select
        value={filters.material ?? ''}
        onChange={(e) => onChange({ ...filters, material: e.target.value || undefined })}
        className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs font-mono text-[var(--text-secondary)] outline-none"
      >
        <option value="">All Materials</option>
        {MATERIALS.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select
        value={filters.stage ?? ''}
        onChange={(e) => onChange({ ...filters, stage: e.target.value || undefined })}
        className="px-3 py-1.5 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs font-mono text-[var(--text-secondary)] outline-none"
      >
        <option value="">All Stages</option>
        {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}