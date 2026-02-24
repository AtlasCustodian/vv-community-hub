import { NextResponse } from "next/server";
import pool from "@/lib/db";

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: Request) {
  try {
    const { playerId, factionId, mode, deckId } = await req.json();
    if (!playerId || !factionId || !mode) {
      return NextResponse.json({ error: "playerId, factionId, mode required" }, { status: 400 });
    }
    if (mode !== "2p" && mode !== "3p") {
      return NextResponse.json({ error: "mode must be '2p' or '3p'" }, { status: 400 });
    }

    let roomId = generateRoomCode();
    let attempts = 0;
    while (attempts < 10) {
      const { rows } = await pool.query("SELECT id FROM arena_rooms WHERE id = $1", [roomId]);
      if (rows.length === 0) break;
      roomId = generateRoomCode();
      attempts++;
    }

    await pool.query(
      `INSERT INTO arena_rooms (id, mode, status, host_player_id, host_faction_id, host_deck_id)
       VALUES ($1, $2, 'waiting', $3, $4, $5)`,
      [roomId, mode, playerId, factionId, deckId ?? null],
    );

    await pool.query(
      `INSERT INTO arena_room_players (room_id, player_id, seat, faction_id, deck_id, is_ready)
       VALUES ($1, $2, 0, $3, $4, FALSE)`,
      [roomId, playerId, factionId, deckId ?? null],
    );

    return NextResponse.json({ roomId });
  } catch (err) {
    console.error("POST /api/arena/rooms error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
