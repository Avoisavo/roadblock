# AI-Powered Miniapp Intelligence Layer

## Problem Statement

Transaction data in TnG eWallet is currently underutilized and exists in silos, while many miniapp deals—such as vouchers, cashback offers, and promotions—within miniapps of the platform remain unused. The core issue lies in discovery and timing. Today, users are required to manually open a marketplace, scroll through unfamiliar miniapps and offers, and guess what might be useful. In reality, this behavior rarely happens—especially in the middle of a transaction.

This breaks the entire miniapp ecosystem. Merchants create deals, but users never see them at the right moment. As a result, even highly relevant vouchers and promotions remain invisible.

The fundamental problem is that discovery is **active**, while real user needs are **contextual and moment-driven**. Deals should not rely on users to find them. Instead, they should appear automatically at the exact moment they are needed—and depending on the context, that moment could be **during payment** or **after payment**.

---

## Solution

We propose an **AI-powered Intelligence Layer** built on top of transaction data.

Instead of treating transactions as static records, this system interprets them as **real-time signals of user intent**. By analyzing transaction context such as location, spending category, timing, and behavioral patterns, the system understands what the user is likely to need next.

Based on this, the system proactively surfaces the most relevant miniapp deal—such as a voucher, discount, or service recommendation—at the right moment. Critically, the system determines **when** to show the deal on a case-by-case basis:

- **During payment** — For impulse-friendly, low-consideration deals tied to the user's current location and habits (e.g. a dessert voucher while paying for dinner).
- **After payment** — For higher-consideration decisions that require thought (e.g. hotel and car rental recommendations after booking a flight).

This transforms the experience from:

**Active discovery → Passive, intelligent engagement**

Where deals no longer wait to be discovered, but instead find the user when they are most relevant—and at the right stage of their transaction.

---

## Implementation

The system is designed as a real-time pipeline that converts raw transaction data into actionable deal delivery.

### 1. Transaction Ingestion

The user initiates or completes a transaction (e.g. payment, purchase, booking).

Examples:
- Paying for dinner at a mall
- Buying a plane ticket
- Paying for public transport
- Grocery shopping

---

### 2. Context Extraction

Raw transaction data is enriched into meaningful structured data:

- Merchant (e.g. Sushi Zanmai, AirAsia)
- Category (Dining, Travel, Transport, Groceries)
- Location (Mall name, City, Country)
- Time (Lunch, Dinner, Weekend, Late Night)
- User behavior history (e.g. frequently buys dessert after dinner, often books hotels after flights)

---

### 3. AI Intent Detection

AI models analyze patterns and infer user intent:

- Dinner payment at a mall + history of dessert purchases → Dessert craving likely
- Flight ticket purchase → Travel preparation intent
- Overseas transport usage → Local mobility need
- Repeated grocery trips → Household routine

---

### 4. Decision Engine

The system determines the most relevant deal to surface **and when to show it**:

| Trigger | Deal | Timing | Reasoning |
|---|---|---|---|
| Paying for dinner at a mall | Llaollao voucher (e.g. 20% off) | **During payment** | Low-consideration, impulse-friendly; user is at the location and historically goes for dessert after dinner |
| Buying a plane ticket | Hotel booking, car rental, eSIM deals | **After payment** | High-consideration; user needs time to think and plan, not an impulse decision |
| Overseas transport usage | Local transport pass deal | **After payment** | User is already in transit; show after current ride is settled |
| Frequent grocery shopping | Cashback voucher for nearby supermarket | **During payment** | Routine purchase; voucher can apply immediately to current basket |

---

### 5. Trigger & Delivery

The selected deal is surfaced through the appropriate channel based on timing:

**During Payment:**
- Inline deal card on the payment confirmation screen (before user confirms)
- One-tap voucher redemption applied directly to checkout

**After Payment:**
- Post-payment recommendation panel
- In-app notification with deal details
- Push notification for time-sensitive offers

No manual search required.

---

## User Flow

### Scenario 1: Dinner at a Mall → Dessert Voucher (During Payment)

1. User is at a mall and pays for dinner at a restaurant
2. System detects:
   - Location: Mid Valley Megamall
   - Category: Dining (Dinner)
   - Behavior: User frequently buys dessert after dinner (75% of the time)
   - Nearby merchants: Llaollao is 2 minutes away

3. **During the payment screen**, a deal is shown:

👉 "Craving dessert? Here's 20% off Llaollao — just around the corner 🍦"

4. User taps to claim the voucher and uses it immediately after dinner

---

### Scenario 2: Flight Ticket → Travel Essentials (After Payment)

1. User purchases a flight ticket to Tokyo
2. System detects travel intent and destination
3. **After payment is completed**, the system surfaces:

- 🏨 Hotel booking deals in Tokyo
- 🚗 Car rental offers at destination
- 📱 Japan eSIM data plans

👉 "Planning your Tokyo trip? Here are deals to get you sorted."

4. These appear on the post-payment screen and are saved in-app for later — because booking a hotel or buying an eSIM is a bigger decision that needs consideration

---

### Scenario 3: Weekly Groceries → Instant Cashback (During Payment)

1. User shops at the same supermarket every Saturday
2. System learns the routine pattern
3. **During payment**, a voucher is shown:

👉 "Your weekly shop? Here's RM5 cashback on orders above RM80 — applied automatically 🛒"

---

## Benefits

### For Users

- Seamless experience — relevant deals appear automatically without searching or browsing
- Right deals at the right time, matched to the right scenario (e.g. dessert voucher during dinner, travel deals after booking a flight)
- Personalized to actual spending habits and preferences
- No friction — vouchers are ready to use exactly when and where they matter

---

### For Merchants

- **Targeted marketing** — reach users who are genuinely likely to buy, based on real spending behavior, not broad demographics
- Higher conversion rates — deals are shown to high-intent users at the moment of relevance (e.g. a dessert shop targets users who consistently buy dessert after dinner)
- Reduced wasted ad spend — no more blasting promotions to uninterested audiences
- Location-aware targeting — reach users who are physically nearby and in the right mindset to purchase

---

### For TnG eWallet

- Adds an **intelligent layer** on top of the existing TnG platform, transforming it from a payment tool into a smart commerce platform
- Fully **autonomous** — the system learns, decides, and delivers deals without manual curation or intervention
- **Attracts more users** — a smarter, more personalized experience gives users a reason to stay and transact more within TnG
- **Attracts more merchants** — merchants are incentivized to collaborate and list deals when they see real, targeted reach instead of passive marketplace listings
- **Scales into its own ecosystem** — as more users transact and more merchants onboard, the intelligence layer becomes a self-reinforcing flywheel: better data → better recommendations → more engagement → more merchants → richer deals

---

## Key Insight

This system transforms the miniapp deal ecosystem from a passive marketplace into an intelligent, context-driven platform that understands **not just what to recommend, but when to recommend it**.

Instead of:
> Users searching for deals and vouchers

It becomes:
> Deals automatically appearing at the right moment — during payment for impulse-ready offers, and after payment for decisions that need thought

---

## One-Line Summary

We turn siloed transaction data into real-time, AI-driven deal delivery—where miniapp vouchers and recommendations intelligently find users at the right moment, whether during or after payment.