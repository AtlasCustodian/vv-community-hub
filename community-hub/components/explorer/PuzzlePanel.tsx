"use client";

import { useState, useCallback, useMemo } from "react";
import type { PuzzleCard } from "@/types/explorer/vantheon";
import type { FactionTheme } from "@/lib/explorer/factionThemes";
import { computePuzzleHPLoss } from "@/lib/explorer/puzzleGenerator";

const SPIRIT_COLOR = "#a78bfa";

interface PuzzlePanelProps {
  cards: PuzzleCard[];
  maxFlips: number;
  floor: number;
  goldReward: number;
  theme: FactionTheme;
  onPuzzleVictory: (goldReward: number) => void;
  onPuzzleDefeat: (hpLoss: number) => void;
}

type Phase = "playing" | "revealing" | "won" | "lost";

const SYMBOL_GLYPHS = [
  "\u2660", "\u2665", "\u2666", "\u2663", "\u2736", "\u2605",
  "\u263E", "\u2622", "\u2624", "\u2604", "\u2693", "\u2696",
  "\u269A", "\u26A1", "\u26C8", "\u2742", "\u273F", "\u2756",
  "\u2747", "\u2748", "\u274A", "\u2749", "\u2740", "\u2741",
  "\u2738", "\u2739", "\u273A", "\u273B", "\u273C", "\u273D",
];

function symbolForValue(value: number): string {
  return SYMBOL_GLYPHS[(value - 1) % SYMBOL_GLYPHS.length];
}

function colorForValue(value: number): string {
  const hue = ((value - 1) * 47) % 360;
  return `hsl(${hue}, 70%, 65%)`;
}

export default function PuzzlePanel({
  cards: initialCards,
  maxFlips,
  floor,
  goldReward,
  theme,
  onPuzzleVictory,
  onPuzzleDefeat,
}: PuzzlePanelProps) {
  const [cards, setCards] = useState<PuzzleCard[]>(initialCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [flipsUsed, setFlipsUsed] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");

  const flipsRemaining = maxFlips - flipsUsed;
  const matchedCount = cards.filter((c) => c.matched).length;
  const totalPairs = cards.length / 2;
  const matchedPairs = matchedCount / 2;

  const gridCols = useMemo(() => {
    const count = cards.length;
    if (count <= 12) return 4;
    if (count <= 16) return 4;
    if (count <= 20) return 5;
    return 6;
  }, [cards.length]);

  const handleCardClick = useCallback((cardId: number) => {
    if (phase !== "playing") return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.matched || card.flipped) return;
    if (selected.length >= 2) return;

    const newCards = cards.map((c) =>
      c.id === cardId ? { ...c, flipped: true } : c,
    );
    const newSelected = [...selected, cardId];
    setCards(newCards);
    setSelected(newSelected);

    if (newSelected.length === 2) {
      const first = newCards.find((c) => c.id === newSelected[0])!;
      const second = newCards.find((c) => c.id === newSelected[1])!;
      const newFlipsUsed = flipsUsed + 1;
      setFlipsUsed(newFlipsUsed);
      setPhase("revealing");

      if (first.value === second.value) {
        setTimeout(() => {
          const matched = newCards.map((c) =>
            c.id === first.id || c.id === second.id
              ? { ...c, matched: true }
              : c,
          );
          setCards(matched);
          setSelected([]);

          const newMatchedCount = matched.filter((c) => c.matched).length;
          if (newMatchedCount === matched.length) {
            setPhase("won");
          } else {
            setPhase("playing");
          }
        }, 500);
      } else {
        setTimeout(() => {
          const flipped = newCards.map((c) =>
            c.id === first.id || c.id === second.id
              ? { ...c, flipped: false }
              : c,
          );
          setCards(flipped);
          setSelected([]);

          const remaining = maxFlips - newFlipsUsed;
          if (remaining <= 0) {
            setPhase("lost");
          } else {
            setPhase("playing");
          }
        }, 1000);
      }
    }
  }, [cards, selected, phase, flipsUsed, maxFlips]);

  const unmatchedPairs = totalPairs - matchedPairs;
  const hpLoss = computePuzzleHPLoss(unmatchedPairs);

  return (
    <div className="animate-fade-in" style={{ width: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 16, textAlign: "center" }}>
        <p
          style={{
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: SPIRIT_COLOR,
            marginBottom: 4,
            fontWeight: 700,
          }}
        >
          Puzzle
        </p>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.primary }}>
          {phase === "won"
            ? "All Pairs Found!"
            : phase === "lost"
              ? "Out of Flips!"
              : "Match the Pairs"}
        </h3>
        {(phase === "playing" || phase === "revealing") && (
          <p style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 4 }}>
            Select two cards to reveal — find all matching pairs
          </p>
        )}
      </div>

      {/* Counters */}
      {(phase === "playing" || phase === "revealing") && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: `1px solid ${flipsRemaining <= 3 ? "rgba(248, 113, 113, 0.4)" : `${SPIRIT_COLOR}40`}`,
              background: flipsRemaining <= 3 ? "rgba(248, 113, 113, 0.08)" : `${SPIRIT_COLOR}10`,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={flipsRemaining <= 3 ? "#f87171" : SPIRIT_COLOR} strokeWidth="2" strokeLinecap="round">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "var(--font-mono), monospace",
                color: flipsRemaining <= 3 ? "#f87171" : SPIRIT_COLOR,
              }}
            >
              {flipsRemaining}
            </span>
            <span style={{ fontSize: 10, color: "var(--color-muted)" }}>
              flips left
            </span>
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: `1px solid ${SPIRIT_COLOR}30`,
              background: `${SPIRIT_COLOR}10`,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "var(--font-mono), monospace",
                color: SPIRIT_COLOR,
              }}
            >
              {matchedPairs}/{totalPairs}
            </span>
            <span style={{ fontSize: 10, color: "var(--color-muted)" }}>
              matched
            </span>
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid rgba(251, 191, 36, 0.3)",
              background: "rgba(251, 191, 36, 0.08)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="#fbbf24" strokeWidth="1" fill="rgba(251, 191, 36, 0.15)" />
              <text x="7" y="10" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">G</text>
            </svg>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "var(--font-mono), monospace",
                color: "#fbbf24",
              }}
            >
              {goldReward}
            </span>
            <span style={{ fontSize: 10, color: "var(--color-muted)" }}>
              gold
            </span>
          </div>
        </div>
      )}

      {/* Card Grid */}
      {(phase === "playing" || phase === "revealing" || phase === "lost") && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gap: 8,
            maxWidth: gridCols * 72,
            margin: "0 auto",
            padding: "16px 0",
          }}
        >
          {cards.map((card) => {
            const isSelected = selected.includes(card.id);
            const showFace = card.flipped || card.matched;

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.matched || card.flipped || phase !== "playing"}
                style={{
                  width: "100%",
                  aspectRatio: "3 / 4",
                  borderRadius: 8,
                  border: `2px solid ${
                    card.matched
                      ? "rgba(74, 222, 128, 0.5)"
                      : isSelected
                        ? `${SPIRIT_COLOR}80`
                        : showFace
                          ? `${colorForValue(card.value)}60`
                          : `${SPIRIT_COLOR}25`
                  }`,
                  background: card.matched
                    ? "rgba(74, 222, 128, 0.08)"
                    : showFace
                      ? `${colorForValue(card.value)}10`
                      : isSelected
                        ? `${SPIRIT_COLOR}18`
                        : `${SPIRIT_COLOR}06`,
                  cursor: card.matched || card.flipped || phase !== "playing" ? "default" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: showFace ? 28 : 18,
                  color: card.matched
                    ? "rgba(74, 222, 128, 0.6)"
                    : showFace
                      ? colorForValue(card.value)
                      : `${SPIRIT_COLOR}40`,
                  fontWeight: 700,
                  position: "relative",
                  overflow: "hidden",
                  opacity: card.matched ? 0.6 : 1,
                }}
              >
                {showFace ? (
                  <span style={{ lineHeight: 1 }}>
                    {symbolForValue(card.value)}
                  </span>
                ) : (
                  <span style={{ lineHeight: 1, opacity: 0.4 }}>?</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Victory */}
      {phase === "won" && (
        <div className="animate-fade-in" style={{ textAlign: "center", marginTop: 20 }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: "0 auto 12px" }}>
            <circle cx="28" cy="28" r="24" stroke="#4ade80" strokeWidth="2" fill="rgba(74, 222, 128, 0.1)" />
            <path d="M18 28l6 6 14-14" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#4ade80", marginBottom: 8 }}>
            Puzzle Complete!
          </h3>
          <p style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 16 }}>
            You matched all pairs with {flipsRemaining} flips to spare!
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 10,
              border: "1px solid rgba(251, 191, 36, 0.3)",
              background: "rgba(251, 191, 36, 0.08)",
              marginBottom: 16,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#fbbf24" strokeWidth="1.5" fill="rgba(251, 191, 36, 0.15)" />
              <text x="10" y="14" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="bold">G</text>
            </svg>
            <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "#fbbf24" }}>
              +{goldReward}
            </span>
            <span style={{ fontSize: 12, color: "#fbbf24" }}>Gold</span>
          </div>

          <div>
            <button
              onClick={() => onPuzzleVictory(goldReward)}
              className="btn-stone px-8 py-2.5 text-sm font-semibold uppercase tracking-wider"
              style={{ borderColor: `${theme.primary}40` }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Defeat */}
      {phase === "lost" && (
        <div className="animate-fade-in" style={{ textAlign: "center", marginTop: 20 }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: "0 auto 12px" }}>
            <circle cx="28" cy="28" r="24" stroke="#f87171" strokeWidth="2" fill="rgba(248, 113, 113, 0.1)" />
            <path d="M20 20l16 16M36 20l-16 16" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#f87171", marginBottom: 8 }}>
            Out of Flips!
          </h3>
          <p style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 4 }}>
            You couldn&apos;t match all the pairs in time.
          </p>
          <p style={{ fontSize: 14, color: "#f87171", fontWeight: 600, marginBottom: 16 }}>
            -{hpLoss} HP
          </p>

          <button
            onClick={() => onPuzzleDefeat(hpLoss)}
            className="btn-stone px-8 py-2.5 text-sm font-semibold uppercase tracking-wider"
            style={{ borderColor: "rgba(248, 113, 113, 0.3)" }}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
