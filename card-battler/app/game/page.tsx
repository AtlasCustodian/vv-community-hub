"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { GameState, FactionId, RawChampion, Card as CardType, HexCoord } from "@/types/game";
import { buildDecks } from "@/lib/cardBuilder";
import {
  createInitialGameState,
  completeDraft,
  placeChampion,
  getProjectedPoints,
} from "@/lib/gameEngine";
import { FACTION_THEMES } from "@/lib/factionThemes";
import DraftPhase from "@/components/DraftPhase";
import PlacementPhase from "@/components/PlacementPhase";
import TurnPhase from "@/components/TurnPhase";
import VictoryScreen from "@/components/VictoryScreen";
import Interstitial from "@/components/Interstitial";
import ScoreTracker from "@/components/ScoreTracker";
import PlayerArea from "@/components/PlayerArea";
import RulesOverlay from "@/components/RulesOverlay";

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingPhase, setPendingPhase] = useState<GameState["phase"] | null>(null);
  const [showRules, setShowRules] = useState(false);

  const factionIds = (searchParams.get("factions")?.split(",") ?? []) as FactionId[];

  const initGame = useCallback(async () => {
    if (factionIds.length !== 3) {
      setError("Invalid factions. Please start from the lobby.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `/api/champions?factions=${factionIds.join(",")}`
      );
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
      const state = createInitialGameState(decks, factionIds);
      setGameState(state);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  function handleStateChange(newState: GameState) {
    if (newState.phase === "interstitial") {
      setPendingPhase(newState.phase);
      setGameState(newState);
    } else {
      setGameState(newState);
    }
  }

  function handleInterstitialContinue() {
    if (!gameState) return;

    // Determine what phase to go to after interstitial
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

    setGameState({ ...gameState, phase: nextPhase });
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-4xl mb-4 holo-flicker">⚔️</div>
          <p className="text-[var(--text-muted)] tracking-widest uppercase">
            Loading Battle...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center player-panel p-8">
          <p className="text-red-400 mb-4">{error}</p>
          <button className="btn-holo" onClick={() => router.push("/")}>
            Back to Lobby
          </button>
        </div>
      </div>
    );
  }

  if (!gameState) return null;

  const projectedPoints: Record<number, number> = {};
  if (gameState.phase === "turn") {
    for (const p of gameState.players) {
      projectedPoints[p.id] = getProjectedPoints(gameState, p.id);
    }
  }

  return (
    <div className="h-screen flex flex-col board-bg">
      {/* Score bar */}
      <div className="py-3 px-4 border-b border-[var(--border-dim)] flex items-center">
        <button
          className="btn-holo px-3 py-1.5 text-xs shrink-0 mr-3"
          onClick={() => setShowRules(true)}
        >
          Rules
        </button>
        <div className="flex-1">
          <ScoreTracker
            players={gameState.players}
            currentPlayerIndex={gameState.currentPlayerIndex}
            projectedPoints={gameState.phase === "turn" ? projectedPoints : undefined}
          />
        </div>
        <div className="player-panel px-4 py-2 text-center ml-4 shrink-0">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Round</p>
          <p className="text-xl font-mono font-bold score-display">{gameState.turnNumber}</p>
        </div>
      </div>

      {/* Main content - three column layout */}
      <div className="flex-1 flex min-h-0">
        {/* Left sidebar - Player 1 */}
        {gameState.phase === "turn" && gameState.players[1] && (
          <div className="w-48 p-3 flex flex-col justify-center border-r border-[var(--border-dim)] shrink-0">
            <PlayerArea
              player={gameState.players[1]}
              isActive={gameState.currentPlayerIndex === 1}
              showHand={false}
              position="left"
              projectedPoints={projectedPoints[1]}
            />
          </div>
        )}

        {/* Center - Board & phases */}
        <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto p-4 min-w-0">
          {/* Player 0 compact bar above board during turn phase */}
          {gameState.phase === "turn" && gameState.players[0] && (
            <div className="mb-3 w-full max-w-sm">
              <PlayerArea
                player={gameState.players[0]}
                isActive={gameState.currentPlayerIndex === 0}
                showHand={false}
                position="top"
                projectedPoints={projectedPoints[0]}
              />
            </div>
          )}

          <div className="z-10 my-auto">
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

        {/* Right sidebar - Player 2 */}
        {gameState.phase === "turn" && gameState.players[2] && (
          <div className="w-48 p-3 flex flex-col justify-center border-l border-[var(--border-dim)] shrink-0">
            <PlayerArea
              player={gameState.players[2]}
              isActive={gameState.currentPlayerIndex === 2}
              showHand={false}
              position="right"
              projectedPoints={projectedPoints[2]}
            />
          </div>
        )}
      </div>

      {/* Game log */}
      <div className="px-4 py-2 border-t border-[var(--border-dim)] max-h-20 overflow-y-auto">
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
      {gameState.phase === "interstitial" && (
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
          onRestart={() => router.push("/")}
        />
      )}

      {showRules && <RulesOverlay onClose={() => setShowRules(false)} />}
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-[var(--text-muted)]">Loading...</p>
        </div>
      }
    >
      <GameContent />
    </Suspense>
  );
}
