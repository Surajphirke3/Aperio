import useSWR from 'swr';
import type { DashboardStats } from '@/shared/types';
import { api } from '@/shared/utils/api';

const fetcher = () => api.get<DashboardStats>('/v1/stats');

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    '/v1/stats',
    fetcher,
    { refreshInterval: 30_000 }
  );

  return { stats: data, isLoading, isError: !!error, refresh: mutate };
}