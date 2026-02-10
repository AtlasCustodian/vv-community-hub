/**
 * Vantheon Codex client.
 * Fetches faction standings and sends updates.
 * Swap implementation for real API or Notion when ready.
 */

import type { Faction, StandingsUpdate, CodexConnectionConfig } from './types'
import { computeFactionStanding } from './types'

/**
 * The five factions of the Island (Vantheon-verse).
 * Standings reflect pseudo-equilibrium: no one thrives or fails outright.
 * Rank is determined by Faction Standing (weighted composite of population, territory, power, influence, cohesion).
 * Extended metrics (income, avgBeauty, avgHeight) are Codex-consistent inferences.
 */
/**
 * Faction stats (0–100) from CODEX_FACTION_SUMMARY:
 * Population (Earth 5k=100, others 1.25k=25), Territory, Power (military/raw), Influence, Cohesion.
 */
const MOCK_FACTIONS: Faction[] = [
  {
    id: 'fire',
    name: 'Fire / Marshalls',
    shortName: 'Fire',
    color: '#f97316',
    stats: { population: 25, territory: 45, power: 100, influence: 58, cohesion: 95 },
    rank: 1,
    summary:
      'The Marshalls are the most militarily powerful and internally united faction. They hold less land than Earth or Wood but project force and discipline; their cohesion makes them reliable in conflict and negotiation.',
    extended: { income: 58, avgBeauty: 68, avgHeight: "5′10″" },
  },
  {
    id: 'earth',
    name: 'Earth / Ironlord',
    shortName: 'Earth',
    color: '#c4a35a',
    stats: { population: 100, territory: 90, power: 65, influence: 95, cohesion: 68 },
    rank: 2,
    summary:
      'The Ironlords control the most physical territory and wield the most influence (voting power and sway). They are the land-holding, establishment faction—strong and well-connected, with solid but not maximal cohesion.',
    extended: { income: 72, avgBeauty: 70, avgHeight: "5′11″" },
  },
  {
    id: 'water',
    name: 'Water / Bluecrest',
    shortName: 'Water',
    color: '#3b82f6',
    stats: { population: 25, territory: 70, power: 78, influence: 62, cohesion: 62 },
    rank: 3,
    summary:
      'Bluecrest sits in the middle of the pack on most Codex stats. They hold substantial territory (especially coastal and riverine) and have moderate influence and cohesion—adaptable and fluid rather than dominant in any single dimension.',
    extended: { income: 70, avgBeauty: 75, avgHeight: "5′8″" },
  },
  {
    id: 'wood',
    name: 'Wood / Stewards',
    shortName: 'Wood',
    color: '#22c55e',
    stats: { population: 25, territory: 88, power: 50, influence: 52, cohesion: 88 },
    rank: 4,
    summary:
      'The Stewards are the caretakers of land and growth—high territory and high cohesion, with lower raw power and influence. They are the most "communal" and territorially rooted of the five.',
    extended: { income: 55, avgBeauty: 66, avgHeight: "5′9″" },
  },
  {
    id: 'metal',
    name: 'Metal / Artificers',
    shortName: 'Metal',
    color: '#94a3b8',
    stats: { population: 25, territory: 35, power: 42, influence: 82, cohesion: 42 },
    rank: 5,
    summary:
      'The Artificers are the craft and trade faction—lower territory and the lowest cohesion, but strong influence through commerce and expertise. They punch above their weight in councils and deals despite smaller land and less internal unity.',
    extended: { income: 82, avgBeauty: 64, avgHeight: "5′7″" },
  },
]

function rankFactions(factions: Faction[]): Faction[] {
  const byStanding = [...factions].sort(
    (a, b) => computeFactionStanding(b.stats) - computeFactionStanding(a.stats)
  )
  return byStanding.map((f, i) => ({ ...f, rank: i + 1 }))
}

export async function fetchStandings(_config?: CodexConnectionConfig): Promise<Faction[]> {
  // TODO: replace with real API call, e.g.:
  // const res = await fetch(`${config.baseUrl}/standings`, { headers: { Authorization: `Bearer ${config.apiKey}` } })
  // return res.json()
  await new Promise((r) => setTimeout(r, 300))
  return rankFactions(MOCK_FACTIONS)
}

export async function applyStandingsUpdate(
  update: StandingsUpdate,
  current: Faction[],
  _config?: CodexConnectionConfig
): Promise<Faction[]> {
  // TODO: POST to Codex API; for now we apply in-memory and re-rank
  const mode = update.mode ?? 'set'
  const next = current.map((f) => {
    if (f.id !== update.factionId) return f
    const prev = f.stats[update.stat]
    let value: number
    if (mode === 'set') value = update.value
    else if (mode === 'add') value = prev + update.value
    else value = prev - update.value
    return {
      ...f,
      stats: { ...f.stats, [update.stat]: Math.max(0, Math.round(value)) },
    }
  })
  return rankFactions(next)
}

export function getDefaultConfig(): CodexConnectionConfig {
  return { source: 'mock' }
}
