"use client";

import { useState, useMemo, useEffect } from "react";
import { Champion, FactionId } from "@/data/factionData";
import { useFaction } from "@/context/FactionContext";
import { useChampionAssignment } from "@/context/ChampionAssignmentContext";

type SortMode = "alphabetical" | "returnRate" | "stability";

const MAX_PER_SECTION = 5;

interface ChampionAssignmentModalProps {
  sectionId: string;
  sectionName: string;
  sectionColor: string;
  sectionIcon: string;
  onClose: () => void;
}

function ReturnRateBadge({ rate }: { rate: number }) {
  const isPositive = rate >= 0;
  const percent = (rate * 100).toFixed(1);
  const display = isPositive ? `+${percent}%` : `${percent}%`;
  return (
    <span
      className="inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
      style={{
        color: isPositive ? "#4ade80" : "#f87171",
        background: isPositive
          ? "rgba(74, 222, 128, 0.1)"
          : "rgba(248, 113, 113, 0.1)",
      }}
    >
      {display}
    </span>
  );
}

function StabilityBadge({ score }: { score: number }) {
  const isGreen = score >= 80;
  const color = isGreen ? "#4ade80" : "#facc15";
  const bg = isGreen
    ? "rgba(74, 222, 128, 0.1)"
    : "rgba(250, 204, 21, 0.1)";
  return (
    <span
      className="inline-block rounded-md px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
      style={{ color, background: bg }}
    >
      {score}
    </span>
  );
}

export default function ChampionAssignmentModal({
  sectionId,
  sectionName,
  sectionColor,
  sectionIcon,
  onClose,
}: ChampionAssignmentModalProps) {
  const { faction, factionId } = useFaction();
  const {
    getAssigned,
    assignChampion,
    unassignChampion,
    getChampionAssignment,
  } = useChampionAssignment();

  const [sortMode, setSortMode] = useState<SortMode>("alphabetical");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const champions = faction.champions;
  const assignedIds = getAssigned(factionId, sectionId);

  const sorted = useMemo(() => {
    const copy = [...champions];
    switch (sortMode) {
      case "alphabetical":
        copy.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "returnRate":
        copy.sort((a, b) => b.returnRate - a.returnRate);
        break;
      case "stability":
        copy.sort((a, b) => b.stabilityScore - a.stabilityScore);
        break;
    }
    return copy;
  }, [champions, sortMode]);

  const isFull = assignedIds.length >= MAX_PER_SECTION;

  const handleToggle = (champion: Champion) => {
    if (assignedIds.includes(champion.id)) {
      unassignChampion(factionId, sectionId, champion.id);
    } else {
      if (!isFull) {
        assignChampion(factionId, sectionId, champion.id);
      }
    }
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const sortLabels: Record<SortMode, string> = {
    alphabetical: "Alphabetical",
    returnRate: "Return Rate",
    stability: "Stability",
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg mx-4 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="glass-card rounded-2xl overflow-hidden"
          style={{
            borderColor: `color-mix(in srgb, ${sectionColor} 25%, transparent)`,
          }}
        >
          {/* Accent bar */}
          <div
            className="h-1 w-full"
            style={{
              background: `linear-gradient(to right, ${sectionColor}, ${sectionColor}80)`,
            }}
          />

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg text-lg"
                style={{ background: `${sectionColor}15` }}
              >
                {sectionIcon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Assign Champions
                </h3>
                <p className="text-[11px] text-muted">
                  {sectionName}{" "}
                  <span style={{ color: sectionColor }}>
                    ({assignedIds.length}/{MAX_PER_SECTION})
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M1 1l12 12M13 1L1 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Sort controls */}
          <div className="flex items-center justify-between px-5 pb-3 border-b border-border/50">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted">
              Active Champion Roster
            </span>
            <div className="relative">
              <button
                onClick={() => setSortMenuOpen(!sortMenuOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-1 text-[10px] font-medium text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
              >
                Sort by: {sortLabels[sortMode]}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  className={`transition-transform ${sortMenuOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M2 4l3 3 3-3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {sortMenuOpen && (
                <div className="absolute right-0 top-full z-20 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-surface shadow-xl">
                  {(
                    ["alphabetical", "returnRate", "stability"] as SortMode[]
                  ).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => {
                        setSortMode(mode);
                        setSortMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-[11px] transition-colors ${
                        sortMode === mode
                          ? "bg-surface-hover font-semibold text-foreground"
                          : "text-muted hover:bg-surface-hover/50 hover:text-foreground"
                      }`}
                    >
                      {sortLabels[mode]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Champion list */}
          <div className="max-h-[50vh] overflow-y-auto overscroll-contain">
            {sorted.map((champion) => {
              const isAssigned = assignedIds.includes(champion.id);
              const otherSection = getChampionAssignment(
                factionId,
                champion.id
              );
              const assignedElsewhere =
                otherSection !== null && otherSection !== sectionId;
              const isDisabled = !isAssigned && isFull;

              // Resolve section name for "assigned elsewhere" display
              const otherSectionName = assignedElsewhere
                ? faction.facilitySections.find((s) => s.id === otherSection)
                    ?.name ?? otherSection
                : null;

              return (
                <button
                  key={champion.id}
                  onClick={() => handleToggle(champion)}
                  disabled={isDisabled && !isAssigned}
                  className={`flex w-full items-center gap-3 px-5 py-2.5 text-left transition-colors border-b border-border/30 last:border-b-0 ${
                    isAssigned
                      ? "bg-surface-hover/60"
                      : isDisabled
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-surface-hover/40"
                  }`}
                >
                  {/* Checkbox */}
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all"
                    style={{
                      borderColor: isAssigned
                        ? sectionColor
                        : "rgb(var(--color-border))",
                      background: isAssigned ? `${sectionColor}20` : undefined,
                    }}
                  >
                    {isAssigned && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M2.5 6l2.5 2.5 4.5-5"
                          stroke={sectionColor}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Champion info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground truncate">
                        {champion.name}
                      </span>
                      {assignedElsewhere && (
                        <span className="shrink-0 rounded-md bg-background/60 px-1.5 py-0.5 text-[9px] font-medium text-muted">
                          @ {otherSectionName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-2 shrink-0">
                    <ReturnRateBadge rate={champion.returnRate} />
                    <StabilityBadge score={champion.stabilityScore} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border/50 px-5 py-3">
            <span className="text-[10px] text-muted">
              {assignedIds.length === 0
                ? "No champions assigned"
                : `${assignedIds.length} champion${assignedIds.length !== 1 ? "s" : ""} assigned`}
            </span>
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors"
              style={{
                background: `${sectionColor}20`,
                color: sectionColor,
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
