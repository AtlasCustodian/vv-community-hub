"use client";

import { useState } from "react";
import type { GameState, HexCoord, BoardChampion } from "@/types/game";
import { getValidPlacementTiles } from "@/lib/gameEngine";
import { FACTION_THEMES } from "@/lib/factionThemes";
import HexGrid from "./HexGrid";
import Card from "./Card";
import ChampionTooltip from "./ChampionTooltip";

interface PlacementPhaseProps {
  state: GameState;
  onPlace: (cardId: string, position: HexCoord) => void;
}

export default function PlacementPhase({ state, onPlace }: PlacementPhaseProps) {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedHex, setSelectedHex] = useState<HexCoord | null>(null);
  const [hoveredChampion, setHoveredChampion] = useState<{
    champion: BoardChampion;
    x: number;
    y: number;
  } | null>(null);

  const player = state.players[state.currentPlayerIndex];
  const theme = FACTION_THEMES[player.factionId];
  const validTiles = getValidPlacementTiles(state, state.currentPlayerIndex);

  function handleHexClick(coord: HexCoord) {
    setSelectedHex(coord);
  }

  function handleConfirm() {
    if (selectedCard && selectedHex) {
      onPlace(selectedCard, selectedHex);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 animate-slide-up">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
          Placement Phase
        </p>
        <h2
          className="text-2xl font-bold mt-1"
          style={{ color: theme.primary }}
        >
          {theme.emoji} {theme.name}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mt-2">
          Select a champion and place them on a highlighted tile.
        </p>
      </div>

      <HexGrid
        state={state}
        validTargets={selectedCard ? validTiles : []}
        spawnZones={validTiles}
        selectedHex={selectedHex}
        onHexClick={handleHexClick}
        onChampionHover={(champion, e) => {
          if (champion) setHoveredChampion({ champion, x: e.clientX, y: e.clientY });
        }}
        onChampionHoverEnd={() => setHoveredChampion(null)}
      />

      {hoveredChampion && (
        <ChampionTooltip
          champion={hoveredChampion.champion}
          x={hoveredChampion.x}
          y={hoveredChampion.y}
        />
      )}

      <div className="flex gap-3 flex-wrap justify-center">
        {player.hand.map((card) => (
          <Card
            key={card.id}
            card={card}
            selected={selectedCard === card.id}
            onClick={() => setSelectedCard(card.id)}
            small
          />
        ))}
      </div>

      <button
        className="btn-holo px-8 py-3"
        disabled={!selectedCard || !selectedHex}
        onClick={handleConfirm}
        style={{
          borderColor:
            selectedCard && selectedHex ? theme.primary : undefined,
        }}
      >
        Deploy Champion
      </button>
    </div>
  );
}
