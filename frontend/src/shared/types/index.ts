// This is the shared contract between frontend and backend.
// Change here = TypeScript errors everywhere = intentional.

export type MaterialType = 'PET' | 'HDPE' | 'PP' | 'LDPE' | 'PVC' | 'mixed';
export type ProcessStage = 'collection' | 'sorting' | 'processing' | 'output' | 'dispatch';
export type IntentType = 'purchase' | 'processing' | 'dispatch' | 'query' | 'report';

export interface ParsedIntent {
  intent: IntentType;
  material: MaterialType;
  quantity_kg: number;
  vendor?: string;
  date: string;           // ISO 8601
  stage?: ProcessStage;
  loss_kg?: number;
  batch_id?: string;
  notes?: string;
}

export interface SankeyNode {
  id: string;
  label: string;
  value: number;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AnomalyFlag {
  batch_id: string;
  stage: ProcessStage;
  loss_pct: number;
  threshold_pct: number;
  severity: 'warning' | 'critical';
}
