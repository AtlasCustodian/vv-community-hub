import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Faction, StatKey } from '@/codex/types'

const STAT_LABELS: Record<StatKey, string> = {
  population: 'Population',
  territory: 'Territory',
  power: 'Power',
  influence: 'Influence',
  cohesion: 'Cohesion',
}

interface StatChartProps {
  factions: Faction[]
  stat: StatKey
}

export function StatChart({ factions, stat }: StatChartProps) {
  const data = factions.map((f) => ({
    name: f.shortName,
    value: f.stats[stat],
    color: f.color,
  }))

  return (
    <div className="stat-chart">
      <h3 className="chart-title">{STAT_LABELS[stat]}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
          <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={12} width={72} tickLine={false} />
          <Tooltip
            contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
            labelStyle={{ color: 'var(--text)' }}
            formatter={(value: number) => [value.toLocaleString(), STAT_LABELS[stat]]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <style>{`
        .stat-chart { background: var(--bg-panel); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem; }
        .chart-title { margin: 0 0 0.5rem 0; font-size: 0.9rem; font-weight: 600; color: var(--text-muted); }
      `}</style>
    </div>
  )
}
