import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Faction } from '@/codex/types'
import { computeFactionStanding } from '@/codex/types'

interface FactionStandingSectionProps {
  factions: Faction[]
}

export function FactionStandingSection({ factions }: FactionStandingSectionProps) {
  const data = factions
    .map((f) => ({
      name: f.shortName,
      value: computeFactionStanding(f.stats),
      color: f.color,
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <section className="faction-standing-section">
      <h2 className="standing-section-title">Faction Standing</h2>
      <p className="standing-section-desc">
        Composite score (0–100): Population ×0.2, Territory ×0.75, Power ×0.75, Influence ×1.5, Cohesion ×1.
      </p>
      <div className="standing-chart-wrap">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
            <XAxis type="number" domain={[0, 100]} stroke="var(--text-muted)" fontSize={11} tickLine={false} />
            <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={12} width={72} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'var(--text)' }}
              formatter={(value: number) => [value.toFixed(1), 'Faction Standing']}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={32}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <style>{`
        .faction-standing-section { margin-bottom: 2rem; }
        .standing-section-title { margin: 0 0 0.35rem 0; font-size: 1.1rem; font-weight: 600; color: var(--text); }
        .standing-section-desc { margin: 0 0 1rem 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; }
        .standing-chart-wrap { background: var(--bg-panel); border: 1px solid var(--border); border-radius: var(--radius); padding: 1rem; }
      `}</style>
    </section>
  )
}
