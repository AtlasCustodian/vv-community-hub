export interface GridGenerator {
  id: string;
  name: string;
  health: number;
  x: number;
  y: number;
  assignedUsers: number;
}

export interface GridConnection {
  from: string;
  to: string;
  health: number;
}

export const gridGenerators: GridGenerator[] = [
  { id: "gen-01", name: "Gen-01", health: 94, x: 400, y: 80, assignedUsers: 47 },
  { id: "gen-02", name: "Gen-02", health: 87, x: 230, y: 170, assignedUsers: 52 },
  { id: "gen-03", name: "Gen-03", health: 72, x: 570, y: 170, assignedUsers: 38 },
  { id: "gen-04", name: "Gen-04", health: 96, x: 120, y: 290, assignedUsers: 61 },
  { id: "gen-05", name: "Gen-05", health: 68, x: 400, y: 270, assignedUsers: 44 },
  { id: "gen-06", name: "Gen-06", health: 91, x: 680, y: 290, assignedUsers: 55 },
  { id: "gen-07", name: "Gen-07", health: 85, x: 80, y: 420, assignedUsers: 33 },
  { id: "gen-08", name: "Gen-08", health: 45, x: 280, y: 400, assignedUsers: 71 },
  { id: "gen-09", name: "Gen-09", health: 78, x: 520, y: 400, assignedUsers: 49 },
  { id: "gen-10", name: "Gen-10", health: 93, x: 720, y: 420, assignedUsers: 40 },
  { id: "gen-11", name: "Gen-11", health: 62, x: 180, y: 530, assignedUsers: 58 },
  { id: "gen-12", name: "Gen-12", health: 88, x: 400, y: 520, assignedUsers: 36 },
  { id: "gen-13", name: "Gen-13", health: 55, x: 620, y: 530, assignedUsers: 42 },
];

export const gridConnections: GridConnection[] = [
  // Central hub connections
  { from: "gen-01", to: "gen-02", health: 90 },
  { from: "gen-01", to: "gen-03", health: 85 },
  { from: "gen-01", to: "gen-05", health: 78 },
  // Left branch
  { from: "gen-02", to: "gen-04", health: 92 },
  { from: "gen-02", to: "gen-05", health: 65 },
  { from: "gen-04", to: "gen-07", health: 88 },
  { from: "gen-07", to: "gen-08", health: 42 },
  { from: "gen-07", to: "gen-11", health: 70 },
  // Right branch
  { from: "gen-03", to: "gen-06", health: 94 },
  { from: "gen-03", to: "gen-05", health: 60 },
  { from: "gen-06", to: "gen-09", health: 82 },
  { from: "gen-06", to: "gen-10", health: 91 },
  // Bottom connections
  { from: "gen-08", to: "gen-11", health: 55 },
  { from: "gen-08", to: "gen-12", health: 48 },
  { from: "gen-09", to: "gen-12", health: 76 },
  { from: "gen-09", to: "gen-13", health: 58 },
  { from: "gen-10", to: "gen-13", health: 85 },
  { from: "gen-11", to: "gen-12", health: 72 },
  { from: "gen-12", to: "gen-13", health: 66 },
  // Cross connections
  { from: "gen-04", to: "gen-08", health: 75 },
  { from: "gen-05", to: "gen-08", health: 50 },
  { from: "gen-05", to: "gen-09", health: 68 },
];

export function getConnectionColor(health: number): string {
  if (health >= 75) return "#10b981";
  if (health >= 50) return "#fbbf24";
  return "#dc2626";
}

export function getHealthColor(health: number): string {
  if (health >= 80) return "#10b981";
  if (health >= 60) return "#fbbf24";
  if (health >= 40) return "#f97316";
  return "#dc2626";
}
