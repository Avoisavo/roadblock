from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
import json
import os

app = FastAPI()

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/v1/chat/completions")
WORKER_API_KEY = os.environ.get("WORKER_API_KEY", "roadblock-secret-key")
MODEL = os.environ.get("MODEL", "qwen2.5:7b")

DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_NAME = os.environ.get("DB_NAME", "roadblock_vector")
DB_USER = os.environ.get("DB_USER", "roadblock")
DB_PASS = os.environ.get("DB_PASS", "roadblock-vector-db-2026")

print("Loading embedding model...")
embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
print("Embedding model loaded.")


def get_db_conn():
    return psycopg2.connect(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )


def store_memory(user_id: str, memory_type: str, text: str, metadata: dict):
    embedding = embedder.encode(text).tolist()
    conn = get_db_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO user_memories (user_id, memory_type, text, embedding, metadata)
                VALUES (%s, %s, %s, array_to_vector(%s, 384, false), %s)
                """,
                (user_id, memory_type, text, embedding, json.dumps(metadata))
            )
        conn.commit()
    finally:
        conn.close()


def retrieve_memories(user_id: str, query_text: str, top_k: int = 5):
    embedding = embedder.encode(query_text).tolist()
    conn = get_db_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                SELECT text, metadata, memory_type, created_at,
                       1 - cosine_distance(embedding, array_to_vector(%s, 384, false)) AS similarity
                FROM user_memories
                WHERE user_id = %s
                ORDER BY cosine_distance(embedding, array_to_vector(%s, 384, false))
                LIMIT %s
                """,
                (embedding, user_id, embedding, top_k)
            )
            return cur.fetchall()
    finally:
        conn.close()


class TransactionRequest(BaseModel):
    user_id: str
    merchant: str
    category: str
    location: str
    time: str
    amount: float


class FeedbackRequest(BaseModel):
    user_id: str
    transaction_merchant: str
    deal_merchant: str
    deal_description: str


class DealResponse(BaseModel):
    intent: str
    timing: str
    deals: list
    message: str


@app.post("/recommend")
async def recommend(req: TransactionRequest, authorization: str = Header(None)):
    if authorization != f"Bearer {WORKER_API_KEY}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    transaction_text = (
        f"User paid RM{req.amount} for {req.category} "
        f"at {req.merchant} in {req.location} at {req.time}"
    )

    store_memory(
        user_id=req.user_id,
        memory_type="transaction",
        text=transaction_text,
        metadata={
            "merchant": req.merchant,
            "category": req.category,
            "location": req.location,
            "amount": req.amount,
            "time": req.time,
        },
    )

    retrieved = retrieve_memories(req.user_id, transaction_text, top_k=5)
    history_text = "\n".join([f"- {r['text']}" for r in retrieved]) if retrieved else "- No relevant history found."

    prompt = f"""You are an AI deal recommendation engine for TnG eWallet.

CURRENT TRANSACTION:
- Merchant: {req.merchant}
- Category: {req.category}
- Location: {req.location}
- Time: {req.time}
- Amount: RM{req.amount}

RELEVANT USER HISTORY:
{history_text}

Based on the current transaction and relevant user history:
1. What does the user likely need next? (intent)
2. Should the deals appear DURING payment or AFTER payment?
3. Recommend the 2–3 best matching deals.
4. Write a friendly, personalised message

Return ONLY valid JSON:
{{
  "intent": "...",
  "timing": "during_payment" or "after_payment",
  "deals": [
    {{ "merchant": "...", "deal": "..." }},
    {{ "merchant": "...", "deal": "..." }}
  ],
  "message": "..."
}}"""

    try:
        result = call_ollama(prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")


@app.post("/feedback")
async def feedback(req: FeedbackRequest, authorization: str = Header(None)):
    if authorization != f"Bearer {WORKER_API_KEY}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    text = (
        f"User accepted {req.deal_description} from {req.deal_merchant} "
        f"after visiting {req.transaction_merchant}"
    )

    store_memory(
        user_id=req.user_id,
        memory_type="accepted_deal",
        text=text,
        metadata={
            "deal_merchant": req.deal_merchant,
            "deal_description": req.deal_description,
            "transaction_merchant": req.transaction_merchant,
        },
    )
    return {"status": "stored"}


@app.get("/health")
async def health():
    db_ok = False
    try:
        conn = get_db_conn()
        conn.cursor().execute("SELECT 1")
        conn.close()
        db_ok = True
    except Exception:
        db_ok = False

    return {
        "status": "ok",
        "model": MODEL,
        "vector_db": "connected" if db_ok else "disconnected",
    }


def call_ollama(prompt: str) -> dict:
    resp = requests.post(
        OLLAMA_URL,
        headers={"Content-Type": "application/json"},
        json={
            "model": MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": "You are a deal recommendation AI. Always respond with valid JSON only.",
                },
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

    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    return json.loads(text)
