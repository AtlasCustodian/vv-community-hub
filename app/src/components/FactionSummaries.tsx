import { useState } from 'react'
import type { Faction } from '@/codex/types'

interface FactionSummariesProps {
  factions: Faction[]
}

export function FactionSummaries({ factions }: FactionSummariesProps) {
  const [expanded, setExpanded] = useState(true)

  return (
    <section className="faction-summaries">
      <button
        type="button"
        className="summaries-toggle"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <h2 className="summaries-title">Five Factions of the Island</h2>
        <span className="summaries-chevron" aria-hidden>{expanded ? '▼' : '▶'}</span>
      </button>
      {expanded && (
        <>
          <p className="summaries-intro">
            The Island (Vantheon-verse) is governed by five factions in a rough equilibrium: no one thrives or fails outright. Rank is determined by <strong>Faction Standing</strong> (the weighted composite score below).
          </p>
          <div className="summaries-grid">
            {factions.map((f) => (
              <article key={f.id} className="faction-card" style={{ borderLeftColor: f.color }}>
                <h3 className="faction-card-name">{f.name}</h3>
                {f.summary && <p className="faction-card-summary">{f.summary}</p>}
                {f.extended && (
                  <dl className="faction-card-metrics">
                    <div>
                      <dt>Income (0–100)</dt>
                      <dd>{f.extended.income}</dd>
                    </div>
                    <div>
                      <dt>Avg beauty (0–100)</dt>
                      <dd>{f.extended.avgBeauty}</dd>
                    </div>
                    <div>
                      <dt>Avg height</dt>
                      <dd>{f.extended.avgHeight}</dd>
                    </div>
                  </dl>
                )}
              </article>
            ))}
          </div>
        </>
      )}
      <style>{`
        .faction-summaries { margin-bottom: 2rem; }
        .summaries-toggle { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 0; margin: 0 0 0.5rem 0; background: none; border: none; cursor: pointer; color: inherit; font: inherit; text-align: left; }
        .summaries-toggle:hover { color: var(--accent, #888); }
        .summaries-title { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text); }
        .summaries-chevron { font-size: 0.75rem; color: var(--text-muted); }
        .summaries-intro { margin: 0 0 1rem 0; font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; }
        .summaries-intro strong { color: var(--text); }
        .summaries-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
        .faction-card { background: var(--bg-panel); border: 1px solid var(--border); border-left-width: 4px; border-radius: var(--radius); padding: 1rem 1.25rem; }
        .faction-card-name { margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 600; color: var(--text); }
        .faction-card-summary { margin: 0 0 0.75rem 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; }
        .faction-card-metrics { margin: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem 1rem; font-size: 0.8rem; }
        .faction-card-metrics dt { color: var(--text-muted); font-weight: 500; }
        .faction-card-metrics dd { margin: 0; font-family: var(--font-mono); color: var(--text); }
      `}</style>
    </section>
  )
}
