# 🔄 phases.md — Delivery Phases & What Gets Built When

---

## Phase 0: System Foundation (Hour 0–1)
**Owner:** All 4 team members in parallel  
**Goal:** Everyone has a working development environment and shared infrastructure

### What Gets Done
- [ ] GitHub repo created, everyone cloned locally
- [ ] Supabase project created, all 8 tables created (copy from schema.md)
- [ ] Clerk app created, frontend configured with Clerk provider
- [ ] Featherless.ai API key obtained and tested with a curl command
- [ ] Next.js running on :3000, FastAPI running on :8000
- [ ] Environment variables shared via secure channel (not GitHub)
- [ ] Kaggle dataset downloaded and in `/dataset/raw/`
- [ ] seed_data.py written and run → Supabase has real data

**Go/No-Go:** Can James log in via Clerk? Can Divya hit `/health` endpoint? Does Supabase have data?

---

## Phase 1: Conversational Ingestion Engine (Hour 1–5)
**Owner:** You (AI pipeline) + Divya (API + DB)  
**Goal:** Type a sentence → data appears in Supabase

### What Gets Done
- [ ] Featherless.ai + Instructor client setup (app/ai/client.py)
- [ ] Intent classifier working (data_entry vs query)
- [ ] Entity extractor working (material, quantity, vendor, stage)
- [ ] FastAPI POST /chat endpoint accepting text, returning structured JSON
- [ ] Supabase write operations working (batch creation, transaction logging)
- [ ] Chat response formatter (human-readable confirmation message)
- [ ] Basic anomaly check on every new transaction

### Test Criteria
Run `python scripts/test_nlp.py` — all 8 test sentences classified and extracted correctly.

---

## Phase 2: Visualization Intelligence (Hour 5–8)
**Owner:** Soham (design) + James (frontend) + Divya (analytics API)  
**Goal:** Beautiful Sankey diagram showing live data from Supabase

### What Gets Done
- [ ] `/analytics/lifecycle` endpoint returning Sankey-format JSON
- [ ] Sankey component rendering with Kaggle dataset data
- [ ] KPI cards: Total Received, Total Dispatched, Overall Efficiency, Carbon Saved
- [ ] Recharts bar chart: Material received by type, last 30 days
- [ ] Recharts line chart: Loss rate trend over time
- [ ] Dashboard layout complete with sidebar navigation
- [ ] Real-time Supabase subscription on batches table (Sankey updates live)

### Test Criteria
Type in chat → Sankey diagram width changes to reflect new entry.

---

## Phase 3: Insight Automation (Hour 8–10)
**Owner:** You + Divya  
**Goal:** System detects and explains anomalies automatically

### What Gets Done
- [ ] Anomaly detection service using normal_ranges.json thresholds
- [ ] Alert creation in Supabase alerts table when anomaly triggered
- [ ] AI-generated explanation for each alert (Featherless.ai call)
- [ ] Conversational query answering working:
    - "How much PET this week?" → correct answer
    - "Worst vendor?" → correct answer
    - "Carbon savings?" → correct answer
- [ ] Alert panel component on dashboard showing live alerts
- [ ] Vendor scoring algorithm producing scores

### Test Criteria
Process a batch with 28% loss → alert appears within 3 seconds with AI explanation.

---

## Phase 4: Integration & Polish (Hour 10–11)
**Owner:** All 4 members  
**Goal:** Everything connected end-to-end, looking professional

### What Gets Done
- [ ] All 5 pages working (Dashboard, Chat, Batches, Vendors, Reports)
- [ ] Loading states on all data fetches (TanStack Query)
- [ ] Error states handled gracefully (no white crashes)
- [ ] Motion animations on dashboard components
- [ ] Mobile responsive (at least on tablet size)
- [ ] Dark mode working (for projector demo)
- [ ] n8n webhook connected (anomaly alert triggers notification)
- [ ] Batch detail modal showing full lifecycle timeline

---

## Phase 5: Demo Storytelling (Hour 11–12)
**Owner:** All 4 members  
**Goal:** Zero surprises during the 3-minute presentation

### What Gets Done
- [ ] Kaggle data refreshed in Supabase — real numbers showing
- [ ] Demo batch B-007 pre-loaded with high loss rate (for anomaly demo)
- [ ] All 5 typing sequences tested 3 times each
- [ ] Full 3-minute demo rehearsed by presenting team member
- [ ] Backup screenshots folder on desktop
- [ ] Backup hotspot device ready
- [ ] Broken/incomplete features hidden behind "Coming Soon" pages
- [ ] Judge Q&A answers rehearsed
- [ ] README.md updated with project description for submission

---

## Feature Priority Tiers

### Must Have (Demo Fails Without These)
1. Chat interface with working NLP extraction
2. Sankey diagram with real data
3. At least one anomaly alert triggered during demo
4. KPI cards showing real numbers
5. Working login/auth

### Should Have (Significant Points If Present)
6. Conversational analytics queries
7. Vendor scorecard page
8. Carbon savings calculation
9. Real-time dashboard updates
10. AI-generated batch summary

### Nice to Have (Bonus Points)
11. n8n automation triggered during demo
12. Report generation (even basic PDF)
13. Mobile responsive layout
14. Batch detail modal
15. Data completeness scoring

### Cut These If Time Is Short
- User role management (just use one login)
- Multi-plant support (single plant only)
- Advanced filtering on batch list
- Export to CSV functionality
- Settings/configuration pages
