# AI-Powered Miniapp Intelligence Layer

## Problem Statement

Transaction data in TnG eWallet is currently underutilized and exists in silos, while many miniapps within the platform remain unused. The core issue lies in discovery. Today, users are required to manually open a marketplace, scroll through unfamiliar miniapps, and guess what might be useful. In reality, this behavior rarely happens—especially right after making a payment.

This breaks the entire miniapp ecosystem. Developers build miniapps, but users do not discover them. As a result, even highly useful services remain invisible.

The fundamental problem is that discovery is **active**, while real user needs are **contextual and moment-driven**. Miniapps should not rely on users to find them. Instead, they should appear automatically at the exact moment they are needed.

---

## Solution

We propose an **AI-powered Intelligence Layer** built on top of transaction data.

Instead of treating transactions as static records, this system interprets them as **real-time signals of user intent**. By analyzing transaction context such as location, spending category, timing, and behavioral patterns, the system understands what the user is likely to need next.

Based on this, the system proactively surfaces the most relevant miniapp or deal at the right moment—without requiring any user effort.

This transforms the experience from:

**Active discovery → Passive, intelligent engagement**

Where miniapps no longer wait to be discovered, but instead find the user when they are most relevant.

---

## Implementation

The system is designed as a real-time pipeline that converts raw transaction data into actionable engagement.

### 1. Transaction Ingestion

The user performs a transaction (e.g. payment, purchase, transfer).

Examples:
- Paying for coffee
- Buying a flight ticket
- Paying for public transport
- Grocery shopping

---

### 2. Context Extraction

Raw transaction data is enriched into meaningful structured data:

- Merchant (e.g. Starbucks, AirAsia)
- Category (Dining, Travel, Transport, Groceries)
- Location (City, Country)
- Time (Morning, Weekend, Late Night)

---

### 3. AI Intent Detection

AI models analyze patterns and infer user intent:

- Repeated coffee purchases → Daily habit
- Flight purchase → Travel intent
- Overseas transport → Mobility need
- Frequent dining → Lifestyle preference

---

### 4. Decision Engine

The system determines the most relevant miniapp or offer to surface:

- Coffee habit → Nearby cashback or loyalty miniapp
- Flight booking → Travel insurance / hotel miniapps
- Overseas transport → Local payment (e.g. Octopus) miniapp

---

### 5. Trigger & Delivery

The selected miniapp is surfaced instantly through:

- Post-payment screen
- In-app recommendation panel
- Push notifications

No manual search required.

---

## User Flow

### Scenario 1: Overseas Travel

1. User travels to Hong Kong  
2. Pays for a bus ride  
3. System detects:
   - Overseas location  
   - Public transport usage  
   - Travel context  

4. Miniapp is triggered:

👉 “Travelling in Hong Kong? Get an Octopus card or local transport pass here.”

---

### Scenario 2: Flight Purchase

1. User buys a flight ticket  
2. System detects travel intent  
3. Instantly surfaces:

- Travel insurance miniapp  
- Hotel booking miniapp  
- Airport transfer miniapp  

No searching required.

---

### Scenario 3: Daily Habit

1. User buys coffee every weekday morning  
2. System learns behavior pattern  
3. Suggests:

👉 “You usually get coffee now. Enjoy 20% off nearby today.”

---

## Benefits

### For Users

- No need to search or browse miniapps  
- Highly relevant, personalized recommendations  
- Right suggestions at the right time  
- Seamless and intuitive experience  

---

### For Merchants

- Target users based on real spending behavior  
- Reach high-intent customers  
- Higher conversion rates  
- Reduced wasted marketing spend  

Example targeting:
- Users who recently bought flight tickets  
- Users who frequently dine nearby  
- Users visiting competitor stores  

---

## Key Insight

This system transforms the miniapp ecosystem from a passive marketplace into an intelligent, context-driven platform.

Instead of:
> Users searching for miniapps

It becomes:
> Miniapps automatically appearing when users need them

---

## One-Line Summary

We turn siloed transaction data into real-time, AI-driven engagement—where miniapps intelligently find users at the right moment.