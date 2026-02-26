import type { Item, ExplorerStat } from "@/types/explorer/explorer";
import { EXPLORER_STATS } from "@/types/explorer/explorer";

export function computeAttributeTotal(item: Item): number {
  return Object.values(item.statModifiers).reduce(
    (sum, v) => sum + (v as number),
    0,
  );
}

export function computeSalvageYield(item: Item): number {
  return Math.max(0, Math.floor(computeAttributeTotal(item) / 2));
}

export function computeUpgradeCost(item: Item): number {
  return Math.max(1, computeAttributeTotal(item));
}

export function rollUpgradeOptions(): ExplorerStat[] {
  const pool = [...EXPLORER_STATS];
  const dropIdx = Math.floor(Math.random() * pool.length);
  pool.splice(dropIdx, 1);
  return pool;
}

export function computeItemGoldPrice(item: Item, floor: number): number {
  let price = 0;
  for (const val of Object.values(item.statModifiers)) {
    const v = val as number;
    if (v > 0) price += 5;
    else if (v < 0) price -= 5;
  }
  return Math.max(1, price + floor * 4);
}

export function applyUpgrade(item: Item, stat: ExplorerStat): Item {
  const currentVal = item.statModifiers[stat] ?? 0;
  return {
    ...item,
    statModifiers: {
      ...item.statModifiers,
      [stat]: currentVal + 1,
    },
  };
}
