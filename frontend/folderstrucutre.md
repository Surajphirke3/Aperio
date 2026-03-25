# architecture-nextjs.md — Enterprise Architecture Reference
## TraceFlow — Next.js 16 Project Structure
### For immediate team use

---

## Dependency Flow (Read This First)

```
┌─────────────────────────────────────────────────────────┐
│                        pages/                           │  ← Thin shell only
│                      app/ routes                        │    No logic here
└──────────────────────────┬──────────────────────────────┘
                           │ delegates to
┌──────────────────────────▼──────────────────────────────┐
│                     features/                           │  ← All product logic
│   chat/  |  dashboard/  |  batches/  |  vendors/        │    lives here
└──────────────────────────┬──────────────────────────────┘
                           │ uses
┌──────────────────────────▼──────────────────────────────┐
│                      shared/                            │  ← Reusable across
│        components/  |  hooks/  |  utils/  |  ui/        │    all features
└──────────────────────────┬──────────────────────────────┘
                           │ uses
┌──────────────────────────▼──────────────────────────────┐
│                       core/                             │  ← Infrastructure
│        providers/  |  config/  |  middleware/           │    No business logic
└──────────────────────────┬──────────────────────────────┘
                           │ uses
┌──────────────────────────▼──────────────────────────────┐
│                   infrastructure/                       │  ← External world
│          db/  |  ai/  |  featherless/  |  ollama/       │    DB, LLMs, APIs
└─────────────────────────────────────────────────────────┘

RULE: Arrows only go DOWN. features/ never imports from pages/.
      infrastructure/ never imports from features/.
```

---

## Complete Folder Structure

```
traceflow/
│
├── src/
│   │
│   ├── features/                          # 🏗️ All product features live here
│   │   │
│   │   ├── chat/                          # Conversational AI feature
│   │   │   ├── components/
│   │   │   │   ├── ChatPanel.tsx          # Main container
│   │   │   │   ├── MessageBubble.tsx      # Single message display
│   │   │   │   ├── ChatInput.tsx          # Text input + mic button
│   │   │   │   ├── StructuredOutput.tsx   # JSON preview card
│   │   │   │   └── TypingIndicator.tsx    # AI loading state
│   │   │   ├── hooks/
│   │   │   │   ├── useChat.ts             # Chat state + send logic
│   │   │   │   ├── useVoiceInput.ts       # Web Speech API hook
│   │   │   │   └── useChatHistory.ts      # Message history management
│   │   │   ├── services/
│   │   │   │   ├── chatService.ts         # POST /api/chat abstraction
│   │   │   │   └── messageFormatter.ts    # Format AI response for UI
│   │   │   ├── types/
│   │   │   │   └── index.ts               # ChatMessage, ChatState, Intent
│   │   │   ├── utils/
│   │   │   │   └── messageParser.ts       # Parse structured JSON from response
│   │   │   └── __tests__/
│   │   │       ├── ChatPanel.test.tsx
│   │   │       ├── useChat.test.ts
│   │   │       └── chatService.test.ts
│   │   │
│   │   ├── dashboard/                     # Visual analytics feature
│   │   │   ├── components/
│   │   │   │   ├── DashboardShell.tsx     # Layout wrapper
│   │   │   │   ├── KPIGrid.tsx            # Row of KPI cards
│   │   │   │   ├── KPICard.tsx            # Single metric card
│   │   │   │   ├── InsightPanel.tsx       # AI narrative block
│   │   │   │   ├── AnomalyAlert.tsx       # Anomaly flag component
│   │   │   │   └── CompletenessScore.tsx  # Data reliability badge
│   │   │   ├── charts/                    # Chart components (dashboard-specific)
│   │   │   │   ├── SankeyDiagram.tsx      # Material flow Sankey
│   │   │   │   ├── BatchBarChart.tsx      # Batch in/out/loss bars
│   │   │   │   ├── MaterialPieChart.tsx   # Material type distribution
│   │   │   │   ├── WeeklyLineChart.tsx    # Throughput trend
│   │   │   │   └── LossHeatmap.tsx        # Loss % by stage
│   │   │   ├── hooks/
│   │   │   │   ├── useDashboardStats.ts   # Fetches /api/stats, SWR
│   │   │   │   ├── useInsights.ts         # AI insight for selected batch
│   │   │   │   └── useAnomalies.ts        # Anomaly list + thresholds
│   │   │   ├── services/
│   │   │   │   └── statsService.ts        # GET /api/stats abstraction
│   │   │   ├── types/
│   │   │   │   └── index.ts               # DashboardStats, SankeyData, KPIMetric
│   │   │   ├── utils/
│   │   │   │   ├── sankeyBuilder.ts       # Transforms DB data → Sankey shape
│   │   │   │   └── chartColors.ts         # Consistent color palette
│   │   │   └── __tests__/
│   │   │       ├── SankeyDiagram.test.tsx
│   │   │       ├── useDashboardStats.test.ts
│   │   │       └── sankeyBuilder.test.ts
│   │   │
│   │   ├── batches/                       # Batch management feature
│   │   │   ├── components/
│   │   │   │   ├── BatchList.tsx          # Filterable batch table
│   │   │   │   ├── BatchCard.tsx          # Single batch summary card
│   │   │   │   ├── BatchTimeline.tsx      # Chain of custody timeline
│   │   │   │   ├── BatchDetail.tsx        # Full batch detail view
│   │   │   │   └── BatchFilters.tsx       # Date/material/stage filters
│   │   │   ├── hooks/
│   │   │   │   ├── useBatches.ts          # List with filters + pagination
│   │   │   │   └── useBatchDetail.ts      # Single batch + lifecycle
│   │   │   ├── services/
│   │   │   │   └── batchService.ts        # GET /api/batches abstraction
│   │   │   ├── types/
│   │   │   │   └── index.ts               # Batch, BatchStage, BatchFilter
│   │   │   └── __tests__/
│   │   │       ├── BatchList.test.tsx
│   │   │       └── batchService.test.ts
│   │   │
│   │   ├── vendors/                       # Vendor scorecard feature
│   │   │   ├── components/
│   │   │   │   ├── VendorTable.tsx
│   │   │   │   ├── VendorScorecard.tsx
│   │   │   │   └── VendorBadge.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useVendors.ts
│   │   │   ├── services/
│   │   │   │   └── vendorService.ts
│   │   │   ├── types/
│   │   │   │   └── index.ts
│   │   │   └── __tests__/
│   │   │
│   │   └── carbon/                        # Carbon footprint feature
│   │       ├── components/
│   │       │   ├── CarbonKPI.tsx
│   │       │   └── CarbonBreakdown.tsx
│   │       ├── hooks/
│   │       │   └── useCarbonStats.ts
│   │       ├── services/
│   │       │   └── carbonService.ts
│   │       ├── types/
│   │       │   └── index.ts
│   │       └── __tests__/
│   │
│   ├── shared/                            # 🔄 Cross-feature reusables
│   │   ├── components/
│   │   │   ├── ErrorBoundary.tsx          # React error boundary wrapper
│   │   │   ├── LoadingState.tsx           # Skeleton + spinner
│   │   │   ├── EmptyState.tsx             # Zero-data placeholder
│   │   │   └── PageHeader.tsx             # Consistent page title/breadcrumb
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   └── usePrevious.ts
│   │   ├── ui/                            # Design system primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts                   # Single export barrel
│   │   ├── types/
│   │   │   └── index.ts                   # Global shared types
│   │   ├── utils/
│   │   │   ├── dates.ts                   # Date formatting (date-fns)
│   │   │   ├── numbers.ts                 # kg/tonne formatting
│   │   │   ├── cn.ts                      # Tailwind classname merge
│   │   │   └── api.ts                     # fetch wrapper with error handling
│   │   └── constants/
│   │       ├── materials.ts               # Material type enum + labels
│   │       ├── stages.ts                  # Lifecycle stage enum + labels
│   │       └── routes.ts                  # App route constants
│   │
│   ├── core/                              # ⚙️ App infrastructure
│   │   ├── providers/
│   │   │   ├── QueryProvider.tsx          # SWR / React Query config
│   │   │   ├── ThemeProvider.tsx          # Dark/light mode
│   │   │   └── index.tsx                  # Combined AppProviders wrapper
│   │   ├── middleware/
│   │   │   ├── withAuth.ts                # Auth middleware (V1.1)
│   │   │   ├── withErrorHandler.ts        # API error normalizer
│   │   │   └── withRateLimit.ts           # Rate limiting (V1.1)
│   │   └── config/
│   │       ├── env.ts                     # Validated env vars (Zod)
│   │       └── constants.ts               # Non-secret app constants
│   │
│   └── infrastructure/                    # 🔌 External integrations
│       ├── ai/
│       │   ├── provider.ts                # Cloud/local switch
│       │   ├── featherless/
│       │   │   ├── client.ts              # Featherless API client
│       │   │   └── types.ts               # Featherless response types
│       │   ├── ollama/
│       │   │   ├── client.ts              # Ollama client
│       │   │   └── types.ts
│       │   └── prompts/
│       │       ├── intentPrompt.ts        # Intent classification prompt
│       │       ├── entityPrompt.ts        # Entity extraction prompt
│       │       ├── insightPrompt.ts       # Batch narrative prompt
│       │       └── queryPrompt.ts         # NL query → filter prompt
│       ├── db/
│       │   ├── client.ts                  # Prisma singleton
│       │   ├── queries/
│       │   │   ├── batches.ts             # Batch CRUD queries
│       │   │   ├── entries.ts             # MaterialEntry queries
│       │   │   ├── vendors.ts             # Vendor queries
│       │   │   └── stats.ts               # Aggregation queries
│       │   └── seed/
│       │       ├── index.ts               # Seed runner
│       │       └── kaggleTransformer.ts   # CSV → DB format
│       └── carbon/
│           ├── constants.ts               # CO₂ factors per material
│           └── calculator.ts              # Calculation logic
│
├── app/                                   # Next.js App Router (THIN SHELL)
│   ├── (dashboard)/
│   │   ├── layout.tsx                     # Dashboard layout with sidebar
│   │   ├── page.tsx                       # → renders DashboardShell
│   │   ├── batches/
│   │   │   ├── page.tsx                   # → renders BatchList
│   │   │   └── [id]/page.tsx              # → renders BatchDetail
│   │   ├── vendors/
│   │   │   └── page.tsx                   # → renders VendorTable
│   │   └── carbon/
│   │       └── page.tsx                   # → renders CarbonBreakdown
│   ├── api/
│   │   ├── chat/route.ts                  # → delegates to chatApiHandler
│   │   ├── stats/route.ts                 # → delegates to statsApiHandler
│   │   ├── batches/
│   │   │   ├── route.ts                   # → delegates to batchApiHandler
│   │   │   └── [id]/route.ts
│   │   ├── vendors/route.ts
│   │   ├── insights/route.ts
│   │   └── carbon/route.ts
│   ├── layout.tsx                         # Root layout + AppProviders
│   └── globals.css
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                            # → imports from src/infrastructure/db/seed
│
├── public/
├── docs/
├── types/                                 # Root-level generated types only
│   └── prisma.d.ts                        # Auto-generated by Prisma
│
├── .env.local
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Critical File Contents

### `src/core/config/env.ts` — Validated Environment Variables
```typescript
import { z } from 'zod';

const envSchema = z.object({
  // AI Provider
  AI_PROVIDER: z.enum(['featherless', 'ollama']).default('featherless'),
  FEATHERLESS_API_KEY: z.string().min(1).optional(),
  OLLAMA_BASE_URL: z.string().url().default('http://localhost:11434'),
  PRIMARY_MODEL: z.string().default('meta-llama/Llama-3.2-3B-Instruct'),
  FALLBACK_MODEL: z.string().default('Qwen/Qwen2.5-3B-Instruct'),

  // Database
  DATABASE_URL: z.string().min(1),

  // App
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

// Throws at startup if env is misconfigured — fail fast
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration');
}

export const env = parsed.data;
```

---

### `src/infrastructure/ai/provider.ts` — Dual Model Switch
```typescript
import { env } from '@/core/config/env';
import { featherlessClient } from './featherless/client';
import { ollamaClient } from './ollama/client';

export interface AIClient {
  complete(prompt: string, systemPrompt: string): Promise<string>;
}

export function getAIClient(): AIClient {
  return env.AI_PROVIDER === 'ollama' ? ollamaClient : featherlessClient;
}

// Usage in any service:
// const ai = getAIClient();
// const result = await ai.complete(userMessage, INTENT_SYSTEM_PROMPT);
```

---

### `src/infrastructure/ai/featherless/client.ts` — Cloud Client
```typescript
import { env } from '@/core/config/env';
import type { AIClient } from '../provider';

export const featherlessClient: AIClient = {
  async complete(prompt: string, systemPrompt: string): Promise<string> {
    const response = await fetch('https://api.featherless.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.FEATHERLESS_API_KEY}`,
      },
      body: JSON.stringify({
        model: env.PRIMARY_MODEL,
        max_tokens: 512,
        temperature: 0.1,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      // Automatic fallback to secondary model
      return retryWithFallback(prompt, systemPrompt);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },
};

async function retryWithFallback(prompt: string, systemPrompt: string): Promise<string> {
  const response = await fetch('https://api.featherless.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.FEATHERLESS_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.FALLBACK_MODEL,
      max_tokens: 512,
      temperature: 0.1,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}
```

---

### `src/features/chat/services/chatService.ts` — Feature Service Layer
```typescript
// Features call services, services call infrastructure.
// Features NEVER import from infrastructure directly.

import { ParsedIntent, ChatResponse } from '../types';

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.statusText}`);
  }

  return response.json() as Promise<ChatResponse>;
}
```

---

### `src/features/chat/types/index.ts` — Feature-Scoped Types
```typescript
// These types are ONLY for the chat feature UI layer.
// Shared/global types live in src/shared/types/

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  structuredData?: ParsedIntent | null;  // null if query response
  isError?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface ChatResponse {
  success: boolean;
  reply: string;
  structuredData?: ParsedIntent;
  action: 'stored' | 'queried' | 'error';
}

// Re-export from shared for convenience
export type { ParsedIntent } from '@/shared/types';
```

---

### `src/shared/types/index.ts` — Global Contract (Everyone uses this)
```typescript
// This is the shared contract between frontend and backend.
// Change here = TypeScript errors everywhere = intentional.

export type MaterialType = 'PET' | 'HDPE' | 'PP' | 'LDPE' | 'PVC' | 'mixed';
export type ProcessStage = 'collection' | 'sorting' | 'processing' | 'output' | 'dispatch';
export type IntentType = 'purchase' | 'processing' | 'dispatch' | 'query' | 'report';

export interface ParsedIntent {
  intent: IntentType;
  material: MaterialType;
  quantity_kg: number;
  vendor?: string;
  date: string;           // ISO 8601
  stage?: ProcessStage;
  loss_kg?: number;
  batch_id?: string;
  notes?: string;
}

export interface SankeyNode {
  id: string;
  label: string;
  value: number;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AnomalyFlag {
  batch_id: string;
  stage: ProcessStage;
  loss_pct: number;
  threshold_pct: number;
  severity: 'warning' | 'critical';
}
```

---

### `app/api/chat/route.ts` — API Route (Thin Shell Pattern)
```typescript
// API routes are SHELLS only.
// All logic lives in services. Routes just validate + delegate.

import { NextRequest, NextResponse } from 'next/server';
import { getAIClient } from '@/infrastructure/ai/provider';
import { parseIntent } from '@/infrastructure/ai/prompts/intentPrompt';
import { extractEntities } from '@/infrastructure/ai/prompts/entityPrompt';
import { db } from '@/infrastructure/db/client';
import { createMaterialEntry } from '@/infrastructure/db/queries/entries';
import { buildQueryFilters } from '@/infrastructure/ai/prompts/queryPrompt';
import { runStatsQuery } from '@/infrastructure/db/queries/stats';
import { withErrorHandler } from '@/core/middleware/withErrorHandler';
import type { ApiResponse } from '@/shared/types';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const { message } = await req.json();

  if (!message?.trim()) {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Message is required' },
      { status: 400 }
    );
  }

  const ai = getAIClient();

  // Step 1: Classify intent
  const intent = await parseIntent(ai, message);

  if (intent.type === 'query' || intent.type === 'report') {
    // Step 2a: Query path
    const filters = await buildQueryFilters(ai, message);
    const result = await runStatsQuery(filters);
    return NextResponse.json<ApiResponse<typeof result>>({
      success: true,
      data: result,
      message: formatQueryAnswer(result, filters),
    });
  } else {
    // Step 2b: Data entry path
    const entities = await extractEntities(ai, message, intent.type);
    const entry = await createMaterialEntry(entities);
    return NextResponse.json<ApiResponse<typeof entry>>({
      success: true,
      data: entry,
      message: `✅ Logged: ${entities.quantity_kg}kg ${entities.material}`,
    });
  }
});

function formatQueryAnswer(result: unknown, filters: unknown): string {
  // Format result into human-readable string
  return JSON.stringify(result); // simplified — expand in real impl
}
```

---

### `src/features/dashboard/hooks/useDashboardStats.ts` — Data Hook Pattern
```typescript
import useSWR from 'swr';
import { DashboardStats } from '../types';
import { statsService } from '../services/statsService';

// SWR key — also acts as cache invalidation key
const STATS_KEY = '/api/stats';

export function useDashboardStats() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    STATS_KEY,
    statsService.fetch,
    {
      refreshInterval: 0,        // Don't auto-refresh — we trigger manually
      revalidateOnFocus: false,
    }
  );

  // Called by ChatPanel after successful data entry
  const refresh = () => mutate();

  return {
    stats: data,
    isLoading,
    isError: !!error,
    refresh,
  };
}
```

---

## Developer Guidelines

### Where Does New Code Go?

| I want to... | Create it in... |
|---|---|
| Add a new dashboard chart | `src/features/dashboard/charts/` |
| Add a new chat UI element | `src/features/chat/components/` |
| Add a new AI prompt | `src/infrastructure/ai/prompts/` |
| Add a new DB query | `src/infrastructure/db/queries/` |
| Add a reusable button/card | `src/shared/ui/` |
| Add a hook used by 2+ features | `src/shared/hooks/` |
| Add a hook used by 1 feature | `src/features/[feature]/hooks/` |
| Add a new page/route | `app/(dashboard)/[new-route]/page.tsx` |
| Add a new API endpoint | `app/api/[endpoint]/route.ts` |
| Add a global type/interface | `src/shared/types/index.ts` |
| Add a feature-specific type | `src/features/[feature]/types/index.ts` |
| Add environment config | `src/core/config/env.ts` |

### The 5 Rules Every Developer Must Follow

**Rule 1: Features never import from other features**
```typescript
// ❌ WRONG — creates hidden coupling
import { useBatches } from '@/features/batches/hooks/useBatches';
// in src/features/chat/...

// ✅ RIGHT — extract to shared if needed by multiple features
import { useBatches } from '@/shared/hooks/useBatches';
```

**Rule 2: API routes are shells — no business logic**
```typescript
// ❌ WRONG
export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const response = await fetch('https://api.featherless.ai/...', { ... });
  const parsed = JSON.parse(response.choices[0].message.content);
  await prisma.materialEntry.create({ data: parsed });
  // ...30 more lines of logic
}

// ✅ RIGHT
export const POST = withErrorHandler(async (req: NextRequest) => {
  const { message } = await req.json();
  const result = await chatApiHandler(message); // all logic in handler
  return NextResponse.json(result);
});
```

**Rule 3: Infrastructure never knows about features**
```typescript
// ❌ WRONG — DB query importing feature type
import { ChatMessage } from '@/features/chat/types'; // in infrastructure/db/queries

// ✅ RIGHT — use shared types only
import { ParsedIntent } from '@/shared/types'; // in infrastructure/db/queries
```

**Rule 4: Every feature exports via index.ts**
```typescript
// src/features/chat/index.ts
export { ChatPanel } from './components/ChatPanel';
export { useChat } from './hooks/useChat';
export type { ChatMessage, ChatState } from './types';
// Nothing else is public API
```

**Rule 5: Co-locate tests with code**
```
features/chat/components/ChatPanel.tsx
features/chat/components/__tests__/ChatPanel.test.tsx  ✅

# NOT:
tests/unit/components/ChatPanel.test.tsx  ❌
```