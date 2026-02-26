"use client";

import type { Item, ExplorerStat } from "@/types/explorer/explorer";
import { STAT_LABELS, SLOT_LABELS } from "@/types/explorer/explorer";
import type { FactionTheme } from "@/lib/explorer/factionThemes";
import ItemArt from "./ItemArt";

const STAT_COLORS: Record<ExplorerStat, string> = {
  body: "#ef4444",
  finesse: "#22d3ee",
  spirit: "#a78bfa",
};

interface ItemTooltipProps {
  item: Item;
  theme: FactionTheme;
  /** When true, renders only the card body without the absolute-positioned wrapper */
  inline?: boolean;
}

export default function ItemTooltip({ item, theme, inline = false }: ItemTooltipProps) {
  const card = (
    <div
      className="relative rounded-xl border p-4 flex flex-col gap-3"
      style={{
        background: `linear-gradient(135deg, color-mix(in srgb, var(--color-surface) 92%, transparent), color-mix(in srgb, var(--color-surface-hover) 80%, transparent))`,
        backdropFilter: "blur(16px)",
        borderColor: `color-mix(in srgb, ${theme.primary} 25%, transparent)`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 16px color-mix(in srgb, ${theme.primary} 10%, transparent)`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
          opacity: 0.5,
        }}
      />

      <div className="flex items-center gap-3">
        <div
          className="flex-shrink-0 rounded-lg p-2 flex items-center justify-center"
          style={{
            background: `color-mix(in srgb, ${theme.primary} 8%, transparent)`,
            border: `1px solid color-mix(in srgb, ${theme.primary} 15%, transparent)`,
          }}
        >
          <ItemArt itemId={item.id} artId={item.artId} color={theme.primary} size={40} />
        </div>
        <div className="min-w-0">
          <p
            className="text-sm font-bold leading-tight truncate"
            style={{ color: theme.primary }}
          >
            {item.name}
          </p>
          <p
            className="text-[10px] uppercase tracking-wider mt-0.5"
            style={{ color: `var(--color-muted)` }}
          >
            {SLOT_LABELS[item.slot]}
          </p>
        </div>
      </div>

      <div
        className="h-px w-full"
        style={{
          background: `color-mix(in srgb, ${theme.primary} 12%, transparent)`,
        }}
      />

      <p
        className="text-xs leading-relaxed"
        style={{ color: `var(--color-foreground)`, opacity: 0.8 }}
      >
        {item.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {Object.entries(item.statModifiers).map(([stat, value]) => {
          const v = value as number;
          const color = STAT_COLORS[stat as ExplorerStat];
          return (
            <span
              key={stat}
              className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
              style={{
                color,
                background: `color-mix(in srgb, ${color} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${color} 15%, transparent)`,
              }}
            >
              {STAT_LABELS[stat as ExplorerStat]}{" "}
              {v > 0 ? "+" : ""}
              {v}
            </span>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {item.acBonus != null && item.acBonus !== 0 && (
            <span
              className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
              style={{
                color: "#22d3ee",
                background: "color-mix(in srgb, #22d3ee 10%, transparent)",
                border: "1px solid color-mix(in srgb, #22d3ee 15%, transparent)",
              }}
            >
              AC +{item.acBonus}
            </span>
          )}
          <span
            className="text-[10px] font-mono"
            style={{ color: `var(--color-muted)` }}
          >
            {item.weight}w
          </span>
        </div>
        <div className="flex gap-1">
          {item.tags.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{
                color: `var(--color-muted)`,
                background: `color-mix(in srgb, var(--color-muted) 10%, transparent)`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  if (inline) return card;

  return (
    <div
      className="item-tooltip pointer-events-none absolute z-50 w-56"
      style={{
        right: "calc(100% + 12px)",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      {card}
    </div>
  );
}
