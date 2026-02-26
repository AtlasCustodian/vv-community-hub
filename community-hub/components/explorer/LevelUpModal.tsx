"use client";

import type { StatBlock, ExplorerStat } from "@/types/explorer/explorer";
import { EXPLORER_STATS, STAT_LABELS, STAT_DESCRIPTIONS } from "@/types/explorer/explorer";
import type { FactionTheme } from "@/lib/explorer/factionThemes";

const STAT_COLORS: Record<ExplorerStat, string> = {
  body: "#ef4444",
  finesse: "#22d3ee",
  spirit: "#a78bfa",
};

interface LevelUpModalProps {
  currentLevel: number;
  baseStats: StatBlock;
  theme: FactionTheme;
  onChoose: (stat: ExplorerStat) => void;
}

export default function LevelUpModal({ currentLevel, baseStats, theme, onChoose }: LevelUpModalProps) {
  const newLevel = currentLevel + 1;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: `2px solid ${theme.primary}60`,
              background: `${theme.primary}15`,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 24,
                fontWeight: 700,
                color: theme.primary,
              }}
            >
              {newLevel}
            </span>
          </div>
          <h3
            style={{
              fontSize: 20,
              fontWeight: 700,
              backgroundImage: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: 4,
            }}
          >
            Level Up!
          </h3>
          <p style={{ fontSize: 12, color: "var(--color-muted)" }}>
            Choose a stat to increase by +1
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {EXPLORER_STATS.map((stat) => {
            const color = STAT_COLORS[stat];
            const currentVal = baseStats[stat];
            return (
              <button
                key={stat}
                className="upgrade-option"
                onClick={() => onChoose(stat)}
                style={{
                  borderColor: `${color}25`,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 700, color }}>{STAT_LABELS[stat]}</span>
                    <span style={{ fontSize: 11, color: "var(--color-muted)", marginLeft: 8 }}>
                      {STAT_DESCRIPTIONS[stat]}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily: "var(--font-mono), monospace",
                        color: "var(--color-muted)",
                      }}
                    >
                      {currentVal}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontFamily: "var(--font-mono), monospace",
                        color: "#4ade80",
                        marginLeft: 4,
                      }}
                    >
                      → {currentVal + 1}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
