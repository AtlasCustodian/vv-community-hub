"use client";

import type React from "react";
import type { BoardChampion } from "@/types/game";
import { FACTION_THEMES } from "@/lib/game/factionThemes";
import { ClassIconSVG } from "./ClassIcon";

interface ChampionTokenProps {
  champion: BoardChampion;
  selected?: boolean;
  isCurrentPlayer?: boolean;
  isDragSource?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: () => void;
}

export default function ChampionToken({
  champion,
  selected = false,
  isCurrentPlayer = false,
  isDragSource = false,
  onClick,
  onDoubleClick,
  onPointerDown,
  onMouseEnter,
  onMouseLeave,
}: ChampionTokenProps) {
  const theme = FACTION_THEMES[champion.card.factionId];
  const healthPct = champion.currentHealth / champion.card.maxHealth;

  return (
    <g
      className={`champion-token ${onClick ? "cursor-pointer" : ""}`}
      style={{ "--token-color": `${theme.primary}80` } as React.CSSProperties}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onPointerDown={onPointerDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      opacity={isDragSource ? 0.3 : 1}
    >
      {/* Glow ring */}
      <circle
        r={18}
        fill="none"
        stroke={theme.primary}
        strokeWidth={selected ? 2.5 : 1.5}
        opacity={selected ? 0.9 : 0.5}
      />

      {/* Background circle */}
      <circle
        r={15}
        fill={`${theme.primary}20`}
        stroke={isCurrentPlayer ? theme.primary : "transparent"}
        strokeWidth={1}
        strokeDasharray={isCurrentPlayer ? "3 2" : "none"}
      />

      {/* Health arc */}
      <circle
        r={17}
        fill="none"
        stroke={healthPct > 0.5 ? theme.primary : healthPct > 0.25 ? "#eab308" : "#ef4444"}
        strokeWidth={2}
        strokeDasharray={`${healthPct * 107} ${107 - healthPct * 107}`}
        strokeDashoffset={26.75}
        strokeLinecap="round"
        opacity={0.8}
      />

      {/* Class icon */}
      <g className="holo-flicker">
        <ClassIconSVG
          championClass={champion.card.championClass}
          color={theme.primary}
          size={14}
        />
      </g>

      {/* Name label */}
      <text
        y={28}
        textAnchor="middle"
        fontSize={6}
        fill={theme.primary}
        fontWeight="bold"
        className="select-none"
      >
        {champion.card.name.split(" ")[0]}
      </text>

      {/* Stats label */}
      <text
        y={35}
        textAnchor="middle"
        fontSize={5}
        fill={theme.secondary}
        className="select-none"
      >
        {champion.card.attack}/{champion.card.defense} ♥{champion.currentHealth}
      </text>
    </g>
  );
}
