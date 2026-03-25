# ⚙️ process.md — How Your Team Operates During the Hackathon

---

## 🧠 Core Philosophy: Integration-First

The biggest mistake teams make in hackathons is building 4 perfect isolated pieces that don't work together until hour 11.

**Our approach:** Get a thin, ugly, working end-to-end path working by Hour 3. Then make it beautiful and feature-rich.

```
Hour 0-3: UGLY but CONNECTED
  Type → Backend → Supabase → Frontend shows something
  
Hour 3-9: REAL FEATURES added on top of working foundation

Hour 9-11: POLISH everything

Hour 11-12: FREEZE and REHEARSE
```

---

## 👥 Communication Protocol

### Daily Sync Schedule
```
Hour 0    → 15-min kickoff: who owns what, integration contracts defined
Hour 3    → 10-min checkpoint: is the foundation working?
Hour 6    → 10-min checkpoint: are features connecting?
Hour 9    → 15-min checkpoint: demo run-through
Hour 11   → Final freeze, full demo rehearsal
```

### How to Communicate Blockers
Don't sit stuck for more than 20 minutes. If blocked:
1. Check if the issue is in YOUR code or the integration
2. Post in team WhatsApp: "🚨 BLOCKED: [describe issue] - need [what you need]"
3. Move to next task while blocker is resolved

### Git Strategy
```bash
main branch        → Always working, demo-safe
dev branch         → Integration, tested before merge to main
feature/your-name  → Your individual work

Merge rule: Only merge to main when it doesn't break existing demo
Every hour: each person commits + pushes their branch
```

---

## 🎯 Feature Priority Framework

When deciding what to build, score each feature:

| Score Question | Weight |
|----------------|--------|
| Does this appear in the judge's 3-minute view? | 40% |
| Is this mentioned in the PS requirements? | 30% |
| Can we build it in < 2 hours? | 20% |
| Does it create a "WOW moment" in demo? | 10% |

Features scoring > 7/10 → BUILD  
Features scoring 5-7 → BUILD if time allows  
Features scoring < 5 → CUT

---

## 🔄 Integration Contracts

These are the agreements between team members on API shapes. Set these at Hour 0 and don't change them.

### Contract 1: Chat API (You ↔ James)
```typescript
// What James sends:
POST /api/chat
{ "message": string, "conversation_id": string }

// What You return:
{
  "message": string,          // Human readable response
  "intent": string,           // "data_entry" | "analytics" | "batch_query"
  "entry": {                  // Only if data_entry
    "material_type": string,
    "quantity_kg": number,
    "vendor_name": string | null,
    "batch_code": string,
    "confidence": number
  } | null,
  "alert": {                  // Only if anomaly detected
    "type": string,
    "severity": string,
    "description": string
  } | null
}
```

### Contract 2: Analytics API (Divya ↔ Soham/James)
```typescript
// Lifecycle data for Sankey (Divya provides, Soham consumes)
GET /api/analytics/lifecycle?period=30d
Response: {
  nodes: Array<{ id: string, name: string, value: number }>,
  links: Array<{ source: string, target: string, value: number }>,
  total_input_kg: number,
  total_output_kg: number,
  overall_efficiency_percentage: number
}

// KPI Cards
GET /api/analytics/kpis
Response: {
  total_received_kg: number,
  total_dispatched_kg: number,
  efficiency_percentage: number,
  carbon_saved_kg: number,
  active_batches: number,
  alerts_count: number
}
```

---

## 🧪 Testing Checklist

### Before Every Integration Merge
```bash
# Backend tests
python scripts/test_nlp.py     # All sentences extract correctly
pytest tests/ -x               # No failing tests

# Frontend tests  
# Open browser, manually test:
# 1. Can you log in?
# 2. Does the dashboard load with data?
# 3. Does typing in chat work?
# 4. Does the Sankey update after entry?
```

### Demo Dry Run Checklist (Hour 11)
```
□ Type "Received 500 kg PET from Raju today" → logs correctly
□ Dashboard Sankey updates within 3 seconds
□ Type "Processed batch B007, 400kg in, 300kg out" → alert appears
□ Type "Which vendor had most waste this month?" → correct answer
□ Click through all 5 pages → nothing is broken or 404
□ Try on a different browser (Chrome + Safari)
□ Try on mobile screen size
```

---

## 🚀 Deployment Workflow

### For Hackathon (Simple)
```bash
# Frontend → Vercel (takes 2 minutes)
cd recyclens-frontend
vercel --prod

# Backend → Railway (takes 5 minutes)
# 1. Push to GitHub
# 2. Connect Railway to GitHub repo
# 3. Set environment variables in Railway dashboard
# 4. Deploy

# Get your live URLs and update NEXT_PUBLIC_API_URL
```

### Dockerfile for Backend (Railway needs this)
```dockerfile
FROM python:3.13-slim

WORKDIR /app
COPY pyproject.toml .
RUN pip install uv && uv sync

COPY . .
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 📝 What to Submit

Most hackathons require:
- [ ] GitHub repo link (make it public before submission)
- [ ] Live demo URL (Vercel frontend)
- [ ] 3-minute demo video (record screen + audio as backup)
- [ ] Project description / README

### README.md Template
```markdown
# RecycLens — Circular Economy Intelligence Platform

**Hackniche 4.0 | ML PS 1**

## Problem
14,000 recycling plants in India operate with notebooks and WhatsApp.
₹2B+ in material value lost annually due to zero traceability.

## Solution
Conversational AI + Visual lifecycle dashboard + Anomaly detection

## Tech Stack
- Frontend: Next.js 15, Tailwind v4, shadcn/ui, D3.js, Recharts
- Backend: Python FastAPI, Instructor, LangGraph
- AI: Featherless.ai (Phi-4 Mini 3.8B)
- Database: Supabase (PostgreSQL + Real-time)
- Auth: Clerk
- Automation: n8n workflows

## Team
- [Your Name] — Full Stack + AI Architecture
- Divya — Backend Systems
- Soham — Design + AI Automation  
- James — Frontend Integration

## Live Demo
https://recyclens.vercel.app

## Video Demo
[Link to video]
```
