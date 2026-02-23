import type { GameState, GamePhase, FactionId, Card } from "@/types/game";

const STORAGE_KEY = "vantheon-arena-session";

type ArenaPhase = "lobby" | "playing";

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

export interface ArenaSession {
  arenaPhase: ArenaPhase;
  opponents: FactionId[];
  gameState: SerializedGameState;
  pendingPhase: GamePhase | null;
  savedAt: number;
}

function serializeGameState(state: GameState): SerializedGameState {
  return {
    ...state,
    draftSelections: Array.from(state.draftSelections.entries()),
    movedChampions: Array.from(state.movedChampions),
    attackedChampions: Array.from(state.attackedChampions),
    usedAbilityChampions: Array.from(state.usedAbilityChampions),
  };
}

function deserializeGameState(raw: SerializedGameState): GameState {
  return {
    ...raw,
    draftSelections: new Map(raw.draftSelections),
    movedChampions: new Set(raw.movedChampions),
    attackedChampions: new Set(raw.attackedChampions),
    usedAbilityChampions: new Set(raw.usedAbilityChampions),
  };
}

export function saveArenaSession(
  arenaPhase: ArenaPhase,
  opponents: FactionId[],
  gameState: GameState,
  pendingPhase: GamePhase | null,
): void {
  try {
    const session: ArenaSession = {
      arenaPhase,
      opponents,
      gameState: serializeGameState(gameState),
      pendingPhase,
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function loadArenaSession(): {
  arenaPhase: ArenaPhase;
  opponents: FactionId[];
  gameState: GameState;
  pendingPhase: GamePhase | null;
} | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const session: ArenaSession = JSON.parse(raw);
    if (!session.gameState || !session.arenaPhase) return null;

    return {
      arenaPhase: session.arenaPhase,
      opponents: session.opponents,
      gameState: deserializeGameState(session.gameState),
      pendingPhase: session.pendingPhase,
    };
  } catch {
    clearArenaSession();
    return null;
  }
}

export function clearArenaSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Unavailable — silently ignore
  }
}
