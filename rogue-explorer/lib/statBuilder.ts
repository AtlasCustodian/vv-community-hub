import type { RawChampion, StatBlock, ExplorerStat, Equipment } from "@/types/explorer";

export const MAX_STAT_POINTS = 14;
export const MAX_PER_STAT = 5;
const RETURN_RATE_SCALE = 10;
const STABILITY_SCALE = 8;

export function computeMaxStatPoints(
  returnRate: number,
  stabilityScore: number,
  allChampions: RawChampion[],
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

export function computeEffectiveStats(
  baseStats: StatBlock,
  equipment: Equipment,
): StatBlock {
  const effective = { ...baseStats };
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
  return Object.values(stats).reduce((sum, v) => sum + v, 0);
}
