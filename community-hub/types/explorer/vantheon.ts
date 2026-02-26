import type { ExplorerStat, Item } from "./explorer";

export type RoomSize = "small" | "medium" | "large" | "key" | "door" | "merchant";

export type RoomMaterial = "dirt" | "metal" | "wood" | "brick";

export type RoomType =
  | "hallway"
  | "cave"
  | "chamber"
  | "camp"
  | "shrine"
  | "pit"
  | "library"
  | "armory"
  | "fungal"
  | "flooded"
  | "crypt"
  | "forge"
  | "sewer"
  | "garden"
  | "prison"
  | "laboratory"
  | "throne"
  | "bridge"
  | "nest"
  | "crystal"
  | "frozen"
  | "volcanic"
  | "clockwork"
  | "web"
  | "ruins";

export type AbilityCategory = "physical" | "skill" | "mental";

export type ItemRarity = "common" | "uncommon" | "rare" | "legendary" | "cursed";

export const CATEGORY_STATS: Record<AbilityCategory, ExplorerStat[]> = {
  physical: ["body"],
  skill: ["finesse"],
  mental: ["spirit"],
};

export const ABILITY_CATEGORIES: AbilityCategory[] = ["physical", "skill", "mental"];

export interface ChallengeOption {
  label: string;
  description: string;
  category: AbilityCategory;
  stat: ExplorerStat;
  difficultyBase: number;
  triggersCombat?: boolean;
  triggersParkour?: boolean;
  triggersPuzzle?: boolean;
}

export interface EnemyInstance {
  id: string;
  name: string;
  body: number;
  finesse: number;
  spirit: number;
  ac: number;
  initiative: number;
  currentHP: number;
  maxHP: number;
}

export interface CombatTurn {
  actor: "player" | string;
}

export interface CombatLogEntry {
  actor: string;
  action: string;
  damage: number;
  targetName: string;
  roll: number;
  stat: "body" | "finesse" | "spirit";
}

export type CombatPhase = "playerTurn" | "enemyTurn" | "animating" | "victory" | "defeat";

export interface CombatState {
  enemies: EnemyInstance[];
  targetIndex: number;
  turnSequence: CombatTurn[];
  currentTurnIdx: number;
  log: CombatLogEntry[];
  phase: CombatPhase;
  goldReward: number;
}

export interface RoomChallenge {
  name: string;
  description: string;
  options: ChallengeOption[];
}

export interface ChallengeResult {
  optionIndex: number;
  stat: ExplorerStat;
  roll: number;
  total: number;
  dc: number;
  success: boolean;
  hpChange: number;
}

export interface RoomTemplate {
  id: string;
  name: string;
  size: RoomSize;
  roomType: RoomType;
  description: string;
  materials: RoomMaterial[];
  minFloor: number;
  tags: string[];
  challengeCount: number;
  challengeThemes: string[];
}

export type RoomStatus = "undiscovered" | "entered" | "completed";

export interface RoomInstance {
  instanceId: string;
  template: RoomTemplate;
  status: RoomStatus;
  challenges: RoomChallenge[];
  challengeResults: ChallengeResult[];
  currentChallengeIndex: number;
  loot: Item | null;
  goldLoot: number | null;
  merchantItems?: Item[];
  outcome?: string;
  enemies?: EnemyInstance[];
  combatState?: CombatState;
}

export interface FloorLayout {
  floorNumber: number;
  rooms: RoomInstance[];
  material: RoomMaterial;
  keyRoomIndex: number;
  doorRoomIndex: number;
}

export interface VantheonEvent {
  floor: number;
  roomInstanceId: string;
  type: string;
  timestamp: string;
}

export interface VantheonState {
  currentFloor: number;
  currentRoomIndex: number;
  currentHP: number;
  maxHP: number;
  floors: FloorLayout[];
  keyItems: string[];
  hasKey: boolean;
  roomsSinceLastKey: number;
  roomsExplored: number;
  roomsAtLastLevelUp: number;
  roomsOnCurrentFloor: number;
  merchantVisitedThisFloor: boolean;
  events: VantheonEvent[];
}

// ── Parkour ──────────────────────────────────────────────────────────────

export interface ParkourGrid {
  rows: number;
  cols: number;
  nodes: boolean[][];
  adjacency: Record<string, string[]>;
  hubNode: [number, number];
  pathCount: number;
  goldNodes: Record<string, number>;
}

export type ParkourPhase = "playing" | "won" | "lost";

export interface ParkourState {
  grid: ParkourGrid;
  currentPos: [number, number];
  movesRemaining: number;
  path: [number, number][];
  phase: ParkourPhase;
  goldReward: number;
}

// ── Puzzle ───────────────────────────────────────────────────────────────

export type PuzzlePhase = "playing" | "won" | "lost";

export interface PuzzleCard {
  id: number;
  value: number;
  flipped: boolean;
  matched: boolean;
}

export interface PuzzleState {
  cards: PuzzleCard[];
  flipsRemaining: number;
  phase: PuzzlePhase;
  goldReward: number;
}
