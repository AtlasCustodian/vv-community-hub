import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { id, displayName } = await req.json();
    if (!id || !displayName) {
      return NextResponse.json({ error: "id and displayName required" }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO arena_players (id, display_name)
       VALUES ($1, $2)
       ON CONFLICT (id) DO UPDATE SET display_name = $2`,
      [id, displayName],
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/arena/players error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
