import type { Item } from "@/types/explorer";

export const ITEM_CATALOG: Item[] = [
  // ── Head ──────────────────────────────────────────────────────────────────
  {
    id: "head-scouts-hood",
    name: "Scout's Hood",
    description: "A lightweight hood that sharpens the senses and quickens the hands.",
    slot: "head",
    statModifiers: { wisdom: 1, dexterity: 1 },
    weight: 1,
    tags: ["light", "cloth"],
  },
  {
    id: "head-knights-helm",
    name: "Knight's Helm",
    description: "Heavy steel helm that protects the skull but narrows the field of view.",
    slot: "head",
    statModifiers: { constitution: 1, charisma: -1 },
    weight: 4,
    tags: ["heavy", "metal"],
  },
  {
    id: "head-scholars-circlet",
    name: "Scholar's Circlet",
    description: "A thin band inscribed with ancient glyphs that sharpen the mind.",
    slot: "head",
    statModifiers: { intelligence: 1 },
    weight: 1,
    tags: ["light", "arcane"],
  },

  // ── Chest ─────────────────────────────────────────────────────────────────
  {
    id: "chest-knights-armor",
    name: "Knight's Chest Armor",
    description: "Thick plate armor offering formidable protection at the cost of mobility.",
    slot: "chest",
    statModifiers: { constitution: 2, dexterity: -1 },
    weight: 8,
    tags: ["heavy", "metal"],
  },
  {
    id: "chest-leather-vest",
    name: "Leather Vest",
    description: "Supple leather that allows full range of motion.",
    slot: "chest",
    statModifiers: { dexterity: 1 },
    weight: 3,
    tags: ["medium", "leather"],
  },
  {
    id: "chest-travelers-cloak",
    name: "Traveler's Cloak",
    description: "A worn but comfortable cloak. Light and unassuming.",
    slot: "chest",
    statModifiers: {},
    weight: 1,
    tags: ["light", "cloth"],
  },

  // ── Legs ──────────────────────────────────────────────────────────────────
  {
    id: "legs-plate-greaves",
    name: "Plate Greaves",
    description: "Armored leg plates that anchor the wearer firmly in place.",
    slot: "legs",
    statModifiers: { constitution: 1, strength: 1, dexterity: -1 },
    weight: 6,
    tags: ["heavy", "metal"],
  },
  {
    id: "legs-leather-trousers",
    name: "Leather Trousers",
    description: "Flexible trousers favored by scouts and thieves.",
    slot: "legs",
    statModifiers: { dexterity: 1 },
    weight: 2,
    tags: ["medium", "leather"],
  },
  {
    id: "legs-robes",
    name: "Scholar's Robes",
    description: "Long robes with deep pockets for scrolls and reagents.",
    slot: "legs",
    statModifiers: { intelligence: 1 },
    weight: 2,
    tags: ["light", "cloth"],
  },

  // ── Right Hand ────────────────────────────────────────────────────────────
  {
    id: "rhand-shortsword",
    name: "Shortsword",
    description: "A reliable blade for close combat.",
    slot: "rightHand",
    statModifiers: { strength: 1 },
    weight: 3,
    tags: ["weapon", "metal"],
  },
  {
    id: "rhand-lockpick-set",
    name: "Lockpick Set",
    description: "Delicate tools for bypassing locks and traps, but useless in a fight.",
    slot: "rightHand",
    statModifiers: { dexterity: 2, strength: -1 },
    weight: 1,
    tags: ["tool", "finesse"],
  },
  {
    id: "rhand-tome",
    name: "Tome of Lore",
    description: "A heavy book of accumulated knowledge from the old world.",
    slot: "rightHand",
    statModifiers: { intelligence: 1 },
    weight: 3,
    tags: ["arcane", "knowledge"],
  },

  // ── Left Hand ─────────────────────────────────────────────────────────────
  {
    id: "lhand-shield",
    name: "Tower Shield",
    description: "A large shield that can absorb tremendous punishment.",
    slot: "leftHand",
    statModifiers: { constitution: 2 },
    weight: 6,
    tags: ["heavy", "metal"],
  },
  {
    id: "lhand-lantern",
    name: "Lantern",
    description: "Illuminates dark passages, revealing hidden details.",
    slot: "leftHand",
    statModifiers: { wisdom: 1 },
    weight: 2,
    tags: ["tool", "light-source"],
  },
  {
    id: "lhand-dagger",
    name: "Parrying Dagger",
    description: "A short blade held in the off-hand for quick strikes.",
    slot: "leftHand",
    statModifiers: { dexterity: 1 },
    weight: 1,
    tags: ["weapon", "finesse"],
  },

  // ── Feet ──────────────────────────────────────────────────────────────────
  {
    id: "feet-rogues-slippers",
    name: "Rogue's Slippers",
    description: "Soft-soled shoes that make almost no sound on stone.",
    slot: "feet",
    statModifiers: { dexterity: 2 },
    weight: 1,
    tags: ["light", "cloth"],
  },
  {
    id: "feet-iron-boots",
    name: "Iron Boots",
    description: "Heavy boots that keep you grounded but slow you down.",
    slot: "feet",
    statModifiers: { strength: 1, dexterity: -1 },
    weight: 5,
    tags: ["heavy", "metal"],
  },
  {
    id: "feet-sandals",
    name: "Pilgrim's Sandals",
    description: "Simple sandals worn by wandering sages.",
    slot: "feet",
    statModifiers: { wisdom: 1 },
    weight: 1,
    tags: ["light", "cloth"],
  },

  // ── Back ──────────────────────────────────────────────────────────────────
  {
    id: "back-backpack",
    name: "Explorer's Backpack",
    description: "A sturdy pack with extra compartments for carrying supplies.",
    slot: "back",
    statModifiers: {},
    weight: 2,
    tags: ["utility", "storage"],
  },
  {
    id: "back-quiver",
    name: "Quiver",
    description: "Holds throwing knives or bolts, keeping hands free for quick draws.",
    slot: "back",
    statModifiers: { dexterity: 1 },
    weight: 1,
    tags: ["weapon", "ranged"],
  },
  {
    id: "back-healers-kit",
    name: "Healer's Kit",
    description: "Bandages, salves, and herbs for treating wounds on the road.",
    slot: "back",
    statModifiers: { constitution: 1, wisdom: 1 },
    weight: 3,
    tags: ["utility", "medical"],
  },
];

export function getItemsForSlot(slot: string): Item[] {
  return ITEM_CATALOG.filter((item) => item.slot === slot);
}
