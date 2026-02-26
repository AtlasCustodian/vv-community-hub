import type { StatBlock } from "@/types/explorer/explorer";
import type { EnemyInstance, CombatTurn, CombatState, RoomSize } from "@/types/explorer/vantheon";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const ENEMY_NAMES: string[] = [
  "Tunnel Crawler",
  "Shadow Wraith",
  "Rogue Bandit",
  "Bone Sentinel",
  "Cave Spider",
  "Iron Husk",
  "Fungal Lurker",
  "Feral Shade",
  "Stone Golem",
  "Pit Stalker",
  "Rust Knight",
  "Void Creeper",
  "Cursed Soldier",
  "Mire Hound",
  "Ashen Revenant",
];

function enemyCountForSize(size: RoomSize): number {
  if (size === "small") return 1;
  if (size === "medium") return randInt(1, 2);
  if (size === "large") return randInt(2, 3);
  return 1;
}

export function generateEnemies(
  floor: number,
  playerEffectiveStats: StatBlock,
  roomSize: RoomSize,
): EnemyInstance[] {
  const count = enemyCountForSize(roomSize);
  const totalPlayerStats = Object.values(playerEffectiveStats).reduce((s, v) => s + v, 0);
  const statBudget = Math.max(2, Math.floor(totalPlayerStats * 0.5));

  const usedNames = new Set<string>();
  const enemies: EnemyInstance[] = [];

  const perEnemyBudget = Math.max(2, Math.floor(statBudget / count));

  for (let i = 0; i < count; i++) {
    let name = pick(ENEMY_NAMES);
    while (usedNames.has(name) && usedNames.size < ENEMY_NAMES.length) {
      name = pick(ENEMY_NAMES);
    }
    usedNames.add(name);

    const bodyShare = Math.random();
    const finesseShare = Math.random();
    const totalShare = bodyShare + finesseShare + Math.random();
    let body = Math.max(1, Math.round((bodyShare / totalShare) * perEnemyBudget) + randInt(-1, 1));
    let finesse = Math.max(1, Math.round((finesseShare / totalShare) * perEnemyBudget) + randInt(-1, 1));
    let spirit = Math.max(1, perEnemyBudget - body - finesse + randInt(-1, 1));

    body = Math.max(1, body);
    finesse = Math.max(1, finesse);
    spirit = Math.max(1, spirit);

    const ac = Math.floor(finesse / 2) + floor;
    const initiative = finesse;
    const maxHP = floor * 3;

    enemies.push({
      id: `enemy-${i}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      body,
      finesse,
      spirit,
      ac,
      initiative,
      currentHP: maxHP,
      maxHP,
    });
  }

  return enemies;
}

export function buildTurnSequence(
  playerInitiative: number,
  enemies: EnemyInstance[],
): CombatTurn[] {
  const alive = enemies.filter((e) => e.currentHP > 0);
  if (alive.length === 0) return [{ actor: "player" }];

  const combatants: { id: string; initiative: number }[] = [
    { id: "player", initiative: playerInitiative },
    ...alive.map((e) => ({ id: e.id, initiative: e.initiative })),
  ];

  combatants.sort((a, b) => {
    if (b.initiative !== a.initiative) return b.initiative - a.initiative;
    return a.id === "player" ? -1 : b.id === "player" ? 1 : 0;
  });

  return combatants.map((c) => ({ actor: c.id }));
}

export function rollD10(): number {
  return Math.floor(Math.random() * 10) + 1;
}

export function rollD4(): number {
  return Math.floor(Math.random() * 4) + 1;
}

export function rollEnemyDie(floor: number): number {
  return randInt(1, floor + 2);
}

export function computeAttackDamage(
  roll: number,
  attackStat: number,
  defenderAC: number,
): number {
  return Math.max(0, roll + attackStat - defenderAC);
}

export function getEnemyAttackStat(enemy: EnemyInstance): {
  stat: "body" | "finesse" | "spirit";
  value: number;
} {
  if (enemy.body >= enemy.finesse && enemy.body >= enemy.spirit) {
    return { stat: "body", value: enemy.body };
  }
  if (enemy.finesse >= enemy.spirit) {
    return { stat: "finesse", value: enemy.finesse };
  }
  return { stat: "spirit", value: enemy.spirit };
}

export function computeCombatGoldReward(floor: number): number {
  return floor * randInt(2, 5);
}

export function initCombatState(
  enemies: EnemyInstance[],
  playerInitiative: number,
  floor: number,
): CombatState {
  const turnSequence = buildTurnSequence(playerInitiative, enemies);
  return {
    enemies: enemies.map((e) => ({ ...e })),
    targetIndex: 0,
    turnSequence,
    currentTurnIdx: 0,
    log: [],
    phase: turnSequence[0]?.actor === "player" ? "playerTurn" : "enemyTurn",
    goldReward: computeCombatGoldReward(floor),
  };
}

export function advanceCombatTurn(state: CombatState, playerInitiative: number): CombatState {
  const alive = state.enemies.filter((e) => e.currentHP > 0);
  if (alive.length === 0) {
    return { ...state, phase: "victory" };
  }

  let nextIdx = (state.currentTurnIdx + 1) % state.turnSequence.length;

  if (nextIdx === 0) {
    const newSeq = buildTurnSequence(playerInitiative, state.enemies);
    return {
      ...state,
      turnSequence: newSeq,
      currentTurnIdx: 0,
      phase: newSeq[0]?.actor === "player" ? "playerTurn" : "enemyTurn",
    };
  }

  const nextTurn = state.turnSequence[nextIdx];

  if (nextTurn.actor !== "player") {
    const enemy = state.enemies.find((e) => e.id === nextTurn.actor);
    if (!enemy || enemy.currentHP <= 0) {
      return advanceCombatTurn({ ...state, currentTurnIdx: nextIdx }, playerInitiative);
    }
  }

  if (state.targetIndex >= 0 && state.enemies[state.targetIndex]?.currentHP <= 0) {
    const newTarget = state.enemies.findIndex((e) => e.currentHP > 0);
    if (newTarget === -1) {
      return { ...state, phase: "victory" };
    }
    return {
      ...state,
      targetIndex: newTarget,
      currentTurnIdx: nextIdx,
      phase: nextTurn.actor === "player" ? "playerTurn" : "enemyTurn",
    };
  }

  return {
    ...state,
    currentTurnIdx: nextIdx,
    phase: nextTurn.actor === "player" ? "playerTurn" : "enemyTurn",
  };
}
