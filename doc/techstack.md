# 🛠️ techstack.md — Complete Technology Stack (Explained Simply)

> Every tool explained: what it is, why we chose it, and what it does in our project.

---

## 🖼️ The Big Picture — How All Tools Connect

```
USER (browser / phone)
        ↓
[NEXT.JS 15 FRONTEND] ← what the user sees and clicks
        ↓ HTTP requests
[PYTHON FASTAPI BACKEND] ← the brain that processes everything
     ↓              ↓
[SUPABASE DB]    [FEATHERLESS.AI] ← database & AI
        ↑
[CLERK AUTH] ← login system, protects all routes
        ↑
[N8N WORKFLOWS] ← automated pipelines running in background
```

---

## 🎨 Frontend Stack — What Users See

### Next.js 15 ⚠️ Important Note
> You said "Next.js 16" — this version does not exist as of March 2026. The latest stable is **Next.js 15** with App Router. We will use Next.js 15 — it is the most modern version available.

**What is Next.js?**
Think of it as React (a JavaScript UI library) with superpowers. It handles:
- Page routing (which URL shows which page)
- Server-side rendering (pages load faster)
- API routes (some backend logic lives here too)
- Built-in optimization (images, fonts, performance)

**Why Next.js for this project?**
- Dashboard needs real-time updates → Next.js handles this perfectly
- We need both a frontend UI and some API endpoints → Next.js App Router does both
- Fastest way to build a polished web app in a hackathon

---

### TypeScript
**What is it?** JavaScript with types. Instead of `let x = 5`, you write `let x: number = 5`. This catches bugs before you run the code.

**Why use it?** In a hackathon where 4 people are coding simultaneously, TypeScript prevents the nightmare of "I changed this variable and now nothing works and I don't know why."

---

### Tailwind CSS v4
**What is it?** A way to style HTML using pre-built utility classes directly in your HTML/JSX, instead of writing separate CSS files.

```jsx
// Without Tailwind
<div className="card">text</div>
// card.css: { background: white; padding: 16px; border-radius: 8px; }

// With Tailwind
<div className="bg-white p-4 rounded-lg">text</div>
```

**Why v4?** It's CSS-native (no config file needed), builds 100x faster than v3. For a hackathon, zero config = more time building features.

---

### shadcn/ui
**What is it?** A collection of beautiful, pre-built React components you copy into your project. Buttons, modals, cards, tables, dropdowns — all pre-designed and professional-looking.

**Why?** Soham (designer) can focus on layout and custom elements. James (vibe coder) just drops in `<Button>`, `<Card>`, `<DataTable>` and it looks great immediately.

---

### Recharts
**What is it?** A React charting library. Makes bar charts, line charts, pie charts with just a few lines of code.

**Used for:** Material quantity trends, vendor comparison charts, monthly processing stats, carbon savings over time.

---

### D3.js (specifically d3-sankey)
**What is it?** A powerful data visualization library. We specifically use the **Sankey diagram** module.

**What is a Sankey diagram?** It's a flowing diagram showing how material moves from left to right with the width of the flow representing quantity. This is our visual WOW moment:

```
Collection (1000kg) ──→ Sorting (950kg) ──→ Processing (800kg) ──→ Output (750kg)
                              ↓                    ↓
                         Waste (50kg)         Loss (50kg)
```

**Why D3?** No other library does Sankey diagrams as beautifully. It's the industry standard for data flow visualization.

---

### TanStack Query (React Query)
**What is it?** A library that manages all your data fetching from the backend. It handles:
- Loading states ("fetching data...")
- Error states ("something went wrong")
- Caching (don't re-fetch data you already have)
- Background refetching (silently update data every 30 seconds)

**Why?** Without it, every API call requires manually writing loading/error/data state. With it, you write one line and get everything.

---

### Zustand
**What is it?** Global state management. When multiple components need to share the same data (like "which batch is currently selected"), Zustand is a central store they all read from.

**Why Zustand over Redux?** Redux is 10× more complex with the same outcome. Zustand is 5 lines of code to set up. Perfect for hackathons.

---

### Motion (Framer Motion v11)
**What is it?** Animation library. Makes components fade in, slide, scale, etc.

**Why?** The difference between a demo that looks "meh" and a demo that makes judges say "wow" is often smooth animations. Soham will use this for dashboard transitions.

---

## ⚙️ Backend Stack — The Brain

### Python 3.13
**What is it?** The programming language for our entire backend.

**Why Python?** 
- Best AI/ML ecosystem (every AI library is Python-first)
- FastAPI (below) is Python
- Our team already knows it
- Featherless.ai SDK is Python-native

---

### FastAPI
**What is it?** A Python web framework for building REST APIs. When the frontend says "give me all batches from this week," FastAPI handles that request, queries the database, and sends back JSON data.

**Why FastAPI over Flask/Django?**
- **Automatic documentation** — go to `/docs` and see a visual API explorer. Judges love this.
- **Pydantic integration** — automatic input validation
- **Async support** — handles multiple requests simultaneously
- **Speed** — one of the fastest Python frameworks

---

### Pydantic v2
**What is it?** A Python library for data validation. You define what data should look like, and it automatically checks that incoming data matches.

```python
class MaterialEntry(BaseModel):
    material_type: str      # must be a string
    quantity_kg: float      # must be a number
    vendor_name: str
    date: datetime          # must be a valid date
    stage: StageEnum        # must be one of: collection, processing, dispatch
```

If the AI sends bad data, Pydantic catches it before it reaches the database.

---

### uv (Package Manager)
**What is it?** A replacement for `pip` (Python's package installer). It's written in Rust and is 100× faster.

```bash
# pip (slow)
pip install fastapi pydantic supabase  # takes 2 minutes

# uv (fast)
uv add fastapi pydantic supabase  # takes 10 seconds
```

**Why in a hackathon?** Every minute saved on setup is a minute spent building features.

---

### Instructor
**What is it?** A Python library that guarantees the AI (Featherless.ai) returns **structured JSON output** that matches your Pydantic model.

**The Problem It Solves:**
Without Instructor, AI responses look like:
```
"I think the user wants to log 300 kg of PET plastic from Vendor Raju, received today."
```

With Instructor, the response is guaranteed to be:
```json
{
  "material_type": "PET",
  "quantity_kg": 300,
  "vendor_name": "Raju",
  "action": "received",
  "date": "2026-03-25"
}
```

No regex. No parsing. Just a clean Python object.

---

### LangGraph
**What is it?** A framework for building AI "agent" pipelines as a directed graph. Think of it as defining steps an AI goes through to answer a question.

**Our pipeline looks like:**
```
User Input → Intent Detection → Entity Extraction → DB Query → Response Generation
```

LangGraph manages this flow, handles retries if a step fails, and maintains conversation context.

---

### Polars
**What is it?** A very fast Python DataFrame library (like Pandas but written in Rust). Used for our analytics calculations — computing loss percentages, vendor scores, carbon impact.

**Why not just Pandas?** For batch analytics on 10,000+ records, Polars is 5–10× faster. Charts load instantly.

---

## 🗄️ Database — Supabase

### What is Supabase?
Supabase is a **backend-as-a-service** built on top of PostgreSQL. It gives you:
- A full PostgreSQL database (powerful, reliable, industry standard)
- Real-time subscriptions (dashboard updates without page refresh)
- Built-in REST API (auto-generated from your database tables)
- Row Level Security (data isolation between different plant users)
- Storage (for uploading documents/images)
- Edge Functions (serverless functions)

**Why Supabase for this project?**
- Free tier is generous — perfect for hackathon + early MVP
- Real-time updates are BUILT IN — essential for live dashboard
- PostgreSQL = full SQL power for complex analytics queries
- Dashboard at supabase.com lets you browse data visually during demo

**How We Use It:**
```
FastAPI backend ←→ Supabase (via supabase-py client)
Next.js frontend ←→ Supabase (direct real-time subscriptions for live updates)
```

**Tables We Will Create:**
- `plants` — recycling plants registered
- `batches` — each material batch
- `transactions` — every stage a batch passes through
- `vendors` — vendor information
- `users` — linked to Clerk auth
- `alerts` — anomaly alerts

---

## 🔐 Authentication — Clerk

### What is Clerk?
Clerk is a complete authentication service. It handles:
- User registration and login
- Email/password, Google OAuth, magic link
- Session management
- JWT tokens for API authorization
- User profile management

**Why Clerk over building auth yourself?**
Building auth from scratch (secure password hashing, session management, token refresh, email verification) takes 2–3 days minimum. Clerk sets up in 30 minutes with `npx create-next-app --example with-clerk`.

**How It Works in Our App:**
```
User logs in via Clerk → Clerk gives JWT token → 
Frontend sends token in every API request → 
FastAPI validates token → 
Supabase Row Level Security uses user ID to show only their plant's data
```

**Roles We'll Implement:**
- `plant_manager` — full access
- `data_operator` — can enter data, cannot see financial reports
- `compliance_officer` — read-only, can generate reports
- `admin` — manages the platform

---

## 🤖 AI Layer — Featherless.ai

### What is Featherless.ai?
Featherless.ai is an API service that hosts **open-source AI models** (like Llama, Phi, Mistral, Qwen) and lets you call them via an **OpenAI-compatible API**. This means:
- Same code as OpenAI, just different base URL
- Access to 100s of models
- No need to run anything locally
- Pay per token (very cheap for our use case)
- No GPU needed on our server

**Why Featherless.ai over OpenAI?**
- Cheaper (open source models)
- More control over which model to use
- Can switch models without changing code
- Supports models ≤3B params (hackathon constraint)
- Works reliably (no rate limit headaches during demo)

### Which Model We'll Use

**Primary: Phi-4 Mini (3.8B params)**
- Microsoft's latest small model
- Excellent at structured data extraction (perfect for our use case)
- Fast response times
- Available on Featherless.ai

**Fallback: Qwen 2.5 3B**
- Strong multilingual support (future Hindi support)
- Good instruction following

### How Featherless.ai Integration Works

```python
# It's just like calling OpenAI!
import instructor
from openai import OpenAI

client = instructor.from_openai(
    OpenAI(
        base_url="https://api.featherless.ai/v1",
        api_key="your_featherless_api_key"
    )
)

# Extract structured data from natural language
result = client.chat.completions.create(
    model="microsoft/Phi-4-mini-instruct",
    response_model=MaterialEntry,  # Pydantic model
    messages=[{"role": "user", "content": user_input}]
)
# result is now a typed MaterialEntry object!
```

---

## 🔄 Automation — n8n Workflows

### What is n8n?
n8n is a **workflow automation tool** (like Zapier but open-source and much more powerful). You build visual workflows where one event triggers a series of actions.

**Why n8n?**
- Free and self-hostable
- 400+ integrations (email, WhatsApp, Google Sheets, Slack, etc.)
- Visual workflow builder — Soham can build automations without writing code
- Webhooks work perfectly with our FastAPI backend

### Workflows We'll Build

**Workflow 1 — Daily Summary Email**
```
Every day at 8am → Query Supabase for yesterday's data → 
Generate AI summary → Send email to plant manager
```

**Workflow 2 — Anomaly Alert**
```
FastAPI detects anomaly → Triggers n8n webhook → 
n8n sends WhatsApp message to manager + logs to Slack
```

**Workflow 3 — Weekly Report Generation**
```
Every Monday → Pull week's data from Supabase → 
Generate PDF report → Email to compliance officer
```

**Workflow 4 — Vendor Scorecard**
```
End of month → Calculate vendor scores → 
Auto-generate vendor comparison report → Email to procurement team
```

**Workflow 5 — New Batch Notification**
```
New batch logged → n8n detects via webhook → 
Sends notification to relevant team members via WhatsApp
```

---

## 🚀 Deployment Stack

| Layer | Tool | Cost | Why |
|-------|------|------|-----|
| **Frontend** | Vercel | Free tier | Zero-config Next.js, instant deploys, global CDN |
| **Backend** | Railway | $5/month or free trial | Docker support, easy Python deploy, free tier for demo |
| **Database** | Supabase | Free tier | 500MB free, enough for hackathon + demo |
| **Auth** | Clerk | Free tier | 10,000 MAU free |
| **AI API** | Featherless.ai | Pay per token | ~$0.001 per 1000 tokens (very cheap) |
| **Automation** | n8n Cloud | Free trial | Or self-host on Railway |

**Total hackathon cost: ~$0** (all free tiers)

---

## 📦 Complete Package List

### Frontend (package.json)
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "typescript": "^5.8.0",
    "tailwindcss": "^4.0.0",
    "@clerk/nextjs": "latest",
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zod": "^3.0.0",
    "recharts": "^3.0.0",
    "d3": "^7.0.0",
    "d3-sankey": "^0.12.3",
    "motion": "^11.0.0",
    "lucide-react": "latest",
    "@supabase/supabase-js": "latest",
    "shadcn-ui": "latest"
  }
}
```

### Backend (pyproject.toml with uv)
```toml
[project]
name = "recyclens-api"
requires-python = ">=3.13"
dependencies = [
    "fastapi>=0.115",
    "uvicorn[standard]",
    "pydantic>=2.0",
    "supabase>=2.0",
    "instructor>=1.3",
    "langgraph>=0.2",
    "openai>=1.0",
    "polars>=1.0",
    "pandas>=2.2",
    "python-dotenv>=1.0",
    "httpx>=0.27",
    "python-jose[cryptography]",
    "clerk-backend-api"
]
```

---

## 🔑 Environment Variables You'll Need

```env
# Frontend (.env.local)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend (.env)
FEATHERLESS_API_KEY=fl_...
FEATHERLESS_BASE_URL=https://api.featherless.ai/v1
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CLERK_SECRET_KEY=sk_...
N8N_WEBHOOK_URL=https://...
```

---

## ✅ Quick Setup Checklist (First 30 Minutes)

```bash
# 1. Create Supabase project at supabase.com (5 min)
# 2. Create Clerk app at clerk.com (5 min)
# 3. Get Featherless.ai API key at featherless.ai (5 min)
# 4. Frontend setup
npx create-next-app@latest recyclens-frontend --typescript --tailwind --app
cd recyclens-frontend
npx shadcn@latest init
npm install @clerk/nextjs @tanstack/react-query zustand recharts d3 d3-sankey motion @supabase/supabase-js

# 5. Backend setup
mkdir recyclens-backend && cd recyclens-backend
uv init
uv add fastapi uvicorn pydantic supabase instructor langgraph openai polars python-dotenv

# 6. Start both
# Terminal 1: cd recyclens-frontend && npm run dev
# Terminal 2: cd recyclens-backend && uv run uvicorn main:app --reload
```
