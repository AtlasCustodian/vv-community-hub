"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useFaction } from "@/context/FactionContext";
import type { GameState, FactionId, RawChampion, HexCoord, Card, Deck, AIDifficulty } from "@/types/game";
import { buildDecks } from "@/lib/game/cardBuilder";
import { loadDecks } from "@/lib/game/deckStorage";
import {
  createInitialGameState,
  completeDraft,
  placeChampion,
  getProjectedPoints,
  autoDrawCard,
  willDeployBeAvailable,
} from "@/lib/game/gameEngine";
import {
  aiDraft,
  aiPlace,
  aiPlanTurn,
  aiHandleInterstitial,
} from "@/lib/game/aiPlayer";
import { FACTION_THEMES, pickRandomFactionsExcluding } from "@/lib/game/factionThemes";
import {
  saveArenaSession,
  loadArenaSession,
  clearArenaSession,
} from "@/lib/game/saveState";
import DraftPhase from "@/components/game/DraftPhase";
import PlacementPhase from "@/components/game/PlacementPhase";
import TurnPhase from "@/components/game/TurnPhase";
import VictoryScreen from "@/components/game/VictoryScreen";
import Interstitial from "@/components/game/Interstitial";
import ScoreTracker from "@/components/game/ScoreTracker";
import RulesOverlay from "@/components/game/RulesOverlay";

type ArenaPhase = "lobby" | "playing";

export default function ChampionArenaPage() {
  const { factionId } = useFaction();
  const [arenaPhase, setArenaPhase] = useState<ArenaPhase>("lobby");
  const [opponents, setOpponents] = useState<FactionId[]>([]);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [rolling, setRolling] = useState(false);

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingPhase, setPendingPhase] = useState<GameState["phase"] | null>(null);
  const [showRules, setShowRules] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [savedSession, setSavedSession] = useState<ReturnType<typeof loadArenaSession>>(null);
  const restoringRef = useRef(false);

  const [selectedDeckType, setSelectedDeckType] = useState<"template" | "custom">("template");
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [customDecks, setCustomDecks] = useState<Deck[]>([]);

  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>("medium");
  const aiActionsQueueRef = useRef<{ type: string; apply: (s: GameState) => GameState }[]>([]);

  const playerFactionTheme = FACTION_THEMES[factionId];
  const allRevealed = revealIndex >= 1;
  const allFactions = opponents.length > 0 ? [factionId, ...opponents] : [];

  function handleRollOpponents() {
    setRolling(true);
    const rolled = pickRandomFactionsExcluding(2, factionId);
    setOpponents(rolled);
    setRevealIndex(-1);

    setTimeout(() => setRevealIndex(0), 600);
    setTimeout(() => setRevealIndex(1), 1200);
  }

  function handleRestart() {
    aiActionsQueueRef.current = [];
    clearArenaSession();
    setSavedSession(null);
    setArenaPhase("lobby");
    setGameState(null);
    setLoading(false);
    setError(null);
    setPendingPhase(null);
    setOpponents([]);
    setRevealIndex(-1);
    setRolling(false);
    setSelectedDeckType("template");
    setSelectedDeckId(null);
  }

  function handleResume() {
    const session = loadArenaSession();
    if (!session) return;
    restoringRef.current = true;
    setArenaPhase(session.arenaPhase);
    setOpponents(session.opponents);
    setGameState(session.gameState);
    setPendingPhase(session.pendingPhase);
    setSavedSession(null);
    restoringRef.current = false;
  }

  const initGame = useCallback(async (factions: FactionId[], playerCustomDeck?: Card[]) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/champions?factions=${factions.join(",")}`);
      if (!res.ok) throw new Error("Failed to fetch champions");

      const rawData: Record<string, { id: string; name: string; returnRate: number; stabilityScore: number }[]> =
        await res.json();

      const rawByFaction: Record<string, RawChampion[]> = {};
      for (const [fid, champs] of Object.entries(rawData)) {
        rawByFaction[fid] = champs.map((c) => ({
          ...c,
          faction_id: fid as FactionId,
        }));
      }

      const decks = buildDecks(rawByFaction);

      if (playerCustomDeck) {
        decks[factions[0]] = playerCustomDeck;
      }

      const state = createInitialGameState(decks, factions);
      setGameState(state);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }, []);

  function handleBeginBattle() {
    if (allFactions.length !== 3) return;
    setArenaPhase("playing");

    let playerDeck: Card[] | undefined;
    if (selectedDeckType === "custom" && selectedDeckId) {
      const deck = customDecks.find((d) => d.id === selectedDeckId);
      if (deck && deck.cards.length > 0) {
        playerDeck = deck.cards.map((dc) => ({
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
      }
    }

    initGame(allFactions as FactionId[], playerDeck);
  }

  function handleStateChange(newState: GameState) {
    if (newState.phase === "victory") {
      clearArenaSession();
      setSavedSession(null);
    }
    if (newState.phase === "interstitial") {
      setPendingPhase(newState.phase);
      setGameState(newState);
    } else {
      setGameState(newState);
    }
  }

  function handleInterstitialContinue() {
    if (!gameState) return;

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

    let newState: GameState = { ...gameState, phase: nextPhase };
    if (nextPhase === "turn" && willDeployBeAvailable(newState)) {
      newState = autoDrawCard(newState);
    }

    setGameState(newState);
    setPendingPhase(null);
  }

  function handleDraftComplete(selectedCardIds: string[]) {
    if (!gameState) return;
    const newState = completeDraft(
      gameState,
      gameState.currentPlayerIndex,
      selectedCardIds
    );
    handleStateChange(newState);
  }

  function handlePlace(cardId: string, position: HexCoord) {
    if (!gameState) return;
    const newState = placeChampion(
      gameState,
      gameState.currentPlayerIndex,
      cardId,
      position
    );
    handleStateChange(newState);
  }

  // Reset lobby state when faction changes
  useEffect(() => {
    if (arenaPhase === "lobby") {
      setOpponents([]);
      setRevealIndex(-1);
      setRolling(false);
      setSelectedDeckType("template");
      setSelectedDeckId(null);
    }
  }, [factionId]);

  // Load custom decks from localStorage
  useEffect(() => {
    const allDecks = loadDecks();
    setCustomDecks(allDecks[factionId] ?? []);
  }, [factionId]);

  // Load saved session on mount
  useEffect(() => {
    const session = loadArenaSession();
    if (session) {
      setSavedSession(session);
    }
    setMounted(true);
  }, []);

  // Persist game state to localStorage whenever it changes
  useEffect(() => {
    if (!mounted || restoringRef.current) return;
    if (arenaPhase === "playing" && gameState && gameState.phase !== "victory") {
      saveArenaSession(arenaPhase, opponents, gameState, pendingPhase);
    }
  }, [mounted, arenaPhase, opponents, gameState, pendingPhase]);

  // AI turn handling — player 0 is human, all others are AI.
  // Uses a queue ref so each action triggers a state update, which re-renders,
  // which fires this effect again to process the next queued action.
  useEffect(() => {
    if (!gameState || arenaPhase !== "playing") return;
    if (gameState.phase === "victory") return;

    const isAiPlayer = gameState.currentPlayerIndex > 0;
    if (!isAiPlayer) {
      aiActionsQueueRef.current = [];
      return;
    }

    if (gameState.phase === "interstitial") {
      const timer = setTimeout(() => {
        const nextState = aiHandleInterstitial(gameState);
        setGameState(nextState);
        setPendingPhase(null);
      }, 400);
      return () => clearTimeout(timer);
    }

    if (gameState.phase === "draft") {
      const timer = setTimeout(() => {
        const selectedIds = aiDraft(gameState, aiDifficulty);
        const nextState = completeDraft(gameState, gameState.currentPlayerIndex, selectedIds);
        handleStateChange(nextState);
      }, 600);
      return () => clearTimeout(timer);
    }

    if (gameState.phase === "placement") {
      const timer = setTimeout(() => {
        const { cardId, position } = aiPlace(gameState, aiDifficulty);
        const nextState = placeChampion(gameState, gameState.currentPlayerIndex, cardId, position);
        handleStateChange(nextState);
      }, 600);
      return () => clearTimeout(timer);
    }

    if (gameState.phase === "turn") {
      if (aiActionsQueueRef.current.length === 0) {
        aiActionsQueueRef.current = aiPlanTurn(gameState, aiDifficulty);
      }

      const nextAction = aiActionsQueueRef.current[0];
      if (!nextAction) return;

      const delay = nextAction.type === "endTurn" ? 300 : 600;
      const timer = setTimeout(() => {
        const newState = nextAction.apply(gameState);
        aiActionsQueueRef.current = aiActionsQueueRef.current.slice(1);

        if (newState.phase === "victory") {
          clearArenaSession();
          setSavedSession(null);
          aiActionsQueueRef.current = [];
        }
        if (newState.phase === "interstitial") {
          setPendingPhase(newState.phase);
        }
        setGameState(newState);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [gameState, arenaPhase, aiDifficulty]);

  const projectedPoints: Record<number, number> = {};
  if (gameState?.phase === "turn") {
    for (const p of gameState.players) {
      projectedPoints[p.id] = getProjectedPoints(gameState, p.id);
    }
  }

  // --- Lobby Phase ---
  if (arenaPhase === "lobby") {
    return (
      <div className="champion-arena min-h-[calc(100vh-3.5rem)] md:min-h-screen flex flex-col items-center justify-center relative px-4">
        <div
          className="absolute inset-0 board-bg"
          style={{ borderRadius: 0 }}
        />

        <div className="relative z-10 flex flex-col items-center gap-10">
          <div className="text-center animate-fade-in">
            <h1
              className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${playerFactionTheme.gradientFrom}, ${playerFactionTheme.gradientTo})`,
              }}
            >
              Champion Arena
            </h1>
            <p className="text-base md:text-lg mt-2 text-[var(--text-muted)] tracking-widest uppercase">
              Card Battler
            </p>
          </div>

          {/* Faction cards */}
          <div className="flex gap-4 md:gap-6 mt-4 flex-wrap justify-center">
            {/* Player's faction (always revealed) */}
            <div
              className="w-40 md:w-48 h-56 md:h-64 rounded-xl border flex flex-col items-center justify-center gap-3 animate-card-reveal"
              style={{
                borderColor: playerFactionTheme.primary,
                background: `linear-gradient(135deg, ${playerFactionTheme.gradientFrom}15, ${playerFactionTheme.gradientTo}15)`,
                boxShadow: `0 0 24px ${playerFactionTheme.primary}30`,
              }}
            >
              <span className="text-4xl">{playerFactionTheme.emoji}</span>
              <span
                className="text-lg font-bold"
                style={{ color: playerFactionTheme.primary }}
              >
                {playerFactionTheme.name}
              </span>
              <span className="text-xs text-[var(--text-muted)] px-4 text-center">
                {playerFactionTheme.tagline}
              </span>
              <span
                className="text-xs font-mono uppercase tracking-wider font-bold"
                style={{ color: playerFactionTheme.secondary }}
              >
                Your Faction
              </span>
            </div>

            {/* Opponents */}
            {opponents.map((fid, i) => {
              const theme = FACTION_THEMES[fid];
              const revealed = revealIndex >= i;

              return (
                <div
                  key={fid}
                  className={`w-40 md:w-48 h-56 md:h-64 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-500 ${
                    revealed ? "animate-card-reveal" : "opacity-0 scale-90"
                  }`}
                  style={{
                    borderColor: revealed ? theme.primary : "transparent",
                    background: revealed
                      ? `linear-gradient(135deg, ${theme.gradientFrom}15, ${theme.gradientTo}15)`
                      : "var(--bg-elevated)",
                    boxShadow: revealed ? `0 0 24px ${theme.primary}30` : "none",
                    animationDelay: `${i * 0.3}s`,
                  }}
                >
                  <span className="text-4xl">{theme.emoji}</span>
                  <span
                    className="text-lg font-bold"
                    style={{ color: theme.primary }}
                  >
                    {theme.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] px-4 text-center">
                    {theme.tagline}
                  </span>
                  <span
                    className="text-xs font-mono uppercase tracking-wider"
                    style={{ color: theme.secondary }}
                  >
                    Opponent {i + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Deck selection */}
          {allRevealed && (
            <div className="w-full max-w-md animate-fade-in">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest text-center mb-3">
                Select Your Deck
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { setSelectedDeckType("template"); setSelectedDeckId(null); }}
                  className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all text-left"
                  style={{
                    borderColor: selectedDeckType === "template" ? playerFactionTheme.primary : "var(--border-dim)",
                    background: selectedDeckType === "template"
                      ? `linear-gradient(135deg, ${playerFactionTheme.gradientFrom}12, ${playerFactionTheme.gradientTo}12)`
                      : "transparent",
                    boxShadow: selectedDeckType === "template" ? `0 0 12px ${playerFactionTheme.primary}20` : "none",
                  }}
                >
                  <span className="text-lg">🃏</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: selectedDeckType === "template" ? playerFactionTheme.primary : "var(--text-foreground)" }}>
                      Template Deck
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Auto-generated from all faction champions
                    </p>
                  </div>
                  {selectedDeckType === "template" && (
                    <span className="text-xs font-mono uppercase tracking-wider" style={{ color: playerFactionTheme.primary }}>
                      Selected
                    </span>
                  )}
                </button>

                {customDecks.map((deck) => {
                  const isSelected = selectedDeckType === "custom" && selectedDeckId === deck.id;
                  const isEmpty = deck.cards.length === 0;
                  return (
                    <button
                      key={deck.id}
                      onClick={() => {
                        if (isEmpty) return;
                        setSelectedDeckType("custom");
                        setSelectedDeckId(deck.id);
                      }}
                      disabled={isEmpty}
                      className="flex items-center gap-3 rounded-xl border px-4 py-3 transition-all text-left disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        borderColor: isSelected ? playerFactionTheme.primary : "var(--border-dim)",
                        background: isSelected
                          ? `linear-gradient(135deg, ${playerFactionTheme.gradientFrom}12, ${playerFactionTheme.gradientTo}12)`
                          : "transparent",
                        boxShadow: isSelected ? `0 0 12px ${playerFactionTheme.primary}20` : "none",
                      }}
                    >
                      <span className="text-lg">⚒️</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold" style={{ color: isSelected ? playerFactionTheme.primary : "var(--text-foreground)" }}>
                          {deck.name}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {deck.cards.length} card{deck.cards.length !== 1 ? "s" : ""}
                          {isEmpty ? " — empty" : ""}
                        </p>
                      </div>
                      {isSelected && (
                        <span className="text-xs font-mono uppercase tracking-wider" style={{ color: playerFactionTheme.primary }}>
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })}

                {customDecks.length === 0 && (
                  <p className="text-xs text-[var(--text-muted)] text-center py-2 italic">
                    No custom decks yet — build one in the Deck Builder
                  </p>
                )}
              </div>
            </div>
          )}

          {/* AI Difficulty */}
          {allRevealed && (
            <div className="w-full max-w-md animate-fade-in">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest text-center mb-3">
                AI Difficulty
              </p>
              <div className="flex gap-2 justify-center">
                {(["easy", "medium", "hard"] as const).map((level) => {
                  const isSelected = aiDifficulty === level;
                  const labels = { easy: "Easy", medium: "Medium", hard: "Hard" };
                  const descriptions = {
                    easy: "Random moves",
                    medium: "Smart tactics",
                    hard: "Ruthless strategy",
                  };
                  return (
                    <button
                      key={level}
                      onClick={() => setAiDifficulty(level)}
                      className="flex-1 rounded-xl border px-3 py-3 transition-all text-center"
                      style={{
                        borderColor: isSelected ? playerFactionTheme.primary : "var(--border-dim)",
                        background: isSelected
                          ? `linear-gradient(135deg, ${playerFactionTheme.gradientFrom}12, ${playerFactionTheme.gradientTo}12)`
                          : "transparent",
                        boxShadow: isSelected ? `0 0 12px ${playerFactionTheme.primary}20` : "none",
                      }}
                    >
                      <p
                        className="text-sm font-semibold"
                        style={{ color: isSelected ? playerFactionTheme.primary : "var(--text-foreground)" }}
                      >
                        {labels[level]}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                        {descriptions[level]}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 mt-4 flex-wrap justify-center">
            {!rolling && (
              <button
                onClick={handleRollOpponents}
                className="btn-holo text-base md:text-lg px-6 md:px-8 py-3"
              >
                Roll Opponents
              </button>
            )}

            {allRevealed && (
              <button
                onClick={handleBeginBattle}
                className="btn-holo text-base md:text-lg px-6 md:px-8 py-3 animate-fade-in"
                style={{ borderColor: `${playerFactionTheme.primary}60` }}
              >
                Begin Battle
              </button>
            )}

            {allRevealed && (
              <button
                onClick={() => {
                  setRolling(false);
                  setOpponents([]);
                  setRevealIndex(-1);
                }}
                className="btn-holo text-base md:text-lg px-6 md:px-8 py-3 animate-fade-in"
              >
                Re-roll
              </button>
            )}
          </div>

          {/* Online Play link */}
          <div className="flex flex-col items-center gap-2 animate-fade-in">
            <div className="h-px w-32 bg-[var(--border-dim)]" />
            <Link
              href="/champion-arena/online"
              className="btn-holo text-sm px-6 py-2.5"
              style={{ borderColor: `${playerFactionTheme.primary}40` }}
            >
              Online Play
            </Link>
            <p className="text-xs text-[var(--text-muted)]">
              Play against opponents on other machines
            </p>
          </div>

          {/* Resume saved game */}
          {mounted && savedSession && (
            <div className="flex flex-col items-center gap-3 animate-fade-in">
              <div className="h-px w-32 bg-[var(--border-dim)]" />
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest">
                Saved Battle &mdash; Round {savedSession.gameState.turnNumber}
              </p>
              <div className="flex gap-2">
                {[
                  savedSession.gameState.players[0]?.factionId,
                  ...savedSession.opponents,
                ].filter(Boolean).map((fid) => {
                  const t = FACTION_THEMES[fid as FactionId];
                  return (
                    <span key={fid} className="text-lg" title={t?.name}>
                      {t?.emoji}
                    </span>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleResume}
                  className="btn-holo px-6 py-2 text-sm"
                  style={{ borderColor: `${playerFactionTheme.primary}60` }}
                >
                  Resume Battle
                </button>
                <button
                  onClick={() => {
                    clearArenaSession();
                    setSavedSession(null);
                  }}
                  className="btn-holo px-6 py-2 text-sm opacity-60 hover:opacity-100 transition-opacity"
                >
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Loading ---
  if (loading) {
    return (
      <div className="champion-arena min-h-[calc(100vh-3.5rem)] md:min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-4xl mb-4 holo-flicker">
            {playerFactionTheme.emoji}
          </div>
          <p className="text-[var(--text-muted)] tracking-widest uppercase">
            Loading Battle...
          </p>
        </div>
      </div>
    );
  }

  // --- Error ---
  if (error) {
    return (
      <div className="champion-arena min-h-[calc(100vh-3.5rem)] md:min-h-screen flex items-center justify-center">
        <div className="text-center player-panel p-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button className="btn-holo" onClick={handleRestart}>
            Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  if (!gameState) return null;

  // --- Game ---
  return (
    <div className="champion-arena h-[calc(100vh-3.5rem)] md:h-screen flex flex-col board-bg overflow-hidden">
      {/* Score bar */}
      <div className="py-2 md:py-3 px-3 md:px-4 border-b border-[var(--border-dim)] flex items-center shrink-0">
        <button
          className="btn-holo px-2 md:px-3 py-1 md:py-1.5 text-xs shrink-0 mr-2 md:mr-3"
          onClick={() => setShowRules(true)}
        >
          Rules
        </button>
        <div className="flex-1 overflow-x-auto">
          <ScoreTracker
            players={gameState.players}
            currentPlayerIndex={gameState.currentPlayerIndex}
            projectedPoints={gameState.phase === "turn" ? projectedPoints : undefined}
          />
        </div>
        <div className="player-panel px-3 md:px-4 py-1.5 md:py-2 text-center ml-2 md:ml-4 shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Round</p>
          <p className="text-lg md:text-xl font-mono font-bold score-display">{gameState.turnNumber}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center overflow-y-auto overflow-x-hidden p-2 md:p-4 min-h-0">
        <div className="z-10 w-full">
          {gameState.phase === "draft" && (
            <DraftPhase
              state={gameState}
              onDraftComplete={handleDraftComplete}
            />
          )}

          {gameState.phase === "placement" && (
            <PlacementPhase state={gameState} onPlace={handlePlace} />
          )}

          {gameState.phase === "turn" && (
            <TurnPhase
              state={gameState}
              onStateChange={handleStateChange}
            />
          )}
        </div>
      </div>

      {/* Game log */}
      <div className="px-3 md:px-4 py-1.5 md:py-2 border-t border-[var(--border-dim)] max-h-16 md:max-h-20 overflow-y-auto shrink-0">
        {gameState.log.slice(-3).map((entry, i) => (
          <p
            key={i}
            className="text-xs text-[var(--text-muted)] truncate"
          >
            {entry}
          </p>
        ))}
      </div>

      {/* Overlays */}
      {gameState.phase === "interstitial" && gameState.currentPlayerIndex === 0 && (
        <Interstitial
          player={gameState.players[gameState.currentPlayerIndex]}
          nextPhase={
            gameState.players[gameState.currentPlayerIndex].hand.length > 0
              ? gameState.turnNumber > 0
                ? "turn"
                : "placement"
              : "draft"
          }
          onContinue={handleInterstitialContinue}
        />
      )}

      {gameState.phase === "victory" && (
        <VictoryScreen
          state={gameState}
          onRestart={handleRestart}
        />
      )}

      {showRules && <RulesOverlay onClose={() => setShowRules(false)} />}
    </div>
  );
}
