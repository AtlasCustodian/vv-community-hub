"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFaction } from "@/context/FactionContext";
import type { FactionId, Deck } from "@/types/game";
import { FACTION_THEMES, ALL_FACTION_IDS } from "@/lib/game/factionThemes";
import { loadDecks } from "@/lib/game/deckStorage";
import {
  getPlayerId,
  getPlayerName,
  setPlayerName,
  ensurePlayerRegistered,
} from "@/lib/game/playerIdentity";
import { loadDecksFromServer } from "@/lib/game/deckSync";
import type { RoomPlayer } from "@/lib/game/useOnlineGame";

type LobbyStep = "setup" | "waiting";
type GameMode = "2p" | "3p";

export default function OnlineLobbyPage() {
  const router = useRouter();
  const { factionId } = useFaction();
  const theme = FACTION_THEMES[factionId];

  const [step, setStep] = useState<LobbyStep>("setup");
  const [mode, setMode] = useState<GameMode>("2p");
  const [displayName, setDisplayName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinMode, setJoinMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Room state
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Deck selection
  const [selectedDeckType, setSelectedDeckType] = useState<"template" | "custom">("template");
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [customDecks, setCustomDecks] = useState<Deck[]>([]);

  useEffect(() => {
    setMounted(true);
    const name = getPlayerName();
    if (name) setDisplayName(name);

    const local = loadDecks();
    setCustomDecks(local[factionId] ?? []);

    loadDecksFromServer().then((serverDecks) => {
      const matching = serverDecks.filter((d) => d.factionId === factionId);
      if (matching.length > 0) {
        setCustomDecks((prev) => {
          const merged = [...prev];
          for (const sd of matching) {
            if (!merged.find((d) => d.id === sd.id)) merged.push(sd);
          }
          return merged;
        });
      }
    }).catch(() => {});
  }, [factionId]);

  // Poll room state when waiting
  useEffect(() => {
    if (!currentRoomId || step !== "waiting") return;
    let cancelled = false;
    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/arena/rooms/${currentRoomId}`);
        if (!res.ok) return;
        const data = await res.json();
        setPlayers(data.players ?? []);
        if (data.status === "playing") {
          router.push(`/champion-arena/online/${currentRoomId}`);
          return;
        }
      } catch {
        // ignore
      }
      if (!cancelled) setTimeout(poll, 2000);
    };
    poll();
    return () => { cancelled = true; };
  }, [currentRoomId, step, router]);

  const handleRegister = useCallback(async () => {
    if (!displayName.trim()) return;
    setPlayerName(displayName.trim());
    await ensurePlayerRegistered(displayName.trim());
  }, [displayName]);

  async function handleCreateRoom() {
    if (!displayName.trim()) {
      setError("Enter a display name");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await handleRegister();

      const deckId = selectedDeckType === "custom" && selectedDeckId ? selectedDeckId : undefined;

      const res = await fetch("/api/arena/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: getPlayerId(),
          factionId,
          mode,
          deckId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create room");

      setCurrentRoomId(data.roomId);
      setIsHost(true);
      setStep("waiting");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinRoom() {
    if (!displayName.trim()) {
      setError("Enter a display name");
      return;
    }
    if (!roomCode.trim()) {
      setError("Enter a room code");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await handleRegister();

      const deckId = selectedDeckType === "custom" && selectedDeckId ? selectedDeckId : undefined;

      const res = await fetch(`/api/arena/rooms/${roomCode.trim().toUpperCase()}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: getPlayerId(),
          factionId,
          deckId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join room");

      setCurrentRoomId(roomCode.trim().toUpperCase());
      setIsHost(false);
      setStep("waiting");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function handleReady() {
    if (!currentRoomId) return;
    try {
      const deckId = selectedDeckType === "custom" && selectedDeckId ? selectedDeckId : undefined;
      await fetch(`/api/arena/rooms/${currentRoomId}/ready`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: getPlayerId(),
          isReady: !isReady,
          deckId,
        }),
      });
      setIsReady(!isReady);
    } catch {
      // ignore
    }
  }

  async function handleStart() {
    if (!currentRoomId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/arena/rooms/${currentRoomId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: getPlayerId() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start game");

      router.push(`/champion-arena/online/${currentRoomId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  const myPlayerId = getPlayerId();
  const expectedPlayers = mode === "3p" ? 3 : 2;
  const allReady = players.length >= expectedPlayers && players.every((p) => p.isReady);

  // ── Waiting Room ──────────────────────────────────────────────────────────
  if (step === "waiting" && currentRoomId) {
    return (
      <div className="champion-arena min-h-[calc(100vh-3.5rem)] md:min-h-screen flex flex-col items-center justify-center relative px-4">
        <div className="absolute inset-0 board-bg" style={{ borderRadius: 0 }} />

        <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg w-full">
          <div className="text-center animate-fade-in">
            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`,
              }}
            >
              Waiting Room
            </h1>
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-widest">
                Room Code
              </span>
              <span
                className="text-2xl font-mono font-bold tracking-[0.3em] px-4 py-2 rounded-xl border"
                style={{
                  color: theme.primary,
                  borderColor: `${theme.primary}40`,
                  background: `${theme.primary}10`,
                }}
              >
                {currentRoomId}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Share this code with your opponent{mode === "3p" ? "s" : ""}
            </p>
          </div>

          {/* Player list */}
          <div className="w-full space-y-3">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest text-center">
              Players ({players.length}/{expectedPlayers})
            </p>
            {players.map((p) => {
              const pTheme = FACTION_THEMES[p.factionId as FactionId];
              return (
                <div
                  key={p.playerId}
                  className="flex items-center gap-3 rounded-xl border px-4 py-3"
                  style={{
                    borderColor: `${pTheme?.primary ?? "#666"}30`,
                    background: `${pTheme?.primary ?? "#666"}08`,
                  }}
                >
                  <span className="text-xl">{pTheme?.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: pTheme?.primary }}>
                      {p.displayName}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {pTheme?.name ?? p.factionId}
                      {p.playerId === myPlayerId ? " (you)" : ""}
                    </p>
                  </div>
                  <span
                    className="text-xs font-mono uppercase tracking-wider px-2 py-1 rounded-md"
                    style={{
                      color: p.isReady ? "#4ade80" : "#facc15",
                      background: p.isReady ? "rgba(74, 222, 128, 0.1)" : "rgba(250, 204, 21, 0.1)",
                    }}
                  >
                    {p.isReady ? "Ready" : "Waiting"}
                  </span>
                </div>
              );
            })}
            {Array.from({ length: expectedPlayers - players.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center justify-center rounded-xl border-2 border-dashed px-4 py-4"
                style={{ borderColor: "var(--border-dim)" }}
              >
                <span className="text-xs text-[var(--text-muted)]">Waiting for player...</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={handleReady}
              className="btn-holo px-6 py-2.5 text-sm"
              style={{ borderColor: isReady ? "rgba(74, 222, 128, 0.4)" : `${theme.primary}60` }}
            >
              {isReady ? "Unready" : "Ready Up"}
            </button>
            {isHost && (
              <button
                onClick={handleStart}
                disabled={!allReady || loading}
                className="btn-holo px-6 py-2.5 text-sm disabled:opacity-30"
                style={{ borderColor: `${theme.primary}60` }}
              >
                {loading ? "Starting..." : "Start Game"}
              </button>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}
        </div>
      </div>
    );
  }

  // ── Setup Screen ──────────────────────────────────────────────────────────
  return (
    <div className="champion-arena min-h-[calc(100vh-3.5rem)] md:min-h-screen flex flex-col items-center justify-center relative px-4">
      <div className="absolute inset-0 board-bg" style={{ borderRadius: 0 }} />

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full">
        <div className="text-center animate-fade-in">
          <h1
            className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`,
            }}
          >
            Online Arena
          </h1>
          <p className="text-sm mt-2 text-[var(--text-muted)]">
            Play against opponents on other machines
          </p>
        </div>

        {/* Display name */}
        <div className="w-full">
          <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your name..."
            maxLength={20}
            className="w-full rounded-xl border px-4 py-3 text-sm bg-[var(--bg-elevated)] text-[var(--text-foreground)] placeholder:text-[var(--text-muted)]"
            style={{ borderColor: `${theme.primary}30` }}
          />
        </div>

        {/* Mode select */}
        <div className="w-full">
          <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2">
            Game Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["2p", "3p"] as GameMode[]).map((m) => {
              const selected = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="rounded-xl border px-4 py-3 text-sm font-semibold transition-all"
                  style={{
                    borderColor: selected ? theme.primary : "var(--border-dim)",
                    background: selected ? `${theme.primary}12` : "transparent",
                    color: selected ? theme.primary : "var(--text-foreground)",
                    boxShadow: selected ? `0 0 12px ${theme.primary}20` : "none",
                  }}
                >
                  {m === "2p" ? "2 Players" : "3 Players"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Faction display */}
        <div className="w-full">
          <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2">
            Your Faction
          </label>
          <div
            className="flex items-center gap-3 rounded-xl border px-4 py-3"
            style={{
              borderColor: `${theme.primary}40`,
              background: `${theme.primary}10`,
            }}
          >
            <span className="text-2xl">{theme.emoji}</span>
            <div>
              <p className="text-sm font-bold" style={{ color: theme.primary }}>
                {theme.name}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{theme.tagline}</p>
            </div>
          </div>
        </div>

        {/* Deck selection */}
        <div className="w-full">
          <label className="block text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2">
            Select Deck
          </label>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => { setSelectedDeckType("template"); setSelectedDeckId(null); }}
              className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all text-left"
              style={{
                borderColor: selectedDeckType === "template" ? theme.primary : "var(--border-dim)",
                background: selectedDeckType === "template" ? `${theme.primary}12` : "transparent",
              }}
            >
              <span className="text-lg">🃏</span>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: selectedDeckType === "template" ? theme.primary : "var(--text-foreground)" }}>
                  Template Deck
                </p>
                <p className="text-xs text-[var(--text-muted)]">Auto-generated from all faction champions</p>
              </div>
            </button>
            {customDecks.map((deck) => {
              const isSelected = selectedDeckType === "custom" && selectedDeckId === deck.id;
              const isEmpty = deck.cards.length === 0;
              return (
                <button
                  key={deck.id}
                  onClick={() => { if (!isEmpty) { setSelectedDeckType("custom"); setSelectedDeckId(deck.id); } }}
                  disabled={isEmpty}
                  className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all text-left disabled:opacity-40"
                  style={{
                    borderColor: isSelected ? theme.primary : "var(--border-dim)",
                    background: isSelected ? `${theme.primary}12` : "transparent",
                  }}
                >
                  <span className="text-lg">⚒️</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: isSelected ? theme.primary : "var(--text-foreground)" }}>
                      {deck.name}
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {deck.cards.length} card{deck.cards.length !== 1 ? "s" : ""}
                      {isEmpty ? " — empty" : ""}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Create / Join */}
        {!joinMode ? (
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleCreateRoom}
              disabled={loading || !displayName.trim()}
              className="btn-holo w-full py-3 text-sm font-semibold disabled:opacity-30"
              style={{ borderColor: `${theme.primary}60` }}
            >
              {loading ? "Creating..." : "Create Room"}
            </button>
            <button
              onClick={() => setJoinMode(true)}
              className="btn-holo w-full py-3 text-sm font-semibold"
            >
              Join Room
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            <div className="flex gap-2">
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="ROOM CODE"
                maxLength={6}
                className="flex-1 rounded-xl border px-4 py-3 text-sm font-mono tracking-widest text-center bg-[var(--bg-elevated)] text-[var(--text-foreground)] placeholder:text-[var(--text-muted)] uppercase"
                style={{ borderColor: `${theme.primary}30` }}
              />
            </div>
            <button
              onClick={handleJoinRoom}
              disabled={loading || !displayName.trim() || !roomCode.trim()}
              className="btn-holo w-full py-3 text-sm font-semibold disabled:opacity-30"
              style={{ borderColor: `${theme.primary}60` }}
            >
              {loading ? "Joining..." : "Join Room"}
            </button>
            <button
              onClick={() => { setJoinMode(false); setRoomCode(""); }}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text-foreground)] transition-colors"
            >
              Back
            </button>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
