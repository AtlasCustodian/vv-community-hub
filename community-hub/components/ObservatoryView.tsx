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

interface RelayNode {
  id: string;
  x: number;
  y: number;
  label: string;
  type: "observatory" | "relay" | "endpoint";
  active: boolean;
}

interface RelayLink {
  from: string;
  to: string;
  active: boolean;
  bandwidth: "high" | "medium" | "low";
}

const relayNodes: RelayNode[] = [
  { id: "obs-main", x: 400, y: 260, label: "PRIMARY OBSERVATORY", type: "observatory", active: true },
  { id: "relay-north", x: 250, y: 140, label: "NORTH RELAY", type: "relay", active: true },
  { id: "relay-east", x: 600, y: 180, label: "EAST RELAY", type: "relay", active: true },
  { id: "relay-south", x: 500, y: 460, label: "SOUTH RELAY", type: "relay", active: true },
  { id: "relay-west", x: 180, y: 380, label: "WEST RELAY", type: "relay", active: false },
  { id: "endpoint-archives", x: 100, y: 200, label: "ARCHIVES", type: "endpoint", active: true },
  { id: "endpoint-forge", x: 680, y: 340, label: "FORGE LINK", type: "endpoint", active: true },
  { id: "endpoint-council", x: 320, y: 520, label: "COUNCIL", type: "endpoint", active: true },
];

const relayLinks: RelayLink[] = [
  { from: "obs-main", to: "relay-north", active: true, bandwidth: "high" },
  { from: "obs-main", to: "relay-east", active: true, bandwidth: "high" },
  { from: "obs-main", to: "relay-south", active: true, bandwidth: "medium" },
  { from: "obs-main", to: "relay-west", active: false, bandwidth: "low" },
  { from: "relay-north", to: "endpoint-archives", active: true, bandwidth: "medium" },
  { from: "relay-east", to: "endpoint-forge", active: true, bandwidth: "high" },
  { from: "relay-south", to: "endpoint-council", active: true, bandwidth: "medium" },
  { from: "relay-west", to: "endpoint-archives", active: false, bandwidth: "low" },
  { from: "relay-north", to: "relay-east", active: true, bandwidth: "medium" },
];

function ObservatorySVG({ activeSection, onHover, onLeave }: { activeSection: string | null; onHover: (id: string) => void; onLeave: () => void }) {
  const isActive = (id: string) => activeSection === id;
  const globalDim = activeSection !== null;

  const getNode = (id: string) => relayNodes.find((n) => n.id === id)!;

  const bandwidthWidth = (bw: string) => bw === "high" ? 2.5 : bw === "medium" ? 1.5 : 0.8;
  const bandwidthColor = (bw: string) => bw === "high" ? "#a78bfa" : bw === "medium" ? "#818cf8" : "#6366f1";

  return (
    <svg viewBox="0 0 800 620" className="w-full max-w-2xl mx-auto drop-shadow-2xl" style={{ filter: "drop-shadow(0 0 40px rgba(139, 92, 246, 0.08))" }}>
      <defs>
        <filter id="glow-obs" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-obs-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="obsCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.5" />
          <stop offset="60%" stopColor="#4c1d95" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="relayPulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background grid */}
      <pattern id="gridObs" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a1030" strokeWidth="0.3" opacity="0.3" />
      </pattern>
      <rect width="800" height="620" fill="url(#gridObs)" opacity="0.5" />

      {/* Relay links */}
      {relayLinks.map((link, i) => {
        const from = getNode(link.from);
        const to = getNode(link.to);
        const linkColor = link.active ? bandwidthColor(link.bandwidth) : "#333";
        const linkWidth = link.active ? bandwidthWidth(link.bandwidth) : 0.5;

        return (
          <g key={i} opacity={globalDim ? 0.3 : 0.7}>
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={linkColor} strokeWidth={linkWidth} strokeDasharray={link.active ? "none" : "4 4"} />
            {link.active && (
              <circle r="3" fill={linkColor} opacity="0.6">
                <animateMotion dur={`${3 + i * 0.7}s`} repeatCount="indefinite" path={`M ${from.x},${from.y} L ${to.x},${to.y}`} />
                <animate attributeName="opacity" values="0;0.7;0" dur={`${3 + i * 0.7}s`} repeatCount="indefinite" />
              </circle>
            )}
          </g>
        );
      })}

      {/* Relay Nodes */}
      {relayNodes.filter((n) => n.type !== "observatory").map((node) => (
        <g
          key={node.id}
          className="cursor-pointer transition-all duration-300"
          opacity={globalDim && !isActive(node.id) ? 0.35 : 0.9}
          filter={isActive(node.id) ? "url(#glow-obs)" : undefined}
          onMouseEnter={() => onHover(node.id)}
          onMouseLeave={onLeave}
        >
          {/* Node glow */}
          {node.active && (
            <circle cx={node.x} cy={node.y} r="18" fill="url(#relayPulse)">
              <animate attributeName="r" values="16;20;16" dur="3s" repeatCount="indefinite" />
            </circle>
          )}

          {/* Node body */}
          {node.type === "relay" ? (
            <g>
              <rect x={node.x - 14} y={node.y - 14} width="28" height="28" rx="6" fill={node.active ? "#1e1040" : "#151015"} stroke={node.active ? "#7c3aed" : "#333"} strokeWidth="2" />
              <rect x={node.x - 6} y={node.y - 6} width="12" height="12" rx="2" fill={node.active ? "#a78bfa" : "#444"} opacity="0.4" />
              {node.active && (
                <circle cx={node.x} cy={node.y} r="3" fill="#a78bfa" opacity="0.8">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          ) : (
            <g>
              <circle cx={node.x} cy={node.y} r="10" fill={node.active ? "#1e1040" : "#151015"} stroke={node.active ? "#818cf8" : "#333"} strokeWidth="1.5" />
              <circle cx={node.x} cy={node.y} r="4" fill={node.active ? "#818cf8" : "#444"} opacity="0.5" />
            </g>
          )}

          {/* Label */}
          <text x={node.x} y={node.y + 30} textAnchor="middle" fill={isActive(node.id) ? "#a78bfa" : "#4a4060"} fontSize="8" fontWeight="600" letterSpacing="0.04em">
            {node.label}
          </text>
        </g>
      ))}

      {/* === PRIMARY OBSERVATORY (center) === */}
      <g
        className="cursor-pointer transition-all duration-300"
        opacity={globalDim && !isActive("obs-main") ? 0.35 : 1}
        filter={isActive("obs-main") ? "url(#glow-obs-strong)" : "url(#glow-obs)"}
        onMouseEnter={() => onHover("obs-main")}
        onMouseLeave={onLeave}
      >
        {/* Observatory dome backdrop glow */}
        <circle cx="400" cy="260" r="60" fill="url(#obsCore)">
          <animate attributeName="r" values="55;65;55" dur="5s" repeatCount="indefinite" />
        </circle>

        {/* Observatory base / pedestal */}
        <rect x="360" y="280" width="80" height="40" rx="4" fill="#1a1030" stroke="#5b21b6" strokeWidth="2" />
        {/* Base detail lines */}
        <line x1="365" y1="295" x2="435" y2="295" stroke="#5b21b6" strokeWidth="0.5" opacity="0.4" />
        <line x1="365" y1="310" x2="435" y2="310" stroke="#5b21b6" strokeWidth="0.5" opacity="0.4" />

        {/* Dome */}
        <path d="M 360,280 Q 360,220 400,200 Q 440,220 440,280 Z" fill="#1a1030" stroke="#7c3aed" strokeWidth="2.5" />

        {/* Dome ribs */}
        <path d="M 380,275 Q 380,235 400,218" fill="none" stroke="#5b21b6" strokeWidth="0.8" opacity="0.4" />
        <path d="M 420,275 Q 420,235 400,218" fill="none" stroke="#5b21b6" strokeWidth="0.8" opacity="0.4" />
        <path d="M 400,280 L 400,210" stroke="#5b21b6" strokeWidth="0.8" opacity="0.3" />

        {/* Telescope / antenna */}
        <line x1="400" y1="200" x2="400" y2="170" stroke="#a78bfa" strokeWidth="2" />
        <circle cx="400" cy="168" r="5" fill="none" stroke="#a78bfa" strokeWidth="1.5" />
        <circle cx="400" cy="168" r="2" fill="#a78bfa" opacity="0.7">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Signal waves emanating */}
        {[1, 2, 3].map((i) => (
          <circle key={i} cx="400" cy="168" r={12 * i} fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity={0.4 / i}>
            <animate attributeName="r" from={10 * i} to={10 * i + 20} dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values={`${0.4 / i};0;${0.4 / i}`} dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Lens aperture ring */}
        <circle cx="400" cy="240" r="16" fill="none" stroke="#7c3aed" strokeWidth="1.5" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" from="0 400 240" to="360 400 240" dur="20s" repeatCount="indefinite" />
        </circle>
        <circle cx="400" cy="240" r="12" fill="#4c1d95" opacity="0.3" />
        <circle cx="400" cy="240" r="6" fill="#7c3aed" opacity="0.15" />
        <circle cx="400" cy="240" r="3" fill="#a78bfa" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Label */}
        <text x="400" y="340" textAnchor="middle" fill={isActive("obs-main") ? "#a78bfa" : "#4a4060"} fontSize="10" fontWeight="600" letterSpacing="0.06em">
          PRIMARY OBSERVATORY
        </text>
      </g>

      {/* Title */}
      <text x="400" y="590" textAnchor="middle" fill="#3a3050" fontSize="11" fontWeight="700" letterSpacing="0.15em">
        RELAY NETWORK — NODE SIGMA-4
      </text>
    </svg>
  );
}

export default function ObservatoryView() {
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
          <ObservatorySVG activeSection={activeSection} onHover={setActiveSection} onLeave={() => setActiveSection(null)} />
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
