import type { Item, ItemSlot, ExplorerStat } from "@/types/explorer/explorer";
import { ITEM_SLOTS } from "@/types/explorer/explorer";
import type { ItemRarity } from "@/types/explorer/vantheon";
import { SLOT_ART_KEYS } from "@/components/explorer/slotArt";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollRarity(): ItemRarity {
  const r = Math.random() * 100;
  if (r < 4) return "cursed";
  if (r < 6) return "legendary";
  if (r < 13) return "rare";
  if (r < 33) return "uncommon";
  return "common";
}

const SLOT_NOUNS: Record<ItemSlot, string[]> = {
  head: ["Helm", "Hood", "Crown", "Cap", "Circlet", "Mask"],
  chest: ["Vest", "Breastplate", "Robes", "Hauberk", "Jerkin", "Cuirass"],
  legs: ["Greaves", "Trousers", "Leggings", "Chausses", "Breeches", "Tassets"],
  rightHand: ["Sword", "Blade", "Mace", "Staff", "Axe", "Spear"],
  leftHand: ["Shield", "Buckler", "Lantern", "Focus", "Tome", "Parry Dagger"],
  feet: ["Boots", "Sandals", "Sabatons", "Slippers", "Treads", "Wraps"],
  utility: ["Pouch", "Pack", "Belt", "Charm", "Talisman", "Kit"],
};

const RARITY_PREFIXES: Record<ItemRarity, string[]> = {
  common: ["Worn", "Simple", "Plain", "Sturdy", "Rough"],
  uncommon: ["Fine", "Polished", "Reinforced", "Keen", "Tempered"],
  rare: ["Exquisite", "Masterwork", "Ancient", "Enchanted", "Gleaming"],
  legendary: ["Mythic", "Radiant", "Primordial", "Celestial", "Eternal"],
  cursed: ["Blighted", "Corrupted", "Accursed", "Withered", "Hollow"],
};

const MATERIAL_ADJECTIVES = [
  "Iron", "Steel", "Leather", "Bone", "Crystal", "Shadow",
  "Stone", "Copper", "Silver", "Obsidian", "Jade", "Coral",
];

const ALL_STATS: ExplorerStat[] = ["body", "finesse", "spirit"];

function distributeStats(
  totalPoints: number,
  statCount: number,
): Partial<Record<ExplorerStat, number>> {
  const chosen: ExplorerStat[] = [];
  const pool = [...ALL_STATS];
  for (let i = 0; i < Math.min(statCount, pool.length); i++) {
    const idx = Math.floor(Math.random() * pool.length);
    chosen.push(pool.splice(idx, 1)[0]);
  }

  const result: Partial<Record<ExplorerStat, number>> = {};
  let remaining = totalPoints;

  for (let i = 0; i < chosen.length - 1; i++) {
    const maxForThis = remaining - (chosen.length - 1 - i);
    const points = randInt(1, Math.max(1, maxForThis));
    result[chosen[i]] = points;
    remaining -= points;
  }
  result[chosen[chosen.length - 1]] = Math.max(1, remaining);

  return result;
}

export function generateLoot(floor: number): Item {
  const rarity = rollRarity();
  const slot = pick(ITEM_SLOTS);

  let totalStats = Math.ceil((floor + randInt(1, 3)) / 2);

  if (rarity === "legendary" || rarity === "cursed") {
    totalStats *= 2;
  } else if (rarity === "rare") {
    totalStats = Math.ceil(totalStats * 1.5);
  } else if (rarity === "uncommon") {
    totalStats = Math.ceil(totalStats * 1.2);
  }

  const statCount = rarity === "common" ? 1 : randInt(1, 2);
  const statModifiers = distributeStats(totalStats, statCount) as Partial<
    Record<ExplorerStat, number>
  >;

  if (rarity === "cursed") {
    const cursedStat = pick(
      ALL_STATS.filter((s) => !(s in statModifiers)),
    );
    const maxPenalty = totalStats - 1;
    const penalty = Math.min(randInt(3, 5), maxPenalty);
    statModifiers[cursedStat] = -Math.max(1, penalty);
  }

  const prefix = pick(RARITY_PREFIXES[rarity]);
  const material = pick(MATERIAL_ADJECTIVES);
  const noun = pick(SLOT_NOUNS[slot]);
  const name = `${prefix} ${material} ${noun}`;

  const weight = slot === "utility" ? randInt(0, 2) : randInt(1, 3);
  const acBonus =
    (slot === "head" || slot === "chest" || slot === "legs" || slot === "leftHand" || slot === "feet")
      && rarity !== "common"
      ? randInt(0, 1)
      : 0;

  const tags: string[] = [rarity];

  const description = generateDescription(rarity, slot, noun);

  const artId = pick(SLOT_ART_KEYS[slot]);

  return {
    id: `loot-${floor}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    description,
    slot,
    statModifiers,
    acBonus: acBonus || undefined,
    weight,
    tags,
    rarity,
    isCursed: rarity === "cursed",
    artId,
  };
}

function generateDescription(rarity: ItemRarity, slot: ItemSlot, noun: string): string {
  const descriptions: Record<ItemRarity, string[]> = {
    common: [
      `A serviceable ${noun.toLowerCase()} that has seen better days.`,
      `Nothing special, but it gets the job done.`,
      `Standard issue gear found throughout the Vantheon.`,
    ],
    uncommon: [
      `A well-crafted ${noun.toLowerCase()} with fine detailing.`,
      `Noticeably better than common gear, with careful construction.`,
      `Quality craftsmanship that offers a tangible edge.`,
    ],
    rare: [
      `An exceptional ${noun.toLowerCase()} that hums with latent energy.`,
      `Rare materials and expert forging make this a coveted find.`,
      `Few pieces of this caliber remain in the Vantheon.`,
    ],
    legendary: [
      `A ${noun.toLowerCase()} of myth, radiating with ancient power.`,
      `Legends speak of this artifact — its power is unmistakable.`,
      `The air itself bends around this extraordinary piece.`,
    ],
    cursed: [
      `Dark energy pulses from this ${noun.toLowerCase()}. Power at a price.`,
      `Something is deeply wrong with this gear, yet its power is undeniable.`,
      `Whispers emanate from within. Equip at your own risk.`,
    ],
  };

  return pick(descriptions[rarity]);
}
