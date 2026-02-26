"use client";

import type { Item, ItemSlot, ExplorerStat } from "@/types/explorer/explorer";
import { SLOT_LABELS, STAT_LABELS } from "@/types/explorer/explorer";
import type { FactionTheme } from "@/lib/explorer/factionThemes";
import SlotIcon from "./SlotIcon";

const STAT_COLORS: Record<ExplorerStat, string> = {
  body: "#ef4444",
  finesse: "#22d3ee",
  spirit: "#a78bfa",
};

interface EquipmentCardProps {
  slot: ItemSlot;
  item: Item | null;
  theme: FactionTheme;
  selected?: boolean;
  onClick?: () => void;
}

export default function EquipmentCard({
  slot,
  item,
  theme,
  selected = false,
  onClick,
}: EquipmentCardProps) {
  const borderColor = selected
    ? theme.primary
    : item
      ? `${theme.primary}40`
      : `${theme.primary}20`;

  return (
    <button
      onClick={onClick}
      className={`card-container w-full h-44 flex flex-col justify-between text-left ${
        selected ? "selected" : ""
      }`}
      style={
        {
          borderColor,
          "--glow-color": `${theme.primary}60`,
          "--accent-color": theme.primary,
          boxShadow: selected
            ? `0 0 20px ${theme.primary}50, 0 0 40px ${theme.primary}20, inset 0 0 12px ${theme.primary}15`
            : item
              ? `0 0 8px ${theme.primary}15, inset 0 1px 0 ${theme.primary}10`
              : "none",
        } as React.CSSProperties
      }
    >
      {/* Layered background */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: item
            ? `
              linear-gradient(160deg, ${theme.gradientFrom}18 0%, transparent 40%, ${theme.gradientTo}12 100%),
              radial-gradient(ellipse at 30% 20%, ${theme.primary}08 0%, transparent 60%)
            `
            : `radial-gradient(ellipse at 50% 50%, ${theme.primary}04 0%, transparent 70%)`,
        }}
      />

      {/* Subtle pattern texture */}
      {item && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `repeating-conic-gradient(${theme.primary}20 0% 25%, transparent 0% 50%)`,
            backgroundSize: "8px 8px",
          }}
        />
      )}

      {/* Shimmer overlay */}
      {item && (
        <div className="absolute inset-0 holo-shimmer rounded-xl pointer-events-none opacity-60" />
      )}

      {/* Inner frame border */}
      {item && (
        <div
          className="absolute rounded-lg pointer-events-none"
          style={{
            inset: "3px",
            border: `1px solid ${theme.primary}12`,
            borderRadius: "10px",
          }}
        />
      )}

      {/* Corner ornaments */}
      {item && (
        <>
          <div className="card-corner card-corner-tl" style={{ borderColor: `${theme.primary}30` }} />
          <div className="card-corner card-corner-tr" style={{ borderColor: `${theme.primary}30` }} />
          <div className="card-corner card-corner-bl" style={{ borderColor: `${theme.primary}30` }} />
          <div className="card-corner card-corner-br" style={{ borderColor: `${theme.primary}30` }} />
        </>
      )}

      {/* Top accent stripe */}
      <div
        className="absolute top-0 left-3 right-3 h-[2px] rounded-b pointer-events-none"
        style={{
          background: item
            ? `linear-gradient(90deg, transparent, ${theme.primary}50, ${theme.gradientTo}40, ${theme.primary}50, transparent)`
            : `linear-gradient(90deg, transparent, ${theme.primary}20, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-3 flex flex-col justify-between h-full">
        {/* Slot label */}
        <div>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: `${theme.primary}90` }}>
            {SLOT_LABELS[slot]}
          </p>
        </div>

        {/* Center icon */}
        <div className="flex flex-col items-center justify-center flex-1">
          <SlotIcon
            slot={slot}
            color={item ? theme.primary : `${theme.primary}40`}
            size={item ? 36 : 32}
            className={item ? "holo-flicker" : ""}
          />
          {item ? (
            <p
              className="text-xs font-bold tracking-wide text-center mt-1.5 truncate w-full"
              style={{ color: theme.primary }}
            >
              {item.name}
            </p>
          ) : (
            <p className="text-[10px] text-[var(--color-muted)] mt-1.5 italic">
              Empty
            </p>
          )}
        </div>

        {/* Bottom stat row */}
        {item ? (
          <div className="flex items-end justify-between gap-1">
            <div className="flex flex-wrap gap-1">
              {Object.entries(item.statModifiers).map(([s, v]) => (
                <span
                  key={s}
                  className="text-[9px] font-mono font-bold px-1 py-0.5 rounded"
                  style={{
                    color: (v as number) > 0 ? "#4ade80" : "#f87171",
                    background:
                      (v as number) > 0
                        ? "rgba(74, 222, 128, 0.1)"
                        : "rgba(248, 113, 113, 0.1)",
                  }}
                >
                  {STAT_LABELS[s as ExplorerStat]}
                  {(v as number) > 0 ? "+" : ""}
                  {v as number}
                </span>
              ))}
            </div>
            <span
              className="text-[9px] font-mono opacity-60"
              style={{ color: theme.primary }}
            >
              {item.weight}w
            </span>
          </div>
        ) : (
          <div className="h-4" />
        )}
      </div>
    </button>
  );
}
