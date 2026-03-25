'use client';

import { useBatches } from '../hooks/useBatches';
import { BatchCard } from './BatchCard';
import { BatchFilters } from './BatchFilters';
import { LoadingState } from '@/shared/components/LoadingState';
import { EmptyState } from '@/shared/components/EmptyState';

export function BatchList() {
  const { batches, isLoading, isError } = useBatches();

  if (isLoading) return <LoadingState message="Loading batches..." />;
  if (isError) return <div className="text-red-500 p-4">Failed to load batches</div>;

  return (
    <div className="space-y-4">
      <BatchFilters />
      {batches.length === 0 ? (
        <EmptyState title="No batches found" description="Try adjusting your filters" />
      ) : (
        <div className="grid gap-4">
          {batches.map((batch) => (
            <BatchCard key={batch.id} batch={batch} />
          ))}
        </div>
      )}
    </div>
  );
}
