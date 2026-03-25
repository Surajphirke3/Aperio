export interface Vendor {
  id: string;
  name: string;
  materialTypes: string[];
  totalSupplied_kg: number;
  avgQualityScore: number;
  lastDelivery: string;
}

export interface VendorScorecard {
  vendor: Vendor;
  qualityScore: number;
  reliabilityScore: number;
  overallScore: number;
}
