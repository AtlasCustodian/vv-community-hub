import type { ItemSlot } from "@/types/explorer/explorer";

import { HEAD_ART, HEAD_ART_ALIASES, HEAD_ART_KEYS } from "./headArt";
import { CHEST_ART, CHEST_ART_ALIASES, CHEST_ART_KEYS } from "./chestArt";
import { LEGS_ART, LEGS_ART_ALIASES, LEGS_ART_KEYS } from "./legsArt";
import { RIGHT_HAND_ART, RIGHT_HAND_ART_ALIASES, RIGHT_HAND_ART_KEYS } from "./rightHandArt";
import { LEFT_HAND_ART, LEFT_HAND_ART_ALIASES, LEFT_HAND_ART_KEYS } from "./leftHandArt";
import { FEET_ART, FEET_ART_ALIASES, FEET_ART_KEYS } from "./feetArt";
import { UTILITY_ART, UTILITY_ART_ALIASES, UTILITY_ART_KEYS } from "./utilityArt";

export const ITEM_ART_MAP: Record<string, React.FC<{ color?: string; size?: number; className?: string }>> = {
  ...HEAD_ART,
  ...HEAD_ART_ALIASES,
  ...CHEST_ART,
  ...CHEST_ART_ALIASES,
  ...LEGS_ART,
  ...LEGS_ART_ALIASES,
  ...RIGHT_HAND_ART,
  ...RIGHT_HAND_ART_ALIASES,
  ...LEFT_HAND_ART,
  ...LEFT_HAND_ART_ALIASES,
  ...FEET_ART,
  ...FEET_ART_ALIASES,
  ...UTILITY_ART,
  ...UTILITY_ART_ALIASES,
};

export const SLOT_ART_KEYS: Record<ItemSlot, string[]> = {
  head: HEAD_ART_KEYS,
  chest: CHEST_ART_KEYS,
  legs: LEGS_ART_KEYS,
  rightHand: RIGHT_HAND_ART_KEYS,
  leftHand: LEFT_HAND_ART_KEYS,
  feet: FEET_ART_KEYS,
  utility: UTILITY_ART_KEYS,
};
