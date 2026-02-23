"use client";

import type { Player, GamePhase } from "@/types/game";
import { FACTION_THEMES } from "@/lib/factionThemes";

interface InterstitialProps {
  player: Player;
  nextPhase: GamePhase;
  onContinue: () => void;
}

export default function Interstitial({
  player,
  nextPhase,
  onContinue,
}: InterstitialProps) {
  const theme = FACTION_THEMES[player.factionId];

  const phaseLabel =
    nextPhase === "draft"
      ? "Draft Phase"
      : nextPhase === "placement"
        ? "Placement Phase"
        : `Turn`;

  return (
    <div className="interstitial-overlay">
      <div className="flex flex-col items-center gap-6 animate-slide-up">
        <span className="text-6xl">{theme.emoji}</span>
        <h2 className="text-3xl font-bold" style={{ color: theme.primary }}>
          {theme.name}
        </h2>
        <p className="text-[var(--text-muted)] text-lg">{phaseLabel}</p>
        <p className="text-sm text-[var(--text-muted)]">
          Pass the device to this player
        </p>
        <button
          className="btn-holo px-10 py-4 text-lg mt-4"
          onClick={onContinue}
          style={{ borderColor: theme.primary }}
        >
          Ready
        </button>
      </div>
    </div>
  );
}
