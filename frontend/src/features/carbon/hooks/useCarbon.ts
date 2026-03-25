import useSWR from 'swr';
import type { CarbonSummary } from '../types';
import { carbonService } from '../services/carbonService';

export function useCarbon() {
  const { data, error, isLoading } = useSWR<CarbonSummary>(
    '/api/carbon/summary',
    carbonService.getSummary,
  );

  return {
    summary: data,
    isLoading,
    isError: !!error,
  };
}
