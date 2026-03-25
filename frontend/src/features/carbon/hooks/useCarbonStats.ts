'use client';

import useSWR from 'swr';
import { carbonService } from '../services/carbonService';
import type { CarbonEstimate } from '../types';

export function useCarbonStats(batchId: string | null) {
  const { data, error, isLoading } = useSWR<CarbonEstimate>(
    batchId ? `/api/carbon/estimate?batchId=${batchId}` : null,
    () => (batchId ? carbonService.getEstimate(batchId) : Promise.reject()),
  );

  return {
    estimate: data,
    isLoading,
    isError: !!error,
  };
}
