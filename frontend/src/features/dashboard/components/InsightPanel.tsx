'use client';

import { useInsights } from '../hooks/useInsights';

export function InsightPanel({ batchId }: { batchId?: string }) {
  const { insight, isLoading, isError } = useInsights(batchId);

  if (!batchId) return null;
  if (isLoading) return <div className="animate-pulse h-24 bg-gray-100 rounded-xl" />;
  if (isError || !insight) return null;

  return (
    <div className="rounded-xl border bg-blue-50 p-6">
      <h3 className="text-sm font-semibold text-blue-900">AI Insight</h3>
      <p className="mt-2 text-sm text-blue-800">{insight.summary}</p>
      {insight.recommendations.length > 0 && (
        <ul className="mt-3 space-y-1">
          {insight.recommendations.map((rec, i) => (
            <li key={i} className="text-xs text-blue-700">• {rec}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
