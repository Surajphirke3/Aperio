@AGENTS.md

# Claude — RecycLens Development Guide

## Quick Reference
- **Project:** RecycLens — AI-powered plastic recycling operations platform
- **Tech Stack:** Next.js 14+ (App Router), TypeScript, Supabase, Clerk, D3.js, Tailwind, shadcn/ui
- **AI Constraint:** ≤3.8B parameter models only
- **Target Users:** Plant operators, managers, compliance officers
- **Design Principle:** Data Forward — numbers and charts are the hero

---

## Your Role

You are building a **conversational intelligence platform** that replaces notebooks and Excel for recycling plants. Workers speak naturally, the system extracts structured data, and managers see real-time dashboards.

### Key User Needs

**Prakash (Operator, 28):**
- Logs 10-20 material movements per shift
- Comfortable with WhatsApp, not complex software
- **Goal:** Log data in 10 seconds in natural language

**Sunita (Manager, 45):**
- Manages 40 workers, needs profitability visibility
- **Goal:** Know plant health in 3 seconds of looking at dashboard

**Ramesh (Compliance Officer, 38):**
- Submits quarterly reports to CPCB, BIS
- **Goal:** One-click compliance report generation

---

## Core Features to Implement

### 1. Conversational Batch Logging (Priority: CRITICAL)
- Chat interface like WhatsApp
- Extract: material type (PET/HDPE/PP/LDPE/PS/Mixed), quantity (kg/tons/quintals), vendor name
- Confidence score ≥0.7 required; flag lower for human review
- Response time < 5 seconds

### 2. Sankey Lifecycle Dashboard (Priority: HIGH)
- D3.js Sankey diagram
- 7 stages: collection → sorting → washing → shredding → melting → pelletizing → dispatch
- Loss nodes in amber/red
- Real-time updates within 3 seconds

### 3. KPI Cards (Priority: HIGH)
- Total Received (kg) — current month
- Total Dispatched (kg) — current month
- Efficiency Percentage
- Carbon Saved (kg CO₂)
- Active Batches count
- Open Alerts count

### 4. Anomaly Detection (Priority: MEDIUM)
- Rule-based engine (NOT ML for V1)
- Stage-specific loss thresholds
- Severity: low/medium/high/critical
- AI-generated explanations
- n8n webhook for critical alerts

### 5. Conversational Analytics (Priority: MEDIUM)
- Natural language queries about plant performance
- Examples: "how much PET received this week", "which vendor performed worst"
- Response time < 8 seconds

### 6. Vendor Scorecard (Priority: MEDIUM)
- Score on: material quality, loss rate caused, supply consistency
- Ranked table + individual vendor pages

### 7. Carbon Impact Tracker (Priority: LOW)
- CO₂ saved per batch using emission factors
- "Equivalent trees planted" metric

---

## Design Requirements

### Color Semantics (NON-NEGOTIABLE)
```
Success/Efficiency:  emerald-500 / green-500
Warning/Loss:        amber-500 / orange-500
Critical/Anomaly:    red-500 / rose-500
Info/Neutral:        blue-500 / slate-500
```

### Responsive Breakpoints
- **Tablet-first:** 768px+ (primary factory floor device)
- **Phone:** 375px+ (secondary)

### Design Principles
1. **Data Forward** — Numbers and charts are the hero
2. **Status at a Glance** — 3-second plant health assessment
3. **Conversation Feels Natural** — Chat like texting, not forms
4. **Color Communicates** — Green/Amber/Red always have meaning
5. **Dense but Not Cluttered** — Information density for industrial users

---

## Code Patterns

### TypeScript Types
```typescript
type MaterialType = 'PET' | 'HDPE' | 'PP' | 'LDPE' | 'PS' | 'Mixed';
type QuantityUnit = 'kg' | 'tons' | 'quintals';

type ExtractionResult = {
  materialType: MaterialType;
  quantity: number;
  unit: QuantityUnit;
  vendor?: string;
  confidence: number;
  needsReview: boolean;
};
```

### API Route Pattern
```typescript
import { z } from 'zod';
import { NextResponse } from 'next/server';

const Schema = z.object({
  text: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const result = Schema.safeParse(body);
  
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: result.error.flatten() },
      { status: 400 }
    );
  }
  
  // Process with AI (≤3.8B params)
  // Return extraction result
}
```

### Supabase Query Pattern
```typescript
const { data, error } = await supabase
  .from('batches')
  .select('*, vendors(name)')
  .eq('plant_id', plantId)
  .gte('created_at', startOfMonth)
  .order('created_at', { ascending: false });

if (error) throw error;
```

### Component Pattern
```typescript
interface KPICardProps {
  title: string;
  value: number | string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'good' | 'warning' | 'critical';
}

export function KPICard({ title, value, trend, trendValue, status }: KPICardProps) {
  const statusColors = {
    good: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-red-500',
  };
  
  return (
    <Card>
      {/* Implementation */}
    </Card>
  );
}
```

---

## V1 Out of Scope

DO NOT implement:
- Multi-plant / multi-organization support
- Voice input
- Mobile app (responsive web only)
- Blockchain traceability
- Carbon credit generation
- Third-party ERP integration
- IoT sensor integration
- Advanced ML predictive models

---

## Quality Checklist

Before submitting code:
- [ ] TypeScript types defined for all API inputs/outputs
- [ ] Zod validation on API routes
- [ ] RLS policies considered for database queries
- [ ] Responsive at 768px and 375px
- [ ] Colors follow semantic meaning (green/amber/red)
- [ ] AI features respect ≤3.8B parameter constraint
- [ ] Response times < 5s for AI, < 500ms for DB
- [ ] Error handling with user-friendly messages
- [ ] Loading states for async operations

---

## Success Metrics

| Metric | Target |
|--------|--------|
| NLP Extraction Accuracy | > 90% |
| Dashboard Load Time | < 2 seconds |
| Real-time Update Latency | < 500ms |
| Anomaly Detection Accuracy | > 80% |

---

## Emergency Contacts (Conceptual)

If you hit a constraint violation:
- **AI Model Too Large:** Use smaller quantized model or simpler regex extraction
- **Slow Database:** Add indexes, implement caching
- **Complex UI:** Simplify to MVP, defer to V2

---

*Build for Prakash, Sunita, and Ramesh. They need this to work.*

