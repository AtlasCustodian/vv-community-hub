"use client";

import { useState, useEffect, useCallback } from "react";
import type { StatBlock, ExplorerStat, Item } from "@/types/explorer/explorer";
import { STAT_LABELS } from "@/types/explorer/explorer";
import type { RoomChallenge, ChallengeResult, ChallengeOption } from "@/types/explorer/vantheon";
import type { FactionTheme } from "@/lib/explorer/factionThemes";
import { performAbilityCheck } from "@/lib/explorer/abilityCheck";
import ItemTooltip from "./ItemTooltip";

const CATEGORY_COLORS: Record<string, string> = {
  physical: "#ef4444",
  skill: "#22d3ee",
  mental: "#a78bfa",
};

const CATEGORY_LABELS: Record<string, string> = {
  physical: "Physical",
  skill: "Skill",
  mental: "Mental",
};

const STAT_COLORS: Record<ExplorerStat, string> = {
  body: "#ef4444",
  finesse: "#22d3ee",
  spirit: "#a78bfa",
};

type PanelPhase = "choose" | "rolling" | "result";

interface ChallengePanelProps {
  challenge: RoomChallenge;
  challengeIndex: number;
  totalChallenges: number;
  effectiveStats: StatBlock;
  theme: FactionTheme;
  loot: Item | null;
  goldLoot?: number | null;
  isLastChallenge: boolean;
  onResolve: (result: ChallengeResult) => void;
  onProceed: () => void;
  onStartCombat?: (optionIndex: number) => void;
  onStartParkour?: (optionIndex: number) => void;
  onStartPuzzle?: (optionIndex: number) => void;
}

export default function ChallengePanel({
  challenge,
  challengeIndex,
  totalChallenges,
  effectiveStats,
  theme,
  loot,
  goldLoot,
  isLastChallenge,
  onResolve,
  onProceed,
  onStartCombat,
  onStartParkour,
  onStartPuzzle,
}: ChallengePanelProps) {
  const [phase, setPhase] = useState<PanelPhase>("choose");
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [rollingDisplay, setRollingDisplay] = useState(0);

  useEffect(() => {
    setPhase("choose");
    setResult(null);
  }, [challengeIndex]);

  const handleChoose = useCallback(
    (option: ChallengeOption, optionIndex: number) => {
      setPhase("rolling");

      let ticks = 0;
      const interval = setInterval(() => {
        setRollingDisplay(Math.floor(Math.random() * 10) + 1);
        ticks++;
        if (ticks >= 12) {
          clearInterval(interval);
          const checkResult = performAbilityCheck(
            option.stat,
            effectiveStats[option.stat],
            option.difficultyBase,
            optionIndex,
          );
          setResult(checkResult);
          setRollingDisplay(checkResult.roll);
          setPhase("result");
          onResolve(checkResult);
        }
      }, 80);
    },
    [effectiveStats, onResolve],
  );

  return (
    <div className="challenge-panel animate-fade-in" style={{ width: "100%" }}>
      {/* Challenge header */}
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <p
          style={{
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--color-muted)",
            marginBottom: 4,
          }}
        >
          Challenge {challengeIndex + 1} of {totalChallenges}
        </p>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: theme.primary,
            marginBottom: 4,
          }}
        >
          {challenge.name}
        </h3>
        <p style={{ fontSize: 13, color: "var(--color-foreground)", opacity: 0.8 }}>
          {challenge.description}
        </p>
      </div>

      {/* Choose phase */}
      {phase === "choose" && (
        <div
          className="dropdown-enter"
          style={{ display: "flex", gap: 12, justifyContent: "center" }}
        >
          {challenge.options.map((opt, i) => {
            const isCombat = opt.triggersCombat && onStartCombat;
            const isParkour = opt.triggersParkour && onStartParkour;
            const isPuzzle = opt.triggersPuzzle && onStartPuzzle;
            const isSpecial = isCombat || isParkour || isPuzzle;
            const specialColor = isCombat ? "#ef4444" : isPuzzle ? "#a78bfa" : "#34d399";
            const catColor = isSpecial ? specialColor : CATEGORY_COLORS[opt.category];
            const statColor = STAT_COLORS[opt.stat];

            const handleClick = () => {
              if (isCombat) return onStartCombat(i);
              if (isParkour) return onStartParkour(i);
              if (isPuzzle) return onStartPuzzle(i);
              return handleChoose(opt, i);
            };

            return (
              <button
                key={i}
                onClick={handleClick}
                className="card-container"
                style={{
                  flex: "1 1 0",
                  maxWidth: 240,
                  padding: 16,
                  cursor: "pointer",
                  textAlign: "center",
                  borderColor: isSpecial ? `${specialColor}66` : `${catColor}30`,
                  ["--glow-color" as string]: isSpecial ? `${specialColor}80` : `${catColor}40`,
                  ["--accent-color" as string]: catColor,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 12,
                    pointerEvents: "none",
                    background: isSpecial
                      ? `radial-gradient(ellipse at 50% 30%, ${specialColor}14 0%, transparent 70%)`
                      : `radial-gradient(ellipse at 50% 30%, ${catColor}08 0%, transparent 70%)`,
                  }}
                />
                <div style={{ position: "relative", zIndex: 10 }}>
                  {isCombat ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        padding: "2px 8px",
                        borderRadius: 4,
                        color: "#ef4444",
                        background: "rgba(239, 68, 68, 0.15)",
                        marginBottom: 8,
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round">
                        <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
                        <path d="M13 19l6-6" />
                      </svg>
                      Combat
                    </span>
                  ) : isParkour ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        padding: "2px 8px",
                        borderRadius: 4,
                        color: "#34d399",
                        background: "rgba(52, 211, 153, 0.15)",
                        marginBottom: 8,
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      Parkour
                    </span>
                  ) : isPuzzle ? (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        padding: "2px 8px",
                        borderRadius: 4,
                        color: "#a78bfa",
                        background: "rgba(167, 139, 250, 0.15)",
                        marginBottom: 8,
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Puzzle
                    </span>
                  ) : (
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: 9,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        padding: "2px 8px",
                        borderRadius: 4,
                        color: catColor,
                        background: `${catColor}15`,
                        marginBottom: 8,
                      }}
                    >
                      {CATEGORY_LABELS[opt.category]}
                    </span>
                  )}
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-foreground)", marginBottom: 4 }}>
                    {opt.label}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: 8 }}>
                    {opt.description}
                  </p>
                  {isCombat ? (
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-mono), monospace",
                        fontWeight: 700,
                        color: "#ef4444",
                        background: "rgba(239, 68, 68, 0.12)",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      Enter Combat
                    </span>
                  ) : isParkour ? (
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-mono), monospace",
                        fontWeight: 700,
                        color: "#34d399",
                        background: "rgba(52, 211, 153, 0.12)",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      Enter Parkour
                    </span>
                  ) : isPuzzle ? (
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "var(--font-mono), monospace",
                        fontWeight: 700,
                        color: "#a78bfa",
                        background: "rgba(167, 139, 250, 0.12)",
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      Enter Puzzle
                    </span>
                  ) : (
                    <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: "var(--font-mono), monospace",
                          fontWeight: 700,
                          color: statColor,
                          background: `${statColor}12`,
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}
                      >
                        {STAT_LABELS[opt.stat]} +{effectiveStats[opt.stat]}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: "var(--font-mono), monospace",
                          color: "var(--color-muted)",
                        }}
                      >
                        DC {opt.difficultyBase}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Rolling phase */}
      {phase === "rolling" && (
        <div className="dice-roll-anim" style={{ textAlign: "center", padding: 24 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: 12,
              border: `2px solid ${theme.primary}40`,
              background: `${theme.primary}08`,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 36,
                fontWeight: 700,
                color: theme.primary,
              }}
            >
              {rollingDisplay}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--color-muted)" }}>Rolling...</p>
        </div>
      )}

      {/* Result phase */}
      {phase === "result" && result && (
        <div className={`challenge-result ${result.success ? "challenge-success" : "challenge-failure"}`}>
          {/* Roll breakdown */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 16,
              padding: 16,
              borderRadius: 12,
              background: result.success ? "rgba(74, 222, 128, 0.08)" : "rgba(248, 113, 113, 0.08)",
              border: `1px solid ${result.success ? "rgba(74, 222, 128, 0.2)" : "rgba(248, 113, 113, 0.2)"}`,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)", marginBottom: 2 }}>Roll</p>
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 28,
                  fontWeight: 700,
                  color: theme.primary,
                }}
              >
                {result.roll}
              </span>
            </div>
            <span style={{ fontSize: 20, color: "var(--color-muted)", fontWeight: 300 }}>+</span>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)", marginBottom: 2 }}>
                {STAT_LABELS[result.stat]}
              </p>
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 28,
                  fontWeight: 700,
                  color: STAT_COLORS[result.stat],
                }}
              >
                {result.total - result.roll}
              </span>
            </div>
            <span style={{ fontSize: 20, color: "var(--color-muted)", fontWeight: 300 }}>=</span>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)", marginBottom: 2 }}>Total</p>
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 28,
                  fontWeight: 700,
                  color: result.success ? "#4ade80" : "#f87171",
                }}
              >
                {result.total}
              </span>
            </div>
            <span style={{ fontSize: 16, color: "var(--color-muted)", fontWeight: 300, margin: "0 4px" }}>vs</span>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)", marginBottom: 2 }}>DC</p>
              <span
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--color-foreground)",
                }}
              >
                {result.dc}
              </span>
            </div>
          </div>

          {/* Outcome */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <p
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: result.success ? "#4ade80" : "#f87171",
                marginBottom: 4,
              }}
            >
              {result.success ? "Success!" : "Failed!"}
            </p>
            {!result.success && (
              <p style={{ fontSize: 13, color: "#f87171" }}>
                {result.hpChange} HP
              </p>
            )}
          </div>

          {/* Loot preview on last challenge success */}
          {isLastChallenge && result.success && loot && (
            <div style={{ marginBottom: 16 }} className="loot-card-enter">
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)", textAlign: "center", marginBottom: 8 }}>
                Loot Found
              </p>
              <div style={{ maxWidth: 280, margin: "0 auto" }}>
                <ItemTooltip item={loot} theme={theme} inline />
              </div>
            </div>
          )}

          {/* Gold loot preview on last challenge success */}
          {isLastChallenge && result.success && !loot && goldLoot != null && goldLoot > 0 && (
            <div style={{ marginBottom: 16, textAlign: "center" }} className="loot-card-enter">
              <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)", marginBottom: 8 }}>
                Gold Found
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 8, border: "1px solid rgba(251, 191, 36, 0.3)", background: "rgba(251, 191, 36, 0.08)" }}>
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="#fbbf24" strokeWidth="1" fill="rgba(251, 191, 36, 0.15)" />
                  <text x="7" y="10" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">G</text>
                </svg>
                <span style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "#fbbf24" }}>
                  {goldLoot}
                </span>
              </div>
            </div>
          )}

          {/* Proceed button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={onProceed}
              className="btn-stone px-8 py-2.5 text-sm font-semibold uppercase tracking-wider"
              style={{
                borderColor: `${theme.primary}40`,
              }}
            >
              {isLastChallenge ? "Continue" : "Next Challenge"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
