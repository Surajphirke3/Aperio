export const mockStats = {
  total_kg: 21660,
  dispatched_kg: 180,
  loss_pct: 3.44,
  batch_count: 28,
  total_entries: 28,
  by_material: {
    "PP": 640,
    "PET": 4000,
    "HDPE": 180,
    "Mixed Plastic": 16840
  },
  by_stage: {
    "collection": 4000,
    "Dispatch": 800,
    "processing": 640,
    "Processing": 3900,
    "Output": 1820,
    "Collection": 4460,
    "Sorting": 5860,
    "dispatch": 180
  }
};

export const mockAnomalies = {
  anomalies: [
    {
      id: "a1",
      severity: "critical",
      message: "Batch B-SCENARIO-1-3 — PET processing loss 34.2% (threshold: 20%)",
      timestamp: "2 hours ago",
      batch_id: "B-SCENARIO-1-3",
      stage: "processing",
      material: "PET",
      loss_pct: 34.2,
      threshold: 20
    },
    {
      id: "a2",
      severity: "warning",
      message: "Vendor WH-COLLECT — No delivery recorded in 8 days",
      timestamp: "4 hours ago",
      batch_id: "B-SCENARIO-1-7",
      stage: "collection",
      material: "Mixed Plastic",
      loss_pct: 8.5,
      threshold: 15
    },
    {
      id: "a3",
      severity: "warning",
      message: "Batch B-SCENARIO-1-5 — HDPE collection loss 12.1% (threshold: 10%)",
      timestamp: "6 hours ago",
      batch_id: "B-SCENARIO-1-5",
      stage: "collection",
      material: "HDPE",
      loss_pct: 12.1,
      threshold: 10
    }
  ],
  count: 3
};

export const mockBatches = [
  {
    id: "69c4a3e78a1c1d9c8a959fc3",
    batch_id: "B-SCENARIO-1-2",
    session_id: "seed-scenario-1",
    material: "PET",
    vendor: "PET-PROCESSOR",
    quantity_kg: 4000,
    loss_kg: 120,
    stage: "Processing",
    intent: "Processing",
    status: "complete",
    completeness: 100,
    created_at: "2026-03-03T12:00:00Z"
  },
  {
    id: "69c4a3e78a1c1d9c8a959fc4",
    batch_id: "B-SCENARIO-1-3",
    session_id: "seed-scenario-1",
    material: "PET",
    vendor: "WH-COLLECT",
    quantity_kg: 2000,
    loss_kg: 684,
    stage: "Processing",
    intent: "Processing",
    status: "complete",
    completeness: 100,
    created_at: "2026-03-02T12:00:00Z"
  },
  {
    id: "69c4a3e78a1c1d9c8a959fc5",
    batch_id: "B-SCENARIO-1-4",
    session_id: "seed-scenario-1",
    material: "HDPE",
    vendor: "WH-COLLECT",
    quantity_kg: 100,
    loss_kg: 0,
    stage: "Collection",
    intent: "Collection",
    status: "complete",
    completeness: 100,
    created_at: "2026-03-02T12:00:00Z"
  },
  {
    id: "69c4a3e78a1c1d9c8a959fc6",
    batch_id: "B-SCENARIO-1-5",
    session_id: "seed-scenario-1",
    material: "HDPE",
    vendor: "WH-COLLECT",
    quantity_kg: 80,
    loss_kg: 9.7,
    stage: "Collection",
    intent: "Collection",
    status: "complete",
    completeness: 100,
    created_at: "2026-03-02T12:00:00Z"
  },
  {
    id: "69c4a3e78a1c1d9c8a959fc7",
    batch_id: "B-SCENARIO-1-6",
    session_id: "seed-scenario-1",
    material: "Mixed Plastic",
    vendor: "WH-COLLECT",
    quantity_kg: 2000,
    loss_kg: 0,
    stage: "Sorting",
    intent: "Sorting",
    status: "complete",
    completeness: 100,
    created_at: "2026-03-02T12:00:00Z"
  },
  {
    id: "69c4a3e78a1c1d9c8a959fc8",
    batch_id: "B-SCENARIO-1-7",
    session_id: "seed-scenario-1",
    material: "Mixed Plastic",
    vendor: "WH-COLLECT",
    quantity_kg: 2000,
    loss_kg: 0,
    stage: "Sorting",
    intent: "Sorting",
    status: "complete",
    completeness: 100,
    created_at: "2026-03-02T12:00:00Z"
  },
  {
    id: "69c4a3e78a1c1d9c8a959fc9",
    batch_id: "B-SCENARIO-1-8",
    session_id: "seed-scenario-1",
    material: "Mixed Plastic",
    vendor: "WH-COLLECT",
    quantity_kg: 2000,
    loss_kg: 0,
    stage: "Collection",
    intent: "Collection",
    status: "complete",
    completeness: 100,
    created_at: "2026-03-01T12:00:00Z"
  },
  {
    id: "69c4a3e78a1c1d9c8a959fc1",
    batch_id: "B-SCENARIO-1-0",
    session_id: "seed-scenario-1",
    material: "Mixed Plastic",
    vendor: "WH-COLLECT",
    quantity_kg: 1000,
    loss_kg: 0,
    stage: "Collection",
    intent: "Collection",
    status: "complete",
    completeness: 100,
    created_at: "2026-03-01T12:00:00Z"
  }
];

export const mockVendors = [
  {
    id: "v1",
    name: "WH-COLLECT",
    tier: "Tier 1",
    rating: 4.8,
    compliance_score: 98,
    active_batches: 12,
    total_kg: 16840,
    location: "Warehouse A, District 5"
  },
  {
    id: "v2",
    name: "PET-PROCESSOR",
    tier: "Tier 1",
    rating: 4.6,
    compliance_score: 95,
    active_batches: 8,
    total_kg: 4000,
    location: "Processing Plant B, Industrial Zone"
  },
  {
    id: "v3",
    name: "GreenCycle Industries",
    tier: "Tier 2",
    rating: 4.3,
    compliance_score: 88,
    active_batches: 5,
    total_kg: 640,
    location: "Recycling Center C"
  },
  {
    id: "v4",
    name: "EcoPlast Solutions",
    tier: "Tier 2",
    rating: 4.5,
    compliance_score: 92,
    active_batches: 6,
    total_kg: 180,
    location: "Distribution Hub D"
  }
];

export const mockCarbonData = {
  total_co2_saved_kg: 3204,
  total_co2_saved_tonnes: 3.204,
  trees_equivalent: 148,
  by_material: {
    "PET": 840,
    "HDPE": 324,
    "PP": 1216,
    "Mixed Plastic": 824
  },
  monthly: [
    { month: "2026-01", co2_saved_kg: 820 },
    { month: "2026-02", co2_saved_kg: 1180 },
    { month: "2026-03", co2_saved_kg: 1204 }
  ],
  breakdown: {
    manufacturing: 620,
    transportation: 450,
    packaging: 170,
    disposal: 0
  }
};

export const mockChatSessions = [
  {
    session_id: "demo-session-1",
    last_updated: new Date().toISOString(),
    preview: "Show me stats for last 30 days"
  },
  {
    session_id: "demo-session-2",
    last_updated: new Date(Date.now() - 86400000).toISOString(),
    preview: "What batches have anomalies?"
  }
];

export const mockSankeyData = {
  nodes: [
    { name: "Collection" },
    { name: "Sorting" },
    { name: "Processing" },
    { name: "Output" },
    { name: "Dispatch" }
  ],
  links: [
    { source: 0, target: 1, value: 12860 },
    { source: 1, target: 2, value: 9860 },
    { source: 2, target: 3, value: 8900 },
    { source: 3, target: 4, value: 180 }
  ]
};

export const mockWeeklyData = {
  data: [
    { week: "W1", total_kg: 4200, count: 5 },
    { week: "W2", total_kg: 5800, count: 7 },
    { week: "W3", total_kg: 6100, count: 8 },
    { week: "W4", total_kg: 5560, count: 8 }
  ]
};

export const mockCompletenessData = {
  score: 91.4,
  total: 28,
  complete: 26
};

export const getMockChatResponse = (message: string) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("stats") || lowerMessage.includes("total") || lowerMessage.includes("kg")) {
    return {
      reply: "Based on the current data:\n\n📊 Total tracked: 21,660 kg\n📦 Active batches: 28\n📉 Loss rate: 3.44%\n🌱 CO₂ saved: 3.2 tonnes\n\nThe platform shows strong performance with PET and Mixed Plastic being the dominant materials.",
      intent: "query",
      structured_data: {
        total_kg: 21660,
        batch_count: 28,
        loss_pct: 3.44,
        co2_saved_t: 3.204
      },
      success: true
    };
  }

  if (lowerMessage.includes("anomaly") || lowerMessage.includes("loss") || lowerMessage.includes("warning")) {
    return {
      reply: "I found 3 anomalies in the current data:\n\n🔴 CRITICAL: Batch B-SCENARIO-1-3 shows 34.2% processing loss (threshold: 20%)\n\n🟡 WARNING: Batch B-SCENARIO-1-5 shows 12.1% collection loss (threshold: 10%)\n\n🟡 WARNING: Vendor WH-COLLECT has no deliveries recorded in 8 days.\n\nWould you like me to generate a detailed anomaly report?",
      intent: "query",
      structured_data: mockAnomalies,
      success: true
    };
  }

  if (lowerMessage.includes("batch") || lowerMessage.includes("material")) {
    return {
      reply: "Current batch breakdown:\n\n📦 PET: 4,000 kg (18.5%)\n📦 HDPE: 180 kg (0.8%)\n📦 PP: 640 kg (3%)\n📦 Mixed Plastic: 16,840 kg (77.7%)\n\nMost material flows through Sorting → Processing → Output stages.",
      intent: "query",
      structured_data: {
        by_material: mockStats.by_material
      },
      success: true
    };
  }

  if (lowerMessage.includes("carbon") || lowerMessage.includes("co2") || lowerMessage.includes("environmental")) {
    return {
      reply: "🌍 Carbon Impact Summary:\n\n✅ Total CO₂ saved: 3,204 kg (3.2 tonnes)\n🌳 Trees equivalent: 148 trees absorbed annually\n\nBy material contribution:\n• PP: 1,216 kg CO₂\n• PET: 840 kg CO₂\n• Mixed Plastic: 824 kg CO₂\n• HDPE: 324 kg CO₂\n\nRecycling these materials avoided significant landfill emissions.",
      intent: "query",
      structured_data: mockCarbonData,
      success: true
    };
  }

  if (lowerMessage.includes("vendor") || lowerMessage.includes("supplier")) {
    return {
      reply: "🏢 Top Vendors:\n\n1. WH-COLLECT (Tier 1)\n   • Rating: 4.8/5 • Compliance: 98%\n   • Active batches: 12 • Total: 16,840 kg\n\n2. PET-PROCESSOR (Tier 1)\n   • Rating: 4.6/5 • Compliance: 95%\n   • Active batches: 8 • Total: 4,000 kg\n\n3. GreenCycle Industries (Tier 2)\n   • Rating: 4.3/5 • Compliance: 88%\n   • Active batches: 5 • Total: 640 kg",
      intent: "query",
      structured_data: { vendors: mockVendors },
      success: true
    };
  }

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
    return {
      reply: "Hello! 👋 I'm Aperio AI, your recycled materials traceability assistant.\n\nI can help you with:\n• 📊 Analytics and statistics\n• 🔴 Anomaly detection\n• 📦 Batch tracking\n• 🌍 Carbon footprint data\n• 🏢 Vendor performance\n\nWhat would you like to know?",
      intent: "greeting",
      structured_data: null,
      success: true
    };
  }

  if (lowerMessage.includes("help")) {
    return {
      reply: "Here are some things you can ask me:\n\n📊 \"Show me stats for the last 30 days\"\n🔴 \"What anomalies have been detected?\"\n📦 \"Show me batches by material\"\n🌍 \"What is our carbon footprint?\"\n🏢 \"Which vendors have the best compliance?\"\n\nYou can also ask natural language questions about your supply chain data!",
      intent: "help",
      structured_data: null,
      success: true
    };
  }

  return {
    reply: "I understand you're asking about: \"" + message + "\"\n\nBased on our data, I can help you track materials, monitor anomalies, and analyze carbon impact. Try asking about:\n• Stats or totals\n• Anomalies or warnings\n• Specific batches or vendors\n• Carbon or environmental impact",
    intent: "query",
    structured_data: null,
    success: true
  };
};
