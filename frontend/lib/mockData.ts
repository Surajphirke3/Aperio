// Mock data for TraceFlow application

export interface Batch {
  id: string
  material: string
  vendor: string
  status: "anomaly" | "warning" | "complete" | "active"
  completeness: number
  inputKg: number
  outputKg: number
  lossKg: number
  stages: number
  date: string
}

export interface Vendor {
  id: number
  name: string
  materials: string[]
  quality: number
  reliability: number
  totalKg: number
  score: number
  trend: "up" | "down" | "stable"
  risk: "low" | "medium" | "high"
}

export interface Anomaly {
  id: string
  severity: "critical" | "warning" | "info"
  message: string
  link?: string
  timestamp: string
}

export interface WeeklyData {
  week: string
  PET: number
  HDPE: number
  PP: number
}

export interface StageData {
  stage: string
  input: number
  loss: number
}

export interface CarbonData {
  material: string
  recycledCO2: number
  virginCO2: number
  savedKg: number
}

// Batches data
export const batches: Batch[] = [
  { id: "B-2024-089", material: "PET Bottles", vendor: "GreenCycle Industries", status: "anomaly", completeness: 72, inputKg: 4200, outputKg: 2940, lossKg: 760, stages: 5, date: "Mar 18" },
  { id: "B-2024-091", material: "HDPE Containers", vendor: "EcoPoly Ltd", status: "warning", completeness: 67, inputKg: 1800, outputKg: 1350, lossKg: 150, stages: 3, date: "Mar 20" },
  { id: "B-2024-087", material: "PP Packaging", vendor: "CircularMat Co.", status: "complete", completeness: 100, inputKg: 2100, outputKg: 1890, lossKg: 210, stages: 5, date: "Mar 15" },
  { id: "B-2024-086", material: "PET Bottles", vendor: "UrbanRecycle Ltd", status: "complete", completeness: 100, inputKg: 3600, outputKg: 3168, lossKg: 432, stages: 5, date: "Mar 12" },
  { id: "B-2024-090", material: "HDPE Film", vendor: "GreenCycle Industries", status: "active", completeness: 45, inputKg: 2500, outputKg: 1800, lossKg: 200, stages: 2, date: "Mar 21" },
  { id: "B-2024-085", material: "PP Packaging", vendor: "EcoPoly Ltd", status: "complete", completeness: 100, inputKg: 1200, outputKg: 1056, lossKg: 144, stages: 5, date: "Mar 10" },
  { id: "B-2024-088", material: "PET Bottles", vendor: "CircularMat Co.", status: "active", completeness: 60, inputKg: 3100, outputKg: 2325, lossKg: 310, stages: 3, date: "Mar 17" },
  { id: "B-2024-084", material: "HDPE Containers", vendor: "UrbanRecycle Ltd", status: "complete", completeness: 100, inputKg: 900, outputKg: 810, lossKg: 90, stages: 5, date: "Mar 8" },
]

// Vendors data
export const vendors: Vendor[] = [
  { id: 1, name: "GreenCycle Industries", materials: ["PET", "HDPE"], quality: 96.2, reliability: 91.8, totalKg: 8400, score: 94.2, trend: "up", risk: "low" },
  { id: 2, name: "EcoPoly Ltd", materials: ["HDPE", "PP"], quality: 88.4, reliability: 85.2, totalKg: 5200, score: 87.1, trend: "stable", risk: "low" },
  { id: 3, name: "CircularMat Co.", materials: ["PP", "PET"], quality: 91.7, reliability: 78.4, totalKg: 4100, score: 85.3, trend: "down", risk: "medium" },
  { id: 4, name: "UrbanRecycle Ltd", materials: ["HDPE"], quality: 82.1, reliability: 92.3, totalKg: 3800, score: 86.7, trend: "up", risk: "low" },
]

// Anomalies data
export const anomalies: Anomaly[] = [
  { id: "a1", severity: "critical", message: "Batch B-2024-089 — PET processing loss 34.2% (threshold: 20%)", link: "/batches/B-2024-089", timestamp: "2 hours ago" },
  { id: "a2", severity: "warning", message: "Vendor GreenCycle Industries — No delivery recorded in 8 days", link: "/vendors", timestamp: "4 hours ago" },
  { id: "a3", severity: "warning", message: "Batch B-2024-091 — Completeness score 67% (incomplete stage data)", link: "/batches/B-2024-091", timestamp: "6 hours ago" },
  { id: "a4", severity: "info", message: "HDPE weekly dispatch volume down 15% vs 4-week average", timestamp: "8 hours ago" },
]

// Weekly throughput data
export const weeklyData: WeeklyData[] = [
  { week: "W1", PET: 1200, HDPE: 800, PP: 400 },
  { week: "W2", PET: 1400, HDPE: 750, PP: 420 },
  { week: "W3", PET: 1100, HDPE: 900, PP: 380 },
  { week: "W4", PET: 1600, HDPE: 820, PP: 460 },
  { week: "W5", PET: 1350, HDPE: 770, PP: 410 },
  { week: "W6", PET: 1550, HDPE: 860, PP: 480 },
  { week: "W7", PET: 1700, HDPE: 910, PP: 500 },
  { week: "W8", PET: 1450, HDPE: 790, PP: 430 },
]

// Stage data for bar chart
export const stageData: StageData[] = [
  { stage: "Collection", input: 5000, loss: 0 },
  { stage: "Sorting", input: 4800, loss: 800 },
  { stage: "Processing", input: 4000, loss: 700 },
  { stage: "Granulation", input: 3300, loss: 300 },
]

// Carbon data
export const carbonData: CarbonData[] = [
  { material: "PET Bottles", recycledCO2: 520, virginCO2: 1840, savedKg: 1320 },
  { material: "HDPE Containers", recycledCO2: 380, virginCO2: 1120, savedKg: 740 },
  { material: "PP Packaging", recycledCO2: 280, virginCO2: 840, savedKg: 560 },
  { material: "HDPE Film", recycledCO2: 328, virginCO2: 912, savedKg: 584 },
]

// Material breakdown for pie chart
export const materialBreakdown = [
  { name: "PET", value: 45, fill: "#22c55e" },
  { name: "HDPE", value: 28, fill: "#14b8a6" },
  { name: "PP", value: 17, fill: "#f59e0b" },
  { name: "Others", value: 10, fill: "#64748b" },
]

// Sankey data for material flow
export const sankeyData = {
  nodes: [
    { name: "Collection" },
    { name: "Sorting" },
    { name: "Processing" },
    { name: "Granulation" },
    { name: "Dispatch" },
    { name: "Loss-Sort" },
    { name: "Loss-Process" },
    { name: "Loss-Gran" },
  ],
  links: [
    { source: 0, target: 1, value: 5000 },
    { source: 1, target: 2, value: 4200 },
    { source: 1, target: 5, value: 800 },
    { source: 2, target: 3, value: 3500 },
    { source: 2, target: 6, value: 700 },
    { source: 3, target: 4, value: 3200 },
    { source: 3, target: 7, value: 300 },
  ],
}

// AI Insights
export const aiInsights = [
  "This week's throughput shows strong PET recovery rates averaging 87.3% across 5 active batches. However, Batch B-2024-089 exhibits anomalous processing loss of 34.2% — 14 percentage points above the historical average. Recommend reviewing the shredding process parameters for this batch. HDPE volumes from GreenCycle Industries have dropped 22% over the past 8 days; a supply continuity check is advised.",
  "Overall system efficiency has improved 3.2% this week. PP packaging shows the highest yield at 90% average recovery rate. Notable: CircularMat Co. deliveries have been consistently below weight specifications by 2-4%. Consider flagging for quality discussion in next vendor review. Carbon savings on track to exceed monthly target by 12%.",
  "Processing bottleneck detected at the granulation stage — average throughput down 8% vs previous 4-week average. This correlates with increased PET input volumes. Recommend: (1) Review granulator capacity allocation, (2) Consider parallel processing for high-volume batches. Positive note: Zero anomalies detected in sorting stage this week.",
]

// Batch detail timeline stages
export const batchDetailStages = [
  {
    stage: "COLLECTION",
    timestamp: "Mar 18, 09:00 AM",
    inputKg: 4200,
    outputKg: 4200,
    lossKg: 0,
    lossPercent: 0,
    status: "complete",
    location: "Mumbai Central Depot",
    method: "Manual collection + weighbridge",
    notes: "",
  },
  {
    stage: "SORTING",
    timestamp: "Mar 18, 02:00 PM",
    inputKg: 4200,
    outputKg: 3400,
    lossKg: 800,
    lossPercent: 19.0,
    status: "complete",
    location: "Processing Facility A",
    method: "Automated optical sorting",
    notes: "Contaminants removed: caps, labels, foil",
  },
  {
    stage: "PROCESSING",
    timestamp: "Mar 19, 10:00 AM",
    inputKg: 3400,
    outputKg: 2245,
    lossKg: 1155,
    lossPercent: 34.0,
    status: "anomaly",
    location: "Processing Facility A",
    method: "Shredding + washing",
    notes: "Shredder efficiency below normal",
  },
  {
    stage: "GRANULATION",
    timestamp: "In Progress...",
    inputKg: null,
    outputKg: null,
    lossKg: null,
    lossPercent: null,
    status: "pending",
    location: "Estimated start: Mar 20",
    method: "",
    notes: "",
  },
  {
    stage: "DISPATCH",
    timestamp: "Pending",
    inputKg: null,
    outputKg: null,
    lossKg: null,
    lossPercent: null,
    status: "pending",
    location: "",
    method: "",
    notes: "",
  },
]

// Chat demo responses
export const chatResponses = {
  dataEntry: {
    text: "I've extracted the following entry from your message. Please confirm to save:",
    type: "entry" as const,
  },
  lossQuery: {
    text: "Here's the processing loss data for the requested period:",
    type: "query" as const,
    data: {
      type: "Reporting Query",
      metric: "Processing Losses",
      period: "March 2026",
      result: "2,847 kg total loss",
      detail: "(avg 18.3% per batch)",
    },
  },
  dispatchQuery: {
    text: "Here's the dispatch summary for last week:",
    type: "query" as const,
    data: {
      type: "Dispatch Report",
      metric: "Total Dispatched",
      period: "Last 7 days",
      result: "8,420 kg",
      detail: "(across 6 batches)",
    },
  },
  batchStatus: {
    text: "Here's the current batch status overview:",
    type: "query" as const,
    data: {
      type: "Status Report",
      metric: "Active Batches",
      period: "Current",
      result: "12 batches",
      detail: "(3 critical, 2 warning)",
    },
  },
  generic: {
    text: "I'm here to help you manage your traceability data. You can ask me to log new material entries, query batch statuses, check processing losses, or view dispatch reports. Try saying something like 'Purchased 300 kg of PET bottles from GreenCycle Industries today' or 'Show me losses during processing this month'.",
    type: "text" as const,
  },
}

// Vendor radar chart dimensions
export const vendorRadarDimensions = [
  { dimension: "Quality", fullMark: 100 },
  { dimension: "Reliability", fullMark: 100 },
  { dimension: "Consistency", fullMark: 100 },
  { dimension: "Completeness", fullMark: 100 },
  { dimension: "Lead Time", fullMark: 100 },
]

// Get vendor radar data
export function getVendorRadarData(vendor: Vendor) {
  return [
    { dimension: "Quality", value: vendor.quality },
    { dimension: "Reliability", value: vendor.reliability },
    { dimension: "Consistency", value: vendor.trend === "up" ? 92 : vendor.trend === "stable" ? 85 : 75 },
    { dimension: "Completeness", value: 88 + Math.random() * 10 },
    { dimension: "Lead Time", value: vendor.reliability - 5 + Math.random() * 10 },
  ]
}

// Recent vendor deliveries
export function getVendorDeliveries(vendorName: string) {
  const baseDeliveries = [
    { date: "Mar 22", material: "PET Bottles", quantity: 850, quality: 96 },
    { date: "Mar 19", material: "HDPE Film", quantity: 620, quality: 94 },
    { date: "Mar 15", material: "PET Bottles", quantity: 780, quality: 97 },
    { date: "Mar 12", material: "HDPE Containers", quantity: 540, quality: 92 },
    { date: "Mar 8", material: "PET Bottles", quantity: 920, quality: 95 },
  ]
  return baseDeliveries
}

// Carbon monthly data
export const carbonMonthlyData = [
  { month: "Oct", recycled: 980, virgin: 2940 },
  { month: "Nov", recycled: 1120, virgin: 3360 },
  { month: "Dec", recycled: 1050, virgin: 3150 },
  { month: "Jan", recycled: 1280, virgin: 3840 },
  { month: "Feb", recycled: 1380, virgin: 4140 },
  { month: "Mar", recycled: 1508, virgin: 4712 },
]

// KPI data
export const kpiData = {
  totalTracked: 18420,
  avgCompleteness: 91.4,
  activeBatches: 12,
  criticalBatches: 3,
  co2Saved: 3204,
  totalTrackedChange: 8.2,
  completenessChange: 2.1,
}

// Completeness breakdown
export const completenessBreakdown = [
  { label: "Batch data", value: 96 },
  { label: "Stage data", value: 89 },
  { label: "Vendor data", value: 88 },
  { label: "Timestamps", value: 93 },
]
