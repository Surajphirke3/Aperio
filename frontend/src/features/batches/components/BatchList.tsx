'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBatches } from '../hooks/useBatches';
import { BatchFilters } from './BatchFilters';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { formatDate } from '@/shared/utils/dates';
import { cn } from '@/shared/utils/cn';
import type { BatchFiltersState } from '../types';

export function BatchList() {
  const { batches, isLoading } = useBatches();
  const [filters, setFilters] = useState<BatchFiltersState>({});

  const filtered = batches.filter((b) => {
    if (filters.material && b.material !== filters.material) return false;
    if (filters.stage && b.stage !== filters.stage) return false;
    return true;
  });

  if (isLoading) return <div className="p-6"><LoadingSkeleton count={6} /></div>;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-[var(--text-primary)]">Batches</h1>
          <p className="text-sm font-mono text-[var(--text-muted)]">{filtered.length} entries</p>
        </div>
        <BatchFilters filters={filters} onChange={setFilters} />
      </div>

      <div className="border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="bg-[var(--bg-tertiary)] text-[var(--text-muted)] text-[10px] uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Material</th>
              <th className="px-4 py-3 text-left">Intent</th>
              <th className="px-4 py-3 text-right">Qty (kg)</th>
              <th className="px-4 py-3 text-left">Vendor</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                <td className="px-4 py-3 text-[var(--text-primary)]">
                  <Link href={`/batches/${b.id}`} className="hover:text-[var(--accent-primary)]">{b.material}</Link>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('text-xs capitalize', b.intent === 'dispatch' ? 'text-purple-400' : b.intent === 'purchase' ? 'text-emerald-400' : 'text-blue-400')}>
                    {b.intent}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)]">{b.quantity_kg}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{b.vendor ?? '—'}</td>
                <td className="px-4 py-3 text-[var(--text-muted)]">{formatDate(b.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}