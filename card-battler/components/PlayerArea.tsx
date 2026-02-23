"use client";

import type { Player } from "@/types/game";
import { FACTION_THEMES } from "@/lib/factionThemes";
import Card from "./Card";

interface PlayerAreaProps {
  player: Player;
  isActive: boolean;
  showHand: boolean;
  onCardClick?: (cardId: string) => void;
  selectedCardId?: string | null;
  position: "left" | "right" | "top";
  projectedPoints?: number;
}

export default function PlayerArea({
  player,
  isActive,
  showHand,
  onCardClick,
  selectedCardId,
  position,
  projectedPoints,
}: PlayerAreaProps) {
  const theme = FACTION_THEMES[player.factionId];
  const isSide = position === "left" || position === "right";

  return (
    <div
      className={`player-panel p-3 transition-all ${
        isActive ? "ring-1" : ""
      } ${player.isEliminated ? "opacity-30" : ""} ${
        isSide ? "w-full" : ""
      }`}
      style={{
        borderColor: isActive ? theme.primary : undefined,
        ["--tw-ring-color" as string]: theme.primary,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{theme.emoji}</span>
          <span
            className="text-sm font-bold"
            style={{ color: theme.primary }}
          >
            {theme.name}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
          <span title="Draw pile">📥 {player.drawPile.length}</span>
          <span title="Discard pile">📤 {player.discardPile.length}</span>
        </div>
      </div>

      {/* Score */}
      <div className="mb-2">
        <span
          className="score-display text-xl font-mono font-bold"
          style={{ color: theme.primary }}
        >
          {player.score}
        </span>
        <span className="text-xs text-[var(--text-muted)] ml-1">pts</span>
        {projectedPoints !== undefined && projectedPoints > 0 && (
          <span className="text-xs text-green-400 font-mono ml-2">
            (+{projectedPoints})
          </span>
        )}
      </div>

      {/* Hand */}
      {showHand && player.hand.length > 0 && (
        <div className={isSide ? "flex flex-col gap-2 overflow-y-auto max-h-64" : "flex gap-2 overflow-x-auto pb-1"}>
          {player.hand.map((card) => (
            <Card
              key={card.id}
              card={card}
              small
              selected={selectedCardId === card.id}
              onClick={() => onCardClick?.(card.id)}
            />
          ))}
        </div>
      )}

      {!showHand && player.hand.length > 0 && (
        <div className={isSide ? "flex flex-col gap-1" : "flex gap-1"}>
          {player.hand.map((_, i) => (
            <div
              key={i}
              className={isSide ? "w-full h-6 rounded border" : "w-8 h-12 rounded border"}
              style={{
                borderColor: `${theme.primary}40`,
                background: `${theme.primary}10`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
