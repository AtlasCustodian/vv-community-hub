import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: roomId } = await params;

    const { rows: roomRows } = await pool.query(
      `SELECT id, mode, status, host_player_id, host_faction_id, game_state, updated_at, created_at
       FROM arena_rooms WHERE id = $1`,
      [roomId],
    );
    if (roomRows.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const room = roomRows[0];

    const { rows: players } = await pool.query(
      `SELECT rp.player_id, rp.seat, rp.faction_id, rp.deck_id, rp.is_ready,
              ap.display_name
       FROM arena_room_players rp
       JOIN arena_players ap ON ap.id = rp.player_id
       WHERE rp.room_id = $1
       ORDER BY rp.seat`,
      [roomId],
    );

    return NextResponse.json({
      id: room.id,
      mode: room.mode,
      status: room.status,
      hostPlayerId: room.host_player_id,
      hostFactionId: room.host_faction_id,
      gameState: room.game_state,
      updatedAt: room.updated_at,
      createdAt: room.created_at,
      players: players.map((p) => ({
        playerId: p.player_id,
        displayName: p.display_name,
        seat: p.seat,
        factionId: p.faction_id,
        deckId: p.deck_id,
        isReady: p.is_ready,
      })),
    });
  } catch (err) {
    console.error("GET /api/arena/rooms/[id] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
