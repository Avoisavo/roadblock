# Alibaba Cloud Infrastructure & AI Layer

## Project Context

This document explains the Alibaba Cloud infrastructure powering the AI Inference Layer for the **AI-Powered Miniapp Intelligence Layer** project. The system analyzes transaction data in real-time, detects user intent using LLMs, and surfaces relevant miniapps at the exact moment they are needed.

---

## Architecture Overview

We operate a **dual-cloud architecture**:

| Layer | Cloud Provider | Services | Responsibility |
|---|---|---|---|
| **Web Frontend & Data** | AWS | EC2, RDS, Redis | Hosts Next.js UI, transactional data, caching |
| **AI Inference** | Alibaba Cloud | ECS, VPC, Ollama, AnalyticDB (PostgreSQL + fastann) | Runs Qwen 2.5 7B + managed vector DB for RAG-powered personalisation |
| **Load Balancing** | Alibaba Cloud | CLB | Load balances and health-checks the FastAPI inference API |

**Why two clouds?** We deliberately separated the fast, reliable web tier (AWS) from the GPU-intensive AI inference tier (Alibaba Cloud). This is a real-world pattern called **workload-specific cloud selection** — using the best provider for each job instead of forcing everything onto one platform.

---

## Alibaba Cloud Services Used

### 1. Elastic Compute Service (ECS)
- **Instance ID**: `i-t4n0nrf0t6q3d88gkwil`
- **Type**: `ecs.gn6i-c4g1.xlarge`
- **Specs**: 4 vCPU, 15 GiB RAM, 1x NVIDIA T4 GPU (15 GiB VRAM)
- **Region/Zone**: `ap-southeast-1b` (Singapore)
- **Billing**: PostPaid (Pay-As-You-Go)
- **Purpose**: Hosts Ollama inference and FastAPI worker. Connects to managed AnalyticDB for vector storage.

### 2. Virtual Private Cloud (VPC)
- **VPC ID**: `vpc-t4nv2zp41j3mxg9opsmk0`
- **CIDR**: `172.16.0.0/16`
- **Purpose**: Isolated network for the AI inference tier. Keeps model traffic separate from public internet exposure.

### 3. VSwitch (Subnet)
- **VSwitch ID**: `vsw-t4n1gew83b1mp05dk9i1l`
- **Zone**: `ap-southeast-1b`
- **CIDR**: `172.16.0.0/24`
- **Purpose**: Subnet within the VPC where the GPU instance lives.

### 4. Security Group
- **Security Group ID**: `sg-t4n5t0fcr5bz53c6tfia`
- **Rules**:
  - Port 22 (SSH) — admin access
  - Port 8000 — FastAPI Worker (restricted to CLB/VPC-internal; previously public)
  - Port 11434 — Ollama (internal; ideally should be restricted to localhost-only)
- **Purpose**: Firewall controlling inbound access to the inference server.

### 5. Key Pair
- **Name**: `roadblock-key`
- **Purpose**: SSH authentication for secure server administration.

### 6. Ollama (Self-Hosted on ECS)
- **Model**: `qwen2.5:7b`
- **Internal URL**: `http://localhost:11434` (called only by the FastAPI worker)
- **Endpoints**:
  - `/api/generate` — Ollama native API
  - `/v1/chat/completions` — OpenAI-compatible API
- **Purpose**: Serves the Qwen LLM for intent detection, recommendation generation, and context understanding.

### 7. FastAPI Worker (Self-Hosted on ECS)
- **Public URL**: `http://<CLB-IP>:80` (via Classic Load Balancer `lb-gs5720gqt7zv3fhjzddux`; direct access at `http://47.237.195.58:8000` reserved for diagnostics)
- **Systemd Service**: `roadblock-worker` (auto-starts on boot)
- **Endpoints**:
  - `POST /recommend` — Receives raw transaction, stores embedding, retrieves user history, returns recommendation
  - `POST /feedback` — Stores accepted deal for future retrieval
  - `GET /health` — Health check
- **Auth**: Bearer token (`WORKER_API_KEY`)
- **Purpose**: Public-facing API gateway. Handles embedding generation, vector DB retrieval, prompt building, and LLM calling.

### 8. AnalyticDB for PostgreSQL (Managed Alibaba Cloud Service)
- **Instance ID**: `gp-gs5z5ss81655h9ce1`
- **Internal Endpoint**: `gp-gs5z5ss81655h9ce1-master.gpdbmaster.singapore.rds.aliyuncs.com`
- **Port**: `5432`
- **Database**: `roadblock_vector`
- **Vector Engine**: `fastann` (Alibaba Cloud's native approximate-nearest-neighbor extension)
- **Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2` (384-dim vectors)
- **Purpose**: Managed vector database that stores user transaction and deal-acceptance history as searchable vectors. Enables RAG-based personalisation at scale without fine-tuning.
- **Why fastann over pgvector**: AnalyticDB uses Alibaba Cloud's proprietary `fastann` vector engine — optimized for distributed ANN search across segment nodes, not available in open-source PostgreSQL.

### 9. Classic Load Balancer (CLB)
- **LoadBalancerId**: `lb-gs5720gqt7zv3fhjzddux`
- **Address**: `172.16.0.160` (VPC private IP; public IP may be mapped separately via Alibaba Cloud console)
- **Listener**: HTTP port 80 → backend port 8000
- **Health Check**:
  - Protocol: GET `/health`
  - Expected HTTP status: 2xx
  - Timeout: 5s
  - Interval: 2s
  - Healthy threshold: 2
  - Unhealthy threshold: 3
- **Scheduler**: `wrr` (weighted round robin)
- **Backend Server**:
  - ECS Instance: `i-t4n0nrf0t6q3d88gkwil`
  - Port: `8000`
  - Weight: `100`
- **Purpose**: Fronts the FastAPI worker as a single entry point, replacing direct IP access on port 8000. Provides health-check-based traffic routing and enables future horizontal scaling by adding more GPU-backed ECS instances behind the same balancer.

---

## Decision Path & Justification

### Why Alibaba Cloud for AI?

We evaluated three approaches before settling on GPU ECS + Ollama:

#### Option A: DashScope API (Rejected)
- **What**: Managed Qwen API from Alibaba Cloud (SaaS)
- **Why rejected**: Using an API key feels like "renting someone else's brain." It provides zero infrastructure justification — the same API key could be obtained from a third-party provider. For a hackathon architecture demonstration, this is a weak narrative.

#### Option B: Function Compute GPU (Explored but Rejected)
- **What**: Serverless GPU inference on Alibaba Cloud
- **Why explored**: True serverless GPU is genuinely unique — AWS Lambda does not support GPU inference. This would have been a strong architectural differentiator.
- **Why rejected**: 
  - Complex container image management (multi-GB models + cold starts)
  - Model download on every cold start creates 2–5 minute latency
  - Required Container Registry setup beyond hackathon time constraints
  - The user could not build Docker images locally due to hardware limits

#### Option C: GPU ECS + Ollama (Selected)
- **What**: Dedicated GPU instance running Ollama with Qwen 2.5 7B
- **Why selected**:
  - **Fastest path to demo**: Ollama installs in minutes, not hours
  - **Predictable performance**: No cold starts; model stays loaded in GPU memory
  - **Real infrastructure**: You are renting and controlling actual GPU hardware
  - **Cost transparency**: Flat hourly rate (~$1.20/hr) vs. opaque per-token pricing
  - **Data privacy**: User transaction data never leaves our VPC
  - **Hackathon reliability**: Fewer moving parts = fewer demo-day failures

### Why Not Just Use AWS for Everything?

| Factor | AWS | Alibaba Cloud |
|---|---|---|
| Equivalent GPU Instance | `g4dn.xlarge` (~$0.50–0.80/hr spot) | `ecs.gn6i-c4g1.xlarge` (~$0.30–0.50/hr spot) |
| Qwen Model Optimization | Generic | Native ecosystem (pre-built images, ModelScope mirrors) |
| GPU Serverless | Not available | Function Compute GPU (explored) |
| Southeast Asia Latency | Good | Better (Singapore region optimized for APAC) |

**Core justification**: Alibaba Cloud offers comparable GPU compute at lower cost, with native support for Qwen (the model we chose for Chinese/English multilingual intent detection). Using it exclusively for the AI tier demonstrates **cloud financial engineering** — placing expensive, bursty workloads on the most cost-optimized provider while keeping the stable web tier on AWS.

---

## Data Flow

```
User makes transaction
       |
       v
[AWS EC2] Next.js frontend receives transaction data
       |
       v
[AWS EC2] API route sends raw transaction to Alibaba Cloud
       |
       v
[Internet] HTTPS POST to CLB (port 80)
       |
       v
[Alibaba Cloud CLB] Load balancer forwards to healthy FastAPI Worker (port 8000)
       |
       v
[Alibaba Cloud ECS] FastAPI Worker:
       |   1. Embeds transaction text
       |   2. Stores in AnalyticDB vector DB
       |   3. Retrieves top 5 relevant user memories
       |   4. Builds prompt with transaction + history
       |
       v
[Alibaba Cloud ECS] Ollama loads Qwen 2.5 7B into NVIDIA T4 GPU
       |
       v
[Alibaba Cloud ECS] Model generates personalised recommendation
       |
       v
[Internet] JSON response returns to AWS frontend
       |
       v
[AWS EC2] Show deal to user (During / After payment)
       |
       v
User accepts deal
       |
       v
[AWS EC2] Sends feedback to Alibaba Cloud
       |
       v
[Alibaba Cloud CLB] → [Alibaba Cloud ECS] Stores accepted deal in AnalyticDB
       |
       v
(Next transaction retrieves this memory for better recommendations)

```

---

## Cost Model

We shifted from **token-based pricing** to **compute-based pricing**:

| Metric | DashScope API | Our ECS + Ollama |
|---|---|---|
| Pricing Unit | Per million tokens | Per GPU-hour |
| Low Traffic | Cheap | Fixed hourly cost |
| High Traffic | Expensive (linear scale) | Flat rate (economies of scale) |
| Idle Cost | $0 | $0 (if stopped) |
| Predictability | Low (depends on output length) | High (fixed instance cost) |

**Hackathon strategy**: Run the instance only during demos. Stop it between sessions. At ~$1.20/hour, a 4-hour demo day costs under $5.

---

## Security & Privacy

- **VPC Isolation**: The inference server lives in a private network. Port 22 (SSH) and port 80 (CLB) are the internet-exposed ports, while port 8000 should be restricted to VPC/CLB source IPs only.
- **CLB as Public Entry Point**: The Classic Load Balancer (port 80) is now the public-facing entry point for the FastAPI worker. Direct port 8000 access on the ECS instance can be restricted to the CLB's private IP or to VPC-internal traffic only.
- **Ollama is Internal**: Port 11434 is bound to localhost. The raw Ollama API is not directly reachable from the internet.
- **Vector DB is Private**: AnalyticDB lives inside the VPC. Only the ECS instance can reach it via internal endpoint.
- **Key-Based Auth**: No passwords; SSH access requires the `roadblock-key.pem` private key.
- **API Key Protection**: The `/recommend` endpoint requires a Bearer token. The key is stored as an environment variable on the ECS instance, not in code.
- **Data Residency**: Transaction data sent to the LLM never leaves Alibaba Cloud's Singapore region.
- **No Third-Party API**: User behavior data is not sent to DashScope, OpenAI, or any external API provider.

---

## API Reference

### FastAPI Worker — Recommend
```bash
# Via CLB (preferred)
curl http://<CLB-PUBLIC-IP>/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <WORKER_API_KEY>" \
  -d '{
    "user_id": "user_123",
    "merchant": "Starbucks",
    "category": "F&B",
    "location": "Singapore",
    "time": "2026-04-25T08:15:00Z",
    "amount": 5.20
  }'

# Direct (diagnostic)
curl http://47.237.195.58:8000/recommend \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <WORKER_API_KEY>" \
  -d '{
    "user_id": "user_123",
    "merchant": "Starbucks",
    "category": "F&B",
    "location": "Singapore",
    "time": "2026-04-25T08:15:00Z",
    "amount": 5.20
  }'
```
> **Note:** Replace `<CLB-PUBLIC-IP>` with the public IP of `lb-gs5720gqt7zv3fhjzddux`, which can be found via:
> ```bash
> aliyun slb DescribeLoadBalancers --LoadBalancerId lb-gs5720gqt7zv3fhjzddux
> ```

**Response:**
```json
{
  "intent": "daily coffee routine",
  "timing": "during_payment",
  "deals": [
    {"merchant": "Starbucks", "deal": "Earn 2x points on coffee before 9 AM"},
    {"merchant": "Starbucks", "deal": "Free pastry with any Grande purchase"}
  ],
  "message": "User buys coffee consistently around 8 AM. Morning commute miniapp recommended."
}
```

### FastAPI Worker — Feedback (Accepted Deal)
```bash
# Via CLB (preferred)
curl http://<CLB-PUBLIC-IP>/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <WORKER_API_KEY>" \
  -d '{
    "user_id": "user_123",
    "transaction_merchant": "Starbucks",
    "deal_merchant": "Starbucks",
    "deal_description": "Earn 2x points on coffee"
  }'

# Direct (diagnostic)
curl http://47.237.195.58:8000/feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <WORKER_API_KEY>" \
  -d '{
    "user_id": "user_123",
    "transaction_merchant": "Starbucks",
    "deal_merchant": "Starbucks",
    "deal_description": "Earn 2x points on coffee"
  }'
```

**Response:**
```json
{"status": "stored"}
```

### FastAPI Worker — Health Check
```bash
# Via CLB (preferred)
curl http://<CLB-PUBLIC-IP>/health

# Direct (diagnostic)
curl http://47.237.195.58:8000/health
```

**Response:**
```json
{"status": "ok", "model": "qwen2.5:7b", "vector_db": "connected"}
```

---

## Operational Notes

### Start the Instance
```bash
aliyun ecs StartInstance --InstanceId i-t4n0nrf0t6q3d88gkwil
```

### Stop the Instance (Save Money)
```bash
aliyun ecs StopInstance --InstanceId i-t4n0nrf0t6q3d88gkwil
```

### Check Ollama Status
```bash
ssh -i roadblock-key.pem root@47.237.195.58 "systemctl status ollama"
```

### Check FastAPI Worker Status
```bash
ssh -i roadblock-key.pem root@47.237.195.58 "systemctl status roadblock-worker"
```

### Check AnalyticDB Connection from ECS
```bash
ssh -i roadblock-key.pem root@47.237.195.58 "PGPASSWORD=RoadBlockDB2026! psql -h gp-gs5z5ss81655h9ce1-master.gpdbmaster.singapore.rds.aliyuncs.com -U roadblock -p 5432 -d roadblock_vector -c 'SELECT count(*) FROM user_memories;'"
```

### View Worker Logs
```bash
ssh -i roadblock-key.pem root@47.237.195.58 "journalctl -u roadblock-worker -f"
```

### Describe CLB
```bash
aliyun slb DescribeLoadBalancers --LoadBalancerId lb-gs5720gqt7zv3fhjzddux --RegionId ap-southeast-1
```

### Check CLB Health Status
```bash
aliyun slb DescribeHealthStatus --LoadBalancerId lb-gs5720gqt7zv3fhjzddux --RegionId ap-southeast-1
```

### Delete CLB (if needed)
```bash
aliyun slb DeleteLoadBalancer --LoadBalancerId lb-gs5720gqt7zv3fhjzddux --RegionId ap-southeast-1
```

### Model is Already Downloaded
Qwen 2.5 7B (`~4.7 GB`) is pre-cached on the instance disk at `/usr/share/ollama/.ollama/models/`. First inference after a reboot takes ~30 seconds to load into GPU memory; subsequent inferences are instant.

---

## One-Line Summary

We turned Alibaba Cloud's cheapest GPU instance into a memory-augmented AI inference engine — running Qwen 2.5 7B with AnalyticDB's fastann vector engine to retrieve user spending habits in real-time, fronted by a Classic Load Balancer for resilience — enabling personalised recommendations without ever fine-tuning the model.
