<div align="center">

# Aperio — Transparent Lifecycle Intelligence

**The unified platform for battery traceability, carbon footprint tracking, and ESG compliance.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](CHANGELOG.md)
[![Python](https://img.shields.io/badge/python-3.11+-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg?logo=next.js)](https://nextjs.org)
[![Expo](https://img.shields.io/badge/Expo_SDK-52-000020.svg?logo=expo)](https://expo.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Docs](#-api-documentation) · [Contributing](#-contributing) · [License](#-license)

</div>

---

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Mobile App Setup](#mobile-app-setup)
- [Usage](#-usage)
- [Screenshots](#-screenshots)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Folder Structure](#-folder-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 📖 Overview

**Aperio** (TraceFlow) is an intelligent recycled materials traceability system built for manufacturers, recyclers, regulators, and supply chain partners. It provides end-to-end visibility into battery lifecycles, carbon emissions, vendor performance, and ESG compliance — all powered by AI.

### What problem does it solve?

The recycled materials supply chain suffers from fragmented tracking, opaque carbon accounting, and inconsistent regulatory reporting. Aperio provides:

- **Digital Passports** — tamper-proof lifecycle records for every batch of recycled material
- **Carbon Footprint Intelligence** — real-time CO₂ tracking across manufacturing, transport, and recycling
- **AI-Powered Chat** — natural language queries over supply chain data using LLM-powered pipelines
- **Anomaly Detection** — automated alerts for processing losses, vendor irregularities, and compliance gaps

---

## ✨ Features

- **AI Chat Assistant** — conversational interface backed by LangGraph state machines, Groq LLMs, and semantic similarity search
- **Batch Traceability** — full lifecycle tracking from purchase → processing → dispatch with loss reporting
- **Carbon Dashboard** — real-time carbon footprint visualization with impact narratives
- **Vendor Management** — supplier scorecards, delivery tracking, and risk assessment
- **Anomaly Alerts** — AI-driven detection of processing anomalies and compliance violations
- **Voice Input** — Groq Whisper-powered voice transcription for hands-free data entry
- **Role-Based Access** — customer, regulator, and partner roles with scoped data views
- **Dual Storage** — Redis caching + MongoDB persistence for chat sessions
- **Mobile App** — full-featured React Native app with NativeWind styling
- **Responsive Web Dashboard** — Next.js 16 + shadcn/ui with interactive charts

---

## 🛠 Tech Stack

### Frontend (Web)
| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org) | React framework with App Router |
| [React 19](https://react.dev) | UI library |
| [TypeScript](https://typescriptlang.org) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com) (Radix) | Component library |
| [Recharts](https://recharts.org) | Data visualization |
| [Clerk](https://clerk.com) | Authentication |
| [Framer Motion](https://motion.dev) | Animations |
| [Lucide React](https://lucide.dev) | Icon system |

### Backend
| Technology | Purpose |
|---|---|
| [FastAPI](https://fastapi.tiangolo.com) | Async Python web framework |
| [MongoDB](https://mongodb.com) (Motor) | Document database |
| [Redis](https://redis.io) | Session caching |
| [LangGraph](https://github.com/langchain-ai/langgraph) | AI pipeline orchestration |
| [Groq](https://groq.com) | LLM inference (Llama 3.3 70B) |
| [Sentence Transformers](https://sbert.net) | Semantic similarity |
| [Pydantic v2](https://docs.pydantic.dev) | Data validation |

### Mobile
| Technology | Purpose |
|---|---|
| [Expo SDK 52](https://expo.dev) | React Native framework |
| [React Native](https://reactnative.dev) | Cross-platform mobile |
| [NativeWind](https://nativewind.dev) | Tailwind CSS for RN |
| [Expo Router](https://docs.expo.dev/router) | File-based routing |
| [Lucide React Native](https://lucide.dev) | Icon system |

---

## 🏗 Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js Web   │     │  React Native   │     │   Groq Cloud    │
│   Dashboard     │     │   Mobile App    │     │   LLM + Whisper │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────┬───────────┘                       │
                     │ HTTP/REST                         │
              ┌──────▼──────┐                            │
              │   FastAPI   │◄───────────────────────────┘
              │   Backend   │
              └──┬──────┬───┘
                 │      │
          ┌──────▼┐  ┌──▼──────┐
          │ Redis │  │ MongoDB │
          │ Cache │  │  Store  │
          └───────┘  └─────────┘
```

---

## 📋 Prerequisites

- **Node.js** ≥ 18.x
- **Python** ≥ 3.11
- **MongoDB** ≥ 7.0 (local or Atlas)
- **Redis** ≥ 7.0 (local or cloud)
- **Git**
- **Expo Go** app (SDK 52) on your Android device _(for mobile)_

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Surajphirke3/DIMENSITY_LABS_hn4.git
cd DIMENSITY_LABS_hn4
```

### Backend Setup

```bash
# Navigate to backend
cd backend/aperio-api

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (macOS/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your API keys (see Environment Variables section)

# Start the server
python -m uvicorn src.api.app:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`. Health check: `http://localhost:8000/health`.

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_BACKEND_URL=http://localhost:8000" > .env.local

# Start the dev server
npm run dev
```

The web dashboard will be available at `http://localhost:3000`.

### Mobile App Setup

```bash
# Navigate to mobile
cd android

# Install dependencies
npm install

# Start Metro bundler
npx expo start --lan
```

Scan the QR code with **Expo Go** (SDK 52) on your Android device.

> **Note:** Ensure your phone and computer are on the same WiFi network. Update `LOCAL_IP` in `android/lib/api.ts` to your computer's IP address.

---

## 💡 Usage

### Web Dashboard

1. **Sign in** at `http://localhost:3000` using Clerk authentication
2. **Dashboard** — view KPIs, active batches, anomalies, and AI insights
3. **Batches** — create, track, and manage material batches through their lifecycle
4. **Chat** — ask the AI assistant questions like:
   - _"How much PET was processed this week?"_
   - _"Show me vendor performance for GreenCycle"_
   - _"Purchased 200kg PET from Vendor A"_
5. **Carbon** — monitor carbon footprint across your supply chain
6. **Vendors** — manage supplier relationships and performance

### API Example

```python
import httpx

# Send a chat message
response = httpx.post(
    "http://localhost:8000/v1/chat/",
    json={"message": "How much PET was processed today?", "session_id": "my_session"},
    headers={"Authorization": "Bearer your_token"}
)
print(response.json())
# {"session_id": "my_session", "reply": "Found 5 entries totalling 1200kg...", "intent": "query", "success": true}
```

```bash
# cURL health check
curl http://localhost:8000/health
# {"status": "ok", "model": "llama-3.3-70b-versatile", "groq": "enabled"}
```

---

## 📸 Screenshots

> _Screenshots will be added here. To contribute screenshots, see [CONTRIBUTING.md](CONTRIBUTING.md)._

| Web Dashboard | Mobile App | AI Chat |
|:---:|:---:|:---:|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Mobile](docs/screenshots/mobile.png) | ![Chat](docs/screenshots/chat.png) |

---

## 📡 API Documentation

The backend exposes a RESTful API at `/v1`. Interactive docs are available at `http://localhost:8000/docs` (Swagger UI).

### Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Health check |
| `/v1/chat/` | POST | Send a chat message |
| `/v1/chat/sessions` | GET | List user chat sessions |
| `/v1/chat/sessions/{id}/history` | GET | Get session message history |
| `/v1/chat/sessions/{id}` | DELETE | Clear a chat session |
| `/v1/stats/` | GET | Get dashboard statistics |
| `/v1/batches/` | GET/POST | List or create batches |
| `/v1/batches/{id}` | GET | Get batch details |
| `/v1/vendors/` | GET/POST | List or create vendors |
| `/v1/carbon/` | GET | Get carbon footprint data |
| `/v1/insights/` | GET | Get AI-powered insights |
| `/v1/voice/` | POST | Voice transcription |
| `/v1/anomalies/` | GET | Get detected anomalies |

### Chat Request/Response

```json
// POST /v1/chat/
// Request
{
  "message": "Purchased 200kg PET from Vendor A",
  "session_id": "optional_session_id"
}

// Response
{
  "session_id": "generated_or_provided_id",
  "reply": "✅ Logged: 200kg PET — purchase recorded.",
  "intent": "purchase",
  "structured_data": null,
  "success": true
}
```

---

## ⚙️ Environment Variables

### Backend (`backend/aperio-api/.env`)

| Variable | Description | Default |
|---|---|---|
| `GROQ_API_KEY` | Groq API key for LLM inference | _(required)_ |
| `PRIMARY_MODEL` | Primary LLM model | `llama-3.3-70b-versatile` |
| `FALLBACK_MODEL` | Fallback LLM model | `llama3-8b-8192` |
| `MODEL_TEMPERATURE` | LLM temperature | `0.1` |
| `MODEL_MAX_TOKENS` | Max response tokens | `512` |
| `GROQ_WHISPER_MODEL` | Whisper model for voice | `whisper-large-v3` |
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGODB_DB_NAME` | Database name | `traceflow` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `CHAT_SESSION_TTL` | Session TTL in seconds | `86400` |
| `CONTEXT_WINDOW_MESSAGES` | Chat context window | `20` |
| `EMBEDDING_MODEL` | Sentence embedding model | `sentence-transformers/all-MiniLM-L6-v2` |
| `SIMILARITY_TOP_K` | Top-K similar results | `3` |
| `CLERK_SECRET_KEY` | Clerk auth secret key | _(required)_ |
| `ENVIRONMENT` | `development` or `production` | `development` |
| `CORS_ORIGINS` | Allowed CORS origins (JSON array) | `["http://localhost:3000"]` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | `http://localhost:8000` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | _(required)_ |
| `CLERK_SECRET_KEY` | Clerk secret key | _(required)_ |

---

## 📁 Folder Structure

```
DIMENSITY_LABS_hn4/
├── backend/
│   └── aperio-api/
│       ├── src/
│       │   ├── api/              # FastAPI routes & middleware
│       │   │   ├── v1/
│       │   │   │   ├── chat/     # AI chat endpoints
│       │   │   │   ├── stats/    # Dashboard statistics
│       │   │   │   ├── batches/  # Batch management
│       │   │   │   ├── vendors/  # Vendor management
│       │   │   │   ├── carbon/   # Carbon tracking
│       │   │   │   ├── insights/ # AI insights
│       │   │   │   ├── voice/    # Voice transcription
│       │   │   │   └── anomalies/# Anomaly detection
│       │   │   └── dependencies.py
│       │   ├── config/           # Settings & logging
│       │   ├── domain/           # Business logic
│       │   │   └── chat/         # Chat graph, nodes, memory, similarity
│       │   ├── infrastructure/   # External services
│       │   │   ├── ai/           # LLM adapters & prompts
│       │   │   ├── cache/        # Redis client
│       │   │   └── db/           # MongoDB client & repositories
│       │   └── shared/           # Utilities (JSON parser, dates)
│       ├── requirements.txt
│       └── .env.example
├── frontend/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (dashboard)/          # Dashboard routes
│   │   │   ├── batches/
│   │   │   ├── carbon/
│   │   │   ├── chat/
│   │   │   ├── dashboard/
│   │   │   └── vendors/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── components/               # React components
│   │   ├── chat/                 # Chat panel UI
│   │   ├── carbon/               # Carbon visualizations
│   │   └── ui/                   # shadcn/ui components
│   ├── lib/                      # API client & utilities
│   └── package.json
├── android/
│   ├── app/                      # Expo Router screens
│   │   ├── (tabs)/               # Tab navigation
│   │   │   ├── index.tsx         # Dashboard
│   │   │   ├── chat.tsx          # AI Chat
│   │   │   ├── batches/          # Batch management
│   │   │   ├── carbon.tsx        # Carbon tracking
│   │   │   └── vendors.tsx       # Vendor management
│   │   ├── index.tsx             # Landing screen
│   │   └── login.tsx             # Authentication
│   ├── lib/                      # API client & auth context
│   └── package.json
├── docs/                         # Documentation assets
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
└── CHANGELOG.md
```

---

## 🗺 Roadmap

- [x] AI chat with LangGraph pipeline
- [x] Batch lifecycle tracking
- [x] Carbon footprint dashboard
- [x] Vendor management
- [x] Anomaly detection
- [x] Voice input (Whisper)
- [x] Mobile app (Expo/React Native)
- [x] Role-based access control
- [ ] Blockchain-backed digital passports
- [ ] PDF/CSV report export
- [ ] Push notifications for anomalies
- [ ] Multi-language support (i18n)
- [ ] Real-time WebSocket updates
- [ ] IoT sensor integration
- [ ] Regulatory compliance report builder

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- **[Groq](https://groq.com)** — ultra-fast LLM inference
- **[LangGraph](https://github.com/langchain-ai/langgraph)** — AI pipeline orchestration
- **[shadcn/ui](https://ui.shadcn.com)** — beautiful, accessible components
- **[Expo](https://expo.dev)** — React Native development platform
- **[FastAPI](https://fastapi.tiangolo.com)** — modern Python web framework
- **[HackNiche 4.0](https://hackniche.com)** — hackathon that inspired this project
- **Dimensity Labs** — the team behind Aperio

---

<div align="center">

**Built with ❤️ by [Dimensity Labs](https://github.com/Surajphirke3/DIMENSITY_LABS_hn4)**

</div>