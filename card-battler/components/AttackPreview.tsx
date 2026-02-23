"use client";

import type { CombatResult } from "@/types/game";

interface AttackPreviewProps {
  preview: CombatResult;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AttackPreview({
  preview,
  onConfirm,
  onCancel,
}: AttackPreviewProps) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 w-72 z-50 animate-fade-in">
      <div className="player-panel p-4 space-y-4">
        <h3 className="text-xs uppercase tracking-widest text-[var(--text-muted)] text-center">
          Attack Preview
        </h3>

        {/* Attacker */}
        <div className="space-y-1">
          <p className="text-sm font-bold text-red-400">{preview.attackerName}</p>
          <div className="text-xs space-y-0.5">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Base Attack</span>
              <span className="font-mono">{preview.rawAttack}</span>
            </div>
            {preview.loneWolfBonus > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>Lone Wolf Bonus</span>
                <span className="font-mono">+{preview.loneWolfBonus}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[var(--border-dim)] pt-1 mt-1">
              <span className="font-bold">Effective Attack</span>
              <span className="font-mono font-bold">{preview.effectiveAttack}</span>
            </div>
          </div>
        </div>

        {/* Defender */}
        <div className="space-y-1">
          <p className="text-sm font-bold text-blue-400">{preview.defenderName}</p>
          <div className="text-xs space-y-0.5">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Base Defense</span>
              <span className="font-mono">{preview.rawDefense}</span>
            </div>
            {preview.defenderFriendlyAdj > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Friendly Adjacent</span>
                <span className="font-mono">+{preview.defenderFriendlyAdj}</span>
              </div>
            )}
            {preview.defenderHostileAdj > 0 && (
              <div className="flex justify-between text-red-400">
                <span>Hostile Adjacent</span>
                <span className="font-mono">-{preview.defenderHostileAdj}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[var(--border-dim)] pt-1 mt-1">
              <span className="font-bold">Effective Defense</span>
              <span className="font-mono font-bold">{preview.effectiveDefense}</span>
            </div>
          </div>
        </div>

        {/* Outcome */}
        <div className="border-t border-[var(--border-dim)] pt-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Damage</span>
            <span className="font-mono font-bold text-red-400">
              {preview.damage}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[var(--text-muted)]">Health</span>
            <span className="font-mono">
              {preview.defenderCurrentHealth} → {" "}
              <span
                className={`font-bold ${
                  preview.defenderDestroyed ? "text-red-500" : "text-green-400"
                }`}
              >
                {preview.defenderDestroyed
                  ? "DESTROYED"
                  : preview.defenderRemainingHealth}
              </span>
            </span>
          </div>
          {preview.attackerHealing != null && preview.attackerHealing > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-purple-400">Lifesteal Healing</span>
              <span className="font-mono font-bold text-green-400">
                +{preview.attackerHealing} HP
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            className="btn-holo flex-1 text-sm"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn-holo flex-1 text-sm ring-1 ring-red-400"
            onClick={onConfirm}
          >
            Confirm Attack
          </button>
        </div>
      </div>
    </div>
  );
}
