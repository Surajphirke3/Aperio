# 🚨 PROMPT.md — Complete AI-Assisted Implementation Guide
# RecycLens / TraceFlow — Hackniche 4.0 ML PS1

> **READ THIS FIRST.** This file contains ready-to-use prompts for every unfinished piece of your project.
> Feed each prompt directly to Claude/Cursor/Copilot to get working code instantly.

---

## 📊 CURRENT STATUS vs PS REQUIREMENTS

### PS Checklist — What You Have vs What's Needed

| PS Requirement | Status | Gap |
|---|---|---|
| Conversational Data Entry (NLP → JSON) | 🟡 Partial | Frontend AI works but **does NOT persist to DB** |
| Conversational Reporting/Querying | 🟡 Partial | Route exists but not connected to real data |
| Visual Sankey Lifecycle Diagram | 🔴 MISSING | Component is a **placeholder shell — no charting library** |
| Bar/Line/Pie Charts | 🔴 MISSING | All 4 chart components are placeholder shells |
| AI-Driven Summaries & Insights | 🟡 Partial | InsightService exists on backend but backend not connected |
| Anomaly Detection & Highlights | 🟡 Partial | Logic exists, UI shows alerts, but from mock data |
| Data Completeness Scoring | 🟡 Partial | Logic exists on backend, not surfaced to frontend |
| Vendor Scorecard | 🔴 MISSING | Component exists, backend is 501, not routed |
| Frontend ↔ Backend Integration | 🔴 CRITICAL | **0% connected — two parallel systems** |
| Backend Repositories (real DB) | 🔴 MISSING | All repositories are stubs returning empty/fake data |
| Stats Endpoints | 🔴 MISSING | `/v1/stats/dashboard` and `/v1/stats/sankey` both return 501 |
| Vendor Endpoints | 🔴 MISSING | All vendor routes return 501 |
| Chat → DB Persistence | 🔴 MISSING | Chat works but data is never saved |
| Dataset Integration | 🟡 Partial | Transformer exists, seed not confirmed working |

### 🎯 The Single Biggest Problem
**Your frontend and backend are two completely separate apps that have never talked to each other.**
The frontend uses its own Prisma/PostgreSQL. The backend uses SQLAlchemy/SQLite.
You need to pick ONE and connect everything to it.

**Decision for hackathon: Keep Prisma on frontend + make FastAPI backend also use the SAME PostgreSQL.**
This is the fastest path because frontend queries already work.

---

## 🔥 PRIORITY ORDER — Do These Exactly in This Order

```
HOUR 0-1:   [PROMPT 1] Connect frontend chat → backend → persist to Prisma DB
HOUR 1-2:   [PROMPT 2] Implement backend stats endpoints (dashboard + sankey)
HOUR 2-3:   [PROMPT 3] Build real Sankey diagram with D3 (replaces placeholder)
HOUR 3-4:   [PROMPT 4] Build real charts (Recharts bar + line + pie)
HOUR 4-5:   [PROMPT 5] Implement backend vendor endpoints + scorecard
HOUR 5-6:   [PROMPT 6] Wire frontend to backend (replace all internal API calls)
HOUR 6-7:   [PROMPT 7] Fix anomaly detection → real alerts on dashboard
HOUR 7-8:   [PROMPT 8] AI insights working end-to-end
HOUR 8-9:   [PROMPT 9] Seed Kaggle dataset into DB
HOUR 9-10:  [PROMPT 10] Polish + demo prep
```

---

---

# 🔧 THE PROMPTS

---

## PROMPT 1 — Fix Chat to Actually Save Data to Database

**The Problem:** `POST /api/chat` on the frontend calls AI, gets structured JSON back, but never calls `createEntry()` from `queries/entries.ts`. Data disappears. Nothing is saved.

**Paste this into Claude/Cursor:**

```
I have a Next.js 15 app with an existing chat API route at src/app/api/chat/route.ts.
The route currently:
1. Applies rate limiting
2. Calls the AI provider (Featherless/Ollama) via src/infrastructure/ai/provider.ts
3. Returns a response
BUT it does NOT save the extracted data to the database.

I also have these existing files:
- src/infrastructure/db/queries/entries.ts — has createEntry() function
- src/infrastructure/db/queries/batches.ts — has createBatch() and getBatches()
- src/infrastructure/db/prisma.ts — Prisma client singleton
- src/infrastructure/ai/prompts/intentPrompt.ts — intent detection
- src/infrastructure/ai/prompts/entityPrompt.ts — entity extraction

The Prisma schema has:
- Batch model (id, batchCode, materialType, initialQuantityKg, vendorId, status, createdAt)
- BatchStage model (id, batchId, stage, inputKg, outputKg, createdAt)
- Vendor model (id, name)

Please rewrite src/app/api/chat/route.ts to:
1. Accept POST with { message: string, conversationId?: string }
2. Call AI to classify intent (data_entry vs query vs general)
3. IF data_entry:
   a. Call AI to extract entities: {materialType, quantityKg, vendorName, stage, action, outputKg?, batchCode?, date?}
   b. Find or create vendor in DB
   c. Find or create batch in DB (generate batchCode like "B-{YYYY}-{random3digits}" if new)
   d. Create BatchStage record with the stage data
   e. Run anomaly check: if loss > threshold, add anomaly flag
   f. Return: { message: "✅ Logged! Batch {code}: {qty}kg {material} from {vendor}", intent: "data_entry", entry: {extracted data}, batchCode, anomaly?: {...} }
4. IF query:
   a. Parse the query to extract filters (material, dateRange, metric)
   b. Query the database using existing query functions
   c. Format and return the answer as natural language + raw data
5. IF general: return a helpful response
6. Always maintain conversation context by accepting and returning conversationId
7. Add proper try/catch with meaningful error messages
8. TypeScript strict mode, no any types

Use these anomaly thresholds:
- sorting: warn > 12%, critical > 20%
- washing: warn > 8%, critical > 15%  
- shredding: warn > 5%, critical > 10%
- melting: warn > 18%, critical > 25%
- pelletizing: warn > 8%, critical > 12%
```

---

## PROMPT 2 — Implement Backend Stats Endpoints (501 → Working)

**The Problem:** `/v1/stats/dashboard` and `/v1/stats/sankey` both return HTTP 501 Not Implemented. These are critical for the dashboard.

**Paste this into Claude/Cursor:**

```
I have a FastAPI backend with these files already existing:
- src/api/v1/stats/routes.py — has routes but returns 501
- src/api/v1/stats/schemas.py — has DashboardStatsResponse, SankeyNode, SankeyLink, SankeyResponse
- src/infrastructure/repositories/batch_repository.py — stub, needs real implementation
- src/infrastructure/repositories/stats_repository.py — stub, needs real implementation
- src/infrastructure/database/models.py — has BatchORM, BatchLifecycleORM, EntryORM, VendorORM
- src/infrastructure/database/connection.py — SQLAlchemy session management
- src/domain/batches/anomaly_detector.py — anomaly detection logic exists
- src/domain/batches/completeness_scorer.py — completeness scoring exists
- src/shared/constants/thresholds.py — thresholds defined

The database uses SQLAlchemy with PostgreSQL (same DB as frontend Prisma).
The frontend Prisma schema has these tables: Batch, BatchStage, Vendor

Please implement:

1. src/infrastructure/repositories/stats_repository.py — replace stubs with real SQLAlchemy queries:
   - get_dashboard_stats(db, plant_id=None) → returns totals, efficiency, anomaly count, completeness
   - get_sankey_data(db, days=30) → returns nodes and links for Sankey diagram
   - get_material_breakdown(db, days=30) → material type distribution
   - get_loss_by_stage(db, days=30) → loss percentage per processing stage

2. src/api/v1/stats/routes.py — implement both endpoints:
   - GET /v1/stats/dashboard → DashboardStatsResponse
     Returns: { totalReceivedKg, totalDispatchedKg, efficiencyPct, carbonSavedKg, activeBatches, alertCount, completenessScore, materialBreakdown }
   - GET /v1/stats/sankey → SankeyResponse  
     Returns: { nodes: [{id, name, value}], links: [{source, target, value}] }
     Sankey must include loss nodes (e.g., "sorting_loss", "melting_loss")

3. Carbon calculation: use these factors for carbonSavedKg calculation:
   PET: 2.15 kg CO2 saved per kg recycled vs virgin
   HDPE: 1.97, LDPE: 2.01, PP: 1.89, PS: 2.23

The Sankey structure should be:
Collection → Sorting → Washing → Shredding → Melting → Pelletizing → Dispatch
With loss branches: Sorting Loss, Washing Loss, Shredding Loss, Melting Loss, Pelletizing Loss

Write production-quality Python with proper SQLAlchemy ORM queries, type hints, error handling.
No stubs, no TODO comments — implement everything fully.
```

---

## PROMPT 3 — Build the Real Sankey Diagram (Replace Placeholder)

**The Problem:** `src/features/dashboard/charts/SankeyDiagram.tsx` is a shell with no actual charting. The Sankey is your #1 WOW moment and it's completely missing.

**Paste this into Claude/Cursor:**

```
I have a Next.js 15 TypeScript app. 
I have a placeholder file at: src/features/dashboard/charts/SankeyDiagram.tsx
I also have: src/features/dashboard/utils/sankeyBuilder.ts (builds nodes/links from data)

I need to replace the placeholder with a REAL working Sankey diagram using D3.js.

Install these packages first: npm install d3 d3-sankey @types/d3

The component should:
1. Accept props: { data: { nodes: SankeyNode[], links: SankeyLink[] } }
   where SankeyNode = { id: string, name: string, value: number }
   and SankeyLink = { source: string, target: string, value: number }

2. Render a proper D3 Sankey diagram that:
   - Is fully responsive (uses ResizeObserver or container ref for width)
   - Colors flows by material type or stage (use a color scale)
   - Colors LOSS nodes/flows in RED/ORANGE (#ef4444, #f97316)
   - Colors normal stage flows in GREEN (#22c55e) to TEAL (#14b8a6) gradient
   - Shows node labels with kg values (e.g., "Sorting\n4,750 kg")
   - Shows link tooltips on hover: "580kg → Sorting Loss"
   - Animates the flows on first render (fade in + flow animation)
   - Has a legend showing: Input, Processing, Loss colors
   - Height: 400px minimum
   - Has proper margins (top:20, right:120, bottom:20, left:120) for labels

3. Handle edge cases:
   - Show "No data available" state if nodes/links empty
   - Handle window resize
   - Clean up D3 on unmount (remove event listeners, clear SVG)

4. Include a loading skeleton state

5. Export as default React functional component

Make it look premium and impressive — this is our main demo moment.
Use TypeScript strict mode throughout.
```

---

## PROMPT 4 — Build All Real Charts (Replace 4 Placeholders)

**The Problem:** `BatchBarChart.tsx`, `MaterialPieChart.tsx`, `WeeklyLineChart.tsx`, `LossHeatmap.tsx` are all empty placeholder shells.

**Paste this into Claude/Cursor:**

```
I have a Next.js 15 TypeScript app.
Install: npm install recharts

Replace these 4 placeholder chart files with real Recharts components:

FILE 1: src/features/dashboard/charts/BatchBarChart.tsx
Props: { data: Array<{ material: string, received: number, dispatched: number }> }
Build: A grouped bar chart showing received vs dispatched kg per material type
Style: Dark theme compatible, responsive, custom tooltip showing exact values
Colors: received = #22c55e (green), dispatched = #3b82f6 (blue)
X-axis: material type labels. Y-axis: kg values with "kg" suffix

FILE 2: src/features/dashboard/charts/MaterialPieChart.tsx  
Props: { data: Array<{ name: string, value: number, color: string }> }
Build: A donut/pie chart showing material type distribution by weight
Style: Each slice has a different color, label shows percentage + name
Include center text showing total kg
Custom tooltip: "{material}: {value}kg ({pct}%)"

FILE 3: src/features/dashboard/charts/WeeklyLineChart.tsx
Props: { data: Array<{ week: string, received: number, processed: number, dispatched: number }> }
Build: A multi-line chart showing material flow trends over weeks
Three lines: received (green), processed (blue), dispatched (orange)
Include area fill under each line (semi-transparent)
X-axis: week labels. Y-axis: kg. Custom tooltip. Responsive.

FILE 4: src/features/dashboard/charts/LossHeatmap.tsx
Props: { data: Array<{ stage: string, material: string, lossPercent: number }> }
Build: A visual grid heatmap (NOT a real heatmap library — build with CSS grid)
Rows: stages (sorting, washing, shredding, melting, pelletizing)
Columns: material types (PET, HDPE, PP, LDPE, PS)
Each cell: colored by loss % (green=low loss, yellow=medium, red=high)
Color scale: 0-8% green, 8-15% yellow, 15-25% orange, 25%+ red
Cell shows the % value. Tooltip on hover shows full details.
Include a color legend.

All components:
- TypeScript strict, no any
- Show "No data" empty state when data is empty
- Export as default
- Mobile responsive
- Match existing color scheme from src/features/dashboard/utils/chartColors.ts
```

---

## PROMPT 5 — Implement Backend Vendor Endpoints (501 → Working)

**The Problem:** All `/v1/vendors/*` routes return 501. The vendor scorecard is a key PS deliverable.

**Paste this into Claude/Cursor:**

```
I have a FastAPI backend.
These files exist but return 501:
- src/api/v1/vendors/routes.py
- src/api/v1/vendors/schemas.py (has VendorResponse, ScorecardResponse)
- src/infrastructure/repositories/vendor_repository.py (stubbed)
- src/domain/vendors/models.py (has Vendor, VendorScorecard models)
- src/domain/vendors/services.py (has scorecard calculation logic)
- src/infrastructure/database/models.py (has VendorORM, BatchORM, EntryORM)

Please implement:

1. src/infrastructure/repositories/vendor_repository.py — real SQLAlchemy queries:
   - list_vendors(db, skip=0, limit=50) → list of VendorORM with aggregated stats
   - get_vendor_by_id(db, vendor_id) → VendorORM or None
   - get_vendor_scorecard(db, vendor_id) → aggregated stats for scoring
   
   The scorecard stats should calculate from BatchORM/BatchLifecycleORM:
   - total_batches_supplied
   - average_loss_pct (losses from their batches)
   - quality_score (0-100, based on loss rate and consistency)
   - reliability_score (0-100, based on supply frequency)
   - overall_score (weighted average)

2. src/api/v1/vendors/routes.py — implement all 3 endpoints:
   - GET /v1/vendors/ → list all vendors with basic stats
   - GET /v1/vendors/{vendor_id} → single vendor with full history
   - GET /v1/vendors/{vendor_id}/scorecard → detailed scorecard

3. VendorScorecard calculation:
   - quality_score = max(0, 100 - (avg_loss_pct * 3))  
   - reliability_score = min(100, batch_count * 10) 
   - overall_score = (quality_score * 0.6) + (reliability_score * 0.4)
   - grade: A (>=80), B (60-79), C (40-59), D (<40)

Use proper async SQLAlchemy, type hints, error handling.
Return proper 404 when vendor not found.
```

---

## PROMPT 6 — Connect Frontend to Backend (The Most Critical Step)

**The Problem:** Frontend calls its own internal Next.js API routes. It needs to call the Python FastAPI backend instead.

**Paste this into Claude/Cursor:**

```
I have a Next.js 15 frontend that currently self-serves data through internal API routes 
(/api/batches, /api/vendors, /api/stats, /api/insights, /api/carbon).

I have a FastAPI backend running at NEXT_PUBLIC_API_URL (e.g., http://localhost:8000).
The backend has these working endpoints:
- GET /v1/stats/dashboard
- GET /v1/stats/sankey
- GET /v1/batches/
- GET /v1/batches/{id}
- GET /v1/vendors/
- GET /v1/vendors/{id}
- GET /v1/vendors/{id}/scorecard
- POST /v1/chat/
- POST /v1/insights/{batch_id}
- GET /v1/carbon/?material=PET&quantity_kg=500

The frontend KEEPS its internal API routes BUT they now proxy to the backend.
This way frontend components don't change — only the API route implementations change.

Please rewrite these Next.js API routes to proxy to the FastAPI backend:

1. src/app/api/stats/route.ts
   - GET → fetch NEXT_PUBLIC_API_URL + /v1/stats/dashboard
   - Map response to match existing DashboardStats frontend type

2. src/app/api/batches/route.ts
   - GET → fetch NEXT_PUBLIC_API_URL + /v1/batches/ (pass through query params)

3. src/app/api/batches/[id]/route.ts
   - GET → fetch NEXT_PUBLIC_API_URL + /v1/batches/{id}

4. src/app/api/vendors/route.ts
   - GET → fetch NEXT_PUBLIC_API_URL + /v1/vendors/

5. src/app/api/insights/route.ts
   - GET ?batchId=X → POST to NEXT_PUBLIC_API_URL + /v1/insights/{batchId}

6. src/app/api/carbon/summary/route.ts
   - GET → aggregate carbon from backend for all batches

Each proxy route should:
- Handle errors gracefully (backend down → return 503 with message)
- Pass through query parameters
- Add BACKEND_API_KEY header if env var set
- Log errors server-side
- Have 10 second timeout

Also create: src/lib/backend.ts
A typed fetch client for the backend with:
- backendFetch(path, options) — base fetch with error handling
- getStats() → DashboardStats
- getBatches(filters) → BatchListResponse  
- getBatch(id) → BatchResponse
- getVendors() → VendorResponse[]
- postChat(message, conversationId) → ChatResponse
- getInsights(batchId) → InsightResponse

TypeScript strict, proper error types.
```

---

## PROMPT 7 — Wire Real-Time Anomaly Alerts to Dashboard

**The Problem:** The `AnomalyAlert` component on the dashboard exists but shows hardcoded/fake data. It needs to show real anomalies from actual batch processing.

**Paste this into Claude/Cursor:**

```
I have a Next.js 15 app with:
- src/features/dashboard/components/AnomalyAlert.tsx — component exists, shows fake data
- src/features/dashboard/hooks/useAnomalies.ts — hook exists but derives from mock
- src/features/dashboard/services/statsService.ts — fetches from /api/stats
- The /api/stats endpoint now returns data from FastAPI which includes alerts

The DashboardStats type should include:
anomalies: Array<{
  id: string
  batchCode: string
  stage: string
  type: 'high_loss' | 'abnormal_quantity' | 'missing_stage' | 'vendor_quality'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  detectedAt: string
  isResolved: boolean
}>

Please:
1. Update useAnomalies.ts to use SWR to fetch from /api/stats and extract anomalies
2. Rewrite AnomalyAlert.tsx to:
   - Display real anomalies grouped by severity (critical first)
   - Each alert card shows: severity badge (red/orange/yellow), batch code, stage, message
   - "Mark Resolved" button that calls DELETE /api/alerts/{id}
   - Empty state: "✅ No anomalies detected" with green checkmark
   - Auto-refresh every 30 seconds using SWR
   - Animate new alerts appearing (CSS animation)
   - Critical alerts pulse/flash to grab attention
   - Count badge in the section header

3. Also update src/features/dashboard/components/CompletenessScore.tsx to:
   - Show a circular progress indicator (CSS-based, no library needed)
   - Color: green (>80%), yellow (60-80%), red (<60%)
   - Tooltip explaining what completeness means
   - Show which batches are incomplete as a dropdown list

TypeScript strict, no any, mobile responsive.
```

---

## PROMPT 8 — AI Insights Working End-to-End

**The Problem:** The `InsightPanel` component shows "Select a batch to see insights". The insights endpoint exists on backend but is not properly connected and the frontend doesn't update the dashboard summary automatically.

**Paste this into Claude/Cursor:**

```
I have a Next.js 15 app and FastAPI backend.

Frontend: src/features/dashboard/components/InsightPanel.tsx
Currently shows static prompt to select a batch.
Uses: src/features/dashboard/hooks/useInsights.ts with SWR

Backend: POST /v1/insights/{batch_id} — calls AI to generate batch narrative
AI provider: Featherless.ai (configured, working)

Please:

1. Update src/features/dashboard/components/InsightPanel.tsx to:
   - On dashboard load, automatically fetch insights for the MOST RECENT batch
   - Show an AI-generated narrative summary in a nice card
   - Include: batch summary, efficiency rating, what went wrong, recommendation
   - "Refresh Insights" button to regenerate
   - Loading skeleton while AI generates
   - Show confidence score with explanation
   - Allow clicking different batches from a mini-list to switch insight view
   - Style: looks like a premium AI analysis card with subtle gradient border

2. Update src/features/dashboard/hooks/useInsights.ts to:
   - Accept optional batchId (default: fetch latest batch ID first)
   - Use SWR with 5min cache (insights don't need frequent refresh)
   - Handle loading, error, empty states

3. Also create: src/features/dashboard/components/AIBatchSummary.tsx
   This shows a single batch's complete AI narrative:
   - Material type and quantity
   - Journey timeline (which stages it passed through)
   - Efficiency score with visual indicator
   - "What happened" in plain English (from AI)
   - "What to improve" recommendation
   - Carbon impact for this specific batch
   - Data completeness badge

Make it look like a real AI product feature, not a prototype.
```

---

## PROMPT 9 — Seed Kaggle Dataset Into Database

**The Problem:** The Kaggle dataset transformer exists but the seed flow is not confirmed to work end-to-end. You need real data in the DB for demo.

**Paste this into Claude/Cursor:**

```
I have these existing files:
- frontend/src/infrastructure/db/seed/index.ts — seed entrypoint
- frontend/src/infrastructure/db/seed/kaggleTransformer.ts — transforms Kaggle data
- frontend/prisma/schema.prisma — has Batch, BatchStage, Vendor models
- frontend/prisma/seed.ts — seed runner

The Kaggle dataset CSV files are in /dataset/raw/ with columns like:
batch_id, material_type, vendor_name, collection_date, collection_qty_kg,
sorting_input_kg, sorting_output_kg, washing_input_kg, washing_output_kg,
shredding_input_kg, shredding_output_kg, melting_input_kg, melting_output_kg,
pelletizing_input_kg, pelletizing_output_kg, dispatch_qty_kg, dispatch_date, buyer_name

Please write a complete seed script at frontend/prisma/seed.ts that:

1. Reads CSV files from /dataset/raw/ using csv-parse or papaparse
2. Transforms each row into Prisma models:
   - Creates/upserts Vendor records
   - Creates Batch records with proper batchCode generation
   - Creates BatchStage records for each processing stage
   - Calculates loss_kg = input_kg - output_kg for each stage
   - Sets batch status based on which stages have data
3. Also creates 3 demo vendors: "Raju Traders", "Sharma Plastics", "Mumbai Collectors"  
4. Creates 2 months of realistic synthetic data IF CSV is missing:
   - 50 batches with realistic loss rates
   - Mix of PET (40%), HDPE (25%), PP (20%), LDPE (10%), PS (5%)
   - Normal batches: 8-15% total loss
   - 5 anomalous batches: 25-35% loss (for demo anomaly triggers)
5. Run with: npx prisma db seed
6. Print summary: "✅ Seeded X batches, Y vendors, Z stages"

Also install: npm install csv-parse

Make the synthetic data realistic — real kg amounts (100-2000kg batches),
real vendor names, realistic date distribution over past 60 days.
```

---

## PROMPT 10 — Polish: Wire Batch Filters + Vendor Scorecard Route

**The Problem:** `BatchFilters.tsx` has UI but is not wired to state. `VendorScorecard.tsx` exists but has no route to reach it.

**Paste this into Claude/Cursor:**

```
I have a Next.js 15 app. Two specific things need to be wired up:

TASK 1: Wire BatchFilters to actual query state

File: src/features/batches/components/BatchFilters.tsx
Currently: Has UI controls (material select, stage select, date inputs) but NOT wired to query

File: src/features/batches/hooks/useBatches.ts  
Currently: Fetches from /api/batches but ignores filter params

Please:
a) Add FilterState type: { material?: string, stage?: string, dateFrom?: string, dateTo?: string }
b) Update useBatches.ts to accept FilterState and include as query params in SWR key
c) Update BatchFilters.tsx to accept onFilterChange callback
d) Update BatchList.tsx to manage filter state with useState and pass to both BatchFilters and useBatches
e) Add clear filters button
f) Show active filter count badge on the filter button

TASK 2: Add Vendor Scorecard Route + Page

Currently: VendorScorecard component exists but no route
Currently: Vendor table shows list but clicking a vendor does nothing

Please:
a) Create: src/app/(dashboard)/vendors/[id]/page.tsx
   - Fetches vendor by ID from /api/vendors/{id}
   - Renders VendorScorecard component with real data
   - Shows vendor name in PageHeader
   - Breadcrumb: Vendors > {vendor name}

b) Update VendorTable.tsx to make each row clickable → navigate to /vendors/{id}

c) Update VendorScorecard.tsx to accept real data:
   Props: { vendor: VendorWithStats }
   Show: Overall score with circular grade indicator (A/B/C/D)
   Show: Quality score bar, Reliability score bar, Total batches
   Show: Recent 5 batches table with loss rates
   Show: Month-over-month trend mini sparkline

d) Add route constant to src/shared/constants/routes.ts:
   VENDOR_DETAIL: (id: string) => `/vendors/${id}`

TypeScript strict throughout.
```

---

## PROMPT 11 — Fix the Landing Page (Currently Default Next.js Page)

**The Problem:** `src/app/page.tsx` is the default Next.js starter page. Judges will see this first.

**Paste this into Claude/Cursor:**

```
I have a Next.js 15 app. The root page at src/app/page.tsx is the default Next.js starter page.

Please replace it with a professional landing/entry page for "TraceFlow" — an AI-powered 
plastic recycling traceability platform.

The page should:
1. Redirect authenticated users directly to /dashboard (use Next.js middleware or useEffect)
2. For unauthenticated users show:
   - Header with logo "TraceFlow" and "Get Started" button
   - Hero section: "Every kg of plastic has a story. We make it visible."
     Subtitle: "AI-powered traceability for recycling plants"
     CTA button: "Open Dashboard →" 
   - 3 feature cards: Conversational AI, Live Dashboard, Smart Alerts
   - Stats bar: "14,000+ plants need this" | "₹2B+ lost annually" | "97% undigitized"
   - Footer: "Built for Hackniche 4.0"

3. Design requirements:
   - Dark gradient background (slate-900 → slate-800)
   - Green accent color (#22c55e) for CTAs and highlights  
   - Use existing shared UI components (Button, Card)
   - Tailwind CSS only, mobile responsive
   - Smooth scroll and subtle animations on load
   - Professional enough to impress judges in the first 5 seconds

No auth library needed — just link to /dashboard for the CTA buttons.
Keep it clean and fast — this page must load in under 1 second.
```

---

## PROMPT 12 — The Demo Data Setup Script

**The Problem:** You need ONE script that sets up everything for a perfect demo in 2 minutes.

**Paste this into Claude/Cursor:**

```
Create a single Node.js script at scripts/setup-demo.ts (run with: npx tsx scripts/setup-demo.ts)

This script should:

1. Check Prisma connection is working
2. Clear existing data (with --fresh flag)
3. Seed these exact demo records:

VENDORS (3):
- "Raju Traders" (id: vendor-raju) — high quality supplier
- "Sharma Plastics" (id: vendor-sharma) — medium quality
- "Mumbai Collectors" (id: vendor-mumbai) — low quality (will trigger anomalies)

BATCHES (15 total, 2 months of data):
- 10 normal batches: 8-14% total loss, mix of PET/HDPE/PP
- 3 good batches: <8% loss (from Raju Traders — showcase good vendor)
- 2 anomaly batches: 25%+ loss at melting stage (from Mumbai Collectors — demo alert)

BATCH CODES: B-2026-001 through B-2026-015

Each batch should have complete BatchStage records for:
collection → sorting → washing → shredding → melting → pelletizing
(with realistic input/output kg values and timestamps spread over 60 days)

4. After seeding, print a demo checklist:
"✅ Demo ready! 
   - 15 batches loaded
   - 3 vendors configured  
   - 2 anomaly batches for demo (B-2026-011, B-2026-015)
   - Best demo batch: B-2026-003 (93% efficiency, Raju Traders)
   - Worst vendor: Mumbai Collectors (avg 28% loss)
   
🎯 Demo chat lines to type:
   1. 'Received 500 kg PET from Raju Traders today'
   2. 'Processed batch B-2026-015, input 400kg, output 290kg' ← triggers anomaly
   3. 'Which vendor has the highest loss rate?'
   4. 'How much carbon did we save this month?'"

TypeScript, uses @prisma/client, works with: npx tsx scripts/setup-demo.ts
```

---

# 📋 FINAL CHECKLIST — Does It Match the PS?

Run through this before submission:

## PS Deliverables Checklist
```
□ Conversational interface (text-based) 
  → Chat page at /chat with working NLP

□ Structured outputs (JSON) derived from user inputs
  → Chat response shows extracted JSON card in StructuredOutput component

□ Complete traceability dashboard or digital report
  → Dashboard at / with Sankey + charts + KPIs

□ Integration with mock or real backend system
  → FastAPI backend connected, real PostgreSQL data

□ Sample or assumed realistic datasets aligned with recycling workflows
  → Kaggle dataset seeded + synthetic demo data

□ Interactive dashboard showing end-to-end material lifecycle
  → Sankey diagram showing all 7 stages with loss nodes

□ AI-driven summaries and insights
  → InsightPanel shows AI narrative for each batch

□ Documentation of data assumptions
  → README.md + this prompt.md documents all assumptions

□ Rationale behind visualization choices
  → Sankey chosen for material flow, D3 for precision

□ Explanation of how AI improves transparency
  → Demo script explains: AI extracts data → saves → visualizes → insights
```

## Demo Must-Work Checklist
```
□ Type "Received 500kg PET from Raju" → logs + dashboard updates
□ Sankey diagram renders with real data (not placeholder)
□ Anomaly alert appears when processing batch with 25%+ loss
□ Ask "which vendor is worst?" → correct AI answer
□ Vendor scorecard page loads with real scores
□ Carbon savings number is non-zero
□ All 5 nav pages load without errors
□ No console errors in browser
□ Works on Chrome (what judges will use)
```