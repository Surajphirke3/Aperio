'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { api } from '@/shared/utils/api';
import type { BatchEntry } from '@/shared/types';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { Card, Button } from '@/shared/ui';
import { formatDate } from '@/shared/utils/dates';
import { InsightBanner } from '@/features/dashboard/components/InsightBanner';

interface Props { batchId: string; }

interface BatchInsight {
  batch_id: string;
  narrative: string;
  anomalies: string[];
  recommendations: string[];
  risk_level: string;
}

export function BatchDetail({ batchId }: Props) {
  const { data, isLoading } = useSWR(`/v1/batches/${batchId}`, () => api.get<BatchEntry>(`/v1/batches/${batchId}`));
  const [insight, setInsight] = useState<BatchInsight | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (isLoading) return <div className="p-6"><LoadingSkeleton count={5} /></div>;
  if (!data) return <div className="p-6 text-[var(--text-muted)] font-mono text-sm">Batch not found.</div>;

  const batch = data;
  const timeline = [
    { key: 'collection', label: 'Collection' },
    { key: 'sorting', label: 'Sorting' },
    { key: 'processing', label: 'Processing' },
    { key: 'output', label: 'Output' },
    { key: 'dispatch', label: 'Dispatch' },
  ] as const;
  const activeStageIndex = timeline.findIndex((stage) => stage.key === (batch.stage ?? 'collection'));

  const handleGenerateInsight = async () => {
    setIsGenerating(true);
    const nextInsight = await api.post<BatchInsight>(`/v1/insights/${batchId}`, {});
    setInsight(nextInsight);
    setIsGenerating(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-[var(--text-primary)]">Batch {batchId.slice(0, 8)}</h1>
          <p className="text-sm font-mono text-[var(--text-muted)]">{batch.material} — {batch.intent}</p>
        </div>
        <Button onClick={() => void handleGenerateInsight()} disabled={isGenerating}>
          {isGenerating ? 'Generating…' : 'Generate Insight'}
        </Button>
      </div>

      <InsightBanner narrative={insight?.narrative} />

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

      <Card className="p-4 space-y-4">
        <div>
          <h2 className="text-sm font-mono text-[var(--text-primary)]">Lifecycle Timeline</h2>
          <p className="text-xs font-mono text-[var(--text-muted)]">Tracks the batch through each operational stage.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {timeline.map((stage, index) => {
            const isComplete = activeStageIndex >= index;
            return (
              <div
                key={stage.key}
                className={`rounded-xl border px-4 py-3 ${isComplete ? 'border-[var(--accent-primary)] bg-[var(--accent-muted)]' : 'border-[var(--border)] bg-[var(--bg-secondary)]'}`}
              >
                <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{stage.label}</p>
                <p className="mt-2 text-sm font-mono text-[var(--text-primary)]">
                  {isComplete ? 'Recorded' : 'Pending'}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {!!batch.anomalies?.length && (
        <Card className="p-4 space-y-3">
          <h2 className="text-sm font-mono text-[var(--text-primary)]">Anomalies</h2>
          {batch.anomalies.map((anomaly) => (
            <div key={`${anomaly.metric}-${anomaly.stage}`} className="rounded-lg border border-[var(--status-warning)]/40 bg-[var(--status-warning)]/10 px-4 py-3">
              <p className="text-sm font-mono text-[var(--text-primary)]">{anomaly.message}</p>
              <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
                {anomaly.metric}: {anomaly.value} / threshold {anomaly.threshold}
              </p>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
