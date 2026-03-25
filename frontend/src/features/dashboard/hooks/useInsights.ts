import useSWR from 'swr';

interface Insight {
  summary: string;
  recommendations: string[];
}

async function fetchInsight(batchId: string): Promise<Insight> {
  const response = await fetch(`/api/insights?batchId=${batchId}`);
  if (!response.ok) throw new Error('Failed to fetch insight');
  const data = await response.json();
  return data.data as Insight;
}

export function useInsights(batchId?: string) {
  const { data, error, isLoading } = useSWR<Insight>(
    batchId ? `/api/insights?batchId=${batchId}` : null,
    () => fetchInsight(batchId!),
  );

  return {
    insight: data,
    isLoading,
    isError: !!error,
  };
}
