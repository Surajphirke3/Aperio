'use client';

import useSWR from 'swr';
import { DashboardStats } from '../types';
import { statsService } from '../services/statsService';

// SWR key — also acts as cache invalidation key
const STATS_KEY = '/api/stats';

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    STATS_KEY,
    statsService.fetch,
    {
      refreshInterval: 0,        // Don't auto-refresh — we trigger manually
      revalidateOnFocus: false,
    }
  );

  // Called by ChatPanel after successful data entry
  const refresh = () => mutate();

  return {
    stats: data,
    isLoading,
    isError: !!error,
    refresh,
  };
}
