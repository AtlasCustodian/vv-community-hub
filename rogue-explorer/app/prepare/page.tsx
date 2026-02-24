"use client";

import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type {
  FactionId,
  ExplorerStat,
  StatBlock,
  ItemSlot,
  Item,
  Equipment,
  ExplorerChampion,
  GameSave,
} from "@/types/explorer";
import {
  EXPLORER_STATS,
  STAT_LABELS,
  STAT_DESCRIPTIONS,
  ITEM_SLOTS,
  SLOT_LABELS,
  emptyEquipment,
  emptyStats,
} from "@/types/explorer";
import { MAX_STAT_POINTS, MAX_PER_STAT, computeEffectiveStats, totalAllocated } from "@/lib/statBuilder";
import { getItemsForSlot } from "@/data/itemCatalog";
import { FACTION_THEMES } from "@/lib/factionThemes";
import { saveToLocal, saveToServer } from "@/lib/saveManager";

const STAT_COLORS: Record<ExplorerStat, string> = {
  dexterity: "#22d3ee",
  strength: "#ef4444",
  constitution: "#f59e0b",
  intelligence: "#a78bfa",
  wisdom: "#34d399",
  charisma: "#f472b6",
};

function PrepareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const championId = searchParams.get("championId") ?? "";
  const championName = searchParams.get("name") ?? "Unknown";
  const rawFaction = searchParams.get("factionId") ?? "fire";
  const factionId = (rawFaction in FACTION_THEMES ? rawFaction : "fire") as FactionId;
  const returnRate = parseFloat(searchParams.get("returnRate") ?? "0");
  const stabilityScore = parseFloat(searchParams.get("stabilityScore") ?? "0");
  const maxPoints = parseInt(searchParams.get("statPoints") ?? "10", 10);

  const theme = FACTION_THEMES[factionId];

  useEffect(() => {
    document.documentElement.dataset.faction = factionId;
  }, [factionId]);

  const [baseStats, setBaseStats] = useState<StatBlock>(emptyStats());
  const [equipment, setEquipment] = useState<Equipment>(emptyEquipment());
  const [activeSlot, setActiveSlot] = useState<ItemSlot | null>(null);
  const [saving, setSaving] = useState(false);

  const allocated = totalAllocated(baseStats);
  const remaining = Math.max(0, maxPoints - allocated);
  const effectiveStats = useMemo(
    () => computeEffectiveStats(baseStats, equipment),
    [baseStats, equipment],
  );

  const saveId = useMemo(
    () => `save-${championId}-${Date.now()}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [championId],
  );

  const buildGameSave = useCallback((): GameSave => {
    const champion: ExplorerChampion = {
      id: saveId,
      championId,
      name: championName,
      factionId,
      baseStats,
      equipment,
      inventory: [],
      returnRate,
      stabilityScore,
    };
    return {
      id: saveId,
      champion,
      tower: null,
      status: "preparing",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [saveId, championId, championName, factionId, baseStats, equipment, returnRate, stabilityScore]);

  useEffect(() => {
    if (championId) {
      saveToLocal(buildGameSave());
    }
  }, [championId, buildGameSave]);

  function handleStatChange(stat: ExplorerStat, delta: number) {
    setBaseStats((prev) => {
      const current = prev[stat];
      const newVal = current + delta;
      if (newVal < 0 || newVal > MAX_PER_STAT) return prev;
      const newAllocated = totalAllocated(prev) + delta;
      if (newAllocated > maxPoints) return prev;
      return { ...prev, [stat]: newVal };
    });
  }

  function handleEquipItem(item: Item) {
    setEquipment((prev) => ({ ...prev, [item.slot]: item }));
    setActiveSlot(null);
  }

  function handleUnequipSlot(slot: ItemSlot) {
    setEquipment((prev) => ({ ...prev, [slot]: null }));
  }

  async function handleEnterTower() {
    setSaving(true);
    const save = buildGameSave();
    save.status = "exploring";
    save.updatedAt = new Date().toISOString();
    saveToLocal(save);
    await saveToServer(save);
    router.push(`/tower?saveId=${save.id}`);
  }

  const slotItems = activeSlot ? getItemsForSlot(activeSlot) : [];

  return (
    <div className="min-h-screen px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 animate-fade-in">
        <button
          onClick={() => router.push("/")}
          className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors text-sm"
        >
          &larr; Back
        </button>
        <div className="flex-1" />
        <div className="text-right">
          <h1
            className="text-2xl font-bold"
            style={{ color: theme.primary }}
          >
            {championName}
          </h1>
          <p className="text-xs text-[var(--color-muted)]">
            {FACTION_THEMES[factionId].name} &middot; Preparing for the Tower
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Left Panel: Stat Allocation ── */}
        <div className="flex-1 min-w-0">
          <div
            className="glass-card overflow-hidden"
            style={{ borderColor: `${theme.primary}20` }}
          >
            <div
              className="h-0.5 w-full"
              style={{
                background: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`,
              }}
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="stat-label text-[var(--color-muted)]">
                  Allocate Stats
                </h2>
                <span
                  className="text-xs font-mono px-2.5 py-1 rounded-md"
                  style={{
                    color: remaining > 0 ? "#facc15" : "#4ade80",
                    background:
                      remaining > 0
                        ? "rgba(250, 204, 21, 0.1)"
                        : "rgba(74, 222, 128, 0.1)",
                  }}
                >
                  {remaining} / {maxPoints} remaining
                </span>
              </div>

              <div className="space-y-4">
                {EXPLORER_STATS.map((stat) => {
                  const color = STAT_COLORS[stat];
                  const val = baseStats[stat];
                  const eff = effectiveStats[stat];
                  const bonus = eff - val;

                  return (
                    <div key={stat} className="flex items-center gap-3">
                      <div className="w-24">
                        <div
                          className="stat-label"
                          style={{ color }}
                        >
                          {STAT_LABELS[stat]}
                        </div>
                        <div className="text-[10px] text-[var(--color-muted)] leading-tight mt-0.5">
                          {STAT_DESCRIPTIONS[stat]}
                        </div>
                      </div>

                      <button
                        onClick={() => handleStatChange(stat, -1)}
                        disabled={val <= 0}
                        className="w-7 h-7 rounded-md border text-sm font-bold flex items-center justify-center disabled:opacity-20 transition-colors hover:bg-[var(--color-surface-hover)]"
                        style={{ borderColor: `${color}40` }}
                      >
                        -
                      </button>

                      <div className="flex-1">
                        <div className="relative h-3 rounded-full overflow-hidden bg-black/30">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-200"
                            style={{
                              width: `${(val / MAX_PER_STAT) * 100}%`,
                              background: color,
                              opacity: 0.8,
                            }}
                          />
                        </div>
                      </div>

                      <div className="w-16 text-right font-mono text-sm font-bold flex items-baseline gap-1 justify-end">
                        <span style={{ color }}>{val}</span>
                        <span className="text-[var(--color-muted)] text-[10px]">
                          /{MAX_PER_STAT}
                        </span>
                        {bonus !== 0 && (
                          <span
                            className="text-[10px]"
                            style={{
                              color: bonus > 0 ? "#4ade80" : "#f87171",
                            }}
                          >
                            {bonus > 0 ? "+" : ""}{bonus}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleStatChange(stat, 1)}
                        disabled={
                          val >= MAX_PER_STAT || remaining <= 0
                        }
                        className="w-7 h-7 rounded-md border text-sm font-bold flex items-center justify-center disabled:opacity-20 transition-colors hover:bg-[var(--color-surface-hover)]"
                        style={{ borderColor: `${color}40` }}
                      >
                        +
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Effective stats summary */}
              <div
                className="mt-6 pt-4 border-t flex flex-wrap gap-3"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] w-full mb-1">
                  Effective Stats (base + equipment)
                </span>
                {EXPLORER_STATS.map((stat) => (
                  <div
                    key={stat}
                    className="px-2.5 py-1 rounded-md text-xs font-mono"
                    style={{
                      background: `${STAT_COLORS[stat]}10`,
                      color: STAT_COLORS[stat],
                    }}
                  >
                    {STAT_LABELS[stat]} {effectiveStats[stat]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel: Equipment Selection ── */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div
            className="glass-card overflow-hidden"
            style={{ borderColor: `${theme.primary}20` }}
          >
            <div
              className="h-0.5 w-full"
              style={{
                background: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`,
              }}
            />
            <div className="p-6">
              <h2 className="stat-label text-[var(--color-muted)] mb-5">
                Equipment
              </h2>

              <div className="space-y-2">
                {ITEM_SLOTS.map((slot) => {
                  const item = equipment[slot];
                  const isActive = activeSlot === slot;

                  return (
                    <div key={slot}>
                      <button
                        onClick={() =>
                          setActiveSlot(isActive ? null : slot)
                        }
                        className="w-full text-left rounded-lg border px-3 py-2.5 transition-all duration-200"
                        style={{
                          borderColor: isActive
                            ? theme.primary
                            : item
                              ? `${theme.primary}30`
                              : "var(--color-border)",
                          background: isActive
                            ? `${theme.primary}10`
                            : item
                              ? `${theme.primary}05`
                              : "transparent",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                              {SLOT_LABELS[slot]}
                            </span>
                            {item ? (
                              <p className="text-sm font-medium text-[var(--color-foreground)]">
                                {item.name}
                              </p>
                            ) : (
                              <p className="text-sm text-[var(--color-muted)] italic">
                                Empty
                              </p>
                            )}
                          </div>
                          {item && (
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {Object.entries(
                                  item.statModifiers,
                                ).map(([s, v]) => (
                                  <span
                                    key={s}
                                    className="text-[10px] font-mono"
                                    style={{
                                      color:
                                        (v as number) > 0
                                          ? "#4ade80"
                                          : "#f87171",
                                    }}
                                  >
                                    {STAT_LABELS[s as ExplorerStat]}
                                    {(v as number) > 0 ? "+" : ""}
                                    {v as number}
                                  </span>
                                ))}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUnequipSlot(slot);
                                }}
                                className="w-5 h-5 rounded text-[10px] text-[var(--color-accent-tertiary)] hover:bg-[var(--color-accent-tertiary)]/10 flex items-center justify-center transition-colors"
                              >
                                x
                              </button>
                            </div>
                          )}
                        </div>
                      </button>

                      {/* Item picker dropdown */}
                      {isActive && (
                        <div
                          className="mt-1 rounded-lg border p-2 space-y-1 animate-fade-in"
                          style={{
                            borderColor: `${theme.primary}20`,
                            background: "var(--color-surface-hover)",
                          }}
                        >
                          {slotItems.map((si) => {
                            const isEquipped =
                              equipment[slot]?.id === si.id;
                            return (
                              <button
                                key={si.id}
                                onClick={() => handleEquipItem(si)}
                                disabled={isEquipped}
                                className="w-full text-left rounded-md px-3 py-2 transition-all duration-150 disabled:opacity-40"
                                style={{
                                  background: isEquipped
                                    ? `${theme.primary}15`
                                    : "transparent",
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-[var(--color-foreground)]">
                                      {si.name}
                                    </p>
                                    <p className="text-[10px] text-[var(--color-muted)]">
                                      {si.description}
                                    </p>
                                  </div>
                                  <div className="flex gap-1 flex-shrink-0 ml-2">
                                    {Object.entries(
                                      si.statModifiers,
                                    ).map(([s, v]) => (
                                      <span
                                        key={s}
                                        className="text-[10px] font-mono"
                                        style={{
                                          color:
                                            (v as number) > 0
                                              ? "#4ade80"
                                              : "#f87171",
                                        }}
                                      >
                                        {STAT_LABELS[s as ExplorerStat]}
                                        {(v as number) > 0 ? "+" : ""}
                                        {v as number}
                                      </span>
                                    ))}
                                    {Object.keys(si.statModifiers)
                                      .length === 0 && (
                                      <span className="text-[10px] text-[var(--color-muted)]">
                                        --
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Total weight */}
              <div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--color-muted)]">Total Weight</span>
                  <span className="font-mono" style={{ color: theme.primary }}>
                    {Object.values(equipment).reduce(
                      (sum, item) => sum + (item?.weight ?? 0),
                      0,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enter the Tower button */}
          <button
            onClick={handleEnterTower}
            disabled={remaining > 0 || saving}
            className="btn-stone w-full mt-4 py-3.5 text-base font-bold uppercase tracking-wider transition-all duration-300"
            style={{
              borderColor:
                remaining === 0 ? theme.primary : "var(--color-border)",
              background:
                remaining === 0
                  ? `linear-gradient(135deg, ${theme.gradientFrom}25, ${theme.gradientTo}25)`
                  : "var(--color-surface-hover)",
              boxShadow:
                remaining === 0
                  ? `0 0 24px ${theme.primary}20`
                  : "none",
            }}
          >
            {saving
              ? "Saving..."
              : remaining > 0
                ? `Allocate ${remaining} more point${remaining === 1 ? "" : "s"}`
                : "Enter the Tower"}
          </button>
          {remaining > 0 && (
            <p className="text-[10px] text-[var(--color-muted)] text-center mt-2 italic">
              All stat points must be allocated before entering
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PreparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-[var(--color-muted)] animate-pulse-slow">
            Preparing...
          </p>
        </div>
      }
    >
      <PrepareContent />
    </Suspense>
  );
}
