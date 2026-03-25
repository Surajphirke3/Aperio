'use client';

import { useVendors } from '../hooks/useVendors';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';

export function VendorTable() {
  const { vendors, isLoading } = useVendors();

  if (isLoading) return <div className="p-6"><LoadingSkeleton count={5} /></div>;

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="font-display text-2xl text-[var(--text-primary)]">Vendors</h1>
        <p className="text-sm font-mono text-[var(--text-muted)]">{vendors.length} vendors</p>
      </div>

      <div className="border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full text-sm font-mono">
          <thead>
            <tr className="bg-[var(--bg-tertiary)] text-[var(--text-muted)] text-[10px] uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-right">Total (kg)</th>
              <th className="px-4 py-3 text-right">Entries</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.name} className="border-t border-[var(--border)] hover:bg-[var(--bg-tertiary)] transition-colors">
                <td className="px-4 py-3 text-[var(--text-primary)]">{v.name}</td>
                <td className="px-4 py-3 text-right text-[var(--text-secondary)]">{v.total_kg.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-[var(--text-muted)]">{v.entry_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}