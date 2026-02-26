"use client";

import type { StatBlock, Equipment, ExplorerStat, Item } from "@/types/explorer/explorer";
import { EXPLORER_STATS, STAT_LABELS } from "@/types/explorer/explorer";
import type { FactionTheme } from "@/lib/explorer/factionThemes";
import {
  computeMaxHP,
  computeArmorClass,
  computeInitiative,
  computeSpeed,
  computeSavingThrows,
  computeWeightLimit,
  computeCurrentWeight,
} from "@/lib/explorer/statBuilder";

const STAT_COLORS: Record<ExplorerStat, string> = {
  body: "#ef4444",
  finesse: "#22d3ee",
  spirit: "#a78bfa",
};

interface StatsPanelProps {
  effectiveStats: StatBlock;
  equipment: Equipment;
  theme: FactionTheme;
  currentHP?: number;
  overrideMaxHP?: number;
  salvageComponents?: number;
  gold?: number;
  inventory?: Item[];
  level?: number;
}

export default function StatsPanel({
  effectiveStats,
  equipment,
  theme,
  currentHP,
  overrideMaxHP,
  salvageComponents = 0,
  gold = 0,
  inventory = [],
  level = 1,
}: StatsPanelProps) {
  const maxHP = overrideMaxHP ?? computeMaxHP(effectiveStats);
  const displayHP = currentHP ?? maxHP;
  const hpPercent = maxHP > 0 ? (displayHP / maxHP) * 100 : 0;
  const hpColor = hpPercent > 60 ? "#4ade80" : hpPercent > 30 ? "#facc15" : "#f87171";
  const armorClass = computeArmorClass(effectiveStats, equipment);
  const initiative = computeInitiative(effectiveStats);
  const speed = computeSpeed(effectiveStats, equipment, inventory);
  const savingThrows = computeSavingThrows(effectiveStats);

  const weightLimit = computeWeightLimit(effectiveStats);
  const currentWeight = computeCurrentWeight(equipment, salvageComponents, gold, inventory);
  const weightPercent = weightLimit > 0 ? Math.min((currentWeight / weightLimit) * 100, 100) : 0;
  const overweight = currentWeight > weightLimit;
  const weightColor = overweight ? "#f87171" : weightPercent > 90 ? "#f87171" : weightPercent > 60 ? "#facc15" : "#4ade80";

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        borderRadius: 16,
        overflow: "hidden",
        borderColor: `color-mix(in srgb, ${theme.primary} 15%, transparent)`,
      }}
    >
      <div
        style={{
          height: 2,
          width: "100%",
          background: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`,
        }}
      />
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Level ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 10,
            border: `1px solid ${theme.primary}25`,
            background: `${theme.primary}08`,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--color-muted)",
            }}
          >
            Level
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 20,
              fontWeight: 700,
              color: theme.primary,
              lineHeight: 1,
            }}
          >
            {level}
          </span>
        </div>

        {/* ── Hit Points ── */}
        <div>
          <h3
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--color-muted)",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Hit Points
          </h3>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px 8px",
                borderRadius: 12,
                border: `1px solid ${theme.primary}25`,
                background: `${theme.primary}08`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#ef4444",
                  lineHeight: 1,
                }}
              >
                {maxHP}
              </span>
              <span
                style={{
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-muted)",
                  marginTop: 4,
                }}
              >
                Max HP
              </span>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px 8px",
                borderRadius: 12,
                border: `1px solid ${hpColor}25`,
                background: "transparent",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 28,
                  fontWeight: 700,
                  color: hpColor,
                  lineHeight: 1,
                  transition: "color 0.3s",
                }}
              >
                {displayHP}
              </span>
              <span
                style={{
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-muted)",
                  marginTop: 4,
                }}
              >
                Current HP
              </span>
            </div>
          </div>
          {/* HP Bar */}
          <div
            style={{
              position: "relative",
              height: 6,
              borderRadius: 9999,
              overflow: "hidden",
              background: "rgba(0,0,0,0.3)",
              marginTop: 8,
            }}
          >
            <div
              className="hp-bar-fill"
              style={{
                position: "absolute",
                inset: "0 auto 0 0",
                borderRadius: 9999,
                width: `${hpPercent}%`,
                background: hpColor,
                opacity: 0.8,
                transition: "width 0.5s ease, background 0.3s",
              }}
            />
          </div>
        </div>

        {/* ── AC / Initiative / Speed ── */}
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "Armor Class", value: armorClass, color: "#60a5fa" },
            { label: "Initiative", value: initiative, color: "#fbbf24" },
            { label: "Speed", value: speed, color: "#34d399" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "10px 4px",
                borderRadius: 10,
                border: `1px solid ${theme.primary}20`,
                background: `${theme.primary}05`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 22,
                  fontWeight: 700,
                  color: stat.color,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-muted)",
                  marginTop: 4,
                  textAlign: "center",
                  lineHeight: 1.2,
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Weight ── */}
        <div>
          <h3
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--color-muted)",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Weight
          </h3>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px 8px",
                borderRadius: 12,
                border: `1px solid ${weightColor}25`,
                background: overweight ? `${weightColor}08` : "transparent",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 28,
                  fontWeight: 700,
                  color: weightColor,
                  lineHeight: 1,
                  transition: "color 0.3s",
                }}
              >
                {currentWeight}
              </span>
              <span
                style={{
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-muted)",
                  marginTop: 4,
                }}
              >
                Current
              </span>
            </div>
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-muted)",
              }}
            >
              /
            </span>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px 8px",
                borderRadius: 12,
                border: `1px solid ${theme.primary}25`,
                background: `${theme.primary}08`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 28,
                  fontWeight: 700,
                  color: theme.primary,
                  lineHeight: 1,
                }}
              >
                {weightLimit}
              </span>
              <span
                style={{
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-muted)",
                  marginTop: 4,
                }}
              >
                Limit
              </span>
            </div>
          </div>
          <div
            style={{
              position: "relative",
              height: 6,
              borderRadius: 9999,
              overflow: "hidden",
              background: "rgba(0,0,0,0.3)",
              marginTop: 8,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "0 auto 0 0",
                borderRadius: 9999,
                width: `${weightPercent}%`,
                background: weightColor,
                opacity: 0.8,
                transition: "width 0.5s ease, background 0.3s",
              }}
            />
          </div>
        </div>

        {/* ── Saving Throws ── */}
        <div>
          <h3
            style={{
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--color-muted)",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Saving Throws
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {EXPLORER_STATS.map((stat) => {
              const color = STAT_COLORS[stat];
              const val = savingThrows[stat];
              return (
                <div
                  key={stat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                    borderRadius: 8,
                    border: `1px solid ${color}15`,
                    background: `${color}05`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color,
                    }}
                  >
                    {STAT_LABELS[stat]}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 14,
                      fontWeight: 700,
                      color,
                    }}
                  >
                    {val >= 0 ? "+" : ""}{val}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
