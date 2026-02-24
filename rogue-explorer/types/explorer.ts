export type FactionId = "fire" | "earth" | "water" | "wood" | "metal";

export type ExplorerStat =
  | "dexterity"
  | "strength"
  | "constitution"
  | "intelligence"
  | "wisdom"
  | "charisma";

export type StatBlock = Record<ExplorerStat, number>;

export type ItemSlot =
  | "head"
  | "chest"
  | "legs"
  | "rightHand"
  | "leftHand"
  | "feet"
  | "back";

export interface Item {
  id: string;
  name: string;
  description: string;
  slot: ItemSlot;
  statModifiers: Partial<StatBlock>;
  weight: number;
  tags: string[];
}

export type Equipment = Record<ItemSlot, Item | null>;

export interface RawChampion {
  id: string;
  name: string;
  factionId: FactionId;
  returnRate: number;
  stabilityScore: number;
}

export interface ExplorerChampion {
  id: string;
  championId: string;
  name: string;
  factionId: FactionId;
  baseStats: StatBlock;
  equipment: Equipment;
  inventory: Item[];
  returnRate: number;
  stabilityScore: number;
}

export type GameStatus = "preparing" | "exploring" | "completed";

export interface GameSave {
  id: string;
  champion: ExplorerChampion;
  tower: import("./tower").TowerState | null;
  status: GameStatus;
  createdAt: string;
  updatedAt: string;
}

export const EXPLORER_STATS: ExplorerStat[] = [
  "dexterity",
  "strength",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

export const STAT_LABELS: Record<ExplorerStat, string> = {
  dexterity: "DEX",
  strength: "STR",
  constitution: "CON",
  intelligence: "INT",
  wisdom: "WIS",
  charisma: "CHA",
};

export const STAT_DESCRIPTIONS: Record<ExplorerStat, string> = {
  dexterity: "Pick locks, dodge, assassinate",
  strength: "Jump, lift, hit head-on",
  constitution: "Take hits, ingest strange foods",
  intelligence: "Search, read, learn, remember",
  wisdom: "Sense danger, detect lies",
  charisma: "Convince others, first impressions",
};

export const ITEM_SLOTS: ItemSlot[] = [
  "head",
  "chest",
  "legs",
  "rightHand",
  "leftHand",
  "feet",
  "back",
];

export const SLOT_LABELS: Record<ItemSlot, string> = {
  head: "Head",
  chest: "Chest",
  legs: "Legs",
  rightHand: "Right Hand",
  leftHand: "Left Hand",
  feet: "Feet",
  back: "Back",
};

export function emptyEquipment(): Equipment {
  return {
    head: null,
    chest: null,
    legs: null,
    rightHand: null,
    leftHand: null,
    feet: null,
    back: null,
  };
}

export function emptyStats(): StatBlock {
  return {
    dexterity: 0,
    strength: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
  };
}
