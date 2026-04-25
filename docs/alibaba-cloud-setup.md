# Alibaba Cloud Worker API Setup Guide

## Overview

You are building the AI Worker API on Alibaba Cloud. The AWS side (Next.js + PostgreSQL) is already done. Your job is to:

1. Receive transaction context from AWS via HTTP POST
2. Generate embeddings for the transaction
3. Call Qwen LLM for intent detection + deal matching
4. Return the result back to AWS

## Architecture

```
AWS (already done)                          Alibaba Cloud (your job)
┌─────────────────────┐                    ┌──────────────────────────────┐
│ Next.js on EC2      │                    │  Worker API (FastAPI)        │
│                     │  POST /recommend   │                              │
│ /api/recommend ─────┼───────────────────►│  1. Receive transaction data │
│                     │                    │  2. Generate embeddings      │
│                     │   JSON response    │  3. Call Qwen LLM            │
│                     │◄───────────────────┤  4. Return intent + deal     │
└─────────────────────┘                    └──────────────────────────────┘
```

## What AWS Sends to You

AWS will send a POST request to your endpoint with this JSON body:

```json
{
  "merchant": "Sushi Zanmai",
  "category": "dining",
  "location": "Mid Valley Megamall",
  "time": "2026-04-25T19:30:00.000Z",
  "amount": 45.00,
  "user_history": [
    {
      "merchant": "Llaollao",
      "category": "dessert",
      "location": "Mid Valley Megamall",
      "amount": 15.00,
      "created_at": "2026-04-20T20:00:00.000Z"
    },
    {
      "merchant": "Sushi Zanmai",
      "category": "dining",
      "location": "Mid Valley Megamall",
      "amount": 42.00,
      "created_at": "2026-04-15T19:15:00.000Z"
    }
  ]
}
```

## What You Must Return

Your API must return this JSON format:

```json
{
  "intent": "dessert_craving",
  "timing": "during_payment",
  "deal": {
    "merchant": "Llaollao",
    "description": "20% off any medium or large tub",
    "discount": "20%",
    "location": "Mid Valley Megamall, LG Floor"
  },
  "message": "Craving dessert? Here's 20% off Llaollao - just around the corner!"
}
```

### Field Descriptions

| Field | Type | Description |
|---|---|---|
| `intent` | string | What the user likely wants next (e.g. "dessert_craving", "travel_prep", "grocery_routine") |
| `timing` | string | Either `"during_payment"` (impulse buys) or `"after_payment"` (needs thought) |
| `deal` | object | The recommended deal — merchant name, description, discount, location |
| `message` | string | User-facing message to display with the deal |

### Timing Rules (from the README)

- **during_payment**: Low-consideration, impulse-friendly deals. User is at the location. (e.g. dessert voucher while paying for dinner)
- **after_payment**: High-consideration decisions that need thought. (e.g. hotel booking after buying a flight ticket)

---

## Step-by-Step Setup

### Step 1: Create Alibaba Cloud Account

- Go to alibabacloud.com and create an account
- Enable DashScope (Alibaba's AI API) at dashscope.console.aliyun.com
- Get your DashScope API key

### Step 2: Choose Deployment Method

**Option A: ECS Instance (Recommended for hackathon — simpler)**

- Launch an ECS instance (ecs.t6-c1m1.large or similar)
- Region: Pick one close to ap-southeast (e.g. Singapore or Malaysia)
- OS: Ubuntu 22.04
- Open ports: 22 (SSH), 8000 (API)

**Option B: Function Compute (Serverless)**

- No server to manage
- Auto-scales
- More complex to set up

### Step 3: Build the Worker API

SSH into your ECS instance and set up:

```bash
# Install Python
sudo apt update && sudo apt install -y python3 python3-pip python3-venv

# Create project
mkdir -p /home/ubuntu/worker && cd /home/ubuntu/worker
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn requests
```

Create the worker API file:

```bash
nano /home/ubuntu/worker/main.py
```

Paste this code:

```python
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
import requests
import json
import os

app = FastAPI()

DASHSCOPE_API_KEY = os.environ.get("DASHSCOPE_API_KEY")
WORKER_API_KEY = os.environ.get("WORKER_API_KEY", "your-secret-key-here")

# --- Request/Response Models ---

class TransactionContext(BaseModel):
    merchant: str
    category: str
    location: str
    time: str
    amount: float
    user_history: list

class DealResponse(BaseModel):
    intent: str
    timing: str
    deal: dict
    message: str

# --- Main Endpoint ---

@app.post("/recommend")
async def recommend(ctx: TransactionContext, authorization: str = Header(None)):
    # Verify API key
    if authorization != f"Bearer {WORKER_API_KEY}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    # Build prompt for Qwen LLM
    history_text = json.dumps(ctx.user_history[-10:], indent=2)

    prompt = f"""You are an AI deal recommendation engine for TnG eWallet.

Given this transaction:
- Merchant: {ctx.merchant}
- Category: {ctx.category}
- Location: {ctx.location}
- Time: {ctx.time}
- Amount: RM{ctx.amount}

User's recent transaction history:
{history_text}

Based on the transaction context and user history, determine:
1. What the user likely needs next (intent)
2. Whether to show a deal DURING payment or AFTER payment:
   - DURING: impulse-friendly, low-consideration, user is at location (e.g. dessert after dinner)
   - AFTER: needs thought, high-consideration (e.g. hotel after flight booking)
3. The best matching deal to recommend

Return ONLY valid JSON with these exact fields:
{{
  "intent": "short_intent_name",
  "timing": "during_payment" or "after_payment",
  "deal": {{
    "merchant": "merchant name",
    "description": "deal description",
    "discount": "discount amount",
    "location": "deal location"
  }},
  "message": "friendly user-facing message"
}}"""

    # Call Qwen LLM via DashScope
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
                {"role": "system", "content": "You are a deal recommendation AI. Always respond with valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
        },
    )

    data = resp.json()
    text = data["choices"][0]["message"]["content"]

    # Clean up response — remove markdown code blocks if present
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

### Step 4: Run the Worker

```bash
cd /home/ubuntu/worker
source venv/bin/activate

# Set environment variables
export DASHSCOPE_API_KEY="your-dashscope-api-key"
export WORKER_API_KEY="your-secret-key-here"

# Run the API server
uvicorn main:app --host 0.0.0.0 --port 8000
```

To keep it running permanently (like PM2 on AWS):

```bash
# Install supervisor or use nohup
nohup uvicorn main:app --host 0.0.0.0 --port 8000 &
```

Or install PM2 equivalent for Python:

```bash
pip install gunicorn
nohup gunicorn main:app -w 2 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 &
```

### Step 5: Test the Worker

From your local machine or EC2:

```bash
curl -X POST http://YOUR_ALIBABA_ECS_IP:8000/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-key-here" \
  -d '{
    "merchant": "Sushi Zanmai",
    "category": "dining",
    "location": "Mid Valley Megamall",
    "time": "2026-04-25T19:30:00.000Z",
    "amount": 45.00,
    "user_history": [
      {"merchant": "Llaollao", "category": "dessert", "location": "Mid Valley Megamall", "amount": 15.00, "created_at": "2026-04-20T20:00:00.000Z"}
    ]
  }'
```

You should get back a JSON response with intent, timing, deal, and message.

### Step 6: Give These Values to the AWS Person

Once your worker is running, share these two values:

1. **ALIBABA_WORKER_URL**: `http://YOUR_ALIBABA_ECS_IP:8000/recommend`
2. **ALIBABA_API_KEY**: The WORKER_API_KEY you set (e.g. `your-secret-key-here`)

They will put these in the AWS .env.local file to connect the two clouds.

---

## Security Notes

- The WORKER_API_KEY protects your endpoint so only your AWS EC2 can call it
- For production, add your EC2's IP to the Alibaba security group whitelist
- Always use HTTPS in production (set up SSL with certbot or Alibaba's ALB)

## DashScope Models Available

| Model | Best for | Cost |
|---|---|---|
| qwen-max | Highest quality, complex reasoning | Higher |
| qwen-plus | Good balance of quality and speed | Medium |
| qwen-turbo | Fastest, cheapest | Lower |

For the hackathon, start with `qwen-max` for best results. Switch to `qwen-turbo` if you need speed.

## Embedding (Optional Enhancement)

If you want to add vector similarity search for better deal matching:

```python
def get_embedding(text: str) -> list:
    """Generate embedding using DashScope"""
    resp = requests.post(
        "https://dashscope.aliyuncs.com/compatible-mode/v1/embeddings",
        headers={
            "Authorization": f"Bearer {DASHSCOPE_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "text-embedding-v3",
            "input": text,
        },
    )
    return resp.json()["data"][0]["embedding"]
```

This can be used to match transaction context against a database of known deal categories for more accurate recommendations.
