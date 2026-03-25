# 🗺️ plan.md — Strategic Execution Blueprint

> **This is your war room document.** Read this before writing a single line of code.

---

## 🎯 Project Vision

**Name:** RecycLens — The Circular Economy Intelligence Platform

**Tagline:** *"Every kg of plastic has a story. We make it visible."*

**Mission:** Give recycling plants the same data intelligence that Fortune 500 companies have — through a conversational interface anyone can use, on hardware anyone has.

---

## 🧠 Why This Is Disruptive

Traditional approach to recycling data:
```
Worker fills paper form → Supervisor collects forms → 
Data entry person types into Excel → Manager reads Excel → 
No insights, wrong numbers, 3-day delay
```

Our approach:
```
Worker types natural sentence → AI extracts data instantly → 
Dashboard updates live → AI flags anomalies immediately → 
Manager acts in minutes not days
```

**The disruption:** We removed 4 manual steps and added AI intelligence. The barrier to entry for any plant worker drops from "knows Excel + data entry" to "can type or speak a sentence."

---

## 🎓 SMART Objectives

### Technical Objectives
| Objective | Measurable Target | Timeline |
|-----------|-------------------|---------|
| NLP extraction accuracy | >90% correct entity extraction | Hour 6 |
| Dashboard load time | <2 seconds | Hour 10 |
| Real-time update latency | <500ms after entry | Hour 8 |
| Conversational query accuracy | >85% correct data retrieval | Hour 10 |
| Anomaly detection precision | >80% (on test dataset) | Hour 10 |

### Demo Objectives
| Objective | Target |
|-----------|--------|
| End-to-end demo time | Under 3 minutes |
| Number of "WOW moments" | At least 3 visible reactions |
| Features working live | 5 of 7 core features |
| Demo crash risk | Near zero (cached data fallback) |

### Business Objectives
| Objective | Target |
|-----------|--------|
| Problem clarity for judges | Judges understand problem in 30 seconds |
| Market opportunity conveyed | ₹2B+ loss framing lands |
| Technical complexity scored | LLM + Supabase RT + Sankey = high score |
| Team synergy visible | Seamless handoffs during presentation |

---

## 👥 Team Role Matrix

### You — Full Stack Lead + AI Architect
**Your Identity in This Project:** The person who makes everything talk to everything. You own the AI pipeline and the glue between frontend and backend.

| Hour | Task | Output |
|------|------|--------|
| 0–1 | Supabase schema setup, Clerk config, env vars for all | Working auth + DB |
| 1–3 | FastAPI skeleton + all API endpoints (stubs OK) | `/chat`, `/batches`, `/analytics`, `/vendors` |
| 3–5 | Featherless.ai + Instructor integration | NLP → JSON pipeline working |
| 5–7 | LangGraph conversational pipeline | Intent detection + query answering |
| 7–9 | Connect frontend ↔ backend ↔ Supabase | Full data flow working |
| 9–11 | Anomaly detection engine | Alerts generating correctly |
| 11–12 | Demo prep + bug fixes | Everything stable |

**Your Risk Areas:**
- Featherless.ai API rate limits → Pre-cache common responses
- LangGraph setup complexity → Have simple if/else fallback ready

---

### Divya — Backend Systems Engineer
**Your Identity:** The person who makes the data layer bulletproof. You own everything from FastAPI endpoints to Supabase queries.

| Hour | Task | Output |
|------|------|--------|
| 0–1 | uv project setup, FastAPI boilerplate, folder structure | Running FastAPI server |
| 1–3 | Supabase client setup, all CRUD operations | DB read/write working |
| 3–5 | Analytics service (Polars) — batch stats, loss calculations | Analytics endpoints |
| 5–7 | Vendor scoring algorithm | Vendor leaderboard data |
| 7–9 | Carbon impact calculation service | CO₂ metrics per batch |
| 9–11 | n8n webhook integration + anomaly alert trigger | Alerts flowing |
| 11–12 | API stress testing + edge cases | Stable API |

**Your Risk Areas:**
- Supabase connection issues → Have local SQLite fallback schema ready
- Complex SQL queries timing out → Use Polars for heavy analytics instead

---

### Soham — Design Lead + AI Automation
**Your Identity:** The person who makes judges stare at the screen. You own the visual language and the n8n automation flows.

| Hour | Task | Output |
|------|------|--------|
| 0–1 | Design system setup (colors, fonts, shadcn theme) | Consistent visual identity |
| 1–3 | Dashboard layout — sidebar, header, main content area | Shell of the app |
| 3–5 | Sankey diagram component with mock data | Visual WOW moment ready |
| 5–7 | KPI cards, chart components, alert panels | Dashboard fully designed |
| 7–9 | Chat interface UI (left panel) | Conversational input ready |
| 9–10 | n8n workflow setup (daily summary + anomaly alert) | Automations running |
| 10–12 | Polish, animations (Motion), demo data visual check | Everything looks ✨ |

**Your Risk Areas:**
- Sankey diagram data format issues → Use hardcoded demo data first, connect live data last
- n8n setup time → Do this in parallel, not blocking UI work

---

### James — Frontend Integration Lead
**Your Identity:** The person who brings Soham's designs to life and connects everything to the backend.

| Hour | Task | Output |
|------|------|--------|
| 0–1 | Next.js setup + Clerk integration + TanStack Query setup | Auth working in browser |
| 1–3 | Routing structure, layout components, navigation | App navigation working |
| 3–5 | Chat interface — input, message history, response display | Chat UI functional |
| 5–7 | Dashboard page — connect charts to real API data | Live charts |
| 7–9 | Batch list page + batch detail modal | Batch management UI |
| 9–10 | Vendor scorecard page + alerts panel | Supporting pages |
| 10–12 | Responsive fixes + loading states + error handling | Production feel |

**Your Risk Areas:**
- TanStack Query complexity → Have simple useEffect + fetch fallback
- Real-time Supabase subscriptions tricky → Use polling every 5s as fallback

---

## ⏰ Hackathon Timeline — Hour by Hour

### Phase 0: Setup Sprint (Hour 0–1)
**Goal:** Everyone has a running development environment.

```
All 4 people simultaneously:
✅ Create GitHub repo, everyone clones
✅ You: Supabase project created, tables created, env vars shared
✅ You: Clerk app created, keys shared
✅ Divya: uv project, FastAPI running on localhost:8000
✅ James: Next.js running on localhost:3000, Clerk working
✅ Soham: shadcn initialized, design tokens configured
✅ Featherless.ai API key tested with simple curl
```

**Go/No-Go Check at Hour 1:**
- [ ] Can Divya hit `GET /health` and get `{"status": "ok"}`?
- [ ] Can James see a Clerk login screen?
- [ ] Does Supabase have at least 3 tables created?

---

### Phase 1: Core Build (Hour 1–6)
**Goal:** NLP pipeline working + basic data flow established.

```
Hour 2 checkpoint: Divya has all API routes returning mock data
Hour 4 checkpoint: You have NLP extracting correct JSON from test sentences
Hour 6 checkpoint: James can type in chat, see response, data in Supabase
```

**Critical path:** NLP pipeline → API endpoint → DB save → Response. Everything else is secondary.

---

### Phase 2: Visualization (Hour 6–9)
**Goal:** Sankey diagram live + dashboard showing real data.

```
Hour 7 checkpoint: Sankey diagram rendering with Kaggle dataset data
Hour 8 checkpoint: All KPI cards showing real numbers
Hour 9 checkpoint: Real-time update working (enter data → chart updates)
```

---

### Phase 3: Intelligence Layer (Hour 9–11)
**Goal:** Anomaly detection + conversational queries working.

```
Hour 10 checkpoint: Anomaly alert triggers when loss > 20%
Hour 11 checkpoint: "Which vendor had most waste?" returns correct answer
```

---

### Phase 4: Demo Prep (Hour 11–12)
**Goal:** Zero surprises during demo.

```
✅ Load Kaggle data into Supabase (real numbers)
✅ Pre-type 3 demo sentences, confirm AI extracts correctly
✅ Screenshot backup of every page ready
✅ Practice demo script 3 times as a team
✅ Disable any half-built features (hide broken pages)
✅ Test on a different laptop if possible
```

---

## 🔗 Integration Checkpoints

These are the moments where your individual work must connect. Plan these explicitly:

| Checkpoint | Who Meets | What Must Work |
|-----------|-----------|----------------|
| Hour 3 | You + Divya | POST /chat accepts text, returns JSON |
| Hour 6 | You + James | Chat UI sends message, gets AI response, shows in UI |
| Hour 7 | Divya + Soham | Sankey gets real data from `/analytics/lifecycle` endpoint |
| Hour 9 | All 4 | Full flow: Type → AI extract → DB save → Dashboard updates |
| Hour 11 | All 4 | Demo run-through — full 3 minutes |

---

## 📁 Resource Stack

### Kaggle Dataset
URL: https://www.kaggle.com/datasets/synapsehackniche/hackniche-4-0-ps-3-dataset

**Download this BEFORE the hackathon starts.** Don't depend on Kaggle being accessible during the hackathon.

**What's in the dataset:**
- Material collection records
- Processing batch data
- Vendor transaction history
- Dispatch records

**How to use it:**
1. Download CSV files
2. Write a Python script (`seed_data.py`) to load into Supabase
3. Run it at Hour 1 so everyone has real data to work with

### AI Model
- Primary: `microsoft/Phi-4-mini-instruct` on Featherless.ai
- Fallback: `Qwen/Qwen2.5-3B-Instruct` on Featherless.ai

### Carbon Emission Factors (Static Data)
```python
EMISSION_FACTORS = {
    "PET": {"collection": 0.042, "processing": 0.31, "recycling": 0.87},
    "HDPE": {"collection": 0.038, "processing": 0.28, "recycling": 0.79},
    "LDPE": {"collection": 0.041, "processing": 0.29, "recycling": 0.83},
    "PP": {"collection": 0.039, "processing": 0.27, "recycling": 0.81},
    "PS": {"collection": 0.044, "processing": 0.33, "recycling": 0.91},
}
# Values in kg CO2 per kg of plastic processed
# Source: PlasticsEurope Eco-profiles 2023
```
