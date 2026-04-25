import pool from "@/lib/db";
import { callNovaMicro } from "@/lib/bedrock";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, merchant, category, location, amount, latitude, longitude, paymentStatus } = body;

    // 1. Get user's recent transaction history from RDS
    const historyResult = await pool.query(
      `SELECT merchant, category, location, amount, latitude, longitude, payment_status, created_at
       FROM transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [userId]
    );

    // 2. Analyze user behavior patterns from history
    const history = historyResult.rows;
    const categoryFrequency: Record<string, number> = {};
    const merchantFrequency: Record<string, number> = {};
    for (const txn of history) {
      categoryFrequency[txn.category] = (categoryFrequency[txn.category] || 0) + 1;
      merchantFrequency[txn.merchant] = (merchantFrequency[txn.merchant] || 0) + 1;
    }

    // 3. Build context payload
    const payload = {
      merchant,
      category,
      location,
      time: new Date().toISOString(),
      amount,
      latitude: latitude || null,
      longitude: longitude || null,
      payment_status: paymentStatus || "completed",
      user_behavior: {
        total_transactions: history.length,
        category_frequency: categoryFrequency,
        merchant_frequency: merchantFrequency,
        recent_transactions: history.slice(0, 10),
      },
    };

    let aiResult;
    let source = "alibaba";

    // 4. Try Alibaba Cloud Worker API first
    try {
      const alibabaResponse = await fetch(process.env.ALIBABA_WORKER_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ALIBABA_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!alibabaResponse.ok) {
        throw new Error(`Alibaba returned ${alibabaResponse.status}`);
      }

      aiResult = await alibabaResponse.json();
    } catch (alibabaError) {
      // 5. Fallback to AWS Bedrock Nova Micro
      console.log("Alibaba failed, falling back to Bedrock Nova Micro:", alibabaError);
      source = "bedrock";

      const prompt = `You are an AI deal recommendation engine for TnG eWallet in Malaysia.

CURRENT TRANSACTION:
- Merchant: ${merchant}
- Category: ${category}
- Location: ${location}
- Time: ${payload.time}
- Amount: RM${amount}
- GPS: lat=${latitude}, lng=${longitude}

USER BEHAVIOR:
- Total past transactions: ${history.length}
- Category frequency: ${JSON.stringify(categoryFrequency)}
- Merchant frequency: ${JSON.stringify(merchantFrequency)}
- Recent transactions: ${JSON.stringify(history.slice(0, 5))}

RULES:
1. If user is dining/shopping at a physical location → timing = "during_payment", recommend nearby food/drinks/desserts (up to 3 deals)
2. If user is booking travel → timing = "after_payment", recommend travel deals like hotels, eSIM, transport (up to 3 deals)
3. Use user behavior patterns to personalize recommendations.
4. Deals must be relevant to the location and context.

Return ONLY valid JSON with no markdown:
{
  "intent": "short_intent_name",
  "timing": "during_payment" or "after_payment",
  "deals": [
    {
      "merchant": "merchant name",
      "description": "deal description",
      "discount": "discount amount",
      "location": "where to redeem",
      "category": "deal category"
    }
  ],
  "message": "friendly user-facing message"
}

Return 2-3 deals. ONLY JSON, no other text.`;

      aiResult = await callNovaMicro(prompt);
    }

    // 6. Save recommendation to RDS
    if (aiResult.intent) {
      await pool.query(
        `INSERT INTO recommendations (user_id, intent, timing)
         VALUES ($1, $2, $3)`,
        [userId, aiResult.intent, aiResult.timing]
      );
    }

    // 7. Return result to frontend
    return Response.json({
      intent: aiResult.intent,
      timing: aiResult.timing,
      deals: aiResult.deals,
      message: aiResult.message,
      source,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
