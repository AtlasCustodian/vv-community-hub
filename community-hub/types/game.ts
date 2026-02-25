export type FactionId = "fire" | "earth" | "water" | "wood" | "metal";

export type ChampionClass = "attacker" | "defender" | "bruiser";

export type GamePhase =
  | "lobby"
  | "draft"
  | "placement"
  | "turn"
  | "interstitial"
  | "victory";

export type AIDifficulty = "easy" | "medium" | "hard";


export interface RawChampion {
  id: string;
  name: string;
  faction_id: FactionId;
  returnRate: number;
  stabilityScore: number;
}

export interface Card {
  id: string;
  championId: string;
  name: string;
  factionId: FactionId;
  attack: number;
  defense: number;
  health: number;
  maxHealth: number;
  championClass: ChampionClass;
  returnRate: number;
  stabilityScore: number;
}

export interface HexCoord {
  q: number;
  r: number;
}

export interface BoardChampion {
  card: Card;
  playerId: number;
  position: HexCoord;
  currentHealth: number;
}

export interface HexTile {
  coord: HexCoord;
  pointValue: number; // 5 for center, 2 for inner ring, 0 for outer
  occupant: BoardChampion | null;
}

export interface Player {
  id: number;
  factionId: FactionId;
  factionName: string;
  hand: Card[];
  drawPile: Card[];
  discardPile: Card[];
  score: number;
  isEliminated: boolean;
  spawnZone: HexCoord[];
}

export interface CombatResult {
  attackerId: string;
  defenderId: string;
  attackerName: string;
  defenderName: string;
  attackerPosition: HexCoord;
  defenderPosition: HexCoord;
  rawAttack: number;
  effectiveAttack: number;
  loneWolfBonus: number;
  rawDefense: number;
  effectiveDefense: number;
  defenderFriendlyAdj: number;
  defenderHostileAdj: number;
  defenderCurrentHealth: number;
  damage: number;
  defenderDestroyed: boolean;
  defenderRemainingHealth: number;
  attackerHealing?: number;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  board: HexTile[];
  currentPlayerIndex: number;
  turnNumber: number;
  turnOrder: number[];
  turnOrderIndex: number;
  winner: number | null;
  draftSelections: Map<number, Card[]>;
  selectedChampionForMove: string | null;
  movedChampions: Set<string>;
  attackedChampions: Set<string>;
  usedAbilityChampions: Set<string>;
  playerTurnCounts: Record<number, number>;
  hasDeployedThisTurn: boolean;
  lastCombatResult: CombatResult | null;
  log: string[];
}

export interface DeckCard {
  id: string;
  championId: string;
  name: string;
  factionId: FactionId;
  attack: number;
  defense: number;
  maxAttack: number;
  maxDefense: number;
  championClass: ChampionClass;
  returnRate: number;
  stabilityScore: number;
}

export interface Deck {
  id: string;
  name: string;
  factionId: FactionId;
  cards: DeckCard[];
}

export interface FactionTheme {
  primary: string;
  secondary: string;
  gradientFrom: string;
  gradientTo: string;
  name: string;
  shortName: string;
  emoji: string;
  tagline: string;
}
