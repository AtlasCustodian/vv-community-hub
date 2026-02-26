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
} from "@/types/explorer/explorer";
import {
  EXPLORER_STATS,
  STAT_LABELS,
  STAT_DESCRIPTIONS,
  ITEM_SLOTS,
  SLOT_LABELS,
  emptyEquipment,
  emptyStats,
} from "@/types/explorer/explorer";
import {
  MAX_STAT_POINTS,
  MAX_PER_STAT,
  computeEffectiveStats,
  totalAllocated,
  computeMaxHP,
  computeArmorClass,
  computeInitiative,
  computeSpeed,
  computeSavingThrows,
  computeWeightLimit,
  computeCurrentWeight,
} from "@/lib/explorer/statBuilder";
import { getItemsForSlot } from "@/data/explorer/itemCatalog";
import { FACTION_THEMES } from "@/lib/explorer/factionThemes";
import { saveToLocal, saveToServer } from "@/lib/explorer/saveManager";
import EquipmentCard from "@/components/explorer/EquipmentCard";
import SlotIcon from "@/components/explorer/SlotIcon";

const STAT_COLORS: Record<ExplorerStat, string> = {
  body: "#ef4444",
  finesse: "#22d3ee",
  spirit: "#a78bfa",
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
  const explorerLevel = parseInt(searchParams.get("explorerLevel") ?? "1", 10);
  const persistentBonuses: StatBlock = {
    body: parseInt(searchParams.get("bonusBody") ?? "0", 10),
    finesse: parseInt(searchParams.get("bonusFinesse") ?? "0", 10),
    spirit: parseInt(searchParams.get("bonusSpirit") ?? "0", 10),
  };

  const theme = FACTION_THEMES[factionId];

  useEffect(() => {
    document.documentElement.dataset.faction = factionId;
  }, [factionId]);

  const [baseStats, setBaseStats] = useState<StatBlock>(emptyStats());
  const [equipment, setEquipment] = useState<Equipment>(emptyEquipment());
  const [activeSlot, setActiveSlot] = useState<ItemSlot | null>(null);
  const [saving, setSaving] = useState(false);
  const [overweightMessage, setOverweightMessage] = useState<string | null>(null);

  const allocated = totalAllocated(baseStats);
  const remaining = Math.max(0, maxPoints - allocated);
  const effectiveStats = useMemo(
    () => computeEffectiveStats(baseStats, equipment, persistentBonuses),
    [baseStats, equipment, persistentBonuses],
  );

  const currentWeight = useMemo(() => computeCurrentWeight(equipment), [equipment]);
  const weightLimit = useMemo(() => computeWeightLimit(effectiveStats), [effectiveStats]);
  const maxHP = useMemo(() => computeMaxHP(effectiveStats), [effectiveStats]);
  const armorClass = useMemo(() => computeArmorClass(effectiveStats, equipment), [effectiveStats, equipment]);
  const initiative = useMemo(() => computeInitiative(effectiveStats), [effectiveStats]);
  const speed = useMemo(() => computeSpeed(effectiveStats, equipment), [effectiveStats, equipment]);
  const savingThrows = useMemo(() => computeSavingThrows(effectiveStats), [effectiveStats]);

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
      level: explorerLevel,
      baseStats,
      persistentBonuses,
      equipment,
      inventory: [],
      salvageComponents: 0,
      gold: 0,
      keys: 0,
      returnRate,
      stabilityScore,
    };
    return {
      id: saveId,
      champion,
      vantheon: null,
      status: "preparing",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [saveId, championId, championName, factionId, explorerLevel, baseStats, persistentBonuses, equipment, returnRate, stabilityScore]);

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
    const currentSlotWeight = equipment[item.slot]?.weight ?? 0;
    const newWeight = currentWeight - currentSlotWeight + item.weight;
    if (newWeight > weightLimit) {
      setOverweightMessage(`Cannot equip ${item.name} — exceeds weight limit (${newWeight}w / ${weightLimit}w)`);
      return;
    }
    setOverweightMessage(null);
    setEquipment((prev) => ({ ...prev, [item.slot]: item }));
    setActiveSlot(null);
  }

  function handleUnequipSlot(slot: ItemSlot) {
    setEquipment((prev) => ({ ...prev, [slot]: null }));
  }

  async function handleEnterVantheon() {
    setSaving(true);
    const save = buildGameSave();
    save.status = "exploring";
    save.updatedAt = new Date().toISOString();
    saveToLocal(save);
    await saveToServer(save);
    router.push(`/vantheon-explorer/vantheon?saveId=${save.id}`);
  }

  const slotItems = activeSlot ? getItemsForSlot(activeSlot) : [];

  return (
    <div className="rogue-explorer min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3 animate-fade-in">
        <button
          onClick={() => router.push("/vantheon-explorer")}
          className="text-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors text-sm mr-1"
        >
          &larr;
        </button>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
          style={{ background: `${theme.primary}15` }}
        >
          ⚔️
        </div>
        <div>
          <h1
            className="text-2xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`,
            }}
          >
            {championName}
          </h1>
          <p className="text-xs text-muted">
            {FACTION_THEMES[factionId].name} &middot; Lv.{explorerLevel} &middot; Preparing for the Vantheon
          </p>
        </div>
      </div>

      {/* Level bonuses banner */}
      {(persistentBonuses.body > 0 || persistentBonuses.finesse > 0 || persistentBonuses.spirit > 0) && (
        <div
          className="mb-6 rounded-lg p-3 flex items-center gap-4"
          style={{
            background: `${theme.primary}08`,
            border: `1px solid ${theme.primary}15`,
          }}
        >
          <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--color-muted)" }}>
            Level Bonuses
          </span>
          <div className="flex gap-3 text-xs font-mono">
            {persistentBonuses.body > 0 && <span style={{ color: "#ef4444" }}>Body +{persistentBonuses.body}</span>}
            {persistentBonuses.finesse > 0 && <span style={{ color: "#22d3ee" }}>Finesse +{persistentBonuses.finesse}</span>}
            {persistentBonuses.spirit > 0 && <span style={{ color: "#a78bfa" }}>Spirit +{persistentBonuses.spirit}</span>}
          </div>
          <span className="text-[10px] ml-auto" style={{ color: "var(--color-muted)" }}>
            Applied automatically
          </span>
        </div>
      )}

      {/* ── Stat Allocation (full width) ── */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h2 className="stat-label" style={{ color: "var(--color-muted)" }}>
            Allocate Stats
          </h2>
          <span
            style={{
              fontSize: 12,
              fontFamily: "var(--font-mono), monospace",
              padding: "4px 10px",
              borderRadius: 6,
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
          }}
        >
          {EXPLORER_STATS.map((stat) => {
            const color = STAT_COLORS[stat];
            const val = baseStats[stat];
            const eff = effectiveStats[stat];
            const bonus = eff - val;

            return (
              <div
                key={stat}
                className="card-container"
                style={{
                  borderColor: `${color}30`,
                  ["--glow-color" as string]: `${color}40`,
                  ["--accent-color" as string]: color,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  minHeight: 200,
                }}
              >
                {/* Layered background */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 12,
                    pointerEvents: "none",
                    background: `
                      linear-gradient(160deg, ${color}18 0%, transparent 40%, ${color}12 100%),
                      radial-gradient(ellipse at 30% 20%, ${color}08 0%, transparent 60%)
                    `,
                  }}
                />

                {/* Top accent stripe */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 12,
                    right: 12,
                    height: 2,
                    borderRadius: "0 0 2px 2px",
                    pointerEvents: "none",
                    background: `linear-gradient(90deg, transparent, ${color}50, ${color}40, ${color}50, transparent)`,
                  }}
                />

                {/* Corner ornaments */}
                <div className="card-corner card-corner-tl" style={{ borderColor: `${color}30` }} />
                <div className="card-corner card-corner-tr" style={{ borderColor: `${color}30` }} />
                <div className="card-corner card-corner-bl" style={{ borderColor: `${color}30` }} />
                <div className="card-corner card-corner-br" style={{ borderColor: `${color}30` }} />

                {/* Inner frame */}
                <div
                  style={{
                    position: "absolute",
                    inset: 3,
                    border: `1px solid ${color}12`,
                    borderRadius: 10,
                    pointerEvents: "none",
                  }}
                />

                {/* Card content */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 10,
                    padding: 12,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  {/* Stat label */}
                  <div>
                    <p
                      className="stat-label"
                      style={{ color, textAlign: "center" }}
                    >
                      {STAT_LABELS[stat]}
                    </p>
                    <p
                      style={{
                        fontSize: 9,
                        color: "var(--color-muted)",
                        lineHeight: 1.3,
                        marginTop: 2,
                        textAlign: "center",
                      }}
                    >
                      {STAT_DESCRIPTIONS[stat]}
                    </p>
                  </div>

                  {/* Large value display */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 28,
                        fontWeight: 700,
                        color,
                        lineHeight: 1,
                      }}
                    >
                      {val}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--color-muted)",
                        fontFamily: "var(--font-mono), monospace",
                      }}
                    >
                      / {MAX_PER_STAT}
                    </span>
                    {bonus !== 0 && (
                      <span
                        style={{
                          fontSize: 10,
                          fontFamily: "var(--font-mono), monospace",
                          fontWeight: 700,
                          color: bonus > 0 ? "#4ade80" : "#f87171",
                        }}
                      >
                        {bonus > 0 ? "+" : ""}{bonus}
                      </span>
                    )}
                  </div>

                  {/* Progress bar + buttons */}
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        position: "relative",
                        height: 4,
                        borderRadius: 9999,
                        overflow: "hidden",
                        background: "rgba(0,0,0,0.3)",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: "0 auto 0 0",
                          borderRadius: 9999,
                          transition: "all 0.2s",
                          width: `${(val / MAX_PER_STAT) * 100}%`,
                          background: color,
                          opacity: 0.8,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      <button
                        onClick={() => handleStatChange(stat, -1)}
                        disabled={val <= 0}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: `1px solid ${color}40`,
                          background: "transparent",
                          color: "var(--color-foreground)",
                          fontSize: 14,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: val <= 0 ? "not-allowed" : "pointer",
                          opacity: val <= 0 ? 0.2 : 1,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => { if (val > 0) e.currentTarget.style.background = "var(--color-surface-hover)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleStatChange(stat, 1)}
                        disabled={val >= MAX_PER_STAT || remaining <= 0}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 6,
                          border: `1px solid ${color}40`,
                          background: "transparent",
                          color: "var(--color-foreground)",
                          fontSize: 14,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: (val >= MAX_PER_STAT || remaining <= 0) ? "not-allowed" : "pointer",
                          opacity: (val >= MAX_PER_STAT || remaining <= 0) ? 0.2 : 1,
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => { if (val < MAX_PER_STAT && remaining > 0) e.currentTarget.style.background = "var(--color-surface-hover)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Effective stats summary */}
        <div
          style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-muted)",
              width: "100%",
              marginBottom: 2,
            }}
          >
            Effective Stats (base + equipment)
          </span>
          {EXPLORER_STATS.map((stat) => (
            <div
              key={stat}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontFamily: "var(--font-mono), monospace",
                background: `${STAT_COLORS[stat]}10`,
                color: STAT_COLORS[stat],
              }}
            >
              {STAT_LABELS[stat]} {effectiveStats[stat]}
            </div>
          ))}
        </div>
      </div>

      {/* ── Equipment + Character Sheet (two-column) ── */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        {/* Left column: Equipment Selection */}
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <div
            className="glass-card"
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
            <div style={{ padding: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <h2
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--color-muted)",
                  }}
                >
                  Equipment
                </h2>
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: "var(--font-mono), monospace",
                    padding: "2px 8px",
                    borderRadius: 6,
                    color: currentWeight > weightLimit ? "#f87171" : theme.primary,
                    background: currentWeight > weightLimit ? "rgba(248, 113, 113, 0.1)" : `${theme.primary}10`,
                  }}
                >
                  {currentWeight}w / {weightLimit}w
                </span>
              </div>

              {/* Weight bar */}
              <div
                style={{
                  position: "relative",
                  height: 4,
                  borderRadius: 9999,
                  overflow: "hidden",
                  background: "rgba(0,0,0,0.3)",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: "0 auto 0 0",
                    borderRadius: 9999,
                    transition: "all 0.3s",
                    width: `${Math.min((currentWeight / weightLimit) * 100, 100)}%`,
                    background: currentWeight > weightLimit ? "#f87171" : theme.primary,
                    opacity: 0.8,
                  }}
                />
              </div>

              {/* Overweight warning */}
              {overweightMessage && (
                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    marginBottom: 12,
                    fontSize: 11,
                    fontWeight: 500,
                    color: "#f87171",
                    background: "rgba(248, 113, 113, 0.08)",
                    border: "1px solid rgba(248, 113, 113, 0.2)",
                  }}
                >
                  {overweightMessage}
                </div>
              )}

              {/* Equipment card grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                {ITEM_SLOTS.map((slot) => (
                  <EquipmentCard
                    key={slot}
                    slot={slot}
                    item={equipment[slot]}
                    theme={theme}
                    selected={activeSlot === slot}
                    onClick={() =>
                      setActiveSlot(activeSlot === slot ? null : slot)
                    }
                  />
                ))}
              </div>

              {/* Item picker */}
              {activeSlot && (
                <div className="dropdown-enter">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--color-muted)",
                      }}
                    >
                      {SLOT_LABELS[activeSlot]} — Choose Item
                    </span>
                    {equipment[activeSlot] && (
                      <button
                        onClick={() => handleUnequipSlot(activeSlot)}
                        style={{
                          fontSize: 10,
                          padding: "2px 8px",
                          borderRadius: 6,
                          color: "#f87171",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(248, 113, 113, 0.1)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                      >
                        Unequip
                      </button>
                    )}
                  </div>
                  <div
                    style={{
                      borderRadius: 12,
                      border: `1px solid ${theme.primary}20`,
                      padding: 8,
                      background: `${theme.primary}05`,
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 8,
                    }}
                  >
                    {slotItems.map((si) => {
                      const isEquipped = equipment[activeSlot]?.id === si.id;
                      const slotWeight = equipment[activeSlot]?.weight ?? 0;
                      const wouldExceed = !isEquipped && (currentWeight - slotWeight + si.weight) > weightLimit;
                      const isDisabled = isEquipped || wouldExceed;
                      return (
                        <button
                          key={si.id}
                          onClick={() => handleEquipItem(si)}
                          disabled={isDisabled}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 6,
                            borderRadius: 12,
                            border: `1px solid ${isEquipped ? `${theme.primary}40` : wouldExceed ? "rgba(248, 113, 113, 0.25)" : `${theme.primary}15`}`,
                            padding: "12px",
                            background: isEquipped ? `${theme.primary}10` : "transparent",
                            cursor: isDisabled ? "not-allowed" : "pointer",
                            opacity: isDisabled ? 0.4 : 1,
                            textAlign: "center",
                            transition: "background 0.15s",
                            color: "inherit",
                            position: "relative",
                          }}
                          onMouseEnter={(e) => { if (!isDisabled) e.currentTarget.style.background = "var(--color-surface-hover)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = isEquipped ? `${theme.primary}10` : "transparent"; }}
                        >
                          {wouldExceed && (
                            <span
                              style={{
                                position: "absolute",
                                top: 4,
                                right: 6,
                                fontSize: 8,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: "#f87171",
                                background: "rgba(248, 113, 113, 0.1)",
                                padding: "1px 5px",
                                borderRadius: 4,
                              }}
                            >
                              Too heavy
                            </span>
                          )}
                          <SlotIcon
                            slot={activeSlot}
                            color={isEquipped ? theme.primary : `${theme.primary}60`}
                            size={20}
                          />
                          <p
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: "var(--color-foreground)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              width: "100%",
                            }}
                          >
                            {si.name}
                          </p>
                          <p
                            style={{
                              fontSize: 10,
                              color: "var(--color-muted)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              width: "100%",
                            }}
                          >
                            {si.description}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 4,
                              justifyContent: "center",
                            }}
                          >
                            {Object.entries(si.statModifiers).map(
                              ([s, v]) => (
                                <span
                                  key={s}
                                  style={{
                                    fontSize: 10,
                                    fontFamily: "var(--font-mono), monospace",
                                    fontWeight: 700,
                                    padding: "2px 4px",
                                    borderRadius: 4,
                                    color:
                                      (v as number) > 0
                                        ? "#4ade80"
                                        : "#f87171",
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
                              ),
                            )}
                            {Object.keys(si.statModifiers).length === 0 && (
                              <span style={{ fontSize: 10, color: "var(--color-muted)" }}>
                                --
                              </span>
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: 9,
                              fontFamily: "var(--font-mono), monospace",
                              opacity: 0.5,
                              color: wouldExceed ? "#f87171" : theme.primary,
                            }}
                          >
                            {si.weight}w
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enter the Vantheon button */}
          <button
            onClick={handleEnterVantheon}
            disabled={remaining > 0 || saving}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "14px 0",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              border: "none",
              cursor: (remaining > 0 || saving) ? "not-allowed" : "pointer",
              opacity: (remaining > 0 || saving) ? 0.3 : 1,
              transition: "all 0.3s",
              background:
                remaining === 0
                  ? `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`
                  : `${theme.primary}15`,
              color: remaining === 0 ? "#fff" : `${theme.primary}50`,
              boxShadow:
                remaining === 0
                  ? `0 4px 16px ${theme.primary}30`
                  : "none",
            }}
          >
            {saving
              ? "Saving..."
              : remaining > 0
                ? `Allocate ${remaining} more point${remaining === 1 ? "" : "s"}`
                : "Enter the Vantheon"}
          </button>
          {remaining > 0 && (
            <p
              style={{
                fontSize: 10,
                color: "var(--color-muted)",
                textAlign: "center",
                marginTop: 8,
                fontStyle: "italic",
              }}
            >
              All stat points must be allocated before entering
            </p>
          )}
        </div>

        {/* Right column: Character Sheet */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <div
            className="glass-card"
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
                  {/* Max HP */}
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
                  {/* Current HP */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "12px 8px",
                      borderRadius: 12,
                      border: `1px solid ${theme.primary}15`,
                      background: "transparent",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#4ade80",
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
                      Current HP
                    </span>
                  </div>
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
