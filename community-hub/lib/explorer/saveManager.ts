import type { GameSave, StatBlock, Equipment, Item, ItemSlot } from "@/types/explorer/explorer";
import { emptyStats, emptyEquipment } from "@/types/explorer/explorer";

const LOCAL_KEY = "rogue-explorer-save";

const OLD_STAT_KEYS = ["dexterity", "strength", "constitution", "intelligence", "wisdom", "charisma"];

function migrateStatBlock(old: Record<string, number>): StatBlock {
  if ("body" in old && "finesse" in old && "spirit" in old) {
    return { body: old.body ?? 0, finesse: old.finesse ?? 0, spirit: old.spirit ?? 0 };
  }
  return {
    body: Math.min(5, (old.strength ?? 0) + (old.constitution ?? 0)),
    finesse: Math.min(5, (old.dexterity ?? 0) + (old.intelligence ?? 0)),
    spirit: Math.min(5, (old.wisdom ?? 0) + (old.charisma ?? 0)),
  };
}

function migrateStatModifiers(mods: Record<string, number>): Partial<StatBlock> {
  if (!mods || typeof mods !== "object") return {};
  const hasOldKeys = Object.keys(mods).some((k) => OLD_STAT_KEYS.includes(k));
  if (!hasOldKeys) return mods as Partial<StatBlock>;
  const result: Partial<StatBlock> = {};
  const bodyVal = (mods.strength ?? 0) + (mods.constitution ?? 0);
  const finesseVal = (mods.dexterity ?? 0) + (mods.intelligence ?? 0);
  const spiritVal = (mods.wisdom ?? 0) + (mods.charisma ?? 0);
  if (bodyVal !== 0) result.body = bodyVal;
  if (finesseVal !== 0) result.finesse = finesseVal;
  if (spiritVal !== 0) result.spirit = spiritVal;
  return result;
}

function migrateSlot(slot: string): ItemSlot {
  if (slot === "back") return "utility";
  return slot as ItemSlot;
}

function migrateItem(item: Item | null): Item | null {
  if (!item) return null;
  return {
    ...item,
    slot: migrateSlot(item.slot),
    statModifiers: migrateStatModifiers(item.statModifiers as Record<string, number>),
  };
}

function migrateEquipment(eq: Record<string, Item | null>): Equipment {
  if (!eq || typeof eq !== "object") return emptyEquipment();
  const base = emptyEquipment();
  for (const [slot, item] of Object.entries(eq)) {
    const newSlot = migrateSlot(slot);
    if (newSlot in base) {
      base[newSlot] = migrateItem(item);
    }
  }
  return base;
}

function migrateSave(data: Record<string, unknown>): GameSave | null {
  try {
    const champ = data.champion as Record<string, unknown> | undefined;
    if (!champ) return null;

    const rawStats = (champ.baseStats ?? {}) as Record<string, number>;
    const needsMigration =
      Object.keys(rawStats).some((k) => OLD_STAT_KEYS.includes(k)) ||
      !("body" in rawStats);

    if (!needsMigration) return data as unknown as GameSave;

    const baseStats = migrateStatBlock(rawStats);
    const equipment = migrateEquipment((champ.equipment ?? {}) as Record<string, Item | null>);
    const inventory = ((champ.inventory ?? []) as Item[]).map((item) => migrateItem(item)!).filter(Boolean);

    const migratedChamp = {
      ...champ,
      baseStats,
      equipment,
      inventory,
      level: champ.level ?? 1,
      persistentBonuses: champ.persistentBonuses ?? { body: 0, finesse: 0, spirit: 0 },
      salvageComponents: champ.salvageComponents ?? 0,
      gold: champ.gold ?? 0,
      keys: champ.keys ?? 0,
    };

    const vantheon = data.vantheon as Record<string, unknown> | null;
    let migratedVantheon = vantheon;
    if (vantheon && !("currentHP" in vantheon)) {
      migratedVantheon = {
        ...vantheon,
        currentHP: 5 + baseStats.body,
        maxHP: 5 + baseStats.body,
        hasKey: false,
        roomsSinceLastKey: 0,
        roomsExplored: vantheon.roomsExplored ?? 0,
        roomsOnCurrentFloor: 0,
        merchantVisitedThisFloor: false,
      };
    }

    return {
      ...data,
      champion: migratedChamp,
      vantheon: migratedVantheon,
    } as unknown as GameSave;
  } catch {
    return null;
  }
}

export function saveToLocal(save: GameSave): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(save));
  } catch {
    console.error("Failed to save to localStorage");
  }
}

export function loadFromLocal(): GameSave | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const migrated = migrateSave(data);
    if (!migrated) {
      clearLocal();
      return null;
    }
    return migrated;
  } catch {
    return null;
  }
}

export function clearLocal(): void {
  try {
    localStorage.removeItem(LOCAL_KEY);
  } catch {
    // ignore
  }
}

export async function saveToServer(save: GameSave): Promise<boolean> {
  try {
    const res = await fetch("/api/explorer/saves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: save.id,
        champion: save.champion,
        vantheon: save.vantheon,
        status: save.status,
      }),
    });
    return res.ok;
  } catch {
    console.error("Failed to save to server");
    return false;
  }
}

export async function loadFromServer(
  saveId: string,
): Promise<GameSave | null> {
  try {
    const res = await fetch(`/api/explorer/saves/${saveId}`);
    if (!res.ok) return null;
    return (await res.json()) as GameSave;
  } catch {
    return null;
  }
}
