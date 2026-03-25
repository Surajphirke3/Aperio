'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AnomalyFlag } from '@/shared/types';

const DEFAULT_THRESHOLD_PCT = 5;

interface UseAnomaliesOptions {
  batchId?: string;
  pollInterval?: number; // in milliseconds
}

export function useAnomalies(options: UseAnomaliesOptions = {}) {
  const { batchId, pollInterval = 30000 } = options; // default 30s polling
  const [anomalies, setAnomalies] = useState<AnomalyFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnomalies = useCallback(async () => {
    try {
      setLoading(true);
      const url = new URL('/api/anomalies', window.location.origin);
      if (batchId) {
        url.searchParams.set('batchId', batchId);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      setAnomalies(result.data ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    fetchAnomalies();

    // Set up polling for real-time updates
    const interval = setInterval(fetchAnomalies, pollInterval);
    return () => clearInterval(interval);
  }, [fetchAnomalies, pollInterval]);

  const critical = anomalies.filter((a) => a.severity === 'critical');
  const warnings = anomalies.filter((a) => a.severity === 'warning');

  return {
    anomalies,
    critical,
    warnings,
    hasCritical: critical.length > 0,
    hasWarnings: warnings.length > 0,
    threshold: DEFAULT_THRESHOLD_PCT,
    loading,
    error,
    refetch: fetchAnomalies,
  };
}
