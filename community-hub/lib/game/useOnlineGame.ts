"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { GameState, Card, HexCoord } from "@/types/game";

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

export interface RoomPlayer {
  playerId: string;
  displayName: string;
  seat: number;
  factionId: string;
  isReady: boolean;
}

interface RoomUpdate {
  status: string;
  gameState: SerializedGameState | null;
  players: RoomPlayer[];
  updatedAt: string;
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

type ActionPayload =
  | { type: "draft"; selectedCardIds: string[] }
  | { type: "place"; cardId: string; position: HexCoord }
  | { type: "move"; from: HexCoord; to: HexCoord }
  | { type: "attack"; from: HexCoord; to: HexCoord }
  | { type: "deploy"; cardId: string; position: HexCoord }
  | { type: "ability"; coord: HexCoord; targetCoord?: HexCoord }
  | { type: "endTurn" }
  | { type: "interstitialContinue" };

export function useOnlineGame(roomId: string | null, playerId: string | null) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [roomStatus, setRoomStatus] = useState<string>("waiting");
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [mySeat, setMySeat] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isMyTurn = gameState !== null && mySeat !== null && gameState.currentPlayerIndex === mySeat;

  // Determine seat from players list
  useEffect(() => {
    if (!playerId || players.length === 0) return;
    const me = players.find((p) => p.playerId === playerId);
    if (me) setMySeat(me.seat);
  }, [players, playerId]);

  // SSE connection with polling fallback
  useEffect(() => {
    if (!roomId) return;

    let closed = false;

    const handleUpdate = (data: RoomUpdate) => {
      setRoomStatus(data.status);
      setPlayers(data.players ?? []);
      if (data.gameState) {
        setGameState(deserialize(data.gameState));
      }
    };

    const connectSSE = () => {
      if (closed) return;
      const es = new EventSource(`/api/arena/rooms/${roomId}/stream`);
      eventSourceRef.current = es;

      es.addEventListener("update", (e) => {
        try {
          const data = JSON.parse(e.data) as RoomUpdate;
          handleUpdate(data);
        } catch {
          // ignore parse errors
        }
      });

      es.addEventListener("error", () => {
        es.close();
        eventSourceRef.current = null;
        if (!closed) {
          // Fall back to polling
          startPolling();
        }
      });
    };

    const startPolling = () => {
      if (closed || pollRef.current) return;
      pollRef.current = setInterval(async () => {
        if (closed) return;
        try {
          const res = await fetch(`/api/arena/rooms/${roomId}`);
          if (!res.ok) return;
          const data = await res.json();
          setRoomStatus(data.status);
          setPlayers(data.players ?? []);
          if (data.gameState) {
            setGameState(deserialize(data.gameState));
          }
        } catch {
          // ignore
        }
      }, 3000);
    };

    connectSSE();

    return () => {
      closed = true;
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [roomId]);

  const sendAction = useCallback(
    async (action: ActionPayload): Promise<boolean> => {
      if (!roomId || !playerId) return false;
      setSending(true);
      try {
        const res = await fetch(`/api/arena/rooms/${roomId}/action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId, action }),
        });
        const data = await res.json();
        if (res.ok && data.gameState) {
          setGameState(deserialize(data.gameState));
        }
        return res.ok;
      } catch {
        return false;
      } finally {
        setSending(false);
      }
    },
    [roomId, playerId],
  );

  return {
    gameState,
    roomStatus,
    players,
    mySeat,
    isMyTurn,
    sending,
    sendAction,
  };
}
