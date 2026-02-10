import { useState } from 'react'
import type { Faction, StandingsUpdate, StatKey } from '@/codex/types'

/**
 * Accepts free-form text like "add 5 power to Earth" or "set Fire territory to 60".
 * Faction can be element name (Earth, Water, Wood, Fire, Metal) or title (Ironlord, Bluecrest, etc.).
 */
const STAT_ALIASES: Record<string, StatKey> = {
  population: 'population',
  power: 'power',
  territory: 'territory',
  influence: 'influence',
  cohesion: 'cohesion',
}

function parseCommand(
  text: string,
  factions: Faction[]
): StandingsUpdate | { error: string } | null {
  const t = text.trim().toLowerCase()
  if (!t) return null

  // Match: "add 50 power to Aurora" / "subtract 20 influence from Umbra" / "set Verge cohesion to 80"
  const setMatch = t.match(/set\s+(.+?)\s+(population|power|territory|influence|cohesion)\s+to\s+(\d+)/i)
  if (setMatch) {
    const [, namePart, stat, value] = setMatch
    const statKey = STAT_ALIASES[stat.toLowerCase()]
    const name = namePart.trim()
    const faction = factions.find((f) => f.name.toLowerCase().includes(name) || f.shortName.toLowerCase() === name)
    if (!faction) return { error: `Unknown faction: ${name}` }
    return { factionId: faction.id, stat: statKey, value: parseInt(value, 10), mode: 'set' }
  }

  const addMatch = t.match(/(add|subtract)\s+(\d+)\s+(population|power|territory|influence|cohesion)\s+(?:to|from)\s+(.+)/i)
  if (addMatch) {
    const [, op, value, stat, namePart] = addMatch
    const statKey = STAT_ALIASES[stat.toLowerCase()]
    const name = namePart.trim()
    const faction = factions.find((f) => f.name.toLowerCase().includes(name) || f.shortName.toLowerCase() === name)
    if (!faction) return { error: `Unknown faction: ${name}` }
    const num = parseInt(value, 10)
    return {
      factionId: faction.id,
      stat: statKey,
      value: num,
      mode: op.toLowerCase() === 'subtract' ? 'subtract' : 'add',
    }
  }

  return { error: 'Use: "add N power to Faction" or "set Faction territory to N" (stats: population, power, territory, influence, cohesion)' }
}

interface TextCommandInputProps {
  factions: Faction[]
  onUpdate: (update: StandingsUpdate) => void
  disabled?: boolean
}

export function TextCommandInput({ factions, onUpdate, disabled }: TextCommandInputProps) {
  const [input, setInput] = useState('')
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    const result = parseCommand(input, factions)
    if (!result) {
      setInput('')
      return
    }
    if ('error' in result) {
      setMessage({ type: 'err', text: result.error })
      return
    }
    onUpdate(result)
    setMessage({ type: 'ok', text: 'Updated.' })
    setInput('')
  }

  return (
    <form className="text-command-form" onSubmit={handleSubmit}>
      <label className="text-command-label">
        <span>Text command</span>
        <input
          type="text"
          placeholder='e.g. "add 5 power to Earth" or "set Fire territory to 60"'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
        />
      </label>
      <button type="submit" className="text-command-btn" disabled={disabled || !input.trim()}>
        Run
      </button>
      {message && (
        <p className={`text-command-msg ${message.type}`}>
          {message.text}
        </p>
      )}
      <style>{`
        .text-command-form { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 0.75rem; }
        .text-command-label { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; min-width: 200px; font-size: 0.8rem; color: var(--text-muted); }
        .text-command-label input { padding: 0.6rem 0.75rem; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 6px; color: var(--text); font-family: var(--font-mono); }
        .text-command-btn { padding: 0.6rem 1rem; background: var(--accent-dim); color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .text-command-btn:hover:not(:disabled) { filter: brightness(1.1); }
        .text-command-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .text-command-msg { margin: 0; font-size: 0.85rem; width: 100%; }
        .text-command-msg.ok { color: var(--success); }
        .text-command-msg.err { color: var(--danger); }
      `}</style>
    </form>
  )
}
