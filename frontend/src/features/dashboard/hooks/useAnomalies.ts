import type { AnomalyFlag } from '@/shared/types';

const DEFAULT_THRESHOLD_PCT = 5;

export function useAnomalies(anomalies: AnomalyFlag[] = []) {
  const critical = anomalies.filter((a) => a.severity === 'critical');
  const warnings = anomalies.filter((a) => a.severity === 'warning');

  return {
    anomalies,
    critical,
    warnings,
    hasCritical: critical.length > 0,
    hasWarnings: warnings.length > 0,
    threshold: DEFAULT_THRESHOLD_PCT,
  };
}
