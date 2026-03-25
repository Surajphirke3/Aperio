# 📁 folderstructure.md — Complete Project Architecture

> Every folder and file explained. Know exactly where everything lives.

---

## 🗂️ Root Directory

```
recyclens/                          ← Root project folder
├── recyclens-frontend/             ← Everything the user sees (Next.js)
├── recyclens-backend/              ← Everything the server does (FastAPI)
├── recyclens-n8n/                  ← Automation workflow definitions
├── docs/                           ← All your documentation (these files!)
├── dataset/                        ← Kaggle dataset CSV files
├── scripts/                        ← Utility scripts (seed DB, test API, etc.)
├── .github/                        ← GitHub Actions CI/CD (optional for hackathon)
├── docker-compose.yml              ← Start everything with one command
└── README.md                       ← Project overview for judges
```

---

## 🎨 Frontend Structure (recyclens-frontend/)

```
recyclens-frontend/
├── app/                            ← Next.js App Router (all your pages live here)
│   ├── (auth)/                     ← Routes that require login
│   │   ├── dashboard/
│   │   │   └── page.tsx            ← Main dashboard page
│   │   ├── chat/
│   │   │   └── page.tsx            ← Conversational interface page
│   │   ├── batches/
│   │   │   ├── page.tsx            ← All batches list
│   │   │   └── [id]/
│   │   │       └── page.tsx        ← Individual batch detail
│   │   ├── vendors/
│   │   │   └── page.tsx            ← Vendor scorecard page
│   │   ├── reports/
│   │   │   └── page.tsx            ← Reports and compliance page
│   │   └── layout.tsx              ← Shared layout for all auth pages (sidebar, header)
│   ├── (public)/                   ← Routes that don't require login
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx        ← Clerk sign in page
│   │   ├── sign-up/
│   │   │   └── [[...sign-up]]/
│   │   │       └── page.tsx        ← Clerk sign up page
│   │   └── page.tsx                ← Landing/marketing page
│   ├── api/                        ← Next.js API routes (thin proxy to Python backend)
│   │   └── webhook/
│   │       └── route.ts            ← Clerk webhook handler
│   ├── globals.css                 ← Global styles (Tailwind v4 imports)
│   └── layout.tsx                  ← Root layout (Clerk provider, TanStack Query provider)
│
├── components/                     ← Reusable React components
│   ├── ui/                         ← shadcn/ui components (auto-generated, don't edit)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ... (all shadcn components)
│   ├── dashboard/                  ← Dashboard-specific components
│   │   ├── KPICard.tsx             ← "Total Received: 5,240kg" cards
│   │   ├── SankeyDiagram.tsx       ← THE main lifecycle flow visualization
│   │   ├── MaterialFlowChart.tsx   ← Recharts bar chart for material over time
│   │   ├── LossRateChart.tsx       ← Line chart showing loss % trends
│   │   ├── AlertPanel.tsx          ← Anomaly alerts list
│   │   └── CarbonSavingsCard.tsx   ← CO₂ saved metrics
│   ├── chat/                       ← Chat interface components
│   │   ├── ChatInterface.tsx       ← Main chat container
│   │   ├── MessageBubble.tsx       ← Individual message display
│   │   ├── ChatInput.tsx           ← Text input + send button
│   │   └── EntryConfirmation.tsx   ← "Logged: 300kg PET from Raju" confirmation card
│   ├── batches/                    ← Batch management components
│   │   ├── BatchTable.tsx          ← Sortable, filterable batch list
│   │   ├── BatchDetailModal.tsx    ← Full batch lifecycle timeline
│   │   └── BatchStatusBadge.tsx    ← "In Processing", "Dispatched" etc.
│   ├── vendors/                    ← Vendor components
│   │   ├── VendorScorecard.tsx     ← Vendor ranking table
│   │   └── VendorDetailCard.tsx    ← Individual vendor metrics
│   ├── layout/                     ← App shell components
│   │   ├── Sidebar.tsx             ← Navigation sidebar
│   │   ├── Header.tsx              ← Top bar with user info
│   │   └── MobileNav.tsx          ← Mobile hamburger menu
│   └── shared/                     ← Generic shared components
│       ├── LoadingSpinner.tsx
│       ├── ErrorBoundary.tsx
│       └── EmptyState.tsx
│
├── lib/                            ← Utility functions and configurations
│   ├── supabase/
│   │   ├── client.ts               ← Supabase browser client setup
│   │   ├── server.ts               ← Supabase server client (for server components)
│   │   └── types.ts                ← TypeScript types generated from Supabase schema
│   ├── api/
│   │   ├── client.ts               ← Fetch wrapper for Python backend
│   │   ├── batches.ts              ← All batch-related API calls
│   │   ├── chat.ts                 ← Chat API calls
│   │   ├── analytics.ts            ← Analytics API calls
│   │   └── vendors.ts              ← Vendor API calls
│   ├── store/
│   │   ├── dashboardStore.ts       ← Zustand store for dashboard state
│   │   └── chatStore.ts            ← Zustand store for chat history
│   └── utils.ts                    ← Helper functions (format dates, format numbers, etc.)
│
├── hooks/                          ← Custom React hooks
│   ├── useBatches.ts               ← TanStack Query hook for batches data
│   ├── useAnalytics.ts             ← TanStack Query hook for analytics
│   ├── useRealtime.ts              ← Supabase real-time subscription hook
│   └── useChat.ts                  ← Chat state management hook
│
├── types/                          ← TypeScript type definitions
│   ├── batch.ts                    ← Batch, Transaction, Stage types
│   ├── vendor.ts                   ← Vendor types
│   ├── analytics.ts                ← Analytics response types
│   └── chat.ts                     ← Chat message types
│
├── public/                         ← Static files served directly
│   ├── logo.svg
│   └── icons/
│
├── .env.local                      ← Environment variables (NEVER commit this)
├── .env.example                    ← Template showing what vars are needed (safe to commit)
├── next.config.ts                  ← Next.js configuration
├── package.json
└── tsconfig.json
```

---

## ⚙️ Backend Structure (recyclens-backend/)

```
recyclens-backend/
├── app/                            ← Main application code
│   ├── main.py                     ← FastAPI app entry point, all routers registered here
│   ├── config.py                   ← Settings class reading from environment variables
│   │
│   ├── api/                        ← All API route handlers
│   │   ├── __init__.py
│   │   ├── chat.py                 ← POST /chat — conversational interface
│   │   ├── batches.py              ← GET/POST/PUT /batches — batch management
│   │   ├── analytics.py            ← GET /analytics/* — all analytics endpoints
│   │   ├── vendors.py              ← GET /vendors/* — vendor management
│   │   ├── reports.py              ← GET /reports/* — report generation
│   │   └── health.py               ← GET /health — server health check
│   │
│   ├── ai/                         ← All AI-related code
│   │   ├── __init__.py
│   │   ├── client.py               ← Featherless.ai client setup (Instructor + OpenAI compat)
│   │   ├── models.py               ← Pydantic models for AI responses
│   │   ├── pipeline.py             ← LangGraph conversation pipeline
│   │   ├── intent_detector.py      ← "Is this a data entry or a query?"
│   │   ├── entity_extractor.py     ← Extract material, quantity, vendor from text
│   │   └── query_engine.py         ← Answer conversational questions from DB
│   │
│   ├── services/                   ← Business logic layer
│   │   ├── __init__.py
│   │   ├── batch_service.py        ← Batch creation, updates, status tracking
│   │   ├── analytics_service.py    ← Loss calculations, efficiency metrics
│   │   ├── vendor_service.py       ← Vendor scoring algorithm
│   │   ├── carbon_service.py       ← CO₂ impact calculations
│   │   ├── anomaly_service.py      ← Anomaly detection rules engine
│   │   └── report_service.py       ← Report generation logic
│   │
│   ├── db/                         ← Database interaction layer
│   │   ├── __init__.py
│   │   ├── client.py               ← Supabase Python client setup
│   │   ├── models.py               ← SQLModel/Pydantic database models
│   │   └── queries.py              ← Reusable database query functions
│   │
│   ├── schemas/                    ← Request/Response Pydantic schemas
│   │   ├── __init__.py
│   │   ├── batch.py                ← BatchCreate, BatchResponse, BatchUpdate
│   │   ├── chat.py                 ← ChatRequest, ChatResponse, ExtractedEntry
│   │   ├── analytics.py            ← LifecycleData, VendorScore, CarbonMetrics
│   │   └── vendor.py               ← VendorCreate, VendorResponse, VendorScore
│   │
│   ├── prompts/                    ← All LLM prompt templates
│   │   ├── __init__.py
│   │   ├── data_entry.py           ← Prompts for extracting data from natural language
│   │   ├── query_answering.py      ← Prompts for answering analytical questions
│   │   ├── anomaly_explanation.py  ← Prompts for explaining detected anomalies
│   │   └── batch_summary.py        ← Prompts for generating batch narratives
│   │
│   ├── data/                       ← Static data files
│   │   ├── emission_factors.json   ← CO₂ factors by material type and process
│   │   ├── normal_ranges.json      ← Expected loss % ranges by material and stage
│   │   └── plastic_types.json      ← PET, HDPE, PP etc. metadata
│   │
│   └── middleware/                 ← FastAPI middleware
│       ├── auth.py                 ← Clerk JWT validation
│       ├── cors.py                 ← CORS settings for frontend
│       └── logging.py              ← Request logging
│
├── scripts/                        ← Utility scripts
│   ├── seed_data.py                ← Load Kaggle dataset into Supabase
│   ├── test_nlp.py                 ← Test NLP extraction with sample sentences
│   └── generate_demo_data.py      ← Generate realistic demo data
│
├── tests/                          ← Test files
│   ├── test_entity_extraction.py
│   ├── test_analytics.py
│   └── test_anomaly_detection.py
│
├── .env                            ← Environment variables (never commit)
├── .env.example                    ← Template
├── pyproject.toml                  ← uv project config + dependencies
└── README.md
```

---

## 🔄 n8n Workflows (recyclens-n8n/)

```
recyclens-n8n/
├── workflows/
│   ├── daily_summary.json          ← Export of n8n daily email workflow
│   ├── anomaly_alert.json          ← Export of n8n anomaly WhatsApp workflow
│   ├── weekly_report.json          ← Export of n8n weekly report workflow
│   └── vendor_scorecard.json       ← Export of n8n monthly vendor workflow
└── README.md                       ← How to import these into n8n
```

---

## 📊 Dataset (dataset/)

```
dataset/
├── raw/                            ← Original Kaggle CSV files (don't modify)
│   ├── collections.csv
│   ├── processing.csv
│   ├── dispatch.csv
│   └── vendors.csv
├── processed/                      ← Cleaned versions ready for seeding
│   └── seed_ready.json
└── README.md                       ← Dataset field descriptions
```

---

## 🗺️ Key File Locations — Quick Reference

| What You're Looking For | File Location |
|------------------------|---------------|
| Featherless.ai API setup | `recyclens-backend/app/ai/client.py` |
| Sankey diagram component | `recyclens-frontend/components/dashboard/SankeyDiagram.tsx` |
| Chat API endpoint | `recyclens-backend/app/api/chat.py` |
| NLP prompt templates | `recyclens-backend/app/prompts/data_entry.py` |
| Supabase table schema | `docs/schema.md` |
| Anomaly detection rules | `recyclens-backend/app/services/anomaly_service.py` |
| Carbon calculations | `recyclens-backend/app/services/carbon_service.py` |
| Dashboard page | `recyclens-frontend/app/(auth)/dashboard/page.tsx` |
| Auth middleware | `recyclens-backend/app/middleware/auth.py` |
| Env var template | `recyclens-backend/.env.example` |
