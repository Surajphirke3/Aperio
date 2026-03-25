import type { MaterialType, ProcessStage } from '@/shared/types';

export interface Batch {
  id: string;
  materialType: MaterialType;
  quantity_kg: number;
  vendor?: string;
  createdAt: string;
  stages: BatchStage[];
}

export interface BatchStage {
  stage: ProcessStage;
  input_kg: number;
  output_kg: number;
  loss_kg: number;
  timestamp: string;
}

export interface BatchFilter {
  materialType?: MaterialType;
  stage?: ProcessStage;
  startDate?: string;
  endDate?: string;
  vendor?: string;
  page?: number;
  limit?: number;
}
