"use client";

import type { GameState, HexCoord, BoardChampion } from "@/types/game";
import { hexKey } from "@/lib/hexMath";
import HexTile from "./HexTile";

interface HexGridProps {
  state: GameState;
  validTargets?: HexCoord[];
  swapTargets?: HexCoord[];
  spawnZones?: HexCoord[];
  selectedHex?: HexCoord | null;
  onHexClick?: (coord: HexCoord) => void;
  onChampionClick?: (coord: HexCoord) => void;
  onChampionHover?: (champion: BoardChampion | null, e: React.MouseEvent) => void;
  onChampionHoverEnd?: () => void;
}

const HEX_SIZE = 38;

export default function HexGrid({
  state,
  validTargets = [],
  swapTargets = [],
  spawnZones = [],
  selectedHex = null,
  onHexClick,
  onChampionClick,
  onChampionHover,
  onChampionHoverEnd,
}: HexGridProps) {
  const validSet = new Set(validTargets.map(hexKey));
  const swapSet = new Set(swapTargets.map(hexKey));
  const spawnSet = new Set(spawnZones.map(hexKey));

  const SVG_W = 560;
  const SVG_H = 580;

  return (
    <div className="board-bg rounded-2xl p-4 flex items-center justify-center">
      <svg
        viewBox={`${-SVG_W / 2} ${-SVG_H / 2} ${SVG_W} ${SVG_H}`}
        width={SVG_W}
        height={SVG_H}
        className="holo-flicker"
      >
        {/* Ambient glow at center */}
        <defs>
          <radialGradient id="centerGlow">
            <stop offset="0%" stopColor="rgba(255, 215, 0, 0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle r={40} fill="url(#centerGlow)" />

        {state.board.map((tile) => {
          const key = hexKey(tile.coord);
          return (
            <HexTile
              key={key}
              tile={tile}
              hexSize={HEX_SIZE}
              isValidTarget={validSet.has(key)}
              isSwapTarget={swapSet.has(key)}
              isSpawnZone={spawnSet.has(key)}
              isSelected={
                selectedHex !== null &&
                selectedHex.q === tile.coord.q &&
                selectedHex.r === tile.coord.r
              }
              currentPlayerId={state.currentPlayerIndex}
              onClick={onHexClick}
              onChampionClick={onChampionClick}
              onChampionHover={onChampionHover}
              onChampionHoverEnd={onChampionHoverEnd}
            />
          );
        })}
      </svg>
    </div>
  );
}
