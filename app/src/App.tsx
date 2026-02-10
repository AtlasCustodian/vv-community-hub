import { useEffect, useState, useCallback } from 'react'
import { fetchStandings, applyStandingsUpdate, getDefaultConfig } from '@/codex/client'
import type { Faction, StandingsUpdate, StatKey } from '@/codex/types'

const STAT_TAB_LABELS: Record<StatKey, string> = {
  population: 'Population',
  territory: 'Territory',
  power: 'Power',
  influence: 'Influence',
  cohesion: 'Cohesion',
}
import { StandingsTable } from '@/components/StandingsTable'
import { StatChart } from '@/components/StatChart'
import { UpdateStandingForm } from '@/components/UpdateStandingForm'
import { TextCommandInput } from '@/components/TextCommandInput'
import { FactionSummaries } from '@/components/FactionSummaries'
import { FactionStandingSection } from '@/components/FactionStandingSection'
import { Link } from 'react-router-dom'

export default function App() {
  const [factions, setFactions] = useState<Faction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statView, setStatView] = useState<StatKey>('power')
  const config = getDefaultConfig()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchStandings(config)
      setFactions(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load standings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleUpdate = useCallback(
    async (update: StandingsUpdate) => {
      try {
        const next = await applyStandingsUpdate(update, factions, config)
        setFactions(next)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Update failed')
      }
    },
    [factions]
  )

  if (loading && factions.length === 0) {
    return (
      <div className="app-shell">
        <header className="app-header">
          <div className="app-header-row">
            <div>
              <h1>Vantheon Codex</h1>
              <p className="tagline">The Island — Faction Standings</p>
            </div>
            <Link to="/island" className="btn-island-3d">
              View 3D Island
            </Link>
          </div>
        </header>
        <main className="app-main">
          <p className="loading">Loading standings…</p>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-row">
          <div>
            <h1>Vantheon Codex</h1>
            <p className="tagline">The Island — Faction Standings</p>
          </div>
          <Link to="/island" className="btn-island-3d">
            View 3D Island
          </Link>
        </div>
      </header>

      <main className="app-main">
        {error && (
          <div className="banner error">
            {error}
            <button type="button" onClick={() => setError(null)} aria-label="Dismiss">
              ×
            </button>
          </div>
        )}

        <FactionSummaries factions={factions} />

        <FactionStandingSection factions={factions} />

        <section className="controls">
          <div className="control-block">
            <TextCommandInput factions={factions} onUpdate={handleUpdate} disabled={loading} />
          </div>
          <div className="control-block form-block">
            <UpdateStandingForm factions={factions} onUpdate={handleUpdate} disabled={loading} />
          </div>
        </section>

        <section className="stat-tabs">
          {(['population', 'territory', 'power', 'influence', 'cohesion'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={`tab ${statView === s ? 'active' : ''}`}
              onClick={() => setStatView(s)}
            >
              {STAT_TAB_LABELS[s]}
            </button>
          ))}
        </section>

        <section className="standings-section">
          <StandingsTable factions={factions} stat={statView} />
        </section>

        <section className="charts-section">
          <StatChart factions={factions} stat="population" />
          <StatChart factions={factions} stat="territory" />
          <StatChart factions={factions} stat="power" />
          <StatChart factions={factions} stat="influence" />
          <StatChart factions={factions} stat="cohesion" />
        </section>
      </main>
    </div>
  )
}
