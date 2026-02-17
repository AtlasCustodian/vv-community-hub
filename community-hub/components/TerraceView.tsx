"use client";

import { useState } from "react";
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

function HealthBar({ health, description, label }: { health: number; description: string; label: string }) {
  const color = getHealthColor(health);
  return (
    <div className="tooltip-trigger group/tip relative">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-medium text-muted">{label}</span>
        <span className="text-xs font-bold" style={{ color }}>{health}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-border/50">
        <div className="health-bar-fill h-full rounded-full transition-all duration-700" style={{ width: `${health}%`, background: color }} />
      </div>
      <Tooltip text={description} />
    </div>
  );
}

function StatItem({ label, value, description, color }: { label: string; value: string; description: string; color: string }) {
  return (
    <div className="tooltip-trigger group/tip relative flex items-center justify-between rounded-lg bg-background/40 px-3 py-2">
      <span className="text-xs text-muted">{label}</span>
      <span className="text-xs font-bold" style={{ color }}>{value}</span>
      <Tooltip text={description} />
    </div>
  );
}

function SectionPanel({ section, isActive, onHover, onLeave, onClick, assignedNames }: {
  section: { id: string; name: string; description: string; health: number; icon: string; color: string; stats: { label: string; value: string; description: string }[] };
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  assignedNames: string[];
}) {
  return (
    <div
      className={`glass-card rounded-2xl p-5 transition-all duration-300 cursor-pointer ${isActive ? "scale-[1.02] ring-1" : "opacity-80 hover:opacity-100"}`}
      style={{
        borderColor: isActive ? `${section.color}60` : undefined,
        boxShadow: isActive ? `0 0 24px ${section.color}20, 0 4px 12px rgba(0,0,0,0.3), inset 0 0 0 1px ${section.color}40` : undefined,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl text-xl" style={{ background: `${section.color}15` }}>{section.icon}</div>
        <div>
          <h3 className="text-sm font-bold">{section.name}</h3>
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: getHealthColor(section.health) }}>{getHealthLabel(section.health)}</span>
        </div>
      </div>
      <HealthBar health={section.health} description={section.description} label="System Health" />
      <div className="mt-3 flex flex-col gap-1.5">
        {section.stats.map((stat) => (
          <StatItem key={stat.label} label={stat.label} value={stat.value} description={stat.description} color={section.color} />
        ))}
      </div>
      {assignedNames.length > 0 && (
        <div className="mt-3 border-t border-border/30 pt-2.5">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-muted">Assigned ({assignedNames.length}/5)</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {assignedNames.map((name) => (
              <span key={name} className="rounded-md px-1.5 py-0.5 text-[10px] font-medium" style={{ background: `${section.color}15`, color: section.color }}>{name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TerraceSVG({ activeSection, onHover, onLeave }: { activeSection: string | null; onHover: (id: string) => void; onLeave: () => void }) {
  const isActive = (id: string) => activeSection === id;
  const sectionOpacity = (id: string) => activeSection === null ? 0.85 : isActive(id) ? 1 : 0.4;

  const terraces = [
    { id: "terrace-canopy", y: 80, height: 120, label: "CANOPY TERRACE", color: "#15803d", lightColor: "#22c55e" },
    { id: "terrace-midgrove", y: 230, height: 120, label: "MIDGROVE TERRACE", color: "#16a34a", lightColor: "#4ade80" },
    { id: "terrace-rootbed", y: 380, height: 120, label: "ROOTBED TERRACE", color: "#166534", lightColor: "#86efac" },
    { id: "terrace-deepsoil", y: 530, height: 110, label: "DEEPSOIL TERRACE", color: "#14532d", lightColor: "#bbf7d0" },
  ];

  return (
    <svg viewBox="0 0 800 720" className="w-full max-w-2xl mx-auto drop-shadow-2xl" style={{ filter: "drop-shadow(0 0 40px rgba(34, 197, 94, 0.08))" }}>
      <defs>
        <filter id="glow-terrace" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-terrace-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="soilBase" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a2e1a" />
          <stop offset="100%" stopColor="#0f1a0f" />
        </linearGradient>
        <linearGradient id="waterChannel" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="canopySurface" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="50%" stopColor="#14532d" />
          <stop offset="100%" stopColor="#0f3d1f" />
        </linearGradient>
      </defs>

      {/* Background grid */}
      <pattern id="gridTerrace" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a2e1a" strokeWidth="0.3" opacity="0.3" />
      </pattern>
      <rect width="800" height="720" fill="url(#gridTerrace)" opacity="0.5" />

      {/* Sunlight filter from above */}
      <rect x="0" y="0" width="800" height="120" fill="url(#canopySurface)" opacity="0.15" />

      {/* FLOOD CHANNELS between terraces */}
      {[{ y: 200, id: "channel-upper" }, { y: 350, id: "channel-middle" }, { y: 500, id: "channel-lower" }].map((ch) => (
        <g key={ch.id}
          className="cursor-pointer transition-all duration-300"
          opacity={sectionOpacity(ch.id)}
          filter={isActive(ch.id) ? "url(#glow-terrace-strong)" : undefined}
          onMouseEnter={() => onHover(ch.id)}
          onMouseLeave={onLeave}
        >
          {/* Channel bed */}
          <rect x="80" y={ch.y} width="640" height="30" rx="6" fill="url(#waterChannel)" stroke="#1d4ed8" strokeWidth="1" strokeOpacity="0.3" />

          {/* Water flow particles */}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cy={ch.y + 15} r="2.5" fill="#3b82f6" opacity="0.4">
              <animate attributeName="cx" from={80 + i * 30} to={720} dur={`${4 + i * 0.5}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.5;0" dur={`${4 + i * 0.5}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* Sluice gates */}
          <rect x="240" y={ch.y - 4} width="8" height="38" rx="2" fill="#2a3d2a" stroke="#22c55e" strokeWidth="1" opacity="0.6" />
          <rect x="552" y={ch.y - 4} width="8" height="38" rx="2" fill="#2a3d2a" stroke="#22c55e" strokeWidth="1" opacity="0.6" />

          {/* Label */}
          <text x="400" y={ch.y + 19} textAnchor="middle" fill={isActive(ch.id) ? "#22c55e" : "#3a553a"} fontSize="8" fontWeight="600" letterSpacing="0.05em">
            FLOOD CHANNEL
          </text>
        </g>
      ))}

      {/* TERRACES */}
      {terraces.map((terrace, idx) => {
        const inset = idx * 20;
        const terraceWidth = 640 - inset * 2;
        const x = 80 + inset;

        return (
          <g
            key={terrace.id}
            className="cursor-pointer transition-all duration-300"
            opacity={sectionOpacity(terrace.id)}
            filter={isActive(terrace.id) ? "url(#glow-terrace-strong)" : undefined}
            onMouseEnter={() => onHover(terrace.id)}
            onMouseLeave={onLeave}
          >
            {/* Terrace platform */}
            <rect x={x} y={terrace.y} width={terraceWidth} height={terrace.height} rx="8" fill="url(#soilBase)" stroke={terrace.color} strokeWidth="2" />

            {/* Soil layers */}
            <rect x={x + 4} y={terrace.y + 4} width={terraceWidth - 8} height={terrace.height - 8} rx="6" fill={`${terrace.color}15`} />

            {/* Growth plots */}
            {Array.from({ length: Math.max(3, 6 - idx) }).map((_, pi) => {
              const plotW = (terraceWidth - 40) / Math.max(3, 6 - idx);
              const px = x + 20 + pi * plotW;
              return (
                <g key={pi}>
                  <rect x={px + 4} y={terrace.y + 20} width={plotW - 8} height={terrace.height - 50} rx="4" fill={`${terrace.color}20`} stroke={terrace.color} strokeWidth="0.5" opacity="0.5" />
                  {/* Plant stalks */}
                  {[0.25, 0.5, 0.75].map((frac) => {
                    const stalkX = px + 4 + (plotW - 8) * frac;
                    const stalkHeight = 15 + Math.random() * 20;
                    const stalkBottom = terrace.y + terrace.height - 35;
                    return (
                      <g key={frac}>
                        <line x1={stalkX} y1={stalkBottom} x2={stalkX} y2={stalkBottom - stalkHeight} stroke={terrace.lightColor} strokeWidth="1.5" opacity="0.5" />
                        <circle cx={stalkX} cy={stalkBottom - stalkHeight} r="3" fill={terrace.lightColor} opacity="0.3">
                          <animate attributeName="r" values="2.5;3.5;2.5" dur={`${2 + pi + frac}s`} repeatCount="indefinite" />
                        </circle>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Retaining wall edge (stepped appearance) */}
            <line x1={x} y1={terrace.y + terrace.height} x2={x + terraceWidth} y2={terrace.y + terrace.height} stroke={terrace.color} strokeWidth="3" opacity="0.6" />

            {/* Labels */}
            <text x={400} y={terrace.y + terrace.height + 16} textAnchor="middle" fill={isActive(terrace.id) ? terrace.lightColor : "#3a553a"} fontSize="9" fontWeight="600" letterSpacing="0.08em">
              {terrace.label}
            </text>
          </g>
        );
      })}

      {/* Vertical drainage pipes on sides */}
      {[75, 725].map((px) => (
        <g key={`pipe-${px}`} opacity="0.3">
          <line x1={px} y1="80" x2={px} y2="640" stroke="#16a34a" strokeWidth="2" strokeDasharray="4 4" />
          {[140, 290, 440, 580].map((py) => (
            <circle key={`joint-${px}-${py}`} cx={px} cy={py} r="3" fill="#16a34a" opacity="0.4" />
          ))}
        </g>
      ))}

      {/* Title at bottom */}
      <text x="400" y="700" textAnchor="middle" fill="#2d4a2d" fontSize="11" fontWeight="700" letterSpacing="0.15em">
        TERRACE STACK — SECTOR F-7
      </text>
    </svg>
  );
}

export default function TerraceView() {
  const { faction, factionId } = useFaction();
  const { getAssigned } = useChampionAssignment();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [modalSection, setModalSection] = useState<string | null>(null);
  const sections = faction.facilitySections;
  const leftSections = sections.slice(0, Math.ceil(sections.length / 2));
  const rightSections = sections.slice(Math.ceil(sections.length / 2));

  const getAssignedNames = (sectionId: string): string[] => {
    const ids = getAssigned(factionId, sectionId);
    return ids.map((id) => faction.champions.find((c) => c.id === id)?.name).filter(Boolean) as string[];
  };

  const modalData = modalSection ? sections.find((s) => s.id === modalSection) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-3">
          {leftSections.map((section) => (
            <SectionPanel key={section.id} section={section} isActive={activeSection === section.id} onHover={() => setActiveSection(section.id)} onLeave={() => setActiveSection(null)} onClick={() => setModalSection(section.id)} assignedNames={getAssignedNames(section.id)} />
          ))}
        </div>
        <div className="flex items-center justify-center lg:col-span-6">
          <TerraceSVG activeSection={activeSection} onHover={setActiveSection} onLeave={() => setActiveSection(null)} />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-3">
          {rightSections.map((section) => (
            <SectionPanel key={section.id} section={section} isActive={activeSection === section.id} onHover={() => setActiveSection(section.id)} onLeave={() => setActiveSection(null)} onClick={() => setModalSection(section.id)} assignedNames={getAssignedNames(section.id)} />
          ))}
        </div>
      </div>
      {activeSection && (
        <div className="mt-6 rounded-2xl border border-border bg-surface/50 p-6 text-center lg:hidden">
          <p className="text-sm text-muted">{sections.find((s) => s.id === activeSection)?.description}</p>
        </div>
      )}
      {modalData && (
        <ChampionAssignmentModal sectionId={modalData.id} sectionName={modalData.name} sectionColor={modalData.color} sectionIcon={modalData.icon} onClose={() => setModalSection(null)} />
      )}
    </div>
  );
}
