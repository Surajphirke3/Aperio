<div align="center">

<img src="frontend/public/icon.svg" alt="Aperio Logo" width="120" height="120" />

# Aperio

### AI-Powered Recycling Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-Expo%2052-61DAFB?logo=react)](https://expo.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis)](https://redis.io/)

*Intelligent traceability for recycled materials — powered by conversational AI.*

[Live Demo](#) · [Report Bug](https://github.com/Surajphirke3/Aperio/issues) · [Request Feature](https://github.com/Surajphirke3/Aperio/issues)

</div>

---

## Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Screenshots](#screenshots)
- [API Documentation](#api-documentation)
- [Configuration & Environment Variables](#configuration--environment-variables)
- [Folder Structure](#folder-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## About the Project

**Aperio** is a full-stack AI-powered recycling management platform that brings conversational intelligence to recycled materials traceability. Instead of manually filling forms, operators talk or type naturally to the system, which automatically extracts batch details, tracks material flows, calculates carbon savings, and surfaces anomalies — all in real time.

**The problem it solves:**  
Traditional recycling operations rely on paper logs and disconnected spreadsheets, making it hard to prove material provenance, detect loss, or generate environmental impact reports. Aperio replaces that with a chat-first interface backed by LangGraph AI pipelines, giving every stakeholder — from floor operators to sustainability managers — instant, accurate data.

---

## Features

- 🤖 **AI Chat Interface** — Natural-language data entry powered by Qwen 2.5 (Featherless AI) and a multi-step LangGraph pipeline
- 🎙️ **Voice Transcription** — Speak batch details; Groq Whisper-Large-v3 converts audio to structured data
- 📦 **Batch Tracking** — Full custody chain and timeline for every recycled-material batch
- 📊 **Analytics Dashboard** — KPIs, Sankey flow diagrams, weekly trends, and material/stage distributions
- 🌱 **Carbon Footprint Calculator** — Automated emissions accounting per batch and over time
- 🏭 **Vendor Management** — Performance metrics for every supplier and logistics partner
- 🚨 **Anomaly Detection** — Automatic flagging of loss events that exceed configurable thresholds (warning / critical)
- 💡 **AI Insights** — Narrative summaries of dashboard data generated on demand
- 🔐 **Firebase Authentication** — Secure JWT-based auth for all API endpoints; Clerk for the web frontend
- 📱 **Cross-Platform** — Web dashboard (Next.js) + Android/iOS mobile app (Expo)
- 🐳 **Docker-Ready** — One-command startup for the entire backend stack

---

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| HTTP Framework | FastAPI 0.115+ |
| ASGI Server | Uvicorn 0.30+ |
| AI Orchestration | LangGraph 0.2+ / LangChain Core |
| LLM (primary) | Qwen/Qwen2.5-3B-Instruct (Featherless AI) |
| LLM (fallback) | Qwen/Qwen2.5-Coder-3B-Instruct |
| Voice ASR | Whisper-Large-v3 (Groq) |
| NLP Classification | Llama3-8B-8192 (Groq) |
| Semantic Search | Sentence-Transformers (all-MiniLM-L6-v2) |
| Database | MongoDB 7 |
| Cache / Sessions | Redis 7 |
| Authentication | Firebase Admin SDK 6.5+ |
| Validation | Pydantic v2 |
| Containerisation | Docker + Docker Compose |

### Frontend (Web)
| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| UI Library | React 19 |
| Styling | Tailwind CSS 4.2 |
| Component Library | Radix UI |
| Charts | Recharts 2.15 + D3 7.9 |
| Animations | Framer Motion 11 |
| Auth (web) | Clerk Next.js 7 |
| Forms | React Hook Form + Zod |

### Mobile
| Layer | Technology |
|---|---|
| Framework | Expo 52 / React Native 0.76 |
| Routing | Expo Router 4 |
| Styling | NativeWind 4 (Tailwind for RN) |
| HTTP | Axios 1.7 |

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** ≥ 24 & **Docker Compose** ≥ 2 (recommended for the backend stack)
- **Python** ≥ 3.11 (if running the backend without Docker)
- **Poetry** (Python dependency management) — `pip install poetry`
- **Node.js** ≥ 20 & **npm** ≥ 10 (frontend & mobile)
- **Expo CLI** — `npm install -g expo-cli` (mobile only)

External service accounts required:

| Service | Purpose | Sign-up URL |
|---|---|---|
| [Featherless AI](https://featherless.ai) | Primary LLM inference | https://featherless.ai |
| [Groq](https://console.groq.com) | Voice ASR + NLP | https://console.groq.com |
| [Firebase](https://console.firebase.google.com) | Authentication | https://firebase.google.com |
| [Clerk](https://clerk.com) | Web frontend auth | https://clerk.com |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Database (optional, can use Docker) | https://www.mongodb.com/atlas |

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Surajphirke3/Aperio.git
cd Aperio
```

### 2. Configure environment variables

```bash
cd backend/aperio-api
cp .env.example .env
```

Open `.env` and fill in your API keys (see [Configuration](#configuration--environment-variables) for full reference).

You also need a Firebase service-account JSON file:

1. Go to **Firebase Console → Project Settings → Service Accounts**
2. Click **Generate new private key** and download the JSON
3. Save it as `backend/aperio-api/firebase-credentials.json`

### 3a. Start the backend with Docker (recommended)

```bash
cd backend/aperio-api
docker compose up --build
```

This starts:
- **FastAPI** on `http://localhost:8000`
- **MongoDB** on `mongodb://localhost:27017`
- **Redis** on `redis://localhost:6379`

Check the API is running:

```bash
curl http://localhost:8000/health
```

### 3b. Start the backend manually (without Docker)

```bash
cd backend/aperio-api
poetry install
poetry run uvicorn src.api.app:app --reload --port 8000
```

> MongoDB and Redis must be running locally (or configured via `MONGODB_URL` / `REDIS_URL`).

### 4. Start the frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # if an example exists; otherwise create it
```

Add the following to `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Start the mobile app (optional)

```bash
cd android
npm install
npm start          # Expo dev server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
```

---

## Usage Guide

### Logging a recycling batch via chat

Once the app is running, navigate to the **Chat** tab in the dashboard or mobile app and start a conversation:

```
You:     "I just processed 500kg of PET plastic from vendor GreenCycle, 
          collection stage, batch reference GC-2024-001"

Aperio:  "Got it! I've logged batch GC-2024-001:
          • Material: PET Plastic  
          • Weight: 500 kg  
          • Vendor: GreenCycle  
          • Stage: Collection  
          • Carbon saved: ~1.25 tCO₂e
          Would you like to add a quality note?"
```

The AI extracts entities, validates them against known vendors, stores the batch entry, and responds with a confirmation — all in a single turn.

### Recording a batch via voice

Click the **microphone icon** in the chat interface and speak your batch details. The audio is transcribed by Groq Whisper and processed exactly like a text message.

### Viewing analytics

Navigate to **Dashboard → Analytics** to see:
- KPI cards (total entries, weight by material, carbon saved)
- Sankey diagram of material flows
- Weekly trend chart
- Material and stage distribution breakdowns

### Generating an AI insight report

```bash
curl -X POST http://localhost:8000/v1/insights/ \
  -H "Authorization: Bearer <firebase_token>" \
  -H "Content-Type: application/json" \
  -d '{"days": 30}'
```

---

## Screenshots

> *Screenshots will be added as the UI stabilises. Below are placeholder descriptions of each view.*

| View | Description |
|---|---|
| **Landing Page** | Hero section with feature highlights and call-to-action |
| **Dashboard** | KPI cards, Sankey flow chart, weekly trend graph |
| **Chat Interface** | Conversational data entry with AI responses |
| **Carbon Report** | Emissions timeline and material breakdown |
| **Vendor Analytics** | Performance scores per supplier |
| **Batch Detail** | Full custody chain and timeline for a single batch |
| **Mobile App** | Tab-based navigation mirroring the web dashboard |

---

## API Documentation

Interactive Swagger UI is available at `http://localhost:8000/docs` when the backend is running.

### Base URL

```
http://localhost:8000/v1
```

> All endpoints (except `/health`) require a Firebase JWT token passed as `Authorization: Bearer <token>`.

### Chat

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/chat` | Send a message; returns AI reply and extracted data |
| `GET` | `/chat/sessions/{session_id}/history` | Retrieve conversation history |

**Example request — POST /v1/chat**

```bash
curl -X POST http://localhost:8000/v1/chat \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "user-abc-123",
    "message": "500kg HDPE from EcoCycle, sorting stage"
  }'
```

### Batches

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/batches` | List all batches |
| `GET` | `/batches/{batch_id}` | Batch detail with timeline and anomalies |

### Statistics & Analytics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/stats` | KPIs — query param: `days` (7–90, default 30) |
| `GET` | `/stats/sankey` | Sankey flow data |
| `GET` | `/stats/weekly` | Weekly trend chart |
| `GET` | `/stats/materials` | Material distribution |
| `GET` | `/stats/stages` | Stage distribution |
| `GET` | `/stats/completeness` | Data completeness score |

### Vendors

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/vendors` | List vendors with performance metrics |

### AI Insights

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/insights` | Generate dashboard narrative — body: `{"days": int}` |
| `POST` | `/insights/batch/{batch_id}` | Batch-specific insight |

### Carbon Tracking

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/carbon` | Emissions data — query param: `days` (default 30) |

### Voice Transcription

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/voice/transcribe` | Upload audio file (multipart/form-data); returns transcript |

Supported formats: `webm`, `wav`, `mp4`, `mpeg` (max 25 MB). Powered by Groq Whisper-Large-v3.

### Anomaly Detection

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/anomalies` | Loss anomalies — query param: `days` (default 30) |

Returns anomalies with severity: `warning` or `critical`.

---

## Configuration & Environment Variables

### Backend (`backend/aperio-api/.env`)

| Variable | Default | Description |
|---|---|---|
| `FEATHERLESS_API_KEY` | — | Featherless AI API key (required) |
| `PRIMARY_MODEL` | `Qwen/Qwen2.5-3B-Instruct` | Primary LLM |
| `FALLBACK_MODEL` | `Qwen/Qwen2.5-Coder-3B-Instruct` | Fallback LLM |
| `MODEL_TEMPERATURE` | `0.1` | LLM temperature (0–1) |
| `MODEL_MAX_TOKENS` | `512` | Max tokens per LLM response |
| `GROQ_API_KEY` | — | Groq API key (required) |
| `GROQ_WHISPER_MODEL` | `whisper-large-v3` | Voice ASR model |
| `GROQ_NLP_MODEL` | `llama3-8b-8192` | NLP classification model |
| `MONGODB_URL` | `mongodb://localhost:27017` | MongoDB connection string |
| `MONGODB_DB_NAME` | `traceflow` | Database name |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |
| `CHAT_SESSION_TTL` | `86400` | Chat session TTL in seconds (24 h) |
| `CONTEXT_WINDOW_MESSAGES` | `20` | Messages kept in context window |
| `EMBEDDING_MODEL` | `sentence-transformers/all-MiniLM-L6-v2` | Semantic search model |
| `SIMILARITY_TOP_K` | `3` | Top-K similar contexts retrieved |
| `FIREBASE_CREDENTIALS_PATH` | `firebase-credentials.json` | Path to Firebase service-account JSON |
| `ENVIRONMENT` | `development` | `development` or `production` |
| `CORS_ORIGINS` | `["http://localhost:3000"]` | Allowed CORS origins (JSON list) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |

---

## Folder Structure

```
Aperio/
├── backend/
│   └── aperio-api/               # FastAPI backend
│       ├── src/
│       │   ├── api/
│       │   │   └── v1/           # HTTP routers (chat, batches, stats, …)
│       │   ├── domain/           # Business logic (chat graph, carbon calc, …)
│       │   ├── infrastructure/   # DB (MongoDB), cache (Redis), AI adapters
│       │   ├── config/           # Settings & logging
│       │   └── shared/           # Constants & utilities
│       ├── tests/                # Pytest test suite
│       ├── finetune/             # LoRA fine-tuning scripts
│       ├── .env.example          # Environment variable template
│       ├── docker-compose.yml    # Service orchestration
│       ├── Dockerfile            # Container image
│       ├── pyproject.toml        # Poetry project file
│       └── requirements.txt      # pip dependencies
│
├── frontend/                     # Next.js 16 web dashboard
│   ├── app/
│   │   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── sign-in/              # Authentication pages
│   │   └── sign-up/
│   ├── components/               # React components (batches, chat, carbon, …)
│   ├── lib/                      # API client, auth context, utilities
│   ├── public/                   # Static assets & icons
│   └── package.json
│
├── android/                      # Expo (React Native) mobile app
│   ├── app/
│   │   ├── (tabs)/               # Tab navigation screens
│   │   └── login.tsx
│   ├── lib/                      # API client & auth context
│   ├── assets/                   # App icons & splash screens
│   └── package.json
│
└── README.md
```

---

## Roadmap

- [x] Conversational AI chat for batch data entry
- [x] Voice-to-text batch logging (Groq Whisper)
- [x] Carbon footprint calculations per batch
- [x] Analytics dashboard (KPIs, Sankey, trends)
- [x] Anomaly / loss detection
- [x] Docker Compose deployment
- [ ] Full frontend ↔ backend integration (in progress)
- [ ] Role-based access control (admin / operator / viewer)
- [ ] QR code scanning for physical batch tagging
- [ ] Automated PDF reports for sustainability audits
- [ ] Webhook / third-party ERP integration
- [ ] Multi-tenant support for multiple recycling facilities
- [ ] Fine-tuned domain-specific LLM (LoRA training pipeline included)

---

## Contributing

Contributions are welcome and appreciated! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines, code style, and the pull-request process.

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for full details.

---

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/) — modern Python web framework
- [LangGraph](https://langchain-ai.github.io/langgraph/) — stateful AI workflow orchestration
- [Featherless AI](https://featherless.ai/) — serverless LLM inference
- [Groq](https://groq.com/) — ultra-fast voice transcription and NLP
- [Next.js](https://nextjs.org/) — React framework for the web dashboard
- [Expo](https://expo.dev/) — cross-platform React Native development
- [Radix UI](https://www.radix-ui.com/) — accessible UI component primitives
- [Recharts](https://recharts.org/) — composable chart library for React
- [MongoDB](https://www.mongodb.com/) — flexible document database
- [Redis](https://redis.io/) — in-memory cache for chat sessions
