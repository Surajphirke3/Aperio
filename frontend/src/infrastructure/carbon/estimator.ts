const EMISSION_FACTORS: Record<string, number> = {
  collection: 0.05,
  sorting: 0.08,
  processing: 0.15,
  output: 0.03,
  dispatch: 0.1,
};

interface StageInput {
  stage: string;
  quantity_kg: number;
}

export function estimateEmissions(stages: StageInput[]): {
  byStage: { stage: string; emissions_kgCO2: number }[];
  total_kgCO2: number;
} {
  const byStage = stages.map((s) => ({
    stage: s.stage,
    emissions_kgCO2: s.quantity_kg * (EMISSION_FACTORS[s.stage] ?? 0.1),
  }));

  const total_kgCO2 = byStage.reduce((sum, s) => sum + s.emissions_kgCO2, 0);

  return { byStage, total_kgCO2 };
}
