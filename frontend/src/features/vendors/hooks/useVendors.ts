'use client';

import useSWR from 'swr';
import type { Vendor } from '../types';
import { vendorService } from '../services/vendorService';

export function useVendors() {
  const { data, error, isLoading } = useSWR<Vendor[]>(
    '/api/vendors',
    vendorService.list,
  );

  return {
    vendors: data ?? [],
    isLoading,
    isError: !!error,
  };
}
