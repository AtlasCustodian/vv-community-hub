"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { FactionId, RawChampion } from "@/types/explorer";
import { FACTION_THEMES, ALL_FACTION_IDS } from "@/lib/factionThemes";
import { computeMaxStatPoints } from "@/lib/statBuilder";

type ChampionsByFaction = Record<string, RawChampion[]>;

export default function ChampionSelectPage() {
  const router = useRouter();
  const [champions, setChampions] = useState<ChampionsByFaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFaction, setSelectedFaction] = useState<FactionId>("fire");
  const [selectedChampion, setSelectedChampion] = useState<RawChampion | null>(
    null,
  );

  useEffect(() => {
    document.documentElement.dataset.faction = selectedFaction;
  }, [selectedFaction]);

  useEffect(() => {
    fetch("/api/champions")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load champions");
        return r.json();
      })
      .then((data: ChampionsByFaction) => {
        setChampions(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const allChampions = useMemo(() => {
    if (!champions) return [];
    return Object.values(champions).flat();
  }, [champions]);

  const factionChampions = useMemo(() => {
    if (!champions) return [];
    return champions[selectedFaction] ?? [];
  }, [champions, selectedFaction]);

  function handleBeginExploration() {
    if (!selectedChampion) return;
    const statPoints = computeMaxStatPoints(
      selectedChampion.returnRate,
      selectedChampion.stabilityScore,
      allChampions,
    );
    const params = new URLSearchParams({
      championId: selectedChampion.id,
      name: selectedChampion.name,
      factionId: selectedFaction,
      returnRate: String(selectedChampion.returnRate),
      stabilityScore: String(selectedChampion.stabilityScore),
      statPoints: String(statPoints),
    });
    router.push(`/prepare?${params.toString()}`);
  }

  const theme = FACTION_THEMES[selectedFaction];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--color-muted)] animate-pulse-slow">
          Summoning champions...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--color-accent-tertiary)]">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12">
      {/* Title */}
      <div className="text-center mb-10 animate-fade-in">
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(to right, var(--color-accent-glow), var(--color-accent-primary), var(--color-accent-glow))`,
          }}
        >
          Rogue Explorer
        </h1>
        <p className="text-sm mt-2 text-[var(--color-muted)] tracking-widest uppercase">
          Choose your Champion
        </p>
      </div>

      {/* Faction tabs */}
      <div className="flex gap-2 mb-8 flex-wrap justify-center animate-fade-in">
        {ALL_FACTION_IDS.map((fid) => {
          const ft = FACTION_THEMES[fid];
          const isActive = fid === selectedFaction;
          return (
            <button
              key={fid}
              onClick={() => {
                setSelectedFaction(fid);
                setSelectedChampion(null);
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border"
              style={{
                borderColor: isActive ? ft.primary : "var(--color-border)",
                background: isActive ? `${ft.primary}15` : "transparent",
                color: isActive ? ft.primary : "var(--color-muted)",
                boxShadow: isActive
                  ? `0 0 12px ${ft.primary}20`
                  : "none",
              }}
            >
              <span className="mr-1.5">{ft.emoji}</span>
              {ft.shortName}
            </button>
          );
        })}
      </div>

      {/* Faction header */}
      <div className="text-center mb-6 animate-fade-in">
        <h2
          className="text-xl font-bold"
          style={{ color: theme.primary }}
        >
          {theme.name}
        </h2>
        <p className="text-xs text-[var(--color-muted)] italic mt-1">
          {theme.tagline}
        </p>
      </div>

      {/* Champion grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full max-w-5xl mb-10">
        {factionChampions.map((champ) => {
          const isSelected = selectedChampion?.id === champ.id;
          const statBudget = computeMaxStatPoints(
            champ.returnRate,
            champ.stabilityScore,
            allChampions,
          );
          const rateStr = (champ.returnRate * 100).toFixed(2);
          const sign = champ.returnRate >= 0 ? "+" : "";

          return (
            <button
              key={champ.id}
              onClick={() => setSelectedChampion(champ)}
              className="text-left rounded-xl border p-4 transition-all duration-200"
              style={{
                borderColor: isSelected
                  ? theme.primary
                  : "var(--color-border)",
                background: isSelected
                  ? `${theme.primary}10`
                  : "var(--color-surface)",
                boxShadow: isSelected
                  ? `0 0 20px ${theme.primary}20`
                  : "none",
                transform: isSelected ? "scale(1.02)" : "scale(1)",
              }}
            >
              <p className="font-semibold text-sm text-[var(--color-foreground)] truncate">
                {champ.name}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                <span
                  style={{
                    color:
                      champ.returnRate >= 0 ? "#4ade80" : "#f87171",
                  }}
                >
                  {sign}{rateStr}%
                </span>
                <span
                  style={{
                    color:
                      champ.stabilityScore >= 80
                        ? "#4ade80"
                        : "#facc15",
                  }}
                >
                  S:{champ.stabilityScore}
                </span>
                <span
                  className="ml-auto px-1.5 py-0.5 rounded text-[10px]"
                  style={{
                    background: `${theme.primary}20`,
                    color: theme.primary,
                  }}
                >
                  {statBudget} pts
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected champion detail + begin button */}
      {selectedChampion && (
        <div className="w-full max-w-md animate-slide-up">
          <div
            className="glass-card p-6 text-center"
            style={{ borderColor: `${theme.primary}30` }}
          >
            <p
              className="text-lg font-bold mb-1"
              style={{ color: theme.primary }}
            >
              {selectedChampion.name}
            </p>
            <p className="text-xs text-[var(--color-muted)] mb-4">
              {theme.name} &middot;{" "}
              {computeMaxStatPoints(
                selectedChampion.returnRate,
                selectedChampion.stabilityScore,
                allChampions,
              )}{" "}
              stat points available
            </p>
            <button
              onClick={handleBeginExploration}
              className="btn-stone text-base px-8 py-3 w-full font-bold uppercase tracking-wider"
              style={{
                borderColor: theme.primary,
                background: `linear-gradient(135deg, ${theme.gradientFrom}20, ${theme.gradientTo}20)`,
              }}
            >
              Prepare for the Tower
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
