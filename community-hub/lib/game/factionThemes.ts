import type { FactionId, FactionTheme } from "@/types/game";

export const FACTION_THEMES: Record<FactionId, FactionTheme> = {
  fire: {
    primary: "#f97316",
    secondary: "#ea580c",
    gradientFrom: "#f97316",
    gradientTo: "#dc2626",
    name: "The Marshalls",
    shortName: "Fire",
    emoji: "🔥",
    tagline: "Nothing works without us.",
  },
  earth: {
    primary: "#c4a35a",
    secondary: "#a08040",
    gradientFrom: "#c4a35a",
    gradientTo: "#8b6914",
    name: "The Ironlord",
    shortName: "Earth",
    emoji: "🏛️",
    tagline: "The island is more than survival.",
  },
  water: {
    primary: "#3b82f6",
    secondary: "#2563eb",
    gradientFrom: "#3b82f6",
    gradientTo: "#1d4ed8",
    name: "Bluecrest",
    shortName: "Water",
    emoji: "🌊",
    tagline: "We face the Veil so you sleep easy.",
  },
  wood: {
    primary: "#22c55e",
    secondary: "#16a34a",
    gradientFrom: "#22c55e",
    gradientTo: "#15803d",
    name: "The Stewards",
    shortName: "Wood",
    emoji: "🌿",
    tagline: "The quota holds because we make it hold.",
  },
  metal: {
    primary: "#94a3b8",
    secondary: "#64748b",
    gradientFrom: "#94a3b8",
    gradientTo: "#475569",
    name: "The Artificers",
    shortName: "Metal",
    emoji: "⚗️",
    tagline: "Knowledge is the only permanent resource.",
  },
};

export const ALL_FACTION_IDS: FactionId[] = [
  "fire",
  "earth",
  "water",
  "wood",
  "metal",
];

export function pickRandomFactions(count: number): FactionId[] {
  const shuffled = [...ALL_FACTION_IDS];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export function pickRandomFactionsExcluding(
  count: number,
  exclude: FactionId
): FactionId[] {
  const available = ALL_FACTION_IDS.filter((id) => id !== exclude);
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }
  return available.slice(0, count);
}
