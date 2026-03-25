<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 🤖 RecycLens Agent Rules

## Project Overview

**RecycLens** is a conversational intelligence platform for plastic recycling operations. It replaces notebooks, Excel, and WhatsApp with an AI-native system that workers can use in plain language, while giving managers real-time visibility into every kg of material in their plant.

**Target Users:**
- **Plant Operators** (Primary) — Factory floor workers logging material movements
- **Plant Managers** — Reviewing reports, monitoring efficiency, making decisions
- **Compliance Officers** — Generating regulatory documentation

**Core Value Proposition:** End-to-end operational intelligence at 10× lower cost and 10× less complexity than SAP EHS.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14+ (App Router) | Full-stack React with API routes |
| Language | TypeScript | Type safety across codebase |
| Database | Supabase PostgreSQL | Real-time data, RLS policies |
| Auth | Clerk | JWT-based authentication |
| AI | ≤3.8B parameter models | NLP extraction, conversational analytics |
| Charts | D3.js (Sankey) | Material lifecycle visualization |
| Styling | Tailwind CSS | Utility-first styling |
| UI Components | shadcn/ui | Accessible, consistent components |
| Icons | Lucide React | Iconography |

**Critical Constraints:**
- AI Model Size ≤ 3.8B parameters (hackathon + cost requirement)
- Response Time < 5s for AI, < 500ms for DB queries
- Mobile Responsive: Tablet-first (768px+), phone (375px+)

---

## 🏗 Architecture Guidelines

### App Router Structure
```
app/
├── (auth)/           # Clerk auth routes (grouped, no layout)
├── (dashboard)/      # Protected dashboard routes
│   ├── chat/         # Conversational interface
│   ├── analytics/    # Queries and insights
│   └── settings/
├── api/              # Next.js API routes
│   ├── extract/      # NLP extraction endpoint
│   ├── alerts/       # Anomaly detection webhook
│   └── analytics/    # Query processing
├── page.tsx          # Landing/marketing page
└── layout.tsx        # Root layout with providers
```

### Database Patterns
- Use Supabase client for real-time subscriptions
- Implement Row Level Security (RLS) for all tables
- Use PostgreSQL functions for complex aggregations
- Cache frequently accessed KPIs in Redis/memory

### State Management
- **Server State:** React Query / SWR for API data
- **Real-time:** Supabase realtime subscriptions
- **Local State:** React useState/useReducer
- **Global UI:** Zustand (only if needed)

---

## 🎨 Design Principles (NON-NEGOTIABLE)

1. **Data Forward** — Numbers and charts are the hero, not decorative elements
2. **Status at a Glance** — Manager should know plant health in 3 seconds
3. **Conversation Feels Natural** — Chat should feel like texting, not filling a form
4. **Color Communicates** — Green = good, Amber = warning, Red = critical. Always.
5. **Dense but Not Cluttered** — Industrial users need information density

### Color System
```
Success/Efficiency:  emerald-500 / green-500
Warning/Loss:        amber-500 / orange-500
Critical/Anomaly:    red-500 / rose-500
Info/Neutral:        blue-500 / slate-500
Background:          slate-50 / slate-900 (dark mode optional)
```

---

## 🔧 Feature Implementation Guides

### Feature 1: Conversational Batch Logging
**User Story:** Plant operator logs material movements in natural language

**Implementation Requirements:**
- Chat interface mimicking WhatsApp/iMessage
- NLP extraction endpoint parsing: material type, quantity, vendor
- Confidence scoring (<0.7 triggers human review flag)
- Auto-suggest corrections for low-confidence extractions

**Material Types:** PET, HDPE, PP, LDPE, PS, Mixed
**Quantity Units:** kg, tons, quintals (auto-convert to kg)

### Feature 2: Sankey Lifecycle Dashboard
**User Story:** Visualize material flow through 7 stages

**Implementation Requirements:**
- D3.js Sankey diagram with 7 stages: collection → sorting → washing → shredding → melting → pelletizing → dispatch
- Loss nodes displayed in amber/red
- Real-time updates via Supabase subscriptions
- Hover interactions showing detailed breakdowns

### Feature 3: KPI Cards
**Metrics to Display:**
- Total Received (kg) — current month
- Total Dispatched (kg) — current month
- Efficiency Percentage
- Carbon Saved (kg CO₂)
- Active Batches count
- Open Alerts count

**Update Frequency:** Real-time via Supabase subscriptions

### Feature 4: Anomaly Detection
**Implementation Requirements:**
- Rule-based engine (not ML for V1)
- Stage-specific loss thresholds trigger alerts
- Severity levels: low/medium/high/critical
- AI-generated explanations for anomalies
- n8n webhook integration for critical alerts
- Alert management UI (mark as resolved)

### Feature 5: Conversational Analytics
**Supported Query Patterns:**
- "how much [material] received [time period]"
- "which vendor performed worst this month"
- "show carbon savings for [time period]"
- "compare efficiency between [vendor A] and [vendor B]"

**Implementation:** SQL generation from natural language + data retrieval

### Feature 6: Vendor Scorecard
**Scoring Criteria:**
- Material quality (purity %)
- Loss rate caused by vendor
- Supply consistency (on-time delivery)

**UI:** Ranked table + individual vendor detail pages with charts

### Feature 7: Carbon Impact Tracker
**Implementation:**
- Emission factors per plastic type
- CO₂ saved calculation per batch
- Monthly/cumulative dashboards
- "Equivalent trees planted" metric

---

## ⚠️ Explicitly Out of Scope (V1)

DO NOT implement these in V1:
- Multi-plant / multi-organization support
- Voice input
- Mobile app (use responsive web)
- Blockchain traceability
- Carbon credit generation
- Third-party ERP integration
- IoT sensor integration
- Advanced ML predictive models

---

## 📝 Coding Standards

### TypeScript
```typescript
// Always use explicit types for API responses
type ExtractionResult = {
  materialType: 'PET' | 'HDPE' | 'PP' | 'LDPE' | 'PS' | 'Mixed';
  quantity: number;
  unit: 'kg' | 'tons' | 'quintals';
  vendor?: string;
  confidence: number;
  needsReview: boolean;
};

// Use discriminated unions for API results
type APIResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };
```

### Component Structure
```typescript
// Single responsibility: components do one thing well
// Props interface always exported
// Default export for page components
// Named exports for reusable components

interface KPICardProps {
  title: string;
  value: number | string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'good' | 'warning' | 'critical';
}

export function KPICard({ title, value, trend, trendValue, status }: KPICardProps) {
  // Implementation
}
```

### API Routes
```typescript
// Always validate input with Zod
// Return consistent error format
// Use appropriate HTTP status codes

import { z } from 'zod';

const ExtractSchema = z.object({
  text: z.string().min(1),
  userId: z.string().uuid(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const result = ExtractSchema.safeParse(body);
  
  if (!result.success) {
    return Response.json(
      { error: 'Invalid input', details: result.error.flatten() },
      { status: 400 }
    );
  }
  
  // Process...
}
```

### Database Queries
```typescript
// Always use prepared statements (Supabase handles this)
// Implement RLS policies for security
// Use transactions for multi-table operations

const { data, error } = await supabase
  .from('batches')
  .select('*')
  .eq('plant_id', plantId)
  .order('created_at', { ascending: false })
  .limit(50);
```

---

## 🧪 Testing Requirements

- Unit tests for NLP extraction logic
- Integration tests for API endpoints
- E2E tests for critical user flows (login → log batch → view dashboard)
- Test extraction accuracy against 50 sample sentences

---

## 📊 Success Metrics to Optimize For

| Metric | Target |
|--------|--------|
| NLP Extraction Accuracy | > 90% |
| Dashboard Load Time | < 2 seconds |
| Real-time Update Latency | < 500ms |
| Anomaly Detection Accuracy | > 80% |

---

## 🚨 Agent Reminders

1. **Check tech constraints** before implementing AI features (≤3.8B params)
2. **Test responsive layouts** at 768px (tablet) and 375px (phone)
3. **Use color semantic meanings** consistently (green/amber/red)
4. **Keep conversation interfaces** natural and WhatsApp-like
5. **Prioritize data visibility** over decorative elements
6. **Implement RLS policies** for all database tables
7. **Handle offline gracefully** — cache data, show stale state clearly

---

*Last Updated: Based on PRD v1.0 — RecycLens Product Requirements*
