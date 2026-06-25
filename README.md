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
│   ├── server.js              # HTTP server (Vercel-compatible)
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
├── vercel.json
├── package.json
├── POSTMAN_API_TEST.md
└── README.md
```

## Prerequisites

Before running this project, ensure you have the following installed:

| Tool | How to check | Minimum version |
|------|-------------|-----------------|
| Node.js | `node --version` | >= 18 |
| npm | `npm --version` | >= 9 |
| Git | `git --version` | any |
| Vercel CLI (for deploy) | `vercel --version` | >= 47 |

Install Node.js from [nodejs.org](https://nodejs.org) if you don't have it.

## Local Development

### Step 1 — Clone the repository

```bash
git clone <your-repo-url>
cd queuestorm-warmup
```

### Step 2 — Install dependencies

```bash
npm install
```

This installs all packages from `package.json` into `node_modules/`.

### Step 3 — Configure environment variables

```bash
cp .env.example .env
```

The `.env` file contains:

```
PORT=3000
NODE_ENV=development
```

You can change `PORT` to any available port.

### Step 4 — Start the development server

```bash
npm run dev
```

You should see:

```
QueueStorm Warmup API running on port 3000
Environment: development
```

### Step 5 — Verify the server is running

Open a new terminal and run:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "QueueStorm Warmup API",
  "timestamp": "2026-06-25T15:43:29.352Z"
}
```

### Step 6 — Test the ticket classification

```bash
curl -X POST http://localhost:3000/sort-ticket \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"T-001","channel":"app","locale":"en","message":"I sent 5000 taka to a wrong number this morning"}'
```

Expected response:

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

### Step 7 — Test with Postman

Import the collection from `POSTMAN_API_TEST.md`. It contains 15 test cases covering:

- All 5 classification types (English + Bangla)
- Validation error scenarios (missing fields, invalid values)
- Health check endpoint

### Step 8 — Stop the server

Press `Ctrl+C` in the terminal where the server is running.

### Hot Reload

The `npm run dev` command uses Node.js `--watch` mode. Any changes you make to files in `src/` will automatically restart the server. No need to manually stop and restart.

### NPM Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm start` | Start production server (no hot reload) |

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
- Request logging
- Centralized error handling
- Input validation
- Bilingual keyword detection (English + Bangla)
- Priority-ordered classification (phishing checked first)
- Summary safety (never requests OTP/PIN/password)

## Deployment

### Vercel (Recommended)

This project is configured for Vercel deployment out of the box via `vercel.json`. Vercel wraps the Express app as a serverless function with zero configuration.

#### Prerequisites

- A Vercel account — sign up free at [vercel.com/signup](https://vercel.com/signup)
- Vercel CLI installed globally

#### Step 1 — Install Vercel CLI

```bash
npm i -g vercel
```

Verify the installation:

```bash
vercel --version
```

You should see a version number (>= 47.0.5).

#### Step 2 — Login to Vercel

```bash
vercel login
```

This opens your browser. Select your login method (GitHub, GitLab, Bitbucket, or email). After authentication, you'll see "Success" in the terminal.

#### Step 3 — Deploy (first time)

Navigate to the project root (where `package.json` is located):

```bash
cd queuestorm-warmup
vercel
```

You'll be prompted with interactive questions:

```
? Set up and deploy? → Y
? Which scope? → Select your account/email
? Link to existing project? → N
? What's your project's name? → queuestorm-warmup
? In which directory is your code located? → ./
```

Vercel will:
1. Detect the Express framework automatically
2. Bundle your app into a serverless function
3. Deploy it to the Vercel CDN

After deployment, you'll see:

```
✅ Production: https://queuestorm-warmup.vercel.app [3s]
```

#### Step 4 — Deploy to production

The previous command deploys a **preview** URL. To deploy to your **production** URL:

```bash
vercel --prod
```

Your production API is now live at:

```
https://queuestorm-warmup.vercel.app
```

#### Step 5 — Set environment variables

Option A — Via CLI:

```bash
vercel env add NODE_ENV
? What's the value? → production
? Which environments? → Production
```

Option B — Via Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com) → your project
2. Click **Settings** → **Environment Variables**
3. Add: `NODE_ENV` = `production`
4. Click **Save**

#### Step 6 — Verify the deployment

Test the live API:

```bash
# Health check
curl https://queuestorm-warmup.vercel.app/health

# Ticket classification
curl -X POST https://queuestorm-warmup.vercel.app/sort-ticket \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"T-001","channel":"app","locale":"en","message":"I sent 5000 taka to a wrong number"}'
```

#### Step 7 — Update and redeploy

After making code changes:

```bash
# Option A: Manual redeploy
vercel --prod

# Option B: Git-linked auto-deploy
# If you linked a Git repository, just push to main branch
git add .
git commit -m "your changes"
git push origin main
# Vercel auto-deploys on push
```

#### Step 8 — View deployment logs

```bash
# View function logs
vercel logs https://queuestorm-warmup.vercel.app

# View with streaming (live tail)
vercel logs https://queuestorm-warmup.vercel.app --follow
```

#### Step 9 — Custom domain (optional)

1. Go to [vercel.com](https://vercel.com) → your project → **Settings** → **Domains**
2. Enter your custom domain (e.g., `api.yourdomain.com`)
3. Add the DNS records Vercel provides:
   - **Type:** CNAME
   - **Name:** `api` (or subdomain)
   - **Value:** `cname.vercel-dns.com`
4. Wait for DNS propagation (usually < 5 minutes)
5. SSL certificate is automatically provisioned

#### Step 10 — Link a Git repository (optional)

For automatic deployments on every push:

```bash
vercel git connect
```

Or go to [vercel.com](https://vercel.com) → your project → **Settings** → **Git** → connect your GitHub/GitLab/Bitbucket repo.

#### Troubleshooting

| Issue | Solution |
|-------|----------|
| `Error: Function exceeded size limit` | Your bundle is > 250MB. Check that `node_modules` isn't being included. |
| `404 on /health` | Ensure `vercel.json` routes are configured correctly. |
| `Environment variable not found` | Add the env var in Vercel dashboard → Settings → Environment Variables. |
| `Build failed` | Run `npm install` locally first, ensure all dependencies are in `package.json`. |
| Cold start delay | First request may take 1-3s. Subsequent requests are fast. |

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
