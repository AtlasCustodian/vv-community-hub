import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: roomId } = await params;
    const { playerId, isReady, deckId } = await req.json();

    if (!playerId) {
      return NextResponse.json({ error: "playerId required" }, { status: 400 });
    }

    await pool.query(
      `UPDATE arena_room_players
       SET is_ready = $3, deck_id = COALESCE($4, deck_id)
       WHERE room_id = $1 AND player_id = $2`,
      [roomId, playerId, isReady ?? true, deckId ?? null],
    );

    await pool.query(
      "UPDATE arena_rooms SET updated_at = NOW() WHERE id = $1",
      [roomId],
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/arena/rooms/[id]/ready error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
