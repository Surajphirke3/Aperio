export interface CarbonEstimate {
  batchId: string;
  totalEmissions_kgCO2: number;
  byStage: {
    stage: string;
    emissions_kgCO2: number;
  }[];
  offsetCredits: number;
  netEmissions_kgCO2: number;
}

export interface CarbonSummary {
  totalEmissions: number;
  totalOffset: number;
  netEmissions: number;
  batchCount: number;
}
