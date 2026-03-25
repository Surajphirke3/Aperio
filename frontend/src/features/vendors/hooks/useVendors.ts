import useSWR from 'swr';
import { api } from '@/shared/utils/api';
import type { VendorInfo } from '../types';

const fetcher = () => api.get<VendorInfo[]>('/v1/vendors');

export function useVendors() {
  const { data, error, isLoading, mutate } = useSWR('/v1/vendors', fetcher);
  return { vendors: data ?? [], count: data?.length ?? 0, isLoading, isError: !!error, refresh: mutate };
}
