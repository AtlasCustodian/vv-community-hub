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

interface GuildNode {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: string;
  size: number;
}

interface GuildEdge {
  from: string;
  to: string;
}

const nodes: GuildNode[] = [
  { id: "central-market", label: "Central Market", x: 400, y: 320, icon: "🏪", size: 48 },
  { id: "artisan-quarter", label: "Artisan Quarter", x: 220, y: 180, icon: "🎨", size: 38 },
  { id: "residential-hub", label: "Residential Hub", x: 580, y: 180, icon: "🏠", size: 38 },
  { id: "council-hall", label: "Council Hall", x: 400, y: 100, icon: "⚖️", size: 42 },
  { id: "bakery-district", label: "Bakery District", x: 160, y: 380, icon: "🍞", size: 34 },
  { id: "cultural-center", label: "Cultural Center", x: 640, y: 380, icon: "🎭", size: 34 },
];

const edges: GuildEdge[] = [
  { from: "council-hall", to: "artisan-quarter" },
  { from: "council-hall", to: "residential-hub" },
  { from: "council-hall", to: "central-market" },
  { from: "central-market", to: "artisan-quarter" },
  { from: "central-market", to: "residential-hub" },
  { from: "central-market", to: "bakery-district" },
  { from: "central-market", to: "cultural-center" },
  { from: "artisan-quarter", to: "bakery-district" },
  { from: "residential-hub", to: "cultural-center" },
];

function RootsSVG({ activeSection, onHover, onLeave }: { activeSection: string | null; onHover: (id: string) => void; onLeave: () => void }) {
  const isActive = (id: string) => activeSection === id;
  const nodeOpacity = (id: string) => activeSection === null ? 0.9 : isActive(id) ? 1 : 0.35;

  const getNode = (id: string) => nodes.find((n) => n.id === id)!;

  const isEdgeActive = (edge: GuildEdge) => isActive(edge.from) || isActive(edge.to);

  return (
    <svg viewBox="0 0 800 520" className="w-full max-w-2xl mx-auto drop-shadow-2xl" style={{ filter: "drop-shadow(0 0 40px rgba(196, 163, 90, 0.08))" }}>
      <defs>
        <filter id="glow-roots" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="rootsGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c4a35a" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#c4a35a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="stoneGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3d3428" />
          <stop offset="100%" stopColor="#2a1e14" />
        </linearGradient>
      </defs>

      {/* Background grid */}
      <pattern id="gridRoots" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3d2a18" strokeWidth="0.3" opacity="0.2" />
      </pattern>
      <rect width="800" height="520" fill="url(#gridRoots)" opacity="0.5" />

      {/* Central glow */}
      <ellipse cx="400" cy="300" rx="200" ry="150" fill="url(#rootsGlow)">
        <animate attributeName="rx" values="200;210;200" dur="4s" repeatCount="indefinite" />
      </ellipse>

      {/* Trade route connections */}
      {edges.map((edge) => {
        const from = getNode(edge.from);
        const to = getNode(edge.to);
        const active = isEdgeActive(edge);
        return (
          <g key={`${edge.from}-${edge.to}`}>
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={active ? "#c4a35a" : "#3d2a18"} strokeWidth={active ? 3 : 2} opacity={active ? 0.8 : 0.4} strokeDasharray={active ? "none" : "6 4"} />
            {active && (
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#c4a35a" strokeWidth={1} opacity={0.3} />
            )}
          </g>
        );
      })}

      {/* Animated trade particles on active edges */}
      {edges.map((edge) => {
        const from = getNode(edge.from);
        const to = getNode(edge.to);
        if (!isEdgeActive(edge)) return null;
        return (
          <circle key={`particle-${edge.from}-${edge.to}`} r="3" fill="#c4a35a" opacity="0.6">
            <animateMotion dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" path={`M ${from.x},${from.y} L ${to.x},${to.y}`} />
          </circle>
        );
      })}

      {/* Guild nodes */}
      {nodes.map((node) => {
        const active = isActive(node.id);
        return (
          <g
            key={node.id}
            className="cursor-pointer transition-all duration-300"
            opacity={nodeOpacity(node.id)}
            filter={active ? "url(#glow-roots)" : undefined}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={onLeave}
          >
            {/* Node glow */}
            {active && (
              <circle cx={node.x} cy={node.y} r={node.size + 12} fill="#c4a35a" opacity="0.08">
                <animate attributeName="r" values={`${node.size + 12};${node.size + 18};${node.size + 12}`} dur="2s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Building base shadow */}
            <ellipse cx={node.x} cy={node.y + node.size * 0.6} rx={node.size * 0.8} ry={node.size * 0.2} fill="#1a1008" opacity="0.3" />

            {/* Building body */}
            <rect
              x={node.x - node.size * 0.6}
              y={node.y - node.size * 0.7}
              width={node.size * 1.2}
              height={node.size * 1.1}
              rx={6}
              fill="url(#stoneGrad)"
              stroke={active ? "#c4a35a" : "#5a4030"}
              strokeWidth={active ? 2 : 1.5}
            />

            {/* Roof */}
            <polygon
              points={`${node.x},${node.y - node.size} ${node.x - node.size * 0.75},${node.y - node.size * 0.7} ${node.x + node.size * 0.75},${node.y - node.size * 0.7}`}
              fill={active ? "#c4a35a" : "#5a4030"}
              opacity={active ? 0.6 : 0.4}
            />

            {/* Window/door glow */}
            <rect
              x={node.x - 5}
              y={node.y - node.size * 0.2}
              width={10}
              height={14}
              rx={2}
              fill="#c4a35a"
              opacity={active ? 0.4 : 0.15}
            >
              <animate attributeName="opacity" values={active ? "0.3;0.5;0.3" : "0.1;0.2;0.1"} dur="3s" repeatCount="indefinite" />
            </rect>

            {/* Icon */}
            <text x={node.x} y={node.y - node.size * 0.3} textAnchor="middle" fontSize={node.size * 0.45} dominantBaseline="central">
              {node.icon}
            </text>

            {/* Label */}
            <text
              x={node.x}
              y={node.y + node.size * 0.65}
              textAnchor="middle"
              fill={active ? "#c4a35a" : "#8a7460"}
              fontSize="10"
              fontWeight="600"
              letterSpacing="0.05em"
            >
              {node.label.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* Title */}
      <text x="400" y="495" textAnchor="middle" fill="#5a4030" fontSize="11" fontWeight="700" letterSpacing="0.15em">
        THE ROOTS — MERCHANT GUILD NETWORK
      </text>
    </svg>
  );
}

export default function RootsView() {
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
          <RootsSVG activeSection={activeSection} onHover={setActiveSection} onLeave={() => setActiveSection(null)} />
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
