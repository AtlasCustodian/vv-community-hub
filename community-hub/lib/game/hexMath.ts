import type { HexCoord, HexTile } from "@/types/game";

const AXIAL_DIRECTIONS: HexCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export function hexKey(coord: HexCoord): string {
  return `${coord.q},${coord.r}`;
}

export function parseHexKey(key: string): HexCoord {
  const [q, r] = key.split(",").map(Number);
  return { q, r };
}

export function hexEquals(a: HexCoord, b: HexCoord): boolean {
  return a.q === b.q && a.r === b.r;
}

export function hexDistance(a: HexCoord, b: HexCoord): number {
  return (
    (Math.abs(a.q - b.q) +
      Math.abs(a.q + a.r - b.q - b.r) +
      Math.abs(a.r - b.r)) /
    2
  );
}

export function hexNeighbors(coord: HexCoord): HexCoord[] {
  return AXIAL_DIRECTIONS.map((d) => ({
    q: coord.q + d.q,
    r: coord.r + d.r,
  }));
}

export function generateBoard(): HexTile[] {
  const tiles: HexTile[] = [];
  const RADIUS = 3;

  for (let q = -RADIUS; q <= RADIUS; q++) {
    for (let r = -RADIUS; r <= RADIUS; r++) {
      const s = -q - r;
      if (Math.abs(s) > RADIUS) continue;

      const dist = hexDistance({ q, r }, { q: 0, r: 0 });
      let pointValue = 0;
      if (dist === 0) pointValue = 5;
      else if (dist === 1) pointValue = 2;
      else if (dist === 2) pointValue = 1;

      tiles.push({
        coord: { q, r },
        pointValue,
        occupant: null,
      });
    }
  }

  return tiles;
}

/**
 * Three spawn zones at triangle vertices of the hex grid.
 * Player 0 (top): upper edge hexes
 * Player 1 (bottom-left): lower-left edge hexes
 * Player 2 (bottom-right): lower-right edge hexes
 */
export function getSpawnZones(): HexCoord[][] {
  return [
    // Player 0 - top
    [
      { q: -1, r: -2 },
      { q: 0, r: -3 },
      { q: 1, r: -3 },
    ],
    // Player 1 - bottom-left
    [
      { q: -3, r: 2 },
      { q: -3, r: 3 },
      { q: -2, r: 3 },
    ],
    // Player 2 - bottom-right
    [
      { q: 2, r: 1 },
      { q: 3, r: 0 },
      { q: 3, r: -1 },
    ],
  ];
}

export function isValidHex(coord: HexCoord, board: HexTile[]): boolean {
  return board.some((t) => hexEquals(t.coord, coord));
}

export function getTile(coord: HexCoord, board: HexTile[]): HexTile | undefined {
  return board.find((t) => hexEquals(t.coord, coord));
}

/**
 * Convert axial hex coordinates to pixel position for SVG rendering.
 * Flat-top hexagons.
 */
export function hexToPixel(
  coord: HexCoord,
  size: number
): { x: number; y: number } {
  const x = size * (3 / 2) * coord.q;
  const y = size * (Math.sqrt(3) / 2 * coord.q + Math.sqrt(3) * coord.r);
  return { x, y };
}

export function getHexPoints(size: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    points.push(
      `${size * Math.cos(angle)},${size * Math.sin(angle)}`
    );
  }
  return points.join(" ");
}
