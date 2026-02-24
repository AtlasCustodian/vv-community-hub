import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { GameState, HexCoord, Card } from "@/types/game";
import {
  completeDraft,
  placeChampion,
  moveChampion,
  resolveAttack,
  playChampionFromHand,
  endTurn,
  autoDrawCard,
  willDeployBeAvailable,
  resolveDefenderAbility,
  resolveAttackerAbility,
  resolveBruiserAbility,
} from "@/lib/game/gameEngine";

interface SerializedGameState
  extends Omit<
    GameState,
    "draftSelections" | "movedChampions" | "attackedChampions" | "usedAbilityChampions"
  > {
  draftSelections: [number, Card[]][];
  movedChampions: string[];
  attackedChampions: string[];
  usedAbilityChampions: string[];
}

function deserialize(raw: SerializedGameState): GameState {
  return {
    ...raw,
    draftSelections: new Map(raw.draftSelections),
    movedChampions: new Set(raw.movedChampions),
    attackedChampions: new Set(raw.attackedChampions),
    usedAbilityChampions: new Set(raw.usedAbilityChampions),
  };
}

function serialize(state: GameState): SerializedGameState {
  return {
    ...state,
    draftSelections: Array.from(state.draftSelections.entries()),
    movedChampions: Array.from(state.movedChampions),
    attackedChampions: Array.from(state.attackedChampions),
    usedAbilityChampions: Array.from(state.usedAbilityChampions),
  };
}

type ActionPayload =
  | { type: "draft"; selectedCardIds: string[] }
  | { type: "place"; cardId: string; position: HexCoord }
  | { type: "move"; from: HexCoord; to: HexCoord }
  | { type: "attack"; from: HexCoord; to: HexCoord }
  | { type: "deploy"; cardId: string; position: HexCoord }
  | { type: "ability"; coord: HexCoord; targetCoord?: HexCoord }
  | { type: "endTurn" }
  | { type: "interstitialContinue" };

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: roomId } = await params;
    const { playerId, action } = (await req.json()) as {
      playerId: string;
      action: ActionPayload;
    };

    if (!playerId || !action) {
      return NextResponse.json({ error: "playerId and action required" }, { status: 400 });
    }

    const { rows: roomRows } = await pool.query(
      "SELECT game_state, status FROM arena_rooms WHERE id = $1",
      [roomId],
    );
    if (roomRows.length === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    if (roomRows[0].status !== "playing") {
      return NextResponse.json({ error: "Game not in progress" }, { status: 400 });
    }
    if (!roomRows[0].game_state) {
      return NextResponse.json({ error: "No game state" }, { status: 400 });
    }

    // Resolve the seat for this player
    const { rows: playerRows } = await pool.query(
      "SELECT seat FROM arena_room_players WHERE room_id = $1 AND player_id = $2",
      [roomId, playerId],
    );
    if (playerRows.length === 0) {
      return NextResponse.json({ error: "Not in this room" }, { status: 403 });
    }
    const seat = playerRows[0].seat as number;

    const gameState = deserialize(roomRows[0].game_state as SerializedGameState);

    // Validate it's this player's turn (seat matches currentPlayerIndex)
    if (gameState.currentPlayerIndex !== seat && action.type !== "interstitialContinue") {
      return NextResponse.json({ error: "Not your turn" }, { status: 403 });
    }

    let newState: GameState;

    switch (action.type) {
      case "draft":
        newState = completeDraft(gameState, seat, action.selectedCardIds);
        break;

      case "place":
        newState = placeChampion(gameState, seat, action.cardId, action.position);
        break;

      case "move":
        newState = moveChampion(gameState, action.from, action.to);
        break;

      case "attack":
        newState = resolveAttack(gameState, action.from, action.to);
        break;

      case "deploy":
        newState = playChampionFromHand(gameState, action.cardId, action.position);
        break;

      case "ability": {
        const tile = gameState.board.find(
          (t) => t.coord.q === action.coord.q && t.coord.r === action.coord.r,
        );
        if (!tile?.occupant) {
          return NextResponse.json({ error: "No champion at position" }, { status: 400 });
        }
        const cls = tile.occupant.card.championClass;
        if (cls === "defender") {
          newState = resolveDefenderAbility(gameState, action.coord);
        } else if (cls === "attacker") {
          newState = resolveAttackerAbility(gameState, action.coord);
        } else if (cls === "bruiser" && action.targetCoord) {
          newState = resolveBruiserAbility(gameState, action.coord, action.targetCoord);
        } else {
          return NextResponse.json({ error: "Invalid ability usage" }, { status: 400 });
        }
        break;
      }

      case "endTurn":
        newState = endTurn(gameState);
        break;

      case "interstitialContinue": {
        if (gameState.phase !== "interstitial") {
          return NextResponse.json({ error: "Not in interstitial phase" }, { status: 400 });
        }
        if (gameState.currentPlayerIndex !== seat) {
          return NextResponse.json({ error: "Not your turn" }, { status: 403 });
        }
        const player = gameState.players[gameState.currentPlayerIndex];
        const hasDrafted = player.hand.length > 0;
        let nextPhase: GameState["phase"];
        if (!hasDrafted) {
          nextPhase = "draft";
        } else if (gameState.turnNumber === 0) {
          nextPhase = "placement";
        } else {
          nextPhase = "turn";
        }
        newState = { ...gameState, phase: nextPhase };
        if (nextPhase === "turn" && willDeployBeAvailable(newState)) {
          newState = autoDrawCard(newState);
        }
        break;
      }

      default:
        return NextResponse.json({ error: "Unknown action type" }, { status: 400 });
    }

    const serialized = serialize(newState);

    const newStatus = newState.phase === "victory" ? "finished" : "playing";

    await pool.query(
      `UPDATE arena_rooms SET game_state = $2, status = $3, updated_at = NOW() WHERE id = $1`,
      [roomId, JSON.stringify(serialized), newStatus],
    );

    return NextResponse.json({ ok: true, gameState: serialized });
  } catch (err) {
    console.error("POST /api/arena/rooms/[id]/action error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
