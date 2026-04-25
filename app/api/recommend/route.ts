import pool from "@/lib/db";

export async function POST(request: Request) {
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

  // 3. Build context payload for Alibaba Cloud Worker
  const payload = {
    merchant,
    category,
    location,
    time: new Date().toISOString(),
    amount,
    latitude,
    longitude,
    payment_status: paymentStatus || "completed",
    user_behavior: {
      total_transactions: history.length,
      category_frequency: categoryFrequency,
      merchant_frequency: merchantFrequency,
      recent_transactions: history.slice(0, 10),
    },
  };

  // 4. Send to Alibaba Cloud Worker API
  const alibabaResponse = await fetch(process.env.ALIBABA_WORKER_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ALIBABA_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const aiResult = await alibabaResponse.json();

  // 5. Save recommendation to RDS
  await pool.query(
    `INSERT INTO recommendations (user_id, transaction_id, intent, timing)
     VALUES ($1, $2, $3, $4)`,
    [userId, body.transactionId, aiResult.intent, aiResult.timing]
  );

  // 6. Return result to frontend
  return Response.json({
    intent: aiResult.intent,
    timing: aiResult.timing,
    deals: aiResult.deals,
    message: aiResult.message,
  });
}
