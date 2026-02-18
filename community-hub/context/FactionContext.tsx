"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type {
  FactionId,
  FactionData,
  FacilitySection,
  FacilityStat,
  GridNode,
  GridEdge,
  Champion,
  UserProfile,
} from "@/data/factionData";
import { getFactionConfig, type FactionConfig } from "@/lib/factionConfig";

interface FactionContextValue {
  factionId: FactionId;
  faction: FactionData;
  setFactionId: (id: FactionId) => void;
  isLoading: boolean;
  /**
   * Apply one tick of simulation to the current faction data.
   * Updates champion return rates (scaled by instability) and
   * facility section health (based on assigned champions' return rates).
   *
   * @param assignments — map of sectionId → championId[] from ChampionAssignmentContext
   */
  advanceTickUpdate: (assignments: Record<string, string[]>) => void;
}

const FactionContext = createContext<FactionContextValue | null>(null);

const STORAGE_KEY = "vantheon-faction";

/**
 * Build a complete FactionData from static config alone (used as initial/fallback).
 */
function buildFromConfig(config: FactionConfig): FactionData {
  return {
    id: config.id,
    name: config.name,
    shortName: config.shortName,
    emoji: config.emoji,
    tagline: config.tagline,
    theme: config.theme,
    navItems: config.navItems,
    userProfile: {
      name: "",
      role: config.userProfileDefaults.role,
      joinDate: config.userProfileDefaults.joinDate,
      bio: config.userProfileDefaults.bio,
      avatarEmoji: config.userProfileDefaults.avatarEmoji,
    },
    stats: config.stats,
    achievements: config.achievements,
    tools: config.tools,
    facilityPageTitle: config.facilityPageTitle,
    facilityPageSubtitle: config.facilityPageSubtitle,
    facilityLabel: config.facilityLabel,
    facilitySections: [],
    gridPageTitle: config.gridPageTitle,
    gridPageSubtitle: config.gridPageSubtitle,
    gridLabel: config.gridLabel,
    gridNodeEmoji: config.gridNodeEmoji,
    gridNodes: [],
    gridEdges: [],
    protocolCategories: config.protocolCategories,
    protocols: config.protocols,
    champions: [],
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Merge DB API response into a FactionData structure using static config for
 * presentation details (icons, colors, stat labels, descriptions).
 */
function mergeApiData(config: FactionConfig, api: any): FactionData {
  // Build user profile: name from DB, role/bio/etc from static config
  const userProfile: UserProfile = {
    name: api.mainUser?.name ?? "",
    role: config.userProfileDefaults.role,
    joinDate: config.userProfileDefaults.joinDate,
    bio: config.userProfileDefaults.bio,
    avatarEmoji: config.userProfileDefaults.avatarEmoji,
  };

  // Map champions from DB
  const champions: Champion[] = (api.champions ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    returnRate: c.returnRate,
    stabilityScore: c.stabilityScore,
    currentAssignment: "Not Assigned",
  }));

  // Map facility sections from DB, enriched with static visuals
  const facilitySections: FacilitySection[] = (api.facilitySections ?? []).map(
    (section: any) => {
      const template = config.sectionTemplates[section.id];
      const visuals = template?.visuals ?? { icon: "🔧", color: config.theme.primary };

      // Convert DB ID (e.g. "fire_boiler_core") → static ID ("boiler-core").
      // DB convention is {factionId}_{name_with_underscores}; views and
      // champion-assignment storage use {name-with-hyphens}.
      const staticId = section.id
        .replace(new RegExp(`^${config.id}_`), "")
        .replace(/_/g, "-");

      // Map stats from DB using stat templates for labels/descriptions
      let stats: FacilityStat[] = [];
      if (template?.statTemplates && section.stats) {
        stats = template.statTemplates.map((tmpl) => ({
          label: tmpl.label,
          value: section.stats[tmpl.dbKey] ?? "—",
          description: tmpl.description,
        }));
      } else if (section.stats) {
        // Fallback: use raw DB stat keys as labels
        stats = Object.entries(section.stats).map(([key, value]) => ({
          label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          value: String(value),
          description: "",
        }));
      }

      return {
        id: staticId,
        name: section.name,
        description: section.description,
        health: section.health,
        icon: visuals.icon,
        color: visuals.color,
        stats,
      };
    }
  );

  // Map grid nodes from DB
  const gridNodes: GridNode[] = (api.gridNodes ?? []).map((node: any) => ({
    id: node.id,
    name: node.name,
    health: node.health,
    x: node.x,
    y: node.y,
    assignedUsers: node.assignedUsers,
  }));

  // Map grid edges from DB
  const gridEdges: GridEdge[] = (api.gridEdges ?? []).map((edge: any) => ({
    from: edge.from,
    to: edge.to,
    health: edge.health,
  }));

  return {
    id: config.id,
    name: config.name,
    shortName: config.shortName,
    emoji: config.emoji,
    tagline: config.tagline,
    theme: config.theme,
    navItems: config.navItems,
    userProfile,
    stats: config.stats,
    achievements: config.achievements,
    tools: config.tools,
    facilityPageTitle: config.facilityPageTitle,
    facilityPageSubtitle: config.facilityPageSubtitle,
    facilityLabel: config.facilityLabel,
    facilitySections,
    gridPageTitle: config.gridPageTitle,
    gridPageSubtitle: config.gridPageSubtitle,
    gridLabel: config.gridLabel,
    gridNodeEmoji: config.gridNodeEmoji,
    gridNodes,
    gridEdges,
    protocolCategories: config.protocolCategories,
    protocols: config.protocols,
    champions,
  };
}

/* eslint-enable @typescript-eslint/no-explicit-any */

export function FactionProvider({ children }: { children: ReactNode }) {
  const [factionId, setFactionIdState] = useState<FactionId>("fire");
  const [mounted, setMounted] = useState(false);
  const [faction, setFaction] = useState<FactionData>(() =>
    buildFromConfig(getFactionConfig("fire"))
  );
  const [isLoading, setIsLoading] = useState(true);

  // Restore faction from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as FactionId | null;
    if (
      stored &&
      ["fire", "earth", "water", "wood", "metal"].includes(stored)
    ) {
      setFactionIdState(stored);
    }
    setMounted(true);
  }, []);

  // Persist faction selection
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, factionId);
      document.documentElement.setAttribute("data-faction", factionId);
    }
  }, [factionId, mounted]);

  // Fetch faction data from API when factionId changes
  const fetchFactionData = useCallback(async (id: FactionId) => {
    const config = getFactionConfig(id);

    // Immediately set a config-only version so the UI isn't blank
    setFaction(buildFromConfig(config));
    setIsLoading(true);

    try {
      const res = await fetch(`/api/factions/${id}`);
      if (!res.ok) {
        console.error(`API error: ${res.status}`);
        // Fall back to static-only data from the old factionData module
        const { getFaction } = await import("@/data/factionData");
        setFaction(getFaction(id));
        return;
      }

      const data = await res.json();
      const merged = mergeApiData(config, data);

      // If the DB returned no facility sections (e.g. not yet seeded), fall back
      if (merged.facilitySections.length === 0 || merged.champions.length === 0) {
        const { getFaction } = await import("@/data/factionData");
        const fallback = getFaction(id);
        setFaction({
          ...merged,
          facilitySections:
            merged.facilitySections.length > 0
              ? merged.facilitySections
              : fallback.facilitySections,
          gridNodes:
            merged.gridNodes.length > 0
              ? merged.gridNodes
              : fallback.gridNodes,
          gridEdges:
            merged.gridEdges.length > 0
              ? merged.gridEdges
              : fallback.gridEdges,
          champions:
            merged.champions.length > 0
              ? merged.champions
              : fallback.champions,
          userProfile:
            merged.userProfile.name
              ? merged.userProfile
              : fallback.userProfile,
        });
      } else {
        setFaction(merged);
      }
    } catch (err) {
      console.error("Failed to fetch faction data:", err);
      // Fall back to hardcoded data
      const { getFaction } = await import("@/data/factionData");
      setFaction(getFaction(id));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger fetch when mounted or factionId changes
  useEffect(() => {
    if (mounted) {
      fetchFactionData(factionId);
    }
  }, [factionId, mounted, fetchFactionData]);

  const setFactionId = (id: FactionId) => {
    setFactionIdState(id);
  };

  /**
   * Atomically update champions and facility sections for one tick.
   *
   * Champion return-rate change:
   *   - Max absolute delta is 0.001.
   *   - Lower stability → larger expected change (instabilityFactor uses a
   *     gentle curve with a 0.3 floor so even stable champions see movement).
   *   - ~10–20 % chance of no change (higher for stable champions).
   *
   * Facility section health:
   *   - Unassigned hardware decays 0.1–0.5 per tick.
   *   - Assigned hardware improves, degrades, or stays flat depending on
   *     the average return rate of the champions stationed there.
   */
  const advanceTickUpdate = useCallback(
    (assignments: Record<string, string[]>) => {
      setFaction((prev) => {
        // 1. Update champion return rates
        const updatedChampions = prev.champions.map((champion) => {
          // Gentle curve: even stability-98 champions get a floor of 0.3,
          // while stability-65 champions reach ~1.0.
          const raw = (100 - champion.stabilityScore) / 50;
          const instabilityFactor = Math.min(1, Math.max(0.3, raw));
          const MAX_DELTA = 0.001;

          // Higher stability ⇒ slightly higher chance of no change
          const noChangeChance = 0.1 + 0.1 * (1 - instabilityFactor);
          if (Math.random() < noChangeChance) {
            return champion; // no change this tick
          }

          const delta =
            (Math.random() * 2 - 1) * MAX_DELTA * instabilityFactor;

          return {
            ...champion,
            returnRate: champion.returnRate + delta,
          };
        });

        // 2. Update facility section health
        const updatedSections = prev.facilitySections.map((section) => {
          const assignedIds = assignments[section.id] ?? [];
          let healthDelta: number;

          if (assignedIds.length === 0) {
            // No champions → slight decay
            healthDelta = -(Math.random() * 0.4 + 0.1);
          } else {
            // Compute average return rate of assigned champions
            const assigned = assignedIds
              .map((id) => updatedChampions.find((c) => c.id === id))
              .filter(Boolean) as typeof updatedChampions;

            const avgRate =
              assigned.length > 0
                ? assigned.reduce((sum, c) => sum + c.returnRate, 0) /
                  assigned.length
                : 0;

            if (avgRate > 0.001) {
              healthDelta = Math.random() * 0.3 + 0.05; // positive
            } else if (avgRate < -0.001) {
              healthDelta = -(Math.random() * 0.3 + 0.05); // negative
            } else {
              healthDelta = (Math.random() - 0.5) * 0.15; // roughly neutral
            }
          }

          const newHealth = Math.min(
            100,
            Math.max(0, section.health + healthDelta),
          );

          return {
            ...section,
            health: Math.round(newHealth * 10) / 10,
          };
        });

        return {
          ...prev,
          champions: updatedChampions,
          facilitySections: updatedSections,
        };
      });
    },
    [],
  );

  return (
    <FactionContext.Provider
      value={{ factionId, faction, setFactionId, isLoading, advanceTickUpdate }}
    >
      {children}
    </FactionContext.Provider>
  );
}

export function useFaction(): FactionContextValue {
  const ctx = useContext(FactionContext);
  if (!ctx) throw new Error("useFaction must be used within a FactionProvider");
  return ctx;
}
