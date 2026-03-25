# VERIFY_CONNECTION.md — Aperio Full-Stack Integration Verification
## Frontend (Next.js 15) ↔ Backend (FastAPI) Connection Audit
### Run this after both MASTER_PROMPT.md and MASTER_PROMPT_FRONTEND.md are fully implemented

---

## 🎯 Goal

Verify that every frontend call reaches the correct backend endpoint, receives the correct
response shape, and renders correctly in the UI. Fix every mismatch found. Leave nothing
as "probably works" — every connection must be proven with a real request.

---

## ✅ Verification Checklist (Execute Every Step)

---

### PHASE 1 — Environment & Services Up

**Step 1.1 — Start backend services**
```bash
# Terminal 1 — Redis
docker-compose up redis -d

# Terminal 2 — FastAPI
cd aperio-api
uvicorn src.api.app:app --reload --port 8000

# Confirm: GET http://localhost:8000/health returns:
# {"status": "ok", "model": "Qwen/Qwen2.5-3B-Instruct"}
```

**Step 1.2 — Start frontend**
```bash
# Terminal 3 — Next.js
cd aperio
npm run dev

# Confirm: http://localhost:3000 loads without console errors
```

**Step 1.3 — Confirm CORS is not blocking**
```bash
curl -X OPTIONS http://localhost:8000/v1/chat/ \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Must see: Access-Control-Allow-Origin: http://localhost:3000
# If missing: fix cors_origins in src/config/settings.py
```

---

### PHASE 2 — Auth Flow

**Step 2.1 — Firebase Auth init**
- Open http://localhost:3000/login
- Confirm login page renders with no console errors
- Confirm Firebase is initialized (no "Firebase App named '[DEFAULT]' already exists" error)

**Step 2.2 — Sign in + JWT token flow**
- Sign in with a test account
- Open browser DevTools → Application → Storage → confirm Firebase auth token exists
- Open Network tab, confirm subsequent API calls include `Authorization: Bearer <token>` header
- If token is missing: check `src/shared/utils/api.ts` → `getAuthHeaders()` function

**Step 2.3 — Protected routes**
- Sign out, try to access http://localhost:3000/dashboard directly
- Must redirect to /login — not 401 error, not blank page

---

### PHASE 3 — Chat Endpoint (Core Feature)

**Step 3.1 — Raw API test (bypass frontend)**
```bash
curl -X POST http://localhost:8000/v1/chat/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TEST_TOKEN" \
  -d '{"message": "Purchased 300kg of PET bottles from Vendor A yesterday."}'

# Expected response shape:
# {
#   "session_id": "<uuid>",
#   "reply": "✅ Logged: 300kg PET — purchase recorded.",
#   "intent": "purchase",
#   "structured_data": { "intent": "purchase", "material": "PET", ... },
#   "success": true
# }

# If 422: Pydantic validation mismatch — check ChatRequest schema
# If 500: LangGraph pipeline error — check nodes.py
# If 401: Auth middleware rejecting test token — temporarily disable for local dev
```

**Step 3.2 — Frontend chat sends correctly**
- Open http://localhost:3000/chat
- Type: `Purchased 300kg of PET bottles from Vendor A yesterday.`
- Hit send
- Verify in Network tab:
  - Request URL: `http://localhost:8000/v1/chat/`
  - Request body: `{"message": "...", "session_id": "..."}`
  - Response status: 200
  - Response shape matches Step 3.1 above

**Step 3.3 — Message renders in UI**
- User message appears immediately (optimistic update)
- Typing indicator shows while waiting
- Assistant reply appears with intent badge
- StructuredCard appears if `structured_data` is present in response
- If message never appears: check `useChatStore.addMessage` and `updateLastMessage`

**Step 3.4 — Query intent**
```bash
curl -X POST http://localhost:8000/v1/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": "How much material was dispatched last week?"}'

# Expected: intent = "query", structured_data contains count + total_kg
```
- Run same message in frontend chat, confirm query response renders correctly

**Step 3.5 — Session persistence**
```bash
# Get session history
curl http://localhost:8000/v1/chat/sessions/<SESSION_ID>/history

# Expected: { "session_id": "...", "messages": [...], "count": N }
```
- Refresh the frontend page
- Past session should be loadable from SessionSidebar
- If sessions disappear on refresh: check Redis TTL + `useSessions` hook loading on mount

**Step 3.6 — Session clear**
```bash
curl -X DELETE http://localhost:8000/v1/chat/sessions/<SESSION_ID>
# Expected: {"message": "Session cleared", "session_id": "..."}
```
- Confirm frontend "Clear session" button calls this endpoint

---

### PHASE 4 — Dashboard Endpoint

**Step 4.1 — Stats endpoint**
```bash
curl http://localhost:8000/v1/stats

# Expected shape:
# {
#   "total_entries": N,
#   "by_material": {"PET": 300, "HDPE": 150, ...},
#   "by_stage": {"collection": 200, "processing": 300, ...},
#   "total_dispatched_kg": 450.0
# }
```

**Step 4.2 — Dashboard renders with real data**
- Open http://localhost:3000/dashboard
- KPI cards must show real numbers from the API (not 0 or undefined)
- MaterialPieChart must render with `by_material` data
- BatchBarChart must render
- If charts are empty: check `useDashboardStats` SWR key matches API path exactly
- If KPI cards show NaN: check `DashboardStats` TypeScript type matches API response shape

**Step 4.3 — Sankey data shape**
```bash
curl http://localhost:8000/v1/stats/sankey

# Expected:
# {
#   "nodes": [{"name": "Collection"}, {"name": "Sorting"}, ...],
#   "links": [{"source": 0, "target": 1, "value": 300}, ...]
# }

# If endpoint doesn't exist: add GET /v1/stats/sankey to backend routes
# Frontend MaterialSankey.tsx expects exactly this shape
```

---

### PHASE 5 — Batches Endpoint

**Step 5.1 — List batches**
```bash
curl http://localhost:8000/v1/batches

# Expected: array of BatchEntry objects
# [{ "id": "...", "material": "PET", "quantity_kg": 300, ... }, ...]
```
- Open http://localhost:3000/batches
- Table must render with real data, not empty

**Step 5.2 — Single batch detail**
```bash
curl http://localhost:8000/v1/batches/<BATCH_ID>

# Expected: single BatchEntry with full fields
```
- Click a batch in the table, confirm detail page loads
- Batch timeline must render lifecycle stages

**Step 5.3 — AI insight for batch**
```bash
curl -X POST http://localhost:8000/v1/insights/<BATCH_ID>

# Expected: { "narrative": "Batch B001 received 300kg PET...", "anomalies": [...] }
```
- In BatchDetail page, confirm "Generate Insight" button calls this
- `InsightBanner` must render the narrative text

---

### PHASE 6 — Vendors Endpoint

**Step 6.1**
```bash
curl http://localhost:8000/v1/vendors

# Expected: [{ "id": "...", "name": "Vendor A", "total_kg": 500, ... }]
```
- Open http://localhost:3000/vendors, confirm table renders

---

### PHASE 7 — Type Contract Audit

**Step 7.1 — TypeScript strict check**
```bash
cd aperio
npx tsc --noEmit --strict

# Must output: zero errors
# Every error is a type mismatch between frontend and backend — fix each one
```

**Step 7.2 — Response shape audit**
For each endpoint, compare:

| Endpoint | Backend Pydantic Schema | Frontend TypeScript Type | Match? |
|---|---|---|---|
| POST /v1/chat/ | `ChatResponse` in `api/v1/chat/schemas.py` | `ChatResponse` in `features/chat/types/index.ts` | ✓/✗ |
| GET /v1/stats | `DashboardStatsResponse` in `api/v1/stats/schemas.py` | `DashboardStats` in `shared/types/index.ts` | ✓/✗ |
| GET /v1/batches | `BatchResponse` in `api/v1/batches/schemas.py` | `BatchEntry` in `shared/types/index.ts` | ✓/✗ |
| GET /v1/vendors | `VendorResponse` in `api/v1/vendors/schemas.py` | vendor type in `features/vendors/types/index.ts` | ✓/✗ |

Fix every ✗ by updating the **frontend type** to match the backend schema.
The backend is the source of truth for field names and shapes.

---

### PHASE 8 — Redis & Memory Verification

**Step 8.1 — Session stored in Redis after chat**
```bash
# After sending a chat message:
docker exec -it <redis-container> redis-cli
KEYS chat:session:*
# Must show at least one key

LRANGE chat:session:<SESSION_ID> 0 -1
# Must show JSON messages with role/content/timestamp
```

**Step 8.2 — Context window carries across messages**
- Send 3 messages in one session
- Send a follow-up that refers to the first: `"What was the vendor I mentioned first?"`
- Backend should resolve this correctly using session history
- If it fails: check `ChatMemory.get_history()` is passing history into LangGraph state

**Step 8.3 — Cosine similarity retrieval**
- Send 10+ messages in a session across different topics
- Send a message semantically similar to message #2
- In backend logs, confirm `similar_context` is populated
- Add this log line to `api/v1/chat/routes.py` temporarily if needed:
  ```python
  print(f"Similar context: {similar_context}")
  ```

---

### PHASE 9 — Error Handling

**Step 9.1 — Backend down**
- Stop the FastAPI server
- Send a message in the frontend chat
- Must show error state in UI — not a blank screen or infinite spinner
- Check: `useChat.ts` catch block → `store.setError()`

**Step 9.2 — Invalid message**
```bash
curl -X POST http://localhost:8000/v1/chat/ \
  -H "Content-Type: application/json" \
  -d '{"message": ""}'

# Must return 422 with: {"detail": "..."}
# Frontend must show a user-friendly error, not a raw 422
```

**Step 9.3 — Network timeout**
- In `src/shared/utils/api.ts`, temporarily add `signal: AbortSignal.timeout(1)` 
- Send a message — must show timeout error gracefully
- Remove the timeout after verifying

---

### PHASE 10 — End-to-End Smoke Test

Run this full flow without stopping:

1. Sign in at /login
2. Navigate to /chat
3. Send: `"Purchased 500kg of HDPE from GreenCycle Ltd today"`
   - Verify: intent badge shows `purchase`, StructuredCard shows parsed data
4. Send: `"Processed 200kg of PET at sorting stage, lost 15kg"`
   - Verify: intent badge shows `processing`
5. Send: `"How much total material have we logged?"`
   - Verify: intent badge shows `query`, reply contains a number
6. Navigate to /dashboard
   - Verify: KPI cards updated with the 2 entries just logged
   - Verify: MaterialPieChart shows HDPE and PET
7. Navigate to /batches
   - Verify: both entries appear in the table
8. Click a batch → /batches/[id]
   - Verify: detail page loads, timeline renders
   - Click "Generate Insight" → InsightBanner renders AI narrative
9. Navigate to /vendors
   - Verify: GreenCycle Ltd appears with 500kg attributed
10. Return to /chat, refresh page
    - Verify: session history preserved, past messages visible in SessionSidebar

**All 10 steps must pass without manual intervention or code changes.**

---

## 🔧 Common Fixes Reference

| Symptom | Root Cause | Fix |
|---|---|---|
| CORS error in browser | `cors_origins` missing frontend URL | Add `http://localhost:3000` to `settings.cors_origins` |
| 422 on chat POST | Field name mismatch | Check `message` field in `ChatRequest` Pydantic schema |
| Charts render empty | SWR fetcher returning wrong key | Confirm `/v1/stats` path in `useDashboardStats` matches backend route |
| TypeScript `data is possibly undefined` | Missing null check on SWR data | Add `stats?.by_material ?? {}` optional chaining |
| Session lost on refresh | `useChat` not loading session on mount | Add `useEffect` in `useSessions` to call `getHistory` on mount |
| Auth token not sent | `getAuthHeaders` returns `{}` | Check `auth.currentUser` is not null before `getIdToken()` |
| Sankey chart blank | Data shape mismatch | Confirm `nodes[].name` and `links[].source` are numbers not strings |
| Redis key not found | Session ID mismatch between requests | Confirm `session_id` is passed back from first response and reused |
| `structured_data` always null | Backend not returning it | Check `ChatResponse` schema includes `structured_data` field |
| Typing indicator stuck | `isLoading` never set to false | Check `finally` block in `useChat.sendMessage` calls `setLoading(false)` |