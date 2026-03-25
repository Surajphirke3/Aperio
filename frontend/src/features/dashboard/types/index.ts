export interface SankeyData {
  nodes: Array<{ name: string }>;
  links: Array<{ source: number; target: number; value: number }>;
}

export interface KPIMetric {
  label: string;
  value: string | number;
  change?: number;
  unit?: string;
}