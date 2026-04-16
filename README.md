# 🔍 OCRacle — The Ghost Label Detector

> **AI-powered truth scoring for sustainable consumer choices. Exposing greenwashing, one scan at a time.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org)

---

## 🌿 What is OCRacle?

OCRacle gives consumers an instant, unbiased **Truth Score (0–10)** for any consumer product by cross-referencing three public environmental databases:

- **Open Food Facts** — 1.5M product ingredient database
- **EPD Online** — Environmental Product Declarations
- **Carbon Trust** — Carbon footprint data

> Brands **cannot pay** for higher scores. Ever.

---

## 📁 Repository Structure

```
ocracle/
├── docs/
│   ├── PRD.md           ← Full Product Requirements Document
│   ├── FRONTEND.md      ← Frontend architecture & spec
│   └── BACKEND.md       ← Backend architecture & spec
├── frontend/            ← Next.js 14 web app (Vercel)
│   ├── app/             ← App Router pages
│   ├── src/
│   │   ├── components/
│   │   ├── types/
│   │   └── styles/
│   ├── vercel.json
│   └── package.json
├── backend/             ← Node.js + Express API (Railway)
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── utils/
│   ├── migrations/
│   ├── Dockerfile
│   ├── railway.json
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- Firebase project
- Anthropic API key
- Stripe account

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_ORG/ocracle.git
cd ocracle

# Install frontend deps
cd frontend && npm install && cd ..

# Install backend deps
cd backend && npm install && cd ..
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your keys

# Frontend
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your keys
```

### 3. Set Up Database

```bash
# Create PostgreSQL database
createdb ocracle

# Run migrations
psql $DATABASE_URL -f backend/migrations/schema.sql
```

### 4. Run Locally

```bash
# Terminal 1 — Backend (port 3001)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────┐
│              Next.js Frontend (Vercel — bom1)             │
│     Landing Page · Scanner · Dashboard · Expert List      │
└─────────────────────────┬────────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼────────────────────────────────┐
│           Node.js + Express API (Railway)                 │
│    Auth · Rate Limiting · Truth Score Engine · Payments   │
└──────┬──────────┬───────────────┬────────────────────────┘
       │          │               │
  ┌────▼───┐ ┌───▼────┐   ┌─────▼──────┐
  │ Redis  │ │  PgSQL │   │  Claude AI  │
  │ Cache  │ │   DB   │   │  (Scoring)  │
  └────────┘ └────────┘   └────────────┘
       │
  ┌────▼──────────────────────┐
  │     External APIs          │
  │  Open Food Facts · EPD    │
  │  Carbon Trust · Stripe    │
  └───────────────────────────┘
```

### Truth Score Formula
```
Truth Score = Carbon × 0.40 + Water × 0.35 + Toxicity × 0.25
```

### Score Bands
| Score | Label | Meaning |
|-------|-------|---------|
| 0–3.9 | 🔴 Ghost Label | Confirmed greenwashing |
| 4–6.9 | 🟡 Partial Truth | Mixed environmental claims |
| 7–8.9 | 🟢 Genuinely Sustainable | Strong eco credentials |
| 9–10  | 💚 Verified Clean | Exceptional sustainability |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Node.js 20, Express, Knex |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Auth | Firebase Auth |
| AI | Anthropic Claude (claude-sonnet-4-20250514) |
| Payments | Stripe (INR, UPI support) |
| Frontend Deploy | Vercel (bom1 region) |
| Backend Deploy | Railway |

---

## 🚢 Deployment

### Frontend → Vercel

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel Dashboard:
# NEXT_PUBLIC_API_URL, NEXT_PUBLIC_FIREBASE_*, NEXT_PUBLIC_STRIPE_KEY
```

### Backend → Railway

```bash
cd backend

# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Set environment variables in Railway Dashboard:
# DATABASE_URL, REDIS_URL, FIREBASE_*, ANTHROPIC_API_KEY, STRIPE_*
```

### Database → Railway PostgreSQL

```bash
# In Railway dashboard, add PostgreSQL service
# Then run migrations:
railway run psql $DATABASE_URL -f migrations/schema.sql
```

---

## 🧪 Testing

```bash
# Backend unit tests
cd backend && npm test

# Backend test with watch
cd backend && npm test -- --watch

# Frontend type check
cd frontend && npm run type-check

# Frontend lint
cd frontend && npm run lint
```

---

## 📊 Revenue Model

| Stream | Rate |
|--------|------|
| Expert consultations | ₹49/session (30-40% platform cut) |
| Premium subscription | ₹99/month |
| Data licensing | Annual contracts (researchers only) |
| Retailer partnerships | Traffic referral badges |

**Financial projections:**
- Year 1: ₹30 Lakhs (50K users)
- Year 2: ₹3 Crores (500K users)
- Year 3: ₹12 Crores (2M users)

---

## 🌍 Roadmap

- [x] MVP: Barcode + text scanning with Truth Score
- [x] Smart alternatives (3–5 per scan)
- [x] Expert marketplace (₹49 consultations)
- [x] Premium subscription (₹99/month)
- [ ] Mobile app (React Native / Expo)
- [ ] Chrome extension
- [ ] Offline scanning (Premium)
- [ ] Impact dashboard + gamification
- [ ] Fashion + electronics categories
- [ ] Southeast Asia expansion (Year 2)
- [ ] Europe expansion (Year 3)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## ⚖️ Ethics & Bias Policy

- Brands **cannot pay** for higher Truth Scores (enforced structurally)
- All scores based on **peer-reviewed public data** only
- Data licensing sold to **researchers only** — never to brands
- Score methodology is **fully transparent** (sub-score breakdown visible)
- Aligned with: **EU Green Claims Directive, FTC Green Guides, UN SDG 12**

---

## 📄 License

MIT License — see [LICENSE](LICENSE)

---

*Built to make sustainable shopping as easy as scanning a barcode.* 🌱
