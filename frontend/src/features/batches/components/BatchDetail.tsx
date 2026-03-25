'use client';

import { useBatchDetail } from '../hooks/useBatchDetail';
import { BatchTimeline } from './BatchTimeline';
import { LoadingState } from '@/shared/components/LoadingState';
import { PageHeader } from '@/shared/components/PageHeader';
import { formatKg } from '@/shared/utils/numbers';

interface BatchDetailProps {
  batchId: string;
}

export function BatchDetail({ batchId }: BatchDetailProps) {
  const { batch, isLoading, isError } = useBatchDetail(batchId);

  if (isLoading) return <LoadingState message="Loading batch..." />;
  if (isError || !batch) return <div className="text-red-500 p-4">Failed to load batch</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Batch ${batch.id}`}
        description={`${batch.materialType} — ${formatKg(batch.quantity_kg)}`}
      />
      <BatchTimeline stages={batch.stages} />
    </div>
  );
}
