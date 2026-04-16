# OCRacle — Product Requirements Document (PRD)
**Version:** 1.0  
**Date:** April 2026  
**Status:** Ready for Development  
**Product:** OCRacle — The Ghost Label Detector

---

## 1. Executive Summary

OCRacle is an AI-powered greenwashing detection platform that gives consumers instant, unbiased environmental truth scores for any consumer product. By scanning product labels via smartphone camera or barcode, OCRacle cross-references public environmental databases to generate a 0–10 Truth Score in under 3 seconds — along with 3–5 better-scoring alternatives.

The platform launches in India first, targeting 8 million eco-conscious consumers, with expansion to Southeast Asia (Year 2) and Europe (Year 3).

---

## 2. Problem Statement

### 2.1 The Greenwashing Crisis
- **80%** of "sustainable" products in 2026 use confusing jargon to mask greenwashing
- Consumers lack time to read 50-page ESG reports before every purchase
- Small genuine eco-brands cannot compete fairly against large-budget misleading marketing
- **No unified, instant verification tool** currently exists in the market

### 2.2 Consumer Pain Points
| Pain Point | Impact |
|---|---|
| Can't trust "eco" labels | 73% of consumers distrust sustainability claims (McKinsey 2024) |
| Too much information | ESG reports average 50+ pages per product |
| No neutral arbiter | All current rating tools accept brand sponsorship |
| No alternatives shown | Even aware consumers don't know what to buy instead |

---

## 3. Product Vision & Goals

### 3.1 Vision Statement
> "Make sustainable shopping as easy as scanning a barcode — and as trustworthy as peer-reviewed science."

### 3.2 Goals
**Year 1:** Achieve 50,000 active users in India; ₹30 Lakhs revenue  
**Year 2:** 500,000 users across India + Southeast Asia; ₹3 Crores revenue  
**Year 3:** 2 million users globally; ₹12 Crores revenue (includes retailer partnerships)

### 3.3 Success Metrics (KPIs)
| Metric | Year 1 Target |
|---|---|
| Monthly Active Users (MAU) | 50,000 |
| Scans per user per month | 8 |
| Expert consultations sold | 5,000 |
| Premium subscribers | 2,000 |
| Truth Score accuracy rating | ≥ 4.2/5.0 |
| App Store rating | ≥ 4.5 |

---

## 4. Target Users & Personas

### Persona 1: Priya — The Conscious Consumer (Primary)
- **Age:** 28–38, urban India
- **Occupation:** Working professional, disposable income
- **Behavior:** Buys "eco" products but feels cheated; reads ingredient lists but can't interpret them
- **Goal:** Make genuinely sustainable choices without research fatigue
- **Frustration:** "I bought a ₹600 'natural' shampoo that turned out to be worse than Dove."

### Persona 2: Rahul — The Budget-Aware Switcher (Secondary)
- **Age:** 22–30, Tier 1–2 cities
- **Behavior:** Open to sustainable alternatives only if price-comparable
- **Goal:** Save money AND environment simultaneously
- **Key Feature Needed:** Price-comparable alternative suggestions

### Persona 3: Dr. Meera — The Sustainability Expert (Supplier)
- **Role:** Chemist / Sustainability Researcher
- **Goal:** Monetize expertise; build credibility and following
- **Key Feature Needed:** Expert profile, client management, revenue dashboard

---

## 5. Core Features & Requirements

### 5.1 Feature: Product Scanner (MVP — Week 1)
**Priority:** P0 — Must Have

**User Story:**  
As a consumer, I want to scan any product label with my phone camera so that I instantly know its environmental truth score without reading the entire label.

**Functional Requirements:**
- Camera-based barcode scanning (EAN-13, QR codes)
- OCR text extraction from ingredient/material lists
- Manual product name / barcode input as fallback
- Support for: Personal care, Food & Beverage, Household cleaning products (MVP)
- Response time: Truth Score generated in **< 3 seconds**

**Technical Requirements:**
- React Native camera module (expo-camera)
- Google Cloud Vision API for OCR
- Open Food Facts API for product matching
- Caching layer: Redis (80% cache hit target reduces API calls)

**Acceptance Criteria:**
- [ ] Successfully scans ≥ 95% of barcodes in standard lighting
- [ ] OCR accuracy ≥ 90% for printed ingredient lists
- [ ] Truth Score returned in < 3 seconds (p95)
- [ ] Graceful fallback to manual input when scan fails

---

### 5.2 Feature: AI Truth Score Engine (MVP — Week 1)
**Priority:** P0 — Must Have

**User Story:**  
As a consumer, I want a single 0–10 score that tells me how environmentally truthful a product is, based on real data — not brand claims.

**Truth Score Algorithm:**

```
Truth Score = weighted_average(
  carbon_footprint_score × 0.40,
  water_usage_score      × 0.35,
  chemical_toxicity_score × 0.25
)
```

Each sub-score is calculated by:
1. Extracting ingredient/material list via OCR
2. Matching each ingredient to Open Food Facts + EPD Database
3. Retrieving Carbon Trust footprint data per ingredient
4. AI analysis of combined environmental impact (1 LLM call per unique product)
5. Normalizing to 0–10 scale

**Data Sources:**
| Source | Data Provided | URL |
|---|---|---|
| Open Food Facts API | Ingredient database (1.5M products) | open.openfoodfacts.org |
| EPD Online Database | Environmental Product Declarations | epd-online.com |
| Carbon Trust Database | Carbon footprint per ingredient | carbontrust.com |

**Scoring Labels:**
| Score | Label | Color |
|---|---|---|
| 0.0 – 3.9 | Ghost Label (Greenwashed) | Red |
| 4.0 – 6.9 | Partial Truth | Amber |
| 7.0 – 8.9 | Genuinely Sustainable | Green |
| 9.0 – 10.0 | Verified Clean | Deep Green + Badge |

**Acceptance Criteria:**
- [ ] Score generated using public data sources only (no brand payments)
- [ ] All three sub-scores (carbon, water, toxicity) displayed
- [ ] Score is deterministic: same product always returns same score
- [ ] Brands cannot influence or purchase higher scores

---

### 5.3 Feature: Smart Alternatives (MVP — Week 2)
**Priority:** P0 — Must Have

**User Story:**  
As a consumer who scans a low-scoring product, I want to see 3–5 better alternatives so I can make an immediate switch without additional research.

**Sorting Algorithm:**
1. Truth Score (highest first)
2. Price proximity (nearest to scanned product)
3. Local availability (closest store / online)

**Acceptance Criteria:**
- [ ] Minimum 3 alternatives displayed for every product
- [ ] Alternatives filtered by same product category
- [ ] Each alternative shows: name, Truth Score, price, availability
- [ ] Deep link to purchase on partner platforms

---

### 5.4 Feature: Expert Verification System (MVP — Week 2)
**Priority:** P1 — Should Have

**User Story:**  
As a consumer, I want to consult verified sustainability experts who can give me personalized recommendations considering my budget, allergies, and local availability.

**Expert Onboarding Flow:**
1. Expert registers with credentials (degree, certifications)
2. Platform verifies via LinkedIn / credential check
3. Expert publishes sample analyses to build profile
4. Expert sets availability and consultation price (platform suggests ₹49)

**Consultation Flow:**
1. Consumer views product scan result
2. Taps "Ask an Expert" (₹49)
3. Expert receives product data + consumer's filters (budget, allergies, location)
4. Expert responds within 24 hours with personalized alternatives

**Revenue Split:** Expert: 60–70% | Platform: 30–40%

**Acceptance Criteria:**
- [ ] Expert verification badge visible on all recommendations
- [ ] Stripe payment integration for ₹49 consultation fee
- [ ] Expert response SLA: 24 hours (enforced by platform)
- [ ] Consumer can rate consultation quality (1–5 stars)

---

### 5.5 Feature: Impact Dashboard & Gamification (MVP — Week 3)
**Priority:** P1 — Should Have

**User Story:**  
As a regular user, I want to see the cumulative environmental impact of my sustainable choices so that I stay motivated to continue.

**Dashboard Metrics:**
- Total plastic avoided (kg)
- CO₂ saved (tonnes)
- Water conserved (litres)
- Products switched (count)
- Estimated money saved vs greenwashed alternatives

**Gamification Elements:**
| Feature | Description |
|---|---|
| Monthly Challenges | "Switch one product this week," "Beat your CO₂ record" |
| Leaderboards | Top contributors, most-switched categories |
| Badge System | "Eco-Warrior," "Verified Reviewer," "Sustainability Expert" |
| Wishlist Alerts | Notifications when favorited products drop in price |
| Shareable Cards | Social media cards showing personal impact stats |

**Retention Target:** 2–3 app opens per week (vs. 1-time scanner pattern)

---

### 5.6 Feature: User Reviews & ML Feedback Loop
**Priority:** P2 — Nice to Have (Week 3)

**User Story:**  
After purchasing a recommended alternative, I want to rate whether the Truth Score was accurate so the system improves over time.

**Flow:**
1. 3 days after scan → push notification: "Did you buy this? Was the score accurate?"
2. User rates accuracy (1–5)
3. High-accuracy products earn "Verified Accurate" badge
4. Ratings feed back into ML model retraining pipeline

---

## 6. Revenue Model

### 6.1 Revenue Streams

| Stream | Model | Rate |
|---|---|---|
| Expert Recommendations | Per-consultation | ₹49 per session |
| Premium Subscription | Monthly SaaS | ₹99/month |
| Data Licensing | B2B annual contracts | To sustainability researchers (NOT brands) |
| Retailer Partnerships | Traffic referral | "Verified Sustainable Retailer" badge |

### 6.2 Premium Features (₹99/month)
- Offline scanning (cached database)
- Advanced filters (vegan, cruelty-free, palm-oil-free)
- Unlimited wishlist alerts
- Priority expert access (4-hour SLA vs 24-hour)
- Monthly PDF impact report
- Early access to new product categories

### 6.3 Financial Projections

| Year | Active Users | Revenue |
|---|---|---|
| Year 1 | 50,000 | ₹30 Lakhs |
| Year 2 | 500,000 | ₹3 Crores |
| Year 3 | 2,000,000 | ₹12 Crores |

---

## 7. Technical Architecture

### 7.1 System Overview

```
[Mobile App / Browser Extension]
        ↓ scan
[API Gateway — Node.js/Express]
        ↓
[Truth Score Engine — LLM + Algorithm]
        ↓              ↓
[Open Food Facts]  [EPD/Carbon DB]
        ↓
[Redis Cache] ← 80% hit rate
        ↓
[PostgreSQL — Products, Users, Scores, Reviews]
        ↓
[Firebase — Auth, Push Notifications]
```

### 7.2 Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Mobile | React Native (Expo) | Single codebase, iOS + Android |
| Web Extension | Chrome Extension (Manifest V3) | Broad reach, same codebase |
| Backend API | Node.js + Express | Fast, lightweight, great API ecosystem |
| Database | PostgreSQL | Relational data; product + user scoring |
| Cache | Redis | 80% API call reduction via caching |
| Auth | Firebase Auth | Fast setup, Google/Apple SSO |
| AI/LLM | Anthropic Claude API | Product ingredient analysis |
| OCR | Google Cloud Vision API | High accuracy for packaged labels |
| Payments | Stripe | PCI compliant, UPI support for India |
| Hosting | Vercel (frontend) + Railway (backend) | Fast deployment, auto-scaling |
| CDN | Cloudflare | Global edge, DDoS protection |

### 7.3 Data Flow

1. **Scan** → Camera captures packaging / barcode
2. **Extract** → OCR extracts ingredient list (or barcode lookup)
3. **Match** → Product matched to Open Food Facts (check cache first)
4. **Analyze** → Claude API analyzes environmental impact of each ingredient
5. **Score** → Algorithm combines 3 metrics into Truth Score (0–10)
6. **Return** → Score + alternatives displayed in < 3 seconds

### 7.4 Caching Strategy
- Cache key: `product_barcode` or `ingredient_hash`
- TTL: 30 days (environmental data is stable)
- Cache miss → full API call → result cached immediately
- One LLM call per unique product, result reused forever

### 7.5 Scalability
- **No custom database** — leverage existing Open Food Facts (1.5M products)
- Horizontal scaling via Railway auto-deploy
- Redis cluster for distributed caching
- CDN-served static assets (Vercel Edge Network)

---

## 8. Implementation Timeline

### Week 1: Core MVP
- [ ] API integration (Open Food Facts, EPD, Carbon Trust)
- [ ] Scanner UI (React Native camera + OCR)
- [ ] Truth Score algorithm v1
- [ ] Basic product results screen
- [ ] Redis caching layer

### Week 2: Differentiation Features
- [ ] Smart Alternatives engine
- [ ] Expert registration + verification system
- [ ] Stripe payment gateway (₹49 consultations + ₹99 subscription)
- [ ] Firebase Auth (Google/Apple SSO)

### Week 3: Retention & Engagement
- [ ] User reviews system
- [ ] Impact dashboard
- [ ] Gamification (challenges, leaderboards, badges)
- [ ] Push notification system (wishlist alerts)

### Week 4: Launch
- [ ] QA + bug fixes
- [ ] App Store + Play Store submission
- [ ] Chrome extension launch
- [ ] Vercel production deployment
- [ ] Analytics (Mixpanel / PostHog)

---

## 9. Team Requirements

| Role | Count | Responsibility |
|---|---|---|
| Backend Developer | 2 | API, database, Truth Score engine, caching |
| Mobile Developer | 2 | React Native app, camera, OCR integration |
| UI/UX Designer | 1 | App design, gamification, onboarding |
| Data Scientist | 1 | Truth Score algorithm, ML feedback loop |
| DevOps Engineer | 1 | Vercel/Railway deployment, monitoring |

---

## 10. Market Strategy

### 10.1 Go-To-Market
1. Launch in India first (high eco-consciousness, growing e-commerce, low direct competition)
2. Partner with 5–10 sustainability influencers (Instagram / YouTube) for organic launch
3. Target early adopters via sustainability communities and eco-forums (Reddit, Discord)
4. Year 2: Expand to Southeast Asia (Singapore, Indonesia, Thailand)
5. Year 3: Expand to Europe (EU Green Claims Directive creates favorable regulatory tailwind)

### 10.2 Product Category Rollout
- **MVP:** Personal care products (shampoo, soap, cosmetics)
- **Month 3:** Food & beverage
- **Month 6:** Household cleaning
- **Year 2:** Fashion (textiles, certifications)
- **Year 2:** Electronics (e-waste, rare minerals)

### 10.3 Competitive Moat
| Advantage | Description |
|---|---|
| Unbiased Scoring | Brands cannot pay for higher scores — structural trust advantage |
| Speed | < 3 second Truth Score vs. minutes of manual research |
| Network Effects | User reviews improve accuracy over time — self-reinforcing moat |
| Expert Ecosystem | Experts build reputation on platform, hard to replicate |

---

## 11. Regulatory & Ethical Framework

### 11.1 Compliance
- **EU Green Claims Directive (2024):** OCRacle's methodology aligns with EU standards for verified environmental claims
- **FTC Green Guides:** US environmental marketing claims compliance for global expansion
- **India BIS Standards:** Local consumer protection law compliance
- **GDPR / DPDP Act:** Data privacy for EU + India users

### 11.2 Ethical Commitments
- Brands **cannot pay** for higher Truth Scores (ever)
- Data licensing is sold to **researchers only** — never to brands for competitive intelligence
- All AI model decisions are **explainable** (users can view sub-score breakdown)
- Expert credentials are **publicly verified** — no anonymous recommendations

### 11.3 Aligned SDGs
- **SDG 12:** Responsible Consumption and Production
- **SDG 13:** Climate Action
- **SDG 17:** Partnerships for the Goals (retailer + research partnerships)

---

## 12. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Open Food Facts data gaps | Medium | High | Supplement with manual product entry + crowdsourcing |
| Brand legal challenges to scores | Medium | High | All scores based on peer-reviewed public data; legal review of methodology |
| Low expert supply at launch | Medium | Medium | Pre-recruit 10 verified experts before public launch |
| App Store rejection | Low | High | Review guidelines compliance; have web-app fallback ready |
| LLM hallucination in scoring | Medium | High | Human-in-the-loop review for top 1000 products; feedback loop |
| Data source API downtime | Low | High | Fallback to cached results; degrade gracefully |

---

## 13. References

**Data Sources:**
- Open Food Facts: open.openfoodfacts.org
- EPD Online: epd-online.com
- Carbon Trust: carbontrust.com

**Market Research:**
- McKinsey Sustainability Report 2024 (73% consumer distrust stat)
- Nielsen Global Sustainability Study (60% premium willingness)

**Regulatory:**
- EU Green Claims Directive (2024)
- FTC Green Guides
- UN SDG 12 Framework

**Technical:**
- Anthropic Claude API Documentation
- Google Cloud Vision API
- React Native / Expo Documentation
- Stripe India Payment API

---

*Document Owner: Product Team | Next Review: Week 4 (Post-MVP Launch)*
