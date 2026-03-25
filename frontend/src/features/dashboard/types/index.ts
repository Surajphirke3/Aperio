import type { SankeyData, AnomalyFlag, MaterialType, ProcessStage } from '@/shared/types';

export interface KPIMetric {
  label: string;
  value: number;
  unit: string;
  change?: number;
  changeLabel?: string;
}

export interface DashboardStats {
  totalInput: number;
  totalOutput: number;
  totalLoss: number;
  lossPct: number;
  batchCount: number;
  vendorCount: number;
  materialBreakdown: { material: MaterialType; quantity_kg: number }[];
  stageBreakdown: { stage: ProcessStage; quantity_kg: number; loss_kg: number }[];
  sankey: SankeyData;
  anomalies: AnomalyFlag[];
  completenessScore: number;
}
