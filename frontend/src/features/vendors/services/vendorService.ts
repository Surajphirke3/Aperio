import type { Vendor } from '../types';

export const vendorService = {
  async list(): Promise<Vendor[]> {
    const response = await fetch('/api/vendors');
    if (!response.ok) throw new Error('Failed to fetch vendors');
    const data = await response.json();
    return data.data as Vendor[];
  },
};
