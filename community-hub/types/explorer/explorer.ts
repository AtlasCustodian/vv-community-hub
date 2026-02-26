export type FactionId = "fire" | "earth" | "water" | "wood" | "metal";

export type ExplorerStat = "body" | "finesse" | "spirit";

export type StatBlock = Record<ExplorerStat, number>;

export type ItemSlot =
  | "head"
  | "chest"
  | "legs"
  | "rightHand"
  | "leftHand"
  | "feet"
  | "utility";

export interface Item {
  id: string;
  name: string;
  description: string;
  slot: ItemSlot;
  statModifiers: Partial<StatBlock>;
  acBonus?: number;
  weight: number;
  tags: string[];
  rarity?: import("./vantheon").ItemRarity;
  isCursed?: boolean;
  isConsumable?: boolean;
  artId?: string;
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
  level: number;
  baseStats: StatBlock;
  persistentBonuses: StatBlock;
  equipment: Equipment;
  inventory: Item[];
  salvageComponents: number;
  gold: number;
  keys: number;
  returnRate: number;
  stabilityScore: number;
}

export type GameStatus = "preparing" | "exploring" | "completed";

export interface GameSave {
  id: string;
  champion: ExplorerChampion;
  vantheon: import("./vantheon").VantheonState | null;
  status: GameStatus;
  createdAt: string;
  updatedAt: string;
}

export const EXPLORER_STATS: ExplorerStat[] = ["body", "finesse", "spirit"];

export const STAT_LABELS: Record<ExplorerStat, string> = {
  body: "Body",
  finesse: "Finesse",
  spirit: "Spirit",
};

export const STAT_DESCRIPTIONS: Record<ExplorerStat, string> = {
  body: "Hit hard, take hits, lift, endure",
  finesse: "Dodge, pick locks, search, outsmart",
  spirit: "Sense danger, detect lies, persuade",
};

export const ITEM_SLOTS: ItemSlot[] = [
  "head",
  "chest",
  "legs",
  "rightHand",
  "leftHand",
  "feet",
  "utility",
];

export const SLOT_LABELS: Record<ItemSlot, string> = {
  head: "Head",
  chest: "Chest",
  legs: "Legs",
  rightHand: "Main Hand",
  leftHand: "Off Hand",
  feet: "Feet",
  utility: "Utility",
};

export function emptyEquipment(): Equipment {
  return {
    head: null,
    chest: null,
    legs: null,
    rightHand: null,
    leftHand: null,
    feet: null,
    utility: null,
  };
}

export function emptyStats(): StatBlock {
  return {
    body: 0,
    finesse: 0,
    spirit: 0,
  };
}
