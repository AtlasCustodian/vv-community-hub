import type { RoomTemplate } from "@/types/explorer/vantheon";

/**
 * Legacy static room list kept for reference.
 * The procedural generator in lib/roomGenerator.ts now creates rooms dynamically.
 */
export const ROOM_LIST: RoomTemplate[] = [
  {
    id: "small-hallway",
    name: "Hallway",
    size: "small",
    roomType: "hallway",
    description: "A narrow corridor lit by flickering sconces.",
    materials: ["brick", "metal"],
    minFloor: 1,
    tags: ["passage"],
    challengeCount: 1,
    challengeThemes: ["trap"],
  },
  {
    id: "small-closet",
    name: "Closet",
    size: "small",
    roomType: "chamber",
    description: "A cramped storage space barely tall enough to stand in.",
    materials: ["wood", "dirt"],
    minFloor: 1,
    tags: ["storage"],
    challengeCount: 1,
    challengeThemes: ["search"],
  },
  {
    id: "medium-battle",
    name: "Skirmish Chamber",
    size: "medium",
    roomType: "chamber",
    description: "A wide room with scratched floors and dented walls.",
    materials: ["brick", "metal"],
    minFloor: 1,
    tags: ["combat"],
    challengeCount: 2,
    challengeThemes: ["combat", "survival"],
  },
  {
    id: "medium-merchant",
    name: "Wandering Merchant",
    size: "medium",
    roomType: "camp",
    description: "A makeshift stall lit by a hanging lantern.",
    materials: ["wood", "dirt"],
    minFloor: 1,
    tags: ["social", "trade"],
    challengeCount: 2,
    challengeThemes: ["trade", "social"],
  },
  {
    id: "large-boss",
    name: "Boss Arena",
    size: "large",
    roomType: "chamber",
    description: "A cavernous hall with vaulted ceilings and pillars scarred by claw marks.",
    materials: ["brick", "metal"],
    minFloor: 3,
    tags: ["combat", "boss"],
    challengeCount: 3,
    challengeThemes: ["combat", "survival", "boss"],
  },
  {
    id: "key-hidden-scroll",
    name: "Dusty Storeroom",
    size: "key",
    roomType: "shrine",
    description: "Among the debris, a scroll case is wedged behind a loose brick.",
    materials: ["brick", "dirt"],
    minFloor: 1,
    tags: ["key-item"],
    challengeCount: 0,
    challengeThemes: [],
  },
  {
    id: "door-locked-gate",
    name: "Locked Gate",
    size: "door",
    roomType: "chamber",
    description: "A massive iron gate blocks the stairwell leading up.",
    materials: ["metal", "brick"],
    minFloor: 1,
    tags: ["door"],
    challengeCount: 0,
    challengeThemes: [],
  },
];

export function getRoomsBySize(size: string): RoomTemplate[] {
  return ROOM_LIST.filter((room) => room.size === size);
}

export function getRoomsForFloor(floor: number): RoomTemplate[] {
  return ROOM_LIST.filter((room) => room.minFloor <= floor);
}
