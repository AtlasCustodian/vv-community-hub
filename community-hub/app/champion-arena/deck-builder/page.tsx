"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useFaction } from "@/context/FactionContext";
import type { Champion } from "@/data/factionData";
import type {
  FactionId,
  ChampionClass,
  Card as CardType,
  DeckCard,
  Deck,
} from "@/types/game";
import { FACTION_THEMES } from "@/lib/game/factionThemes";
import { loadDecks, saveDecks } from "@/lib/game/deckStorage";
import Card from "@/components/game/Card";
import ClassIcon from "@/components/game/ClassIcon";

const MAX_DECKS = 3;
const MAX_CARDS = 16;
const MAX_COMBINED = 14;
const MAX_DEFENSE = 8;
const MAX_ATTACK = 12;

// ── Stat conversion helpers ──────────────────────────────────────────────────

function computeMaxAttack(
  returnRate: number,
  allChampions: Champion[],
): number {
  const rates = allChampions.map((c) => c.returnRate);
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const range = max - min || 1;
  return Math.round(((returnRate - min) / range) * MAX_ATTACK);
}

function computeMaxDefense(stabilityScore: number): number {
  return Math.max(1, Math.round((stabilityScore / 100) * MAX_DEFENSE));
}

// ── Class accent colors (mirrored from Card component) ───────────────────────

const CLASS_ACCENT: Record<ChampionClass, string> = {
  attacker: "#ef4444",
  defender: "#3b82f6",
  bruiser: "#f59e0b",
};

const CLASS_LABELS: Record<ChampionClass, string> = {
  attacker: "Attacker",
  defender: "Defender",
  bruiser: "Bruiser",
};

// ── Page Component ───────────────────────────────────────────────────────────

export default function DeckBuilderPage() {
  const { faction, factionId } = useFaction();
  const theme = FACTION_THEMES[factionId];

  // Card builder state
  const [selectedChampionId, setSelectedChampionId] = useState<string | null>(
    null,
  );
  const [chosenAttack, setChosenAttack] = useState(0);
  const [chosenDefense, setChosenDefense] = useState(0);
  const [chosenClass, setChosenClass] = useState<ChampionClass | null>(null);

  // Deck state
  const [allDecks, setAllDecks] = useState<Record<FactionId, Deck[]>>({
    fire: [],
    earth: [],
    water: [],
    wood: [],
    metal: [],
  });
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [mounted, setMounted] = useState(false);
  const editingRef = useRef(false);

  // Load decks from localStorage
  useEffect(() => {
    setAllDecks(loadDecks());
    setMounted(true);
  }, []);

  // When faction changes, reset active deck to first available or null
  useEffect(() => {
    const factionDecks = allDecks[factionId] ?? [];
    if (factionDecks.length > 0) {
      if (!factionDecks.find((d) => d.id === activeDeckId)) {
        setActiveDeckId(factionDecks[0].id);
      }
    } else {
      setActiveDeckId(null);
    }
  }, [factionId, allDecks, activeDeckId]);

  const factionDecks = allDecks[factionId] ?? [];
  const activeDeck = factionDecks.find((d) => d.id === activeDeckId) ?? null;

  // Champions sorted by return rate descending
  const sortedChampions = useMemo(
    () =>
      [...faction.champions].sort((a, b) => {
        const diff = b.returnRate - a.returnRate;
        if (diff !== 0) return diff;
        return b.stabilityScore - a.stabilityScore;
      }),
    [faction.champions],
  );

  const usedChampionIds = useMemo(() => {
    if (!activeDeck) return new Set<string>();
    return new Set(activeDeck.cards.map((c) => c.championId));
  }, [activeDeck]);

  const availableChampions = useMemo(
    () => sortedChampions.filter((c) => !usedChampionIds.has(c.id)),
    [sortedChampions, usedChampionIds],
  );

  const selectedChampion = sortedChampions.find(
    (c) => c.id === selectedChampionId,
  );

  // Computed max stats for selected champion
  const maxAttack = selectedChampion
    ? computeMaxAttack(selectedChampion.returnRate, faction.champions)
    : 0;
  const maxDefense = selectedChampion
    ? computeMaxDefense(selectedChampion.stabilityScore)
    : 0;
  const totalAvailable = maxAttack + maxDefense;

  // Reset builder when champion changes (skip when loading from an edit)
  useEffect(() => {
    if (editingRef.current) {
      editingRef.current = false;
      return;
    }
    if (selectedChampion) {
      const mAtk = computeMaxAttack(
        selectedChampion.returnRate,
        faction.champions,
      );
      const mDef = computeMaxDefense(selectedChampion.stabilityScore);
      if (mAtk + mDef <= MAX_COMBINED) {
        setChosenAttack(mAtk);
        setChosenDefense(mDef);
      } else {
        setChosenAttack(Math.min(mAtk, MAX_COMBINED));
        setChosenDefense(Math.min(mDef, MAX_COMBINED - Math.min(mAtk, MAX_COMBINED)));
      }
      setChosenClass(null);
    }
  }, [selectedChampionId, selectedChampion, faction.champions]);

  // Persist decks on any change
  const persistDecks = useCallback(
    (next: Record<FactionId, Deck[]>) => {
      setAllDecks(next);
      saveDecks(next);
    },
    [],
  );

  // ── Handlers ─────────────────────────────────────────────────────────────

  function handleAttackChange(val: number) {
    const clamped = Math.max(0, Math.min(val, maxAttack));
    const newDef = Math.min(chosenDefense, MAX_COMBINED - clamped);
    setChosenAttack(clamped);
    setChosenDefense(Math.max(0, newDef));
  }

  function handleDefenseChange(val: number) {
    const clamped = Math.max(0, Math.min(val, maxDefense));
    const newAtk = Math.min(chosenAttack, MAX_COMBINED - clamped);
    setChosenDefense(clamped);
    setChosenAttack(Math.max(0, newAtk));
  }

  function handleCreateDeck() {
    if (!newDeckName.trim() || factionDecks.length >= MAX_DECKS) return;
    const deck: Deck = {
      id: `deck-${Date.now()}`,
      name: newDeckName.trim(),
      factionId,
      cards: [],
    };
    const next = {
      ...allDecks,
      [factionId]: [...factionDecks, deck],
    };
    persistDecks(next);
    setActiveDeckId(deck.id);
    setNewDeckName("");
    setIsCreatingDeck(false);
  }

  function handleAddToDeck() {
    if (!selectedChampion || !chosenClass || !activeDeck) return;
    if (activeDeck.cards.length >= MAX_CARDS) return;

    const deckCard: DeckCard = {
      id: `dc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      championId: selectedChampion.id,
      name: selectedChampion.name,
      factionId,
      attack: chosenAttack,
      defense: chosenDefense,
      maxAttack,
      maxDefense,
      championClass: chosenClass,
      returnRate: selectedChampion.returnRate,
      stabilityScore: selectedChampion.stabilityScore,
    };

    const updatedDeck = {
      ...activeDeck,
      cards: [...activeDeck.cards, deckCard],
    };
    const next = {
      ...allDecks,
      [factionId]: factionDecks.map((d) =>
        d.id === activeDeck.id ? updatedDeck : d,
      ),
    };
    persistDecks(next);
    setSelectedChampionId(null);
    setChosenClass(null);
  }

  function handleRemoveCard(cardId: string) {
    if (!activeDeck) return;
    const updatedDeck = {
      ...activeDeck,
      cards: activeDeck.cards.filter((c) => c.id !== cardId),
    };
    const next = {
      ...allDecks,
      [factionId]: factionDecks.map((d) =>
        d.id === activeDeck.id ? updatedDeck : d,
      ),
    };
    persistDecks(next);
  }

  function handleDeleteDeck(deckId: string) {
    const next = {
      ...allDecks,
      [factionId]: factionDecks.filter((d) => d.id !== deckId),
    };
    persistDecks(next);
    if (activeDeckId === deckId) {
      const remaining = next[factionId];
      setActiveDeckId(remaining.length > 0 ? remaining[0].id : null);
    }
  }

  function handleEditCard(dc: DeckCard) {
    if (!activeDeck) return;
    editingRef.current = true;
    const updatedDeck = {
      ...activeDeck,
      cards: activeDeck.cards.filter((c) => c.id !== dc.id),
    };
    const next = {
      ...allDecks,
      [factionId]: factionDecks.map((d) =>
        d.id === activeDeck.id ? updatedDeck : d,
      ),
    };
    persistDecks(next);
    setSelectedChampionId(dc.championId);
    setChosenAttack(dc.attack);
    setChosenDefense(dc.defense);
    setChosenClass(dc.championClass);
  }

  // Build a Card object for the live preview
  const previewCard: CardType | null =
    selectedChampion && chosenClass
      ? {
          id: "preview",
          championId: selectedChampion.id,
          name: selectedChampion.name,
          factionId,
          attack: chosenAttack,
          defense: chosenDefense,
          health: 20,
          maxHealth: 20,
          championClass: chosenClass,
          returnRate: selectedChampion.returnRate,
          stabilityScore: selectedChampion.stabilityScore,
        }
      : null;

  const canAdd =
    !!selectedChampion &&
    !!chosenClass &&
    !!activeDeck &&
    activeDeck.cards.length < MAX_CARDS;

  const remaining = MAX_COMBINED - chosenAttack - chosenDefense;

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="champion-arena mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
          style={{ background: `${theme.primary}15` }}
        >
          ⚒️
        </div>
        <div>
          <h1
            className="text-2xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`,
            }}
          >
            Deck Builder
          </h1>
          <p className="text-xs text-muted">
            Forge your champions into battle-ready cards
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Card Builder (Left / Center) ────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div
            className="glass-card rounded-2xl overflow-hidden"
            style={{
              borderColor: `color-mix(in srgb, ${theme.primary} 15%, transparent)`,
            }}
          >
            <div
              className="h-0.5 w-full"
              style={{
                background: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`,
              }}
            />

            <div className="p-6">
              {/* Champion selector */}
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                Select Champion
              </label>
              <select
                value={selectedChampionId ?? ""}
                onChange={(e) =>
                  setSelectedChampionId(e.target.value || null)
                }
                className="w-full rounded-lg border px-3 py-2 text-sm bg-[var(--color-surface)] text-foreground mb-6"
                style={{
                  borderColor: `${theme.primary}30`,
                }}
              >
                <option value="">-- Choose a Champion --</option>
                {availableChampions.map((c) => {
                  const rateStr = (c.returnRate * 100).toFixed(1);
                  const sign = c.returnRate >= 0 ? "+" : "";
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name} ({sign}{rateStr}% / {c.stabilityScore})
                    </option>
                  );
                })}
              </select>

              {selectedChampion ? (
                <div className="flex flex-col items-center gap-6">
                  {/* Raw stats display */}
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-xs text-muted uppercase tracking-wider mb-1">
                        Return Rate
                      </div>
                      <div
                        className="font-mono font-bold text-lg"
                        style={{
                          color:
                            selectedChampion.returnRate >= 0
                              ? "#4ade80"
                              : "#f87171",
                        }}
                      >
                        {selectedChampion.returnRate >= 0 ? "+" : ""}
                        {(selectedChampion.returnRate * 100).toFixed(2)}%
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        Max ATK: {maxAttack}
                      </div>
                    </div>
                    <div
                      className="w-px self-stretch"
                      style={{ background: `${theme.primary}20` }}
                    />
                    <div className="text-center">
                      <div className="text-xs text-muted uppercase tracking-wider mb-1">
                        Stability
                      </div>
                      <div
                        className="font-mono font-bold text-lg"
                        style={{
                          color:
                            selectedChampion.stabilityScore >= 80
                              ? "#4ade80"
                              : "#facc15",
                        }}
                      >
                        {selectedChampion.stabilityScore}
                      </div>
                      <div className="text-xs text-muted mt-0.5">
                        Max DEF: {maxDefense}
                      </div>
                    </div>
                  </div>

                  {/* Point allocation */}
                  <div
                    className="w-full rounded-xl p-4"
                    style={{ background: `${theme.primary}08` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                        Allocate Points
                      </span>
                      <span
                        className="text-xs font-mono px-2 py-0.5 rounded-md"
                        style={{
                          color: remaining > 0 ? "#facc15" : "#4ade80",
                          background:
                            remaining > 0
                              ? "rgba(250, 204, 21, 0.1)"
                              : "rgba(74, 222, 128, 0.1)",
                        }}
                      >
                        {remaining} unallocated
                      </span>
                    </div>

                    <div className="space-y-3">
                      {/* Attack stepper */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold w-10 text-red-400">
                          ATK
                        </span>
                        <button
                          onClick={() => handleAttackChange(chosenAttack - 1)}
                          disabled={chosenAttack <= 0}
                          className="w-7 h-7 rounded-md border text-sm font-bold flex items-center justify-center disabled:opacity-30 transition-colors hover:bg-[var(--color-surface-hover)]"
                          style={{ borderColor: `${theme.primary}30` }}
                        >
                          -
                        </button>
                        <div className="flex-1">
                          <div className="relative h-3 rounded-full overflow-hidden bg-black/20">
                            <div
                              className="absolute inset-y-0 left-0 rounded-full transition-all duration-200"
                              style={{
                                width: `${maxAttack > 0 ? (chosenAttack / maxAttack) * 100 : 0}%`,
                                background: `linear-gradient(90deg, #ef4444, ${theme.primary})`,
                              }}
                            />
                          </div>
                        </div>
                        <span
                          className="font-mono font-bold text-sm w-12 text-center"
                          style={{ color: "#ef4444" }}
                        >
                          {chosenAttack}/{maxAttack}
                        </span>
                        <button
                          onClick={() => handleAttackChange(chosenAttack + 1)}
                          disabled={
                            chosenAttack >= maxAttack ||
                            chosenAttack + chosenDefense >= MAX_COMBINED
                          }
                          className="w-7 h-7 rounded-md border text-sm font-bold flex items-center justify-center disabled:opacity-30 transition-colors hover:bg-[var(--color-surface-hover)]"
                          style={{ borderColor: `${theme.primary}30` }}
                        >
                          +
                        </button>
                      </div>

                      {/* Defense stepper */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold w-10 text-blue-400">
                          DEF
                        </span>
                        <button
                          onClick={() =>
                            handleDefenseChange(chosenDefense - 1)
                          }
                          disabled={chosenDefense <= 0}
                          className="w-7 h-7 rounded-md border text-sm font-bold flex items-center justify-center disabled:opacity-30 transition-colors hover:bg-[var(--color-surface-hover)]"
                          style={{ borderColor: `${theme.primary}30` }}
                        >
                          -
                        </button>
                        <div className="flex-1">
                          <div className="relative h-3 rounded-full overflow-hidden bg-black/20">
                            <div
                              className="absolute inset-y-0 left-0 rounded-full transition-all duration-200"
                              style={{
                                width: `${maxDefense > 0 ? (chosenDefense / maxDefense) * 100 : 0}%`,
                                background: `linear-gradient(90deg, #3b82f6, ${theme.primary})`,
                              }}
                            />
                          </div>
                        </div>
                        <span
                          className="font-mono font-bold text-sm w-12 text-center"
                          style={{ color: "#3b82f6" }}
                        >
                          {chosenDefense}/{maxDefense}
                        </span>
                        <button
                          onClick={() =>
                            handleDefenseChange(chosenDefense + 1)
                          }
                          disabled={
                            chosenDefense >= maxDefense ||
                            chosenAttack + chosenDefense >= MAX_COMBINED
                          }
                          className="w-7 h-7 rounded-md border text-sm font-bold flex items-center justify-center disabled:opacity-30 transition-colors hover:bg-[var(--color-surface-hover)]"
                          style={{ borderColor: `${theme.primary}30` }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {totalAvailable > MAX_COMBINED && (
                      <p className="text-xs text-muted mt-2 italic">
                        This champion has {totalAvailable} total points, but
                        only {MAX_COMBINED} can be allocated.
                      </p>
                    )}
                  </div>

                  {/* Class selector */}
                  <div className="w-full">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                      Choose Class
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(
                        ["attacker", "defender", "bruiser"] as ChampionClass[]
                      ).map((cls) => {
                        const isSelected = chosenClass === cls;
                        const accent = CLASS_ACCENT[cls];
                        return (
                          <button
                            key={cls}
                            onClick={() => setChosenClass(cls)}
                            className="flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all duration-200"
                            style={{
                              borderColor: isSelected
                                ? accent
                                : `${theme.primary}20`,
                              background: isSelected
                                ? `${accent}15`
                                : "transparent",
                              boxShadow: isSelected
                                ? `0 0 16px ${accent}25`
                                : "none",
                            }}
                          >
                            <ClassIcon
                              championClass={cls}
                              color={isSelected ? accent : `${theme.primary}60`}
                              size={28}
                            />
                            <span
                              className="text-xs font-semibold uppercase tracking-wider"
                              style={{
                                color: isSelected ? accent : `${theme.primary}80`,
                              }}
                            >
                              {CLASS_LABELS[cls]}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live preview + Add to Deck */}
                  <div className="flex flex-col items-center gap-4 pt-2">
                    {previewCard ? (
                      <Card card={previewCard} />
                    ) : (
                      <div
                        className="w-44 h-64 rounded-xl border-2 border-dashed flex items-center justify-center"
                        style={{ borderColor: `${theme.primary}20` }}
                      >
                        <span className="text-xs text-muted text-center px-4">
                          Select a class to preview
                        </span>
                      </div>
                    )}

                    <button
                      onClick={handleAddToDeck}
                      disabled={!canAdd}
                      className="w-full max-w-xs py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        background: canAdd
                          ? `linear-gradient(135deg, ${theme.gradientFrom}, ${theme.gradientTo})`
                          : `${theme.primary}15`,
                        color: canAdd ? "#fff" : `${theme.primary}50`,
                        boxShadow: canAdd
                          ? `0 4px 16px ${theme.primary}30`
                          : "none",
                      }}
                    >
                      Add to Deck
                    </button>
                    {!activeDeck && selectedChampion && (
                      <p className="text-xs text-muted italic">
                        Select or create a deck first
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div
                    className="w-44 h-64 rounded-xl border-2 border-dashed flex items-center justify-center"
                    style={{ borderColor: `${theme.primary}20` }}
                  >
                    <span className="text-xs text-muted text-center px-4">
                      Choose a champion above
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Deck Panel (Right) ──────────────────────────────────────── */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div
            className="glass-card rounded-2xl overflow-hidden"
            style={{
              borderColor: `color-mix(in srgb, ${theme.primary} 15%, transparent)`,
            }}
          >
            <div
              className="h-0.5 w-full"
              style={{
                background: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`,
              }}
            />

            <div className="p-4">
              {/* Deck selector */}
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                Deck
              </label>
              <div className="flex gap-2 mb-4">
                <select
                  value={activeDeckId ?? ""}
                  onChange={(e) => {
                    if (e.target.value === "__new__") {
                      setIsCreatingDeck(true);
                    } else {
                      setActiveDeckId(e.target.value || null);
                      setIsCreatingDeck(false);
                    }
                  }}
                  className="flex-1 rounded-lg border px-3 py-2 text-sm bg-[var(--color-surface)] text-foreground"
                  style={{ borderColor: `${theme.primary}30` }}
                >
                  {factionDecks.length === 0 && !isCreatingDeck && (
                    <option value="">No decks yet</option>
                  )}
                  {factionDecks.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.cards.length}/{MAX_CARDS})
                    </option>
                  ))}
                  {factionDecks.length < MAX_DECKS && (
                    <option value="__new__">+ New Deck</option>
                  )}
                </select>
                {activeDeck && (
                  <button
                    onClick={() => handleDeleteDeck(activeDeck.id)}
                    className="px-2 py-1 rounded-lg border text-xs text-red-400 hover:bg-red-400/10 transition-colors"
                    style={{ borderColor: "rgba(248, 113, 113, 0.3)" }}
                    title="Delete deck"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* New deck creation */}
              {isCreatingDeck && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateDeck()}
                    placeholder="Deck name..."
                    maxLength={24}
                    autoFocus
                    className="flex-1 rounded-lg border px-3 py-2 text-sm bg-[var(--color-surface)] text-foreground placeholder:text-muted"
                    style={{ borderColor: `${theme.primary}30` }}
                  />
                  <button
                    onClick={handleCreateDeck}
                    disabled={!newDeckName.trim()}
                    className="px-3 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-30"
                    style={{
                      background: `${theme.primary}20`,
                      color: theme.primary,
                    }}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsCreatingDeck(false);
                      setNewDeckName("");
                    }}
                    className="px-2 py-2 rounded-lg text-sm text-muted hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Deck card count */}
              {activeDeck && (
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted">
                    {activeDeck.cards.length}/{MAX_CARDS} cards
                  </span>
                  {activeDeck.cards.length >= MAX_CARDS && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400">
                      Deck Full
                    </span>
                  )}
                </div>
              )}

              {/* Deck card list */}
              {activeDeck && activeDeck.cards.length > 0 ? (
                <div
                  className="space-y-2 overflow-y-auto pr-1"
                  style={{ maxHeight: "520px" }}
                >
                  {activeDeck.cards.map((dc) => (
                    <div key={dc.id} className="relative group">
                      <DeckCardRow
                        deckCard={dc}
                        theme={theme}
                        onRemove={() => handleRemoveCard(dc.id)}
                        onEdit={() => handleEditCard(dc)}
                      />
                    </div>
                  ))}
                </div>
              ) : activeDeck ? (
                <div
                  className="flex items-center justify-center rounded-xl border-2 border-dashed py-12"
                  style={{ borderColor: `${theme.primary}15` }}
                >
                  <span className="text-xs text-muted">
                    Build cards on the left and add them here
                  </span>
                </div>
              ) : !isCreatingDeck ? (
                <div
                  className="flex items-center justify-center rounded-xl border-2 border-dashed py-12"
                  style={{ borderColor: `${theme.primary}15` }}
                >
                  <span className="text-xs text-muted">
                    Create a deck to get started
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Deck Card Row (compact card representation in the deck list) ──────────

function DeckCardRow({
  deckCard,
  theme,
  onRemove,
  onEdit,
}: {
  deckCard: DeckCard;
  theme: { primary: string; secondary: string; gradientFrom: string; gradientTo: string };
  onRemove: () => void;
  onEdit: () => void;
}) {
  const accent = CLASS_ACCENT[deckCard.championClass];

  return (
    <div
      onClick={onEdit}
      className="flex items-center gap-3 rounded-xl border px-3 py-2 transition-colors hover:bg-[var(--color-surface-hover)] cursor-pointer"
      style={{
        borderColor: `${accent}30`,
        background: `${accent}05`,
      }}
    >
      <ClassIcon
        championClass={deckCard.championClass}
        color={accent}
        size={20}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {deckCard.name}
        </p>
        <p className="text-[10px] uppercase tracking-wider" style={{ color: accent }}>
          {CLASS_LABELS[deckCard.championClass]}
        </p>
      </div>
      <div
        className="text-xs font-mono font-bold"
        style={{ color: theme.primary }}
      >
        [{deckCard.attack}/{deckCard.defense}]
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-md text-xs text-red-400 hover:bg-red-400/10 transition-all"
        title="Remove card"
      >
        ✕
      </button>
    </div>
  );
}
