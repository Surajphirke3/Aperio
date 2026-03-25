// This file is the contract between frontend and backend.
// Types here mirror the Pydantic schemas in the Python API.

export type MaterialType = 'PET' | 'HDPE' | 'PP' | 'LDPE' | 'PVC' | 'mixed';
export type ProcessStage = 'collection' | 'sorting' | 'processing' | 'output' | 'dispatch';
export type IntentType = 'purchase' | 'processing' | 'dispatch' | 'query' | 'report';

export interface ParsedEntry {
  intent: IntentType;
  material: MaterialType;
  quantity_kg: number;
  date: string;
  vendor?: string;
  stage?: ProcessStage;
  loss_kg?: number;
  batch_id?: string;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DashboardStats {
  total_entries: number;
  by_material: Record<string, number>;
  by_stage: Record<string, number>;
  total_dispatched_kg: number;
}

export interface BatchEntry {
  id: string;
  intent: IntentType;
  material: MaterialType;
  quantity_kg: number;
  date: string;
  vendor?: string;
  stage?: ProcessStage;
  loss_kg?: number;
  created_at: string;
  session_id: string;
}

export interface AnomalyAlert {
  batch_id: string;
  stage: ProcessStage;
  loss_pct: number;
  threshold_pct: number;
  severity: 'warning' | 'critical';
}