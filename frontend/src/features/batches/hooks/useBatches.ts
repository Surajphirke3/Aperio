import useSWR from 'swr';
import type { BatchEntry } from '@/shared/types';
import { api } from '@/shared/utils/api';

const fetcher = () => api.get<{ batches: BatchEntry[]; count: number }>('/v1/batches');

export function useBatches() {
  const { data, error, isLoading, mutate } = useSWR('/v1/batches', fetcher);
  return { batches: data?.batches ?? [], count: data?.count ?? 0, isLoading, isError: !!error, refresh: mutate };
}