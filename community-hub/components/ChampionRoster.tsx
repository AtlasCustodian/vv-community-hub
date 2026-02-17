"use client";

import { useFaction } from "@/context/FactionContext";
import { useChampionAssignment } from "@/context/ChampionAssignmentContext";
import { Champion } from "@/data/factionData";

function ReturnRateBadge({ rate }: { rate: number }) {
  const isPositive = rate >= 0;
  const percent = (rate * 100).toFixed(1);
  const display = isPositive ? `+${percent}%` : `${percent}%`;

  return (
    <span
      className="inline-block rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums"
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
      className="inline-block rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums"
      style={{ color, background: bg }}
    >
      {score}
    </span>
  );
}

function ChampionRow({
  champion,
  index,
  assignmentLabel,
  assignmentColor,
}: {
  champion: Champion;
  index: number;
  assignmentLabel: string;
  assignmentColor: string | null;
}) {
  const isAssigned = assignmentLabel !== "Not Assigned";
  return (
    <tr
      className="border-b border-border/50 transition-colors duration-150 hover:bg-surface-hover/50"
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <td className="py-3 pl-4 pr-2">
        <span className="text-xs text-muted tabular-nums">{index + 1}</span>
      </td>
      <td className="py-3 px-3">
        <span className="text-sm font-medium text-foreground">
          {champion.name}
        </span>
      </td>
      <td className="py-3 px-3 text-center">
        <ReturnRateBadge rate={champion.returnRate} />
      </td>
      <td className="py-3 px-3 text-center">
        <StabilityBadge score={champion.stabilityScore} />
      </td>
      <td className="py-3 px-3 pr-4 text-right">
        {isAssigned ? (
          <span
            className="inline-block rounded-md px-2 py-0.5 text-xs font-medium"
            style={{
              color: assignmentColor ?? undefined,
              background: assignmentColor
                ? `${assignmentColor}15`
                : undefined,
            }}
          >
            {assignmentLabel}
          </span>
        ) : (
          <span className="text-xs text-muted italic">Not Assigned</span>
        )}
      </td>
    </tr>
  );
}

export default function ChampionRoster() {
  const { faction, factionId } = useFaction();
  const { getChampionAssignment } = useChampionAssignment();
  const champions = [...faction.champions].sort((a, b) => {
    const rateDiff = b.returnRate - a.returnRate;
    if (rateDiff !== 0) return rateDiff;
    return b.stabilityScore - a.stabilityScore;
  });

  const getAssignmentInfo = (
    championId: string
  ): { label: string; color: string | null } => {
    const sectionId = getChampionAssignment(factionId, championId);
    if (!sectionId) return { label: "Not Assigned", color: null };
    const section = faction.facilitySections.find((s) => s.id === sectionId);
    return {
      label: section?.name ?? sectionId,
      color: section?.color ?? null,
    };
  };

  const assignedCount = champions.filter(
    (c) => getChampionAssignment(factionId, c.id) !== null
  ).length;

  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
            style={{ background: `${faction.theme.primary}15` }}
          >
            ⚔️
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Active Champion Roster
            </h2>
            <p className="text-xs text-muted">
              {champions.length} champions under your command
            </p>
          </div>
        </div>

        {/* Table Container */}
        <div
          className="glass-card overflow-hidden rounded-2xl"
          style={{
            borderColor: `color-mix(in srgb, ${faction.theme.primary} 15%, transparent)`,
          }}
        >
          {/* Accent bar */}
          <div
            className="h-0.5 w-full"
            style={{
              background: `linear-gradient(to right, ${faction.theme.gradientFrom}, ${faction.theme.gradientTo})`,
            }}
          />

          <div className="overflow-x-auto">
            {/* Fixed header */}
            <table className="w-full min-w-[600px]">
              <colgroup>
                <col className="w-[48px]" />
                <col />
                <col className="w-[120px]" />
                <col className="w-[100px]" />
                <col className="w-[160px]" />
              </colgroup>
              <thead>
                <tr
                  className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  <th className="py-3 pl-4 pr-2 text-left">#</th>
                  <th className="py-3 px-3 text-left">Champion</th>
                  <th className="py-3 px-3 text-center">Return Rate</th>
                  <th className="py-3 px-3 text-center">Stability</th>
                  <th className="py-3 px-3 pr-4 text-right">
                    Current Assignment
                  </th>
                </tr>
              </thead>
            </table>

            {/* Scrollable body — sized to show 10 rows (10 × 44px) */}
            <div className="overflow-y-auto" style={{ maxHeight: "440px" }}>
              <table className="w-full min-w-[600px]">
                <colgroup>
                  <col className="w-[48px]" />
                  <col />
                  <col className="w-[120px]" />
                  <col className="w-[100px]" />
                  <col className="w-[160px]" />
                </colgroup>
                <tbody>
                  {champions.map((champion, index) => {
                    const info = getAssignmentInfo(champion.id);
                    return (
                      <ChampionRow
                        key={champion.id}
                        champion={champion}
                        index={index}
                        assignmentLabel={info.label}
                        assignmentColor={info.color}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary footer */}
          <div className="flex items-center justify-between border-t border-border/50 px-4 py-3">
            <span className="text-xs text-muted">
              Avg Return:{" "}
              <span
                style={{
                  color:
                    champions.reduce((s, c) => s + c.returnRate, 0) /
                      champions.length >=
                    0
                      ? "#4ade80"
                      : "#f87171",
                }}
                className="font-semibold"
              >
                {(
                  (champions.reduce((s, c) => s + c.returnRate, 0) /
                    champions.length) *
                  100
                ).toFixed(1)}
                %
              </span>
            </span>
            <span className="text-xs text-muted">
              Avg Stability:{" "}
              <span
                style={{
                  color:
                    champions.reduce((s, c) => s + c.stabilityScore, 0) /
                      champions.length >=
                    80
                      ? "#4ade80"
                      : "#facc15",
                }}
                className="font-semibold"
              >
                {(
                  champions.reduce((s, c) => s + c.stabilityScore, 0) /
                  champions.length
                ).toFixed(0)}
              </span>
            </span>
            <span className="text-xs text-muted italic">
              {assignedCount}/{champions.length} assigned
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
