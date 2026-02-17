"use client";

import { useState } from "react";
import { generatorSections, GeneratorSection } from "@/data/generatorData";
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

function SectionPanel({
  section,
  isActive,
  onHover,
  onLeave,
  onClick,
  assignedNames,
}: {
  section: GeneratorSection;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  assignedNames: string[];
}) {
  return (
    <div
      className={`glass-card rounded-2xl p-5 transition-all duration-300 cursor-pointer ${
        isActive
          ? "scale-[1.02] ring-1"
          : "opacity-80 hover:opacity-100"
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

function GeneratorSVG({
  activeSection,
  onHover,
  onLeave,
}: {
  activeSection: string | null;
  onHover: (id: string) => void;
  onLeave: () => void;
}) {
  const isActive = (id: string) => activeSection === id;
  const sectionOpacity = (id: string) =>
    activeSection === null ? 0.85 : isActive(id) ? 1 : 0.4;

  const getSectionData = (id: string) =>
    generatorSections.find((s) => s.id === id);

  return (
    <svg
      viewBox="0 0 800 720"
      className="w-full max-w-2xl mx-auto drop-shadow-2xl"
      style={{ filter: "drop-shadow(0 0 40px rgba(249, 115, 22, 0.08))" }}
    >
      <defs>
        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Metal gradient */}
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3d3028" />
          <stop offset="50%" stopColor="#2a1a0e" />
          <stop offset="100%" stopColor="#1a1008" />
        </linearGradient>
        <linearGradient id="metalGradH" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3d3028" />
          <stop offset="50%" stopColor="#2a1a0e" />
          <stop offset="100%" stopColor="#1a1008" />
        </linearGradient>
        {/* Lava gradient */}
        <linearGradient id="lavaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        {/* Fire glow gradient */}
        <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
          <stop offset="70%" stopColor="#ea580c" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
        {/* Steam gradient */}
        <linearGradient id="steamGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background grid */}
      <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3d2a18" strokeWidth="0.3" opacity="0.3" />
      </pattern>
      <rect width="800" height="720" fill="url(#gridPattern)" opacity="0.5" />

      {/* === CONNECTING PIPES === */}
      <g stroke="#3d2a18" strokeWidth="8" fill="none" strokeLinecap="round">
        {/* Exhaust to Boiler */}
        <line x1="400" y1="170" x2="400" y2="220" />
        {/* Boiler to Turbine */}
        <line x1="400" y1="440" x2="400" y2="470" />
        {/* Turbine to Condenser */}
        <line x1="400" y1="560" x2="400" y2="580" />
        {/* Lava Intake to Boiler */}
        <path d="M 160,380 L 200,380 L 260,340 L 300,340" />
        {/* Power Coupling from Boiler */}
        <path d="M 500,340 L 540,340 L 580,340 L 620,340" />
        {/* Pressure Regulators pipes */}
        <line x1="200" y1="280" x2="300" y2="280" />
        <line x1="500" y1="280" x2="600" y2="280" />
      </g>
      {/* Pipe highlights (inner glow) */}
      <g stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.15">
        <line x1="400" y1="170" x2="400" y2="220" />
        <line x1="400" y1="440" x2="400" y2="470" />
        <line x1="400" y1="560" x2="400" y2="580" />
        <path d="M 160,380 L 200,380 L 260,340 L 300,340" />
        <path d="M 500,340 L 540,340 L 580,340 L 620,340" />
        <line x1="200" y1="280" x2="300" y2="280" />
        <line x1="500" y1="280" x2="600" y2="280" />
      </g>

      {/* === EXHAUST STACK === */}
      <g
        className="cursor-pointer transition-all duration-300"
        opacity={sectionOpacity("exhaust-stack")}
        filter={isActive("exhaust-stack") ? "url(#glow-strong)" : undefined}
        onMouseEnter={() => onHover("exhaust-stack")}
        onMouseLeave={onLeave}
      >
        {/* Steam wisps */}
        <g opacity="0.4">
          <ellipse cx="385" cy="30" rx="12" ry="18" fill="#8b5cf6" opacity="0.2">
            <animate attributeName="cy" values="30;10;30" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0;0.2" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="400" cy="20" rx="10" ry="16" fill="#8b5cf6" opacity="0.25">
            <animate attributeName="cy" values="20;0;20" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0;0.25" dur="3.5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="415" cy="25" rx="14" ry="20" fill="#8b5cf6" opacity="0.15">
            <animate attributeName="cy" values="25;5;25" dur="4.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.15;0;0.15" dur="4.5s" repeatCount="indefinite" />
          </ellipse>
        </g>
        {/* Main stack */}
        <rect x="375" y="40" width="50" height="100" rx="3" fill="url(#metalGrad)" stroke="#5a4030" strokeWidth="2" />
        {/* Stack top flange */}
        <rect x="365" y="35" width="70" height="12" rx="3" fill="#3d2a18" stroke="#5a4030" strokeWidth="1.5" />
        {/* Stack bottom flange */}
        <rect x="360" y="140" width="80" height="15" rx="3" fill="#3d2a18" stroke="#5a4030" strokeWidth="1.5" />
        {/* Fill gradient (steam) */}
        <rect x="377" y="42" width="46" height="96" rx="2" fill="url(#steamGrad)" opacity="0.5" />
        {/* Rivets */}
        {[50, 75, 100, 125].map((y) => (
          <g key={y}>
            <circle cx="380" cy={y} r="3" fill="#5a4030" stroke="#3d2a18" strokeWidth="1" />
            <circle cx="420" cy={y} r="3" fill="#5a4030" stroke="#3d2a18" strokeWidth="1" />
          </g>
        ))}
        {/* Label */}
        <text x="400" y="170" textAnchor="middle" fill={isActive("exhaust-stack") ? "#8b5cf6" : "#8a7460"} fontSize="10" fontWeight="600" letterSpacing="0.05em">
          EXHAUST STACK
        </text>
      </g>

      {/* === PRESSURE REGULATORS === */}
      <g
        className="cursor-pointer transition-all duration-300"
        opacity={sectionOpacity("pressure-regulators")}
        filter={isActive("pressure-regulators") ? "url(#glow-strong)" : undefined}
        onMouseEnter={() => onHover("pressure-regulators")}
        onMouseLeave={onLeave}
      >
        {/* Left regulator housing */}
        <rect x="155" y="245" width="80" height="70" rx="8" fill="url(#metalGrad)" stroke="#5a4030" strokeWidth="2" />
        {/* Left gauge face */}
        <circle cx="195" cy="275" r="22" fill="#1a1008" stroke="#d97706" strokeWidth="1.5" />
        <circle cx="195" cy="275" r="18" fill="none" stroke="#5a4030" strokeWidth="0.5" />
        {/* Gauge tick marks */}
        {[-45, -15, 15, 45, 75, 105].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={`lt-${angle}`}
              x1={195 + Math.cos(rad) * 15}
              y1={275 - Math.sin(rad) * 15}
              x2={195 + Math.cos(rad) * 18}
              y2={275 - Math.sin(rad) * 18}
              stroke="#d97706"
              strokeWidth="1"
              opacity="0.6"
            />
          );
        })}
        {/* Needle */}
        <line x1="195" y1="275" x2={195 + Math.cos(0.5) * 14} y2={275 - Math.sin(0.5) * 14} stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="-5 195 275" to="5 195 275" dur="2s" repeatCount="indefinite" />
        </line>
        <circle cx="195" cy="275" r="3" fill="#d97706" />
        {/* Valve wheel */}
        <circle cx="175" cy="310" r="8" fill="none" stroke="#5a4030" strokeWidth="3" />
        <line x1="175" y1="302" x2="175" y2="318" stroke="#5a4030" strokeWidth="2" />
        <line x1="167" y1="310" x2="183" y2="310" stroke="#5a4030" strokeWidth="2" />

        {/* Right regulator housing */}
        <rect x="565" y="245" width="80" height="70" rx="8" fill="url(#metalGrad)" stroke="#5a4030" strokeWidth="2" />
        {/* Right gauge */}
        <circle cx="605" cy="275" r="22" fill="#1a1008" stroke="#d97706" strokeWidth="1.5" />
        <circle cx="605" cy="275" r="18" fill="none" stroke="#5a4030" strokeWidth="0.5" />
        {[-45, -15, 15, 45, 75, 105].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={`rt-${angle}`}
              x1={605 + Math.cos(rad) * 15}
              y1={275 - Math.sin(rad) * 15}
              x2={605 + Math.cos(rad) * 18}
              y2={275 - Math.sin(rad) * 18}
              stroke="#d97706"
              strokeWidth="1"
              opacity="0.6"
            />
          );
        })}
        <line x1="605" y1="275" x2={605 + Math.cos(0.8) * 14} y2={275 - Math.sin(0.8) * 14} stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="-3 605 275" to="3 605 275" dur="2.5s" repeatCount="indefinite" />
        </line>
        <circle cx="605" cy="275" r="3" fill="#d97706" />
        {/* Valve wheel */}
        <circle cx="625" cy="310" r="8" fill="none" stroke="#5a4030" strokeWidth="3" />
        <line x1="625" y1="302" x2="625" y2="318" stroke="#5a4030" strokeWidth="2" />
        <line x1="617" y1="310" x2="633" y2="310" stroke="#5a4030" strokeWidth="2" />

        <text x="195" y="335" textAnchor="middle" fill={isActive("pressure-regulators") ? "#d97706" : "#8a7460"} fontSize="9" fontWeight="600" letterSpacing="0.05em">
          REGULATORS
        </text>
        <text x="605" y="335" textAnchor="middle" fill={isActive("pressure-regulators") ? "#d97706" : "#8a7460"} fontSize="9" fontWeight="600" letterSpacing="0.05em">
          REGULATORS
        </text>
      </g>

      {/* === BOILER CORE === */}
      <g
        className="cursor-pointer transition-all duration-300"
        opacity={sectionOpacity("boiler-core")}
        filter={isActive("boiler-core") ? "url(#glow-strong)" : undefined}
        onMouseEnter={() => onHover("boiler-core")}
        onMouseLeave={onLeave}
      >
        {/* Main body */}
        <rect x="300" y="220" width="200" height="220" rx="12" fill="url(#metalGrad)" stroke="#5a4030" strokeWidth="2.5" />
        {/* Inner lining */}
        <rect x="310" y="230" width="180" height="200" rx="8" fill="#1a1008" stroke="#3d2a18" strokeWidth="1" />
        {/* Fire glow inside */}
        <ellipse cx="400" cy="340" rx="70" ry="60" fill="url(#fireGlow)">
          <animate attributeName="rx" values="70;75;70" dur="2s" repeatCount="indefinite" />
          <animate attributeName="ry" values="60;65;60" dur="2s" repeatCount="indefinite" />
        </ellipse>
        {/* Viewport window */}
        <rect x="370" y="290" width="60" height="40" rx="6" fill="#1a1008" stroke="#f97316" strokeWidth="1.5" opacity="0.8" />
        <rect x="374" y="294" width="52" height="32" rx="4" fill="none" stroke="#f97316" strokeWidth="0.5" opacity="0.4" />
        {/* Lava glow through viewport */}
        <rect x="376" y="296" width="48" height="28" rx="3" fill="#f97316" opacity="0.15">
          <animate attributeName="opacity" values="0.15;0.25;0.15" dur="1.5s" repeatCount="indefinite" />
        </rect>
        {/* Bolt pattern - top row */}
        {[320, 350, 380, 410, 440, 470].map((x) => (
          <circle key={`bt-${x}`} cx={x} cy="232" r="4" fill="#5a4030" stroke="#3d2a18" strokeWidth="1" />
        ))}
        {/* Bolt pattern - bottom row */}
        {[320, 350, 380, 410, 440, 470].map((x) => (
          <circle key={`bb-${x}`} cx={x} cy="428" r="4" fill="#5a4030" stroke="#3d2a18" strokeWidth="1" />
        ))}
        {/* Side bolts */}
        {[260, 300, 340, 380, 400].map((y) => (
          <g key={`sb-${y}`}>
            <circle cx="308" cy={y} r="3.5" fill="#5a4030" stroke="#3d2a18" strokeWidth="1" />
            <circle cx="492" cy={y} r="3.5" fill="#5a4030" stroke="#3d2a18" strokeWidth="1" />
          </g>
        ))}
        {/* Top plate */}
        <rect x="295" y="218" width="210" height="14" rx="4" fill="#3d2a18" stroke="#5a4030" strokeWidth="1" />
        {/* Bottom plate */}
        <rect x="295" y="430" width="210" height="14" rx="4" fill="#3d2a18" stroke="#5a4030" strokeWidth="1" />
        {/* Temp indicator */}
        <text x="400" y="275" textAnchor="middle" fill="#f97316" fontSize="24" fontWeight="700" opacity="0.6" fontFamily="monospace">
          1847°
        </text>
        {/* Label */}
        <text x="400" y="415" textAnchor="middle" fill={isActive("boiler-core") ? "#f97316" : "#8a7460"} fontSize="11" fontWeight="700" letterSpacing="0.08em">
          BOILER CORE
        </text>
      </g>

      {/* === LAVA INTAKE === */}
      <g
        className="cursor-pointer transition-all duration-300"
        opacity={sectionOpacity("lava-intake")}
        filter={isActive("lava-intake") ? "url(#glow-strong)" : undefined}
        onMouseEnter={() => onHover("lava-intake")}
        onMouseLeave={onLeave}
      >
        {/* Intake pipe */}
        <path d="M 80,420 L 80,380 L 140,380 L 200,340 L 260,340 L 300,340" fill="none" stroke="#5a4030" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 80,420 L 80,380 L 140,380 L 200,340 L 260,340 L 300,340" fill="none" stroke="#3d2a18" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        {/* Lava flow inside pipe */}
        <path d="M 80,420 L 80,380 L 140,380 L 200,340 L 260,340 L 295,340" fill="none" stroke="url(#lavaGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
        </path>
        {/* Intake mouth */}
        <rect x="60" y="410" width="40" height="30" rx="4" fill="#3d2a18" stroke="#dc2626" strokeWidth="1.5" />
        <rect x="65" y="415" width="30" height="20" rx="2" fill="#dc2626" opacity="0.3">
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite" />
        </rect>
        {/* Intake gate */}
        <rect x="130" y="365" width="20" height="30" rx="2" fill="#5a4030" stroke="#dc2626" strokeWidth="1" />
        <line x1="140" y1="370" x2="140" y2="390" stroke="#dc2626" strokeWidth="1" opacity="0.5" />
        {/* Label */}
        <text x="120" y="460" textAnchor="middle" fill={isActive("lava-intake") ? "#dc2626" : "#8a7460"} fontSize="10" fontWeight="600" letterSpacing="0.05em">
          LAVA INTAKE
        </text>
      </g>

      {/* === POWER COUPLING === */}
      <g
        className="cursor-pointer transition-all duration-300"
        opacity={sectionOpacity("power-coupling")}
        filter={isActive("power-coupling") ? "url(#glow-strong)" : undefined}
        onMouseEnter={() => onHover("power-coupling")}
        onMouseLeave={onLeave}
      >
        {/* Output pipe */}
        <path d="M 500,340 L 580,340 L 620,340" fill="none" stroke="#5a4030" strokeWidth="16" strokeLinecap="round" />
        <path d="M 500,340 L 580,340 L 620,340" fill="none" stroke="#3d2a18" strokeWidth="12" strokeLinecap="round" />
        {/* Coupling housing */}
        <rect x="620" y="310" width="100" height="60" rx="8" fill="url(#metalGrad)" stroke="#fbbf24" strokeWidth="1.5" />
        <rect x="630" y="320" width="80" height="40" rx="4" fill="#1a1008" stroke="#3d2a18" strokeWidth="1" />
        {/* Lightning bolt symbols */}
        <text x="670" y="348" textAnchor="middle" fill="#fbbf24" fontSize="20" opacity="0.7">
          ⚡
        </text>
        {/* Connection terminals */}
        <circle cx="720" cy="325" r="5" fill="#fbbf24" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="720" cy="345" r="5" fill="#fbbf24" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.3;0.5" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="720" cy="355" r="5" fill="#fbbf24" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="1.2s" repeatCount="indefinite" />
        </circle>
        {/* Output lines */}
        <line x1="725" y1="325" x2="750" y2="325" stroke="#fbbf24" strokeWidth="2" opacity="0.4" />
        <line x1="725" y1="345" x2="750" y2="345" stroke="#fbbf24" strokeWidth="2" opacity="0.4" />
        <line x1="725" y1="355" x2="750" y2="355" stroke="#fbbf24" strokeWidth="2" opacity="0.3" />
        {/* Label */}
        <text x="670" y="390" textAnchor="middle" fill={isActive("power-coupling") ? "#fbbf24" : "#8a7460"} fontSize="10" fontWeight="600" letterSpacing="0.05em">
          POWER COUPLING
        </text>
      </g>

      {/* === TURBINE ASSEMBLY === */}
      <g
        className="cursor-pointer transition-all duration-300"
        opacity={sectionOpacity("turbine-assembly")}
        filter={isActive("turbine-assembly") ? "url(#glow-strong)" : undefined}
        onMouseEnter={() => onHover("turbine-assembly")}
        onMouseLeave={onLeave}
      >
        {/* Turbine housing */}
        <circle cx="400" cy="510" r="50" fill="url(#metalGrad)" stroke="#5a4030" strokeWidth="2.5" />
        <circle cx="400" cy="510" r="42" fill="#1a1008" stroke="#3d2a18" strokeWidth="1" />
        {/* Turbine blades */}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0 400 510" to="360 400 510" dur="3s" repeatCount="indefinite" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={`blade-${angle}`}
                x1="400"
                y1="510"
                x2={400 + Math.cos(rad) * 35}
                y2={510 + Math.sin(rad) * 35}
                stroke="#ea580c"
                strokeWidth="2"
                opacity="0.6"
              />
            );
          })}
        </g>
        {/* Center hub */}
        <circle cx="400" cy="510" r="8" fill="#3d2a18" stroke="#ea580c" strokeWidth="1.5" />
        <circle cx="400" cy="510" r="3" fill="#ea580c" opacity="0.7" />
        {/* Housing bolts */}
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <circle
              key={`tbolt-${angle}`}
              cx={400 + Math.cos(rad) * 46}
              cy={510 + Math.sin(rad) * 46}
              r="3"
              fill="#5a4030"
              stroke="#3d2a18"
              strokeWidth="1"
            />
          );
        })}
        {/* Label */}
        <text x="400" y="575" textAnchor="middle" fill={isActive("turbine-assembly") ? "#ea580c" : "#8a7460"} fontSize="10" fontWeight="600" letterSpacing="0.05em">
          TURBINE ASSEMBLY
        </text>
      </g>

      {/* === CONDENSER UNIT === */}
      <g
        className="cursor-pointer transition-all duration-300"
        opacity={sectionOpacity("condenser-unit")}
        filter={isActive("condenser-unit") ? "url(#glow-strong)" : undefined}
        onMouseEnter={() => onHover("condenser-unit")}
        onMouseLeave={onLeave}
      >
        {/* Main housing */}
        <rect x="310" y="590" width="180" height="70" rx="10" fill="url(#metalGrad)" stroke="#5a4030" strokeWidth="2" />
        <rect x="320" y="598" width="160" height="54" rx="6" fill="#1a1008" stroke="#3d2a18" strokeWidth="1" />
        {/* Cooling coils */}
        <path
          d="M 330,612 Q 345,605 360,612 Q 375,619 390,612 Q 405,605 420,612 Q 435,619 450,612 Q 465,605 470,612"
          fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5"
        />
        <path
          d="M 330,625 Q 345,618 360,625 Q 375,632 390,625 Q 405,618 420,625 Q 435,632 450,625 Q 465,618 470,625"
          fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5"
        />
        <path
          d="M 330,638 Q 345,631 360,638 Q 375,645 390,638 Q 405,631 420,638 Q 435,645 450,638 Q 465,631 470,638"
          fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.4"
        />
        {/* Water inlet/outlet */}
        <circle cx="315" cy="625" r="6" fill="#3d2a18" stroke="#3b82f6" strokeWidth="1.5" />
        <circle cx="485" cy="625" r="6" fill="#3d2a18" stroke="#3b82f6" strokeWidth="1.5" />
        {/* Corner bolts */}
        <circle cx="318" cy="598" r="3" fill="#5a4030" stroke="#3d2a18" strokeWidth="1" />
        <circle cx="482" cy="598" r="3" fill="#5a4030" stroke="#3d2a18" strokeWidth="1" />
        <circle cx="318" cy="652" r="3" fill="#5a4030" stroke="#3d2a18" strokeWidth="1" />
        <circle cx="482" cy="652" r="3" fill="#5a4030" stroke="#3d2a18" strokeWidth="1" />
        {/* Label */}
        <text x="400" y="685" textAnchor="middle" fill={isActive("condenser-unit") ? "#3b82f6" : "#8a7460"} fontSize="10" fontWeight="600" letterSpacing="0.05em">
          CONDENSER UNIT
        </text>
      </g>

      {/* Generator label */}
      <text x="400" y="710" textAnchor="middle" fill="#5a4030" fontSize="11" fontWeight="700" letterSpacing="0.15em">
        GENERATOR 04 — DEEP SHAFT EAST
      </text>
    </svg>
  );
}

export default function GeneratorView() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [modalSection, setModalSection] = useState<string | null>(null);
  const { faction, factionId } = useFaction();
  const { getAssigned } = useChampionAssignment();

  const getAssignedNames = (sectionId: string): string[] => {
    const ids = getAssigned(factionId, sectionId);
    return ids
      .map((id) => faction.champions.find((c) => c.id === id)?.name)
      .filter(Boolean) as string[];
  };

  const modalData = modalSection
    ? generatorSections.find((s) => s.id === modalSection)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Two-column layout: panels on sides, generator in center */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left panels */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          {generatorSections.slice(0, 4).map((section) => (
            <SectionPanel
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

        {/* Center: Generator Diagram */}
        <div className="flex items-center justify-center lg:col-span-6">
          <GeneratorSVG
            activeSection={activeSection}
            onHover={setActiveSection}
            onLeave={() => setActiveSection(null)}
          />
        </div>

        {/* Right panels */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          {generatorSections.slice(4).map((section) => (
            <SectionPanel
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
      </div>

      {/* Active section description (mobile-friendly) */}
      {activeSection && (
        <div className="mt-6 rounded-2xl border border-border bg-surface/50 p-6 text-center lg:hidden">
          <p className="text-sm text-muted">
            {generatorSections.find((s) => s.id === activeSection)?.description}
          </p>
        </div>
      )}

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
