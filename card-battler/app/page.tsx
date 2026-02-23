"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FACTION_THEMES, pickRandomFactions } from "@/lib/factionThemes";
import type { FactionId } from "@/types/game";

export default function LobbyPage() {
  const router = useRouter();
  const [selectedFactions, setSelectedFactions] = useState<FactionId[] | null>(
    null
  );
  const [revealIndex, setRevealIndex] = useState(-1);
  const [rolling, setRolling] = useState(false);

  function handleStartRoll() {
    setRolling(true);
    const factions = pickRandomFactions(3);
    setSelectedFactions(factions);
    setRevealIndex(-1);

    // Stagger reveals
    setTimeout(() => setRevealIndex(0), 600);
    setTimeout(() => setRevealIndex(1), 1200);
    setTimeout(() => setRevealIndex(2), 1800);
  }

  function handleBeginGame() {
    if (!selectedFactions) return;
    const params = new URLSearchParams({
      factions: selectedFactions.join(","),
    });
    router.push(`/game?${params.toString()}`);
  }

  const allRevealed = revealIndex >= 2;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Background grid */}
      <div className="absolute inset-0 board-bg" />

      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Title */}
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
            Vantheon
          </h1>
          <p className="text-lg mt-2 text-[var(--text-muted)] tracking-widest uppercase">
            Card Battler
          </p>
        </div>

        {/* Faction reveal area */}
        {selectedFactions && (
          <div className="flex gap-6 mt-4">
            {selectedFactions.map((fid, i) => {
              const theme = FACTION_THEMES[fid];
              const revealed = revealIndex >= i;

              return (
                <div
                  key={fid}
                  className={`w-48 h-64 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-500 ${
                    revealed
                      ? "animate-card-reveal"
                      : "opacity-0 scale-90"
                  }`}
                  style={{
                    borderColor: revealed ? theme.primary : "transparent",
                    background: revealed
                      ? `linear-gradient(135deg, ${theme.gradientFrom}15, ${theme.gradientTo}15)`
                      : "var(--bg-elevated)",
                    boxShadow: revealed
                      ? `0 0 24px ${theme.primary}30`
                      : "none",
                    animationDelay: `${i * 0.3}s`,
                  }}
                >
                  <span className="text-4xl">{theme.emoji}</span>
                  <span
                    className="text-lg font-bold"
                    style={{ color: theme.primary }}
                  >
                    {theme.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] px-4 text-center">
                    {theme.tagline}
                  </span>
                  <span
                    className="text-xs font-mono uppercase tracking-wider"
                    style={{ color: theme.secondary }}
                  >
                    Player {i + 1}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          {!rolling && (
            <button onClick={handleStartRoll} className="btn-holo text-lg px-8 py-3">
              Roll Factions
            </button>
          )}

          {allRevealed && (
            <button
              onClick={handleBeginGame}
              className="btn-holo text-lg px-8 py-3 animate-fade-in"
              style={{
                borderColor: "rgba(100, 255, 160, 0.4)",
              }}
            >
              Begin Battle
            </button>
          )}

          {allRevealed && (
            <button
              onClick={() => {
                setRolling(false);
                setSelectedFactions(null);
                setRevealIndex(-1);
              }}
              className="btn-holo text-lg px-8 py-3 animate-fade-in"
            >
              Re-roll
            </button>
          )}
        </div>

        {/* Decorative hex pattern */}
        <svg
          className="absolute -z-10 opacity-10"
          width={600}
          height={600}
          viewBox="-300 -300 600 600"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (Math.PI / 3) * i;
            const x = 200 * Math.cos(angle);
            const y = 200 * Math.sin(angle);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={40}
                fill="none"
                stroke="rgba(100,160,255,0.2)"
                strokeWidth={0.5}
              />
            );
          })}
          <circle
            r={200}
            fill="none"
            stroke="rgba(100,160,255,0.1)"
            strokeWidth={0.5}
          />
        </svg>
      </div>
    </div>
  );
}
