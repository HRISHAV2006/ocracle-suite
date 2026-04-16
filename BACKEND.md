# OCRacle — Backend Architecture & Specification

**Stack:** Node.js + Express + PostgreSQL + Redis  
**Runtime:** Node.js 20 LTS  
**Last Updated:** April 2026

---

## 1. Overview

The OCRacle backend is a RESTful API that powers the Truth Score Engine, product data aggregation, expert marketplace, and user management. It is designed to be stateless, horizontally scalable, and cost-efficient through aggressive caching.

**Base URL:** `https://api.ocracle.com`  
**API Version:** v1  
**Auth:** Firebase ID Token (Bearer)

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                           │
│              (Express + rate limiting + auth)                │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐   ┌─────▼─────┐  ┌───▼────────┐
   │  Scan   │   │  Products │  │   Users    │
   │ Service │   │  Service  │  │  Service   │
   └────┬────┘   └─────┬─────┘  └───┬────────┘
        │              │              │
   ┌────▼────┐   ┌─────▼─────┐  ┌───▼────────┐
   │  Redis  │   │ PostgreSQL│  │  Firebase  │
   │  Cache  │   │    DB     │  │    Auth    │
   └────┬────┘   └───────────┘  └────────────┘
        │
   ┌────▼──────────────────────┐
   │     External APIs         │
   │  - Open Food Facts API    │
   │  - EPD Online Database    │
   │  - Carbon Trust API       │
   │  - Anthropic Claude API   │
   │  - Google Cloud Vision    │
   │  - Stripe                 │
   └───────────────────────────┘
```

---

## 3. Database Schema

### 3.1 PostgreSQL Tables

```sql
-- Products table (cached from external APIs)
CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode         VARCHAR(50) UNIQUE,
  name            VARCHAR(255) NOT NULL,
  brand           VARCHAR(255),
  category        VARCHAR(100),
  image_url       TEXT,
  ingredients     JSONB,            -- Raw ingredient list
  truth_score     DECIMAL(4,2),     -- 0.00–10.00
  carbon_score    DECIMAL(4,2),
  water_score     DECIMAL(4,2),
  toxicity_score  DECIMAL(4,2),
  score_version   INTEGER DEFAULT 1,
  score_updated_at TIMESTAMPTZ,
  raw_off_data    JSONB,            -- Full Open Food Facts response
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid    VARCHAR(128) UNIQUE NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  display_name    VARCHAR(255),
  avatar_url      TEXT,
  is_premium      BOOLEAN DEFAULT FALSE,
  premium_until   TIMESTAMPTZ,
  is_expert       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Scans table
CREATE TABLE scans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  product_id      UUID REFERENCES products(id),
  scan_method     VARCHAR(20),      -- 'barcode' | 'ocr' | 'manual'
  scan_input      TEXT,             -- Raw input (barcode/text)
  scanned_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Alternatives table
CREATE TABLE alternatives (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_product_id UUID REFERENCES products(id),
  alt_product_id    UUID REFERENCES products(id),
  score_delta       DECIMAL(4,2),   -- alt_score - source_score
  price_delta_pct   DECIMAL(6,2),   -- % price difference
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Experts table
CREATE TABLE experts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) UNIQUE,
  bio             TEXT,
  credentials     JSONB,            -- [{degree, institution, year}]
  specializations TEXT[],           -- ['personal_care', 'food', ...]
  consultation_fee INTEGER DEFAULT 4900,  -- In paise (₹49 = 4900)
  is_verified     BOOLEAN DEFAULT FALSE,
  verified_at     TIMESTAMPTZ,
  rating_avg      DECIMAL(3,2),
  rating_count    INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Consultations table
CREATE TABLE consultations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consumer_id     UUID REFERENCES users(id),
  expert_id       UUID REFERENCES experts(id),
  product_id      UUID REFERENCES products(id),
  status          VARCHAR(20) DEFAULT 'pending',  -- pending|active|completed|cancelled
  consumer_filters JSONB,           -- {budget, allergies, location}
  expert_response TEXT,
  payment_intent  VARCHAR(255),     -- Stripe PaymentIntent ID
  amount_paise    INTEGER,
  expert_payout   INTEGER,          -- 60–70% of amount
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  responded_at    TIMESTAMPTZ
);

-- Reviews table
CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id),
  product_id      UUID REFERENCES products(id),
  score_accuracy  INTEGER CHECK (score_accuracy BETWEEN 1 AND 5),
  comment         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- User wishlist
CREATE TABLE wishlist (
  user_id     UUID REFERENCES users(id),
  product_id  UUID REFERENCES products(id),
  added_at    TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- Impact stats (materialized, updated nightly)
CREATE TABLE impact_stats (
  user_id         UUID PRIMARY KEY REFERENCES users(id),
  co2_saved_kg    DECIMAL(12,4) DEFAULT 0,
  plastic_avoided_kg DECIMAL(12,4) DEFAULT 0,
  water_saved_litres DECIMAL(12,4) DEFAULT 0,
  products_switched INTEGER DEFAULT 0,
  last_updated    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_scans_user_id ON scans(user_id);
CREATE INDEX idx_scans_product_id ON scans(product_id);
CREATE INDEX idx_consultations_consumer ON consultations(consumer_id);
CREATE INDEX idx_consultations_expert ON consultations(expert_id);
CREATE INDEX idx_alternatives_source ON alternatives(source_product_id);
```

---

## 4. API Endpoints

### 4.1 Scan Endpoints

#### `POST /api/v1/scan/barcode`
Scan product by barcode (EAN-13 / UPC).

**Request:**
```json
{
  "barcode": "8901058860847"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "uuid",
      "name": "Dove Body Wash",
      "brand": "Dove",
      "category": "personal_care",
      "imageUrl": "https://...",
      "barcode": "8901058860847"
    },
    "truthScore": {
      "overall": 3.8,
      "carbon": 4.2,
      "water": 3.1,
      "toxicity": 4.0,
      "label": "Ghost Label",
      "explanation": ["Contains SLS which has high aquatic toxicity...", "..."],
      "dataSource": "Open Food Facts + EPD Database",
      "generatedAt": "2026-04-15T10:30:00Z"
    },
    "cached": true
  }
}
```

#### `POST /api/v1/scan/text`
Scan product by OCR-extracted ingredient text.

**Request:**
```json
{
  "text": "Ingredients: Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine...",
  "category": "personal_care"
}
```

**Response:** Same structure as barcode scan.

#### `POST /api/v1/scan/image`
Upload product label image for server-side OCR.

**Request:** `multipart/form-data` with `image` field (JPEG/PNG, max 5MB)

**Response:** Same structure as barcode scan, includes `ocrConfidence` field.

---

### 4.2 Product Endpoints

#### `GET /api/v1/products/:id`
Get cached product with Truth Score.

#### `GET /api/v1/products/:id/alternatives`
Get 3–5 alternatives sorted by Truth Score, price proximity, and local availability.

**Response:**
```json
{
  "success": true,
  "data": {
    "alternatives": [
      {
        "product": { "id": "uuid", "name": "...", ... },
        "truthScore": 8.1,
        "priceDeltaPct": 12,
        "availableAt": ["BigBasket", "Amazon India"],
        "reasonBetter": "Uses plant-derived surfactants..."
      }
    ]
  }
}
```

#### `GET /api/v1/products/search`
Search products by name or brand.

**Query params:** `q`, `category`, `minScore`, `maxPrice`, `page`, `limit`

---

### 4.3 Expert Endpoints

#### `GET /api/v1/experts`
List verified experts with filters.

**Query params:** `specialization`, `maxFee`, `minRating`, `page`, `limit`

#### `GET /api/v1/experts/:id`
Get expert profile with reviews.

#### `POST /api/v1/experts/register`
Register as an expert (authenticated).

**Request:**
```json
{
  "bio": "PhD in Green Chemistry from IIT Bombay...",
  "credentials": [
    { "degree": "PhD", "field": "Green Chemistry", "institution": "IIT Bombay", "year": 2019 }
  ],
  "specializations": ["personal_care", "food"],
  "consultationFee": 4900
}
```

#### `POST /api/v1/consultations`
Book a consultation (authenticated consumer).

**Request:**
```json
{
  "expertId": "uuid",
  "productId": "uuid",
  "filters": {
    "budget": 500,
    "allergies": ["SLS", "parabens"],
    "location": "Mumbai"
  }
}
```

**Response:** Includes Stripe PaymentIntent client secret.

#### `PUT /api/v1/consultations/:id/respond`
Expert submits consultation response.

---

### 4.4 User Endpoints

#### `GET /api/v1/users/me`
Get current user profile.

#### `PUT /api/v1/users/me`
Update profile.

#### `GET /api/v1/users/me/scans`
Get scan history (paginated).

#### `GET /api/v1/users/me/impact`
Get personal impact stats.

```json
{
  "data": {
    "co2SavedKg": 12.4,
    "plasticAvoidedKg": 2.1,
    "waterSavedLitres": 840,
    "productsSwitched": 7,
    "monthlyTrend": [...]
  }
}
```

#### `GET /api/v1/users/me/wishlist`
Get wishlist.

#### `POST /api/v1/users/me/wishlist/:productId`
Add to wishlist.

#### `DELETE /api/v1/users/me/wishlist/:productId`
Remove from wishlist.

---

### 4.5 Subscription Endpoints

#### `POST /api/v1/subscriptions/create`
Create Stripe subscription for ₹99/month premium.

#### `POST /api/v1/webhooks/stripe`
Handle Stripe webhooks (subscription updates, payment confirmation).

---

### 4.6 Reviews Endpoints

#### `POST /api/v1/reviews`
Submit score accuracy review.

```json
{
  "productId": "uuid",
  "scoreAccuracy": 4,
  "comment": "Score felt accurate, product indeed has strong SLS smell"
}
```

---

## 5. Truth Score Engine

### 5.1 Scoring Pipeline

```javascript
// services/truthScoreService.js

async function calculateTruthScore(productData) {
  const { barcode, ingredients, category } = productData;

  // 1. Check cache
  const cacheKey = `score:${barcode || hashIngredients(ingredients)}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // 2. Fetch environmental data for each ingredient
  const ingredientData = await Promise.all(
    ingredients.map(ing => fetchIngredientData(ing))
  );

  // 3. Claude API analysis
  const aiAnalysis = await analyzeWithClaude(ingredientData, category);

  // 4. Calculate sub-scores
  const carbonScore = calculateCarbonScore(ingredientData, aiAnalysis);
  const waterScore = calculateWaterScore(ingredientData, aiAnalysis);
  const toxicityScore = calculateToxicityScore(ingredientData, aiAnalysis);

  // 5. Weighted aggregate
  const overallScore = (
    carbonScore * 0.40 +
    waterScore * 0.35 +
    toxicityScore * 0.25
  );

  const result = {
    overall: Math.round(overallScore * 10) / 10,
    carbon: carbonScore,
    water: waterScore,
    toxicity: toxicityScore,
    label: getScoreLabel(overallScore),
    explanation: aiAnalysis.explanations,
    dataSource: 'Open Food Facts + EPD Database + Carbon Trust',
    generatedAt: new Date().toISOString()
  };

  // 6. Cache result (30 days TTL)
  await redis.setex(cacheKey, 30 * 24 * 60 * 60, JSON.stringify(result));

  return result;
}
```

### 5.2 Claude API Integration

```javascript
// services/claudeService.js

const Anthropic = require('@anthropic-ai/sdk');
const client = new Anthropic();

async function analyzeWithClaude(ingredientData, category) {
  const prompt = `
You are an environmental chemistry expert. Analyze the following product ingredients
and provide environmental impact scores.

Product Category: ${category}
Ingredients with data:
${JSON.stringify(ingredientData, null, 2)}

Return a JSON object with:
{
  "carbonImpact": "low|medium|high",
  "waterImpact": "low|medium|high",
  "toxicityImpact": "low|medium|high",
  "explanations": ["reason1", "reason2", "reason3"],
  "redFlags": ["ingredient: reason", ...],
  "positives": ["ingredient: positive", ...]
}

Base your analysis only on peer-reviewed environmental data. Be specific and factual.
`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = message.content[0].text;
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}
```

### 5.3 Open Food Facts Integration

```javascript
// services/offService.js

const OFF_BASE = 'https://world.openfoodfacts.org/api/v2';

async function fetchProductByBarcode(barcode) {
  const cacheKey = `off:${barcode}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const response = await fetch(`${OFF_BASE}/product/${barcode}.json`);
  const data = await response.json();

  if (data.status !== 1) return null;

  const product = {
    name: data.product.product_name,
    brand: data.product.brands,
    ingredients: parseIngredients(data.product.ingredients_text),
    category: data.product.categories,
    imageUrl: data.product.image_url,
  };

  // Cache for 7 days
  await redis.setex(cacheKey, 7 * 24 * 60 * 60, JSON.stringify(product));
  return product;
}
```

---

## 6. Middleware

### 6.1 Authentication Middleware

```javascript
// middleware/auth.js

const { getAuth } = require('firebase-admin/auth');

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    const decoded = await getAuth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requirePremium = async (req, res, next) => {
  const user = await db('users').where({ firebase_uid: req.user.uid }).first();
  if (!user?.is_premium || new Date(user.premium_until) < new Date()) {
    return res.status(403).json({ error: 'Premium required', upgrade_url: '/premium' });
  }
  req.dbUser = user;
  next();
};
```

### 6.2 Rate Limiting

```javascript
// middleware/rateLimit.js

const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

// Free tier: 30 scans/hour
const scanRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  store: new RedisStore({ client: redis }),
  keyGenerator: (req) => req.user?.uid || req.ip,
  message: { error: 'Rate limit exceeded. Upgrade to Premium for unlimited scans.' }
});

// Premium tier: 500 scans/hour
const premiumRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 500,
  store: new RedisStore({ client: redis }),
  keyGenerator: (req) => req.user?.uid,
});
```

### 6.3 Error Handling

```javascript
// middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message, fields: err.fields });
  }

  if (err.name === 'NotFoundError') {
    return res.status(404).json({ error: err.message });
  }

  if (err.name === 'StripeError') {
    return res.status(402).json({ error: 'Payment failed', code: err.code });
  }

  res.status(500).json({
    error: 'Internal server error',
    requestId: req.id
  });
};
```

---

## 7. Caching Strategy

### 7.1 Redis Key Structure

| Key Pattern | TTL | Contents |
|---|---|---|
| `off:{barcode}` | 7 days | Open Food Facts product data |
| `score:{hash}` | 30 days | Calculated Truth Score |
| `alts:{productId}` | 1 day | Alternatives list |
| `epd:{ingredient}` | 90 days | EPD environmental data |
| `user:{uid}:impact` | 1 hour | Impact stats |
| `rate:{uid}` | 1 hour | Rate limit counter |

### 7.2 Cache Invalidation
- Truth Score invalidated when score algorithm version bumps
- Product data invalidated if Open Food Facts sends webhook update
- Manual invalidation endpoint: `DELETE /api/v1/admin/cache/:key` (admin only)

---

## 8. Background Jobs

### 8.1 Job Queue: Bull (Redis-based)

```javascript
// jobs/index.js

const Bull = require('bull');

const scoreQueue = new Bull('truth-score', { redis: redisConfig });
const impactQueue = new Bull('impact-stats', { redis: redisConfig });
const notifyQueue = new Bull('notifications', { redis: redisConfig });

// Process score calculation jobs (async for uncached products)
scoreQueue.process(async (job) => {
  const { productId } = job.data;
  await truthScoreService.calculateAndStore(productId);
});

// Nightly impact stats recalculation
impactQueue.process(async (job) => {
  const { userId } = job.data;
  await impactService.recalculate(userId);
});

// Wishlist price drop notifications
notifyQueue.process(async (job) => {
  const { userId, productId, newPrice } = job.data;
  await notificationService.sendPriceAlert(userId, productId, newPrice);
});
```

### 8.2 Scheduled Jobs

| Job | Schedule | Description |
|---|---|---|
| `recalculate-all-scores` | Weekly (Sunday 2am) | Re-score products when algorithm updates |
| `check-price-alerts` | Every 6 hours | Check wishlist product prices |
| `update-impact-stats` | Nightly (1am) | Recalculate all user impact stats |
| `expert-sla-check` | Every hour | Alert experts approaching 24hr response SLA |
| `cleanup-old-scans` | Monthly | Archive scans older than 1 year |

---

## 9. Environment Variables

```bash
# Server
NODE_ENV=production
PORT=3001
API_BASE_URL=https://api.ocracle.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/ocracle
REDIS_URL=redis://localhost:6379

# Firebase Admin
FIREBASE_PROJECT_ID=ocracle-prod
FIREBASE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@ocracle-prod.iam.gserviceaccount.com

# External APIs
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_CLOUD_VISION_KEY=...
OPEN_FOOD_FACTS_APP_NAME=OCRacle/1.0 (contact@ocracle.com)

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
```

---

## 10. File Structure

```
backend/
├── src/
│   ├── app.js                  ← Express app setup
│   ├── server.js               ← Server entry point
│   │
│   ├── routes/
│   │   ├── scan.routes.js      ← /api/v1/scan/*
│   │   ├── products.routes.js  ← /api/v1/products/*
│   │   ├── experts.routes.js   ← /api/v1/experts/*
│   │   ├── consultations.routes.js
│   │   ├── users.routes.js     ← /api/v1/users/*
│   │   ├── subscriptions.routes.js
│   │   ├── reviews.routes.js
│   │   └── webhooks.routes.js  ← /api/v1/webhooks/*
│   │
│   ├── services/
│   │   ├── truthScoreService.js   ← Core scoring engine
│   │   ├── claudeService.js       ← Anthropic API
│   │   ├── offService.js          ← Open Food Facts
│   │   ├── epdService.js          ← EPD Database
│   │   ├── alternativesService.js ← Alternatives ranking
│   │   ├── expertService.js       ← Expert marketplace
│   │   ├── impactService.js       ← Impact stats calculation
│   │   ├── stripeService.js       ← Payments
│   │   └── notificationService.js ← Push + email notifications
│   │
│   ├── middleware/
│   │   ├── auth.js                ← Firebase token verification
│   │   ├── rateLimit.js           ← Rate limiting
│   │   ├── errorHandler.js
│   │   ├── requestLogger.js
│   │   └── validate.js            ← Request validation (Zod)
│   │
│   ├── models/
│   │   ├── product.model.js
│   │   ├── user.model.js
│   │   ├── scan.model.js
│   │   ├── expert.model.js
│   │   └── consultation.model.js
│   │
│   ├── utils/
│   │   ├── db.js                  ← Knex PostgreSQL client
│   │   ├── redis.js               ← Redis client
│   │   ├── logger.js              ← Winston logger
│   │   ├── scoreCalculator.js     ← Scoring math utilities
│   │   └── ingredientParser.js    ← OCR text → ingredient array
│   │
│   └── jobs/
│       ├── index.js               ← Bull queue definitions
│       ├── scoreWorker.js
│       ├── impactWorker.js
│       └── notifyWorker.js
│
├── migrations/
│   ├── 001_create_products.sql
│   ├── 002_create_users.sql
│   ├── 003_create_scans.sql
│   ├── 004_create_experts.sql
│   └── 005_create_consultations.sql
│
├── tests/
│   ├── unit/
│   │   ├── truthScore.test.js
│   │   └── ingredientParser.test.js
│   └── integration/
│       ├── scan.test.js
│       └── experts.test.js
│
├── .env.example
├── package.json
├── Dockerfile
└── railway.json
```

---

## 11. Deployment

### 11.1 Railway Configuration

```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node src/server.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

### 11.2 Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["node", "src/server.js"]
```

### 11.3 Health Check Endpoint

```javascript
// GET /health
app.get('/health', async (req, res) => {
  const dbOk = await db.raw('SELECT 1').then(() => true).catch(() => false);
  const redisOk = await redis.ping().then(r => r === 'PONG').catch(() => false);

  const status = dbOk && redisOk ? 'healthy' : 'degraded';
  res.status(dbOk ? 200 : 503).json({
    status,
    services: { database: dbOk, cache: redisOk },
    version: process.env.npm_package_version,
    timestamp: new Date().toISOString()
  });
});
```

---

## 12. Security

### 12.1 Measures
- All endpoints behind Firebase Auth (except `/health` and `/api/v1/scan/barcode` for demo)
- Rate limiting per user (free: 30/hr, premium: 500/hr)
- Helmet.js security headers
- Input validation via Zod on all request bodies
- SQL injection prevention via Knex parameterized queries
- Stripe webhook signature verification
- CORS restricted to ocracle.com and localhost (dev)

### 12.2 Data Privacy
- User scan history encrypted at rest (PostgreSQL encryption)
- Anonymized data exports only (GDPR/DPDP compliant)
- No personal data shared with brands
- Data retention: Scans kept 1 year, then aggregated/anonymized

---

## 13. Monitoring & Observability

| Tool | Purpose |
|---|---|
| Sentry | Error tracking + performance |
| Winston | Structured JSON logging |
| Prometheus + Grafana | Metrics (Railway provides basic) |
| PostHog | API usage analytics |

### Key Metrics to Track
- Truth Score calculation latency (p50, p95, p99)
- Cache hit rate (target: ≥ 80%)
- API error rate (target: < 0.1%)
- Successful scan rate (target: ≥ 95%)
- Expert consultation completion rate
