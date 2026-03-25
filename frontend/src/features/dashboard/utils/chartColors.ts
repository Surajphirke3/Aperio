export const CHART_COLORS = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
  info: '#0891b2',
  muted: '#6b7280',
} as const;

export const MATERIAL_COLORS: Record<string, string> = {
  PET: '#2563eb',
  HDPE: '#7c3aed',
  PP: '#16a34a',
  LDPE: '#d97706',
  PVC: '#dc2626',
  mixed: '#6b7280',
};

export const STAGE_COLORS: Record<string, string> = {
  collection: '#2563eb',
  sorting: '#7c3aed',
  processing: '#d97706',
  output: '#16a34a',
  dispatch: '#0891b2',
};
