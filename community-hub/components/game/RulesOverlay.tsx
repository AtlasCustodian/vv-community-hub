"use client";

interface RulesOverlayProps {
  onClose: () => void;
}

export default function RulesOverlay({ onClose }: RulesOverlayProps) {
  return (
    <div className="interstitial-overlay" onClick={onClose}>
      <div
        className="player-panel p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-slide-up mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-wide">Game Rules</h1>
          <button
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xl leading-none px-2 py-1 transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 text-sm text-[var(--text-primary)]">
          {/* Objective */}
          <section>
            <h2 className="text-base font-bold mb-2 uppercase tracking-widest text-[var(--text-muted)]">
              Objective
            </h2>
            <p>
              Three factions battle for control of a hex grid. The first player
              to reach <span className="font-bold">75 points</span> wins. If all
              of a player&apos;s champions are destroyed with none left to deploy, they
              are eliminated. The last player standing also wins.
            </p>
          </section>

          {/* Game Flow */}
          <section>
            <h2 className="text-base font-bold mb-2 uppercase tracking-widest text-[var(--text-muted)]">
              Game Flow
            </h2>
            <ol className="list-decimal list-inside space-y-1 text-[var(--text-muted)]">
              <li>
                <span className="text-[var(--text-primary)] font-medium">Draft</span> &mdash;
                Choose 2 champions from a pool of 5, then receive 1 random bonus champion.
              </li>
              <li>
                <span className="text-[var(--text-primary)] font-medium">Placement</span> &mdash;
                Deploy 1 champion onto your spawn zone (3 tiles at the edge of the board).
              </li>
              <li>
                <span className="text-[var(--text-primary)] font-medium">Turns</span> &mdash;
                Players alternate turns. The player with the highest total defense on the board goes first;
                subsequent rounds reorder by score.
              </li>
            </ol>
          </section>

          {/* Turn Structure */}
          <section>
            <h2 className="text-base font-bold mb-2 uppercase tracking-widest text-[var(--text-muted)]">
              Turn Structure
            </h2>
            <ol className="list-decimal list-inside space-y-1 text-[var(--text-muted)]">
              <li>
                <span className="text-[var(--text-primary)] font-medium">Auto-Draw</span> &mdash;
                Automatically draw 1 card at the start of your turn (if hand &lt; 5 and deck has cards).
              </li>
              <li>
                <span className="text-[var(--text-primary)] font-medium">Free Actions</span> &mdash;
                Select individual champions to move and attack in any order. Each champion may move once
                and attack once per turn. Click a champion, then choose Move or Attack, or drag it to
                a destination. Double-click to use its ability.
              </li>
              <li>
                <span className="text-[var(--text-primary)] font-medium">Deploy</span> &mdash;
                Every other turn (starting with your first), you may deploy one champion from your hand
                to any empty hex adjacent to a friendly champion, as long as it is not adjacent to an enemy.
              </li>
              <li>
                <span className="text-[var(--text-primary)] font-medium">End Turn</span> &mdash;
                Click &quot;End Turn&quot; when you&apos;re finished with all actions.
              </li>
            </ol>
          </section>

          {/* Combat */}
          <section>
            <h2 className="text-base font-bold mb-2 uppercase tracking-widest text-[var(--text-muted)]">
              Combat
            </h2>
            <p className="mb-2">
              Champions can attack adjacent enemies. Each champion may attack once per turn.
            </p>
            <div className="player-panel p-3 space-y-2 text-xs">
              <p>
                <span className="font-bold text-red-400">Effective Attack</span> = Base Attack
                + Lone Wolf Bonus (<span className="font-mono">+2</span> if no friendly champions adjacent to attacker)
              </p>
              <p>
                <span className="font-bold text-blue-400">Effective Defense</span> = Base Defense
                + Friendly Neighbors &minus; Hostile Neighbors
              </p>
              <p>
                <span className="font-bold">Damage</span> = max(0, Effective Attack &minus; Effective Defense)
              </p>
            </div>
            <p className="mt-2 text-[var(--text-muted)]">
              If a champion is destroyed, the attacker advances into its tile.
              Destroyed champions go to their owner&apos;s discard pile.
            </p>
          </section>

          {/* Scoring */}
          <section>
            <h2 className="text-base font-bold mb-2 uppercase tracking-widest text-[var(--text-muted)]">
              Scoring
            </h2>
            <p className="mb-2">
              Points are awarded at the end of each round for every hex tile you control
              (have a champion on).
            </p>
            <div className="flex gap-4 text-center text-xs">
              <div className="player-panel px-3 py-2 flex-1">
                <p className="text-lg font-bold" style={{ color: "rgba(255, 215, 0, 0.8)" }}>5</p>
                <p className="text-[var(--text-muted)]">Center</p>
              </div>
              <div className="player-panel px-3 py-2 flex-1">
                <p className="text-lg font-bold" style={{ color: "rgba(100, 160, 255, 0.8)" }}>2</p>
                <p className="text-[var(--text-muted)]">Inner Ring</p>
              </div>
              <div className="player-panel px-3 py-2 flex-1">
                <p className="text-lg font-bold" style={{ color: "rgba(80, 140, 200, 0.6)" }}>1</p>
                <p className="text-[var(--text-muted)]">Outer Ring</p>
              </div>
              <div className="player-panel px-3 py-2 flex-1">
                <p className="text-lg font-bold text-[var(--text-muted)]">0</p>
                <p className="text-[var(--text-muted)]">Edge</p>
              </div>
            </div>
          </section>

          {/* Champion Classes */}
          <section>
            <h2 className="text-base font-bold mb-2 uppercase tracking-widest text-[var(--text-muted)]">
              Champion Classes
            </h2>
            <div className="space-y-1 text-[var(--text-muted)]">
              <p>
                <span className="text-red-400 font-bold">⚔ Attacker</span> &mdash;
                High attack, lower defense. Attack exceeds defense by 3+.
              </p>
              <p>
                <span className="text-blue-400 font-bold">🛡 Defender</span> &mdash;
                High defense, lower attack. Defense exceeds attack by 3+.
              </p>
              <p>
                <span className="text-purple-400 font-bold">💪 Bruiser</span> &mdash;
                Balanced stats. Neither stat dominates by 3+.
              </p>
            </div>
          </section>

          {/* Key Tips */}
          <section>
            <h2 className="text-base font-bold mb-2 uppercase tracking-widest text-[var(--text-muted)]">
              Key Tips
            </h2>
            <ul className="list-disc list-inside space-y-1 text-[var(--text-muted)]">
              <li>Group your champions together &mdash; adjacent allies boost each other&apos;s defense.</li>
              <li>Isolated attackers gain a <span className="font-mono text-[var(--text-primary)]">+2</span> Lone Wolf attack bonus.</li>
              <li>Control the center hex for 5 points per round.</li>
              <li>Hand size is capped at 5 cards.</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 text-center">
          <button className="btn-holo px-8 py-3" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
