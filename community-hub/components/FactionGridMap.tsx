"use client";

import { useState, useRef, useEffect } from "react";
import { useFaction } from "@/context/FactionContext";
import { useTick } from "@/context/TickContext";
import { GridNode } from "@/data/factionData";
import NodeChat, { generateTickMessages, type ChatMessage } from "@/components/NodeChat";

function getConnectionColor(health: number): string {
  if (health >= 75) return "#10b981";
  if (health >= 50) return "#fbbf24";
  return "#dc2626";
}

function getHealthColor(health: number): string {
  if (health >= 80) return "#10b981";
  if (health >= 60) return "#fbbf24";
  if (health >= 40) return "#f97316";
  return "#dc2626";
}

function NodeTooltip({
  node,
  factionName,
  emoji,
}: {
  node: GridNode;
  factionName: string;
  emoji: string;
}) {
  const healthColor = getHealthColor(node.health);
  const healthLabel =
    node.health >= 90
      ? "Excellent"
      : node.health >= 75
        ? "Good"
        : node.health >= 60
          ? "Fair"
          : node.health >= 40
            ? "Warning"
            : "Critical";

  return (
    <div
      className="glass-card absolute z-50 w-56 rounded-xl p-4 shadow-2xl pointer-events-none animate-fade-in-up"
      style={{
        left: `${(node.x / 800) * 100}%`,
        top: `${(node.y / 620) * 100 - 2}%`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-bold">{node.name}</span>
        <span className="text-xs font-semibold" style={{ color: healthColor }}>
          {healthLabel}
        </span>
      </div>

      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] text-muted">System Health</span>
          <span className="text-[10px] font-bold" style={{ color: healthColor }}>
            {node.health}%
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/50">
          <div
            className="h-full rounded-full"
            style={{ width: `${node.health}%`, background: healthColor }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-background/40 px-3 py-2">
        <span className="text-xs">{emoji}</span>
        <span className="text-xs text-muted">{factionName} Assigned</span>
        <span className="ml-auto text-xs font-bold text-accent-primary">
          {node.assignedUsers}
        </span>
      </div>

      <div className="mt-2 text-center">
        <span className="text-[9px] font-medium text-accent-primary">Click to open channel</span>
      </div>
    </div>
  );
}

export default function FactionGridMap() {
  const { factionId, faction } = useFaction();
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const { tick } = useTick();
  const prevTickRef = useRef(tick);
  const [tickMessages, setTickMessages] = useState<ChatMessage[]>([]);

  // Generate chat messages every tick, regardless of chat panel visibility
  useEffect(() => {
    if (tick === prevTickRef.current) return;
    prevTickRef.current = tick;

    const nodeName = selectedNode
      ? faction.gridNodes.find((n) => n.id === selectedNode)?.name
      : undefined;
    const newMessages = generateTickMessages(tick, factionId, nodeName);
    setTickMessages((prev) => [...prev, ...newMessages]);
  }, [tick, factionId, selectedNode, faction.gridNodes]);

  const nodeMap = new Map(faction.gridNodes.map((n) => [n.id, n]));
  const activeNodeData = activeNode ? nodeMap.get(activeNode) : null;
  const selectedNodeData = selectedNode ? nodeMap.get(selectedNode) : null;

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    setActiveNode(null);

    // Wait for React to fully commit the re-render (NodeChat remounts via key
    // change) before measuring and scrolling. A double-rAF ensures the browser
    // has painted the updated layout.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!chatRef.current) return;
        chatRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  const handleReturn = () => {
    setSelectedNode(null);
  };

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

      {/* Chat Panel (always visible, above grid) */}
      <div ref={chatRef} className="mb-6" style={{ scrollMarginTop: "88px" }}>
        <NodeChat
          key={selectedNode ?? "world"}
          node={selectedNodeData ?? undefined}
          factionId={factionId}
          factionName={faction.name}
          factionEmoji={faction.emoji}
          theme={faction.theme}
          onReturn={selectedNode ? handleReturn : undefined}
          tickMessages={tickMessages}
        />
      </div>

      {/* Map container */}
      <div className="relative glass-card rounded-2xl p-6 sm:p-8 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Selected node indicator */}
        {selectedNodeData && (
          <div className="relative mb-4 flex items-center gap-2 rounded-lg px-3 py-2" style={{ background: `${faction.theme.primary}10`, border: `1px solid ${faction.theme.primary}30` }}>
            <span className="text-xs">💬</span>
            <span className="text-xs text-muted">
              Viewing channel for <span className="font-bold text-foreground">{selectedNodeData.name}</span>
            </span>
            <span className="ml-auto text-[10px] text-muted">Click another node to switch</span>
          </div>
        )}

        <div className="relative">
          <svg viewBox="0 0 800 620" className="w-full">
            <defs>
              <filter id="conn-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="selected-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Connections */}
            {faction.gridEdges.map((edge) => {
              const fromNode = nodeMap.get(edge.from);
              const toNode = nodeMap.get(edge.to);
              if (!fromNode || !toNode) return null;

              const color = getConnectionColor(edge.health);
              const isHovered = activeNode === edge.from || activeNode === edge.to;
              const isSelected = selectedNode === edge.from || selectedNode === edge.to;
              const isHighlighted = isHovered || isSelected;

              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={color}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    opacity={activeNode === null && selectedNode === null ? 0.4 : isHighlighted ? 0.8 : 0.15}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                    filter={isHighlighted ? "url(#conn-glow)" : undefined}
                  />
                  {isHighlighted && (
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 8}
                      textAnchor="middle"
                      fill={color}
                      fontSize="9"
                      fontWeight="700"
                    >
                      {edge.health}%
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {faction.gridNodes.map((node) => {
              const healthColor = getHealthColor(node.health);
              const isHovered = activeNode === node.id;
              const isSelected = selectedNode === node.id;
              const isActive = isHovered || isSelected;
              const radius = isActive ? 26 : 22;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  onClick={() => handleNodeClick(node.id)}
                >
                  {/* Selected pulse ring */}
                  {isSelected && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius + 14}
                      fill="none"
                      stroke={faction.theme.primary}
                      strokeWidth="1.5"
                      opacity="0.4"
                      filter="url(#selected-glow)"
                    >
                      <animate
                        attributeName="r"
                        values={`${radius + 10};${radius + 18};${radius + 10}`}
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.4;0.15;0.4"
                        dur="2.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Outer glow ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + 8}
                    fill="none"
                    stroke={isSelected ? faction.theme.primary : healthColor}
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
                  </circle>

                  {/* Background */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill="var(--color-surface)"
                    stroke={isSelected ? faction.theme.primary : isHovered ? healthColor : "var(--color-border)"}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    className="transition-all duration-300"
                  />

                  {/* Health arc */}
                  {(() => {
                    const circumference = 2 * Math.PI * (radius - 3);
                    const healthArc = (node.health / 100) * circumference;
                    return (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={radius - 3}
                        fill="none"
                        stroke={isSelected ? faction.theme.primary : healthColor}
                        strokeWidth="3"
                        strokeDasharray={`${healthArc} ${circumference}`}
                        strokeDashoffset={circumference * 0.25}
                        strokeLinecap="round"
                        opacity={isActive ? 0.9 : 0.5}
                        className="transition-all duration-300"
                        transform={`rotate(-90 ${node.x} ${node.y})`}
                      />
                    );
                  })()}

                  {/* Node icon */}
                  <text
                    x={node.x}
                    y={node.y - 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="14"
                  >
                    {isSelected ? "💬" : faction.gridNodeEmoji}
                  </text>

                  {/* Name */}
                  <text
                    x={node.x}
                    y={node.y + 13}
                    textAnchor="middle"
                    fill={isSelected ? faction.theme.primary : isActive ? "var(--color-foreground)" : "var(--color-muted)"}
                    fontSize="8"
                    fontWeight="700"
                    letterSpacing="0.05em"
                    className="transition-all duration-300"
                  >
                    {node.name.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip overlay — only show when hovering and not on the selected node */}
          {activeNodeData && activeNode !== selectedNode && (
            <NodeTooltip
              node={activeNodeData}
              factionName={faction.name}
              emoji={faction.emoji}
            />
          )}
        </div>
      </div>

      {/* Roster table */}
      <div className="mt-8">
            <h3 className="mb-4 text-lg font-bold">{faction.name} Assignment Roster</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {faction.gridNodes.map((node) => {
                const healthColor = getHealthColor(node.health);
                return (
                  <div
                    key={node.id}
                    className="glass-card group flex items-center gap-4 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    onMouseEnter={() => setActiveNode(node.id)}
                    onMouseLeave={() => setActiveNode(null)}
                    onClick={() => handleNodeClick(node.id)}
                  >
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                      <svg viewBox="0 0 40 40" className="h-10 w-10">
                        <circle cx="20" cy="20" r="16" fill="none" stroke="var(--color-border)" strokeWidth="3" />
                        <circle
                          cx="20"
                          cy="20"
                          r="16"
                          fill="none"
                          stroke={healthColor}
                          strokeWidth="3"
                          strokeDasharray={`${(node.health / 100) * 100.5} 100.5`}
                          strokeLinecap="round"
                          transform="rotate(-90 20 20)"
                        />
                      </svg>
                      <span className="absolute text-[9px] font-bold" style={{ color: healthColor }}>
                        {node.health}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold">{node.name}</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{faction.emoji}</span>
                        <span className="text-xs text-muted">
                          {node.assignedUsers} members assigned
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <div
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{
                          background: `${healthColor}15`,
                          color: healthColor,
                        }}
                      >
                        {node.health >= 80
                          ? "Online"
                          : node.health >= 50
                            ? "Degraded"
                            : "Critical"}
                      </div>
                      <span className="text-[9px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to chat
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary stats */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-accent-primary">
                  {faction.gridNodes.length}
                </div>
                <div className="text-xs text-muted">Total Nodes</div>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-accent-glow">
                  {faction.gridNodes.reduce((sum, n) => sum + n.assignedUsers, 0)}
                </div>
                <div className="text-xs text-muted">Total Assigned</div>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#10b981]">
                  {faction.gridNodes.filter((n) => n.health >= 80).length}
                </div>
                <div className="text-xs text-muted">Healthy</div>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#dc2626]">
                  {faction.gridNodes.filter((n) => n.health < 50).length}
                </div>
                <div className="text-xs text-muted">Critical</div>
              </div>
            </div>
          </div>
    </div>
  );
}
