# QueueStorm Warmup API

Customer support ticket classification system. Receives a complaint message and returns a structured classification with case type, severity, department, agent summary, and confidence score.

## Tech Stack

- Node.js (>=18)
- Express.js
- ES Modules
- No database required

## Project Structure

```
project/
├── src/
│   ├── server.js              # HTTP server + graceful shutdown
│   ├── app.js                 # Express app + middleware stack
│   ├── config/
│   │   └── env.js             # Environment variable loader
│   ├── routes/
│   │   ├── health.routes.js   # GET /health
│   │   └── ticket.routes.js   # POST /sort-ticket
│   ├── controllers/
│   │   ├── health.controller.js
│   │   └── ticket.controller.js
│   ├── services/
│   │   ├── classifier.service.js   # Keyword-based classification
│   │   └── summary.service.js      # Agent summary generator
│   ├── middlewares/
│   │   ├── errorHandler.js     # Centralized error handling
│   │   └── validateRequest.js  # Input validation
│   └── utils/
│       └── constants.js        # Keywords, configs, templates
├── .env.example
├── .env
├── package.json
├── POSTMAN_API_TEST.md
└── README.md
```

## Setup

```bash
# Clone the repo
git clone <your-repo-url>
cd queuestorm-warmup

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Server runs at `http://localhost:3000`.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | `development` or `production` |

## API Endpoints

### GET /health

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "service": "QueueStorm Warmup API",
  "timestamp": "2026-06-25T15:43:29.352Z"
}
```

### POST /sort-ticket

```bash
curl -X POST http://localhost:3000/sort-ticket \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"T-001","channel":"app","locale":"en","message":"I sent 5000 taka to a wrong number this morning"}'
```

Request Body:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ticket_id` | string | Yes | Unique ticket identifier |
| `message` | string | Yes | Customer complaint (min 3 chars) |
| `channel` | string | No | `app`, `sms`, `call_center`, `merchant_portal` |
| `locale` | string | No | `en`, `bn`, `mixed` |

Response:
```json
{
  "ticket_id": "T-001",
  "case_type": "wrong_transfer",
  "severity": "high",
  "department": "dispute_resolution",
  "agent_summary": "Customer reports sending funds to an incorrect recipient and requests assistance recovering the transfer.",
  "human_review_required": false,
  "confidence": 0.92
}
```

## Classification Types

| Case Type | Severity | Department | Confidence | Human Review |
|-----------|----------|------------|------------|--------------|
| `wrong_transfer` | high | dispute_resolution | 0.92 | false |
| `payment_failed` | high | payments_ops | 0.90 | false |
| `refund_request` | low | customer_support | 0.88 | false |
| `phishing_or_social_engineering` | critical | fraud_risk | 0.97 | true |
| `other` | low | customer_support | 0.75 | false |

Human review is required when severity is `critical` or case type is `phishing_or_social_engineering`.

## Test Payloads

**Wrong Transfer:**
```json
{"ticket_id":"T-001","channel":"app","locale":"en","message":"I sent 5000 taka to a wrong number this morning"}
```

**Payment Failed:**
```json
{"ticket_id":"T-002","channel":"sms","locale":"en","message":"My payment failed but money was deducted"}
```

**Refund Request:**
```json
{"ticket_id":"T-003","channel":"call_center","locale":"en","message":"I want a refund for my last transaction"}
```

**Phishing:**
```json
{"ticket_id":"T-004","channel":"app","locale":"en","message":"Someone called asking for my OTP and verification code"}
```

**Bangla - Wrong Transfer:**
```json
{"ticket_id":"T-005","channel":"app","locale":"bn","message":"আমি ভুল নাম্বারে টাকা পাঠিয়েছি"}
```

**Bangla - Refund:**
```json
{"ticket_id":"T-006","channel":"app","locale":"bn","message":"আমার টাকা ফেরত দাও"}
```

**Other:**
```json
{"ticket_id":"T-007","channel":"merchant_portal","locale":"en","message":"How do I change my profile picture?"}
```

## Validation Errors

Missing required field returns 400:
```json
{"error": true, "message": "message is required"}
```

Invalid channel returns 400:
```json
{"error": true, "message": "channel must be one of: app, sms, call_center, merchant_portal"}
```

## Features

- Security headers via Helmet
- CORS enabled
- Request compression
- Rate limiting (100 req/15min)
- Request logging
- Centralized error handling
- Graceful shutdown (SIGTERM/SIGINT)
- Input validation
- Bilingual keyword detection (English + Bangla)
- Priority-ordered classification (phishing checked first)
- Summary safety (never requests OTP/PIN/password)

## Deployment

### Render

1. Push to GitHub
2. Create a new **Web Service** on Render
3. Connect your repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** `Node`
5. Add environment variable: `NODE_ENV=production`
6. Deploy

### Railway

1. Push to GitHub
2. Create new project on Railway
3. Deploy from GitHub repo
4. Railway auto-detects Node.js
5. Set env var: `NODE_ENV=production`
6. Railway provides a public URL

### Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch (from project root)
fly launch

# Set production env
fly secrets set NODE_ENV=production

# Deploy
fly deploy
```

### Docker (for any platform)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/server.js"]
```

```bash
docker build -t queuestorm-api .
docker run -p 3000:3000 queuestorm-api
```

## License

MIT
