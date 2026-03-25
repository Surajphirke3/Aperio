import type { DashboardStats } from '../types';

export const statsService = {
  async fetch(): Promise<DashboardStats> {
    const response = await fetch('/api/stats');
    if (!response.ok) {
      throw new Error(`Stats API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.data as DashboardStats;
  },
};
