import pool from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, merchant, category, location, amount } = body;

  const result = await pool.query(
    `INSERT INTO transactions (user_id, merchant, category, location, amount)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, merchant, category, location, amount]
  );

  return Response.json({ transaction: result.rows[0] });
}

export async function GET() {
  const result = await pool.query(
    "SELECT * FROM transactions ORDER BY created_at DESC LIMIT 50"
  );

  return Response.json({ transactions: result.rows });
}
