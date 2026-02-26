import type { PuzzleCard } from "@/types/explorer/vantheon";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function computePuzzleCardCount(floor: number): number {
  return Math.ceil((10 + floor) / 2) * 2;
}

export function generatePuzzleCards(floor: number): PuzzleCard[] {
  const cardCount = computePuzzleCardCount(floor);
  const pairCount = cardCount / 2;

  const cards: PuzzleCard[] = [];
  for (let v = 1; v <= pairCount; v++) {
    cards.push({ id: cards.length, value: v, flipped: false, matched: false });
    cards.push({ id: cards.length, value: v, flipped: false, matched: false });
  }

  return shuffle(cards).map((card, i) => ({ ...card, id: i }));
}

export function computePuzzleMaxFlips(cardCount: number, spirit: number): number {
  return Math.floor(cardCount / 2) + spirit;
}

export function computePuzzleGoldReward(floor: number): number {
  return floor * randInt(2, 5);
}

export function computePuzzleHPLoss(unmatchedPairs: number): number {
  return unmatchedPairs;
}
