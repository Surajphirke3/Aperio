# 📄 prd.md — Product Requirements Document

---

## 🎯 Product Vision

**RecycLens** is the first conversational intelligence platform purpose-built for plastic recycling operations. We replace notebooks, Excel, and WhatsApp with an AI-native system that any worker can use in plain language, while giving managers real-time visibility into every kg of material in their plant.

**For:** Recycling plant managers, operators, compliance officers  
**Who need:** Real-time material traceability, automatic anomaly detection, compliance documentation  
**Our product:** A web platform with conversational AI + visual lifecycle dashboard  
**Unlike:** SAP EHS (too expensive), Excel macros (no intelligence), Recykal (marketplace only)  
**We provide:** End-to-end operational intelligence at 10× lower cost and 10× less complexity

---

## 👤 User Personas

### Persona 1: Prakash — Plant Operator (Primary)
- Age 28, works on the factory floor
- Uses WhatsApp daily but not comfortable with complex software
- Logs 10-20 material movements per shift
- **Pain:** "Filling forms takes 30 minutes per shift. I forget to fill them sometimes."
- **Need:** Log data in 10 seconds, in language I speak naturally

### Persona 2: Sunita — Plant Manager
- Age 45, manages 40 workers, responsible for profitability
- Reviews reports weekly, makes vendor decisions
- **Pain:** "I don't know why we lost 30% of material last month."
- **Need:** Live dashboard showing efficiency, instant anomaly alerts

### Persona 3: Ramesh — Compliance Officer
- Age 38, responsible for regulatory documentation
- Submits quarterly reports to CPCB, BIS
- **Pain:** "Preparing one compliance report takes 3 days of data collection."
- **Need:** Auto-generated traceability reports, one-click export

---

## 📋 Core Features — V1

### Feature 1: Conversational Batch Logging
**Description:** Users log material movements in natural language via a chat interface  
**Acceptance Criteria:**
- [ ] Correctly extracts material type (PET/HDPE/PP/LDPE/PS/Mixed) from 90%+ of inputs
- [ ] Correctly extracts quantity (handles kg, tons, quintals) from 95%+ of inputs
- [ ] Correctly identifies vendor name from 85%+ of inputs
- [ ] Response time under 5 seconds for 95% of requests
- [ ] Returns confidence score on every extraction
- [ ] Flagged low-confidence entries (< 0.7) for human review

### Feature 2: Sankey Lifecycle Dashboard
**Description:** D3.js Sankey diagram showing material flow from collection to dispatch  
**Acceptance Criteria:**
- [ ] Updates within 3 seconds of new data entry
- [ ] Shows all 7 stages: collection, sorting, washing, shredding, melting, pelletizing, dispatch
- [ ] Loss nodes shown in red/amber color
- [ ] Total input and output displayed
- [ ] Overall efficiency percentage calculated correctly
- [ ] Hovering on a node shows detailed quantity breakdown

### Feature 3: KPI Cards
**Description:** Real-time metrics at the top of the dashboard  
**Acceptance Criteria:**
- [ ] Total Received (kg) — current month
- [ ] Total Dispatched (kg) — current month
- [ ] Efficiency Percentage — correct calculation
- [ ] Carbon Saved (kg CO₂) — using emission factors
- [ ] Active Batches — batches not yet dispatched
- [ ] Open Alerts — unresolved anomaly count

### Feature 4: Anomaly Detection & Alerts
**Description:** Rule-based engine detects unusual patterns and alerts managers  
**Acceptance Criteria:**
- [ ] Triggers alert when loss percentage exceeds stage-specific threshold
- [ ] Alert includes severity (low/medium/high/critical)
- [ ] AI-generated explanation generated within 5 seconds of alert
- [ ] Alert visible in dashboard within 3 seconds of trigger
- [ ] Alerts can be marked as resolved
- [ ] n8n webhook fires when critical alert generated

### Feature 5: Conversational Analytics
**Description:** Ask questions about plant performance in plain English  
**Acceptance Criteria:**
- [ ] Correctly answers "how much [material] received [time period]"
- [ ] Correctly identifies worst/best performing vendor
- [ ] Correctly returns carbon savings for time period
- [ ] Response includes actual numbers from database
- [ ] Response time under 8 seconds

### Feature 6: Vendor Scorecard
**Description:** Automatic scoring and ranking of all material vendors  
**Acceptance Criteria:**
- [ ] Score calculated from: material quality (purity), loss rate caused, supply consistency
- [ ] Ranked table of all vendors with scores
- [ ] Individual vendor page with historical performance charts
- [ ] Score updates automatically as new transactions are logged

### Feature 7: Carbon Impact Tracker
**Description:** Calculates and displays environmental impact of recycling operations  
**Acceptance Criteria:**
- [ ] CO₂ saved per batch calculated using emission factors
- [ ] Monthly and cumulative CO₂ savings displayed
- [ ] "Equivalent trees planted" metric shown
- [ ] Carbon savings broken down by plastic type

---

## 🚫 V1 Explicitly Out of Scope
- Multi-plant / multi-organization support (V2)
- Voice input (V2)
- Mobile app (V2)
- Blockchain traceability (V3)
- Carbon credit generation (V3)
- Third-party ERP integration (V2)
- IoT sensor integration (V3)
- Advanced ML predictive models (V2)

---

## ⚙️ Technical Constraints

| Constraint | Specification | Why |
|-----------|--------------|-----|
| AI Model Size | ≤ 3.8B parameters | Hackathon requirement + affordable API cost |
| Response Time | < 5 seconds for AI, < 500ms for DB queries | UX requirement |
| Browser Support | Chrome, Safari, Firefox — latest 2 versions | Target user devices |
| Mobile Responsive | Tablet-first (768px+), phone (375px+) | Factory floor tablet use |
| Authentication | Clerk JWT — all routes protected | Security |
| Database | Supabase PostgreSQL | Real-time capability |
| Offline | Graceful degradation (cached data shown if API fails) | Hackathon WiFi risk |

---

## 🎨 Design Principles

1. **Data Forward** — Numbers and charts are the hero, not decorative elements
2. **Status at a Glance** — Manager should know plant health in 3 seconds of looking at dashboard
3. **Conversation Feels Natural** — Chat should feel like texting, not filling a form
4. **Color Communicates** — Green = good, Amber = warning, Red = critical. Always.
5. **Dense but Not Cluttered** — Industrial users need information density. Not the same as clutter.

---

## 📊 Success Metrics (Post-Hackathon)

| Metric | Target | Measurement |
|--------|--------|-------------|
| NLP Extraction Accuracy | > 90% | Manual review of 50 test sentences |
| Dashboard Load Time | < 2 seconds | Chrome DevTools |
| Real-time Update Latency | < 500ms | Supabase → Frontend |
| Anomaly Detection Accuracy | > 80% | Compare against manually flagged dataset |
| Judge Score | Top 3 | Hackathon results |
