"use client";

import { useState } from "react";
import {
  gridGenerators,
  gridConnections,
  getConnectionColor,
  getHealthColor,
  GridGenerator,
} from "@/data/gridData";

function GeneratorNode({
  gen,
  isActive,
  onHover,
  onLeave,
}: {
  gen: GridGenerator;
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const healthColor = getHealthColor(gen.health);
  const radius = isActive ? 26 : 22;

  return (
    <g
      className="cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Outer glow ring */}
      <circle
        cx={gen.x}
        cy={gen.y}
        r={radius + 8}
        fill="none"
        stroke={healthColor}
        strokeWidth={isActive ? 2 : 0}
        opacity={isActive ? 0.3 : 0}
        className="transition-all duration-300"
      >
        {isActive && (
          <animate
            attributeName="r"
            values={`${radius + 6};${radius + 12};${radius + 6}`}
            dur="2s"
            repeatCount="indefinite"
          />
        )}
        {isActive && (
          <animate
            attributeName="opacity"
            values="0.3;0.1;0.3"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Background circle */}
      <circle
        cx={gen.x}
        cy={gen.y}
        r={radius}
        fill="#1a1008"
        stroke={isActive ? healthColor : "#3d2a18"}
        strokeWidth={isActive ? 2.5 : 1.5}
        className="transition-all duration-300"
      />

      {/* Health arc */}
      {(() => {
        const circumference = 2 * Math.PI * (radius - 3);
        const healthArc = (gen.health / 100) * circumference;
        return (
          <circle
            cx={gen.x}
            cy={gen.y}
            r={radius - 3}
            fill="none"
            stroke={healthColor}
            strokeWidth="3"
            strokeDasharray={`${healthArc} ${circumference}`}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
            opacity={isActive ? 0.9 : 0.5}
            className="transition-all duration-300"
            transform={`rotate(-90 ${gen.x} ${gen.y})`}
          />
        );
      })()}

      {/* Generator icon */}
      <text
        x={gen.x}
        y={gen.y - 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
      >
        ⚙️
      </text>

      {/* Name */}
      <text
        x={gen.x}
        y={gen.y + 13}
        textAnchor="middle"
        fill={isActive ? "#f0e8df" : "#8a7460"}
        fontSize="8"
        fontWeight="700"
        letterSpacing="0.05em"
        className="transition-all duration-300"
      >
        {gen.name.toUpperCase()}
      </text>
    </g>
  );
}

function GeneratorTooltip({
  gen,
  svgRect,
}: {
  gen: GridGenerator;
  svgRect: DOMRect | null;
}) {
  if (!svgRect) return null;

  const healthColor = getHealthColor(gen.health);
  const healthLabel =
    gen.health >= 90
      ? "Excellent"
      : gen.health >= 75
        ? "Good"
        : gen.health >= 60
          ? "Fair"
          : gen.health >= 40
            ? "Warning"
            : "Critical";

  return (
    <div className="glass-card absolute z-50 w-56 rounded-xl p-4 shadow-2xl pointer-events-none animate-fade-in-up"
      style={{
        left: `${(gen.x / 800) * 100}%`,
        top: `${(gen.y / 620) * 100 - 2}%`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold">{gen.name}</span>
        <span className="text-xs font-semibold" style={{ color: healthColor }}>
          {healthLabel}
        </span>
      </div>

      {/* Health bar */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] text-muted">System Health</span>
          <span className="text-[10px] font-bold" style={{ color: healthColor }}>
            {gen.health}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/50">
          <div
            className="h-full rounded-full"
            style={{
              width: `${gen.health}%`,
              background: healthColor,
            }}
          />
        </div>
      </div>

      {/* User count */}
      <div className="flex items-center gap-2 rounded-lg bg-background/40 px-3 py-2">
        <span className="text-xs">🔥</span>
        <span className="text-xs text-muted">Fire Faction Assigned</span>
        <span className="ml-auto text-xs font-bold text-accent-orange">
          {gen.assignedUsers}
        </span>
      </div>
    </div>
  );
}

export default function GridMap() {
  const [activeGenerator, setActiveGenerator] = useState<string | null>(null);
  const [svgRect, setSvgRect] = useState<DOMRect | null>(null);

  const genMap = new Map(gridGenerators.map((g) => [g.id, g]));
  const activeGen = activeGenerator ? genMap.get(activeGenerator) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-2 w-8 rounded-full bg-[#10b981]" />
          <span className="text-xs text-muted">Healthy (75%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-8 rounded-full bg-[#fbbf24]" />
          <span className="text-xs text-muted">Moderate (50–74%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-8 rounded-full bg-[#dc2626]" />
          <span className="text-xs text-muted">Critical (&lt;50%)</span>
        </div>
      </div>

      {/* Map container */}
      <div className="relative glass-card rounded-2xl p-6 sm:p-8 overflow-hidden">
        {/* Background grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, #3d2a18 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* SVG Network */}
        <div className="relative">
          <svg
            viewBox="0 0 800 620"
            className="w-full"
            ref={(el) => {
              if (el && !svgRect) {
                setSvgRect(el.getBoundingClientRect());
              }
            }}
          >
            <defs>
              <filter id="conn-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connections */}
            {gridConnections.map((conn) => {
              const fromGen = genMap.get(conn.from);
              const toGen = genMap.get(conn.to);
              if (!fromGen || !toGen) return null;

              const color = getConnectionColor(conn.health);
              const isHighlighted =
                activeGenerator === conn.from || activeGenerator === conn.to;

              return (
                <g key={`${conn.from}-${conn.to}`}>
                  {/* Base line */}
                  <line
                    x1={fromGen.x}
                    y1={fromGen.y}
                    x2={toGen.x}
                    y2={toGen.y}
                    stroke={color}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    opacity={
                      activeGenerator === null
                        ? 0.4
                        : isHighlighted
                          ? 0.8
                          : 0.1
                    }
                    strokeLinecap="round"
                    className="transition-all duration-300"
                    filter={isHighlighted ? "url(#conn-glow)" : undefined}
                  />
                  {/* Health percentage at midpoint */}
                  {isHighlighted && (
                    <text
                      x={(fromGen.x + toGen.x) / 2}
                      y={(fromGen.y + toGen.y) / 2 - 8}
                      textAnchor="middle"
                      fill={color}
                      fontSize="9"
                      fontWeight="700"
                    >
                      {conn.health}%
                    </text>
                  )}
                </g>
              );
            })}

            {/* Generator nodes */}
            {gridGenerators.map((gen) => (
              <GeneratorNode
                key={gen.id}
                gen={gen}
                isActive={activeGenerator === gen.id}
                onHover={() => setActiveGenerator(gen.id)}
                onLeave={() => setActiveGenerator(null)}
              />
            ))}
          </svg>

          {/* Tooltip overlay */}
          {activeGen && <GeneratorTooltip gen={activeGen} svgRect={svgRect} />}
        </div>
      </div>

      {/* Generator roster table */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold">Fire Faction Assignment Roster</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {gridGenerators.map((gen) => {
            const healthColor = getHealthColor(gen.health);
            return (
              <div
                key={gen.id}
                className="glass-card group flex items-center gap-4 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                onMouseEnter={() => setActiveGenerator(gen.id)}
                onMouseLeave={() => setActiveGenerator(null)}
              >
                {/* Health indicator */}
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                  <svg viewBox="0 0 40 40" className="h-10 w-10">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="none"
                      stroke="#3d2a18"
                      strokeWidth="3"
                    />
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="none"
                      stroke={healthColor}
                      strokeWidth="3"
                      strokeDasharray={`${(gen.health / 100) * 100.5} 100.5`}
                      strokeLinecap="round"
                      transform="rotate(-90 20 20)"
                    />
                  </svg>
                  <span className="absolute text-[9px] font-bold" style={{ color: healthColor }}>
                    {gen.health}
                  </span>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold">{gen.name}</h4>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">🔥</span>
                    <span className="text-xs text-muted">
                      {gen.assignedUsers} members assigned
                    </span>
                  </div>
                </div>

                {/* Status badge */}
                <div
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    background: `${healthColor}15`,
                    color: healthColor,
                  }}
                >
                  {gen.health >= 80
                    ? "Online"
                    : gen.health >= 50
                      ? "Degraded"
                      : "Critical"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent-orange">13</div>
            <div className="text-xs text-muted">Total Generators</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent-heat">
              {gridGenerators.reduce((sum, g) => sum + g.assignedUsers, 0)}
            </div>
            <div className="text-xs text-muted">Total Assigned</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#10b981]">
              {gridGenerators.filter((g) => g.health >= 80).length}
            </div>
            <div className="text-xs text-muted">Healthy</div>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[#dc2626]">
              {gridGenerators.filter((g) => g.health < 50).length}
            </div>
            <div className="text-xs text-muted">Critical</div>
          </div>
        </div>
      </div>
    </div>
  );
}
