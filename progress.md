# Progress Report

## Project Snapshot

- Audit date: 2026-03-25
- Overall completion estimate: 54%
- Frontend completion estimate: 70%
- Backend completion estimate: 42%
- Frontend ↔ backend integration estimate: 5%
- Scope clarity estimate: 84%
- Delivery confidence: medium-high
- Primary status: the frontend and backend are **not yet connected**

### Interpretation of the estimates

- Frontend scores higher because it has a working Next.js shell, routed pages, internal API routes, Prisma schema/query logic, AI integration, carbon logic, and tests.
- Backend scores lower because the architecture is strong but many repositories and endpoints are still stubs or return placeholder data.
- Integration is effectively not started because the frontend serves itself through Next.js API routes and does not consume the Python backend.

## Audit Scope

- Audited repository root: `c:\Users\Suraj\OneDrive\Desktop\hackniche`
- `/docs` does not exist in this repository, so there were no files under a dedicated docs directory to read.
- Documentation sources actually reviewed:
  - [README.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/README.md)
  - [frontend/README.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/README.md)
  - [frontend/folderstrucutre.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/folderstrucutre.md)
  - [backend/folderstrucutre.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/folderstrucutre.md)
  - [backend/aperio-api/README.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/README.md)
- Supporting package/config sources reviewed:
  - [frontend/package.json](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/package.json)
  - [frontend/env.example](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/env.example)
  - [frontend/prisma/schema.prisma](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/prisma/schema.prisma)
  - [backend/aperio-api/pyproject.toml](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/pyproject.toml)
  - [backend/aperio-api/.env.example](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/.env.example)

## Documentation Findings

### Docs folder status

- Expected by the task: `/docs`
- Actual repository state: missing
- Impact:
  - There is no single formal requirements folder.
  - Intended architecture has to be reconstructed from the architecture markdown files and code structure.
  - Any requirements not mentioned in code or the architecture markdown files remain uncertain.

### Intended system from the available documentation

- The frontend architecture document in [frontend/folderstrucutre.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/folderstrucutre.md) describes:
  - thin App Router pages
  - feature-first UI modules
  - shared UI/hooks/utils
  - infrastructure layer for DB and AI
  - planned `/docs` directory
- The backend architecture document in [backend/folderstrucutre.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/folderstrucutre.md) describes:
  - thin FastAPI HTTP layer
  - pure domain services
  - repository-backed infrastructure
  - AI adapter abstraction
  - database-backed persistence
- Combined product intent across the available docs:
  - conversational AI for data entry and query
  - batch traceability across stages
  - dashboard analytics with anomalies, completeness, Sankey, and charts
  - vendor performance and scorecards
  - carbon reporting
  - AI provider switching between Featherless and Ollama
  - frontend/backend integration through a clear service API boundary

### Planned but not confirmed because `/docs` is absent

- No formal product requirements backlog
- No integration contract document between Next.js and FastAPI
- No deployment architecture document
- No explicit completion roadmap
- No API versioning/consumer contract outside code

## Frontend Implementation Status

### Frontend dependencies and tooling

- Runtime packages from [frontend/package.json](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/package.json):
  - `next`
  - `react`
  - `react-dom`
  - `@prisma/client`
  - `swr`
  - `clsx`
  - `tailwind-merge`
  - `zod`
  - `zustand`
- Dev packages:
  - `typescript`
  - `eslint`
  - `eslint-config-next`
  - `tailwindcss`
  - `@tailwindcss/postcss`
  - `prisma`
  - `@prisma/adapter-pg`
  - `vitest`
  - `@testing-library/react`
  - `@testing-library/jest-dom`
  - `@types/node`
  - `@types/react`
  - `@types/react-dom`
- Observed actual usage:
  - `next`, `react`, `react-dom`, `@prisma/client`, `swr`, `clsx`, `tailwind-merge` are clearly used.
  - `zustand` is installed but no usage was found in the audited source tree.
  - `zod` is installed, but the current frontend env layer does not use it.
- Scripts available:
  - `npm run dev`
  - `npm run build`
  - `npm run start`
  - `npm run lint`
- No typecheck script is defined.

### Frontend routing and page shell

- [src/app/layout.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/layout.tsx)
  - Root layout.
  - Sets site metadata for Aperio.
  - Loads Geist fonts.
  - Wraps page body but does not inject AppProviders globally.
- [src/app/globals.css](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/globals.css)
  - Global stylesheet.
- [src/app/page.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/page.tsx)
  - Default Next.js starter page.
  - Current status: incomplete relative to product intent.
- [src/app/favicon.ico](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/favicon.ico)
  - App icon asset.
- [src/app/(dashboard)/layout.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/(dashboard)/layout.tsx)
  - Dashboard shell layout.
  - Provides sidebar navigation.
  - Wraps dashboard pages in [AppProviders](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/core/providers/index.tsx).
- [src/app/(dashboard)/page.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/(dashboard)/page.tsx)
  - Dashboard route.
  - Renders [DashboardShell](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/components/DashboardShell.tsx).
- [src/app/(dashboard)/batches/page.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/(dashboard)/batches/page.tsx)
  - Batch list page.
  - Renders [PageHeader](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/components/PageHeader.tsx) and [BatchList](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/batches/components/BatchList.tsx).
- [src/app/(dashboard)/batches/[id]/page.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/(dashboard)/batches/[id]/page.tsx)
  - Dynamic batch detail page.
  - Passes route param to [BatchDetail](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/batches/components/BatchDetail.tsx).
- [src/app/(dashboard)/vendors/page.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/(dashboard)/vendors/page.tsx)
  - Vendor page.
  - Renders [VendorTable](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/vendors/components/VendorTable.tsx).
- [src/app/(dashboard)/carbon/page.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/(dashboard)/carbon/page.tsx)
  - Carbon page.
  - Renders [CarbonDashboard](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/carbon/components/CarbonDashboard.tsx).
- [src/app/(dashboard)/chat/page.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/(dashboard)/chat/page.tsx)
  - Chat page.
  - Renders [ChatPanel](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/components/ChatPanel.tsx).

### Frontend route configuration and navigation support

- [src/shared/constants/routes.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/constants/routes.ts)
  - Central route constants for dashboard, batches, vendors, and carbon.
- Current routing status:
  - Dashboard routes exist.
  - No vendor detail route.
  - No vendor scorecard route.
  - No auth-protected route enforcement.

### Frontend state management

- [src/core/providers/SWRProvider.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/core/providers/SWRProvider.tsx)
  - Global SWR defaults: no refetch on focus, no retry on error.
- [src/core/providers/ThemeProvider.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/core/providers/ThemeProvider.tsx)
  - Local React context for light/dark theme.
  - Theme lives in memory only.
- [src/core/providers/index.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/core/providers/index.tsx)
  - Composes theme and SWR providers.
- [src/features/chat/hooks/useChat.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/hooks/useChat.ts)
  - Local component state for chat messages.
- [src/features/chat/hooks/useChatHistory.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/hooks/useChatHistory.ts)
  - LocalStorage-backed history management.
  - Current status: built but not wired into the visible chat experience.
- [src/shared/hooks/useLocalStorage.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/hooks/useLocalStorage.ts)
  - Generic localStorage hook.
- [src/shared/hooks/useDebounce.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/hooks/useDebounce.ts)
  - Generic debounce hook.
- [src/shared/hooks/usePrevious.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/hooks/usePrevious.ts)
  - Previous-value helper.
  - Current status: implemented but currently fails lint due to React ref rule.
- No global Zustand store is implemented despite the package being installed.

### Frontend internal API routes

- [src/app/api/batches/route.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/api/batches/route.ts)
  - `GET /api/batches`
  - Parses query params for material, stage, vendor, date range, page, limit.
  - Calls [getBatches](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/db/queries.ts).
  - Status: implemented and data-backed through Prisma.
- [src/app/api/batches/[id]/route.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/api/batches/[id]/route.ts)
  - `GET /api/batches/:id`
  - Calls [getBatchById](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/db/queries.ts).
  - Returns 404 if missing.
  - Status: implemented and data-backed through Prisma.
- [src/app/api/vendors/route.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/api/vendors/route.ts)
  - `GET /api/vendors`
  - Calls [getVendors](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/db/queries.ts).
  - Status: implemented and data-backed through Prisma.
- [src/app/api/stats/route.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/api/stats/route.ts)
  - `GET /api/stats`
  - Calls [getDashboardStats](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/db/queries.ts).
  - Status: implemented and data-backed through Prisma.
- [src/app/api/insights/route.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/api/insights/route.ts)
  - `GET /api/insights?batchId=...`
  - Calls frontend AI provider directly.
  - Tries to coerce AI output into `{ summary, recommendations }`.
  - Status: implemented but AI/network dependent.
- [src/app/api/chat/route.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/api/chat/route.ts)
  - `POST /api/chat`
  - Applies rate limiting via [rateLimit.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/core/middleware/rateLimit.ts).
  - Calls frontend AI provider.
  - Attempts to parse JSON output into structured data.
  - Status: implemented, but does not persist to Prisma and does not call the Python backend.
- [src/app/api/carbon/estimate/route.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/api/carbon/estimate/route.ts)
  - `GET /api/carbon/estimate?batchId=...`
  - Fetches batch data and computes emissions by stage.
  - Status: implemented and local-data-backed.
- [src/app/api/carbon/summary/route.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/app/api/carbon/summary/route.ts)
  - `GET /api/carbon/summary`
  - Aggregates emissions across batches.
  - Status: implemented and local-data-backed.

### Frontend feature inventory: dashboard

- [src/features/dashboard/index.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/index.ts)
  - Barrel export.
- [src/features/dashboard/components/DashboardShell.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/components/DashboardShell.tsx)
  - Main dashboard container.
  - Loads stats.
  - Displays completeness, anomalies, KPI grid, and AI insight placeholder.
- [src/features/dashboard/components/KPIGrid.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/components/KPIGrid.tsx)
  - Renders four KPI cards from stats.
- [src/features/dashboard/components/KPICard.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/components/KPICard.tsx)
  - Generic metric card.
- [src/features/dashboard/components/InsightPanel.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/components/InsightPanel.tsx)
  - AI insight panel.
  - Requires batch ID for actual insight fetch.
  - Current status: on dashboard route itself it functions as a prompt to select a batch.
- [src/features/dashboard/components/AnomalyAlert.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/components/AnomalyAlert.tsx)
  - Visual alert list for warnings/critical anomalies.
- [src/features/dashboard/components/CompletenessScore.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/components/CompletenessScore.tsx)
  - Displays completeness percentage badge.
- [src/features/dashboard/charts/SankeyDiagram.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/charts/SankeyDiagram.tsx)
  - Placeholder chart shell.
  - Not connected to a real charting library.
- [src/features/dashboard/charts/BatchBarChart.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/charts/BatchBarChart.tsx)
  - Placeholder chart shell.
- [src/features/dashboard/charts/MaterialPieChart.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/charts/MaterialPieChart.tsx)
  - Placeholder chart shell.
- [src/features/dashboard/charts/WeeklyLineChart.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/charts/WeeklyLineChart.tsx)
  - Placeholder chart shell.
- [src/features/dashboard/charts/LossHeatmap.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/charts/LossHeatmap.tsx)
  - Placeholder chart shell.
- [src/features/dashboard/hooks/useDashboardStats.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/hooks/useDashboardStats.ts)
  - SWR hook for stats.
- [src/features/dashboard/hooks/useInsights.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/hooks/useInsights.ts)
  - SWR hook for AI insights.
- [src/features/dashboard/hooks/useAnomalies.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/hooks/useAnomalies.ts)
  - Derived anomaly grouping helper.
- [src/features/dashboard/services/statsService.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/services/statsService.ts)
  - Fetch wrapper for stats.
- [src/features/dashboard/types/index.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/types/index.ts)
  - Dashboard type contracts.
- [src/features/dashboard/utils/sankeyBuilder.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/utils/sankeyBuilder.ts)
  - Builds Sankey nodes and links with loss nodes.
- [src/features/dashboard/utils/chartColors.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/utils/chartColors.ts)
  - Centralized color palette.
- [src/features/dashboard/__tests__/SankeyDiagram.test.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/__tests__/SankeyDiagram.test.tsx)
  - Dashboard chart test coverage.
- [src/features/dashboard/__tests__/sankeyBuilder.test.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/__tests__/sankeyBuilder.test.ts)
  - Sankey builder test coverage.
- [src/features/dashboard/__tests__/useDashboardStats.test.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/dashboard/__tests__/useDashboardStats.test.ts)
  - Hook test coverage.

### Frontend feature inventory: batches

- [src/features/batches/index.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/batches/index.ts)
  - Barrel export.
- [src/features/batches/components/BatchList.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/batches/components/BatchList.tsx)
  - Loads and displays batches.
  - Uses EmptyState and LoadingState.
- [src/features/batches/components/BatchCard.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/batches/components/BatchCard.tsx)
  - Clickable batch summary card.
- [src/features/batches/components/BatchDetail.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/batches/components/BatchDetail.tsx)
  - Fetches single batch and renders batch timeline.
- [src/features/batches/components/BatchTimeline.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/batches/components/BatchTimeline.tsx)
  - Timeline view of stages with in/out/loss quantities.
- [src/features/batches/components/BatchFilters.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/batches/components/BatchFilters.tsx)
  - Material/stage/date UI controls only.
  - Current status: stubbed UI, not wired to query state.
- [src/features/batches/hooks/useBatches.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/batches/hooks/useBatches.ts)
  - SWR list hook.
- [src/features/batches/hooks/useBatchDetail.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/batches/hooks/useBatchDetail.ts)
  - SWR detail hook.
- [src/features/batches/services/batchService.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/batches/services/batchService.ts)
  - Batch list/detail fetch service.
- [src/features/batches/types/index.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/batches/types/index.ts)
  - Batch, stage, and filter contracts.
- [src/features/batches/__tests__/BatchList.test.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/batches/__tests__/BatchList.test.tsx)
  - Batch list test coverage.
- [src/features/batches/__tests__/batchService.test.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/batches/__tests__/batchService.test.ts)
  - Batch service test coverage.

### Frontend feature inventory: chat

- [src/features/chat/index.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/index.ts)
  - Barrel export.
- [src/features/chat/components/ChatPanel.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/components/ChatPanel.tsx)
  - Primary chat container.
- [src/features/chat/components/ChatInput.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/components/ChatInput.tsx)
  - Textarea-based chat composer.
  - Current status: no voice integration.
- [src/features/chat/components/MessageBubble.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/components/MessageBubble.tsx)
  - User/assistant message renderer.
- [src/features/chat/components/StructuredOutput.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/components/StructuredOutput.tsx)
  - Structured parsed output card.
- [src/features/chat/components/TypingIndicator.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/components/TypingIndicator.tsx)
  - Assistant loading indicator.
- [src/features/chat/hooks/useChat.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/hooks/useChat.ts)
  - Manages chat state and network requests.
- [src/features/chat/hooks/useChatHistory.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/hooks/useChatHistory.ts)
  - Local persistence hook.
  - Current status: not wired into main chat experience and currently triggers lint.
- [src/features/chat/hooks/useVoiceInput.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/hooks/useVoiceInput.ts)
  - Web Speech API wrapper.
  - Current status: built but unused in UI.
- [src/features/chat/services/chatService.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/services/chatService.ts)
  - POST service for `/api/chat`.
  - Current status: works, but has an unused import warning.
- [src/features/chat/services/messageFormatter.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/services/messageFormatter.ts)
  - Formats AI reply and structured metadata.
- [src/features/chat/types/index.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/types/index.ts)
  - Chat message and response types.
- [src/features/chat/utils/messageParser.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/utils/messageParser.ts)
  - JSON parser from plain text/code blocks.
- [src/features/chat/__tests__/ChatPanel.test.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/__tests__/ChatPanel.test.tsx)
  - Chat UI test coverage.
- [src/features/chat/__tests__/chatService.test.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/__tests__/chatService.test.ts)
  - Chat service test coverage.
- [src/features/chat/__tests__/useChat.test.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/chat/__tests__/useChat.test.ts)
  - Chat hook test coverage.

### Frontend feature inventory: vendors

- [src/features/vendors/index.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/vendors/index.ts)
  - Barrel export.
- [src/features/vendors/components/VendorTable.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/vendors/components/VendorTable.tsx)
  - Main vendor listing table.
- [src/features/vendors/components/VendorScorecard.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/vendors/components/VendorScorecard.tsx)
  - Detailed vendor scorecard card.
  - Current status: implemented component, not surfaced by routing.
- [src/features/vendors/components/VendorBadge.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/vendors/components/VendorBadge.tsx)
  - Score badge.
- [src/features/vendors/hooks/useVendors.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/vendors/hooks/useVendors.ts)
  - SWR list hook.
- [src/features/vendors/services/vendorService.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/vendors/services/vendorService.ts)
  - Vendor fetch service.
- [src/features/vendors/types/index.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/vendors/types/index.ts)
  - Vendor and vendor scorecard types.

### Frontend feature inventory: carbon

- [src/features/carbon/index.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/carbon/index.ts)
  - Barrel export.
- [src/features/carbon/components/CarbonDashboard.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/carbon/components/CarbonDashboard.tsx)
  - Main carbon dashboard.
- [src/features/carbon/components/CarbonBreakdown.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/carbon/components/CarbonBreakdown.tsx)
  - Alternate summary block.
- [src/features/carbon/components/CarbonKPI.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/carbon/components/CarbonKPI.tsx)
  - Carbon metric card.
- [src/features/carbon/components/CarbonGauge.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/carbon/components/CarbonGauge.tsx)
  - Net/total emission ratio visualization.
- [src/features/carbon/hooks/useCarbon.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/carbon/hooks/useCarbon.ts)
  - SWR summary hook.
- [src/features/carbon/hooks/useCarbonStats.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/carbon/hooks/useCarbonStats.ts)
  - SWR estimate hook.
- [src/features/carbon/services/carbonService.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/carbon/services/carbonService.ts)
  - Carbon summary/estimate service.
- [src/features/carbon/types/index.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/features/carbon/types/index.ts)
  - Carbon type contracts.

### Frontend shared UI, utilities, and support files

- Shared components:
  - [src/shared/components/EmptyState.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/components/EmptyState.tsx) — generic empty state.
  - [src/shared/components/ErrorBoundary.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/components/ErrorBoundary.tsx) — React error boundary.
  - [src/shared/components/LoadingState.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/components/LoadingState.tsx) — spinner/loading message.
  - [src/shared/components/PageHeader.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/components/PageHeader.tsx) — page heading component.
- Shared UI primitives:
  - [src/shared/ui/Badge.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/ui/Badge.tsx) — badge primitive.
  - [src/shared/ui/Button.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/ui/Button.tsx) — button primitive.
  - [src/shared/ui/Card.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/ui/Card.tsx) — card primitives.
  - [src/shared/ui/Modal.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/ui/Modal.tsx) — modal primitive.
  - [src/shared/ui/Tooltip.tsx](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/ui/Tooltip.tsx) — tooltip primitive.
  - [src/shared/ui/index.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/ui/index.ts) — barrel export.
- Shared constants:
  - [src/shared/constants/materials.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/constants/materials.ts) — material labels/options.
  - [src/shared/constants/stages.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/constants/stages.ts) — stage labels/order.
  - [src/shared/constants/routes.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/constants/routes.ts) — route constants.
- Shared hooks:
  - [src/shared/hooks/useDebounce.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/hooks/useDebounce.ts) — debounce helper.
  - [src/shared/hooks/useLocalStorage.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/hooks/useLocalStorage.ts) — localStorage helper.
  - [src/shared/hooks/usePrevious.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/hooks/usePrevious.ts) — previous value helper with current lint issue.
- Shared types:
  - [src/shared/types/index.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/types/index.ts) — shared product types.
- Shared utils:
  - [src/shared/utils/api.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/utils/api.ts) — fetch wrapper with ApiError.
  - [src/shared/utils/cn.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/utils/cn.ts) — clsx + tailwind merge helper.
  - [src/shared/utils/dates.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/utils/dates.ts) — formatting helpers.
  - [src/shared/utils/numbers.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/shared/utils/numbers.ts) — numeric formatting helpers.

### Frontend core config and middleware

- [src/core/config/constants.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/core/config/constants.ts)
  - App constants, pagination defaults, AI generation config, rate-limit settings.
- [src/core/config/env.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/core/config/env.ts)
  - Lazy environment readers for FEATHERLESS/Ollama/database.
- [src/core/middleware/rateLimit.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/core/middleware/rateLimit.ts)
  - In-memory counter-based rate limiter.
- [src/core/middleware/withRateLimit.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/core/middleware/withRateLimit.ts)
  - Higher-order route wrapper around rateLimit.
  - Current status: available but not broadly applied.
- [src/core/middleware/withErrorHandler.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/core/middleware/withErrorHandler.ts)
  - Higher-order route wrapper for API error formatting.
  - Current status: available but not broadly applied.
- [src/core/middleware/validateRequest.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/core/middleware/validateRequest.ts)
  - Body field presence validator.
  - Current status: available but not broadly applied.
- [src/core/middleware/withAuth.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/core/middleware/withAuth.ts)
  - Placeholder auth wrapper.
  - Current status: no auth check implemented.

### Frontend infrastructure: Prisma, DB access, AI, carbon

- Prisma and DB schema:
  - [prisma/schema.prisma](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/prisma/schema.prisma)
    - `Batch` has many `BatchStage`.
    - `BatchStage` belongs to `Batch`.
    - `Vendor` is standalone and not relationally tied to `Batch`.
  - [prisma/seed.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/prisma/seed.ts)
    - Seed entrypoint.
  - [prisma/prisma.config.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/prisma/prisma.config.ts)
    - Prisma config file.
- DB client and query layer:
  - [src/infrastructure/db/prisma.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/db/prisma.ts)
    - Prisma client singleton.
  - [src/infrastructure/db/client.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/db/client.ts)
    - Support client file.
  - [src/infrastructure/db/queries.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/db/queries.ts)
    - Primary DB facade.
    - Computes dashboard totals, anomalies, completeness, material breakdown, stage breakdown, and Sankey data.
  - [src/infrastructure/db/queries/batches.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/db/queries/batches.ts)
    - Batch list/detail/create helpers.
  - [src/infrastructure/db/queries/entries.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/db/queries/entries.ts)
    - Creates batch/material entry from parsed intent.
    - Current status: exists but not called from main chat flow.
  - [src/infrastructure/db/queries/vendors.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/db/queries/vendors.ts)
    - Vendor list/lookup helpers.
  - [src/infrastructure/db/queries/stats.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/db/queries/stats.ts)
    - Simpler stats aggregation helper.
  - [src/infrastructure/db/seed/index.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/db/seed/index.ts)
    - Sample vendor and sample batch seeding.
  - [src/infrastructure/db/seed/kaggleTransformer.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/db/seed/kaggleTransformer.ts)
    - Dataset transform support.
- AI infrastructure:
  - [src/infrastructure/ai/provider.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/ai/provider.ts)
    - Calls Featherless first and falls back to Ollama.
  - [src/infrastructure/ai/prompts.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/ai/prompts.ts)
    - Generic system prompt and user prompt builder.
  - [src/infrastructure/ai/prompts/intentPrompt.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/ai/prompts/intentPrompt.ts)
    - Intent prompt support file.
  - [src/infrastructure/ai/prompts/entityPrompt.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/ai/prompts/entityPrompt.ts)
    - Entity prompt support file.
  - [src/infrastructure/ai/prompts/insightPrompt.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/ai/prompts/insightPrompt.ts)
    - Insight prompt support file.
  - [src/infrastructure/ai/prompts/queryPrompt.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/ai/prompts/queryPrompt.ts)
    - Query prompt support file.
  - [src/infrastructure/ai/featherless/client.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/ai/featherless/client.ts)
    - Featherless client implementation.
  - [src/infrastructure/ai/featherless/types.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/ai/featherless/types.ts)
    - Featherless type support.
  - [src/infrastructure/ai/ollama/client.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/ai/ollama/client.ts)
    - Ollama client implementation.
  - [src/infrastructure/ai/ollama/types.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/ai/ollama/types.ts)
    - Ollama type support.
- Carbon infrastructure:
  - [src/infrastructure/carbon/constants.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/carbon/constants.ts)
    - Material emission factors, stage multipliers, and offset rate.
  - [src/infrastructure/carbon/estimator.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/infrastructure/carbon/estimator.ts)
    - Calculates stage-by-stage and total emissions.

### Frontend project-level support files

- [README.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/README.md) — default Next.js readme, not product-specific.
- [AGENTS.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/AGENTS.md) — agent instructions/support doc.
- [CLAUDE.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/CLAUDE.md) — assistant/support doc.
- [folderstrucutre.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/folderstrucutre.md) — intended frontend architecture.
- [package.json](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/package.json) — dependencies and scripts.
- [package-lock.json](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/package-lock.json) — dependency lockfile.
- [tsconfig.json](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/tsconfig.json) — TypeScript config.
- [eslint.config.mjs](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/eslint.config.mjs) — lint config.
- [postcss.config.mjs](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/postcss.config.mjs) — PostCSS config.
- [next.config.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/next.config.ts) — currently minimal/empty Next.js config.
- [env.example](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/env.example) — frontend environment template.
- [types/prisma.d.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/types/prisma.d.ts) — generated Prisma types support.
- [src/types/web-speech.d.ts](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/src/types/web-speech.d.ts) — Web Speech API type augmentation.
- Public assets:
  - [public/file.svg](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/public/file.svg)
  - [public/globe.svg](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/public/globe.svg)
  - [public/next.svg](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/public/next.svg)
  - [public/vercel.svg](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/public/vercel.svg)
  - [public/window.svg](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/public/window.svg)

### Frontend package marker and barrel files

- Feature and provider index files are implemented as barrel exports and support cleaner imports.
- There are no hidden frontend sub-packages with their own runtime beyond the files listed above.

### Frontend current status summary

- Working:
  - dashboard route shell
  - batch list/detail experience
  - vendor listing
  - carbon summary and estimate APIs
  - chat UI and AI request flow
  - Prisma schema/query layer
  - SWR-based client state fetching
- Partial/in-progress:
  - dashboard visualization components
  - batch filters wiring
  - chat persistence integration
  - vendor scorecard surfacing
  - auth
- Stubbed or incomplete:
  - root landing page
  - withAuth middleware
  - several middleware wrappers are present but not broadly applied

## Backend Implementation Status

### Backend dependencies and tooling

- Runtime packages from [pyproject.toml](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/pyproject.toml):
  - `fastapi`
  - `uvicorn`
  - `sqlalchemy`
  - `alembic`
  - `pydantic-settings`
  - `httpx`
- Dev packages:
  - `pytest`
  - `pytest-asyncio`
  - `pytest-cov`
- Backend startup flow documented in [README.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/README.md):
  - install dependencies
  - configure env
  - run migrations
  - seed database
  - run uvicorn
  - run tests

### Backend application shell

- [src/api/app.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/app.py)
  - FastAPI app factory.
  - Registers CORS.
  - Includes `/v1` router.
  - Exposes `GET /health`.
- [src/api/dependencies.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/dependencies.py)
  - Dependency injection for DB session, batch repository, chat service, and insight service.
- [src/api/v1/router.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/router.py)
  - Aggregates chat, batches, stats, vendors, insights, and carbon routers.

### Backend endpoint inventory

- [src/api/app.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/app.py)
  - `GET /health`
  - Status: implemented and functional.
  - Returns `{ status, environment }`.
- [src/api/v1/chat/routes.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/chat/routes.py)
  - `POST /v1/chat/`
  - Status: implemented.
  - Behavior:
    - validates via Pydantic request schema
    - sanitizes input
    - calls `ChatService`
    - maps `UnrecognizedIntentError` to 422
    - maps `ValueError` to 400
  - Current limitation: repository calls inside ChatService are stub-backed.
- [src/api/v1/batches/routes.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/batches/routes.py)
  - `GET /v1/batches/`
  - Status: implemented route, ineffective repository.
  - Current behavior: returns repository list and count.
  - Current repository result: empty list stub.
- [src/api/v1/batches/routes.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/batches/routes.py)
  - `GET /v1/batches/{batch_id}`
  - Status: implemented route, ineffective repository.
  - Current repository result: placeholder object with only ID.
- [src/api/v1/insights/routes.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/insights/routes.py)
  - `POST /v1/insights/{batch_id}`
  - Status: implemented.
  - Behavior: calls `InsightService.generate_batch_insight`.
  - Current limitation: result quality depends on stub repository data and AI availability.
- [src/api/v1/carbon/routes.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/carbon/routes.py)
  - `GET /v1/carbon/`
  - Query params: `material`, `quantity_kg`
  - Status: fully implemented and self-contained.
- [src/api/v1/stats/routes.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/stats/routes.py)
  - `GET /v1/stats/dashboard`
  - Status: 501 not implemented.
- [src/api/v1/stats/routes.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/stats/routes.py)
  - `GET /v1/stats/sankey`
  - Status: 501 not implemented.
- [src/api/v1/vendors/routes.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/vendors/routes.py)
  - `GET /v1/vendors/`
  - Status: 501 not implemented.
- [src/api/v1/vendors/routes.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/vendors/routes.py)
  - `GET /v1/vendors/{vendor_id}`
  - Status: 501 not implemented.
- [src/api/v1/vendors/routes.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/vendors/routes.py)
  - `GET /v1/vendors/{vendor_id}/scorecard`
  - Status: 501 not implemented.

### Backend API schema inventory

- [src/api/v1/chat/schemas.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/chat/schemas.py)
  - `ChatRequest`
  - `ChatResponse`
- [src/api/v1/batches/schemas.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/batches/schemas.py)
  - `BatchResponse`
  - `BatchListResponse`
- [src/api/v1/stats/schemas.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/stats/schemas.py)
  - `DashboardStatsResponse`
  - `SankeyNode`
  - `SankeyLink`
  - `SankeyResponse`
- [src/api/v1/vendors/schemas.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/vendors/schemas.py)
  - `VendorResponse`
  - `ScorecardResponse`
- [src/api/v1/insights/schemas.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/insights/schemas.py)
  - `InsightResponse`
- [src/api/v1/carbon/schemas.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/carbon/schemas.py)
  - `CarbonStatsResponse`

### Backend domain inventory: chat

- [src/domain/chat/models.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/chat/models.py)
  - Intent and material enums.
  - `ParsedEntry`.
  - `QueryFilter`.
- [src/domain/chat/services.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/chat/services.py)
  - Core chat orchestration.
  - Classifies intent with AI.
  - Parses entry/query responses.
  - Generates batch IDs when missing.
  - Sends data to repository methods.
- [src/domain/chat/intent_classifier.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/chat/intent_classifier.py)
  - Keyword-based fallback classifier.
- [src/domain/chat/entity_extractor.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/chat/entity_extractor.py)
  - Regex extractors for quantity and material.
  - Completeness validation helper.
- [src/domain/chat/exceptions.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/chat/exceptions.py)
  - Chat domain exception hierarchy.

### Backend domain inventory: batches

- [src/domain/batches/models.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/batches/models.py)
  - `BatchStage` enum.
  - `BatchLifecycle`.
  - `Batch`.
  - Derived properties for loss and current quantity.
- [src/domain/batches/services.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/batches/services.py)
  - Batch creation and stage advancement service.
- [src/domain/batches/anomaly_detector.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/batches/anomaly_detector.py)
  - Stage-level and batch-level anomaly detection.
- [src/domain/batches/completeness_scorer.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/batches/completeness_scorer.py)
  - Completeness scoring logic.
- [src/domain/batches/exceptions.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/batches/exceptions.py)
  - Batch domain exception types.

### Backend domain inventory: insights

- [src/domain/insights/models.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/insights/models.py)
  - `AnomalyAlert`
  - `BatchSummary`
  - `Insight`
- [src/domain/insights/services.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/insights/services.py)
  - AI narrative generation and summary generation for a batch.
- [src/domain/insights/exceptions.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/insights/exceptions.py)
  - Insight domain exception support.

### Backend domain inventory: vendors

- [src/domain/vendors/models.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/vendors/models.py)
  - `Vendor`
  - `VendorScorecard`
- [src/domain/vendors/services.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/vendors/services.py)
  - Vendor scorecard calculation logic.
- [src/domain/vendors/exceptions.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/vendors/exceptions.py)
  - Vendor domain exceptions.

### Backend domain inventory: carbon

- [src/domain/carbon/models.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/carbon/models.py)
  - `MaterialFactor`
  - `CarbonCalculation`
- [src/domain/carbon/services.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/carbon/services.py)
  - Recycled-vs-virgin carbon calculation service.
- [src/domain/carbon/exceptions.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/domain/carbon/exceptions.py)
  - Carbon domain exceptions.

### Backend infrastructure inventory: database and repositories

- Database connection and ORM:
  - [src/infrastructure/database/connection.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/database/connection.py) — SQLAlchemy engine/session management.
  - [src/infrastructure/database/models.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/database/models.py) — ORM models for `batches`, `batch_lifecycle`, `entries`, `vendors`.
  - [src/infrastructure/database/migrations/versions/.gitkeep](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/database/migrations/versions/.gitkeep) — migration folder placeholder only.
- Repository layer:
  - [src/infrastructure/repositories/batch_repository.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/repositories/batch_repository.py)
    - Declares create/get/list/query methods.
    - Current status: stubbed.
  - [src/infrastructure/repositories/entry_repository.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/repositories/entry_repository.py)
    - Declares create/get/list/delete methods.
    - Current status: stubbed.
  - [src/infrastructure/repositories/vendor_repository.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/repositories/vendor_repository.py)
    - Declares vendor access and scorecard methods.
    - Current status: stubbed.
  - [src/infrastructure/repositories/stats_repository.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/repositories/stats_repository.py)
    - Declares stats aggregation methods.
    - Current status: stubbed.

### Backend infrastructure inventory: external integrations

- AI abstraction:
  - [src/infrastructure/adapters/ai/base.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/adapters/ai/base.py) — AI adapter contract and AIResponse.
  - [src/infrastructure/adapters/ai/factory.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/adapters/ai/factory.py) — provider selection.
  - [src/infrastructure/adapters/ai/featherless.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/adapters/ai/featherless.py) — cloud AI adapter with fallback model.
  - [src/infrastructure/adapters/ai/ollama.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/adapters/ai/ollama.py) — local AI adapter.
- AI prompt files:
  - [src/infrastructure/adapters/ai/prompts/intent_prompt.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/adapters/ai/prompts/intent_prompt.py)
  - [src/infrastructure/adapters/ai/prompts/entity_prompt.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/adapters/ai/prompts/entity_prompt.py)
  - [src/infrastructure/adapters/ai/prompts/insight_prompt.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/adapters/ai/prompts/insight_prompt.py)
  - [src/infrastructure/adapters/ai/prompts/query_prompt.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/adapters/ai/prompts/query_prompt.py)
- Dataset integration:
  - [src/infrastructure/adapters/kaggle/transformer.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/adapters/kaggle/transformer.py)
    - Data-transform support for Kaggle-sourced input.

### Backend config, shared utilities, and contracts

- [src/config/settings.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/config/settings.py)
  - Validated env/config settings.
  - Supports AI provider selection, DB URL, debug mode, and CORS origins.
- [src/config/logging.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/config/logging.py)
  - Logging setup helper.
- [src/shared/types/protocols.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/shared/types/protocols.py)
  - Protocols for AI adapter and repositories.
- [src/shared/constants/materials.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/shared/constants/materials.py)
  - Material enum.
- [src/shared/constants/stages.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/shared/constants/stages.py)
  - Process stage enum.
- [src/shared/constants/thresholds.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/shared/constants/thresholds.py)
  - Anomaly thresholds.
- [src/shared/utils/dates.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/shared/utils/dates.py)
  - Relative date parsing.
- [src/shared/utils/json_parser.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/shared/utils/json_parser.py)
  - JSON extraction from LLM output.
- [src/shared/utils/validators.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/shared/utils/validators.py)
  - Positive number validation, string validation, enum validation, input sanitization.

### Backend authentication and authorization status

- Current implementation status: none
- Observed security controls:
  - CORS is configured in [src/api/app.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/app.py).
  - Chat input is sanitized in [src/shared/utils/validators.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/shared/utils/validators.py) and applied in [src/api/v1/chat/routes.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/api/v1/chat/routes.py).
  - AI access is environment-configured in [src/config/settings.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/config/settings.py).
- Missing:
  - user authentication
  - role-based authorization
  - session/token handling
  - per-user permissions
  - backend auth middleware/dependencies

### Backend database schema and relationships

- ORM models from [src/infrastructure/database/models.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/src/infrastructure/database/models.py):
  - `BatchORM`
  - `BatchLifecycleORM`
  - `EntryORM`
  - `VendorORM`
- Relationships:
  - `BatchORM.lifecycle` → one-to-many with `BatchLifecycleORM`
  - `BatchORM.entries` → one-to-many with `EntryORM`
  - `BatchLifecycleORM.batch` → many-to-one with `BatchORM`
  - `EntryORM.batch` → many-to-one with `BatchORM`
  - `VendorORM` currently has no explicit relational linkage to `BatchORM`
- Current status:
  - data structures exist
  - repository persistence is not implemented
  - migration history is not implemented

### Backend project-level support files

- [README.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/README.md) — backend setup and run instructions.
- [.env.example](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/.env.example) — environment template.
- [alembic.ini](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/alembic.ini) — Alembic config.
- [pyproject.toml](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/pyproject.toml) — dependencies and pytest config.
- [scripts/seed_db.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/scripts/seed_db.py) — DB seed script.
- [scripts/test_prompts.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/scripts/test_prompts.py) — prompt testing helper.
- [tests/fixtures/conftest.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/tests/fixtures/conftest.py) — pytest fixtures.
- [tests/fixtures/batch_fixtures.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/tests/fixtures/batch_fixtures.py) — sample batch fixtures.
- [tests/fixtures/sample_inputs.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/tests/fixtures/sample_inputs.py) — natural-language sample inputs.
- Unit tests:
  - [tests/unit/domain/batches/test_anomaly_detector.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/tests/unit/domain/batches/test_anomaly_detector.py)
  - [tests/unit/domain/batches/test_completeness_scorer.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/tests/unit/domain/batches/test_completeness_scorer.py)
  - [tests/unit/domain/carbon/test_carbon_service.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/tests/unit/domain/carbon/test_carbon_service.py)
  - [tests/unit/domain/chat/test_chat_service.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/tests/unit/domain/chat/test_chat_service.py)
  - [tests/unit/domain/chat/test_entity_extractor.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/tests/unit/domain/chat/test_entity_extractor.py)
  - [tests/unit/domain/chat/test_intent_classifier.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/tests/unit/domain/chat/test_intent_classifier.py)
  - [tests/unit/shared/test_date_utils.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/tests/unit/shared/test_date_utils.py)
  - [tests/unit/shared/test_json_parser.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/tests/unit/shared/test_json_parser.py)
- Integration tests:
  - [tests/integration/test_ai_adapters.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/tests/integration/test_ai_adapters.py)
  - [tests/integration/test_chat_flow.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/tests/integration/test_chat_flow.py)
  - [tests/integration/test_stats_aggregation.py](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/aperio-api/tests/integration/test_stats_aggregation.py)

### Backend package marker files

- Many `__init__.py` files exist across `api`, `domain`, `infrastructure`, `shared`, and test packages.
- These are package markers/import surfaces and do not materially change functionality based on the audited repository state.

### Backend current status summary

- Working:
  - FastAPI bootstrapping
  - health endpoint
  - carbon calculation endpoint
  - AI adapter implementations
  - domain logic for chat/batches/vendors/insights/carbon
  - test scaffolding
- Partial/in-progress:
  - chat endpoint end-to-end behavior
  - batch endpoints
  - AI-driven insight generation
  - ORM schema layer
- Stubbed or incomplete:
  - vendor APIs
  - stats APIs
  - repository persistence
  - auth
  - migrations

## Current Integration Status

### Critical status

- **The frontend and backend are NOT YET CONNECTED.**

### What is connected today

- Frontend UI → frontend feature services → frontend Next.js API routes
- Frontend Next.js API routes → frontend Prisma query layer / frontend AI provider / frontend carbon estimator
- Backend FastAPI → backend service layer → backend repositories and AI adapters

### What is not connected

- Frontend pages do not call backend FastAPI endpoints.
- Frontend chat does not call `POST /v1/chat/`.
- Frontend dashboard does not call backend stats endpoints.
- Frontend vendor page does not call backend vendor endpoints.
- Frontend carbon page does not call backend carbon endpoint.
- Frontend batches pages do not call backend batch endpoints.

### Required work to integrate the systems

- Replace or proxy frontend internal API routes so they call backend FastAPI routes.
- Align route shapes:
  - frontend `/api/stats` expectations vs backend `/v1/stats/dashboard` and `/v1/stats/sankey`
  - frontend `/api/vendors` expectations vs backend `/v1/vendors/*`
  - frontend `/api/batches` expectations vs backend `/v1/batches/*`
  - frontend `/api/chat` expectations vs backend `/v1/chat/`
  - frontend `/api/insights` expectations vs backend `/v1/insights/{batch_id}`
  - frontend `/api/carbon/*` expectations vs backend `/v1/carbon/`
- Align response contracts:
  - frontend dashboard stats shape is richer than backend stats schemas currently expose
  - frontend vendor list shape differs from backend vendor schema
  - frontend batch shape differs from backend batch schema
- Implement backend repositories and stats/vendor endpoints so the frontend has real data to consume.
- Decide single source of truth for database ownership:
  - current frontend uses Prisma/PostgreSQL
  - current backend defaults to SQLAlchemy/SQLite
- Standardize environment, database, and migration strategy.

## What Has Been Built

### Frontend completed functionality

- Feature-routed dashboard application shell
- Batch listing and batch detail views
- Vendor listing view
- Carbon summary UI and carbon estimate/summary APIs
- Chat UI with AI-backed request flow
- Prisma schema and query helpers
- Sample seed data flow
- Shared design-system primitives and utility hooks
- SWR-based data fetching
- Testing coverage for key feature modules

### Backend completed functionality

- FastAPI app setup with CORS and health route
- Carbon calculation API
- AI adapter abstraction for Featherless and Ollama
- Chat domain logic and route shape
- Batch domain logic
- Vendor scorecard domain logic
- Insight domain logic
- SQLAlchemy ORM model layer
- Unit and integration test scaffolding

### Cross-cutting functionality built in both stacks

- AI provider abstraction
- Carbon domain logic
- Batch-related domain/data structures
- Traceability-oriented naming and architecture

## What Remains Unimplemented

### Frontend features and UX

- Replace the default landing page with a real product home/dashboard entry page.
- Wire batch filter controls into actual request/filter state.
- Render real dashboard charts instead of placeholder shells.
- Surface vendor scorecards in routing/UI.
- Wire voice input into chat input.
- Wire chat history persistence into active chat UI.
- Implement real frontend authentication and access control.
- Remove unused/dead dependency usage or add intended Zustand state layer.

### Backend endpoints and services

- Implement `GET /v1/stats/dashboard`.
- Implement `GET /v1/stats/sankey`.
- Implement `GET /v1/vendors/`.
- Implement `GET /v1/vendors/{vendor_id}`.
- Implement `GET /v1/vendors/{vendor_id}/scorecard`.
- Replace stubbed repository methods with real SQLAlchemy queries.
- Ensure batch endpoints return meaningful, schema-complete payloads.

### Database and persistence

- Create actual Alembic migrations.
- Choose a single production database strategy between frontend Prisma/PostgreSQL and backend SQLAlchemy/SQLite defaults.
- Implement backend seed path that matches repository/query behavior.
- Add explicit vendor-to-batch relationships if the product requires vendor analytics from relational data.

### Integration and contracts

- Connect frontend routes/services to backend APIs.
- Normalize API response shapes.
- Decide whether Next.js should remain a BFF/proxy or whether the frontend should call FastAPI directly.
- Consolidate AI behavior so chat and insights do not duplicate incompatible prompt/response contracts across both stacks.

### Security and auth

- Backend auth implementation
- Frontend auth implementation
- Auth middleware/dependency enforcement
- User identity propagation from frontend to backend

### Documentation

- Create the missing `/docs` directory if the team still intends to maintain requirements there.
- Add formal integration documentation, API contracts, and deployment architecture documents.

## Gaps Analysis

### Gap: documented layered system vs current runtime split

- Intended design: coherent frontend + backend system.
- Current reality: two parallel implementations of similar concepts.
- Impact: duplicated product logic, duplicated AI wiring, and no shared runtime contract.

### Gap: backend as intended API layer vs frontend self-serving APIs

- Intended design: backend exposes the system API.
- Current reality: frontend ships its own internal API routes backed by Prisma and local AI logic.
- Impact: backend progress does not automatically advance frontend behavior.

### Gap: documented analytics richness vs current dashboard rendering

- Intended design: KPI + Sankey + charts + insight-rich analytics.
- Current reality: KPIs and alerts exist, but most chart components are placeholders.
- Impact: the dashboard shows structure more than finished analytical visualization.

### Gap: documented vendor scorecards vs current user-visible vendor experience

- Intended design: vendor scorecard feature.
- Current reality:
  - backend has domain scorecard logic
  - frontend has a scorecard component
  - no complete routed, data-backed vendor scorecard workflow exists
- Impact: feature is present conceptually but not delivered end to end.

### Gap: documented conversational data entry vs actual persistence behavior

- Intended design: chat should support data entry and querying against system records.
- Current reality:
  - frontend chat is AI-backed but not persisted to backend or Prisma
  - backend chat is structured but repository-backed persistence is stubbed
- Impact: chat acts more like a prototype assistant than a reliable system-of-record input.

### Gap: documented persistence architecture vs current repository layer

- Intended design: repositories backed by database models and migrations.
- Current reality: backend repository layer is mostly placeholder code returning synthetic responses.
- Impact: backend APIs cannot serve as the authoritative data platform yet.

### Gap: documentation location vs repository reality

- Intended design: dedicated `/docs` directory.
- Current reality: no `/docs` folder exists.
- Impact: requirements are fragmented across architecture notes and code.

## Single-Source-of-Truth Conclusion

- Best representation of current user-visible product state: the frontend under [frontend](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend).
- Best representation of intended long-term service architecture: the backend and architecture notes under [backend/folderstrucutre.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/backend/folderstrucutre.md) and [frontend/folderstrucutre.md](file:///c:/Users/Suraj/OneDrive/Desktop/hackniche/frontend/folderstrucutre.md).
- Most important project truth right now: **the frontend and backend are both partially built, but they are not yet integrated, and the backend is not yet ready to replace the frontend's local data/API layer.**
