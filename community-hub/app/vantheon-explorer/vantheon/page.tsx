"use client";

import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { GameSave, Item, ItemSlot, ExplorerStat } from "@/types/explorer/explorer";
import { SLOT_LABELS } from "@/types/explorer/explorer";
import type { RoomInstance, ChallengeResult, VantheonState, CombatState, ParkourGrid, PuzzleCard } from "@/types/explorer/vantheon";
import { computeEffectiveStats, computeMaxHP, computeWeightLimit, computeCurrentWeight, computeArmorClass, computeInitiative, computeSpeed } from "@/lib/explorer/statBuilder";
import { computeSalvageYield, computeUpgradeCost, applyUpgrade, computeItemGoldPrice } from "@/lib/explorer/salvage";
import { loadFromLocal, saveToLocal } from "@/lib/explorer/saveManager";
import { FACTION_THEMES } from "@/lib/explorer/factionThemes";
import { generateRoom, initVantheonState } from "@/lib/explorer/roomGenerator";
import StatsPanel from "@/components/explorer/StatsPanel";
import InventoryPanel from "@/components/explorer/InventoryPanel";
import GateRoom from "@/components/explorer/GateRoom";
import RoomArt from "@/components/explorer/RoomArt";
import ChallengePanel from "@/components/explorer/ChallengePanel";
import ItemTooltip from "@/components/explorer/ItemTooltip";
import ContextMenu from "@/components/explorer/ContextMenu";
import type { ContextMenuOption } from "@/components/explorer/ContextMenu";
import ConfirmDialog from "@/components/explorer/ConfirmDialog";
import UpgradeModal from "@/components/explorer/UpgradeModal";
import LevelUpModal from "@/components/explorer/LevelUpModal";
import MerchantPanel from "@/components/explorer/MerchantPanel";
import CombatPanel from "@/components/explorer/CombatPanel";
import ParkourPanel from "@/components/explorer/ParkourPanel";
import PuzzlePanel from "@/components/explorer/PuzzlePanel";
import { initCombatState } from "@/lib/explorer/combatEngine";
import { generateParkourGrid, computeParkourGoldReward } from "@/lib/explorer/parkourGenerator";
import { generatePuzzleCards, computePuzzleMaxFlips, computePuzzleGoldReward } from "@/lib/explorer/puzzleGenerator";
import { statToCategory } from "@/lib/explorer/abilityCheck";
import { createHealthPotion } from "@/data/explorer/itemCatalog";

type ExplorationPhase = "gate" | "room" | "combat" | "parkour" | "puzzle" | "loot" | "goldLoot" | "merchant" | "gameOver";

const INVENTORY_MAX = 10;

interface ContextMenuState {
  item: Item;
  source: "inventory" | "equipment";
  index?: number;
  slot?: ItemSlot;
  x: number;
  y: number;
}

interface ToastState {
  message: string;
  id: number;
}

function VantheonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const saveId = searchParams.get("saveId");
  const [save, setSave] = useState<GameSave | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<ExplorationPhase>("gate");
  const [currentRoom, setCurrentRoom] = useState<RoomInstance | null>(null);
  const [vantheonState, setVantheonState] = useState<VantheonState | null>(null);
  const [pendingLoot, setPendingLoot] = useState<Item | null>(null);
  const [pendingGold, setPendingGold] = useState<number | null>(null);
  const [roomKey, setRoomKey] = useState(0);
  const [activeCombat, setActiveCombat] = useState<CombatState | null>(null);
  const [parkourGrid, setParkourGrid] = useState<ParkourGrid | null>(null);
  const [parkourSpeed, setParkourSpeed] = useState(0);
  const [parkourGoldReward, setParkourGoldReward] = useState(0);
  const [puzzleCards, setPuzzleCards] = useState<PuzzleCard[] | null>(null);
  const [puzzleMaxFlips, setPuzzleMaxFlips] = useState(0);
  const [puzzleGoldReward, setPuzzleGoldReward] = useState(0);

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [confirmDrop, setConfirmDrop] = useState<{ item: Item; source: "inventory" | "equipment"; index?: number; slot?: ItemSlot } | null>(null);
  const [upgradeTarget, setUpgradeTarget] = useState<{ item: Item; source: "inventory" | "equipment"; index?: number; slot?: ItemSlot } | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const pendingAfterLevelUp = useRef<{
    type: "advance";
    baseSave: GameSave;
    ts: VantheonState;
  } | null>(null);

  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    const id = Date.now();
    setToast({ message, id });
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

  useEffect(() => {
    const local = loadFromLocal();
    if (local && (!saveId || local.id === saveId)) {
      setSave(local);
      if (local.vantheon) {
        setVantheonState(local.vantheon);
        if (local.vantheon.currentHP <= 0) {
          setPhase("gameOver");
        } else if (local.status === "exploring") {
          setPhase("gate");
        }
      }
      setLoading(false);
      return;
    }
    if (saveId) {
      fetch(`/api/saves/${saveId}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) {
            setSave(data);
            if (data.vantheon) setVantheonState(data.vantheon);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [saveId]);

  useEffect(() => {
    if (save) {
      document.documentElement.dataset.faction = save.champion.factionId;
    }
  }, [save]);

  const persistSave = useCallback(
    (updatedSave: GameSave) => {
      setSave(updatedSave);
      saveToLocal(updatedSave);
    },
    [],
  );

  const effective = useMemo(() => {
    if (!save) return null;
    return computeEffectiveStats(save.champion.baseStats, save.champion.equipment, save.champion.persistentBonuses);
  }, [save]);

  // ── Exploration handlers ──────────────────────────────────────────────

  const handleEnterGate = useCallback(() => {
    if (!save || !effective) return;
    const maxHP = computeMaxHP(effective);
    const ts = initVantheonState(maxHP);
    const room = generateRoom(ts, effective);

    setVantheonState(ts);
    setCurrentRoom(room);
    setPhase("room");
    setRoomKey((k) => k + 1);

    const updated: GameSave = {
      ...save,
      status: "exploring",
      vantheon: ts,
      updatedAt: new Date().toISOString(),
    };
    persistSave(updated);
  }, [save, effective, persistSave]);

  const handleChallengeResolve = useCallback(
    (result: ChallengeResult) => {
      if (!vantheonState || !save || !currentRoom) return;

      const newHP = Math.max(0, vantheonState.currentHP + result.hpChange);
      const updatedRoom: RoomInstance = {
        ...currentRoom,
        challengeResults: [...currentRoom.challengeResults, result],
      };
      setCurrentRoom(updatedRoom);

      const updatedTS: VantheonState = { ...vantheonState, currentHP: newHP };
      setVantheonState(updatedTS);

      let updatedSave: GameSave = { ...save, vantheon: updatedTS, updatedAt: new Date().toISOString() };

      if (newHP <= 0) {
        updatedSave = { ...updatedSave, status: "completed" };
        persistSave(updatedSave);
        setTimeout(() => setPhase("gameOver"), 600);
        return;
      }

      if (result.success && statToCategory(result.stat) === "mental" && Math.random() < 0.25) {
        if (updatedSave.champion.inventory.length < INVENTORY_MAX) {
          const potion = createHealthPotion();
          updatedSave = {
            ...updatedSave,
            champion: {
              ...updatedSave.champion,
              inventory: [...updatedSave.champion.inventory, potion],
            },
          };
          showToast("Health Potion found!");
        }
      }

      persistSave(updatedSave);
    },
    [vantheonState, save, currentRoom, persistSave],
  );

  const handleChallengeProceed = useCallback(() => {
    if (!currentRoom || !vantheonState) return;
    const nextIndex = currentRoom.currentChallengeIndex + 1;
    if (nextIndex < currentRoom.challenges.length) {
      setCurrentRoom({ ...currentRoom, currentChallengeIndex: nextIndex });
      return;
    }
    const anySuccess = currentRoom.challengeResults.some((r) => r.success);
    if (anySuccess) {
      if (currentRoom.loot) {
        setPendingLoot(currentRoom.loot);
        setPhase("loot");
      } else if (currentRoom.goldLoot != null && currentRoom.goldLoot > 0) {
        setPendingGold(currentRoom.goldLoot);
        setPhase("goldLoot");
      } else {
        advanceToNextRoom();
      }
    } else {
      advanceToNextRoom();
    }
  }, [currentRoom, vantheonState]);

  const executeAdvance = useCallback((baseSave: GameSave, ts: VantheonState) => {
    const eff = computeEffectiveStats(baseSave.champion.baseStats, baseSave.champion.equipment, baseSave.champion.persistentBonuses);
    const updatedTS: VantheonState = {
      ...ts,
      roomsExplored: ts.roomsExplored + 1,
      roomsSinceLastKey: ts.roomsSinceLastKey + 1,
      roomsOnCurrentFloor: ts.roomsOnCurrentFloor + 1,
    };
    const room = generateRoom(updatedTS, eff);
    if (room.template.size === "merchant") {
      updatedTS.merchantVisitedThisFloor = true;
    }
    setVantheonState(updatedTS);
    setCurrentRoom(room);
    setPendingLoot(null);
    setPendingGold(null);
    setActiveCombat(null);
    setParkourGrid(null);
    setPuzzleCards(null);
    setPhase("room");
    setRoomKey((k) => k + 1);
    persistSave({ ...baseSave, vantheon: updatedTS, updatedAt: new Date().toISOString() });
  }, [persistSave]);

  const advanceToNextRoom = useCallback((baseSave?: GameSave, overrideTS?: VantheonState) => {
    const s = baseSave ?? save;
    const ts = overrideTS ?? vantheonState;
    if (!ts || !s) return;
    const newRoomsExplored = ts.roomsExplored + 1;
    const currentLevel = s.champion.level ?? 1;
    const roomsSinceLastLevelUp = newRoomsExplored - ts.roomsAtLastLevelUp;
    if (roomsSinceLastLevelUp >= 10 + currentLevel) {
      pendingAfterLevelUp.current = { type: "advance", baseSave: s, ts };
      setShowLevelUp(true);
      return;
    }
    executeAdvance(s, ts);
  }, [vantheonState, save, executeAdvance]);

  const handleTakeLoot = useCallback(() => {
    if (!save || !pendingLoot) return;
    const inventory = [...save.champion.inventory];
    if (inventory.length < INVENTORY_MAX) {
      inventory.push(pendingLoot);
    }
    const updatedSave: GameSave = {
      ...save,
      champion: { ...save.champion, inventory },
      updatedAt: new Date().toISOString(),
    };
    setPendingLoot(null);
    advanceToNextRoom(updatedSave);
  }, [save, pendingLoot, advanceToNextRoom]);

  const handleDiscardLoot = useCallback(() => {
    setPendingLoot(null);
    advanceToNextRoom();
  }, [advanceToNextRoom]);

  const handleTakeGold = useCallback(() => {
    if (!save || pendingGold == null) return;
    const newGold = (save.champion.gold ?? 0) + pendingGold;
    const updatedSave: GameSave = {
      ...save,
      champion: { ...save.champion, gold: newGold },
      updatedAt: new Date().toISOString(),
    };
    setPendingGold(null);
    advanceToNextRoom(updatedSave);
  }, [save, pendingGold, advanceToNextRoom]);

  const handleDiscardGold = useCallback(() => {
    setPendingGold(null);
    advanceToNextRoom();
  }, [advanceToNextRoom]);

  const handlePickupKey = useCallback(() => {
    if (!vantheonState || !save) return;
    const newKeys = (save.champion.keys ?? 0) + 1;
    const updatedTS: VantheonState = { ...vantheonState, hasKey: true, roomsSinceLastKey: 0 };
    const updatedSave: GameSave = {
      ...save,
      champion: { ...save.champion, keys: newKeys },
      vantheon: updatedTS,
      updatedAt: new Date().toISOString(),
    };
    setVantheonState(updatedTS);
    advanceToNextRoom(updatedSave, updatedTS);
  }, [vantheonState, save, advanceToNextRoom]);

  const executeDoorTransition = useCallback((baseSave: GameSave, ts: VantheonState) => {
    const eff = computeEffectiveStats(baseSave.champion.baseStats, baseSave.champion.equipment, baseSave.champion.persistentBonuses);
    const newKeys = Math.max(0, (baseSave.champion.keys ?? 0) - 1);
    const updatedTS: VantheonState = {
      ...ts,
      currentFloor: ts.currentFloor + 1,
      hasKey: newKeys > 0,
      roomsSinceLastKey: 0,
      roomsExplored: ts.roomsExplored + 1,
      roomsOnCurrentFloor: 0,
      merchantVisitedThisFloor: false,
    };
    setVantheonState(updatedTS);
    const room = generateRoom(updatedTS, eff);
    setCurrentRoom(room);
    setPhase("room");
    setRoomKey((k) => k + 1);
    persistSave({
      ...baseSave,
      champion: { ...baseSave.champion, keys: newKeys },
      vantheon: updatedTS,
      updatedAt: new Date().toISOString(),
    });
  }, [persistSave]);

  const handleUseDoor = useCallback(() => {
    if (!vantheonState || !save) return;
    executeDoorTransition(save, vantheonState);
  }, [vantheonState, save, executeDoorTransition]);

  const handleMerchantBuy = useCallback((itemIndex: number) => {
    if (!save || !currentRoom?.merchantItems) return;
    const item = currentRoom.merchantItems[itemIndex];
    if (!item) return;
    const price = computeItemGoldPrice(item, vantheonState?.currentFloor ?? 1);
    const currentGold = save.champion.gold ?? 0;
    if (currentGold < price) {
      showToast("Not enough Gold");
      return;
    }
    if (save.champion.inventory.length >= INVENTORY_MAX) {
      showToast("Inventory is full");
      return;
    }
    const newInventory = [...save.champion.inventory, item];
    const newMerchantItems = [...currentRoom.merchantItems];
    newMerchantItems.splice(itemIndex, 1);
    setCurrentRoom({ ...currentRoom, merchantItems: newMerchantItems });
    persistSave({
      ...save,
      champion: {
        ...save.champion,
        gold: currentGold - price,
        inventory: newInventory,
      },
      updatedAt: new Date().toISOString(),
    });
    showToast(`Bought ${item.name} for ${price}g`);
  }, [save, currentRoom, persistSave]);

  const handleMerchantHeal = useCallback((amount: number) => {
    if (!save || !vantheonState) return;
    const floor = vantheonState.currentFloor;
    const cost = amount * floor;
    const currentGold = save.champion.gold ?? 0;
    if (currentGold < cost) {
      showToast("Not enough Gold");
      return;
    }
    const newHP = Math.min(vantheonState.maxHP, vantheonState.currentHP + amount);
    const updatedTS: VantheonState = { ...vantheonState, currentHP: newHP };
    setVantheonState(updatedTS);
    persistSave({
      ...save,
      champion: { ...save.champion, gold: currentGold - cost },
      vantheon: updatedTS,
      updatedAt: new Date().toISOString(),
    });
    showToast(`Healed ${amount} HP for ${cost}g`);
  }, [save, vantheonState, persistSave]);

  const handleMerchantLeave = useCallback(() => {
    advanceToNextRoom();
  }, [advanceToNextRoom]);

  const handleLevelUp = useCallback((stat: ExplorerStat) => {
    const pending = pendingAfterLevelUp.current;
    if (!pending) return;

    const { baseSave, ts } = pending;
    const newBaseStats = { ...baseSave.champion.baseStats };
    newBaseStats[stat] += 1;
    const newLevel = (baseSave.champion.level ?? 1) + 1;
    const oldBonuses = baseSave.champion.persistentBonuses ?? { body: 0, finesse: 0, spirit: 0 };
    const newBonuses = { ...oldBonuses, [stat]: (oldBonuses[stat] ?? 0) + 1 };

    const leveledSave: GameSave = {
      ...baseSave,
      champion: { ...baseSave.champion, level: newLevel, baseStats: newBaseStats },
      updatedAt: new Date().toISOString(),
    };

    let leveledTS = ts;
    if (stat === "body") {
      const newEffective = computeEffectiveStats(newBaseStats, baseSave.champion.equipment, newBonuses);
      const newMaxHP = computeMaxHP(newEffective);
      leveledTS = { ...ts, maxHP: newMaxHP, currentHP: ts.currentHP + 1 };
    }

    leveledTS = { ...leveledTS, roomsAtLastLevelUp: ts.roomsExplored };

    const leveledSaveWithBonuses: GameSave = {
      ...leveledSave,
      champion: { ...leveledSave.champion, persistentBonuses: newBonuses },
    };

    pendingAfterLevelUp.current = null;
    setShowLevelUp(false);
    showToast(`Level Up! ${stat.charAt(0).toUpperCase() + stat.slice(1)} +1`);

    fetch("/api/explorer/levels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        championId: baseSave.champion.championId,
        explorer_level: newLevel,
        bonus_body: newBonuses.body,
        bonus_finesse: newBonuses.finesse,
        bonus_spirit: newBonuses.spirit,
        highest_floor: leveledTS.currentFloor,
        total_runs: 1,
      }),
    }).catch(() => {});

    executeAdvance(leveledSaveWithBonuses, leveledTS);
  }, [executeAdvance]);

  // ── Combat handlers ──────────────────────────────────────────────────

  const handleStartCombat = useCallback((optionIndex: number) => {
    if (!currentRoom?.enemies || !effective || !vantheonState || !save) return;
    const playerInitiative = computeInitiative(effective);
    const combat = initCombatState(
      currentRoom.enemies,
      playerInitiative,
      vantheonState.currentFloor,
    );
    setActiveCombat(combat);
    setPhase("combat");
  }, [currentRoom, effective, vantheonState, save]);

  const handleCombatUpdate = useCallback((updatedCombat: CombatState, hpChange: number) => {
    if (!vantheonState || !save) return;
    setActiveCombat(updatedCombat);

    if (hpChange !== 0) {
      const newHP = Math.max(0, vantheonState.currentHP + hpChange);
      const updatedTS: VantheonState = { ...vantheonState, currentHP: newHP };
      setVantheonState(updatedTS);
      persistSave({ ...save, vantheon: updatedTS, updatedAt: new Date().toISOString() });

      if (newHP <= 0) {
        const updated: GameSave = {
          ...save,
          vantheon: { ...updatedTS, currentHP: 0 },
          status: "completed",
          updatedAt: new Date().toISOString(),
        };
        persistSave(updated);
        setTimeout(() => setPhase("gameOver"), 800);
      }
    }
  }, [vantheonState, save, persistSave]);

  const handleCombatVictory = useCallback((goldReward: number) => {
    if (!save || !currentRoom) return;
    const newGold = (save.champion.gold ?? 0) + goldReward;
    const updatedSave: GameSave = {
      ...save,
      champion: { ...save.champion, gold: newGold },
      updatedAt: new Date().toISOString(),
    };
    setActiveCombat(null);

    if (currentRoom.loot) {
      setPendingLoot(currentRoom.loot);
      persistSave(updatedSave);
      setPhase("loot");
    } else if (currentRoom.goldLoot != null && currentRoom.goldLoot > 0) {
      setPendingGold(currentRoom.goldLoot);
      persistSave(updatedSave);
      setPhase("goldLoot");
    } else {
      advanceToNextRoom(updatedSave);
    }
  }, [save, currentRoom, persistSave, advanceToNextRoom]);

  const handleCombatDefeat = useCallback(() => {
    if (!vantheonState || !save) return;
    const updated: GameSave = {
      ...save,
      vantheon: { ...vantheonState, currentHP: 0 },
      status: "completed",
      updatedAt: new Date().toISOString(),
    };
    persistSave(updated);
    setPhase("gameOver");
  }, [vantheonState, save, persistSave]);

  // ── Parkour handlers ───────────────────────────────────────────────────

  const handleStartParkour = useCallback((_optionIndex: number) => {
    if (!vantheonState || !save || !effective) return;
    const grid = generateParkourGrid(vantheonState.currentFloor);
    const speed = computeSpeed(effective, save.champion.equipment, save.champion.inventory);
    const reward = computeParkourGoldReward(vantheonState.currentFloor);
    setParkourGrid(grid);
    setParkourSpeed(Math.max(1, speed));
    setParkourGoldReward(reward);
    setPhase("parkour");
  }, [vantheonState, save, effective]);

  const handleParkourVictory = useCallback((goldReward: number) => {
    if (!save || !currentRoom || !vantheonState) return;
    const newGold = (save.champion.gold ?? 0) + goldReward;
    const updatedSave: GameSave = {
      ...save,
      champion: { ...save.champion, gold: newGold },
      updatedAt: new Date().toISOString(),
    };
    setParkourGrid(null);

    const result: ChallengeResult = {
      optionIndex: 0,
      stat: "finesse",
      roll: 0,
      total: 0,
      dc: 0,
      success: true,
      hpChange: 0,
    };

    const updatedRoom: RoomInstance = {
      ...currentRoom,
      challengeResults: [...currentRoom.challengeResults, result],
    };
    setCurrentRoom(updatedRoom);

    if (currentRoom.loot) {
      setPendingLoot(currentRoom.loot);
      persistSave(updatedSave);
      setPhase("loot");
    } else if (currentRoom.goldLoot != null && currentRoom.goldLoot > 0) {
      setPendingGold(currentRoom.goldLoot);
      persistSave(updatedSave);
      setPhase("goldLoot");
    } else {
      advanceToNextRoom(updatedSave);
    }
  }, [save, currentRoom, vantheonState, persistSave, advanceToNextRoom]);

  const handleParkourDefeat = useCallback((hpLoss: number) => {
    if (!vantheonState || !save || !currentRoom) return;
    const newHP = Math.max(0, vantheonState.currentHP - hpLoss);
    const updatedTS: VantheonState = { ...vantheonState, currentHP: newHP };
    setVantheonState(updatedTS);
    setParkourGrid(null);

    const result: ChallengeResult = {
      optionIndex: 0,
      stat: "finesse",
      roll: 0,
      total: 0,
      dc: 0,
      success: false,
      hpChange: -hpLoss,
    };

    const updatedRoom: RoomInstance = {
      ...currentRoom,
      challengeResults: [...currentRoom.challengeResults, result],
    };
    setCurrentRoom(updatedRoom);

    if (newHP <= 0) {
      const updated: GameSave = {
        ...save,
        vantheon: { ...updatedTS, currentHP: 0 },
        status: "completed",
        updatedAt: new Date().toISOString(),
      };
      persistSave(updated);
      setTimeout(() => setPhase("gameOver"), 600);
      return;
    }

    const updatedSave: GameSave = { ...save, vantheon: updatedTS, updatedAt: new Date().toISOString() };
    persistSave(updatedSave);

    const nextIndex = currentRoom.currentChallengeIndex + 1;
    if (nextIndex < currentRoom.challenges.length) {
      setCurrentRoom({ ...updatedRoom, currentChallengeIndex: nextIndex });
      setPhase("room");
    } else {
      advanceToNextRoom(updatedSave, updatedTS);
    }
  }, [vantheonState, save, currentRoom, persistSave, advanceToNextRoom]);

  // ── Puzzle handlers ─────────────────────────────────────────────────────

  const handleStartPuzzle = useCallback((_optionIndex: number) => {
    if (!vantheonState || !save || !effective) return;
    const cards = generatePuzzleCards(vantheonState.currentFloor);
    const maxFlips = computePuzzleMaxFlips(cards.length, effective.spirit);
    const reward = computePuzzleGoldReward(vantheonState.currentFloor);
    setPuzzleCards(cards);
    setPuzzleMaxFlips(maxFlips);
    setPuzzleGoldReward(reward);
    setPhase("puzzle");
  }, [vantheonState, save, effective]);

  const handlePuzzleVictory = useCallback((goldReward: number) => {
    if (!save || !currentRoom || !vantheonState) return;
    const newGold = (save.champion.gold ?? 0) + goldReward;
    const updatedSave: GameSave = {
      ...save,
      champion: { ...save.champion, gold: newGold },
      updatedAt: new Date().toISOString(),
    };
    setPuzzleCards(null);

    const result: ChallengeResult = {
      optionIndex: 0,
      stat: "spirit",
      roll: 0,
      total: 0,
      dc: 0,
      success: true,
      hpChange: 0,
    };

    const updatedRoom: RoomInstance = {
      ...currentRoom,
      challengeResults: [...currentRoom.challengeResults, result],
    };
    setCurrentRoom(updatedRoom);

    if (currentRoom.loot) {
      setPendingLoot(currentRoom.loot);
      persistSave(updatedSave);
      setPhase("loot");
    } else if (currentRoom.goldLoot != null && currentRoom.goldLoot > 0) {
      setPendingGold(currentRoom.goldLoot);
      persistSave(updatedSave);
      setPhase("goldLoot");
    } else {
      advanceToNextRoom(updatedSave);
    }
  }, [save, currentRoom, vantheonState, persistSave, advanceToNextRoom]);

  const handlePuzzleDefeat = useCallback((hpLoss: number) => {
    if (!vantheonState || !save || !currentRoom) return;
    const newHP = Math.max(0, vantheonState.currentHP - hpLoss);
    const updatedTS: VantheonState = { ...vantheonState, currentHP: newHP };
    setVantheonState(updatedTS);
    setPuzzleCards(null);

    const result: ChallengeResult = {
      optionIndex: 0,
      stat: "spirit",
      roll: 0,
      total: 0,
      dc: 0,
      success: false,
      hpChange: -hpLoss,
    };

    const updatedRoom: RoomInstance = {
      ...currentRoom,
      challengeResults: [...currentRoom.challengeResults, result],
    };
    setCurrentRoom(updatedRoom);

    if (newHP <= 0) {
      const updated: GameSave = {
        ...save,
        vantheon: { ...updatedTS, currentHP: 0 },
        status: "completed",
        updatedAt: new Date().toISOString(),
      };
      persistSave(updated);
      setTimeout(() => setPhase("gameOver"), 600);
      return;
    }

    persistSave({ ...save, vantheon: updatedTS, updatedAt: new Date().toISOString() });

    const nextIndex = currentRoom.currentChallengeIndex + 1;
    if (nextIndex < currentRoom.challenges.length) {
      setCurrentRoom({ ...updatedRoom, currentChallengeIndex: nextIndex });
      setPhase("room");
    } else {
      advanceToNextRoom();
    }
  }, [vantheonState, save, currentRoom, persistSave, advanceToNextRoom]);

  // ── Equipment management handlers ─────────────────────────────────────

  const handleEquipFromInventory = useCallback((inventoryIndex: number, targetSlot: ItemSlot) => {
    if (!save || !effective) return;
    const item = save.champion.inventory[inventoryIndex];
    if (!item) return;

    if (item.isConsumable) {
      showToast("Cannot equip consumable items");
      return;
    }

    if (item.slot !== targetSlot) {
      showToast(`Cannot equip: ${item.name} goes in ${SLOT_LABELS[item.slot]}, not ${SLOT_LABELS[targetSlot]}`);
      return;
    }

    const currentEquipped = save.champion.equipment[targetSlot];
    const currentWeight = computeCurrentWeight(save.champion.equipment, save.champion.salvageComponents, save.champion.gold ?? 0, save.champion.inventory);
    const weightLimit = computeWeightLimit(effective);

    if (currentWeight > weightLimit) {
      showToast(`Cannot equip: over weight limit (${currentWeight}w / ${weightLimit}w)`);
      return;
    }

    const newInventory = [...save.champion.inventory];
    newInventory.splice(inventoryIndex, 1);
    if (currentEquipped) {
      newInventory.splice(inventoryIndex, 0, currentEquipped);
    }

    const newEquipment = { ...save.champion.equipment, [targetSlot]: item };
    persistSave({
      ...save,
      champion: { ...save.champion, equipment: newEquipment, inventory: newInventory },
      updatedAt: new Date().toISOString(),
    });
  }, [save, effective, persistSave]);

  const handleUnequipToInventory = useCallback((slot: ItemSlot, targetIndex?: number) => {
    if (!save) return;
    const item = save.champion.equipment[slot];
    if (!item) return;

    if (save.champion.inventory.length >= INVENTORY_MAX) {
      showToast("Cannot unequip: inventory is full");
      return;
    }

    const newEquipment = { ...save.champion.equipment, [slot]: null };
    const newInventory = [...save.champion.inventory];
    if (targetIndex !== undefined && targetIndex <= newInventory.length) {
      newInventory.splice(targetIndex, 0, item);
    } else {
      newInventory.push(item);
    }

    persistSave({
      ...save,
      champion: { ...save.champion, equipment: newEquipment, inventory: newInventory },
      updatedAt: new Date().toISOString(),
    });
  }, [save, persistSave]);

  const handleSwapInventorySlots = useCallback((fromIndex: number, toIndex: number) => {
    if (!save) return;
    const newInventory = [...save.champion.inventory];
    const temp = newInventory[fromIndex];
    newInventory[fromIndex] = newInventory[toIndex];
    newInventory[toIndex] = temp;
    persistSave({
      ...save,
      champion: { ...save.champion, inventory: newInventory },
      updatedAt: new Date().toISOString(),
    });
  }, [save, persistSave]);

  // ── Context menu actions ──────────────────────────────────────────────

  const handleInventoryContextMenu = useCallback((index: number, e: React.MouseEvent) => {
    if (!save) return;
    const item = save.champion.inventory[index];
    if (!item) return;
    setContextMenu({ item, source: "inventory", index, x: e.clientX, y: e.clientY });
  }, [save]);

  const handleEquipmentContextMenu = useCallback((slot: ItemSlot, e: React.MouseEvent) => {
    if (!save) return;
    const item = save.champion.equipment[slot];
    if (!item) return;
    setContextMenu({ item, source: "equipment", slot, x: e.clientX, y: e.clientY });
  }, [save]);

  const handleContextEquip = useCallback(() => {
    if (!contextMenu || !save || !effective) return;
    const { item, source, index } = contextMenu;

    if (source === "inventory" && index !== undefined) {
      const targetSlot = item.slot;
      const currentEquipped = save.champion.equipment[targetSlot];
      const currentWeight = computeCurrentWeight(save.champion.equipment, save.champion.salvageComponents, save.champion.gold ?? 0, save.champion.inventory);
      const weightLimit = computeWeightLimit(effective);

      if (currentWeight > weightLimit) {
        showToast(`Cannot equip: over weight limit (${currentWeight}w / ${weightLimit}w)`);
        return;
      }

      const newInventory = [...save.champion.inventory];
      newInventory.splice(index, 1);
      if (currentEquipped) {
        newInventory.splice(index, 0, currentEquipped);
      }

      const newEquipment = { ...save.champion.equipment, [targetSlot]: item };
      persistSave({
        ...save,
        champion: { ...save.champion, equipment: newEquipment, inventory: newInventory },
        updatedAt: new Date().toISOString(),
      });
    }
  }, [contextMenu, save, effective, persistSave]);

  const handleContextUnequip = useCallback(() => {
    if (!contextMenu || !save) return;
    const { slot } = contextMenu;
    if (slot) {
      handleUnequipToInventory(slot);
    }
  }, [contextMenu, save, handleUnequipToInventory]);

  const handleBreakDown = useCallback(() => {
    if (!contextMenu || !save) return;
    const { item, source, index, slot } = contextMenu;
    const salvageYield = computeSalvageYield(item);

    const newChampion = { ...save.champion };

    if (source === "inventory" && index !== undefined) {
      const newInventory = [...newChampion.inventory];
      newInventory.splice(index, 1);
      newChampion.inventory = newInventory;
    } else if (source === "equipment" && slot) {
      newChampion.equipment = { ...newChampion.equipment, [slot]: null };
    }

    newChampion.salvageComponents = (newChampion.salvageComponents ?? 0) + salvageYield;

    persistSave({
      ...save,
      champion: newChampion,
      updatedAt: new Date().toISOString(),
    });
    showToast(`Broke down ${item.name} → +${salvageYield} Salvage`);
  }, [contextMenu, save, persistSave]);

  const handleUseConsumable = useCallback(() => {
    if (!contextMenu || !save || !vantheonState) return;
    const { item, index } = contextMenu;
    if (!item.isConsumable || index === undefined) return;

    const healAmount = Math.floor(Math.random() * 4) + 2;
    const newHP = Math.min(vantheonState.maxHP, vantheonState.currentHP + healAmount);
    const updatedTS: VantheonState = { ...vantheonState, currentHP: newHP };
    setVantheonState(updatedTS);

    const newInventory = [...save.champion.inventory];
    newInventory.splice(index, 1);

    persistSave({
      ...save,
      champion: { ...save.champion, inventory: newInventory },
      vantheon: updatedTS,
      updatedAt: new Date().toISOString(),
    });
    showToast(`Used ${item.name}: +${healAmount} HP`);
  }, [contextMenu, save, vantheonState, persistSave]);

  const handleDropItem = useCallback(() => {
    if (!confirmDrop || !save) return;
    const { source, index, slot } = confirmDrop;
    const newChampion = { ...save.champion };

    if (source === "inventory" && index !== undefined) {
      const newInventory = [...newChampion.inventory];
      newInventory.splice(index, 1);
      newChampion.inventory = newInventory;
    } else if (source === "equipment" && slot) {
      newChampion.equipment = { ...newChampion.equipment, [slot]: null };
    }

    persistSave({
      ...save,
      champion: newChampion,
      updatedAt: new Date().toISOString(),
    });
    setConfirmDrop(null);
  }, [confirmDrop, save, persistSave]);

  const handleUpgrade = useCallback((stat: ExplorerStat) => {
    if (!upgradeTarget || !save) return;
    const { item, source, index, slot } = upgradeTarget;
    const cost = computeUpgradeCost(item);

    if ((save.champion.salvageComponents ?? 0) < cost) {
      showToast("Not enough Salvage Components");
      return;
    }

    const upgraded = applyUpgrade(item, stat);
    const newChampion = { ...save.champion };
    newChampion.salvageComponents = (newChampion.salvageComponents ?? 0) - cost;

    if (source === "inventory" && index !== undefined) {
      const newInventory = [...newChampion.inventory];
      newInventory[index] = upgraded;
      newChampion.inventory = newInventory;
    } else if (source === "equipment" && slot) {
      newChampion.equipment = { ...newChampion.equipment, [slot]: upgraded };
    }

    persistSave({
      ...save,
      champion: newChampion,
      updatedAt: new Date().toISOString(),
    });
    setUpgradeTarget(null);
    showToast(`Upgraded ${item.name}: +1 ${stat}`);
  }, [upgradeTarget, save, persistSave]);

  // ── Build context menu options ────────────────────────────────────────

  const contextMenuOptions = useMemo((): ContextMenuOption[] => {
    if (!contextMenu) return [];
    const { source, item } = contextMenu;

    const opts: ContextMenuOption[] = [];

    if (item.isConsumable && source === "inventory") {
      opts.push({
        label: "Use",
        icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 2v5M5 9h4v3H5z" /><circle cx="7" cy="5" r="3" fill="none" /></svg>,
        onSelect: handleUseConsumable,
      });
    } else if (source === "inventory") {
      opts.push({
        label: "Equip",
        icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7h8M7 3v8" /></svg>,
        onSelect: handleContextEquip,
      });
    } else {
      opts.push({
        label: "Unequip",
        icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7h8" /></svg>,
        onSelect: handleContextUnequip,
      });
    }

    if (!item.isConsumable) {
      opts.push({
        label: "Upgrade",
        icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 11V3M4 5l3-3 3 3" /></svg>,
        onSelect: () => {
          if (contextMenu) {
            setUpgradeTarget({
              item: contextMenu.item,
              source: contextMenu.source,
              index: contextMenu.index,
              slot: contextMenu.slot,
            });
          }
        },
      });
    }

    opts.push({
      label: "Break Down",
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 1L13 4V10L7 13L1 10V4Z" /><circle cx="7" cy="7" r="2" /></svg>,
      onSelect: handleBreakDown,
    });

    opts.push({
      label: "Drop",
      danger: true,
      icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M4 4v8a1 1 0 001 1h4a1 1 0 001-1V4" /></svg>,
      onSelect: () => {
        if (contextMenu) {
          setConfirmDrop({
            item: contextMenu.item,
            source: contextMenu.source,
            index: contextMenu.index,
            slot: contextMenu.slot,
          });
        }
      },
    });

    return opts;
  }, [contextMenu, handleContextEquip, handleContextUnequip, handleBreakDown, handleUseConsumable]);

  // ── Render ────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--color-muted)] animate-pulse-slow">
          Descending into the Vantheon...
        </p>
      </div>
    );
  }

  if (!save || !effective) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[var(--color-muted)]">No save data found.</p>
        <button
          onClick={() => router.push("/vantheon-explorer")}
          className="btn-stone px-6 py-2"
        >
          Return to Champion Select
        </button>
      </div>
    );
  }

  const { champion } = save;
  const theme = FACTION_THEMES[champion.factionId];

  return (
    <div className="rogue-explorer min-h-screen">
      {/* Ambient background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, ${theme.primary}06 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, ${theme.primary}04 0%, transparent 50%),
            radial-gradient(ellipse at 50% 30%, ${theme.primary}08 0%, transparent 60%)
          `,
        }}
      />

      {/* Header */}
      <div className="relative z-10 pt-4 pb-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm"
              style={{ background: `${theme.primary}15` }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.primary} strokeWidth="2" strokeLinecap="round">
                <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
              </svg>
            </div>
            <div>
              <h1
                className="text-lg font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${theme.gradientFrom}, ${theme.gradientTo})`,
                }}
              >
                The Vantheon
              </h1>
              <p className="text-[10px] text-[var(--color-muted)]">
                {champion.name} &middot;{" "}
                {FACTION_THEMES[champion.factionId].name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {vantheonState && phase !== "gate" && (
              <div
                className="floor-counter floor-counter-glow"
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: `1px solid ${theme.primary}30`,
                  background: `${theme.primary}10`,
                  color: theme.primary,
                  fontSize: 12,
                }}
              >
                Floor {vantheonState.currentFloor}
              </div>
            )}
            {(champion.keys ?? 0) > 0 && (
              <div
                className="key-pickup"
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  border: "1px solid rgba(251, 191, 36, 0.3)",
                  background: "rgba(251, 191, 36, 0.08)",
                  color: "#fbbf24",
                  fontSize: 12,
                  fontFamily: "var(--font-mono), monospace",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="8" cy="8" r="5" />
                  <path d="M13 13l8 8M17 17l2-2M19 19l2-2" />
                </svg>
                {champion.keys > 1 ? `${champion.keys} Keys` : "Key"}
              </div>
            )}
            {vantheonState && phase !== "gate" && (
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "var(--font-mono), monospace",
                  color: "var(--color-muted)",
                  padding: "4px 8px",
                  borderRadius: 6,
                  background: "var(--color-surface)",
                }}
              >
                {vantheonState.roomsExplored} rooms
              </div>
            )}
            <button
              onClick={() => router.push("/vantheon-explorer")}
              className="btn-stone px-4 py-1.5 text-xs"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Three-panel layout */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-[1600px] mx-auto vantheon-layout">
          {/* Left panel: Stats */}
          <aside className="vantheon-panel-left">
            <StatsPanel
              effectiveStats={effective}
              equipment={champion.equipment}
              theme={theme}
              currentHP={vantheonState?.currentHP}
              overrideMaxHP={vantheonState?.maxHP}
              salvageComponents={champion.salvageComponents}
              gold={champion.gold}
              inventory={champion.inventory}
              level={champion.level ?? 1}
            />
          </aside>

          {/* Center panel */}
          <main className="vantheon-panel-center">
            {phase === "gate" && (
              <GateRoom
                theme={theme}
                championName={champion.name}
                onEnter={handleEnterGate}
              />
            )}

            {phase === "room" && currentRoom && (
              <div key={roomKey} className="w-full flex flex-col items-center gap-4">
                <div className="text-center">
                  <h2
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: theme.primary,
                      marginBottom: 2,
                    }}
                  >
                    {currentRoom.template.name}
                  </h2>
                  <p style={{ fontSize: 12, color: "var(--color-muted)" }}>
                    {currentRoom.template.description}
                  </p>
                  <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 6 }}>
                    <span
                      style={{
                        fontSize: 9,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        padding: "2px 8px",
                        borderRadius: 4,
                        color: theme.primary,
                        background: `${theme.primary}12`,
                      }}
                    >
                      {currentRoom.template.size}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        padding: "2px 8px",
                        borderRadius: 4,
                        color: "var(--color-muted)",
                        background: "var(--color-surface)",
                      }}
                    >
                      {currentRoom.template.materials[0]}
                    </span>
                  </div>
                </div>

                <div style={{ width: "100%", maxWidth: 600 }}>
                  <RoomArt
                    roomType={currentRoom.template.roomType}
                    size={currentRoom.template.size}
                    material={currentRoom.template.materials[0]}
                    theme={theme}
                    seed={currentRoom.instanceId}
                  />
                </div>

                {currentRoom.template.size === "key" && (
                  <div className="text-center animate-fade-in">
                    <p style={{ fontSize: 14, color: "#fbbf24", fontWeight: 600, marginBottom: 12 }}>
                      You found a key!
                    </p>
                    <button
                      onClick={handlePickupKey}
                      className="btn-stone px-8 py-2.5 text-sm font-semibold uppercase tracking-wider"
                      style={{
                        borderColor: "rgba(251, 191, 36, 0.4)",
                        color: "#fbbf24",
                      }}
                    >
                      Pick Up Key
                    </button>
                  </div>
                )}

                {currentRoom.template.size === "door" && (
                  <div className="text-center animate-fade-in">
                    <p style={{ fontSize: 14, color: theme.primary, fontWeight: 600, marginBottom: 4 }}>
                      A door to Floor {(vantheonState?.currentFloor ?? 1) + 1}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: 12 }}>
                      Use your key to ascend deeper into the Vantheon.
                    </p>
                    <button
                      onClick={handleUseDoor}
                      className="btn-stone px-8 py-2.5 text-sm font-semibold uppercase tracking-wider"
                      style={{ borderColor: `${theme.primary}50` }}
                    >
                      Use Key & Ascend
                    </button>
                  </div>
                )}

                {currentRoom.template.size === "merchant" && currentRoom.merchantItems && (
                  <MerchantPanel
                    items={currentRoom.merchantItems}
                    gold={champion.gold ?? 0}
                    theme={theme}
                    currentFloor={vantheonState?.currentFloor ?? 1}
                    currentHP={vantheonState?.currentHP ?? 0}
                    maxHP={vantheonState?.maxHP ?? 1}
                    inventoryFull={champion.inventory.length >= INVENTORY_MAX}
                    onBuy={handleMerchantBuy}
                    onHeal={handleMerchantHeal}
                    onLeave={handleMerchantLeave}
                  />
                )}

                {currentRoom.template.size !== "key" &&
                  currentRoom.template.size !== "door" &&
                  currentRoom.template.size !== "merchant" &&
                  currentRoom.challenges.length > 0 &&
                  currentRoom.currentChallengeIndex < currentRoom.challenges.length && (
                    <div style={{ width: "100%", maxWidth: 540 }}>
                      <ChallengePanel
                        challenge={currentRoom.challenges[currentRoom.currentChallengeIndex]}
                        challengeIndex={currentRoom.currentChallengeIndex}
                        totalChallenges={currentRoom.challenges.length}
                        effectiveStats={effective}
                        theme={theme}
                        loot={currentRoom.loot}
                        goldLoot={currentRoom.goldLoot}
                        isLastChallenge={currentRoom.currentChallengeIndex === currentRoom.challenges.length - 1}
                        onResolve={handleChallengeResolve}
                        onProceed={handleChallengeProceed}
                        onStartCombat={currentRoom.enemies ? handleStartCombat : undefined}
                        onStartParkour={handleStartParkour}
                        onStartPuzzle={handleStartPuzzle}
                      />
                    </div>
                  )}
              </div>
            )}

            {phase === "combat" && activeCombat && effective && (
              <div key={`combat-${roomKey}`} className="w-full flex flex-col items-center gap-4">
                {currentRoom && (
                  <>
                    <div className="text-center">
                      <h2
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: theme.primary,
                          marginBottom: 2,
                        }}
                      >
                        {currentRoom.template.name}
                      </h2>
                    </div>
                    <div style={{ width: "100%", maxWidth: 600 }}>
                      <RoomArt
                        roomType={currentRoom.template.roomType}
                        size={currentRoom.template.size}
                        material={currentRoom.template.materials[0]}
                        theme={theme}
                        seed={currentRoom.instanceId}
                      />
                    </div>
                  </>
                )}
                <div style={{ width: "100%", maxWidth: 540 }}>
                  <CombatPanel
                    combatState={activeCombat}
                    effectiveStats={effective}
                    playerInitiative={computeInitiative(effective)}
                    playerAC={computeArmorClass(effective, champion.equipment)}
                    floor={vantheonState?.currentFloor ?? 1}
                    theme={theme}
                    onCombatUpdate={handleCombatUpdate}
                    onCombatVictory={handleCombatVictory}
                    onCombatDefeat={handleCombatDefeat}
                  />
                </div>
              </div>
            )}

            {phase === "parkour" && parkourGrid && vantheonState && (
              <div key={`parkour-${roomKey}`} className="w-full flex flex-col items-center gap-4">
                {currentRoom && (
                  <>
                    <div className="text-center">
                      <h2
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: theme.primary,
                          marginBottom: 2,
                        }}
                      >
                        {currentRoom.template.name}
                      </h2>
                    </div>
                    <div style={{ width: "100%", maxWidth: 600 }}>
                      <RoomArt
                        roomType={currentRoom.template.roomType}
                        size={currentRoom.template.size}
                        material={currentRoom.template.materials[0]}
                        theme={theme}
                        seed={currentRoom.instanceId}
                      />
                    </div>
                  </>
                )}
                <div style={{ width: "100%", maxWidth: 700 }}>
                  <ParkourPanel
                    grid={parkourGrid}
                    speed={parkourSpeed}
                    floor={vantheonState.currentFloor}
                    goldReward={parkourGoldReward}
                    theme={theme}
                    onParkourVictory={handleParkourVictory}
                    onParkourDefeat={handleParkourDefeat}
                  />
                </div>
              </div>
            )}

            {phase === "puzzle" && puzzleCards && vantheonState && (
              <div key={`puzzle-${roomKey}`} className="w-full flex flex-col items-center gap-4">
                {currentRoom && (
                  <>
                    <div className="text-center">
                      <h2
                        style={{
                          fontSize: 20,
                          fontWeight: 700,
                          color: theme.primary,
                          marginBottom: 2,
                        }}
                      >
                        {currentRoom.template.name}
                      </h2>
                    </div>
                    <div style={{ width: "100%", maxWidth: 600 }}>
                      <RoomArt
                        roomType={currentRoom.template.roomType}
                        size={currentRoom.template.size}
                        material={currentRoom.template.materials[0]}
                        theme={theme}
                        seed={currentRoom.instanceId}
                      />
                    </div>
                  </>
                )}
                <div style={{ width: "100%", maxWidth: 540 }}>
                  <PuzzlePanel
                    cards={puzzleCards}
                    maxFlips={puzzleMaxFlips}
                    floor={vantheonState.currentFloor}
                    goldReward={puzzleGoldReward}
                    theme={theme}
                    onPuzzleVictory={handlePuzzleVictory}
                    onPuzzleDefeat={handlePuzzleDefeat}
                  />
                </div>
              </div>
            )}

            {phase === "loot" && pendingLoot && (
              <div className="w-full flex flex-col items-center gap-6 loot-card-enter">
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: theme.primary,
                  }}
                >
                  Loot Found!
                </h2>

                <div
                  style={{ maxWidth: 320, width: "100%" }}
                  className={
                    pendingLoot.rarity === "legendary"
                      ? "rarity-legendary"
                      : pendingLoot.rarity === "cursed"
                        ? "rarity-cursed"
                        : pendingLoot.rarity === "rare"
                          ? "rarity-rare"
                          : ""
                  }
                >
                  <ItemTooltip item={pendingLoot} theme={theme} inline />
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={handleTakeLoot}
                    disabled={champion.inventory.length >= INVENTORY_MAX}
                    className="btn-stone px-8 py-2.5 text-sm font-semibold uppercase tracking-wider"
                    style={{
                      borderColor: "rgba(74, 222, 128, 0.4)",
                      color: "#4ade80",
                      opacity: champion.inventory.length >= INVENTORY_MAX ? 0.4 : 1,
                    }}
                  >
                    {champion.inventory.length >= INVENTORY_MAX ? "Inventory Full" : "Take"}
                  </button>
                  <button
                    onClick={handleDiscardLoot}
                    className="btn-stone px-8 py-2.5 text-sm font-semibold uppercase tracking-wider"
                    style={{
                      borderColor: "rgba(248, 113, 113, 0.3)",
                      color: "#f87171",
                    }}
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}

            {phase === "goldLoot" && pendingGold != null && (
              <div className="w-full flex flex-col items-center gap-6 loot-card-enter">
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#fbbf24",
                  }}
                >
                  Gold Found!
                </h2>

                <div
                  className="glass-card rounded-xl p-6"
                  style={{
                    maxWidth: 280,
                    width: "100%",
                    borderColor: "rgba(251, 191, 36, 0.25)",
                    textAlign: "center",
                  }}
                >
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ margin: "0 auto 12px" }}>
                    <circle cx="24" cy="24" r="20" stroke="#fbbf24" strokeWidth="2" fill="rgba(251, 191, 36, 0.1)" />
                    <text x="24" y="30" textAnchor="middle" fill="#fbbf24" fontSize="18" fontWeight="bold">G</text>
                  </svg>
                  <p style={{ fontSize: 28, fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "#fbbf24" }}>
                    {pendingGold}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 4 }}>
                    Gold Coins
                  </p>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={handleTakeGold}
                    className="btn-stone px-8 py-2.5 text-sm font-semibold uppercase tracking-wider"
                    style={{
                      borderColor: "rgba(251, 191, 36, 0.4)",
                      color: "#fbbf24",
                    }}
                  >
                    Take Gold
                  </button>
                  <button
                    onClick={handleDiscardGold}
                    className="btn-stone px-8 py-2.5 text-sm font-semibold uppercase tracking-wider"
                    style={{
                      borderColor: "rgba(248, 113, 113, 0.3)",
                      color: "#f87171",
                    }}
                  >
                    Leave
                  </button>
                </div>
              </div>
            )}

            {phase === "gameOver" && (
              <div className="w-full flex flex-col items-center gap-6 game-over-enter">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="#f87171" strokeWidth="2" opacity="0.3" />
                  <path d="M28 28L52 52M52 28L28 52" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
                </svg>

                <div className="text-center">
                  <h2
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#f87171",
                      marginBottom: 8,
                    }}
                  >
                    Fallen
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--color-muted)", marginBottom: 4 }}>
                    {champion.name} has been defeated in the Vantheon.
                  </p>
                </div>

                {vantheonState && (
                  <div
                    className="glass-card"
                    style={{
                      borderRadius: 12,
                      padding: 20,
                      maxWidth: 300,
                      width: "100%",
                      borderColor: "rgba(248, 113, 113, 0.2)",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { label: "Floor Reached", value: vantheonState.currentFloor },
                        { label: "Rooms Explored", value: vantheonState.roomsExplored },
                        { label: "Items Found", value: champion.inventory.length },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "6px 0",
                            borderBottom: "1px solid var(--color-border)",
                          }}
                        >
                          <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{stat.label}</span>
                          <span
                            style={{
                              fontSize: 16,
                              fontWeight: 700,
                              fontFamily: "var(--font-mono), monospace",
                              color: theme.primary,
                            }}
                          >
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => router.push("/vantheon-explorer")}
                  className="btn-stone px-8 py-2.5 text-sm font-semibold uppercase tracking-wider"
                  style={{ borderColor: `${theme.primary}40` }}
                >
                  Return to Champion Select
                </button>
              </div>
            )}
          </main>

          {/* Right panel: Inventory */}
          <aside className="vantheon-panel-right">
            <InventoryPanel
              equipment={champion.equipment}
              inventory={champion.inventory}
              theme={theme}
              salvageComponents={champion.salvageComponents ?? 0}
              gold={champion.gold ?? 0}
              keys={champion.keys ?? 0}
              onEquipFromInventory={handleEquipFromInventory}
              onUnequipToInventory={handleUnequipToInventory}
              onSwapInventorySlots={handleSwapInventorySlots}
              onInventoryContextMenu={handleInventoryContextMenu}
              onEquipmentContextMenu={handleEquipmentContextMenu}
            />
          </aside>
        </div>
      </div>

      {/* Overlays */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenuOptions}
          onClose={() => setContextMenu(null)}
        />
      )}

      {confirmDrop && (
        <ConfirmDialog
          message="Are you sure?"
          onConfirm={handleDropItem}
          onCancel={() => setConfirmDrop(null)}
        />
      )}

      {upgradeTarget && (
        <UpgradeModal
          item={upgradeTarget.item}
          salvageComponents={champion.salvageComponents ?? 0}
          theme={theme}
          onUpgrade={handleUpgrade}
          onCancel={() => setUpgradeTarget(null)}
        />
      )}

      {showLevelUp && (
        <LevelUpModal
          currentLevel={champion.level ?? 1}
          baseStats={champion.baseStats}
          theme={theme}
          onChoose={handleLevelUp}
        />
      )}

      {toast && (
        <div key={toast.id} className="toast-message">
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default function VantheonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-[var(--color-muted)] animate-pulse-slow">
            Descending...
          </p>
        </div>
      }
    >
      <VantheonContent />
    </Suspense>
  );
}
