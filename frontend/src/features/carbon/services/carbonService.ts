import type { CarbonEstimate, CarbonSummary } from '../types';

export const carbonService = {
  async getEstimate(batchId: string): Promise<CarbonEstimate> {
    const response = await fetch(`/api/carbon/estimate?batchId=${batchId}`);
    if (!response.ok) throw new Error('Failed to fetch carbon estimate');
    const data = await response.json();
    return data.data as CarbonEstimate;
  },

  async getSummary(): Promise<CarbonSummary> {
    const response = await fetch('/api/carbon/summary');
    if (!response.ok) throw new Error('Failed to fetch carbon summary');
    const data = await response.json();
    return data.data as CarbonSummary;
  },
};
