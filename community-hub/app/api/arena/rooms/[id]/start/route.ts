import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { FactionId, Card, RawChampion } from "@/types/game";
import { buildDecks } from "@/lib/game/cardBuilder";
import { createInitialGameState } from "@/lib/game/gameEngine";

function serializeGameState(state: ReturnType<typeof createInitialGameState>) {
  return {
    ...state,
    draftSelections: Array.from(state.draftSelections.entries()),
    movedChampions: Array.from(state.movedChampions),
    attackedChampions: Array.from(state.attackedChampions),
    usedAbilityChampions: Array.from(state.usedAbilityChampions),
  };
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: roomId } = await params;
    const { playerId } = await req.json();

    const { rows: roomRows } = await pool.query(
      "SELECT id, mode, status, host_player_id FROM arena_rooms WHERE id = $1",
      [roomId],
    );
    if (roomRows.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    const room = roomRows[0];

    if (room.host_player_id !== playerId) {
      return NextResponse.json({ error: "Only the host can start" }, { status: 403 });
    }
    if (room.status !== "waiting") {
      return NextResponse.json({ error: "Game already started" }, { status: 400 });
    }

    const { rows: playerRows } = await pool.query(
      `SELECT rp.player_id, rp.seat, rp.faction_id, rp.deck_id, rp.is_ready
       FROM arena_room_players rp WHERE rp.room_id = $1 ORDER BY rp.seat`,
      [roomId],
    );

    const expectedPlayers = room.mode === "3p" ? 3 : 2;
    if (playerRows.length < expectedPlayers) {
      return NextResponse.json({ error: `Need ${expectedPlayers} players` }, { status: 400 });
    }

    const allReady = playerRows.every((p: { is_ready: boolean }) => p.is_ready);
    if (!allReady) {
      return NextResponse.json({ error: "Not all players are ready" }, { status: 400 });
    }

    const factionIds = playerRows.map((p: { faction_id: string }) => p.faction_id as FactionId);

    // Fetch champions from DB
    const { rows: championRows } = await pool.query(
      `SELECT id, name, faction_id, starting_return_rate as "returnRate",
              standing as "stabilityScore"
       FROM champions WHERE faction_id = ANY($1)`,
      [factionIds],
    );

    const rawByFaction: Record<string, RawChampion[]> = {};
    for (const fid of factionIds) {
      rawByFaction[fid] = championRows
        .filter((c: { faction_id: string }) => c.faction_id === fid)
        .map((c: { id: string; name: string; faction_id: string; returnRate: number; stabilityScore: number }) => ({
          id: c.id,
          name: c.name,
          faction_id: c.faction_id as FactionId,
          returnRate: Number(c.returnRate),
          stabilityScore: Number(c.stabilityScore),
        }));
    }

    const decks = buildDecks(rawByFaction);

    // Apply custom decks for players that selected one
    for (const p of playerRows) {
      if (p.deck_id) {
        const { rows: deckRows } = await pool.query(
          "SELECT cards FROM arena_decks WHERE id = $1",
          [p.deck_id],
        );
        if (deckRows.length > 0 && deckRows[0].cards?.length > 0) {
          const customCards: Card[] = deckRows[0].cards.map((dc: {
            championId: string; name: string; factionId: FactionId;
            attack: number; defense: number; championClass: "attacker" | "defender" | "bruiser";
            returnRate: number; stabilityScore: number;
          }) => ({
            id: `card-${dc.championId}`,
            championId: dc.championId,
            name: dc.name,
            factionId: dc.factionId,
            attack: dc.attack,
            defense: dc.defense,
            health: 20,
            maxHealth: 20,
            championClass: dc.championClass,
            returnRate: dc.returnRate,
            stabilityScore: dc.stabilityScore,
          }));
          decks[p.faction_id as FactionId] = customCards;
        }
      }
    }

    const gameState = createInitialGameState(decks, factionIds);
    const serialized = serializeGameState(gameState);

    await pool.query(
      `UPDATE arena_rooms SET status = 'playing', game_state = $2, updated_at = NOW() WHERE id = $1`,
      [roomId, JSON.stringify(serialized)],
    );

    return NextResponse.json({ ok: true, gameState: serialized });
  } catch (err) {
    console.error("POST /api/arena/rooms/[id]/start error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
