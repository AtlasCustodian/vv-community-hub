"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { GameSave, ExplorerStat } from "@/types/explorer";
import {
  EXPLORER_STATS,
  STAT_LABELS,
  ITEM_SLOTS,
  SLOT_LABELS,
} from "@/types/explorer";
import { computeEffectiveStats } from "@/lib/statBuilder";
import { loadFromLocal } from "@/lib/saveManager";
import { FACTION_THEMES } from "@/lib/factionThemes";

const STAT_COLORS: Record<ExplorerStat, string> = {
  dexterity: "#22d3ee",
  strength: "#ef4444",
  constitution: "#f59e0b",
  intelligence: "#a78bfa",
  wisdom: "#34d399",
  charisma: "#f472b6",
};

function TowerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saveId = searchParams.get("saveId");
  const [save, setSave] = useState<GameSave | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const local = loadFromLocal();
    if (local && (!saveId || local.id === saveId)) {
      setSave(local);
      setLoading(false);
      return;
    }
    if (saveId) {
      fetch(`/api/saves/${saveId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) setSave(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [saveId]);

  useEffect(() => {
    if (save) {
      document.documentElement.dataset.faction = save.champion.factionId;
    }
  }, [save]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--color-muted)] animate-pulse-slow">
          Descending into the Tower...
        </p>
      </div>
    );
  }

  if (!save) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[var(--color-muted)]">No save data found.</p>
        <button
          onClick={() => router.push("/")}
          className="btn-stone px-6 py-2"
        >
          Return to Champion Select
        </button>
      </div>
    );
  }

  const { champion } = save;
  const theme = FACTION_THEMES[champion.factionId];
  const effective = computeEffectiveStats(champion.baseStats, champion.equipment);
  const equippedItems = ITEM_SLOTS.filter(
    (slot) => champion.equipment[slot] !== null,
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${theme.primary}08 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Title */}
        <div className="text-center mb-10 animate-fade-in">
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, var(--color-accent-glow), var(--color-accent-primary), var(--color-accent-glow))`,
            }}
          >
            The Tower Awaits
          </h1>
          <p className="text-sm mt-2 text-[var(--color-muted)] animate-pulse-slow">
            A maze of tunnels and caves stretches out before you...
          </p>
        </div>

        {/* Champion summary card */}
        <div
          className="glass-card p-6 mb-6 animate-slide-up"
          style={{ borderColor: `${theme.primary}20` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: theme.primary }}
              >
                {champion.name}
              </h2>
              <p className="text-xs text-[var(--color-muted)]">
                {FACTION_THEMES[champion.factionId].name}
              </p>
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{
                background: `${theme.primary}15`,
                color: theme.primary,
              }}
            >
              {save.status}
            </div>
          </div>

          {/* Effective stats */}
          <div className="mb-4">
            <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-2">
              Effective Stats
            </p>
            <div className="grid grid-cols-3 gap-2">
              {EXPLORER_STATS.map((stat) => (
                <div
                  key={stat}
                  className="rounded-lg px-3 py-2 text-center"
                  style={{ background: `${STAT_COLORS[stat]}08` }}
                >
                  <div
                    className="text-[10px] uppercase tracking-wider mb-1"
                    style={{ color: STAT_COLORS[stat] }}
                  >
                    {STAT_LABELS[stat]}
                  </div>
                  <div
                    className="text-lg font-bold font-mono"
                    style={{ color: STAT_COLORS[stat] }}
                  >
                    {effective[stat]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment */}
          {equippedItems.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--color-muted)] mb-2">
                Equipment
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {equippedItems.map((slot) => {
                  const item = champion.equipment[slot]!;
                  return (
                    <div
                      key={slot}
                      className="rounded-md border px-2.5 py-1.5 text-xs"
                      style={{
                        borderColor: `${theme.primary}15`,
                        background: `${theme.primary}05`,
                      }}
                    >
                      <span className="text-[var(--color-muted)]">
                        {SLOT_LABELS[slot]}:
                      </span>{" "}
                      <span className="text-[var(--color-foreground)] font-medium">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Placeholder message */}
        <div className="text-center animate-fade-in">
          <div
            className="inline-block rounded-xl border px-8 py-6"
            style={{
              borderColor: `${theme.primary}15`,
              background: `${theme.primary}05`,
            }}
          >
            <p className="text-sm text-[var(--color-muted)] mb-3">
              The Tower exploration is being constructed...
            </p>
            <p className="text-xs text-[var(--color-muted)] italic">
              Your champion stands ready at the entrance, torch in hand.
            </p>
          </div>
        </div>

        {/* Back button */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/")}
            className="btn-stone px-6 py-2 text-sm"
          >
            Return to Champion Select
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TowerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-[var(--color-muted)] animate-pulse-slow">
            Descending...
          </p>
        </div>
      }
    >
      <TowerContent />
    </Suspense>
  );
}
