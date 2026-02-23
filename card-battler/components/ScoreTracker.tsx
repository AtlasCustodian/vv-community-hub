"use client";

import type { Player } from "@/types/game";
import { FACTION_THEMES } from "@/lib/factionThemes";

interface ScoreTrackerProps {
  players: Player[];
  currentPlayerIndex: number;
  projectedPoints?: Record<number, number>;
}

export default function ScoreTracker({
  players,
  currentPlayerIndex,
  projectedPoints,
}: ScoreTrackerProps) {
  return (
    <div className="flex gap-4 justify-center">
      {players.map((player) => {
        const theme = FACTION_THEMES[player.factionId];
        const isCurrent = player.id === currentPlayerIndex;
        const projected = projectedPoints?.[player.id];

        return (
          <div
            key={player.id}
            className={`player-panel px-4 py-2 flex items-center gap-3 transition-all ${
              isCurrent ? "ring-1" : ""
            } ${player.isEliminated ? "opacity-40" : ""}`}
            style={{
              borderColor: isCurrent ? theme.primary : undefined,
              outlineColor: isCurrent ? theme.primary : undefined,
            }}
          >
            <span className="text-lg">{theme.emoji}</span>
            <div>
              <p
                className="text-xs font-bold"
                style={{ color: theme.primary }}
              >
                {theme.name}
              </p>
              <p className="score-display text-lg font-mono font-bold" style={{ color: theme.primary }}>
                {player.score}
                <span className="text-[10px] text-[var(--text-muted)] ml-1">
                  / 50
                </span>
              </p>
              {projected !== undefined && projected > 0 && (
                <p className="text-[10px] text-green-400 font-mono">
                  +{projected} projected
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
