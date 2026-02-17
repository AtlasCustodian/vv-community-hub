"use client";

import { useState } from "react";
import { FacilitySection } from "@/data/factionData";
import { useFaction } from "@/context/FactionContext";
import { useChampionAssignment } from "@/context/ChampionAssignmentContext";
import ChampionAssignmentModal from "@/components/ChampionAssignmentModal";

function getHealthColor(health: number): string {
  if (health >= 80) return "#10b981";
  if (health >= 60) return "#fbbf24";
  if (health >= 40) return "#f97316";
  return "#dc2626";
}

function getHealthLabel(health: number): string {
  if (health >= 90) return "Excellent";
  if (health >= 75) return "Good";
  if (health >= 60) return "Fair";
  if (health >= 40) return "Warning";
  return "Critical";
}

function Tooltip({ text }: { text: string }) {
  return (
    <span className="tooltip-text pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-56 -translate-x-1/2 rounded-lg border border-border bg-surface px-3 py-2 text-xs leading-relaxed text-foreground opacity-0 shadow-xl transition-opacity duration-200">
      {text}
      <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-surface" />
    </span>
  );
}

function HealthBar({
  health,
  description,
  label,
}: {
  health: number;
  description: string;
  label: string;
}) {
  const color = getHealthColor(health);
  return (
    <div className="tooltip-trigger group/tip relative">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>
          {health}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border/50">
        <div
          className="health-bar-fill h-full rounded-full transition-all duration-700"
          style={{ width: `${health}%`, background: color }}
        />
      </div>
      <Tooltip text={description} />
    </div>
  );
}

function StatItem({
  label,
  value,
  description,
  color,
}: {
  label: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <div className="tooltip-trigger group/tip relative flex items-center justify-between rounded-lg bg-background/40 px-3 py-2">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-xs font-bold" style={{ color }}>
        {value}
      </span>
      <Tooltip text={description} />
    </div>
  );
}

function SectionCard({
  section,
  isActive,
  onHover,
  onLeave,
  onClick,
  assignedNames,
}: {
  section: FacilitySection;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  assignedNames: string[];
}) {
  return (
    <div
      className={`glass-card rounded-2xl p-5 transition-all duration-300 cursor-pointer ${
        isActive ? "scale-[1.02] ring-1" : "opacity-80 hover:opacity-100"
      }`}
      style={{
        borderColor: isActive ? `${section.color}60` : undefined,
        boxShadow: isActive
          ? `0 0 24px ${section.color}20, 0 4px 12px rgba(0,0,0,0.3), inset 0 0 0 1px ${section.color}40`
          : undefined,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
          style={{ background: `${section.color}15` }}
        >
          {section.icon}
        </div>
        <div>
          <h3 className="text-sm font-bold">{section.name}</h3>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: getHealthColor(section.health) }}
          >
            {getHealthLabel(section.health)}
          </span>
        </div>
      </div>

      {/* Health Bar */}
      <HealthBar
        health={section.health}
        description={section.description}
        label="System Health"
      />

      {/* Stats */}
      <div className="mt-3 flex flex-col gap-1.5">
        {section.stats.map((stat) => (
          <StatItem
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            color={section.color}
          />
        ))}
      </div>

      {/* Assigned Champions */}
      {assignedNames.length > 0 && (
        <div className="mt-3 border-t border-border/30 pt-2.5">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-muted">
            Assigned ({assignedNames.length}/5)
          </span>
          <div className="mt-1 flex flex-wrap gap-1">
            {assignedNames.map((name) => (
              <span
                key={name}
                className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                style={{
                  background: `${section.color}15`,
                  color: section.color,
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FacilityView() {
  const { faction, factionId } = useFaction();
  const { getAssigned } = useChampionAssignment();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [modalSection, setModalSection] = useState<string | null>(null);
  const sections = faction.facilitySections;

  const leftSections = sections.slice(0, Math.ceil(sections.length / 2));
  const rightSections = sections.slice(Math.ceil(sections.length / 2));

  const activeData = sections.find((s) => s.id === activeSection);

  const getAssignedNames = (sectionId: string): string[] => {
    const ids = getAssigned(factionId, sectionId);
    return ids.map((id) => faction.champions.find((c) => c.id === id)?.name).filter(Boolean) as string[];
  };

  const modalData = modalSection ? sections.find((s) => s.id === modalSection) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Overview Schematic */}
      <div className="mb-8 glass-card rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {sections.map((section) => {
            const healthColor = getHealthColor(section.health);
            const isActive = activeSection === section.id;
            return (
              <div
                key={section.id}
                className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-all duration-300 cursor-pointer ${
                  isActive ? "bg-surface-hover scale-105" : "hover:bg-surface-hover/50"
                }`}
                onMouseEnter={() => setActiveSection(section.id)}
                onMouseLeave={() => setActiveSection(null)}
                onClick={() => setModalSection(section.id)}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform duration-300"
                  style={{
                    background: `${section.color}15`,
                    transform: isActive ? "scale(1.15)" : undefined,
                  }}
                >
                  {section.icon}
                </div>
                <span className="text-xs font-semibold text-center leading-tight">
                  {section.name}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-12 overflow-hidden rounded-full bg-border/50">
                    <div
                      className="health-bar-fill h-full rounded-full"
                      style={{ width: `${section.health}%`, background: healthColor }}
                    />
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: healthColor }}>
                    {section.health}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active section description */}
        {activeData && (
          <div className="mt-4 rounded-xl border border-border bg-background/40 p-4 text-center animate-fade-in-up">
            <p className="text-sm text-muted">{activeData.description}</p>
          </div>
        )}
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leftSections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            isActive={activeSection === section.id}
            onHover={() => setActiveSection(section.id)}
            onLeave={() => setActiveSection(null)}
            onClick={() => setModalSection(section.id)}
            assignedNames={getAssignedNames(section.id)}
          />
        ))}
        {rightSections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            isActive={activeSection === section.id}
            onHover={() => setActiveSection(section.id)}
            onLeave={() => setActiveSection(null)}
            onClick={() => setModalSection(section.id)}
            assignedNames={getAssignedNames(section.id)}
          />
        ))}
      </div>

      {/* Champion Assignment Modal */}
      {modalData && (
        <ChampionAssignmentModal
          sectionId={modalData.id}
          sectionName={modalData.name}
          sectionColor={modalData.color}
          sectionIcon={modalData.icon}
          onClose={() => setModalSection(null)}
        />
      )}
    </div>
  );
}
