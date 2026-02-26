import type { ExplorerStat } from "@/types/explorer/explorer";
import type { AbilityCategory, ChallengeResult } from "@/types/explorer/vantheon";

export const CATEGORY_STATS: Record<AbilityCategory, ExplorerStat[]> = {
  physical: ["body"],
  skill: ["finesse"],
  mental: ["spirit"],
};

export function statToCategory(stat: ExplorerStat): AbilityCategory {
  if (stat === "body") return "physical";
  if (stat === "finesse") return "skill";
  return "mental";
}

export function rollD10(): number {
  return Math.floor(Math.random() * 10) + 1;
}

export function rollAbilityCheck(
  statValue: number,
): { roll: number; total: number } {
  const roll = rollD10();
  return { roll, total: roll + statValue };
}

export function resolveCheck(
  total: number,
  dc: number,
): { success: boolean; margin: number } {
  const margin = Math.abs(total - dc);
  return { success: total >= dc, margin };
}

export function computeHPLoss(margin: number): number {
  return Math.max(1, Math.ceil(margin / 2) + 1);
}

export function performAbilityCheck(
  stat: ExplorerStat,
  statValue: number,
  dc: number,
  optionIndex: number,
): ChallengeResult {
  const { roll, total } = rollAbilityCheck(statValue);
  const { success, margin } = resolveCheck(total, dc);
  const hpChange = success ? 0 : -computeHPLoss(margin);

  return {
    optionIndex,
    stat,
    roll,
    total,
    dc,
    success,
    hpChange,
  };
}
