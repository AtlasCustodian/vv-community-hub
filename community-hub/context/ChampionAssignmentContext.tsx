"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { FactionId } from "@/data/factionData";

const MAX_CHAMPIONS_PER_SECTION = 5;

/**
 * Assignments shape:
 *   { [factionId]: { [sectionId]: championId[] } }
 */
type Assignments = Record<string, Record<string, string[]>>;

interface ChampionAssignmentContextValue {
  /** Get the champion IDs assigned to a specific section within the current faction */
  getAssigned: (factionId: FactionId, sectionId: string) => string[];

  /** Assign a champion to a section (max 5 per section). Removes them from any prior section. */
  assignChampion: (
    factionId: FactionId,
    sectionId: string,
    championId: string
  ) => void;

  /** Unassign a champion from a section */
  unassignChampion: (
    factionId: FactionId,
    sectionId: string,
    championId: string
  ) => void;

  /** Get the section a champion is currently assigned to (or null) */
  getChampionAssignment: (
    factionId: FactionId,
    championId: string
  ) => string | null;

  /** Full assignment map for a faction */
  getFactionAssignments: (factionId: FactionId) => Record<string, string[]>;
}

const ChampionAssignmentContext =
  createContext<ChampionAssignmentContextValue | null>(null);

const STORAGE_KEY = "vantheon-champion-assignments";

export function ChampionAssignmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [assignments, setAssignments] = useState<Assignments>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAssignments(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    }
  }, [assignments, mounted]);

  const getAssigned = useCallback(
    (factionId: FactionId, sectionId: string): string[] => {
      return assignments[factionId]?.[sectionId] ?? [];
    },
    [assignments]
  );

  const getFactionAssignments = useCallback(
    (factionId: FactionId): Record<string, string[]> => {
      return assignments[factionId] ?? {};
    },
    [assignments]
  );

  const getChampionAssignment = useCallback(
    (factionId: FactionId, championId: string): string | null => {
      const factionMap = assignments[factionId];
      if (!factionMap) return null;
      for (const [sectionId, ids] of Object.entries(factionMap)) {
        if (ids.includes(championId)) return sectionId;
      }
      return null;
    },
    [assignments]
  );

  const assignChampion = useCallback(
    (factionId: FactionId, sectionId: string, championId: string) => {
      setAssignments((prev) => {
        const factionMap = { ...(prev[factionId] ?? {}) };

        // Remove champion from any previous section in this faction
        for (const [sid, ids] of Object.entries(factionMap)) {
          if (ids.includes(championId)) {
            factionMap[sid] = ids.filter((id) => id !== championId);
            if (factionMap[sid].length === 0) {
              delete factionMap[sid];
            }
          }
        }

        // Add to new section (respect max)
        const current = factionMap[sectionId] ?? [];
        if (current.length >= MAX_CHAMPIONS_PER_SECTION) return prev;
        if (current.includes(championId)) return prev;

        factionMap[sectionId] = [...current, championId];

        return { ...prev, [factionId]: factionMap };
      });
    },
    []
  );

  const unassignChampion = useCallback(
    (factionId: FactionId, sectionId: string, championId: string) => {
      setAssignments((prev) => {
        const factionMap = { ...(prev[factionId] ?? {}) };
        const current = factionMap[sectionId] ?? [];
        factionMap[sectionId] = current.filter((id) => id !== championId);
        if (factionMap[sectionId].length === 0) {
          delete factionMap[sectionId];
        }
        return { ...prev, [factionId]: factionMap };
      });
    },
    []
  );

  return (
    <ChampionAssignmentContext.Provider
      value={{
        getAssigned,
        assignChampion,
        unassignChampion,
        getChampionAssignment,
        getFactionAssignments,
      }}
    >
      {children}
    </ChampionAssignmentContext.Provider>
  );
}

export function useChampionAssignment(): ChampionAssignmentContextValue {
  const ctx = useContext(ChampionAssignmentContext);
  if (!ctx)
    throw new Error(
      "useChampionAssignment must be used within a ChampionAssignmentProvider"
    );
  return ctx;
}
