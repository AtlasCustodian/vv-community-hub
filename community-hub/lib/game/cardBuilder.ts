import type { RawChampion, Card, ChampionClass, FactionId } from "@/types/game";

function classifyChampion(attack: number, defense: number): ChampionClass {
  if (defense >= attack + 3) return "defender";
  if (attack >= defense + 3) return "attacker";
  return "bruiser";
}

export function buildDecks(
  rawByFaction: Record<string, RawChampion[]>
): Record<FactionId, Card[]> {
  const allChampions: RawChampion[] = [];
  for (const factionId of Object.keys(rawByFaction)) {
    allChampions.push(...rawByFaction[factionId]);
  }

  if (allChampions.length === 0) {
    return {} as Record<FactionId, Card[]>;
  }

  const returnRates = allChampions.map((c) => c.returnRate);
  const stabilities = allChampions.map((c) => c.stabilityScore);

  const minReturn = Math.min(...returnRates);
  const maxReturn = Math.max(...returnRates);
  const returnRange = maxReturn - minReturn || 1;

  const minStability = Math.min(...stabilities);
  const maxStability = Math.max(...stabilities);
  const stabilityRange = maxStability - minStability || 1;

  const MAX_COMBINED = 12;

  const result: Record<string, Card[]> = {};

  for (const [factionId, champions] of Object.entries(rawByFaction)) {
    result[factionId] = champions.map((champ) => {
      const attack = Math.round(
        ((champ.returnRate - minReturn) / returnRange) * 10
      );

      const rawDefense = Math.round(
        ((champ.stabilityScore - minStability) / stabilityRange) * 8
      );
      const defense = Math.min(rawDefense, MAX_COMBINED - attack);

      return {
        id: `card-${champ.id}`,
        championId: champ.id,
        name: champ.name,
        factionId: factionId as FactionId,
        attack,
        defense,
        health: 20,
        maxHealth: 20,
        championClass: classifyChampion(attack, defense),
        returnRate: champ.returnRate,
        stabilityScore: champ.stabilityScore,
      };
    });
  }

  return result as Record<FactionId, Card[]>;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function drawCards(
  drawPile: Card[],
  count: number
): { drawn: Card[]; remaining: Card[] } {
  const drawn = drawPile.slice(0, count);
  const remaining = drawPile.slice(count);
  return { drawn, remaining };
}
