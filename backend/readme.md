traceflow/
│
├── 📁 app/                          # Next.js App Router — all pages and API routes
│   ├── 📁 (dashboard)/              # Route group — dashboard pages (no layout impact)
│   │   ├── 📁 batches/
│   │   │   ├── page.tsx             # Batch list view with filters
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Single batch lifecycle detail
│   │   ├── 📁 vendors/
│   │   │   └── page.tsx             # Vendor scorecard page
│   │   └── 📁 carbon/
│   │       └── page.tsx             # Carbon footprint estimator page
│   │
│   ├── 📁 api/                      # Next.js API Routes (backend)
│   │   ├── 📁 chat/
│   │   │   └── route.ts             # POST: NL input → AI → DB write/read
│   │   ├── 📁 stats/
│   │   │   └── route.ts             # GET: aggregated lifecycle data for dashboard
│   │   ├── 📁 batches/
│   │   │   ├── route.ts             # GET: all batches (filterable)
│   │   │   └── [id]/
│   │   │       └── route.ts         # GET: single batch full lifecycle
│   │   ├── 📁 vendors/
│   │   │   └── route.ts             # GET: vendor scorecard aggregation
│   │   ├── 📁 insights/
│   │   │   └── route.ts             # POST: generate AI narrative for a batch
│   │   └── 📁 carbon/
│   │       └── route.ts             # GET: CO₂ savings calculation
│   │
│   ├── 📁 components/               # Shared React components (Person 1 owns)
│   │   ├── 📁 charts/
│   │   │   ├── SankeyDiagram.tsx    # D3-sankey material flow visualization
│   │   │   ├── BatchBarChart.tsx    # Batch-wise input/output bar chart
│   │   │   ├── MaterialPieChart.tsx # Material type distribution
│   │   │   ├── WeeklyLineChart.tsx  # Weekly throughput trend
│   │   │   └── LossHeatmap.tsx      # Loss % heatmap by stage (bonus)
│   │   ├── 📁 chat/
│   │   │   ├── ChatPanel.tsx        # Main chat interface container
│   │   │   ├── MessageBubble.tsx    # Individual message display
│   │   │   ├── ChatInput.tsx        # Text input + send button
│   │   │   └── StructuredOutput.tsx # JSON preview card on data entry
│   │   ├── 📁 dashboard/
│   │   │   ├── KPICard.tsx          # Single metric card (total input, output, etc.)
│   │   │   ├── AnomalyBadge.tsx     # Red/yellow flag for anomalies
│   │   │   ├── InsightPanel.tsx     # AI narrative text block
│   │   │   ├── CompletenessScore.tsx# Batch data reliability score badge
│   │   │   └── BatchTimeline.tsx    # Chain of custody timeline
│   │   └── 📁 layout/
│   │       ├── Sidebar.tsx          # Navigation sidebar
│   │       ├── Header.tsx           # Top bar with title + status
│   │       └── PageShell.tsx        # Consistent page wrapper
│   │
│   ├── layout.tsx                   # Root layout (fonts, providers, sidebar)
│   ├── page.tsx                     # Main dashboard page (root "/")
│   └── globals.css                  # Tailwind base + custom CSS variables
│
├── 📁 lib/                          # Core business logic (shared utilities)
│   ├── 📁 ai/
│   │   ├── featherless.ts           # Featherless API client + model config
│   │   ├── ollama.ts                # Ollama local fallback client
│   │   ├── provider.ts              # Switches between cloud/local based on env
│   │   ├── prompts.ts               # All system prompts (Person 3 owns this file)
│   │   ├── intentParser.ts          # Intent classification logic
│   │   ├── entityExtractor.ts       # Entity extraction + JSON validation (Zod)
│   │   ├── queryHandler.ts          # NL query → DB filter object
│   │   └── insightGenerator.ts      # Batch data → AI narrative
│   ├── 📁 db/
│   │   ├── client.ts                # Prisma client singleton
│   │   ├── queries.ts               # Reusable DB query functions
│   │   └── aggregations.ts          # Stats/aggregation queries for dashboard
│   ├── 📁 carbon/
│   │   ├── constants.ts             # CO₂ saving factors per material type
│   │   └── calculator.ts            # CO₂ saved calculation logic
│   ├── 📁 anomaly/
│   │   ├── thresholds.ts            # Loss % thresholds by stage/material
│   │   └── detector.ts              # Anomaly detection engine
│   └── utils.ts                     # Date formatting, unit conversion helpers
│
├── 📁 prisma/
│   ├── schema.prisma                # DB schema — MaterialEntry, Batch, Vendor
│   ├── seed.ts                      # Seeds DB with Kaggle dataset
│   └── migrations/                  # Auto-generated migration files
│       └── [timestamp]_init/
│
├── 📁 data/
│   ├── kaggle_raw/                  # Raw CSV files from Kaggle dataset
│   │   └── .gitkeep                 # Dir tracked, files in .gitignore
│   ├── processed/
│   │   └── seed_data.json           # Cleaned, normalized seed data
│   └── samples/
│       └── sample_inputs.json       # 20+ sample NL inputs for testing
│
├── 📁 docs/
│   ├── plan.md                      # This project plan
│   ├── process.md                   # Development process
│   ├── folderstructure.md           # This file
│   ├── prd.md                       # Product requirements document
│   ├── phases.md                    # Phase breakdown
│   ├── future-upgrades.md           # Post-V1 roadmap
│   ├── data-assumptions.md          # Assumptions about the Kaggle dataset
│   └── design-rationale.md          # Why we made key design decisions
│
├── 📁 public/
│   ├── logo.svg                     # TraceFlow logo
│   └── favicon.ico
│
├── 📁 types/
│   └── index.ts                     # Shared TypeScript interfaces
│                                    # (MaterialEntry, Batch, Intent, etc.)
│
├── .env.local                       # Local secrets (gitignored)
├── .env.local.example               # Template for team setup
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md