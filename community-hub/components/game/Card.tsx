"use client";

import type { Card as CardType, ChampionClass } from "@/types/game";
import { FACTION_THEMES } from "@/lib/game/factionThemes";
import ClassIcon from "./ClassIcon";

interface CardProps {
  card: CardType;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
}

const CLASS_LABELS: Record<string, string> = {
  attacker: "Attacker",
  defender: "Defender",
  bruiser: "Bruiser",
};

const CLASS_ACCENT: Record<ChampionClass, string> = {
  attacker: "#ef4444",
  defender: "#3b82f6",
  bruiser: "#f59e0b",
};

export default function Card({
  card,
  selected = false,
  onClick,
  disabled = false,
  small = false,
}: CardProps) {
  const theme = FACTION_THEMES[card.factionId];
  const classLabel = CLASS_LABELS[card.championClass];
  const accent = CLASS_ACCENT[card.championClass];
  const iconSize = small ? 28 : 42;

  const w = small ? "w-32" : "w-44";
  const h = small ? "h-48" : "h-64";
  const nameSz = small ? "text-xs" : "text-sm";
  const statSz = small ? "text-xs" : "text-base";

  const borderColor = selected ? theme.primary : `${accent}40`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`card-container ${w} ${h} flex flex-col justify-between text-left ${
        selected ? "selected" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      style={
        {
          borderColor,
          "--glow-color": `${theme.primary}60`,
          "--accent-color": accent,
          boxShadow: selected
            ? `0 0 20px ${theme.primary}50, 0 0 40px ${theme.primary}20, inset 0 0 12px ${theme.primary}15`
            : `0 0 8px ${accent}15, inset 0 1px 0 ${theme.primary}10`,
        } as React.CSSProperties
      }
    >
      {/* Layered background */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: `
            linear-gradient(160deg, ${theme.gradientFrom}18 0%, transparent 40%, ${theme.gradientTo}12 100%),
            radial-gradient(ellipse at 30% 20%, ${theme.primary}08 0%, transparent 60%),
            radial-gradient(ellipse at 70% 80%, ${accent}06 0%, transparent 50%)
          `,
        }}
      />

      {/* Subtle pattern texture */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-conic-gradient(${theme.primary}20 0% 25%, transparent 0% 50%)`,
          backgroundSize: "8px 8px",
        }}
      />

      {/* Shimmer overlay */}
      <div className="absolute inset-0 holo-shimmer rounded-xl pointer-events-none opacity-60" />

      {/* Inner frame border */}
      <div
        className="absolute rounded-lg pointer-events-none"
        style={{
          inset: "3px",
          border: `1px solid ${theme.primary}12`,
          borderRadius: "10px",
        }}
      />

      {/* Corner ornaments */}
      <div className="card-corner card-corner-tl" style={{ borderColor: `${theme.primary}30` }} />
      <div className="card-corner card-corner-tr" style={{ borderColor: `${theme.primary}30` }} />
      <div className="card-corner card-corner-bl" style={{ borderColor: `${theme.primary}30` }} />
      <div className="card-corner card-corner-br" style={{ borderColor: `${theme.primary}30` }} />

      {/* Top accent stripe */}
      <div
        className="absolute top-0 left-3 right-3 h-[2px] rounded-b pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}50, ${theme.primary}40, ${accent}50, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-3 flex flex-col justify-between h-full">
        {/* Name */}
        <div>
          <p
            className={`${nameSz} font-bold tracking-wide truncate`}
            style={{ color: theme.primary }}
          >
            {card.name}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: `${theme.primary}90` }}>
            {theme.name}
          </p>
        </div>

        {/* Class indicator */}
        <div className="flex flex-col items-center justify-center flex-1">
          <ClassIcon
            championClass={card.championClass}
            color={theme.primary}
            size={iconSize}
            className="holo-flicker"
          />
          <span
            className="text-[10px] uppercase tracking-widest mt-1 font-medium"
            style={{ color: theme.secondary }}
          >
            {classLabel}
          </span>
        </div>

        {/* Stats row */}
        <div className="flex items-end justify-between">
          <div
            className={`${statSz} font-mono font-bold`}
            style={{ color: theme.primary }}
          >
            [{card.attack}/{card.defense}]
          </div>
          <div className={`${statSz} font-mono font-bold flex items-center gap-1`}>
            <span className="text-red-400">♥</span>
            <span>{card.health}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
