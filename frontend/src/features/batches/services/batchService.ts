import type { Batch, BatchFilter } from '../types';

export const batchService = {
  async list(filters?: BatchFilter): Promise<{ batches: Batch[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.materialType) params.set('materialType', filters.materialType);
    if (filters?.stage) params.set('stage', filters.stage);
    if (filters?.startDate) params.set('startDate', filters.startDate);
    if (filters?.endDate) params.set('endDate', filters.endDate);
    if (filters?.vendor) params.set('vendor', filters.vendor);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));

    const response = await fetch(`/api/batches?${params.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch batches');
    const data = await response.json();
    return data.data;
  },

  async getById(id: string): Promise<Batch> {
    const response = await fetch(`/api/batches/${id}`);
    if (!response.ok) throw new Error('Failed to fetch batch');
    const data = await response.json();
    return data.data;
  },
};
