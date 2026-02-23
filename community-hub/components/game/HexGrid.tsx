"use client";

import type React from "react";
import type { GameState, HexCoord, BoardChampion } from "@/types/game";
import { hexKey, hexToPixel } from "@/lib/game/hexMath";
import { FACTION_THEMES } from "@/lib/game/factionThemes";
import { ClassIconSVG } from "./ClassIcon";
import HexTile from "./HexTile";

interface DragGhost {
  coord: HexCoord;
  pos: { x: number; y: number };
}

interface HexGridProps {
  state: GameState;
  validTargets?: HexCoord[];
  swapTargets?: HexCoord[];
  spawnZones?: HexCoord[];
  selectedHex?: HexCoord | null;
  onHexClick?: (coord: HexCoord) => void;
  onChampionClick?: (coord: HexCoord) => void;
  onChampionDoubleClick?: (coord: HexCoord) => void;
  onChampionPointerDown?: (coord: HexCoord, e: React.PointerEvent) => void;
  onChampionHover?: (champion: BoardChampion | null, e: React.MouseEvent) => void;
  onChampionHoverEnd?: () => void;
  dragGhost?: DragGhost | null;
  svgRef?: React.RefObject<SVGSVGElement | null>;
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
  onChampionDoubleClick,
  onChampionPointerDown,
  onChampionHover,
  onChampionHoverEnd,
  dragGhost,
  svgRef,
}: HexGridProps) {
  const validSet = new Set(validTargets.map(hexKey));
  const swapSet = new Set(swapTargets.map(hexKey));
  const spawnSet = new Set(spawnZones.map(hexKey));

  const SVG_W = 560;
  const SVG_H = 580;

  const draggedChampion = dragGhost
    ? state.board.find(
        (t) => t.coord.q === dragGhost.coord.q && t.coord.r === dragGhost.coord.r
      )?.occupant
    : null;

  return (
    <div className="board-bg rounded-2xl p-2 md:p-4 flex items-center justify-center w-full h-full">
      <svg
        ref={svgRef}
        viewBox={`${-SVG_W / 2} ${-SVG_H / 2} ${SVG_W} ${SVG_H}`}
        className="holo-flicker w-full h-auto"
        style={{ maxWidth: 800, touchAction: "none" }}
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
          const isDragSource = dragGhost && tile.coord.q === dragGhost.coord.q && tile.coord.r === dragGhost.coord.r;
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
              isDragSource={!!isDragSource}
              currentPlayerId={state.currentPlayerIndex}
              onClick={onHexClick}
              onChampionClick={onChampionClick}
              onChampionDoubleClick={onChampionDoubleClick}
              onChampionPointerDown={onChampionPointerDown}
              onChampionHover={onChampionHover}
              onChampionHoverEnd={onChampionHoverEnd}
            />
          );
        })}

        {/* Drag ghost */}
        {dragGhost && draggedChampion && (
          <g
            transform={`translate(${dragGhost.pos.x}, ${dragGhost.pos.y})`}
            opacity={0.7}
            style={{ pointerEvents: "none" }}
          >
            <circle r={15} fill={`${FACTION_THEMES[draggedChampion.card.factionId].primary}40`} />
            <ClassIconSVG
              championClass={draggedChampion.card.championClass}
              color={FACTION_THEMES[draggedChampion.card.factionId].primary}
              size={14}
            />
          </g>
        )}
      </svg>
    </div>
  );
}
