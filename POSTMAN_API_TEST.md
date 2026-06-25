# QueueStorm Warmup API — Postman Testing Guide

## Setup

1. Open Postman
2. Create a new Collection: **QueueStorm Warmup API**
3. Set base URL variable: `base_url` = `http://localhost:3000`

---

## Endpoint 1: Health Check

| Field | Value |
|-------|-------|
| Method | `GET` |
| URL | `{{base_url}}/health` |
| Headers | None |

### Expected Response (200)

```json
{
  "status": "ok",
  "service": "QueueStorm Warmup API",
  "timestamp": "2026-06-25T19:30:00.000Z"
}
```

---

## Endpoint 2: Sort Ticket

| Field | Value |
|-------|-------|
| Method | `POST` |
| URL | `{{base_url}}/sort-ticket` |
| Headers | `Content-Type: application/json` |
| Body | raw → JSON |

---

### Test 1: Wrong Transfer (English)

**Body:**
```json
{
  "ticket_id": "T-001",
  "channel": "app",
  "locale": "en",
  "message": "I sent 5000 taka to a wrong number this morning"
}
```

**Expected Response (200):**
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

---

### Test 2: Wrong Transfer (Bangla)

**Body:**
```json
{
  "ticket_id": "T-002",
  "channel": "app",
  "locale": "bn",
  "message": "আমি ভুল নাম্বারে টাকা পাঠিয়েছি"
}
```

**Expected Response (200):**
```json
{
  "ticket_id": "T-002",
  "case_type": "wrong_transfer",
  "severity": "high",
  "department": "dispute_resolution",
  "agent_summary": "Customer reports sending funds to an incorrect recipient and requests assistance recovering the transfer.",
  "human_review_required": false,
  "confidence": 0.92
}
```

---

### Test 3: Payment Failed (English)

**Body:**
```json
{
  "ticket_id": "T-003",
  "channel": "sms",
  "locale": "en",
  "message": "My payment failed but money was deducted from my balance"
}
```

**Expected Response (200):**
```json
{
  "ticket_id": "T-003",
  "case_type": "payment_failed",
  "severity": "high",
  "department": "payments_ops",
  "agent_summary": "Customer reports a failed transaction while funds may have been deducted from the account.",
  "human_review_required": false,
  "confidence": 0.9
}
```

---

### Test 4: Payment Failed (Bangla)

**Body:**
```json
{
  "ticket_id": "T-004",
  "channel": "app",
  "locale": "bn",
  "message": "পেমেন্ট ফেল হয়েছে টাকা কেটে নিয়েছে"
}
```

**Expected Response (200):**
```json
{
  "ticket_id": "T-004",
  "case_type": "payment_failed",
  "severity": "high",
  "department": "payments_ops",
  "agent_summary": "Customer reports a failed transaction while funds may have been deducted from the account.",
  "human_review_required": false,
  "confidence": 0.9
}
```

---

### Test 5: Refund Request (English)

**Body:**
```json
{
  "ticket_id": "T-005",
  "channel": "call_center",
  "locale": "en",
  "message": "I want a refund for my last transaction"
}
```

**Expected Response (200):**
```json
{
  "ticket_id": "T-005",
  "case_type": "refund_request",
  "severity": "low",
  "department": "customer_support",
  "agent_summary": "Customer requests a refund for a recent transaction.",
  "human_review_required": false,
  "confidence": 0.88
}
```

---

### Test 6: Refund Request (Bangla)

**Body:**
```json
{
  "ticket_id": "T-006",
  "channel": "app",
  "locale": "bn",
  "message": "আমার টাকা ফেরত দাও"
}
```

**Expected Response (200):**
```json
{
  "ticket_id": "T-006",
  "case_type": "refund_request",
  "severity": "low",
  "department": "customer_support",
  "agent_summary": "Customer requests a refund for a recent transaction.",
  "human_review_required": false,
  "confidence": 0.88
}
```

---

### Test 7: Phishing / Social Engineering (English)

**Body:**
```json
{
  "ticket_id": "T-007",
  "channel": "app",
  "locale": "en",
  "message": "Someone called asking for my OTP and verification code"
}
```

**Expected Response (200):**
```json
{
  "ticket_id": "T-007",
  "case_type": "phishing_or_social_engineering",
  "severity": "critical",
  "department": "fraud_risk",
  "agent_summary": "Customer reports a suspicious request for sensitive account credentials.",
  "human_review_required": true,
  "confidence": 0.97
}
```

---

### Test 8: Phishing / Social Engineering (Bangla)

**Body:**
```json
{
  "ticket_id": "T-008",
  "channel": "app",
  "locale": "bn",
  "message": "একজন ভুয়া কল করে আমার পাসওয়ার্ড চেয়েছে"
}
```

**Expected Response (200):**
```json
{
  "ticket_id": "T-008",
  "case_type": "phishing_or_social_engineering",
  "severity": "critical",
  "department": "fraud_risk",
  "agent_summary": "Customer reports a suspicious request for sensitive account credentials.",
  "human_review_required": true,
  "confidence": 0.97
}
```

---

### Test 9: Other (General Issue)

**Body:**
```json
{
  "ticket_id": "T-009",
  "channel": "merchant_portal",
  "locale": "en",
  "message": "How do I change my profile picture on the app?"
}
```

**Expected Response (200):**
```json
{
  "ticket_id": "T-009",
  "case_type": "other",
  "severity": "low",
  "department": "customer_support",
  "agent_summary": "Customer reports a general issue requiring support review.",
  "human_review_required": false,
  "confidence": 0.75
}
```

---

### Test 10: Validation Error — Missing Fields

**Body:**
```json
{
  "ticket_id": "T-010"
}
```

**Expected Response (400):**
```json
{
  "error": true,
  "message": "message is required"
}
```

---

### Test 11: Validation Error — Message Too Short

**Body:**
```json
{
  "ticket_id": "T-011",
  "message": "Hi"
}
```

**Expected Response (400):**
```json
{
  "error": true,
  "message": "message must be at least 3 characters long"
}
```

---

### Test 12: Validation Error — Invalid Channel

**Body:**
```json
{
  "ticket_id": "T-012",
  "message": "Something went wrong with my payment",
  "channel": "invalid_channel"
}
```

**Expected Response (400):**
```json
{
  "error": true,
  "message": "channel must be one of: app, sms, call_center, merchant_portal"
}
```

---

### Test 13: Validation Error — Invalid Locale

**Body:**
```json
{
  "ticket_id": "T-013",
  "message": "I need help with my account",
  "locale": "fr"
}
```

**Expected Response (400):**
```json
{
  "error": true,
  "message": "locale must be one of: en, bn, mixed"
}
```

---

### Test 14: Empty Body

**Body:**
```json
{}
```

**Expected Response (400):**
```json
{
  "error": true,
  "message": "ticket_id is required; message is required"
}
```

---

### Test 15: Route Not Found

| Field | Value |
|-------|-------|
| Method | `GET` |
| URL | `{{base_url}}/nonexistent` |

**Expected Response (404):**
```json
{
  "error": true,
  "message": "Route not found"
}
```

---

## cURL Commands

```bash
# Health check
curl http://localhost:3000/health

# Wrong transfer
curl -X POST http://localhost:3000/sort-ticket \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"T-001","channel":"app","locale":"en","message":"I sent 5000 taka to a wrong number this morning"}'

# Payment failed
curl -X POST http://localhost:3000/sort-ticket \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"T-003","channel":"sms","locale":"en","message":"My payment failed but money was deducted"}'

# Refund request
curl -X POST http://localhost:3000/sort-ticket \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"T-005","channel":"call_center","locale":"en","message":"I want a refund for my last transaction"}'

# Phishing
curl -X POST http://localhost:3000/sort-ticket \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"T-007","channel":"app","locale":"en","message":"Someone called asking for my OTP and verification code"}'

# General
curl -X POST http://localhost:3000/sort-ticket \
  -H "Content-Type: application/json" \
  -d '{"ticket_id":"T-009","channel":"merchant_portal","locale":"en","message":"How do I change my profile picture?"}'
```
