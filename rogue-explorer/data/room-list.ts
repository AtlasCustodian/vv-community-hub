import type { RoomTemplate } from "@/types/tower";

export const ROOM_LIST: RoomTemplate[] = [
  // ── Small Rooms ────────────────────────────────────────────────────────────

  {
    id: "small-hallway",
    name: "Hallway",
    size: "small",
    description:
      "A narrow corridor lit by flickering sconces. Cobwebs hang from the ceiling and the air smells of damp stone. Occasionally a loose brick hides a coin or two.",
    materials: ["brick", "metal"],
    minFloor: 1,
    tags: ["passage", "loot-minor"],
    statChecks: ["wisdom"],
  },
  {
    id: "small-closet",
    name: "Closet",
    size: "small",
    description:
      "A cramped storage space barely tall enough to stand in. Shelves line the walls, stacked with dusty crates and forgotten tools. Something useful might be buried under the junk.",
    materials: ["wood", "dirt"],
    minFloor: 1,
    tags: ["storage", "loot-minor"],
    statChecks: ["intelligence"],
  },
  {
    id: "small-treasure",
    name: "Treasure Alcove",
    size: "small",
    description:
      "A shallow alcove set into the wall, sealed behind a rusted grate. Inside, a small chest gleams in the torchlight. Whatever is inside was placed here deliberately.",
    materials: ["metal", "brick"],
    minFloor: 1,
    tags: ["treasure", "loot-guaranteed"],
    statChecks: ["dexterity"],
  },

  // ── Medium Rooms ───────────────────────────────────────────────────────────

  {
    id: "medium-battle",
    name: "Skirmish Chamber",
    size: "medium",
    description:
      "A wide room with scratched floors and dented walls — evidence of many fights before yours. A hostile figure blocks the far exit, weapon drawn.",
    materials: ["brick", "metal"],
    minFloor: 1,
    tags: ["combat", "enemy"],
    statChecks: ["strength", "dexterity"],
  },
  {
    id: "medium-trap",
    name: "Trapped Passage",
    size: "medium",
    description:
      "The floor tiles are uneven and the walls have small holes drilled at ankle height. Pressure plates, tripwires, or worse — only sharp eyes and quick feet will get through unscathed.",
    materials: ["metal", "brick"],
    minFloor: 1,
    tags: ["hazard", "trap"],
    statChecks: ["dexterity", "wisdom"],
  },
  {
    id: "medium-merchant",
    name: "Wandering Merchant",
    size: "medium",
    description:
      "A makeshift stall lit by a hanging lantern. A merchant with a heavy pack offers supplies, repairs, and rumors — for a price. Their eyes linger on your equipment.",
    materials: ["wood", "dirt"],
    minFloor: 1,
    tags: ["social", "trade", "friendly"],
    statChecks: ["charisma", "intelligence"],
  },
  {
    id: "medium-campfire",
    name: "Campfire Rest",
    size: "medium",
    description:
      "A small fire crackles in a cleared-out room, its smoke curling up through a crack in the ceiling. Sitting here restores strength and steadies the nerves before pushing deeper.",
    materials: ["dirt", "wood"],
    minFloor: 1,
    tags: ["rest", "recovery", "safe"],
  },

  // ── Large Rooms ────────────────────────────────────────────────────────────

  {
    id: "large-boss",
    name: "Boss Arena",
    size: "large",
    description:
      "A cavernous hall with vaulted ceilings and pillars scarred by claw marks. The air hums with tension. Something powerful waits at the center, and it has noticed you.",
    materials: ["brick", "metal"],
    minFloor: 3,
    tags: ["combat", "boss", "enemy"],
    statChecks: ["strength", "constitution", "dexterity"],
  },
  {
    id: "large-encampment",
    name: "Encampment",
    size: "large",
    description:
      "A sprawling room filled with tents, bedrolls, and the remains of cook fires. The occupants could be hostile raiders, neutral refugees, or potential allies — it depends on how you approach them.",
    materials: ["dirt", "wood"],
    minFloor: 2,
    tags: ["social", "combat", "multi-encounter"],
    statChecks: ["charisma", "wisdom", "strength"],
  },
  {
    id: "large-obstacle",
    name: "Obstacle Course",
    size: "large",
    description:
      "Collapsed beams, flooded trenches, and crumbling ledges fill the space between you and the far wall. Brute force or nimble footwork — pick your path through the wreckage.",
    materials: ["wood", "metal", "dirt"],
    minFloor: 2,
    tags: ["physical", "traversal"],
    statChecks: ["strength", "dexterity", "constitution"],
  },
  {
    id: "large-puzzle",
    name: "Puzzle Vault",
    size: "large",
    description:
      "Gears, levers, and inscribed panels cover every surface of this sealed chamber. The exit won't open until the mechanism is solved. Rushed attempts tend to trigger unpleasant consequences.",
    materials: ["metal", "brick"],
    minFloor: 2,
    tags: ["puzzle", "mental"],
    statChecks: ["intelligence", "wisdom"],
  },

  // ── Key Rooms ──────────────────────────────────────────────────────────────

  {
    id: "key-hidden-scroll",
    name: "Dusty Storeroom",
    size: "key",
    disguise: "small",
    description:
      "What looks like another forgotten closet. Among the debris, a scroll case is wedged behind a loose brick. The parchment inside bears a seal — or a map fragment — that matches the lock on this floor's sealed door.",
    materials: ["brick", "dirt"],
    minFloor: 1,
    tags: ["key-item", "hidden", "loot-minor"],
    statChecks: ["intelligence", "wisdom"],
  },
  {
    id: "key-informant",
    name: "Cloaked Stranger",
    size: "key",
    disguise: "medium",
    description:
      "A hooded figure sits cross-legged in the corner, watching the entrance. They offer a passphrase or vital clue in exchange for conversation — or coin. Without what they know, the door ahead stays shut.",
    materials: ["wood", "dirt"],
    minFloor: 1,
    tags: ["key-info", "social", "friendly"],
    statChecks: ["charisma", "wisdom"],
  },

  // ── Door Rooms ─────────────────────────────────────────────────────────────

  {
    id: "door-locked-gate",
    name: "Locked Gate",
    size: "door",
    description:
      "A massive iron gate blocks the stairwell leading up. A heavy lock hangs from its center, shaped to accept a specific item. Without the right key, no amount of force will budge it.",
    materials: ["metal", "brick"],
    minFloor: 1,
    tags: ["door", "lock-item"],
    statChecks: ["dexterity"],
  },
  {
    id: "door-passphrase",
    name: "Whispering Door",
    size: "door",
    description:
      "A wooden door carved with faces, their mouths open as if waiting to hear something. Speaking the correct passphrase causes the faces to close their eyes and the door to swing inward. Guessing wrong may have consequences.",
    materials: ["wood", "brick"],
    minFloor: 1,
    tags: ["door", "lock-info"],
    statChecks: ["intelligence", "charisma"],
  },
];

export function getRoomsBySize(size: string): RoomTemplate[] {
  return ROOM_LIST.filter((room) => room.size === size);
}

export function getRoomsForFloor(floor: number): RoomTemplate[] {
  return ROOM_LIST.filter((room) => room.minFloor <= floor);
}
