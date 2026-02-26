"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFaction } from "@/context/FactionContext";
import { FACTION_THEMES } from "@/lib/explorer/factionThemes";
import { computeMaxStatPoints } from "@/lib/explorer/statBuilder";

interface ChampionEntry {
  id: string;
  name: string;
  returnRate: number;
  stabilityScore: number;
}

interface ExplorerLevel {
  explorer_level: number;
  bonus_body: number;
  bonus_finesse: number;
  bonus_spirit: number;
  highest_floor: number;
  total_runs: number;
}

type ChampionsByFaction = Record<string, ChampionEntry[]>;
type LevelsByChampion = Record<string, ExplorerLevel>;

export default function VantheonExplorerPage() {
  const router = useRouter();
  const { factionId: contextFaction } = useFaction();
  const [champions, setChampions] = useState<ChampionsByFaction | null>(null);
  const [levels, setLevels] = useState<LevelsByChampion>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChampion, setSelectedChampion] = useState<ChampionEntry | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/champions?factions=${contextFaction}`).then((r) => {
        if (!r.ok) throw new Error("Failed to load champions");
        return r.json();
      }),
      fetch(`/api/explorer/levels?factions=${contextFaction}`)
        .then((r) => (r.ok ? r.json() : {}))
        .catch(() => ({})),
    ])
      .then(([champData, levelData]: [ChampionsByFaction, LevelsByChampion]) => {
        setChampions(champData);
        setLevels(levelData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [contextFaction]);

  const allChampions = useMemo(() => {
    if (!champions) return [];
    return Object.values(champions).flat();
  }, [champions]);

  const factionChampions = useMemo(() => {
    if (!champions) return [];
    return champions[contextFaction] ?? [];
  }, [champions, contextFaction]);

  function getChampionLevel(championId: string): number {
    return levels[championId]?.explorer_level ?? 1;
  }

  function getChampionLevelData(championId: string): ExplorerLevel | null {
    return levels[championId] ?? null;
  }

  function handleBeginExploration() {
    if (!selectedChampion) return;
    const statPoints = computeMaxStatPoints(
      selectedChampion.returnRate,
      selectedChampion.stabilityScore,
      allChampions,
    );
    const levelData = getChampionLevelData(selectedChampion.id);
    const params = new URLSearchParams({
      championId: selectedChampion.id,
      name: selectedChampion.name,
      factionId: contextFaction,
      returnRate: String(selectedChampion.returnRate),
      stabilityScore: String(selectedChampion.stabilityScore),
      statPoints: String(statPoints),
      explorerLevel: String(levelData?.explorer_level ?? 1),
      bonusBody: String(levelData?.bonus_body ?? 0),
      bonusFinesse: String(levelData?.bonus_finesse ?? 0),
      bonusSpirit: String(levelData?.bonus_spirit ?? 0),
    });
    router.push(`/vantheon-explorer/prepare?${params.toString()}`);
  }

  const theme = FACTION_THEMES[contextFaction];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--color-muted)] animate-pulse">
          Summoning champions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="rogue-explorer min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
          style={{ background: "var(--color-accent-primary-muted, rgba(255,255,255,0.06))" }}
        >
          <span style={{ filter: "saturate(0.8)" }}>&#x1F5FA;&#xFE0F;</span>
        </div>
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-foreground)" }}
          >
            Vantheon Explorer
          </h1>
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            Choose a champion and enter the Vantheon
          </p>
        </div>
      </div>

      {/* Faction subheader */}
      <div className="mb-5">
        <h2 className="text-lg font-bold" style={{ color: theme.primary }}>
          {theme.name}
        </h2>
        <p className="text-xs italic mt-0.5" style={{ color: "var(--color-muted)" }}>
          {theme.tagline}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Champion grid */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {factionChampions.map((champ) => {
              const isSelected = selectedChampion?.id === champ.id;
              const statBudget = computeMaxStatPoints(
                champ.returnRate,
                champ.stabilityScore,
                allChampions,
              );
              const lvl = getChampionLevel(champ.id);
              const rateStr = (champ.returnRate * 100).toFixed(2);
              const sign = champ.returnRate >= 0 ? "+" : "";

              return (
                <button
                  key={champ.id}
                  onClick={() => setSelectedChampion(champ)}
                  className="glass-card text-left rounded-xl transition-all duration-200 relative overflow-hidden group"
                  style={{
                    borderColor: isSelected ? theme.primary : "var(--color-border)",
                    boxShadow: isSelected
                      ? `0 0 16px ${theme.primary}30, inset 0 0 8px ${theme.primary}08`
                      : undefined,
                  }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                      background: isSelected
                        ? `linear-gradient(90deg, ${theme.gradientFrom}, ${theme.gradientTo})`
                        : "transparent",
                    }}
                  />

                  <div className="relative p-4">
                    {/* Name + Level row */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <p
                        className="font-bold text-sm tracking-wide truncate"
                        style={{
                          color: isSelected ? theme.primary : "var(--color-foreground)",
                        }}
                      >
                        {champ.name}
                      </p>
                      <span
                        className="text-[10px] font-mono font-bold flex-shrink-0 px-1.5 py-0.5 rounded"
                        style={{
                          color: lvl > 1 ? theme.primary : "var(--color-muted)",
                          background: lvl > 1 ? `${theme.primary}15` : "var(--color-surface)",
                        }}
                      >
                        Lv.{lvl}
                      </span>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-3 text-xs font-mono mb-3">
                      <span style={{ color: champ.returnRate >= 0 ? "#4ade80" : "#f87171" }}>
                        {sign}{rateStr}%
                      </span>
                      <span style={{ color: champ.stabilityScore >= 80 ? "#4ade80" : "#facc15" }}>
                        S:{champ.stabilityScore}
                      </span>
                    </div>

                    {/* Stat budget bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.2)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, (statBudget / 20) * 100)}%`,
                            background: `linear-gradient(90deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
                          }}
                        />
                      </div>
                      <span
                        className="text-[10px] font-mono font-bold flex-shrink-0"
                        style={{ color: theme.primary }}
                      >
                        {statBudget} pts
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected champion detail panel */}
        {selectedChampion && (
          <div className="w-full lg:w-80 flex-shrink-0">
            <div
              className="glass-card rounded-2xl overflow-hidden"
              style={{
                borderColor: `color-mix(in srgb, ${theme.primary} 20%, transparent)`,
              }}
            >
              <div
                className="h-0.5 w-full"
                style={{
                  background: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`,
                }}
              />
              <div className="p-6">
                <div className="text-center mb-5">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <p className="text-lg font-bold" style={{ color: theme.primary }}>
                      {selectedChampion.name}
                    </p>
                    <span
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded"
                      style={{
                        color: theme.primary,
                        background: `${theme.primary}15`,
                      }}
                    >
                      Lv.{getChampionLevel(selectedChampion.id)}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {theme.name} &middot;{" "}
                    {computeMaxStatPoints(
                      selectedChampion.returnRate,
                      selectedChampion.stabilityScore,
                      allChampions,
                    )}{" "}
                    stat points available
                  </p>
                </div>

                {/* Level bonus preview */}
                {(() => {
                  const ld = getChampionLevelData(selectedChampion.id);
                  if (!ld || (ld.bonus_body === 0 && ld.bonus_finesse === 0 && ld.bonus_spirit === 0)) return null;
                  return (
                    <div
                      className="rounded-lg p-3 mb-4"
                      style={{
                        background: `${theme.primary}08`,
                        border: `1px solid ${theme.primary}15`,
                      }}
                    >
                      <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--color-muted)" }}>
                        Level Bonuses
                      </p>
                      <div className="flex gap-3 text-xs font-mono">
                        {ld.bonus_body > 0 && (
                          <span style={{ color: "#ef4444" }}>Body +{ld.bonus_body}</span>
                        )}
                        {ld.bonus_finesse > 0 && (
                          <span style={{ color: "#22d3ee" }}>Finesse +{ld.bonus_finesse}</span>
                        )}
                        {ld.bonus_spirit > 0 && (
                          <span style={{ color: "#a78bfa" }}>Spirit +{ld.bonus_spirit}</span>
                        )}
                      </div>
                      {ld.highest_floor > 0 && (
                        <p className="text-[10px] mt-2" style={{ color: "var(--color-muted)" }}>
                          Highest floor: {ld.highest_floor} &middot; {ld.total_runs} run{ld.total_runs !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  );
                })()}

                <button
                  onClick={handleBeginExploration}
                  className="w-full py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 border-0"
                  style={{
                    background: `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
                    color: "#fff",
                    boxShadow: `0 4px 16px ${theme.primary}30`,
                    cursor: "pointer",
                  }}
                >
                  Prepare for the Vantheon
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
