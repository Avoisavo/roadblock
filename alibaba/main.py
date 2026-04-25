from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
import requests
import json
import os
import re

app = FastAPI()

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/v1/chat/completions")
WORKER_API_KEY = os.environ.get("WORKER_API_KEY", "roadblock-secret-key")
MODEL = os.environ.get("MODEL", "qwen2.5:7b")


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


class DealResponse(BaseModel):
    intent: str
    timing: str
    deals: list
    message: str


@app.post("/recommend")
async def recommend(ctx: TransactionContext, authorization: str = Header(None)):
    if authorization != f"Bearer {WORKER_API_KEY}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    recent_text = json.dumps(ctx.user_behavior.recent_transactions[-5:], indent=2)

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
- Recent transactions: {recent_text}

RULES:
1. If the user is dining/shopping at a physical location → timing = "during_payment", recommend nearby food/drinks/desserts (up to 3 deals)
2. If the user is booking travel (flights, etc.) → timing = "after_payment", recommend travel deals like hotels, eSIM, transport (up to 3 deals)
3. Use the user's behavior patterns to personalize. If they frequently visit a merchant, prioritize deals from that merchant.
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

    try:
        result = call_ollama(prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")


def call_ollama(prompt: str) -> dict:
    resp = requests.post(
        OLLAMA_URL,
        headers={"Content-Type": "application/json"},
        json={
            "model": MODEL,
            "messages": [
                {"role": "system", "content": "You are a deal recommendation AI. Always respond with valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.7,
            "stream": False,
        },
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()
    text = data["choices"][0]["message"]["content"]

    # Clean up markdown code blocks
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    return json.loads(text)


@app.get("/health")
async def health():
    return {"status": "ok", "model": MODEL}
