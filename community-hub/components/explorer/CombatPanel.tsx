"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { StatBlock, ExplorerStat } from "@/types/explorer/explorer";
import { STAT_LABELS } from "@/types/explorer/explorer";
import type { CombatState, CombatLogEntry, EnemyInstance } from "@/types/explorer/vantheon";
import type { FactionTheme } from "@/lib/explorer/factionThemes";
import {
  rollD10,
  rollEnemyDie,
  computeAttackDamage,
  getEnemyAttackStat,
  advanceCombatTurn,
  buildTurnSequence,
} from "@/lib/explorer/combatEngine";

interface CombatPanelProps {
  combatState: CombatState;
  effectiveStats: StatBlock;
  playerInitiative: number;
  playerAC: number;
  floor: number;
  theme: FactionTheme;
  onCombatUpdate: (state: CombatState, hpChange: number) => void;
  onCombatVictory: (goldReward: number) => void;
  onCombatDefeat: () => void;
}

type AnimPhase = "idle" | "playerRolling" | "playerResult" | "enemyActing" | "enemyResult";

export default function CombatPanel({
  combatState,
  effectiveStats,
  playerInitiative,
  playerAC,
  floor,
  theme,
  onCombatUpdate,
  onCombatVictory,
  onCombatDefeat,
}: CombatPanelProps) {
  const [state, setState] = useState<CombatState>(combatState);
  const [animPhase, setAnimPhase] = useState<AnimPhase>("idle");
  const [rollingDisplay, setRollingDisplay] = useState(0);
  const [lastPlayerResult, setLastPlayerResult] = useState<{
    roll: number;
    stat: "body" | "finesse" | "spirit";
    statValue: number;
    damage: number;
    enemyAC: number;
    targetName: string;
  } | null>(null);
  const [lastEnemyResults, setLastEnemyResults] = useState<{
    name: string;
    roll: number;
    stat: "body" | "finesse" | "spirit";
    statValue: number;
    damage: number;
  }[]>([]);
  const logRef = useRef<HTMLDivElement>(null);
  const processingEnemyTurn = useRef(false);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [state.log]);

  useEffect(() => {
    if (state.phase === "enemyTurn" && animPhase === "idle" && !processingEnemyTurn.current) {
      processingEnemyTurn.current = true;
      processEnemyTurns();
    }
  }, [state.phase, animPhase]);

  const handlePlayerAttack = useCallback((attackStat: "body" | "finesse" | "spirit") => {
    if (state.phase !== "playerTurn" || animPhase !== "idle") return;

    const target = state.enemies[state.targetIndex];
    if (!target || target.currentHP <= 0) return;

    setAnimPhase("playerRolling");
    const statValue = effectiveStats[attackStat];

    let ticks = 0;
    const interval = setInterval(() => {
      setRollingDisplay(Math.floor(Math.random() * 10) + 1);
      ticks++;
      if (ticks >= 10) {
        clearInterval(interval);
        const roll = rollD10();
        setRollingDisplay(roll);
        const damage = computeAttackDamage(roll, statValue, target.ac);

        setLastPlayerResult({
          roll,
          stat: attackStat,
          statValue,
          damage,
          enemyAC: target.ac,
          targetName: target.name,
        });

        const newEnemies = state.enemies.map((e) =>
          e.id === target.id
            ? { ...e, currentHP: Math.max(0, e.currentHP - damage) }
            : e,
        );

        const logEntry: CombatLogEntry = {
          actor: "You",
          action: attackStat === "body" ? "strike" : attackStat === "finesse" ? "slash" : "hex",
          damage,
          targetName: target.name,
          roll,
          stat: attackStat,
        };

        const newState: CombatState = {
          ...state,
          enemies: newEnemies,
          log: [...state.log, logEntry],
        };

        const allDead = newEnemies.every((e) => e.currentHP <= 0);
        if (allDead) {
          newState.phase = "victory";
          setState(newState);
          setAnimPhase("playerResult");
          onCombatUpdate(newState, 0);
          return;
        }

        const advanced = advanceCombatTurn(newState, playerInitiative);
        setState(advanced);
        setAnimPhase("playerResult");
        onCombatUpdate(advanced, 0);
      }
    }, 70);
  }, [state, animPhase, effectiveStats, playerInitiative, onCombatUpdate]);

  const processEnemyTurns = useCallback(() => {
    setAnimPhase("enemyActing");

    const results: typeof lastEnemyResults = [];
    let currentState = { ...state };
    let totalDamageToPlayer = 0;

    const enemyTurns: EnemyInstance[] = [];
    const idx = currentState.currentTurnIdx;
    const seq = currentState.turnSequence;

    const currentActor = seq[idx];
    if (currentActor && currentActor.actor !== "player") {
      const enemy = currentState.enemies.find((e) => e.id === currentActor.actor && e.currentHP > 0);
      if (enemy) enemyTurns.push(enemy);
    }

    // Peek forward without wrapping to collect consecutive enemy turns only
    let lastEnemySeqIdx = idx;
    let peekIdx = idx + 1;
    while (peekIdx < seq.length && seq[peekIdx].actor !== "player") {
      const enemy = currentState.enemies.find((e) => e.id === seq[peekIdx].actor && e.currentHP > 0);
      if (enemy && !enemyTurns.find((et) => et.id === enemy.id)) {
        enemyTurns.push(enemy);
      }
      lastEnemySeqIdx = peekIdx;
      peekIdx++;
    }

    // If no alive enemies to act, advance past the dead turns immediately
    if (enemyTurns.length === 0) {
      const advanced = advanceCombatTurn(
        { ...currentState, currentTurnIdx: lastEnemySeqIdx },
        playerInitiative,
      );
      setTimeout(() => {
        setState(advanced);
        setAnimPhase("idle");
        onCombatUpdate(advanced, 0);
        processingEnemyTurn.current = false;
      }, 100);
      return;
    }

    for (const enemy of enemyTurns) {
      const { stat, value } = getEnemyAttackStat(enemy);
      const roll = rollEnemyDie(floor);
      const damage = computeAttackDamage(roll, value, playerAC);
      totalDamageToPlayer += damage;

      results.push({ name: enemy.name, roll, stat, statValue: value, damage });

      const logEntry: CombatLogEntry = {
        actor: enemy.name,
        action: stat === "body" ? "strikes" : stat === "finesse" ? "slashes" : "hexes",
        damage,
        targetName: "You",
        roll,
        stat,
      };
      currentState = {
        ...currentState,
        log: [...currentState.log, logEntry],
      };
    }

    // Delegate turn advancement to advanceCombatTurn which properly skips
    // dead enemies and handles round boundaries
    const advanced = advanceCombatTurn(
      { ...currentState, currentTurnIdx: lastEnemySeqIdx },
      playerInitiative,
    );

    setLastEnemyResults(results);

    setTimeout(() => {
      setState(advanced);
      setAnimPhase("enemyResult");
      onCombatUpdate(advanced, -totalDamageToPlayer);
      processingEnemyTurn.current = false;
    }, 600);
  }, [state, playerInitiative, playerAC, onCombatUpdate]);

  const handleDismissResult = useCallback(() => {
    setLastPlayerResult(null);
    setLastEnemyResults([]);
    setAnimPhase("idle");
  }, []);

  useEffect(() => {
    if (animPhase === "enemyResult" && lastEnemyResults.length === 0) {
      handleDismissResult();
    }
  }, [animPhase, lastEnemyResults, handleDismissResult]);

  const handleChangeTarget = useCallback((index: number) => {
    if (state.enemies[index]?.currentHP <= 0) return;
    setState((s) => ({ ...s, targetIndex: index }));
  }, [state.enemies]);

  const aliveEnemies = state.enemies.filter((e) => e.currentHP > 0);

  return (
    <div className="animate-fade-in" style={{ width: "100%" }}>
      {/* Combat header */}
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <p
          style={{
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#ef4444",
            marginBottom: 4,
            fontWeight: 700,
          }}
        >
          Combat
        </p>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.primary }}>
          {aliveEnemies.length === 0
            ? "Victory!"
            : aliveEnemies.length === 1
              ? `vs ${aliveEnemies[0].name}`
              : `vs ${aliveEnemies.length} Enemies`}
        </h3>
      </div>

      {/* Enemy cards */}
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {state.enemies.map((enemy, i) => {
          const isDead = enemy.currentHP <= 0;
          const isTarget = i === state.targetIndex;
          const hpPercent = Math.max(0, (enemy.currentHP / enemy.maxHP) * 100);
          const hpColor = hpPercent > 50 ? "#4ade80" : hpPercent > 25 ? "#fbbf24" : "#ef4444";

          return (
            <button
              key={enemy.id}
              onClick={() => handleChangeTarget(i)}
              disabled={isDead}
              style={{
                flex: "1 1 0",
                maxWidth: 180,
                minWidth: 140,
                padding: 12,
                borderRadius: 12,
                border: `2px solid ${isDead ? "var(--color-border)" : isTarget ? "#ef4444" : `${theme.primary}30`}`,
                background: isDead
                  ? "rgba(0,0,0,0.2)"
                  : isTarget
                    ? "rgba(239, 68, 68, 0.08)"
                    : `${theme.primary}05`,
                opacity: isDead ? 0.4 : 1,
                cursor: isDead ? "not-allowed" : "pointer",
                textAlign: "center",
                transition: "all 0.2s",
                color: "inherit",
              }}
            >
              {/* Enemy icon */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  margin: "0 auto 8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDead ? "rgba(100,100,100,0.2)" : "rgba(239, 68, 68, 0.12)",
                  border: `1px solid ${isDead ? "rgba(100,100,100,0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isDead ? "#666" : "#ef4444"} strokeWidth="2" strokeLinecap="round">
                  {isDead ? (
                    <path d="M18 6L6 18M6 6l12 12" />
                  ) : (
                    <>
                      <circle cx="12" cy="8" r="4" />
                      <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                    </>
                  )}
                </svg>
              </div>

              <p style={{ fontSize: 12, fontWeight: 600, color: isDead ? "var(--color-muted)" : "var(--color-foreground)", marginBottom: 6 }}>
                {enemy.name}
                {isDead && " (Dead)"}
              </p>

              {/* HP bar */}
              <div style={{ marginBottom: 6 }}>
                <div
                  style={{
                    position: "relative",
                    height: 6,
                    borderRadius: 9999,
                    overflow: "hidden",
                    background: "rgba(0,0,0,0.3)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: "0 auto 0 0",
                      borderRadius: 9999,
                      width: `${hpPercent}%`,
                      background: hpColor,
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>
                <p style={{ fontSize: 10, fontFamily: "var(--font-mono), monospace", color: hpColor, marginTop: 2 }}>
                  {enemy.currentHP} / {enemy.maxHP} HP
                </p>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 9, fontFamily: "var(--font-mono), monospace", padding: "1px 4px", borderRadius: 3, background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}>
                  {STAT_LABELS.body} {enemy.body}
                </span>
                <span style={{ fontSize: 9, fontFamily: "var(--font-mono), monospace", padding: "1px 4px", borderRadius: 3, background: "rgba(34, 211, 238, 0.1)", color: "#22d3ee" }}>
                  {STAT_LABELS.finesse} {enemy.finesse}
                </span>
                <span style={{ fontSize: 9, fontFamily: "var(--font-mono), monospace", padding: "1px 4px", borderRadius: 3, background: "rgba(167, 139, 250, 0.1)", color: "#a78bfa" }}>
                  {STAT_LABELS.spirit} {enemy.spirit}
                </span>
                <span style={{ fontSize: 9, fontFamily: "var(--font-mono), monospace", padding: "1px 4px", borderRadius: 3, background: "rgba(96, 165, 250, 0.1)", color: "#60a5fa" }}>
                  AC {enemy.ac}
                </span>
              </div>

              {isTarget && !isDead && (
                <div style={{ marginTop: 6 }}>
                  <span style={{ fontSize: 8, textTransform: "uppercase", letterSpacing: "0.1em", color: "#ef4444", fontWeight: 700 }}>
                    Targeted
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Player turn actions */}
      {state.phase === "playerTurn" && animPhase === "idle" && (
        <div className="dropdown-enter" style={{ textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Your Turn — Choose an Attack
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => handlePlayerAttack("body")}
              className="card-container"
              style={{
                padding: "16px 24px",
                cursor: "pointer",
                textAlign: "center",
                borderColor: "rgba(239, 68, 68, 0.3)",
                ["--glow-color" as string]: "rgba(239, 68, 68, 0.4)",
                ["--accent-color" as string]: "#ef4444",
                minWidth: 120,
              }}
            >
              <div style={{ position: "relative", zIndex: 10 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" style={{ margin: "0 auto 8px" }}>
                  <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
                  <path d="M13 19l6-6" />
                  <path d="M16 16l4 4" />
                </svg>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-foreground)", marginBottom: 2 }}>
                  Strike
                </p>
                <p style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 6 }}>
                  Brute force
                </p>
                <span style={{
                  fontSize: 12,
                  fontFamily: "var(--font-mono), monospace",
                  fontWeight: 700,
                  color: "#ef4444",
                  background: "rgba(239, 68, 68, 0.12)",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}>
                  {STAT_LABELS.body} +{effectiveStats.body}
                </span>
              </div>
            </button>

            <button
              onClick={() => handlePlayerAttack("finesse")}
              className="card-container"
              style={{
                padding: "16px 24px",
                cursor: "pointer",
                textAlign: "center",
                borderColor: "rgba(34, 211, 238, 0.3)",
                ["--glow-color" as string]: "rgba(34, 211, 238, 0.4)",
                ["--accent-color" as string]: "#22d3ee",
                minWidth: 120,
              }}
            >
              <div style={{ position: "relative", zIndex: 10 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" style={{ margin: "0 auto 8px" }}>
                  <path d="M5 12l5-5 5 5" />
                  <path d="M12 19V7" />
                  <path d="M19 5l-7 7-7-7" />
                </svg>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-foreground)", marginBottom: 2 }}>
                  Slash
                </p>
                <p style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 6 }}>
                  Precise attack
                </p>
                <span style={{
                  fontSize: 12,
                  fontFamily: "var(--font-mono), monospace",
                  fontWeight: 700,
                  color: "#22d3ee",
                  background: "rgba(34, 211, 238, 0.12)",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}>
                  {STAT_LABELS.finesse} +{effectiveStats.finesse}
                </span>
              </div>
            </button>

            <button
              onClick={() => handlePlayerAttack("spirit")}
              className="card-container"
              style={{
                padding: "16px 24px",
                cursor: "pointer",
                textAlign: "center",
                borderColor: "rgba(167, 139, 250, 0.3)",
                ["--glow-color" as string]: "rgba(167, 139, 250, 0.4)",
                ["--accent-color" as string]: "#a78bfa",
                minWidth: 120,
              }}
            >
              <div style={{ position: "relative", zIndex: 10 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" style={{ margin: "0 auto 8px" }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10" />
                  <path d="M12 8v4" />
                  <path d="M12 16h.01" />
                  <path d="M17 3l2 2-2 2" />
                  <path d="M22 5h-5" />
                </svg>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-foreground)", marginBottom: 2 }}>
                  Hex
                </p>
                <p style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 6 }}>
                  Dark energy
                </p>
                <span style={{
                  fontSize: 12,
                  fontFamily: "var(--font-mono), monospace",
                  fontWeight: 700,
                  color: "#a78bfa",
                  background: "rgba(167, 139, 250, 0.12)",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}>
                  {STAT_LABELS.spirit} +{effectiveStats.spirit}
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Rolling animation */}
      {animPhase === "playerRolling" && (
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
            <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 36, fontWeight: 700, color: theme.primary }}>
              {rollingDisplay}
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--color-muted)" }}>Rolling...</p>
        </div>
      )}

      {/* Player attack result */}
      {animPhase === "playerResult" && lastPlayerResult && (
        <div className="animate-fade-in" style={{ textAlign: "center", marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 12,
              padding: 14,
              borderRadius: 12,
              background: lastPlayerResult.damage > 0 ? "rgba(74, 222, 128, 0.08)" : "rgba(248, 113, 113, 0.08)",
              border: `1px solid ${lastPlayerResult.damage > 0 ? "rgba(74, 222, 128, 0.2)" : "rgba(248, 113, 113, 0.2)"}`,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-muted)", marginBottom: 2 }}>Roll</p>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 24, fontWeight: 700, color: theme.primary }}>{lastPlayerResult.roll}</span>
            </div>
            <span style={{ fontSize: 18, color: "var(--color-muted)" }}>+</span>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-muted)", marginBottom: 2 }}>
                {STAT_LABELS[lastPlayerResult.stat]}
              </p>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 24, fontWeight: 700, color: lastPlayerResult.stat === "body" ? "#ef4444" : lastPlayerResult.stat === "finesse" ? "#22d3ee" : "#a78bfa" }}>
                {lastPlayerResult.statValue}
              </span>
            </div>
            <span style={{ fontSize: 14, color: "var(--color-muted)", margin: "0 2px" }}>vs</span>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-muted)", marginBottom: 2 }}>AC</p>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 24, fontWeight: 700, color: "#60a5fa" }}>{lastPlayerResult.enemyAC}</span>
            </div>
            <span style={{ fontSize: 18, color: "var(--color-muted)" }}>=</span>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-muted)", marginBottom: 2 }}>DMG</p>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 24, fontWeight: 700, color: lastPlayerResult.damage > 0 ? "#4ade80" : "#f87171" }}>
                {lastPlayerResult.damage}
              </span>
            </div>
          </div>

          <p style={{ fontSize: 14, fontWeight: 600, color: lastPlayerResult.damage > 0 ? "#4ade80" : "var(--color-muted)", marginBottom: 12 }}>
            {lastPlayerResult.damage > 0
              ? `You deal ${lastPlayerResult.damage} damage to ${lastPlayerResult.targetName}!`
              : `Your attack misses ${lastPlayerResult.targetName}!`}
          </p>

          <button onClick={handleDismissResult} className="btn-stone px-6 py-2 text-sm font-semibold uppercase tracking-wider" style={{ borderColor: `${theme.primary}40` }}>
            Continue
          </button>
        </div>
      )}

      {/* Enemy turn animation */}
      {animPhase === "enemyActing" && (
        <div style={{ textAlign: "center", padding: 24 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 60,
              borderRadius: 12,
              border: "2px solid rgba(239, 68, 68, 0.3)",
              background: "rgba(239, 68, 68, 0.08)",
              marginBottom: 8,
              animation: "pulse 0.8s infinite",
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
              <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
              <path d="M13 19l6-6" />
            </svg>
          </div>
          <p style={{ fontSize: 12, color: "#ef4444", fontWeight: 600 }}>Enemies attacking...</p>
        </div>
      )}

      {/* Enemy attack results */}
      {animPhase === "enemyResult" && lastEnemyResults.length > 0 && (
        <div className="animate-fade-in" style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {lastEnemyResults.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  background: r.damage > 0 ? "rgba(248, 113, 113, 0.08)" : "rgba(74, 222, 128, 0.08)",
                  border: `1px solid ${r.damage > 0 ? "rgba(248, 113, 113, 0.2)" : "rgba(74, 222, 128, 0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-foreground)", minWidth: 100 }}>
                  {r.name}
                </span>
                <span style={{ fontSize: 10, fontFamily: "var(--font-mono), monospace", color: "var(--color-muted)" }}>
                  Roll {r.roll} + {STAT_LABELS[r.stat as ExplorerStat]} {r.statValue}
                </span>
                <span style={{ fontSize: 10, color: "var(--color-muted)" }}>→</span>
                <span style={{
                  fontSize: 14,
                  fontFamily: "var(--font-mono), monospace",
                  fontWeight: 700,
                  color: r.damage > 0 ? "#f87171" : "#4ade80",
                }}>
                  {r.damage > 0 ? `-${r.damage} HP` : "Miss!"}
                </span>
              </div>
            ))}
          </div>

          {state.phase !== "defeat" && (
            <button onClick={handleDismissResult} className="btn-stone px-6 py-2 text-sm font-semibold uppercase tracking-wider" style={{ borderColor: `${theme.primary}40` }}>
              Continue
            </button>
          )}
        </div>
      )}

      {/* Victory */}
      {state.phase === "victory" && animPhase === "idle" && (
        <div className="animate-fade-in" style={{ textAlign: "center" }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: "0 auto 12px" }}>
            <circle cx="28" cy="28" r="24" stroke="#4ade80" strokeWidth="2" fill="rgba(74, 222, 128, 0.1)" />
            <path d="M18 28l6 6 14-14" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#4ade80", marginBottom: 8 }}>
            Combat Won!
          </h3>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid rgba(251, 191, 36, 0.3)",
              background: "rgba(251, 191, 36, 0.08)",
              marginBottom: 16,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#fbbf24" strokeWidth="1.5" fill="rgba(251, 191, 36, 0.15)" />
              <text x="10" y="14" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">G</text>
            </svg>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "#fbbf24" }}>
              +{state.goldReward}
            </span>
            <span style={{ fontSize: 12, color: "#fbbf24" }}>Gold</span>
          </div>

          <div>
            <button
              onClick={() => onCombatVictory(state.goldReward)}
              className="btn-stone px-8 py-2.5 text-sm font-semibold uppercase tracking-wider"
              style={{ borderColor: `${theme.primary}40` }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Combat Log */}
      {state.log.length > 0 && (
        <div
          ref={logRef}
          style={{
            marginTop: 16,
            maxHeight: 120,
            overflowY: "auto",
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid var(--color-border)",
            background: "rgba(0,0,0,0.15)",
          }}
        >
          <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-muted)", marginBottom: 4, fontWeight: 600 }}>
            Combat Log
          </p>
          {state.log.map((entry, i) => (
            <p key={i} style={{ fontSize: 11, color: "var(--color-muted)", lineHeight: 1.6 }}>
              <span style={{ color: entry.actor === "You" ? "#4ade80" : "#f87171", fontWeight: 600 }}>{entry.actor}</span>
              {" "}
              {entry.action}
              {" "}
              <span style={{ color: "var(--color-foreground)" }}>{entry.targetName}</span>
              {" "}
              {entry.damage > 0 ? (
                <span style={{ fontFamily: "var(--font-mono), monospace", color: entry.actor === "You" ? "#4ade80" : "#f87171", fontWeight: 700 }}>
                  [{entry.damage} dmg]
                </span>
              ) : (
                <span style={{ fontFamily: "var(--font-mono), monospace", color: "var(--color-muted)" }}>
                  [miss]
                </span>
              )}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
