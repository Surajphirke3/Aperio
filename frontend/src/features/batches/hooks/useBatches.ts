import useSWR from 'swr';
import type { BatchEntry } from '@/shared/types';
import { api } from '@/shared/utils/api';

const fetcher = () => api.get<BatchEntry[]>('/v1/batches');

export function useBatches() {
  const { data, error, isLoading, mutate } = useSWR('/v1/batches', fetcher);
  return { batches: data ?? [], count: data?.length ?? 0, isLoading, isError: !!error, refresh: mutate };
}
