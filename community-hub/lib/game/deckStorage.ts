import type { FactionId, Deck } from "@/types/game";

const STORAGE_KEY = "vantheon-decks";

export function loadDecks(): Record<FactionId, Deck[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { fire: [], earth: [], water: [], wood: [], metal: [] };
}

export function saveDecks(decks: Record<FactionId, Deck[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}
