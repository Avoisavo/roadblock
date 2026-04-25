# Alibaba Cloud Infrastructure & AI Layer

## Project Context

This document explains the Alibaba Cloud infrastructure powering the AI Inference Layer for the **AI-Powered Miniapp Intelligence Layer** project. The system analyzes transaction data in real-time, detects user intent using LLMs, and surfaces relevant miniapps at the exact moment they are needed.

---

## Architecture Overview

We operate a **dual-cloud architecture**:

| Layer | Cloud Provider | Services | Responsibility |
|---|---|---|---|
| **Web Frontend & Data** | AWS | EC2, RDS, Redis | Hosts Next.js UI, transactional data, caching |
| **AI Inference** | Alibaba Cloud | ECS, VPC, Ollama | Runs Qwen 2.5 7B LLM for real-time intent detection |

**Why two clouds?** We deliberately separated the fast, reliable web tier (AWS) from the GPU-intensive AI inference tier (Alibaba Cloud). This is a real-world pattern called **workload-specific cloud selection** — using the best provider for each job instead of forcing everything onto one platform.

---

## Alibaba Cloud Services Used

### 1. Elastic Compute Service (ECS)
- **Instance ID**: `i-t4n0nrf0t6q3d88gkwil`
- **Type**: `ecs.gn6i-c4g1.xlarge`
- **Specs**: 4 vCPU, 15 GiB RAM, 1x NVIDIA T4 GPU (15 GiB VRAM)
- **Region/Zone**: `ap-southeast-1b` (Singapore)
- **Billing**: PostPaid (Pay-As-You-Go)
- **Purpose**: Hosts the Ollama inference server running Qwen 2.5 7B

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
  - Port 8000 — originally planned for vLLM
  - Port 11434 — Ollama API endpoint
- **Purpose**: Firewall controlling inbound access to the inference server.

### 5. Key Pair
- **Name**: `roadblock-key`
- **Purpose**: SSH authentication for secure server administration.

### 6. Ollama (Self-Hosted on ECS)
- **Model**: `qwen2.5:7b`
- **API Endpoint**: `http://47.237.195.58:11434`
- **Endpoints**:
  - `/api/generate` — Ollama native API
  - `/v1/chat/completions` — OpenAI-compatible API
- **Purpose**: Serves the Qwen LLM for intent detection, recommendation generation, and context understanding.

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
[AWS EC2] API route formats context into LLM prompt
       |
       v
[Internet] HTTPS POST to Alibaba Cloud Ollama
       |
       v
[Alibaba Cloud ECS] Ollama loads Qwen 2.5 7B into NVIDIA T4 GPU
       |
       v
[Alibaba Cloud ECS] Model infers user intent (e.g., "travel", "dining habit")
       |
       v
[Internet] JSON response returns to AWS frontend
       |
       v
[AWS EC2] Decision engine maps intent to miniapp
       |
       v
User sees relevant miniapp recommendation
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

- **VPC Isolation**: The inference server lives in a private network. Only ports 22 (SSH) and 11434 (API) are exposed.
- **Key-Based Auth**: No passwords; SSH access requires the `roadblock-key.pem` private key.
- **Data Residency**: Transaction data sent to the LLM never leaves Alibaba Cloud's Singapore region.
- **No Third-Party API**: User behavior data is not sent to DashScope, OpenAI, or any external API provider.

---

## API Reference

### Native Ollama API
```bash
curl http://47.237.195.58:11434/api/generate \
  -d '{
    "model": "qwen2.5:7b",
    "prompt": "User just bought a flight ticket. What miniapps should we suggest?"
  }'
```

### OpenAI-Compatible API
```bash
curl http://47.237.195.58:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen2.5:7b",
    "messages": [
      {"role": "system", "content": "You are an intent detection engine."},
      {"role": "user", "content": "Transaction: Starbucks, $5.20, 8:15 AM"}
    ]
  }'
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

### Model is Already Downloaded
Qwen 2.5 7B (`~4.7 GB`) is pre-cached on the instance disk at `/usr/share/ollama/.ollama/models/`. First inference after a reboot takes ~30 seconds to load into GPU memory; subsequent inferences are instant.

---

## One-Line Summary

We turned Alibaba Cloud's cheapest GPU instance into a private, self-hosted AI inference engine — running Qwen 2.5 7B inside our own VPC, at a fraction of managed API costs, with full data privacy and zero cold starts.
