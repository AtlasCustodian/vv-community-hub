"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import type { ParkourGrid } from "@/types/explorer/vantheon";
import type { FactionTheme } from "@/lib/explorer/factionThemes";
import { getConnectedNodes, parseKey } from "@/lib/explorer/parkourGenerator";

interface ParkourPanelProps {
  grid: ParkourGrid;
  speed: number;
  floor: number;
  goldReward: number;
  theme: FactionTheme;
  onParkourVictory: (goldReward: number) => void;
  onParkourDefeat: (hpLoss: number) => void;
}

type Phase = "moving" | "won" | "lost";

const NODE_RADIUS = 12;
const HUB_RADIUS = 18;
const PAD_X = 50;
const PAD_Y = 40;
const LANE_GAP = 48;
const COL_GAP = 60;

export default function ParkourPanel({
  grid,
  speed,
  goldReward,
  theme,
  onParkourVictory,
  onParkourDefeat,
}: ParkourPanelProps) {
  const [phase, setPhase] = useState<Phase>("moving");
  const [currentPos, setCurrentPos] = useState<[number, number]>(grid.hubNode);
  const [movesUsed, setMovesUsed] = useState(0);
  const [path, setPath] = useState<[number, number][]>([grid.hubNode]);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const movesRemaining = speed - movesUsed;
  const lastCol = grid.cols - 1;

  const isHubNode = (r: number, c: number) =>
    r === grid.hubNode[0] && c === grid.hubNode[1];
  const atHub = isHubNode(currentPos[0], currentPos[1]);

  const rowY = useCallback(
    (row: number): number => PAD_Y + row * LANE_GAP,
    [],
  );

  const totalHeight = Math.max(0, (grid.pathCount - 1) * LANE_GAP);
  const hubVisualY = PAD_Y + totalHeight / 2;

  const getNodePos = useCallback(
    (row: number, col: number): { x: number; y: number } => {
      if (isHubNode(row, col)) {
        return { x: PAD_X, y: hubVisualY };
      }
      return { x: PAD_X + col * COL_GAP, y: rowY(row) };
    },
    [rowY, hubVisualY],
  );

  const validMoves = useMemo((): [number, number][] => {
    if (phase !== "moving") return [];
    return getConnectedNodes(grid, currentPos[0], currentPos[1]);
  }, [grid, currentPos, phase]);

  const VISIBILITY_RANGE = 4;

  const maxVisibleCol = useMemo(() => {
    return currentPos[1] + VISIBILITY_RANGE;
  }, [currentPos]);

  const isVisible = (col: number) => col <= maxVisibleCol;
  const endVisible = lastCol <= maxVisibleCol;

  const viewWidth = PAD_X * 2 + (grid.cols - 1) * COL_GAP;
  const viewHeight = PAD_Y * 2 + totalHeight;

  const handleMove = useCallback(
    (row: number, col: number) => {
      if (phase !== "moving" || movesRemaining <= 0) return;

      const isValid = validMoves.some(([r, c]) => r === row && c === col);
      if (!isValid) return;

      const newPath = [...path, [row, col] as [number, number]];
      const newMovesUsed = movesUsed + 1;
      const newRemaining = speed - newMovesUsed;

      setCurrentPos([row, col]);
      setPath(newPath);
      setMovesUsed(newMovesUsed);

      if (col === lastCol) {
        setPhase("won");
        return;
      }

      if (newRemaining <= 0) {
        setPhase("lost");
      }
    },
    [phase, movesRemaining, validMoves, path, movesUsed, speed, lastCol],
  );

  const handleReturnToHub = useCallback(() => {
    if (phase !== "moving" || movesRemaining <= 0 || atHub) return;
    const newMovesUsed = movesUsed + 1;
    const newRemaining = speed - newMovesUsed;
    setCurrentPos(grid.hubNode);
    setPath([grid.hubNode]);
    setMovesUsed(newMovesUsed);
    if (newRemaining <= 0) {
      setPhase("lost");
    }
  }, [phase, movesRemaining, atHub, movesUsed, speed, grid.hubNode]);

  const getSvgPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!svgRef.current) return null;
      const pt = svgRef.current.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svgRef.current.getScreenCTM();
      if (!ctm) return null;
      return pt.matrixTransform(ctm.inverse());
    },
    [],
  );

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (phase !== "moving" || movesRemaining <= 0) return;
      setDragging(true);
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const svgPt = getSvgPoint(clientX, clientY);
      if (svgPt) setDragPos({ x: svgPt.x, y: svgPt.y });
    },
    [phase, movesRemaining, getSvgPoint],
  );

  const handleDragMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!dragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const svgPt = getSvgPoint(clientX, clientY);
      if (svgPt) setDragPos({ x: svgPt.x, y: svgPt.y });
    },
    [dragging, getSvgPoint],
  );

  const handleDragEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!dragging) return;
      setDragging(false);
      setDragPos(null);

      const clientX =
        "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
      const clientY =
        "changedTouches" in e ? e.changedTouches[0].clientY : e.clientY;
      const svgPt = getSvgPoint(clientX, clientY);
      if (!svgPt) return;

      for (const [r, c] of validMoves) {
        const pos = getNodePos(r, c);
        const dx = svgPt.x - pos.x;
        const dy = svgPt.y - pos.y;
        if (Math.sqrt(dx * dx + dy * dy) < NODE_RADIUS * 2) {
          handleMove(r, c);
          return;
        }
      }
    },
    [dragging, getSvgPoint, validMoves, handleMove, getNodePos],
  );

  const hpLoss = useMemo(() => {
    const colsRemaining = lastCol - currentPos[1];
    return Math.max(1, Math.floor(colsRemaining / 2) + 1);
  }, [currentPos, lastCol]);

  const edges = useMemo(() => {
    const seen = new Set<string>();
    const result: { from: [number, number]; to: [number, number] }[] = [];
    for (const [key, neighbors] of Object.entries(grid.adjacency)) {
      const from = parseKey(key);
      for (const nKey of neighbors) {
        const canonical = key < nKey ? `${key}|${nKey}` : `${nKey}|${key}`;
        if (seen.has(canonical)) continue;
        seen.add(canonical);
        result.push({ from, to: parseKey(nKey) });
      }
    }
    return result;
  }, [grid]);

  const isOnPath = (row: number, col: number) =>
    path.some(([r, c]) => r === row && c === col);

  const isValidTarget = (row: number, col: number) =>
    validMoves.some(([r, c]) => r === row && c === col);

  const isGoldNode = (row: number, col: number) =>
    `${row},${col}` in grid.goldNodes;

  const bonusGold = useMemo(() => {
    let total = 0;
    for (const [r, c] of path) {
      const key = `${r},${c}`;
      if (key in grid.goldNodes) total += grid.goldNodes[key];
    }
    return total;
  }, [path, grid.goldNodes]);

  const isEdgeOnPath = (from: [number, number], to: [number, number]) => {
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i], b = path[i + 1];
      if (
        (a[0] === from[0] && a[1] === from[1] && b[0] === to[0] && b[1] === to[1]) ||
        (a[0] === to[0] && a[1] === to[1] && b[0] === from[0] && b[1] === from[1])
      ) {
        return true;
      }
    }
    return false;
  };

  const headerText = (() => {
    if (phase === "won") return "Course Complete!";
    if (phase === "lost") return "Out of Moves!";
    if (atHub) return "Choose a Path";
    return "Navigate to the End";
  })();

  const subtitleText = (() => {
    if (phase !== "moving") return null;
    if (atHub) return "Select a path from the hub. Choose wisely — dead ends lurk ahead.";
    if (endVisible) return "The end is in sight — navigate to the gold!";
    return "The path ahead is shrouded in shadow...";
  })();

  return (
    <div className="animate-fade-in" style={{ width: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <p
          style={{
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#34d399",
            marginBottom: 4,
            fontWeight: 700,
          }}
        >
          Parkour
        </p>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.primary }}>
          {headerText}
        </h3>
        {subtitleText && (
          <p
            style={{
              fontSize: 12,
              color: "var(--color-muted)",
              marginTop: 4,
            }}
          >
            {subtitleText}
          </p>
        )}
      </div>

      {/* Moves counter + return-to-hub */}
      {phase === "moving" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginBottom: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: `1px solid ${movesRemaining <= 3 ? "rgba(248, 113, 113, 0.4)" : "rgba(52, 211, 153, 0.3)"}`,
              background:
                movesRemaining <= 3
                  ? "rgba(248, 113, 113, 0.08)"
                  : "rgba(52, 211, 153, 0.08)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={movesRemaining <= 3 ? "#f87171" : "#34d399"}
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "var(--font-mono), monospace",
                color: movesRemaining <= 3 ? "#f87171" : "#34d399",
              }}
            >
              {movesRemaining}
            </span>
            <span style={{ fontSize: 10, color: "var(--color-muted)" }}>
              moves left
            </span>
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid rgba(251, 191, 36, 0.3)",
              background: "rgba(251, 191, 36, 0.08)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle
                cx="7"
                cy="7"
                r="5.5"
                stroke="#fbbf24"
                strokeWidth="1"
                fill="rgba(251, 191, 36, 0.15)"
              />
              <text
                x="7"
                y="10"
                textAnchor="middle"
                fill="#fbbf24"
                fontSize="8"
                fontWeight="bold"
              >
                G
              </text>
            </svg>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "var(--font-mono), monospace",
                color: "#fbbf24",
              }}
            >
              {goldReward}
            </span>
            <span style={{ fontSize: 10, color: "var(--color-muted)" }}>
              gold
            </span>
          </div>

          {bonusGold > 0 && (
            <div
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid rgba(251, 191, 36, 0.5)",
                background: "rgba(251, 191, 36, 0.12)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="#fbbf24" strokeWidth="1.5" fill="rgba(251, 191, 36, 0.25)" />
                <text x="7" y="10" textAnchor="middle" fill="#fbbf24" fontSize="7" fontWeight="bold">$</text>
              </svg>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "var(--font-mono), monospace",
                  color: "#fbbf24",
                }}
              >
                +{bonusGold}
              </span>
              <span style={{ fontSize: 10, color: "var(--color-muted)" }}>
                bonus
              </span>
            </div>
          )}

          {!atHub && (
            <button
              onClick={handleReturnToHub}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid rgba(168, 85, 247, 0.4)",
                background: "rgba(168, 85, 247, 0.1)",
                color: "#c084fc",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s ease",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#c084fc"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Return to Hub
              <span style={{ fontSize: 10, opacity: 0.7 }}>(-1 move)</span>
            </button>
          )}
        </div>
      )}

      {/* SVG Grid */}
      <div
        className="parkour-grid-container"
        style={{
          width: "100%",
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: 600,
          padding: "8px 0",
          borderRadius: 12,
          border: `1px solid ${theme.primary}20`,
          background: `${theme.primary}04`,
        }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          style={{
            width: "100%",
            minWidth: Math.min(viewWidth, 500),
            display: "block",
            userSelect: "none",
            touchAction: "none",
          }}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={() => {
            setDragging(false);
            setDragPos(null);
          }}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <defs>
            <filter
              id="parkour-glow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter
              id="parkour-node-glow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="parkour-fog" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0a0a0f" stopOpacity="0" />
              <stop offset="100%" stopColor="#0a0a0f" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Lane guidelines */}
          {Array.from({ length: grid.rows }).map((_, r) => {
            const y = rowY(r);
            return (
              <line
                key={`lane-${r}`}
                x1={PAD_X + COL_GAP - 20}
                y1={y}
                x2={PAD_X + (grid.cols - 1) * COL_GAP + 20}
                y2={y}
                stroke={`${theme.primary}10`}
                strokeWidth={1}
                strokeDasharray="4 8"
              />
            );
          })}

          {/* End zone — only visible when in range */}
          {endVisible && (
            <rect
              x={PAD_X + lastCol * COL_GAP + 16}
              y={PAD_Y - 20}
              width={8}
              height={totalHeight + 40}
              rx={4}
              fill="rgba(251, 191, 36, 0.12)"
              stroke="rgba(251, 191, 36, 0.25)"
              strokeWidth={1}
            />
          )}

          {/* Edges */}
          {edges.map(({ from, to }, i) => {
            const fromIsHub = isHubNode(from[0], from[1]);
            if (!fromIsHub && !isVisible(from[1])) return null;
            if (!isVisible(to[1])) return null;

            const fromPos = getNodePos(from[0], from[1]);
            const toPos = getNodePos(to[0], to[1]);
            const onPath = isEdgeOnPath(from, to);
            return (
              <line
                key={`edge-${i}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={onPath ? "#34d399" : `${theme.primary}25`}
                strokeWidth={onPath ? 3 : 1.5}
                strokeLinecap="round"
                className={onPath ? "parkour-edge-active" : ""}
              />
            );
          })}

          {/* Drag line */}
          {dragging && dragPos && currentPos && (
            <line
              x1={getNodePos(currentPos[0], currentPos[1]).x}
              y1={getNodePos(currentPos[0], currentPos[1]).y}
              x2={dragPos.x}
              y2={dragPos.y}
              stroke={`${theme.primary}50`}
              strokeWidth={2}
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          )}

          {/* Nodes */}
          {Array.from({ length: grid.rows }).map((_, r) =>
            Array.from({ length: grid.cols }).map((_, c) => {
              if (!grid.nodes[r][c]) return null;
              const nodeIsHub = isHubNode(r, c);
              if (!nodeIsHub && !isVisible(c)) return null;

              const pos = getNodePos(r, c);
              const isCurrent =
                currentPos[0] === r && currentPos[1] === c;
              const onPathNode = isOnPath(r, c);
              const isTarget = isValidTarget(r, c);
              const isEnd = c === lastCol;

              const nodeIsGold = isGoldNode(r, c);
              const goldCollected = nodeIsGold && onPathNode;

              let fillColor = `${theme.primary}15`;
              let strokeColor = `${theme.primary}40`;
              let radius = nodeIsHub ? HUB_RADIUS : NODE_RADIUS;
              let strokeW = 1.5;

              if (nodeIsHub) {
                fillColor = "rgba(168, 85, 247, 0.2)";
                strokeColor = "rgba(168, 85, 247, 0.7)";
                strokeW = 2.5;
              }

              if (isCurrent) {
                fillColor = nodeIsHub
                  ? "rgba(168, 85, 247, 0.35)"
                  : `${theme.primary}35`;
                strokeColor = nodeIsHub ? "#a855f7" : theme.primary;
                radius = (nodeIsHub ? HUB_RADIUS : NODE_RADIUS) + 2;
                strokeW = 2.5;
              } else if (isTarget) {
                fillColor = "rgba(52, 211, 153, 0.25)";
                strokeColor = "#34d399";
                radius = NODE_RADIUS + 1;
                strokeW = 2;
              } else if (onPathNode && !nodeIsHub) {
                fillColor = "rgba(52, 211, 153, 0.15)";
                strokeColor = "rgba(52, 211, 153, 0.5)";
              } else if (isEnd) {
                fillColor = "rgba(251, 191, 36, 0.15)";
                strokeColor = "rgba(251, 191, 36, 0.5)";
              } else if (nodeIsGold) {
                fillColor = "rgba(251, 191, 36, 0.18)";
                strokeColor = "rgba(251, 191, 36, 0.6)";
                strokeW = 2;
              }

              const clickable = isTarget;

              return (
                <g key={`node-${r}-${c}`}>
                  {/* Glow for targets */}
                  {isTarget && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={radius + 6}
                      fill="rgba(52, 211, 153, 0.08)"
                      className="parkour-node-pulse"
                    />
                  )}

                  {/* Hub glow */}
                  {nodeIsHub && isCurrent && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={HUB_RADIUS + 8}
                      fill="rgba(168, 85, 247, 0.06)"
                      className="parkour-hub-pulse"
                    />
                  )}

                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeW}
                    style={{
                      cursor: clickable ? "pointer" : "default",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => {
                      if (isTarget) handleMove(r, c);
                    }}
                  />

                  {/* Hub label */}
                  {nodeIsHub && (
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fill="#c084fc"
                      fontSize="10"
                      fontWeight="bold"
                      style={{ pointerEvents: "none" }}
                    >
                      HUB
                    </text>
                  )}

                  {/* Explorer icon on current node */}
                  {isCurrent && !nodeIsHub && (
                    <g
                      style={{
                        cursor: movesRemaining > 0 ? "grab" : "default",
                      }}
                      onMouseDown={handleDragStart}
                      onTouchStart={handleDragStart}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={NODE_RADIUS + 6}
                        fill="transparent"
                      />
                      <circle
                        cx={pos.x}
                        cy={pos.y - 4}
                        r={4}
                        fill={theme.primary}
                        opacity={0.9}
                      />
                      <path
                        d={`M${pos.x - 4} ${pos.y + 1} L${pos.x + 4} ${pos.y + 1} L${pos.x + 3} ${pos.y + 10} L${pos.x - 3} ${pos.y + 10}Z`}
                        fill={theme.primary}
                        opacity={0.7}
                      />
                    </g>
                  )}

                  {/* Explorer icon on hub when current */}
                  {isCurrent && nodeIsHub && (
                    <g>
                      <circle
                        cx={pos.x}
                        cy={pos.y - 22}
                        r={4}
                        fill="#c084fc"
                        opacity={0.9}
                      />
                      <path
                        d={`M${pos.x - 4} ${pos.y - 17} L${pos.x + 4} ${pos.y - 17} L${pos.x + 3} ${pos.y - 8} L${pos.x - 3} ${pos.y - 8}Z`}
                        fill="#c084fc"
                        opacity={0.7}
                      />
                    </g>
                  )}

                  {/* End marker */}
                  {isEnd && !isCurrent && (
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fill="#fbbf24"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      G
                    </text>
                  )}

                  {/* Gold node marker */}
                  {nodeIsGold && !isCurrent && !isEnd && (
                    goldCollected ? (
                      <text
                        x={pos.x}
                        y={pos.y + 4}
                        textAnchor="middle"
                        fill="rgba(251, 191, 36, 0.35)"
                        fontSize="9"
                        fontWeight="bold"
                        style={{ pointerEvents: "none" }}
                      >
                        $
                      </text>
                    ) : (
                      <>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={radius + 4}
                          fill="rgba(251, 191, 36, 0.06)"
                          className="parkour-node-pulse"
                          pointerEvents="none"
                        />
                        <text
                          x={pos.x}
                          y={pos.y + 4}
                          textAnchor="middle"
                          fill="#fbbf24"
                          fontSize="9"
                          fontWeight="bold"
                          style={{ pointerEvents: "none" }}
                        >
                          $
                        </text>
                      </>
                    )
                  )}
                </g>
              );
            }),
          )}

          {/* Fog overlay */}
          {maxVisibleCol < lastCol &&
            (() => {
              const fogStartX = PAD_X + (maxVisibleCol - 1) * COL_GAP;
              const fogWidth = COL_GAP * 2;
              const solidX = fogStartX + fogWidth;
              return (
                <>
                  <rect
                    x={fogStartX}
                    y={0}
                    width={fogWidth}
                    height={viewHeight}
                    fill="url(#parkour-fog)"
                    pointerEvents="none"
                  />
                  <rect
                    x={solidX}
                    y={0}
                    width={Math.max(0, viewWidth - solidX)}
                    height={viewHeight}
                    fill="#0a0a0f"
                    fillOpacity={0.95}
                    pointerEvents="none"
                  />
                </>
              );
            })()}
        </svg>
      </div>

      {/* Victory */}
      {phase === "won" && (
        <div
          className="animate-fade-in"
          style={{ textAlign: "center", marginTop: 20 }}
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            style={{ margin: "0 auto 12px" }}
          >
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="#4ade80"
              strokeWidth="2"
              fill="rgba(74, 222, 128, 0.1)"
            />
            <path
              d="M18 28l6 6 14-14"
              stroke="#4ade80"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#4ade80",
              marginBottom: 8,
            }}
          >
            Parkour Complete!
          </h3>
          <p
            style={{
              fontSize: 12,
              color: "var(--color-muted)",
              marginBottom: 16,
            }}
          >
            You navigated the course with {movesRemaining} moves to spare!
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid rgba(251, 191, 36, 0.3)",
              background: "rgba(251, 191, 36, 0.08)",
              marginBottom: 16,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="#fbbf24"
                strokeWidth="1.5"
                fill="rgba(251, 191, 36, 0.15)"
              />
              <text
                x="10"
                y="14"
                textAnchor="middle"
                fill="#fbbf24"
                fontSize="10"
                fontWeight="bold"
              >
                G
              </text>
            </svg>
            <span
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: "var(--font-mono), monospace",
                color: "#fbbf24",
              }}
            >
              +{goldReward + bonusGold}
            </span>
            <span style={{ fontSize: 12, color: "#fbbf24" }}>Gold</span>
            {bonusGold > 0 && (
              <span style={{ fontSize: 10, color: "rgba(251, 191, 36, 0.6)" }}>
                ({goldReward} + {bonusGold} bonus)
              </span>
            )}
          </div>

          <div>
            <button
              onClick={() => onParkourVictory(goldReward + bonusGold)}
              className="btn-stone px-8 py-2.5 text-sm font-semibold uppercase tracking-wider"
              style={{ borderColor: `${theme.primary}40` }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Defeat */}
      {phase === "lost" && (
        <div
          className="animate-fade-in"
          style={{ textAlign: "center", marginTop: 20 }}
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
            style={{ margin: "0 auto 12px" }}
          >
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="#f87171"
              strokeWidth="2"
              fill="rgba(248, 113, 113, 0.1)"
            />
            <path
              d="M20 20l16 16M36 20l-16 16"
              stroke="#f87171"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <h3
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#f87171",
              marginBottom: 8,
            }}
          >
            Out of Moves!
          </h3>
          <p
            style={{
              fontSize: 12,
              color: "var(--color-muted)",
              marginBottom: 4,
            }}
          >
            You couldn&apos;t reach the end of the course.
          </p>
          <p
            style={{
              fontSize: 14,
              color: "#f87171",
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            -{hpLoss} HP
          </p>

          <button
            onClick={() => onParkourDefeat(hpLoss)}
            className="btn-stone px-8 py-2.5 text-sm font-semibold uppercase tracking-wider"
            style={{ borderColor: "rgba(248, 113, 113, 0.3)" }}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
