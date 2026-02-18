"use client";

import { useEffect, useRef } from "react";
import { useTick } from "@/context/TickContext";
import { useFaction } from "@/context/FactionContext";
import { useChampionAssignment } from "@/context/ChampionAssignmentContext";
import type { FactionId } from "@/data/factionData";

const ALL_FACTION_IDS: FactionId[] = ["fire", "earth", "water", "wood", "metal"];

/**
 * Invisible component that watches the tick counter and triggers all
 * time-based simulation updates (champion return rates, facility health)
 * for EVERY faction, not just the one currently being viewed.
 *
 * Must be rendered inside TickProvider, FactionProvider, and
 * ChampionAssignmentProvider.
 */
export default function TickEffects() {
  const { tick } = useTick();
  const { advanceTickUpdate } = useFaction();
  const { getFactionAssignments } = useChampionAssignment();
  const prevTick = useRef(tick);

  useEffect(() => {
    if (tick === prevTick.current) return;
    prevTick.current = tick;

    const allAssignments = {} as Record<FactionId, Record<string, string[]>>;
    for (const fid of ALL_FACTION_IDS) {
      allAssignments[fid] = getFactionAssignments(fid);
    }
    advanceTickUpdate(allAssignments);
  }, [tick, getFactionAssignments, advanceTickUpdate]);

  return null;
}
