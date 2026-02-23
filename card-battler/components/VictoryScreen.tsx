"use client";

import type { GameState } from "@/types/game";
import { FACTION_THEMES } from "@/lib/factionThemes";

interface VictoryScreenProps {
  state: GameState;
  onRestart: () => void;
}

export default function VictoryScreen({ state, onRestart }: VictoryScreenProps) {
  const winner =
    state.winner !== null ? state.players[state.winner] : null;
  const winTheme = winner ? FACTION_THEMES[winner.factionId] : null;

  const sortedPlayers = [...state.players].sort((a, b) => b.score - a.score);

  return (
    <div className="interstitial-overlay">
      <div className="flex flex-col items-center gap-8 animate-slide-up max-w-lg text-center">
        {winner && winTheme && (
          <>
            <span className="text-6xl">{winTheme.emoji}</span>
            <h1
              className="text-4xl font-bold"
              style={{ color: winTheme.primary }}
            >
              {winTheme.name} Wins!
            </h1>
            <p className="text-[var(--text-muted)]">
              After {state.turnNumber} turns of battle
            </p>
          </>
        )}

        {/* Final standings */}
        <div className="w-full space-y-3 mt-4">
          {sortedPlayers.map((player, i) => {
            const theme = FACTION_THEMES[player.factionId];
            return (
              <div
                key={player.id}
                className="player-panel px-4 py-3 flex items-center justify-between"
                style={{
                  borderColor: i === 0 ? theme.primary : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-[var(--text-muted)] w-6">
                    #{i + 1}
                  </span>
                  <span className="text-lg">{theme.emoji}</span>
                  <span
                    className="font-bold"
                    style={{ color: theme.primary }}
                  >
                    {theme.name}
                  </span>
                  {player.isEliminated && (
                    <span className="text-xs text-red-400 ml-2">
                      ELIMINATED
                    </span>
                  )}
                </div>
                <span
                  className="score-display text-xl font-mono font-bold"
                  style={{ color: theme.primary }}
                >
                  {player.score}
                </span>
              </div>
            );
          })}
        </div>

        {/* Game log summary */}
        <div className="w-full mt-4 player-panel p-4 max-h-48 overflow-y-auto text-left">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">
            Battle Log
          </p>
          {state.log.slice(-10).map((entry, i) => (
            <p key={i} className="text-xs text-[var(--text-muted)] mb-1">
              {entry}
            </p>
          ))}
        </div>

        <div className="flex gap-4">
          <button className="btn-holo px-8 py-3 text-lg" onClick={onRestart}>
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
