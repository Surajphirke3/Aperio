'use client';

import useSWR from 'swr';
import type { Batch, BatchFilter } from '../types';
import { batchService } from '../services/batchService';

export function useBatches(filters?: BatchFilter) {
  const key = filters ? `/api/batches?${JSON.stringify(filters)}` : '/api/batches';

  const { data, error, isLoading, mutate } = useSWR<{ batches: Batch[]; total: number }>(
    key,
    () => batchService.list(filters),
  );

  return {
    batches: data?.batches ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError: !!error,
    refresh: () => mutate(),
  };
}
