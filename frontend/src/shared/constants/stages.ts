import type { ProcessStage } from '../types';

export const STAGE_LABELS: Record<ProcessStage, string> = {
  collection: 'Collection',
  sorting: 'Sorting',
  processing: 'Processing',
  output: 'Output',
  dispatch: 'Dispatch',
};

export const STAGE_ORDER: ProcessStage[] = [
  'collection',
  'sorting',
  'processing',
  'output',
  'dispatch',
];
