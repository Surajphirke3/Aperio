export const CO2_FACTORS_PER_KG: Record<string, number> = {
  PET: 0.08,
  HDPE: 0.07,
  PP: 0.09,
  LDPE: 0.06,
  PVC: 0.12,
  mixed: 0.10,
};

export const STAGE_EMISSION_MULTIPLIERS: Record<string, number> = {
  collection: 0.05,
  sorting: 0.08,
  processing: 0.15,
  output: 0.03,
  dispatch: 0.10,
};

export const OFFSET_CREDIT_RATE = 0.02; // kg CO2 offset per kg recycled
