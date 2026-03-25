# 🏗️ architecture.md — System Design & Data Flow

---

## 🗺️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              NEXT.JS 15 FRONTEND                        │   │
│  │                                                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │   DASHBOARD  │  │    CHAT UI   │  │   BATCHES    │  │   │
│  │  │  Sankey D3   │  │  Chat Input  │  │   List View  │  │   │
│  │  │  Recharts    │  │  AI Response │  │  Detail Modal│  │   │
│  │  │  KPI Cards   │  │  Confirm Box │  │              │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  │                                                         │   │
│  │  [Clerk Auth] [TanStack Query] [Zustand] [Motion]       │   │
│  └───────────────────────┬─────────────────────────────────┘   │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTP + WebSocket
           ┌───────────────┼───────────────────────────┐
           │               │                           │
           ▼               ▼                           ▼
┌──────────────────┐  ┌──────────────┐  ┌─────────────────────┐
│   FASTAPI        │  │   SUPABASE   │  │   FEATHERLESS.AI    │
│   BACKEND        │  │   DATABASE   │  │   LLM API           │
│                  │  │              │  │                     │
│ /api/chat        │  │ PostgreSQL   │  │ Phi-4 Mini 3.8B    │
│ /api/batches     │  │ Real-time    │  │ OpenAI Compatible  │
│ /api/analytics   │  │ Row Security │  │ Instructor JSON    │
│ /api/vendors     │  │ 8 Tables     │  │                     │
│ /api/reports     │  │              │  │ Fallback:          │
│                  │  │ Direct RT    │  │ Qwen 2.5 3B        │
│ LangGraph        │  │ subscriptions│  │                     │
│ Instructor       │  │ from frontend│  │                     │
│ Polars Analytics │  │              │  │                     │
│ Anomaly Engine   │  └──────────────┘  └─────────────────────┘
└──────────┬───────┘          │
           │                  │ Real-time
           │             ┌────▼─────┐
           │             │ FRONTEND │
           │             │ updates  │ ← Dashboard updates without
           │             │ live     │   page refresh
           │             └──────────┘
           │
           ▼
┌──────────────────┐
│   N8N WORKFLOWS  │
│                  │
│ Daily summary →  │
│   Email/WhatsApp │
│                  │
│ Anomaly alert →  │
│   WhatsApp push  │
│                  │
│ Weekly report →  │
│   PDF + email    │
└──────────────────┘
```

---

## 🔄 Data Flow — Chat Message Lifecycle

Every time a user sends a message, this is exactly what happens:

```
Step 1: User types message in browser
        "Received 500 kg PET from Raju today"
                    ↓
Step 2: Frontend (TanStack Query) sends POST to FastAPI
        POST /api/chat
        Body: { "message": "Received 500 kg PET from Raju today" }
        Headers: { "Authorization": "Bearer <Clerk JWT>" }
                    ↓
Step 3: FastAPI middleware validates Clerk JWT
        "Is this user allowed to access this plant's data?"
                    ↓
Step 4: LangGraph pipeline starts
        Node 1: Intent Classification
        → Featherless.ai Phi-4 Mini: "Is this data_entry or a query?"
        → Result: { intent: "data_entry", confidence: 0.97 }
                    ↓
Step 5: Entity Extraction (since it's data_entry)
        Node 2: Extract structured data
        → Featherless.ai Phi-4 Mini + Instructor
        → Result: {
            action: "received",
            material_type: "PET",
            quantity_kg: 500.0,
            vendor_name: "Raju",
            date: "2026-03-25",
            confidence: 0.97
          }
                    ↓
Step 6: Database Operations (Supabase via Python client)
        → Create batch record (if new): batch_code = "B-2026-047"
        → Create transaction record: stage=collection, input=500kg
        → Find/create vendor: "Raju"
        → Update batch status
                    ↓
Step 7: Anomaly Check
        → Is 500kg collection unusual for this vendor? → No
        → Any threshold violations? → No
        → No alert generated
                    ↓
Step 8: Carbon Calculation
        → 500kg PET received
        → CO₂ saved (vs virgin) = 500 × 2.15 = 1,075 kg CO₂
                    ↓
Step 9: Generate human response
        → "✅ Logged! Batch B-2026-047 created: 500 kg PET received from Raju today.
            Carbon savings: 1,075 kg CO₂. Confidence: 97%"
                    ↓
Step 10: Return to frontend
         { message: "✅ Logged! ...", entry: {...}, batch: {...} }
                    ↓
Step 11: Frontend displays confirmation card
         Supabase real-time subscription fires
         Dashboard Sankey updates automatically
         KPI "Total Received" card increments
```

---

## 🤖 LangGraph Pipeline Structure

```python
# How the AI pipeline is structured as a graph

from langgraph.graph import StateGraph
from typing import TypedDict

class PipelineState(TypedDict):
    input: str
    intent: str | None
    extracted_data: dict | None
    db_result: dict | None
    anomalies: list | None
    response: str | None

# Build the graph
workflow = StateGraph(PipelineState)

# Add nodes (each is a function)
workflow.add_node("classify_intent", classify_intent_node)
workflow.add_node("extract_data", extract_data_node)
workflow.add_node("answer_query", answer_query_node)
workflow.add_node("save_to_db", save_to_db_node)
workflow.add_node("check_anomalies", check_anomalies_node)
workflow.add_node("generate_response", generate_response_node)

# Define edges (conditional routing)
workflow.set_entry_point("classify_intent")

workflow.add_conditional_edges(
    "classify_intent",
    route_by_intent,  # Function that returns next node name
    {
        "data_entry": "extract_data",
        "analytics": "answer_query",
        "batch_query": "answer_query",
        "general": "generate_response"
    }
)

workflow.add_edge("extract_data", "save_to_db")
workflow.add_edge("save_to_db", "check_anomalies")
workflow.add_edge("check_anomalies", "generate_response")
workflow.add_edge("answer_query", "generate_response")
workflow.set_finish_point("generate_response")

app_graph = workflow.compile()
```

---

## 🔐 Authentication Flow (Clerk + FastAPI)

```
User visits app → Clerk shows login page
User logs in → Clerk issues JWT token
Frontend stores JWT → Sent in every API request header

FastAPI receives request:
├── Extract JWT from Authorization header
├── Verify JWT signature using Clerk public key
├── Extract user_id from JWT claims
├── Query Supabase: SELECT plant_id FROM users WHERE clerk_user_id = ?
├── Attach plant_id to request context
└── All DB queries automatically scoped to this plant_id

Supabase Row Level Security (additional safety layer):
├── Even if frontend sends wrong plant_id, RLS prevents cross-plant data access
└── Policy: user can only see rows where plant_id matches their assigned plant
```

---

## 📊 Supabase Real-Time Architecture

```
Frontend subscribes to changes:
const subscription = supabase
  .channel('plant-updates')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'batches',
    filter: `plant_id=eq.${plantId}`
  }, (payload) => {
    // This fires instantly when any new batch is added
    queryClient.invalidateQueries(['batches'])  // Refresh TanStack Query
    updateSankeyData(payload.new)               // Update Sankey
  })
  .subscribe()

Result: User types in chat → batch saved to Supabase →
        Supabase sends real-time event → 
        Dashboard updates in <500ms automatically
```
