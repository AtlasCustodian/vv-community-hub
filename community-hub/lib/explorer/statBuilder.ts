import type { StatBlock, ExplorerStat, Equipment, Item } from "@/types/explorer/explorer";

export const MAX_STAT_POINTS = 10;
export const MAX_PER_STAT = 5;
const RETURN_RATE_SCALE = 10;
const STABILITY_SCALE = 8;

export function computeMaxStatPoints(
  returnRate: number,
  stabilityScore: number,
  allChampions: { returnRate: number }[],
): number {
  const rates = allChampions.map((c) => c.returnRate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const rateRange = maxRate - minRate || 1;
  const normalizedRate = Math.round(
    ((returnRate - minRate) / rateRange) * RETURN_RATE_SCALE,
  );

  const normalizedStability = Math.max(
    1,
    Math.round((stabilityScore / 100) * STABILITY_SCALE),
  );

  return Math.min(normalizedRate + normalizedStability, MAX_STAT_POINTS);
}

function safe(stats: StatBlock): StatBlock {
  return {
    body: stats.body ?? 0,
    finesse: stats.finesse ?? 0,
    spirit: stats.spirit ?? 0,
  };
}

export function computeEffectiveStats(
  baseStats: StatBlock,
  equipment: Equipment,
  persistentBonuses?: StatBlock,
): StatBlock {
  const effective = safe(baseStats);
  if (persistentBonuses) {
    for (const stat of Object.keys(effective) as ExplorerStat[]) {
      effective[stat] += persistentBonuses[stat] ?? 0;
    }
  }
  for (const item of Object.values(equipment)) {
    if (!item) continue;
    for (const [stat, mod] of Object.entries(item.statModifiers)) {
      effective[stat as ExplorerStat] += mod as number;
    }
  }
  for (const stat of Object.keys(effective) as ExplorerStat[]) {
    effective[stat] = Math.max(0, effective[stat]);
  }
  return effective;
}

export function totalAllocated(stats: StatBlock): number {
  const s = safe(stats);
  return Object.values(s).reduce((sum, v) => sum + v, 0);
}

export function computeMaxHP(stats: StatBlock): number {
  return 5 + (stats.body ?? 0);
}

export function computeArmorClass(stats: StatBlock, equipment: Equipment): number {
  let ac = stats.finesse ?? 0;
  for (const item of Object.values(equipment)) {
    if (!item) continue;
    ac += item.acBonus ?? 0;
  }
  return ac;
}

export function computeInitiative(stats: StatBlock): number {
  return stats.finesse ?? 0;
}

export function computeSpeed(stats: StatBlock, equipment: Equipment, inventory: Item[] = []): number {
  return ((stats.body ?? 0) + (stats.finesse ?? 0)) * 2 - computeCurrentWeight(equipment, 0, 0, inventory);
}

export function computeSavingThrows(stats: StatBlock): StatBlock {
  return safe(stats);
}

export function computeWeightLimit(stats: StatBlock): number {
  return 5 + (stats.body ?? 0) * 2;
}

export function computeCurrentWeight(equipment: Equipment, salvageComponents = 0, gold = 0, inventory: Item[] = []): number {
  const equipWeight = Object.values(equipment).reduce(
    (sum, item) => sum + (item?.weight ?? 0),
    0,
  );
  const inventoryWeight = inventory.reduce((sum, item) => sum + (item.weight ?? 0), 0);
  return equipWeight + inventoryWeight + Math.floor(salvageComponents / 5) + Math.floor(gold / 20);
}
