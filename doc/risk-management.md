# ⚠️ risk-management.md — Every Risk + How to Survive It

---

## 🔴 Risk 1: Featherless.ai API is Slow or Down

**Probability:** Medium  
**Impact:** Critical — demo looks broken if AI takes 30 seconds

**Prevention:**
```python
# app/ai/client.py — Add timeout + retry
featherless_client = instructor.from_openai(
    OpenAI(
        base_url="https://api.featherless.ai/v1",
        api_key=settings.FEATHERLESS_API_KEY,
        timeout=8.0,  # 8 second timeout — show loading state
        max_retries=2
    )
)
```

**Mitigation:**
- Use Groq as fallback (same OpenAI-compatible API, ultra fast)
- Pre-compute 5 demo responses and cache them in Redis/Supabase
- Add "Demo Mode" toggle that replays cached responses instantly

**Demo Recovery Script:**
> *"While the AI processes — notice the real-time dashboard that updated from our last entry. The beauty of this system is that data entry and visualization are completely decoupled."*

---

## 🔴 Risk 2: Supabase Connection Fails

**Probability:** Low  
**Impact:** High — no data = no demo

**Prevention:**
- Test Supabase connection first thing each morning
- Use connection pooling with retry logic
- Pre-download all demo data as JSON fallback

**Mitigation:**
```python
# In your FastAPI startup, validate Supabase connection
@app.on_event("startup")
async def startup():
    try:
        await db.execute("SELECT 1")
        print("✅ Supabase connected")
    except Exception as e:
        print(f"⚠️ Supabase failed, loading local fallback data")
        # Load from local JSON file
        app.state.fallback_mode = True
```

---

## 🟡 Risk 3: Sankey Diagram Won't Render

**Probability:** Medium (D3 + React = finicky)  
**Impact:** Medium — loses WOW factor but not catastrophic

**Prevention:**
- Build Sankey with hardcoded mock data first, connect live data last
- Test on the exact browser you'll use for demo (Chrome recommended)
- Have a Recharts-based flow chart as instant fallback

**Code Protection:**
```tsx
// SankeyDiagram.tsx — always have error boundary
export default function SankeyDiagram({ data }) {
  if (!data || data.nodes.length === 0) {
    return <FallbackFlowChart data={data} />  // Recharts version
  }
  return <D3SankeyChart data={data} />
}
```

---

## 🟡 Risk 4: Hackathon WiFi Is Terrible

**Probability:** High (standard hackathon problem)  
**Impact:** High if dependent on external APIs

**Prevention:**
- Bring a personal hotspot (all 4 team members should have one ready)
- Pre-download Phi-4 Mini via Ollama as offline fallback
- Cache all Supabase data locally using TanStack Query (stale-while-revalidate)

**Offline Mode Setup:**
```bash
# Do this the night before — takes 10 minutes
ollama pull phi4-mini
# Test it: ollama run phi4-mini "Extract: received 300kg PET from Raju"
```

---

## 🟡 Risk 5: Feature Is Half-Broken During Demo

**Probability:** Medium  
**Impact:** High — judges clicking broken pages is devastating

**Prevention:**
```typescript
// Add this to any unfinished page
export default function VendorPage() {
  return (
    <ComingSoonPage 
      feature="Vendor Intelligence"
      description="Advanced vendor scoring launching in V2"
    />
  )
}
// This looks intentional, not broken
```

**Rule:** If it's not working at 90%+ reliability at hour 11 — HIDE IT.

---

## 🟡 Risk 6: Team Member Gets Stuck and Blocks Others

**Probability:** Medium  
**Impact:** High if critical path item

**Prevention:**
- Every task has a "stub/mock" fallback
- If Divya's analytics endpoint isn't ready, James uses hardcoded JSON
- If your NLP pipeline isn't ready, return mock extracted data
- Communicate blockers immediately — don't sit silent for 2 hours

```python
# Stub endpoint example — unblocks frontend immediately
@router.get("/analytics/lifecycle")
async def get_lifecycle_data():
    # TODO: Replace with real data when DB is ready
    return {
        "nodes": [
            {"id": "collection", "name": "Collection", "value": 5000},
            {"id": "sorting", "name": "Sorting", "value": 4750},
            # ... mock data
        ],
        "links": [...]
    }
```

---

## 🟢 Risk 7: Kaggle Dataset Download Fails

**Probability:** Low  
**Impact:** Medium — you'll have to use dummy data

**Prevention:**
- Download the dataset BEFORE the hackathon starts
- Store it in the `/dataset/raw/` folder in your repo
- Write the seed script before the hackathon

---

## 🟢 Risk 8: Clerk Auth Is Misconfigured

**Probability:** Low  
**Impact:** Medium — judges can't log in to see the demo

**Prevention:**
- Set up Clerk in first 30 minutes, test login before touching anything else
- Create a shared demo account: `demo@recyclens.com` / `Hackathon2026!`
- Have the credentials on a sticky note for demo day

---

## 📊 Risk Matrix

| Risk | Probability | Impact | Preparation Effort | When to Prepare |
|------|------------|--------|-------------------|-----------------|
| AI API slow | Medium | Critical | 2 hours | Hour 0-2 |
| Supabase down | Low | High | 1 hour | Hour 0-1 |
| Sankey broken | Medium | Medium | 30 min | Hour 5-6 |
| WiFi failure | High | High | 1 hour | Night before |
| Half-built feature | Medium | High | Ongoing | All hours |
| Team blockage | Medium | High | 15 min | Set up mocks at Hour 0 |
| Dataset issue | Low | Medium | 30 min | Before hackathon |
| Auth broken | Low | Medium | 30 min | Hour 0-1 |

---

## ✅ The Golden Rules

1. **Demo Mode First** — Build the happy path demo first. Add real functionality second.
2. **Mock Everything Early** — Unblock parallel work with fake data from minute 1.
3. **Hide Don't Break** — Unfinished feature → hide behind "Coming Soon". Never show broken.
4. **Pre-cache Critical Data** — The Sankey, KPI cards, vendor scores must work even if API dies.
5. **Two Devices** — Always have the app open on a backup device.
6. **Practice the Script** — Stumbling during demo loses more points than missing features.
