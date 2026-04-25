# Alibaba Cloud Worker API Setup Guide

## Overview

You are building the AI Worker API on Alibaba Cloud. The AWS side (Next.js + PostgreSQL) is already done. Your job is to:

1. Receive transaction context from AWS via HTTP POST
2. Call Qwen LLM for intent detection + deal matching
3. Return multiple deal recommendations back to AWS

## Architecture

```
AWS (already done)                          Alibaba Cloud (your job)
┌─────────────────────┐                    ┌──────────────────────────────┐
│ Next.js on EC2      │                    │  Worker API (FastAPI)        │
│                     │  POST /recommend   │                              │
│ /api/recommend ─────┼───────────────────►│  1. Receive transaction data │
│                     │                    │  2. Call Qwen LLM            │
│                     │   JSON response    │  3. Return intent + deals    │
│                     │◄───────────────────┤                              │
└─────────────────────┘                    └──────────────────────────────┘
```

---

## Two Scenarios

### Scenario 1: Dining (during_payment)

User pays for dinner at KFC Pavilion. LLM recommends nearby food/drinks to enjoy RIGHT NOW.

### Scenario 2: Travel (after_payment)

User buys a flight ticket. LLM recommends travel deals to plan LATER (hotel, eSIM, transport).

---

## What AWS Sends to You

AWS will send a POST request to your endpoint with this JSON body:

### Scenario 1 Example (Dining):

```json
{
  "merchant": "KFC",
  "category": "dining",
  "location": "Pavilion KL",
  "time": "2026-04-25T19:30:00.000Z",
  "amount": 25.90,
  "latitude": 3.1488,
  "longitude": 101.7131,
  "payment_status": "completed",
  "user_behavior": {
    "total_transactions": 15,
    "category_frequency": {
      "dining": 8,
      "dessert": 5,
      "transport": 2
    },
    "merchant_frequency": {
      "KFC": 3,
      "Tealive": 4,
      "Llaollao": 2,
      "Starbucks": 1
    },
    "recent_transactions": [
      {
        "merchant": "Tealive",
        "category": "dessert",
        "location": "Pavilion KL",
        "amount": 12.90,
        "latitude": 3.1488,
        "longitude": 101.7131,
        "payment_status": "completed",
        "created_at": "2026-04-23T20:15:00.000Z"
      },
      {
        "merchant": "KFC",
        "category": "dining",
        "location": "Pavilion KL",
        "amount": 22.00,
        "latitude": 3.1488,
        "longitude": 101.7131,
        "payment_status": "completed",
        "created_at": "2026-04-20T19:00:00.000Z"
      }
    ]
  }
}
```

### Scenario 2 Example (Travel):

```json
{
  "merchant": "AirAsia",
  "category": "travel",
  "location": "Online",
  "time": "2026-04-25T14:00:00.000Z",
  "amount": 450.00,
  "latitude": null,
  "longitude": null,
  "payment_status": "completed",
  "user_behavior": {
    "total_transactions": 12,
    "category_frequency": {
      "travel": 3,
      "dining": 6,
      "transport": 3
    },
    "merchant_frequency": {
      "AirAsia": 2,
      "Grab": 3,
      "Agoda": 1
    },
    "recent_transactions": [
      {
        "merchant": "AirAsia",
        "category": "travel",
        "location": "Online",
        "amount": 380.00,
        "latitude": null,
        "longitude": null,
        "payment_status": "completed",
        "created_at": "2026-03-10T10:00:00.000Z"
      }
    ]
  }
}
```

### Field Descriptions (Input)

| Field | Type | Description |
|---|---|---|
| `merchant` | string | Where the user is paying (e.g. "KFC", "AirAsia") |
| `category` | string | Type of purchase: "dining", "travel", "transport", "groceries", "shopping", etc. |
| `location` | string | Where the payment happened (e.g. "Pavilion KL", "Online") |
| `time` | string | When the payment happened (ISO format) |
| `amount` | float | How much they paid (in RM) |
| `latitude` | float/null | GPS latitude (null if online purchase) |
| `longitude` | float/null | GPS longitude (null if online purchase) |
| `payment_status` | string | "completed" |
| `user_behavior.total_transactions` | int | How many transactions this user has made |
| `user_behavior.category_frequency` | object | How often the user buys in each category |
| `user_behavior.merchant_frequency` | object | How often the user visits each merchant |
| `user_behavior.recent_transactions` | array | Last 10 transactions with full details |

---

## What You Must Return

Your API must return **multiple deals** (up to 3) in this format:

### Scenario 1 Response (Dining → nearby food/drink deals):

```json
{
  "intent": "post_meal_drink",
  "timing": "during_payment",
  "deals": [
    {
      "merchant": "Tealive",
      "description": "Buy 1 Free 1 on any large drink",
      "discount": "Buy 1 Free 1",
      "location": "Pavilion KL, Level 1",
      "category": "beverage"
    },
    {
      "merchant": "Baskin Robbins",
      "description": "31% off double scoop ice cream",
      "discount": "31% off",
      "location": "Pavilion KL, Level G",
      "category": "dessert"
    },
    {
      "merchant": "Starbucks",
      "description": "RM5 off any Frappuccino after 6pm",
      "discount": "RM5 off",
      "location": "Pavilion KL, Level 2",
      "category": "beverage"
    }
  ],
  "message": "Just finished your meal? Here are some treats nearby!"
}
```

### Scenario 2 Response (Travel → travel planning deals):

```json
{
  "intent": "travel_preparation",
  "timing": "after_payment",
  "deals": [
    {
      "merchant": "Agoda",
      "description": "Up to 40% off hotels at your destination",
      "discount": "Up to 40% off",
      "location": "Online",
      "category": "hotel"
    },
    {
      "merchant": "Klook",
      "description": "eSIM data plan from RM15 - stay connected abroad",
      "discount": "From RM15",
      "location": "Online",
      "category": "esim"
    },
    {
      "merchant": "Grab",
      "description": "Pre-book airport transfer at 20% off",
      "discount": "20% off",
      "location": "Destination airport",
      "category": "transport"
    }
  ],
  "message": "Planning your trip? Here are deals to get you sorted."
}
```

### Field Descriptions (Output)

| Field | Type | Description |
|---|---|---|
| `intent` | string | What the user likely wants next (e.g. "post_meal_drink", "travel_preparation") |
| `timing` | string | `"during_payment"` or `"after_payment"` |
| `deals` | array | Array of 1-3 recommended deals |
| `deals[].merchant` | string | The merchant offering the deal |
| `deals[].description` | string | What the deal is |
| `deals[].discount` | string | The discount amount/type |
| `deals[].location` | string | Where to redeem (or "Online") |
| `deals[].category` | string | Deal category (e.g. "beverage", "dessert", "hotel", "esim", "transport") |
| `message` | string | Friendly user-facing message to show with the deals |

### Timing Rules

| Scenario | Timing | Why |
|---|---|---|
| Dining at a restaurant | `during_payment` | Impulse buy — user is at the location, show nearby treats NOW |
| Buying groceries | `during_payment` | Routine purchase — show cashback/voucher NOW |
| Flight ticket purchase | `after_payment` | Needs planning — hotel, eSIM, transport are big decisions |
| Online shopping | `after_payment` | User is browsing, not at a physical location |

### How to decide timing:

- Look at `category` and `location`
- If user is **physically at a location** (latitude/longitude present) + category is **dining/groceries/shopping** → `during_payment`
- If category is **travel/online** or the purchase is **high-value** (>RM100) → `after_payment`
- Use `user_behavior.category_frequency` to see what the user usually does after this type of purchase

---

## Updated Worker Code

Update your `main.py` to handle the new format:

```python
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
import requests
import json
import os

app = FastAPI()

DASHSCOPE_API_KEY = os.environ.get("DASHSCOPE_API_KEY")
WORKER_API_KEY = os.environ.get("WORKER_API_KEY", "your-secret-key-here")

# --- Request Model ---

class UserBehavior(BaseModel):
    total_transactions: int
    category_frequency: dict
    merchant_frequency: dict
    recent_transactions: list

class TransactionContext(BaseModel):
    merchant: str
    category: str
    location: str
    time: str
    amount: float
    latitude: float = None
    longitude: float = None
    payment_status: str = "completed"
    user_behavior: UserBehavior

# --- Main Endpoint ---

@app.post("/recommend")
async def recommend(ctx: TransactionContext, authorization: str = Header(None)):
    # Verify API key
    if authorization != f"Bearer {WORKER_API_KEY}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Build prompt for Qwen LLM
    prompt = f"""You are an AI deal recommendation engine for TnG eWallet in Malaysia.

CURRENT TRANSACTION:
- Merchant: {ctx.merchant}
- Category: {ctx.category}
- Location: {ctx.location}
- Time: {ctx.time}
- Amount: RM{ctx.amount}
- GPS: lat={ctx.latitude}, lng={ctx.longitude}

USER BEHAVIOR:
- Total past transactions: {ctx.user_behavior.total_transactions}
- Category frequency: {json.dumps(ctx.user_behavior.category_frequency)}
- Merchant frequency: {json.dumps(ctx.user_behavior.merchant_frequency)}
- Recent transactions: {json.dumps(ctx.user_behavior.recent_transactions[-5:], indent=2)}

RULES:
1. If the user is dining/shopping at a physical location → timing = "during_payment", recommend nearby food/drinks/desserts (up to 3 deals)
2. If the user is booking travel (flights, etc.) → timing = "after_payment", recommend travel deals like hotels, eSIM, transport (up to 3 deals)
3. Use the user's behavior patterns to personalize. If they frequently visit Tealive, prioritize Tealive deals.
4. Deals must be relevant to the location and context.

Return ONLY valid JSON:
{{
  "intent": "short_intent_name",
  "timing": "during_payment" or "after_payment",
  "deals": [
    {{
      "merchant": "merchant name",
      "description": "deal description",
      "discount": "discount amount",
      "location": "where to redeem",
      "category": "deal category"
    }}
  ],
  "message": "friendly user-facing message"
}}

Return 2-3 deals. No markdown, no explanation, ONLY the JSON."""

    result = call_qwen(prompt)
    return result


def call_qwen(prompt: str) -> dict:
    """Call Qwen LLM via DashScope API"""
    resp = requests.post(
        "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {DASHSCOPE_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "qwen-max",
            "messages": [
                {"role": "system", "content": "You are a deal recommendation AI for TnG eWallet. Always respond with valid JSON only. No markdown."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
        },
    )

    data = resp.json()
    text = data["choices"][0]["message"]["content"]

    # Clean up response
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
    if text.endswith("```"):
        text = text.rsplit("```", 1)[0]
    text = text.strip()

    return json.loads(text)


# --- Health Check ---

@app.get("/health")
async def health():
    return {"status": "ok"}
```

---

## Test Commands

### Test Scenario 1 (Dining):

```bash
curl -X POST http://YOUR_ALIBABA_ECS_IP:8000/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-key-here" \
  -d '{
    "merchant": "KFC",
    "category": "dining",
    "location": "Pavilion KL",
    "time": "2026-04-25T19:30:00.000Z",
    "amount": 25.90,
    "latitude": 3.1488,
    "longitude": 101.7131,
    "payment_status": "completed",
    "user_behavior": {
      "total_transactions": 15,
      "category_frequency": {"dining": 8, "dessert": 5, "transport": 2},
      "merchant_frequency": {"KFC": 3, "Tealive": 4, "Llaollao": 2},
      "recent_transactions": [
        {"merchant": "Tealive", "category": "dessert", "location": "Pavilion KL", "amount": 12.90, "created_at": "2026-04-23T20:15:00.000Z"}
      ]
    }
  }'
```

### Test Scenario 2 (Travel):

```bash
curl -X POST http://YOUR_ALIBABA_ECS_IP:8000/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-key-here" \
  -d '{
    "merchant": "AirAsia",
    "category": "travel",
    "location": "Online",
    "time": "2026-04-25T14:00:00.000Z",
    "amount": 450.00,
    "latitude": null,
    "longitude": null,
    "payment_status": "completed",
    "user_behavior": {
      "total_transactions": 12,
      "category_frequency": {"travel": 3, "dining": 6, "transport": 3},
      "merchant_frequency": {"AirAsia": 2, "Grab": 3, "Agoda": 1},
      "recent_transactions": [
        {"merchant": "AirAsia", "category": "travel", "location": "Online", "amount": 380.00, "created_at": "2026-03-10T10:00:00.000Z"}
      ]
    }
  }'
```

---

## Security Notes

- The WORKER_API_KEY protects your endpoint so only the AWS EC2 can call it
- For production, add the EC2's IP (43.216.11.10) to the Alibaba security group whitelist
- Always use HTTPS in production

## DashScope Models

| Model | Best for | Cost |
|---|---|---|
| qwen-max | Highest quality, complex reasoning | Higher |
| qwen-plus | Good balance of quality and speed | Medium |
| qwen-turbo | Fastest, cheapest | Lower |

For the hackathon, start with `qwen-max` for best results.