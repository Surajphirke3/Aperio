export const mockBatches = [
  {
    id: 'batch_001',
    materialType: 'PET',
    quantity_kg: 300,
    vendor: 'Vendor A',
    createdAt: '2026-03-20T10:00:00Z',
    stages: [
      { stage: 'collection', input_kg: 300, output_kg: 285, loss_kg: 15 },
      { stage: 'sorting', input_kg: 285, output_kg: 270, loss_kg: 15 },
      { stage: 'processing', input_kg: 270, output_kg: 250, loss_kg: 20 },
      { stage: 'output', input_kg: 250, output_kg: 235, loss_kg: 15 },
      { stage: 'dispatch', input_kg: 235, output_kg: 235, loss_kg: 0 },
    ],
  },
  {
    id: 'batch_002',
    materialType: 'HDPE',
    quantity_kg: 450,
    vendor: 'Vendor B',
    createdAt: '2026-03-18T14:30:00Z',
    stages: [
      { stage: 'collection', input_kg: 450, output_kg: 430, loss_kg: 20 },
      { stage: 'sorting', input_kg: 430, output_kg: 410, loss_kg: 20 },
      { stage: 'processing', input_kg: 410, output_kg: 380, loss_kg: 30 },
      { stage: 'output', input_kg: 380, output_kg: 360, loss_kg: 20 },
      { stage: 'dispatch', input_kg: 360, output_kg: 360, loss_kg: 0 },
    ],
  },
  {
    id: 'batch_003',
    materialType: 'PP',
    quantity_kg: 200,
    vendor: 'Vendor A',
    createdAt: '2026-03-15T09:00:00Z',
    stages: [
      { stage: 'collection', input_kg: 200, output_kg: 195, loss_kg: 5 },
      { stage: 'sorting', input_kg: 195, output_kg: 190, loss_kg: 5 },
      { stage: 'processing', input_kg: 190, output_kg: 180, loss_kg: 10 },
      { stage: 'output', input_kg: 180, output_kg: 175, loss_kg: 5 },
      { stage: 'dispatch', input_kg: 175, output_kg: 175, loss_kg: 0 },
    ],
  },
  {
    id: 'batch_004',
    materialType: 'LDPE',
    quantity_kg: 250,
    vendor: 'Vendor C',
    createdAt: '2026-03-22T11:00:00Z',
    stages: [
      { stage: 'collection', input_kg: 250, output_kg: 240, loss_kg: 10 },
      { stage: 'sorting', input_kg: 240, output_kg: 225, loss_kg: 15 },
      { stage: 'processing', input_kg: 225, output_kg: 200, loss_kg: 25 },
      { stage: 'output', input_kg: 200, output_kg: 185, loss_kg: 15 },
      { stage: 'dispatch', input_kg: 185, output_kg: 185, loss_kg: 0 },
    ],
  },
  {
    id: 'batch_005',
    materialType: 'PET',
    quantity_kg: 350,
    vendor: 'Vendor B',
    createdAt: '2026-03-24T16:00:00Z',
    stages: [
      { stage: 'collection', input_kg: 350, output_kg: 335, loss_kg: 15 },
      { stage: 'sorting', input_kg: 335, output_kg: 320, loss_kg: 15 },
      { stage: 'processing', input_kg: 320, output_kg: 295, loss_kg: 25 },
      { stage: 'output', input_kg: 295, output_kg: 275, loss_kg: 20 },
      { stage: 'dispatch', input_kg: 275, output_kg: 275, loss_kg: 0 },
    ],
  },
];

export const mockVendors = [
  { id: 'v1', name: 'Vendor A', materialTypes: ['PET', 'PP'], totalSupplied_kg: 500, avgQualityScore: 92, lastDelivery: '2026-03-20' },
  { id: 'v2', name: 'Vendor B', materialTypes: ['HDPE', 'PET'], totalSupplied_kg: 800, avgQualityScore: 88, lastDelivery: '2026-03-24' },
  { id: 'v3', name: 'Vendor C', materialTypes: ['LDPE'], totalSupplied_kg: 250, avgQualityScore: 85, lastDelivery: '2026-03-22' },
  { id: 'v4', name: 'Vendor D', materialTypes: ['HDPE', 'PP'], totalSupplied_kg: 600, avgQualityScore: 90, lastDelivery: '2026-03-19' },
];

export const mockDashboardStats = {
  totalInput: 1550,
  totalOutput: 1230,
  totalLoss: 320,
  lossPct: 20.6,
  batchCount: 5,
  vendorCount: 4,
  completenessScore: 100,
  materialBreakdown: [
    { material: 'PET', quantity_kg: 650 },
    { material: 'HDPE', quantity_kg: 450 },
    { material: 'PP', quantity_kg: 200 },
    { material: 'LDPE', quantity_kg: 250 },
  ],
  stageBreakdown: [
    { stage: 'collection', quantity_kg: 1550, loss_kg: 65 },
    { stage: 'sorting', quantity_kg: 1485, loss_kg: 70 },
    { stage: 'processing', quantity_kg: 1415, loss_kg: 110 },
    { stage: 'output', quantity_kg: 1235, loss_kg: 75 },
    { stage: 'dispatch', quantity_kg: 1230, loss_kg: 0 },
  ],
  sankey: {
    nodes: [
      { id: 'collection', label: 'Collection', value: 1550 },
      { id: 'sorting', label: 'Sorting', value: 1485 },
      { id: 'processing', label: 'Processing', value: 1415 },
      { id: 'output', label: 'Output', value: 1235 },
      { id: 'dispatch', label: 'Dispatch', value: 1230 },
    ],
    links: [
      { source: 'collection', target: 'sorting', value: 1485 },
      { source: 'sorting', target: 'processing', value: 1415 },
      { source: 'processing', target: 'output', value: 1235 },
      { source: 'output', target: 'dispatch', value: 1230 },
    ],
  },
  anomalies: [
    { batch_id: 'batch_002', stage: 'processing', loss_pct: 7.3, threshold_pct: 5, severity: 'warning' },
    { batch_id: 'batch_004', stage: 'processing', loss_pct: 11.1, threshold_pct: 5, severity: 'warning' },
    { batch_id: 'batch_005', stage: 'processing', loss_pct: 7.8, threshold_pct: 5, severity: 'warning' },
  ],
};

export const mockCarbonStats = {
  totalCarbonSaved_kg: 2450,
  monthlyBreakdown: [
    { month: 'Jan', saved: 320 },
    { month: 'Feb', saved: 450 },
    { month: 'Mar', saved: 1680 },
  ],
  byMaterial: [
    { material: 'PET', saved: 980 },
    { material: 'HDPE', saved: 720 },
    { material: 'PP', saved: 400 },
    { material: 'LDPE', saved: 350 },
  ],
  equivalentTrees: 35,
};

export const mockInsights = [
  {
    id: 'insight_1',
    type: 'loss',
    message: 'Processing stage has highest losses (110kg total). Consider reviewing shredding equipment.',
    severity: 'warning',
    batchIds: ['batch_002', 'batch_004', 'batch_005'],
  },
  {
    id: 'insight_2',
    type: 'efficiency',
    message: 'Vendor A has best quality score (92%) with lowest loss rate.',
    severity: 'info',
  },
  {
    id: 'insight_3',
    type: 'trend',
    message: 'PET material represents 42% of total input - consider negotiating better terms.',
    severity: 'info',
  },
];