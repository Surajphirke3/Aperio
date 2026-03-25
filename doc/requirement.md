# 📋 requirement.md — What Problem Are We Solving & Why It Matters

> **Read this first.** This document explains the real-world problem in plain English, who suffers from it, and why building this solution matters beyond the hackathon.

---

## 🌍 The Real World Problem — Explained Simply

Imagine you run a recycling plant. Every day, trucks come in carrying bags of plastic waste. Workers sort it, clean it, melt it, and turn it into recycled plastic granules that factories buy.

Here's the problem: **nobody really knows what happened to the plastic along the way.**

- How much plastic came in today? Recorded in a notebook. Maybe.
- How much was lost during melting? Unknown.
- Which vendor sent the cleanest plastic? No idea.
- Can you prove to a government inspector that your recycling was done right? Not really.

This is the reality for **95% of recycling plants in India and Southeast Asia** — they are running a multi-crore operation on pen-and-paper records, WhatsApp messages, and gut feelings.

---

## 🔥 Why This Is a Massive Problem

### Problem 1 — Material Loss Nobody Can Explain
When 1,000 kg of plastic enters the plant and only 600 kg leaves as recycled granules, where did the other 400 kg go?

- Some was contamination (dirt, food residue)
- Some evaporated during processing
- Some was rejected for being the wrong type
- Some was... stolen? Miscounted? Nobody knows.

**Impact:** Plants lose 20–40% of material value and cannot identify where. At ₹80/kg for recycled PET, losing 400 kg per truck means ₹32,000 vanishes — per truck, per day.

### Problem 2 — No Proof for Regulators & Buyers
Large companies like Unilever, Reliance, and Tata increasingly need **certified recycled plastic** with full documentation:
- Where was it collected?
- What type is it?
- Was processing done cleanly?
- What's the carbon footprint?

Without traceability documentation, recycling plants **cannot sell to premium buyers** who pay 40–60% more for certified material.

### Problem 3 — Manual Entry Is Killing Efficiency
Workers spend 2–3 hours/day filling forms, copying data from notebooks into Excel, and calling each other to confirm numbers. This time costs money and introduces errors.

### Problem 4 — No Intelligence, No Improvement
Without data, plant managers cannot answer basic questions:
- "Which plastic type gives us the best profit margin?"
- "Which vendor's material is causing the most processing loss?"
- "Are we improving month over month?"

---

## 👥 Who Are Our Users?

| User | Their Pain | What They Need |
|------|-----------|----------------|
| **Plant Manager** | Doesn't know daily efficiency metrics | Live dashboard with KPIs |
| **Data Entry Operator** | Spends hours typing into forms | Just talk to a chatbot, it records everything |
| **Compliance Officer** | Cannot generate audit reports quickly | Auto-generated traceability reports |
| **Sustainability Analyst** | No carbon data available | Automatic CO₂ impact calculations |
| **Vendor Manager** | No data on which vendors are reliable | Vendor performance scorecards |
| **Finance Team** | Cannot reconcile material vs revenue | Lifecycle loss & revenue tracking |

---

## 💡 Our Solution — In One Sentence

> **A platform where any recycling plant worker can type or speak in plain language to log operations, and instantly get a beautiful visual dashboard showing where every kg of plastic went — with AI-powered insights explaining what went wrong and how to improve.**

---

## 🏭 How Our Platform Works — Simple Flow

```
Worker types: "Received 500kg PET from Vendor Raju today"
        ↓
AI understands: material=PET, quantity=500kg, vendor=Raju, action=received
        ↓
Database saves it automatically
        ↓
Dashboard updates: new batch appears in lifecycle flow
        ↓
Worker types: "Processed batch B12, got 380kg output, 120kg waste"
        ↓
AI detects: 24% loss rate → ANOMALY ALERT (normal is 15%)
        ↓
Manager sees red alert: "Batch B12 has abnormal loss — investigate"
        ↓
Weekly report auto-generates: full lifecycle, carbon savings, vendor scores
```

---

## 📊 What "Traceability" Actually Means

Traceability = **the ability to track a material from birth to death.**

For plastic, that journey is:

```
Collection Point → Weighing → Sorting → Washing → Shredding → Melting → Pelletizing → Quality Check → Dispatch
```

Our platform creates a **digital twin** of this physical journey. Every kg of plastic has a story. Our job is to record and visualize that story.

---

## 🎯 What We Are Building — Feature List in Plain English

### Feature 1: Talk to Log (Conversational Data Entry)
Instead of filling a 20-field form, workers just type naturally:
- *"Got 300 kg of HDPE from Mumbai Scrap Dealer"*
- *"Finished processing Batch 7, output was 240 kg"*
- *"Dispatched 500 kg PET granules to ABC Plastics factory"*

The AI extracts all the data and saves it. No forms. No training needed.

### Feature 2: The Lifecycle Map (Sankey Diagram)
A flowing visual diagram that shows how plastic moves through your plant. You can see at a glance:
- How much came in
- Where losses happened (shown in red)
- How much went out as finished product

### Feature 3: Smart Alerts (Anomaly Detection)
The system learns what "normal" looks like. When something unusual happens:
- Loss rate is higher than usual
- A vendor's material quality drops
- Processing time is taking too long

It sends an alert and explains why it's unusual.

### Feature 4: Ask Questions (Conversational Analytics)
Managers can ask questions in plain English:
- *"How much plastic did we receive last week?"*
- *"Which vendor had the most waste this month?"*
- *"What's our carbon savings this quarter?"*

The AI answers with real data from your records.

### Feature 5: Carbon Impact Tracker
Every kg of recycled plastic saves CO₂ compared to making virgin plastic. We calculate and display:
- Total CO₂ saved this month
- Equivalent trees planted
- Carbon credit value estimate

### Feature 6: Vendor Scorecard
Automatic scoring of every vendor based on:
- Material quality (purity)
- Consistency of supply
- Loss rate their materials cause
- On-time delivery

### Feature 7: Auto-Generated Reports
One click → full PDF/dashboard report showing:
- Complete material lifecycle
- Financial summary
- Compliance documentation
- AI narrative explanation

---

## 🔗 Why This Hackathon PS Fits Perfectly

The problem statement asks for exactly what we described:
- ✅ Conversational AI for natural language data entry
- ✅ AI-driven data interpretation and insights
- ✅ Interactive visual dashboards for lifecycle reporting
- ✅ Structured output from conversational input
- ✅ Integration with backend data systems
- ✅ Non-technical users can understand the output

---

## 🏆 Why We Will Win

1. **Real dataset provided** — We're not making up numbers, judges can verify
2. **Locally runnable AI** — Featherless.ai API + small model, no demo failures
3. **Visual WOW factor** — Sankey diagram + live updates will stop judges in their tracks
4. **Complete end-to-end story** — Input → Processing → Output → Insights
5. **Climate impact narrative** — ESG/sustainability angle resonates with every judge in 2026
