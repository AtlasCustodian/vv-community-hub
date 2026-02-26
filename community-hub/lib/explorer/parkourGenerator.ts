import type { ParkourGrid } from "@/types/explorer/vantheon";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function nodeKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function parseKey(key: string): [number, number] {
  const [r, c] = key.split(",").map(Number);
  return [r, c];
}

function isHub(r: number, c: number, hubRow: number): boolean {
  return r === hubRow && c === 0;
}

function addEdge(adj: Record<string, string[]>, a: string, b: string): void {
  if (!adj[a]) adj[a] = [];
  if (!adj[b]) adj[b] = [];
  if (!adj[a].includes(b)) adj[a].push(b);
  if (!adj[b].includes(a)) adj[b].push(a);
}

function hubReachesExit(
  adj: Record<string, string[]>,
  hubKey: string,
  lastCol: number,
): boolean {
  const queue: string[] = [hubKey];
  const visited = new Set<string>([hubKey]);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const [, col] = parseKey(current);
    if (col === lastCol) return true;

    for (const neighbor of adj[current] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return false;
}

export function generateParkourGrid(floor: number): ParkourGrid {
  const pathCount = Math.min(3 + floor, 10);
  const totalRows = pathCount;
  const cols = floor + randInt(8, 14);

  const hubRow = Math.floor(pathCount / 2);
  const hubNode: [number, number] = [hubRow, 0];

  const nodes: boolean[][] = Array.from({ length: totalRows }, () =>
    Array(cols).fill(false),
  );

  nodes[hubRow][0] = true;

  const exitPathCount = pathCount >= 7 ? 2 : 1;
  const exitPaths = new Set<number>();
  while (exitPaths.size < exitPathCount) {
    exitPaths.add(randInt(0, pathCount - 1));
  }

  for (let p = 0; p < pathCount; p++) {
    const isExit = exitPaths.has(p);
    const pathEndCol = isExit
      ? cols - 1
      : randInt(
          Math.max(4, Math.floor(cols * 0.3)),
          Math.floor(cols * 0.7),
        );

    for (let c = 1; c <= pathEndCol; c++) {
      nodes[p][c] = true;
    }

    // Remove ~25% of interior nodes to create gaps that force cross-path movement
    for (let c = 2; c < pathEndCol; c++) {
      if (Math.random() < 0.25) {
        nodes[p][c] = false;
      }
    }

    if (isExit) {
      nodes[p][cols - 1] = true;
    }
  }

  const adj: Record<string, string[]> = {};

  const hubKey = nodeKey(hubRow, 0);
  for (let r = 0; r < totalRows; r++) {
    if (nodes[r][1]) {
      addEdge(adj, hubKey, nodeKey(r, 1));
    }
  }

  for (let r = 0; r < totalRows; r++) {
    for (let c = 1; c < cols; c++) {
      if (!nodes[r][c]) continue;
      const key = nodeKey(r, c);

      if (c + 1 < cols) {
        if (nodes[r][c + 1]) addEdge(adj, key, nodeKey(r, c + 1));
        if (r + 1 < totalRows && nodes[r + 1][c + 1] && Math.random() < 0.5)
          addEdge(adj, key, nodeKey(r + 1, c + 1));
        if (r - 1 >= 0 && nodes[r - 1][c + 1] && Math.random() < 0.5)
          addEdge(adj, key, nodeKey(r - 1, c + 1));
      }
    }
  }

  if (!hubReachesExit(adj, hubKey, cols - 1)) {
    return generateParkourGrid(floor);
  }

  const goldNodes: Record<string, number> = {};
  const candidateKeys: string[] = [];
  for (let r = 0; r < totalRows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!nodes[r][c]) continue;
      if (isHub(r, c, hubRow)) continue;
      if (c === cols - 1) continue;
      candidateKeys.push(nodeKey(r, c));
    }
  }

  const goldCount = Math.max(1, Math.floor(candidateKeys.length / 20));
  const goldValue = floor * randInt(1, 2);
  for (let i = candidateKeys.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [candidateKeys[i], candidateKeys[j]] = [candidateKeys[j], candidateKeys[i]];
  }
  for (let i = 0; i < goldCount && i < candidateKeys.length; i++) {
    goldNodes[candidateKeys[i]] = goldValue;
  }

  return {
    rows: totalRows,
    cols,
    nodes,
    adjacency: adj,
    hubNode,
    pathCount,
    goldNodes,
  };
}

export function getConnectedNodes(
  grid: ParkourGrid,
  row: number,
  col: number,
): [number, number][] {
  const key = nodeKey(row, col);
  const neighbors = grid.adjacency[key] || [];
  return neighbors.map(parseKey);
}

export function getStartNodes(grid: ParkourGrid): [number, number][] {
  return [grid.hubNode];
}

export function computeParkourGoldReward(floor: number): number {
  return floor * randInt(2, 5);
}

export function computeParkourHPLoss(colsRemaining: number): number {
  return Math.max(1, Math.floor(colsRemaining / 2) + 1);
}
