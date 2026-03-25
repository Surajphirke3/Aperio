# RecycleNS — n8n Workflows

4 automation workflows for the TraceFlow recycling intelligence system.

## How to Import

1. Open your n8n instance (local or cloud)
2. Go to **Workflows → Import from File**
3. Select any `.json` file from this folder
4. Set credentials + environment variables (see below)
5. Toggle **Active** to enable

---

## Workflows

| File | Trigger | What it does |
|---|---|---|
| `daily_summary.json` | Every day at 8AM (Mon–Sat) | Emails a full HTML ops summary + WhatsApp alert if loss > 10% |
| `anomaly_alert.json` | Every hour | Detects 4 anomaly types, WhatsApps + emails if score ≥ 20, escalates to manager if CRITICAL |
| `weekly_report.json` | Every Monday at 9AM | Generates AI weekly report with 7-day chart, sends email + WhatsApp |
| `vendor_scorecard.json` | 1st of every month at 9AM | Scores all vendors (volume/quality/timeliness), emails individual scorecards + WhatsApp summary |

---

## Environment Variables

Set these in n8n under **Settings → Environment Variables**:

```
TRACEFLOW_API_URL        http://localhost:8000        Your FastAPI backend URL
REPORT_EMAIL_TO          ops@yourcompany.com          Who gets daily/weekly reports
ALERT_EMAIL_TO           alerts@yourcompany.com       Who gets anomaly alerts
REPORT_EMAIL_FROM        traceflow@yourcompany.com    Sender address
TWILIO_ACCOUNT_SID       ACxxxxxxxxxxxxxxxx           Twilio account SID
TWILIO_WHATSAPP_NUMBER   +14155238886                 Twilio WhatsApp sandbox number
ALERT_WHATSAPP_NUMBER    +91xxxxxxxxxx                Ops team WhatsApp number
MANAGER_WHATSAPP_NUMBER  +91xxxxxxxxxx                Manager WhatsApp (critical escalation)
```

---

## Credentials to Set Up in n8n

### Gmail OAuth2
1. n8n → Credentials → New → Gmail OAuth2
2. Follow Google OAuth setup
3. Name it exactly: `Gmail Account`

### Twilio (for WhatsApp)
The WhatsApp messages use direct HTTP calls to Twilio's API with Basic Auth.
- Username: your Twilio Account SID
- Password: your Twilio Auth Token
- Set up in n8n → Credentials → HTTP Basic Auth

---

## Anomaly Types Detected

| Anomaly | Threshold | Severity |
|---|---|---|
| `LOSS_CRITICAL` | Loss rate > 25% | HIGH |
| `LOSS_HIGH` | Loss rate > 15% | MEDIUM |
| `NO_RECENT_ACTIVITY` | No entries in 48h (after 10+ total) | MEDIUM |
| `DISPATCH_BACKLOG` | Dispatched < 50% of purchased | MEDIUM |
| `TODAY_LOSS_SPIKE` | Today's loss > 30% of today's inflow | HIGH |

Anomaly score ≥ 20 → alert sent. Score ≥ 60 → escalated to manager.

---

## Vendor Scoring Formula

| Component | Max Score | Based On |
|---|---|---|
| Volume | 40 pts | Total kg supplied vs total purchased |
| Quality | 30 pts | `30 - (loss_rate × 1.5)` |
| Timeliness | 30 pts | Avg delivery days (≤1d=30, ≤3d=22, ≤7d=14, >7d=5) |
| **Total** | **100 pts** | |

Grades: A (85+) · B (70+) · C (50+) · D (<50)

---

## Backend Endpoints Used

| Endpoint | Used By |
|---|---|
| `GET /api/stats` | All 4 workflows |
| `POST /api/chat` | daily_summary, weekly_report, vendor_scorecard |
| `GET /api/vendors` | vendor_scorecard (falls back to mock data if not built) |

Add `GET /api/vendors` to your FastAPI backend returning:
```json
{
  "vendors": [
    {
      "name": "Vendor A",
      "email": "vendor-a@example.com",
      "material": "PET",
      "total_kg": 1200,
      "loss_rate": 4.2,
      "avg_delivery_days": 1
    }
  ]
}
```
