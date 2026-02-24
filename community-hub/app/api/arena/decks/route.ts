import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const playerId = req.nextUrl.searchParams.get("player_id");
    if (!playerId) {
      return NextResponse.json({ error: "player_id required" }, { status: 400 });
    }

    const { rows } = await pool.query(
      `SELECT id, name, faction_id, cards, created_at, updated_at
       FROM arena_decks WHERE player_id = $1 ORDER BY created_at`,
      [playerId],
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET /api/arena/decks error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, player_id, name, faction_id, cards } = await req.json();
    if (!id || !player_id || !name || !faction_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO arena_decks (id, player_id, name, faction_id, cards, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         faction_id = EXCLUDED.faction_id,
         cards = EXCLUDED.cards,
         updated_at = NOW()`,
      [id, player_id, name, faction_id, JSON.stringify(cards ?? [])],
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/arena/decks error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const deckId = req.nextUrl.searchParams.get("id");
    if (!deckId) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    await pool.query("DELETE FROM arena_decks WHERE id = $1", [deckId]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/arena/decks error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
