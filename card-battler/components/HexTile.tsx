"use client";

import type { HexTile as HexTileType, HexCoord } from "@/types/game";
import { hexToPixel, getHexPoints } from "@/lib/hexMath";
import ChampionToken from "./ChampionToken";

interface HexTileProps {
  tile: HexTileType;
  hexSize: number;
  isValidTarget?: boolean;
  isSwapTarget?: boolean;
  isSpawnZone?: boolean;
  isSelected?: boolean;
  currentPlayerId?: number;
  onClick?: (coord: HexCoord) => void;
  onChampionClick?: (coord: HexCoord) => void;
  onChampionHover?: (champion: HexTileType["occupant"], e: React.MouseEvent) => void;
  onChampionHoverEnd?: () => void;
}

export default function HexTile({
  tile,
  hexSize,
  isValidTarget = false,
  isSwapTarget = false,
  isSpawnZone = false,
  isSelected = false,
  currentPlayerId,
  onClick,
  onChampionClick,
  onChampionHover,
  onChampionHoverEnd,
}: HexTileProps) {
  const { x, y } = hexToPixel(tile.coord, hexSize);
  const points = getHexPoints(hexSize * 0.92);

  let fillColor = "rgba(20, 25, 60, 0.5)";
  let strokeColor = "rgba(100, 120, 200, 0.4)";
  let strokeWidth = 1;

  if (tile.pointValue === 5) {
    fillColor = "rgba(255, 215, 0, 0.08)";
    strokeColor = "rgba(255, 215, 0, 0.35)";
  } else if (tile.pointValue === 2) {
    fillColor = "rgba(100, 160, 255, 0.05)";
    strokeColor = "rgba(100, 160, 255, 0.2)";
  } else if (tile.pointValue === 1) {
    fillColor = "rgba(80, 140, 200, 0.03)";
    strokeColor = "rgba(80, 140, 200, 0.18)";
  }

  if (isSwapTarget) {
    fillColor = "rgba(160, 120, 255, 0.12)";
    strokeColor = "rgba(160, 120, 255, 0.6)";
    strokeWidth = 2;
  }

  if (isValidTarget) {
    fillColor = "rgba(100, 255, 160, 0.12)";
    strokeColor = "rgba(100, 255, 160, 0.5)";
    strokeWidth = 2;
  }

  if (isSpawnZone) {
    strokeColor = "rgba(200, 180, 100, 0.4)";
    strokeWidth = 1.5;
  }

  if (isSelected) {
    strokeColor = "rgba(255, 255, 255, 0.7)";
    strokeWidth = 2.5;
  }

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="hex-tile"
      onClick={() => {
        if (tile.occupant && onChampionClick) {
          onChampionClick(tile.coord);
        } else if (onClick) {
          onClick(tile.coord);
        }
      }}
    >
      <polygon
        points={points}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Point value indicator */}
      {tile.pointValue > 0 && !tile.occupant && (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={10}
          fill={tile.pointValue === 5 ? "rgba(255, 215, 0, 0.5)" : tile.pointValue === 2 ? "rgba(100, 160, 255, 0.35)" : "rgba(80, 140, 200, 0.25)"}
          className="select-none pointer-events-none"
        >
          +{tile.pointValue}
        </text>
      )}

      {/* Champion token */}
      {tile.occupant && (
        <ChampionToken
          champion={tile.occupant}
          selected={isSelected}
          isCurrentPlayer={tile.occupant.playerId === currentPlayerId}
          onClick={() => onChampionClick?.(tile.coord)}
          onMouseEnter={(e) => onChampionHover?.(tile.occupant, e)}
          onMouseLeave={onChampionHoverEnd}
        />
      )}
    </g>
  );
}
