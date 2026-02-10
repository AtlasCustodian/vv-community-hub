import { useState } from 'react'
import type { Faction, StatKey, StandingsUpdate } from '@/codex/types'

const STAT_OPTIONS: { value: StatKey; label: string }[] = [
  { value: 'population', label: 'Population' },
  { value: 'territory', label: 'Territory' },
  { value: 'power', label: 'Power' },
  { value: 'influence', label: 'Influence' },
  { value: 'cohesion', label: 'Cohesion' },
]

const MODE_OPTIONS: { value: StandingsUpdate['mode']; label: string }[] = [
  { value: 'set', label: 'Set to' },
  { value: 'add', label: 'Add' },
  { value: 'subtract', label: 'Subtract' },
]

interface UpdateStandingFormProps {
  factions: Faction[]
  onUpdate: (update: StandingsUpdate) => void
  disabled?: boolean
}

export function UpdateStandingForm({ factions, onUpdate, disabled }: UpdateStandingFormProps) {
  const [factionId, setFactionId] = useState(factions[0]?.id ?? '')
  const [stat, setStat] = useState<StatKey>('power')
  const [mode, setMode] = useState<StandingsUpdate['mode']>('set')
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const num = Number(value)
    if (!factionId || Number.isNaN(num)) return
    onUpdate({ factionId, stat, value: num, mode })
    setValue('')
  }

  return (
    <form className="update-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Update standing</h3>
      <div className="form-row">
        <label>
          Faction
          <select
            value={factionId}
            onChange={(e) => setFactionId(e.target.value)}
            disabled={disabled}
          >
            {factions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Stat
          <select value={stat} onChange={(e) => setStat(e.target.value as StatKey)} disabled={disabled}>
            {STAT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          Operation
          <select value={mode ?? 'set'} onChange={(e) => setMode((e.target.value || 'set') as StandingsUpdate['mode'])} disabled={disabled}>
            {MODE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value ?? 'set'}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Value
          <input
            type="text"
            inputMode="numeric"
            placeholder="e.g. 100"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={disabled}
          />
        </label>
      </div>
      <button type="submit" className="submit-btn" disabled={disabled || !value.trim()}>
        Apply
      </button>
      <style>{`
        .update-form { background: var(--bg-panel); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; }
        .form-title { margin: 0 0 1rem 0; font-size: 0.9rem; font-weight: 600; color: var(--text-muted); }
        .form-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
        .update-form label { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.8rem; color: var(--text-muted); }
        .update-form select, .update-form input { padding: 0.5rem 0.65rem; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 6px; color: var(--text); font-family: var(--font-mono); min-width: 120px; }
        .update-form input { min-width: 80px; }
        .submit-btn { margin-top: 0.5rem; padding: 0.5rem 1rem; background: var(--accent); color: var(--bg-deep); border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-family: var(--font-sans); }
        .submit-btn:hover:not(:disabled) { filter: brightness(1.1); }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </form>
  )
}
