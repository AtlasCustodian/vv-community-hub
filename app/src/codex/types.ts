/**
 * Vantheon Codex — data types for factions and standings.
 * Replace or extend when connecting to a real Codex API or Notion.
 */

export interface FactionStats {
  population: number
  territory: number
  power: number
  influence: number
  cohesion: number
}

/** Extended metrics (0–100) and height; inferred from faction role, not editable in Codex. */
export interface FactionExtended {
  income: number
  avgBeauty: number
  avgHeight: string
}

export interface Faction {
  id: string
  name: string
  shortName: string
  color: string
  stats: FactionStats
  rank: number
  /** One-line summary from Codex (e.g. "The Marshalls are the most militarily powerful..."). */
  summary?: string
  /** Inferred metrics; display-only. */
  extended?: FactionExtended
}

export type StatKey = keyof FactionStats

/** Weights for composite Faction Standing (population × 0.2, territory × 0.75, power × 0.75, influence × 1.5, cohesion × 1). */
const STANDING_WEIGHTS = {
  population: 0.2,
  territory: 0.75,
  power: 0.75,
  influence: 1.5,
  cohesion: 1,
} as const

const WEIGHT_SUM =
  STANDING_WEIGHTS.population +
  STANDING_WEIGHTS.territory +
  STANDING_WEIGHTS.power +
  STANDING_WEIGHTS.influence +
  STANDING_WEIGHTS.cohesion

/** Compute Faction Standing 0–100 from stats using weighted average. */
export function computeFactionStanding(stats: FactionStats): number {
  const raw =
    stats.population * STANDING_WEIGHTS.population +
    stats.territory * STANDING_WEIGHTS.territory +
    stats.power * STANDING_WEIGHTS.power +
    stats.influence * STANDING_WEIGHTS.influence +
    stats.cohesion * STANDING_WEIGHTS.cohesion
  return Math.round((raw / WEIGHT_SUM) * 100) / 100
}

export interface StandingsUpdate {
  factionId: string
  stat: StatKey
  value: number
  /** Optional: "set" | "add" | "subtract". Default "set". */
  mode?: 'set' | 'add' | 'subtract'
}

export interface CodexConnectionConfig {
  baseUrl?: string
  apiKey?: string
  /** e.g. "notion" for Notion database */
  source?: 'mock' | 'api' | 'notion'
}
