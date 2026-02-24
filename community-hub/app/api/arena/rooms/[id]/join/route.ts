import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: roomId } = await params;
    const { playerId, factionId, deckId } = await req.json();

    if (!playerId || !factionId) {
      return NextResponse.json({ error: "playerId and factionId required" }, { status: 400 });
    }

    const { rows: roomRows } = await pool.query(
      "SELECT mode, status FROM arena_rooms WHERE id = $1",
      [roomId],
    );
    if (roomRows.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const room = roomRows[0];
    if (room.status !== "waiting") {
      return NextResponse.json({ error: "Room is not accepting players" }, { status: 400 });
    }

    const maxPlayers = room.mode === "3p" ? 3 : 2;

    const { rows: existing } = await pool.query(
      "SELECT player_id, seat FROM arena_room_players WHERE room_id = $1",
      [roomId],
    );

    if (existing.find((p: { player_id: string }) => p.player_id === playerId)) {
      return NextResponse.json({ ok: true, message: "Already in room" });
    }

    if (existing.length >= maxPlayers) {
      return NextResponse.json({ error: "Room is full" }, { status: 400 });
    }

    const takenSeats = new Set(existing.map((p: { seat: number }) => p.seat));
    let seat = 1;
    while (takenSeats.has(seat)) seat++;

    // Prevent duplicate factions
    const takenFactions = new Set(existing.map((p: { faction_id: string }) => p.faction_id));
    if (takenFactions.has(factionId)) {
      return NextResponse.json({ error: "That faction is already taken in this room" }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO arena_room_players (room_id, player_id, seat, faction_id, deck_id, is_ready)
       VALUES ($1, $2, $3, $4, $5, FALSE)`,
      [roomId, playerId, seat, factionId, deckId ?? null],
    );

    await pool.query(
      "UPDATE arena_rooms SET updated_at = NOW() WHERE id = $1",
      [roomId],
    );

    return NextResponse.json({ ok: true, seat });
  } catch (err) {
    console.error("POST /api/arena/rooms/[id]/join error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
