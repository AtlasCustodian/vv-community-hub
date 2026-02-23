"use client";

import type { BoardChampion } from "@/types/game";
import { FACTION_THEMES } from "@/lib/game/factionThemes";
import ClassIcon from "./ClassIcon";

interface ChampionTooltipProps {
  champion: BoardChampion;
  x: number;
  y: number;
}

export default function ChampionTooltip({ champion, x, y }: ChampionTooltipProps) {
  const theme = FACTION_THEMES[champion.card.factionId];
  const healthPct = champion.currentHealth / champion.card.maxHealth;

  return (
    <div
      className="fixed z-50 pointer-events-none animate-fade-in"
      style={{ left: x + 12, top: y - 8 }}
    >
      <div className="player-panel px-3 py-2.5 min-w-[140px]">
        <div className="flex items-center gap-2 mb-1.5">
          <ClassIcon
            championClass={champion.card.championClass}
            color={theme.primary}
            size={18}
          />
          <span className="font-bold text-sm" style={{ color: theme.primary }}>
            {champion.card.name}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-red-400 font-mono">
            ⚔ {champion.card.attack}
          </span>
          <span className="text-blue-400 font-mono">
            🛡 {champion.card.defense}
          </span>
        </div>

        <div className="mt-1.5">
          <div className="flex items-center justify-between text-xs mb-0.5">
            <span className="text-[var(--text-muted)]">HP</span>
            <span className="font-mono font-bold" style={{
              color: healthPct > 0.5 ? theme.primary : healthPct > 0.25 ? "#eab308" : "#ef4444",
            }}>
              {champion.currentHealth}/{champion.card.maxHealth}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[var(--bg-deep)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${healthPct * 100}%`,
                backgroundColor: healthPct > 0.5 ? theme.primary : healthPct > 0.25 ? "#eab308" : "#ef4444",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
