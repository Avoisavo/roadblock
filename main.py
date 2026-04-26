from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import psycopg2
from psycopg2.extras import RealDictCursor
import requests
import json
import os
import logging
import hmac
import hashlib
import base64
import threading
import time
import asyncio
from datetime import datetime, timezone

import httpx

app = FastAPI()

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/v1/chat/completions")
WORKER_API_KEY = os.environ.get("WORKER_API_KEY", "roadblock-secret-key")
MODEL = os.environ.get("MODEL", "qwen2.5:7b")

DB_HOST = os.environ.get("DB_HOST", "localhost")
DB_NAME = os.environ.get("DB_NAME", "roadblock_vector")
DB_USER = os.environ.get("DB_USER", "roadblock")
DB_PASS = os.environ.get("DB_PASS", "roadblock-vector-db-2026")

ROCKETMQ_ENDPOINT = os.environ.get("ROCKETMQ_ENDPOINT")
ROCKETMQ_INSTANCE_ID = os.environ.get("ROCKETMQ_INSTANCE_ID")
ROCKETMQ_ACCESS_KEY = os.environ.get("ROCKETMQ_ACCESS_KEY")
ROCKETMQ_SECRET_KEY = os.environ.get("ROCKETMQ_SECRET_KEY")
ROCKETMQ_TOPIC = os.environ.get("ROCKETMQ_TOPIC", "transaction-events")
ROCKETMQ_GROUP = os.environ.get("ROCKETMQ_GROUP", "flow-a-enrichment")
ROCKETMQ_POLL_INTERVAL = float(os.environ.get("ROCKETMQ_POLL_INTERVAL", "1.0"))

ROCKETMQ_ENABLED = all([ROCKETMQ_ENDPOINT, ROCKETMQ_INSTANCE_ID, ROCKETMQ_ACCESS_KEY, ROCKETMQ_SECRET_KEY])

if not ROCKETMQ_ENABLED:
    logging.warning("RocketMQ is not configured. Set ROCKETMQ_ENDPOINT, ROCKETMQ_INSTANCE_ID, ROCKETMQ_ACCESS_KEY, ROCKETMQ_SECRET_KEY to enable.")

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


class RocketMQHttpClient:
    def __init__(self, endpoint: str, instance_id: str, access_key: str, secret_key: str, topic: str, group: str):
        self.endpoint = endpoint.rstrip("/")
        self.instance_id = instance_id
        self.access_key = access_key
        self.secret_key = secret_key
        self.topic = topic
        self.group = group
        self.client = httpx.Client(timeout=30)

    def _sign(self, method: str, uri: str, body: bytes = None) -> dict:
        date = datetime.now(timezone.utc).strftime("%a, %d %b %Y %H:%M:%S GMT")
        headers = {"Date": date}

        content_md5 = ""
        content_type = ""
        if body:
            content_type = "application/json"
            headers["Content-Type"] = content_type
            content_md5 = base64.b64encode(hashlib.md5(body).digest()).decode("utf-8")
            headers["Content-MD5"] = content_md5

        canonicalized_headers = ""
        mq_headers = {k.lower(): v for k, v in headers.items() if k.lower().startswith("x-mq-")}
        for key in sorted(mq_headers.keys()):
            canonicalized_headers += f"{key}:{mq_headers[key]}\n"

        canonicalized_resource = uri

        string_to_sign = f"{method}\n{content_md5}\n{content_type}\n{date}\n{canonicalized_headers}{canonicalized_resource}"

        signature = base64.b64encode(
            hmac.new(self.secret_key.encode("utf-8"), string_to_sign.encode("utf-8"), hashlib.sha1).digest()
        ).decode("utf-8")

        headers["Authorization"] = f"MQ {self.access_key}:{signature}"
        return headers

    def send_message(self, message_body: str, tag: str = "transaction") -> str:
        uri = f"/topics/{self.topic}/messages"
        url = f"{self.endpoint}{uri}"

        payload = {
            "MessageBody": base64.b64encode(message_body.encode("utf-8")).decode("utf-8"),
            "MessageTag": tag,
        }
        body = json.dumps(payload).encode("utf-8")
        headers = self._sign("POST", uri, body)
        headers["Content-Type"] = "application/json"

        resp = self.client.post(url, headers=headers, content=body)
        resp.raise_for_status()
        data = resp.json()
        return data.get("MessageId", "unknown")

    def consume_messages(self, num: int = 1, wait_seconds: int = 1) -> list:
        uri = f"/topics/{self.topic}/messages?groupId={self.group}&numOfMessages={num}&waitSeconds={wait_seconds}"
        url = f"{self.endpoint}{uri}"
        headers = self._sign("GET", uri)

        resp = self.client.get(url, headers=headers)
        if resp.status_code == 204:
            return []
        resp.raise_for_status()
        return resp.json()

    def ack_message(self, receipt_handle: str) -> None:
        uri = f"/topics/{self.topic}/messages?groupId={self.group}&receiptHandle={receipt_handle}"
        url = f"{self.endpoint}{uri}"
        headers = self._sign("DELETE", uri)

        resp = self.client.delete(url, headers=headers)
        resp.raise_for_status()

    def close(self):
        self.client.close()


mq_client: RocketMQHttpClient = None
consumer_running = False
consumer_thread: threading.Thread = None


def enrich_transaction(payload: dict):
    transaction_text = (
        f"User paid RM{payload['amount']} for {payload['category']} "
        f"at {payload['merchant']} in {payload['location']} at {payload['time']}"
    )
    store_memory(
        user_id=payload["user_id"],
        memory_type="transaction",
        text=transaction_text,
        metadata={
            "merchant": payload["merchant"],
            "category": payload["category"],
            "location": payload["location"],
            "amount": payload["amount"],
            "time": payload["time"],
        },
    )
    logging.info(f"Enriched transaction for user {payload['user_id']}")


def run_consumer():
    global consumer_running, mq_client
    if not mq_client:
        return
    logging.info("RocketMQ consumer started.")
    while consumer_running:
        try:
            messages = mq_client.consume_messages(num=1, wait_seconds=1)
            for msg in messages:
                try:
                    body = base64.b64decode(msg.get("MessageBody", "")).decode("utf-8")
                    payload = json.loads(body)
                    enrich_transaction(payload)
                    mq_client.ack_message(msg.get("ReceiptHandle"))
                except Exception as e:
                    logging.error(f"Failed to process message {msg.get('MessageId', 'unknown')}: {e}")
        except Exception as e:
            logging.error(f"Consumer poll error: {e}")
        time.sleep(ROCKETMQ_POLL_INTERVAL)
    logging.info("RocketMQ consumer stopped.")


@app.on_event("startup")
async def startup_event():
    global mq_client, consumer_running, consumer_thread
    if ROCKETMQ_ENABLED:
        mq_client = RocketMQHttpClient(
            endpoint=ROCKETMQ_ENDPOINT,
            instance_id=ROCKETMQ_INSTANCE_ID,
            access_key=ROCKETMQ_ACCESS_KEY,
            secret_key=ROCKETMQ_SECRET_KEY,
            topic=ROCKETMQ_TOPIC,
            group=ROCKETMQ_GROUP,
        )
        consumer_running = True
        consumer_thread = threading.Thread(target=run_consumer, daemon=True)
        consumer_thread.start()


@app.on_event("shutdown")
async def shutdown_event():
    global consumer_running, consumer_thread, mq_client
    consumer_running = False
    if consumer_thread:
        consumer_thread.join(timeout=5.0)
    if mq_client:
        mq_client.close()
        mq_client = None


@app.post("/ingest")
async def ingest(req: TransactionRequest, authorization: str = Header(None)):
    if authorization != f"Bearer {WORKER_API_KEY}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not ROCKETMQ_ENABLED or not mq_client:
        raise HTTPException(status_code=503, detail="RocketMQ is not configured")

    payload = {
        "user_id": req.user_id,
        "merchant": req.merchant,
        "category": req.category,
        "location": req.location,
        "time": req.time,
        "amount": req.amount,
    }

    try:
        message_id = await asyncio.to_thread(
            mq_client.send_message,
            json.dumps(payload),
            tag="transaction"
        )
        return {"status": "queued", "message_id": message_id}
    except Exception as e:
        logging.error(f"Failed to publish to RocketMQ: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to queue message: {str(e)}")


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

    mq_ok = "disabled"
    if ROCKETMQ_ENABLED and mq_client:
        mq_ok = "connected"

    return {
        "status": "ok",
        "model": MODEL,
        "vector_db": "connected" if db_ok else "disconnected",
        "rocketmq": mq_ok,
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
