import type { FactionId, Deck } from "@/types/game";
import { getPlayerId } from "./playerIdentity";

export async function syncDecksToServer(decks: Record<FactionId, Deck[]>): Promise<void> {
  const playerId = getPlayerId();
  for (const factionId of Object.keys(decks) as FactionId[]) {
    for (const deck of decks[factionId]) {
      try {
        await fetch("/api/arena/decks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: deck.id,
            player_id: playerId,
            name: deck.name,
            faction_id: deck.factionId,
            cards: deck.cards,
          }),
        });
      } catch {
        // silently ignore sync failures
      }
    }
  }
}

export async function syncDeckToServer(deck: Deck): Promise<void> {
  const playerId = getPlayerId();
  const res = await fetch("/api/arena/decks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: deck.id,
      player_id: playerId,
      name: deck.name,
      faction_id: deck.factionId,
      cards: deck.cards,
    }),
  });
  if (!res.ok) {
    throw new Error("Failed to sync deck to server");
  }
}

export async function deleteDeckFromServer(deckId: string): Promise<void> {
  try {
    await fetch(`/api/arena/decks?id=${deckId}`, { method: "DELETE" });
  } catch {
    // silently ignore
  }
}

export async function loadDecksFromServer(): Promise<Deck[]> {
  const playerId = getPlayerId();
  try {
    const res = await fetch(`/api/arena/decks?player_id=${playerId}`);
    if (!res.ok) return [];
    const rows = await res.json();
    return rows.map((r: { id: string; name: string; faction_id: FactionId; cards: Deck["cards"] }) => ({
      id: r.id,
      name: r.name,
      factionId: r.faction_id,
      cards: r.cards,
    }));
  } catch {
    return [];
  }
}
