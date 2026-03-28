# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-28

### Added

- **AI Chat Assistant** with LangGraph pipeline, Groq LLM inference, and semantic similarity search
- **Batch Traceability** module with full lifecycle tracking (purchase, processing, dispatch)
- **Carbon Footprint Dashboard** with real-time CO2 tracking and impact narratives
- **Vendor Management** system with supplier scorecards and delivery tracking
- **Anomaly Detection** engine with AI-driven alerts for processing losses and compliance gaps
- **Voice Input** support via Groq Whisper transcription
- **Role-Based Access Control** with customer, regulator, and partner roles
- **Dual Storage Architecture** using Redis caching + MongoDB persistence for chat sessions
- **Next.js 16 Web Dashboard** with shadcn/ui components, Recharts visualizations, and Clerk authentication
- **React Native Mobile App** (Expo SDK 52) with NativeWind styling and tab-based navigation
- **FastAPI Backend** with async MongoDB (Motor), Redis, and comprehensive REST API
- **Interactive API Documentation** via Swagger UI at `/docs`
- **Health Check Endpoint** at `/health`
- RESTful API endpoints for chat, stats, batches, vendors, carbon, insights, voice, and anomalies
- Environment-based configuration with `.env` files
- Comprehensive project documentation (README, CONTRIBUTING, CODE_OF_CONDUCT)
- GitHub issue templates and PR template

### Infrastructure

- MongoDB for persistent data storage
- Redis for session caching with configurable TTL
- Groq Cloud for LLM inference (Llama 3.3 70B) and Whisper voice transcription
- Sentence Transformers for semantic similarity (all-MiniLM-L6-v2)
- Clerk for web authentication
- Expo Router for mobile file-based navigation

[1.0.0]: https://github.com/Surajphirke3/DIMENSITY_LABS_hn4/releases/tag/v1.0.0
