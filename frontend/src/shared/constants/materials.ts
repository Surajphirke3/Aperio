import type { MaterialType } from '../types';

export const MATERIAL_LABELS: Record<MaterialType, string> = {
  PET: 'PET (Polyethylene Terephthalate)',
  HDPE: 'HDPE (High-Density Polyethylene)',
  PP: 'PP (Polypropylene)',
  LDPE: 'LDPE (Low-Density Polyethylene)',
  PVC: 'PVC (Polyvinyl Chloride)',
  mixed: 'Mixed Plastics',
};

export const MATERIAL_OPTIONS: { value: MaterialType; label: string }[] = [
  { value: 'PET', label: 'PET' },
  { value: 'HDPE', label: 'HDPE' },
  { value: 'PP', label: 'PP' },
  { value: 'LDPE', label: 'LDPE' },
  { value: 'PVC', label: 'PVC' },
  { value: 'mixed', label: 'Mixed' },
];
