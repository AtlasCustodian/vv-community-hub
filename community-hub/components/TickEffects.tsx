"use client";

import { useEffect, useRef } from "react";
import { useTick } from "@/context/TickContext";
import { useFaction } from "@/context/FactionContext";
import { useChampionAssignment } from "@/context/ChampionAssignmentContext";

/**
 * Invisible component that watches the tick counter and triggers all
 * time-based simulation updates (champion return rates, facility health).
 *
 * Must be rendered inside TickProvider, FactionProvider, and
 * ChampionAssignmentProvider.
 */
export default function TickEffects() {
  const { tick } = useTick();
  const { factionId, advanceTickUpdate } = useFaction();
  const { getFactionAssignments } = useChampionAssignment();
  const prevTick = useRef(tick);

  useEffect(() => {
    if (tick === prevTick.current) return;
    prevTick.current = tick;

    const assignments = getFactionAssignments(factionId);
    advanceTickUpdate(assignments);
  }, [tick, factionId, getFactionAssignments, advanceTickUpdate]);

  return null;
}
