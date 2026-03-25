'use client';

import useSWR from 'swr';
import { api } from '@/shared/utils/api';
import type { BatchEntry } from '@/shared/types';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { Card } from '@/shared/ui';
import { formatDate } from '@/shared/utils/dates';

interface Props { batchId: string; }

export function BatchDetail({ batchId }: Props) {
  const { data, isLoading } = useSWR(`/v1/batches/${batchId}`, () => api.get<BatchEntry>(`/v1/batches/${batchId}`));

  if (isLoading) return <div className="p-6"><LoadingSkeleton count={5} /></div>;
  if (!data) return <div className="p-6 text-[var(--text-muted)] font-mono text-sm">Batch not found.</div>;

  const batch = data;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-display text-2xl text-[var(--text-primary)]">Batch {batchId.slice(0, 8)}</h1>
        <p className="text-sm font-mono text-[var(--text-muted)]">{batch.material} — {batch.intent}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Material', value: batch.material },
          { label: 'Quantity', value: `${batch.quantity_kg} kg` },
          { label: 'Intent', value: batch.intent },
          { label: 'Vendor', value: batch.vendor ?? '—' },
          { label: 'Stage', value: batch.stage ?? '—' },
          { label: 'Loss', value: batch.loss_kg ? `${batch.loss_kg} kg` : '—' },
          { label: 'Date', value: batch.date ? formatDate(batch.date) : '—' },
          { label: 'Created', value: formatDate(batch.created_at) },
        ].map((item) => (
          <Card key={item.label} className="p-3">
            <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">{item.label}</p>
            <p className="text-sm font-mono text-[var(--text-primary)] mt-1">{item.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}