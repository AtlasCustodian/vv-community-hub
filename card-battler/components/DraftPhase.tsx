"use client";

import { useState } from "react";
import type { GameState } from "@/types/game";
import { getDraftOptions } from "@/lib/gameEngine";
import { FACTION_THEMES } from "@/lib/factionThemes";
import Card from "./Card";

interface DraftPhaseProps {
  state: GameState;
  onDraftComplete: (selectedCardIds: string[]) => void;
}

export default function DraftPhase({ state, onDraftComplete }: DraftPhaseProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const player = state.players[state.currentPlayerIndex];
  const theme = FACTION_THEMES[player.factionId];
  const { options } = getDraftOptions(player);

  function toggleSelect(cardId: string) {
    setSelected((prev) => {
      if (prev.includes(cardId)) return prev.filter((id) => id !== cardId);
      if (prev.length >= 2) return prev;
      return [...prev, cardId];
    });
  }

  return (
    <div className="flex flex-col items-center gap-4 animate-slide-up">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
          Draft Phase
        </p>
        <h2
          className="text-2xl font-bold mt-1"
          style={{ color: theme.primary }}
        >
          {theme.emoji} {theme.name}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Select <strong className="text-[var(--text-primary)]">2 champions</strong> from the 5 below.
          You will also receive 1 random champion.
        </p>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        {options.map((card) => (
          <Card
            key={card.id}
            card={card}
            selected={selected.includes(card.id)}
            onClick={() => toggleSelect(card.id)}
          />
        ))}
      </div>

      <button
        className="btn-holo px-8 py-3 text-base"
        disabled={selected.length !== 2}
        onClick={() => onDraftComplete(selected)}
        style={{
          borderColor: selected.length === 2 ? theme.primary : undefined,
        }}
      >
        Confirm Selection ({selected.length}/2)
      </button>
    </div>
  );
}
