import useSWR from 'swr';
import type { Batch } from '../types';
import { batchService } from '../services/batchService';

export function useBatchDetail(id?: string) {
  const { data, error, isLoading } = useSWR<Batch>(
    id ? `/api/batches/${id}` : null,
    () => batchService.getById(id!),
  );

  return {
    batch: data,
    isLoading,
    isError: !!error,
  };
}
