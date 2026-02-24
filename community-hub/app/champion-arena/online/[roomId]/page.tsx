"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFaction } from "@/context/FactionContext";
import type { GameState, HexCoord, FactionId } from "@/types/game";
import { getProjectedPoints, autoDrawCard, willDeployBeAvailable } from "@/lib/game/gameEngine";
import { FACTION_THEMES } from "@/lib/game/factionThemes";
import { getPlayerId } from "@/lib/game/playerIdentity";
import { useOnlineGame } from "@/lib/game/useOnlineGame";
import DraftPhase from "@/components/game/DraftPhase";
import PlacementPhase from "@/components/game/PlacementPhase";
import TurnPhase from "@/components/game/TurnPhase";
import type { TurnAction } from "@/components/game/TurnPhase";
import VictoryScreen from "@/components/game/VictoryScreen";
import ScoreTracker from "@/components/game/ScoreTracker";
import RulesOverlay from "@/components/game/RulesOverlay";

export default function OnlineGamePage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;
  const { factionId } = useFaction();

  const [playerId, setPlayerId] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPlayerId(getPlayerId());
    setMounted(true);
  }, []);

  const {
    gameState,
    roomStatus,
    players,
    mySeat,
    isMyTurn,
    sending,
    sendAction,
  } = useOnlineGame(roomId, playerId);

  const myFactionTheme = FACTION_THEMES[factionId];

  const handleDraftComplete = useCallback(async (selectedCardIds: string[]) => {
    await sendAction({ type: "draft", selectedCardIds });
  }, [sendAction]);

  const handlePlace = useCallback(async (cardId: string, position: HexCoord) => {
    await sendAction({ type: "place", cardId, position });
  }, [sendAction]);

  const handleTurnAction = useCallback(async (action: TurnAction) => {
    await sendAction(action);
  }, [sendAction]);

  const handleStateChange = useCallback((_newState: GameState) => {
    // In online mode, state updates come from the server via SSE.
    // The local onStateChange from TurnPhase is used for optimistic UI
    // but the authoritative state arrives via the hook.
  }, []);

  const handleInterstitialContinue = useCallback(async () => {
    await sendAction({ type: "interstitialContinue" });
  }, [sendAction]);

  const handleRestart = useCallback(() => {
    router.push("/champion-arena/online");
  }, [router]);

  if (!mounted) return null;

  // Waiting for game to start
  if (roomStatus === "waiting" || !gameState) {
    return (
      <div className="champion-arena min-h-[calc(100vh-3.5rem)] md:min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="text-4xl mb-4 holo-flicker">{myFactionTheme.emoji}</div>
          <p className="text-[var(--text-muted)] tracking-widest uppercase">
            {roomStatus === "waiting" ? "Waiting for game to start..." : "Loading game..."}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-2">Room: {roomId}</p>
        </div>
      </div>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const currentTheme = FACTION_THEMES[currentPlayer?.factionId as FactionId];

  const projectedPoints: Record<number, number> = {};
  if (gameState.phase === "turn") {
    for (const p of gameState.players) {
      projectedPoints[p.id] = getProjectedPoints(gameState, p.id);
    }
  }

  const isMyInterstitial = gameState.phase === "interstitial" && mySeat === gameState.currentPlayerIndex;
  const isMyDraft = gameState.phase === "draft" && mySeat === gameState.currentPlayerIndex;
  const isMyPlacement = gameState.phase === "placement" && mySeat === gameState.currentPlayerIndex;

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

      {/* Turn indicator */}
      {gameState.phase !== "victory" && (
        <div
          className="px-4 py-2 text-center text-sm font-semibold shrink-0 border-b"
          style={{
            background: isMyTurn ? `${myFactionTheme.primary}15` : `${currentTheme?.primary ?? "#666"}10`,
            borderColor: "var(--border-dim)",
            color: isMyTurn ? myFactionTheme.primary : currentTheme?.primary ?? "#999",
          }}
        >
          {isMyTurn ? (
            <>Your Turn &mdash; {gameState.phase === "draft" ? "Draft" : gameState.phase === "placement" ? "Place" : "Play"}</>
          ) : (
            <>Waiting for {currentTheme?.name ?? "opponent"}...</>
          )}
          {sending && <span className="ml-2 text-xs opacity-60">(sending...)</span>}
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center overflow-y-auto overflow-x-hidden p-2 md:p-4 min-h-0">
        <div className="z-10 w-full">
          {gameState.phase === "draft" && isMyDraft && (
            <DraftPhase
              state={gameState}
              onDraftComplete={handleDraftComplete}
            />
          )}
          {gameState.phase === "draft" && !isMyDraft && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="text-4xl">{currentTheme?.emoji}</div>
              <p className="text-[var(--text-muted)] tracking-widest uppercase text-sm">
                {currentTheme?.name} is drafting...
              </p>
            </div>
          )}

          {gameState.phase === "placement" && isMyPlacement && (
            <PlacementPhase state={gameState} onPlace={handlePlace} />
          )}
          {gameState.phase === "placement" && !isMyPlacement && (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="text-4xl">{currentTheme?.emoji}</div>
              <p className="text-[var(--text-muted)] tracking-widest uppercase text-sm">
                {currentTheme?.name} is placing champions...
              </p>
            </div>
          )}

          {gameState.phase === "turn" && (
            <TurnPhase
              state={gameState}
              onStateChange={handleStateChange}
              onAction={handleTurnAction}
              disabled={!isMyTurn}
            />
          )}
        </div>
      </div>

      {/* Game log */}
      <div className="px-3 md:px-4 py-1.5 md:py-2 border-t border-[var(--border-dim)] max-h-16 md:max-h-20 overflow-y-auto shrink-0">
        {gameState.log.slice(-3).map((entry, i) => (
          <p key={i} className="text-xs text-[var(--text-muted)] truncate">
            {entry}
          </p>
        ))}
      </div>

      {/* Interstitial overlay (online version) */}
      {gameState.phase === "interstitial" && isMyInterstitial && (
        <div className="fixed inset-0 z-30 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 flex flex-col items-center gap-6 p-8">
            <div className="text-5xl">{myFactionTheme.emoji}</div>
            <h2
              className="text-2xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${myFactionTheme.gradientFrom}, ${myFactionTheme.gradientTo})`,
              }}
            >
              Your Turn
            </h2>
            <button
              onClick={handleInterstitialContinue}
              className="btn-holo px-8 py-3 text-lg"
              style={{ borderColor: `${myFactionTheme.primary}60` }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {gameState.phase === "interstitial" && !isMyInterstitial && (
        <div className="fixed inset-0 z-30 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative z-10 flex flex-col items-center gap-4 p-8">
            <div className="text-4xl holo-flicker">{currentTheme?.emoji}</div>
            <p className="text-[var(--text-muted)] tracking-widest uppercase">
              {currentTheme?.name}&apos;s turn...
            </p>
          </div>
        </div>
      )}

      {/* Victory */}
      {gameState.phase === "victory" && (
        <VictoryScreen state={gameState} onRestart={handleRestart} />
      )}

      {showRules && <RulesOverlay onClose={() => setShowRules(false)} />}
    </div>
  );
}
