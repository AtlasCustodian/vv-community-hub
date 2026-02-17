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

function WallTowerSVG({ activeSection, onHover, onLeave }: { activeSection: string | null; onHover: (id: string) => void; onLeave: () => void }) {
  const isActive = (id: string) => activeSection === id;
  const sectionOpacity = (id: string) => activeSection === null ? 0.85 : isActive(id) ? 1 : 0.4;

  return (
    <svg viewBox="0 0 800 720" className="w-full max-w-2xl mx-auto drop-shadow-2xl" style={{ filter: "drop-shadow(0 0 40px rgba(59, 130, 246, 0.08))" }}>
      <defs>
        <filter id="glow-wall" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-wall-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="stoneWall" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a3040" />
          <stop offset="50%" stopColor="#1e2430" />
          <stop offset="100%" stopColor="#141a24" />
        </linearGradient>
        <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="veilGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0" />
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="beaconGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background grid */}
      <pattern id="gridWall" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e2430" strokeWidth="0.3" opacity="0.3" />
      </pattern>
      <rect width="800" height="720" fill="url(#gridWall)" opacity="0.5" />

      {/* Veil shimmer in background */}
      <rect x="0" y="0" width="800" height="280" fill="url(#veilGrad)">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="6s" repeatCount="indefinite" />
      </rect>

      {/* Sea/water at base */}
      <rect x="0" y="580" width="800" height="140" fill="url(#seaGrad)" />
      {/* Wave lines */}
      <path d="M 0,600 Q 100,590 200,600 Q 300,610 400,600 Q 500,590 600,600 Q 700,610 800,600" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.2">
        <animate attributeName="d" values="M 0,600 Q 100,590 200,600 Q 300,610 400,600 Q 500,590 600,600 Q 700,610 800,600;M 0,600 Q 100,610 200,600 Q 300,590 400,600 Q 500,610 600,600 Q 700,590 800,600;M 0,600 Q 100,590 200,600 Q 300,610 400,600 Q 500,590 600,600 Q 700,610 800,600" dur="4s" repeatCount="indefinite" />
      </path>
      <path d="M 0,620 Q 100,610 200,620 Q 300,630 400,620 Q 500,610 600,620 Q 700,630 800,620" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.15">
        <animate attributeName="d" values="M 0,620 Q 100,630 200,620 Q 300,610 400,620 Q 500,630 600,620 Q 700,610 800,620;M 0,620 Q 100,610 200,620 Q 300,630 400,620 Q 500,610 600,620 Q 700,630 800,620;M 0,620 Q 100,630 200,620 Q 300,610 400,620 Q 500,630 600,620 Q 700,610 800,620" dur="5s" repeatCount="indefinite" />
      </path>

      {/* === WALL BASE (North & South combined) === */}
      <g
        className="cursor-pointer transition-all duration-300"
        opacity={sectionOpacity("wall-north")}
        filter={isActive("wall-north") ? "url(#glow-wall-strong)" : undefined}
        onMouseEnter={() => onHover("wall-north")}
        onMouseLeave={onLeave}
      >
        {/* Left wall section */}
        <rect x="40" y="380" width="260" height="200" rx="4" fill="url(#stoneWall)" stroke="#3a4555" strokeWidth="2" />
        {/* Right wall section */}
        <rect x="500" y="380" width="260" height="200" rx="4" fill="url(#stoneWall)" stroke="#3a4555" strokeWidth="2" />
        {/* Wall crenellations left */}
        {[50, 80, 110, 140, 170, 200, 230, 260].map((x) => (
          <rect key={`cl-${x}`} x={x} y="366" width="18" height="22" rx="2" fill="url(#stoneWall)" stroke="#3a4555" strokeWidth="1.5" />
        ))}
        {/* Wall crenellations right */}
        {[510, 540, 570, 600, 630, 660, 690, 720].map((x) => (
          <rect key={`cr-${x}`} x={x} y="366" width="18" height="22" rx="2" fill="url(#stoneWall)" stroke="#3a4555" strokeWidth="1.5" />
        ))}
        {/* Stone block pattern left */}
        {[400, 440, 480, 520].map((y) => (
          <g key={`bl-${y}`} opacity="0.3">
            <line x1="40" y1={y} x2="300" y2={y} stroke="#3a4555" strokeWidth="0.5" />
            {[100, 160, 220].map((x) => (
              <line key={`vl-${x}-${y}`} x1={x} y1={y} x2={x} y2={y + 40} stroke="#3a4555" strokeWidth="0.5" />
            ))}
          </g>
        ))}
        {/* Stone block pattern right */}
        {[400, 440, 480, 520].map((y) => (
          <g key={`br-${y}`} opacity="0.3">
            <line x1="500" y1={y} x2="760" y2={y} stroke="#3a4555" strokeWidth="0.5" />
            {[560, 620, 680].map((x) => (
              <line key={`vr-${x}-${y}`} x1={x} y1={y} x2={x} y2={y + 40} stroke="#3a4555" strokeWidth="0.5" />
            ))}
          </g>
        ))}
        {/* Torch on left wall */}
        <circle cx="170" cy="430" r="4" fill="#fbbf24" opacity="0.6">
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="170" cy="430" r="8" fill="#fbbf24" opacity="0.1" />
        {/* Torch on right wall */}
        <circle cx="630" cy="430" r="4" fill="#fbbf24" opacity="0.6">
          <animate attributeName="opacity" values="0.5;0.7;0.5" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="630" cy="430" r="8" fill="#fbbf24" opacity="0.1" />

        <text x="170" y="360" textAnchor="middle" fill={isActive("wall-north") ? "#3b82f6" : "#556677"} fontSize="9" fontWeight="600" letterSpacing="0.05em">NORTHERN WALL</text>
        <text x="630" y="360" textAnchor="middle" fill={isActive("wall-south") ? "#2563eb" : "#556677"} fontSize="9" fontWeight="600" letterSpacing="0.05em">SOUTHERN WALL</text>
      </g>

      {/* === MAIN TOWER === */}
      <g
        className="cursor-pointer transition-all duration-300"
        opacity={sectionOpacity("observation-post")}
        filter={isActive("observation-post") ? "url(#glow-wall-strong)" : undefined}
        onMouseEnter={() => onHover("observation-post")}
        onMouseLeave={onLeave}
      >
        {/* Tower body */}
        <rect x="340" y="160" width="120" height="420" rx="4" fill="url(#stoneWall)" stroke="#3a4555" strokeWidth="2.5" />

        {/* Stone courses */}
        {[200, 240, 280, 320, 360, 400, 440, 480, 520].map((y) => (
          <line key={`tc-${y}`} x1="340" y1={y} x2="460" y2={y} stroke="#3a4555" strokeWidth="0.5" opacity="0.3" />
        ))}
        {[380, 420].map((x) => (
          <g key={`tv-${x}`} opacity="0.2">
            {[160, 200, 240, 280, 320, 360, 400, 440, 480, 520].map((y) => (
              <line key={`tv-${x}-${y}`} x1={x} y1={y} x2={x} y2={y + 40} stroke="#3a4555" strokeWidth="0.5" />
            ))}
          </g>
        ))}

        {/* Arrow slits */}
        {[260, 340, 420, 500].map((y) => (
          <g key={`slit-${y}`}>
            <rect x="360" y={y} width="4" height="18" rx="1" fill="#0f172a" stroke="#3a4555" strokeWidth="0.5" />
            <rect x="436" y={y} width="4" height="18" rx="1" fill="#0f172a" stroke="#3a4555" strokeWidth="0.5" />
          </g>
        ))}

        {/* Observation platform */}
        <rect x="320" y="150" width="160" height="20" rx="3" fill="#2a3040" stroke="#3a4555" strokeWidth="2" />
        {/* Platform crenellations */}
        {[325, 345, 365, 385, 405, 425, 445].map((x) => (
          <rect key={`pc-${x}`} x={x} y="136" width="12" height="18" rx="2" fill="url(#stoneWall)" stroke="#3a4555" strokeWidth="1.5" />
        ))}

        {/* Beacon at top */}
        <circle cx="400" cy="120" r="24" fill="url(#beaconGlow)">
          <animate attributeName="r" values="24;28;24" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="400" cy="120" r="8" fill="#60a5fa" opacity="0.8">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="400" cy="120" r="4" fill="#93c5fd" />

        {/* Beacon light rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={`ray-${angle}`}
              x1={400 + Math.cos(rad) * 12}
              y1={120 + Math.sin(rad) * 12}
              x2={400 + Math.cos(rad) * 32}
              y2={120 + Math.sin(rad) * 32}
              stroke="#60a5fa"
              strokeWidth="1"
              opacity="0.3"
            >
              <animate attributeName="opacity" values="0.1;0.4;0.1" dur={`${2 + angle * 0.005}s`} repeatCount="indefinite" />
            </line>
          );
        })}

        {/* Label */}
        <text x="400" y="108" textAnchor="middle" fill={isActive("observation-post") ? "#60a5fa" : "#556677"} fontSize="10" fontWeight="600" letterSpacing="0.05em">
          OBSERVATION POST
        </text>
      </g>

      {/* === BREAKER ALPHA (left) === */}
      <g
        className="cursor-pointer transition-all duration-300"
        opacity={sectionOpacity("breaker-alpha")}
        filter={isActive("breaker-alpha") ? "url(#glow-wall-strong)" : undefined}
        onMouseEnter={() => onHover("breaker-alpha")}
        onMouseLeave={onLeave}
      >
        {/* Breaker arm */}
        <rect x="60" y="600" width="140" height="40" rx="6" fill="#1e2430" stroke="#3b82f6" strokeWidth="1.5" />
        <rect x="70" y="608" width="120" height="24" rx="4" fill="#0f172a" />
        {/* Hydraulic pistons */}
        <rect x="85" y="612" width="8" height="16" rx="2" fill="#3b82f6" opacity="0.4" />
        <rect x="110" y="612" width="8" height="16" rx="2" fill="#3b82f6" opacity="0.4" />
        <rect x="135" y="612" width="8" height="16" rx="2" fill="#3b82f6" opacity="0.4" />
        <rect x="160" y="612" width="8" height="16" rx="2" fill="#3b82f6" opacity="0.4" />
        {/* Rotation indicator */}
        <circle cx="130" cy="590" r="6" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" from="0 130 590" to="360 130 590" dur="8s" repeatCount="indefinite" />
        </circle>
        <line x1="130" y1="584" x2="130" y2="590" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" from="0 130 590" to="360 130 590" dur="8s" repeatCount="indefinite" />
        </line>
        <text x="130" y="655" textAnchor="middle" fill={isActive("breaker-alpha") ? "#1d4ed8" : "#556677"} fontSize="9" fontWeight="600" letterSpacing="0.05em">BREAKER ALPHA</text>
      </g>

      {/* === BREAKER BETA (right) === */}
      <g
        className="cursor-pointer transition-all duration-300"
        opacity={sectionOpacity("breaker-beta")}
        filter={isActive("breaker-beta") ? "url(#glow-wall-strong)" : undefined}
        onMouseEnter={() => onHover("breaker-beta")}
        onMouseLeave={onLeave}
      >
        <rect x="600" y="600" width="140" height="40" rx="6" fill="#1e2430" stroke="#60a5fa" strokeWidth="1.5" />
        <rect x="610" y="608" width="120" height="24" rx="4" fill="#0f172a" />
        <rect x="625" y="612" width="8" height="16" rx="2" fill="#60a5fa" opacity="0.4" />
        <rect x="650" y="612" width="8" height="16" rx="2" fill="#60a5fa" opacity="0.4" />
        <rect x="675" y="612" width="8" height="16" rx="2" fill="#60a5fa" opacity="0.4" />
        <rect x="700" y="612" width="8" height="16" rx="2" fill="#60a5fa" opacity="0.4" />
        <circle cx="670" cy="590" r="6" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" from="0 670 590" to="360 670 590" dur="10s" repeatCount="indefinite" />
        </circle>
        <line x1="670" y1="584" x2="670" y2="590" stroke="#60a5fa" strokeWidth="1.5" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" from="0 670 590" to="360 670 590" dur="10s" repeatCount="indefinite" />
        </line>
        <text x="670" y="655" textAnchor="middle" fill={isActive("breaker-beta") ? "#60a5fa" : "#556677"} fontSize="9" fontWeight="600" letterSpacing="0.05em">BREAKER BETA</text>
      </g>

      {/* === DIVE BAY === */}
      <g
        className="cursor-pointer transition-all duration-300"
        opacity={sectionOpacity("dive-bay")}
        filter={isActive("dive-bay") ? "url(#glow-wall-strong)" : undefined}
        onMouseEnter={() => onHover("dive-bay")}
        onMouseLeave={onLeave}
      >
        {/* Dock platform */}
        <rect x="340" y="580" width="120" height="30" rx="4" fill="#1e2430" stroke="#1e40af" strokeWidth="1.5" />
        <rect x="350" y="586" width="100" height="18" rx="3" fill="#0f172a" />
        {/* Diving figure indicator */}
        <circle cx="380" cy="595" r="4" fill="#1e40af" opacity="0.5" />
        <circle cx="400" cy="595" r="4" fill="#1e40af" opacity="0.5" />
        <circle cx="420" cy="595" r="4" fill="#1e40af" opacity="0.5" />
        {/* Bubbles */}
        <circle cx="390" cy="618" r="2" fill="#3b82f6" opacity="0.3">
          <animate attributeName="cy" values="618;605;618" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="410" cy="625" r="1.5" fill="#3b82f6" opacity="0.2">
          <animate attributeName="cy" values="625;610;625" dur="4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0;0.2" dur="4s" repeatCount="indefinite" />
        </circle>
        <text x="400" y="570" textAnchor="middle" fill={isActive("dive-bay") ? "#1e40af" : "#556677"} fontSize="9" fontWeight="600" letterSpacing="0.05em">DIVE BAY</text>
      </g>

      {/* Title */}
      <text x="400" y="700" textAnchor="middle" fill="#3a4555" fontSize="11" fontWeight="700" letterSpacing="0.15em">
        WINTER WALL — GUARD TOWER N-1
      </text>
    </svg>
  );
}

export default function WallTowerView() {
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
          <WallTowerSVG activeSection={activeSection} onHover={setActiveSection} onLeave={() => setActiveSection(null)} />
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
