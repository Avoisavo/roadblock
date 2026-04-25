import pool from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, merchant, category, location, amount } = body;

  // 1. Get user's recent transaction history from RDS
  const historyResult = await pool.query(
    `SELECT merchant, category, location, amount, created_at
     FROM transactions
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 10`,
    [userId]
  );

  // 2. Build context payload for Alibaba Cloud Worker
  const payload = {
    merchant,
    category,
    location,
    time: new Date().toISOString(),
    amount,
    user_history: historyResult.rows,
  };

  // 3. Send to Alibaba Cloud Worker API
  const alibabaResponse = await fetch(process.env.ALIBABA_WORKER_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ALIBABA_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const aiResult = await alibabaResponse.json();

  // 4. Save recommendation to RDS
  await pool.query(
    `INSERT INTO recommendations (user_id, transaction_id, intent, timing)
     VALUES ($1, $2, $3, $4)`,
    [userId, body.transactionId, aiResult.intent, aiResult.timing]
  );

  // 5. Return result to frontend
  return Response.json({
    deal: aiResult.deal,
    timing: aiResult.timing,
    message: aiResult.message,
  });
}
