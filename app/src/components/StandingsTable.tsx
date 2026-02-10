import type { Faction, StatKey } from '@/codex/types'

const STAT_LABELS: Record<StatKey, string> = {
  population: 'Population',
  territory: 'Territory',
  power: 'Power',
  influence: 'Influence',
  cohesion: 'Cohesion',
}

interface StandingsTableProps {
  factions: Faction[]
  stat?: StatKey
}

export function StandingsTable({ factions, stat = 'power' }: StandingsTableProps) {
  const maxVal = Math.max(...factions.map((f) => f.stats[stat]), 1)

  return (
    <div className="standings-table">
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Faction</th>
            <th>{STAT_LABELS[stat]}</th>
            <th className="bar-col">Standing</th>
          </tr>
        </thead>
        <tbody>
          {factions.map((f) => (
            <tr key={f.id}>
              <td className="rank">#{f.rank}</td>
              <td>
                <span className="faction-name" style={{ borderLeftColor: f.color }}>
                  {f.name}
                </span>
              </td>
              <td className="stat-num">{f.stats[stat].toLocaleString()}</td>
              <td className="bar-col">
                <div className="bar-wrap">
                  <div
                    className="bar"
                    style={{
                      width: `${(f.stats[stat] / maxVal) * 100}%`,
                      backgroundColor: f.color,
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .standings-table { overflow-x: auto; }
        .standings-table table { width: 100%; border-collapse: collapse; }
        .standings-table th, .standings-table td { padding: 0.6rem 0.75rem; text-align: left; }
        .standings-table th { color: var(--text-muted); font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .standings-table tbody tr { border-top: 1px solid var(--border); }
        .standings-table .rank { font-family: var(--font-mono); color: var(--text-muted); }
        .standings-table .faction-name { padding-left: 0.5rem; border-left: 3px solid; }
        .standings-table .stat-num { font-family: var(--font-mono); font-weight: 500; }
        .standings-table .bar-col { width: 40%; min-width: 120px; }
        .standings-table .bar-wrap { height: 8px; background: var(--bg-elevated); border-radius: 4px; overflow: hidden; }
        .standings-table .bar { height: 100%; border-radius: 4px; min-width: 4px; transition: width 0.3s ease; }
      `}</style>
    </div>
  )
}
