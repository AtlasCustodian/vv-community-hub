"use client";

import { useMemo } from "react";
import type { Item, ExplorerStat } from "@/types/explorer/explorer";
import { STAT_LABELS, STAT_DESCRIPTIONS } from "@/types/explorer/explorer";
import type { FactionTheme } from "@/lib/explorer/factionThemes";
import { computeUpgradeCost, rollUpgradeOptions } from "@/lib/explorer/salvage";

const STAT_COLORS: Record<ExplorerStat, string> = {
  body: "#ef4444",
  finesse: "#22d3ee",
  spirit: "#a78bfa",
};

interface UpgradeModalProps {
  item: Item;
  salvageComponents: number;
  theme: FactionTheme;
  onUpgrade: (stat: ExplorerStat) => void;
  onCancel: () => void;
}

export default function UpgradeModal({ item, salvageComponents, theme, onUpgrade, onCancel }: UpgradeModalProps) {
  const cost = computeUpgradeCost(item);
  const canAfford = salvageComponents >= cost;
  const options = useMemo(() => rollUpgradeOptions(), []);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.primary, textAlign: "center", marginBottom: 4 }}>
          Upgrade Equipment
        </h3>
        <p style={{ fontSize: 12, color: "var(--color-muted)", textAlign: "center", marginBottom: 16 }}>
          {item.name}
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 16,
          marginBottom: 16,
          padding: "10px 0",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-muted)" }}>
              Cost
            </span>
            <p style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: canAfford ? "#4ade80" : "#f87171" }}>
              {cost}
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-muted)" }}>
              Available
            </span>
            <p style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: theme.primary }}>
              {salvageComponents}
            </p>
          </div>
        </div>

        {!canAfford && (
          <p style={{ fontSize: 12, color: "#f87171", textAlign: "center", marginBottom: 12 }}>
            Not enough Salvage Components (need {cost}, have {salvageComponents})
          </p>
        )}

        {canAfford && (
          <p style={{ fontSize: 12, color: "var(--color-muted)", textAlign: "center", marginBottom: 12 }}>
            Choose an attribute to increase by +1
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {options.map((stat) => {
            const color = STAT_COLORS[stat];
            const currentVal = item.statModifiers[stat] ?? 0;
            return (
              <button
                key={stat}
                className="upgrade-option"
                disabled={!canAfford}
                onClick={() => onUpgrade(stat)}
                style={{
                  borderColor: `${color}25`,
                  opacity: canAfford ? 1 : 0.4,
                  cursor: canAfford ? "pointer" : "not-allowed",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 700, color }}>{STAT_LABELS[stat]}</span>
                    <span style={{ fontSize: 11, color: "var(--color-muted)", marginLeft: 8 }}>{STAT_DESCRIPTIONS[stat]}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 12, fontFamily: "var(--font-mono), monospace", color: "var(--color-muted)" }}>
                      {currentVal >= 0 ? "+" : ""}{currentVal}
                    </span>
                    <span style={{ fontSize: 12, fontFamily: "var(--font-mono), monospace", color: "#4ade80", marginLeft: 4 }}>
                      → {currentVal >= 0 ? "+" : ""}{currentVal + 1}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={onCancel}
            className="btn-stone px-6 py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
