"use client";

import { useState, useCallback, useMemo } from "react";
import type { GameState, HexCoord, CombatResult, BoardChampion } from "@/types/game";
import {
  drawCard,
  getMovableChampions,
  getValidMoves,
  getSwapTargets,
  moveChampion,
  finishMovePhase,
  getAttackTargets,
  getAttackableChampions,
  resolveAttack,
  previewAttack,
  playChampionFromHand,
  finishActionPhase,
  endTurn,
  getValidDeploymentTiles,
  hasAbilityAvailable,
  getAbilityName,
  resolveDefenderAbility,
  resolveAttackerAbility,
  resolveBruiserAbility,
  previewBruiserAbility,
} from "@/lib/gameEngine";
import { FACTION_THEMES } from "@/lib/factionThemes";
import { hexEquals } from "@/lib/hexMath";
import HexGrid from "./HexGrid";
import Card from "./Card";
import AttackPreview from "./AttackPreview";
import ChampionTooltip from "./ChampionTooltip";

interface TurnPhaseProps {
  state: GameState;
  onStateChange: (newState: GameState) => void;
}

export default function TurnPhase({ state, onStateChange }: TurnPhaseProps) {
  const [selectedHex, setSelectedHex] = useState<HexCoord | null>(null);
  const [selectedHandCard, setSelectedHandCard] = useState<string | null>(null);
  const [actionMode, setActionMode] = useState<"none" | "attack" | "play">("none");
  const [pendingAttack, setPendingAttack] = useState<{
    attacker: HexCoord;
    defender: HexCoord;
  } | null>(null);
  const [abilityActive, setAbilityActive] = useState(false);
  const [hoveredChampion, setHoveredChampion] = useState<{
    champion: BoardChampion;
    x: number;
    y: number;
  } | null>(null);

  const player = state.players[state.currentPlayerIndex];
  const theme = FACTION_THEMES[player.factionId];

  const selectedChampion = useMemo(() => {
    if (!selectedHex) return null;
    const tile = state.board.find(
      (t) => hexEquals(t.coord, selectedHex) && t.occupant?.playerId === state.currentPlayerIndex
    );
    return tile?.occupant ?? null;
  }, [state, selectedHex]);

  const attackPreview: CombatResult | null = useMemo(() => {
    if (!pendingAttack) return null;
    if (abilityActive && selectedChampion?.card.championClass === "bruiser") {
      return previewBruiserAbility(state, pendingAttack.attacker, pendingAttack.defender);
    }
    return previewAttack(state, pendingAttack.attacker, pendingAttack.defender);
  }, [state, pendingAttack, abilityActive, selectedChampion]);

  const canAttack = state.turnActionType !== "deploy";
  const canDeploy = state.turnActionType !== "attack";

  const abilityAvailable = useMemo(() => {
    if (!selectedChampion) return false;
    if (actionMode !== "attack") return false;
    if (state.turnSubPhase !== "action") return false;
    return hasAbilityAvailable(state, selectedChampion.card.id);
  }, [state, selectedChampion, actionMode]);

  const getValidTargets = useCallback((): HexCoord[] => {
    if ((state.turnSubPhase === "move" || state.turnSubPhase === "move2") && selectedHex) {
      const tile = state.board.find(
        (t) => hexEquals(t.coord, selectedHex) && t.occupant?.playerId === state.currentPlayerIndex
      );
      if (tile) {
        return getValidMoves(state, selectedHex).filter((n) => {
          const t = state.board.find((bt) => hexEquals(bt.coord, n));
          return t && !t.occupant;
        });
      }
    }

    if (state.turnSubPhase === "action") {
      if (actionMode === "attack" && selectedHex) {
        return getAttackTargets(state, selectedHex).map((c) => c.position);
      }
      if (actionMode === "play" && selectedHandCard) {
        return getValidDeploymentTiles(state, state.currentPlayerIndex);
      }
    }

    return [];
  }, [state, selectedHex, actionMode, selectedHandCard]);

  const computeSwapTargets = useCallback((): HexCoord[] => {
    if ((state.turnSubPhase === "move" || state.turnSubPhase === "move2") && selectedHex) {
      const tile = state.board.find(
        (t) => hexEquals(t.coord, selectedHex) && t.occupant?.playerId === state.currentPlayerIndex
      );
      if (tile) return getSwapTargets(state, selectedHex);
    }
    return [];
  }, [state, selectedHex]);

  const validTargets = getValidTargets();
  const swapTargets = computeSwapTargets();

  function handleDraw() {
    onStateChange(drawCard(state));
  }

  function handleHexClick(coord: HexCoord) {
    if (state.turnSubPhase === "move" || state.turnSubPhase === "move2") {
      if (selectedHex) {
        const moves = getValidMoves(state, selectedHex);
        if (moves.some((m) => hexEquals(m, coord))) {
          const newState = moveChampion(state, selectedHex, coord);
          onStateChange(newState);
          setSelectedHex(null);
          return;
        }
      }
    }

    if (state.turnSubPhase === "action") {
      if (actionMode === "attack" && selectedHex) {
        const targets = getAttackTargets(state, selectedHex);
        if (targets.some((t) => hexEquals(t.position, coord))) {
          setPendingAttack({ attacker: selectedHex, defender: coord });
          return;
        }
      }

      if (actionMode === "play" && selectedHandCard) {
        const validSpawns = getValidDeploymentTiles(state, state.currentPlayerIndex);
        if (validSpawns.some((s) => hexEquals(s, coord))) {
          const newState = playChampionFromHand(state, selectedHandCard, coord);
          onStateChange(newState);
          setSelectedHandCard(null);
          setActionMode("none");
          return;
        }
      }
    }
  }

  function handleChampionClick(coord: HexCoord) {
    const tile = state.board.find((t) => hexEquals(t.coord, coord));
    if (!tile?.occupant) return;

    if (tile.occupant.playerId === state.currentPlayerIndex) {
      if (state.turnSubPhase === "move" || state.turnSubPhase === "move2") {
        if (state.movedChampions.has(tile.occupant.card.id)) return;
        if (selectedHex && !hexEquals(selectedHex, coord)) {
          const swaps = getSwapTargets(state, selectedHex);
          if (swaps.some((s) => hexEquals(s, coord))) {
            const newState = moveChampion(state, selectedHex, coord);
            onStateChange(newState);
            setSelectedHex(null);
            return;
          }
        }
      }
      if (state.turnSubPhase === "action" && actionMode === "attack" && state.attackedChampions.has(tile.occupant.card.id)) return;
      setSelectedHex(hexEquals(selectedHex ?? { q: -99, r: -99 }, coord) ? null : coord);
    } else if (state.turnSubPhase === "action" && actionMode === "attack" && selectedHex) {
      handleHexClick(coord);
    }
  }

  function handleConfirmAttack() {
    if (!pendingAttack) return;
    const newState = abilityActive && selectedChampion?.card.championClass === "bruiser"
      ? resolveBruiserAbility(state, pendingAttack.attacker, pendingAttack.defender)
      : resolveAttack(state, pendingAttack.attacker, pendingAttack.defender);
    onStateChange(newState);
    setPendingAttack(null);
    setSelectedHex(null);
    setAbilityActive(false);
  }

  function handleCancelAttack() {
    setPendingAttack(null);
    setAbilityActive(false);
  }

  function handleUseAbility() {
    if (!selectedChampion || !selectedHex) return;

    const champClass = selectedChampion.card.championClass;

    if (champClass === "defender") {
      const newState = resolveDefenderAbility(state, selectedHex);
      onStateChange(newState);
      setSelectedHex(null);
      setAbilityActive(false);
      return;
    }

    if (champClass === "attacker") {
      const newState = resolveAttackerAbility(state, selectedHex);
      onStateChange(newState);
      setSelectedHex(null);
      setAbilityActive(false);
      return;
    }

    if (champClass === "bruiser") {
      setAbilityActive(true);
    }
  }

  function handleFinishMoves() {
    onStateChange(finishMovePhase(state));
    setSelectedHex(null);
  }

  function handleFinishAction() {
    const newState = finishActionPhase(state);
    onStateChange(newState);
    setSelectedHex(null);
    setSelectedHandCard(null);
    setActionMode("none");
    setPendingAttack(null);
    setAbilityActive(false);
  }

  function handleEndTurn() {
    const newState = endTurn(state);
    onStateChange(newState);
    setSelectedHex(null);
    setSelectedHandCard(null);
    setActionMode("none");
    setPendingAttack(null);
    setAbilityActive(false);
  }

  const movableChamps = getMovableChampions(state, state.currentPlayerIndex);
  const hasChampionsToMove = movableChamps.length > 0;
  const attackableChamps = getAttackableChampions(state, state.currentPlayerIndex);
  const hasChampionsToAttack = attackableChamps.length > 0 && canAttack;
  const canDeployChampion = !state.hasActed && canDeploy;
  const allActionsDone =
    (!hasChampionsToAttack || !canAttack) &&
    (!canDeployChampion || state.hasActed);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Turn info */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
          Turn {state.turnNumber} &mdash;{" "}
          <span style={{ color: theme.primary }}>{theme.name}</span>
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {state.turnSubPhase === "draw" && "Draw a card to begin your turn."}
          {state.turnSubPhase === "move" &&
            "Move your champions (click a champion, then a destination)."}
          {state.turnSubPhase === "action" &&
            !allActionsDone &&
            "Attack with your champions OR deploy one from your hand."}
          {state.turnSubPhase === "action" &&
            allActionsDone &&
            "All actions complete."}
          {state.turnSubPhase === "move2" &&
            "Move remaining champions (second move phase)."}
        </p>
      </div>

      {/* Board */}
      <HexGrid
        state={state}
        validTargets={validTargets}
        swapTargets={swapTargets}
        selectedHex={selectedHex}
        onHexClick={handleHexClick}
        onChampionClick={handleChampionClick}
        onChampionHover={(champion, e) => {
          if (champion) setHoveredChampion({ champion, x: e.clientX, y: e.clientY });
        }}
        onChampionHoverEnd={() => setHoveredChampion(null)}
      />

      {hoveredChampion && (
        <ChampionTooltip
          champion={hoveredChampion.champion}
          x={hoveredChampion.x}
          y={hoveredChampion.y}
        />
      )}

      {/* Combat result flash */}
      {state.lastCombatResult && !pendingAttack && (
        <div className="player-panel px-4 py-2 text-sm animate-fade-in text-center">
          <span className="font-bold">{state.lastCombatResult.effectiveAttack}</span>
          {" ATK vs "}
          <span className="font-bold">{state.lastCombatResult.effectiveDefense}</span>
          {" DEF = "}
          <span className="font-bold text-red-400">
            {state.lastCombatResult.damage} damage
          </span>
          {state.lastCombatResult.defenderDestroyed && (
            <span className="ml-2 text-red-500 font-bold">DESTROYED</span>
          )}
        </div>
      )}

      {/* Hand */}
      <div className="flex gap-2 flex-wrap justify-center">
        {player.hand.map((card) => (
          <Card
            key={card.id}
            card={card}
            small
            selected={selectedHandCard === card.id}
            onClick={() => {
              if (state.turnSubPhase === "action" && canDeployChampion) {
                setSelectedHandCard(card.id);
                setActionMode("play");
                setSelectedHex(null);
                setPendingAttack(null);
              }
            }}
            disabled={state.turnSubPhase !== "action" || !canDeployChampion}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap justify-center">
        {state.turnSubPhase === "draw" && !state.hasDrawn && (
          <button className="btn-holo" onClick={handleDraw}>
            Draw Card
          </button>
        )}

        {state.turnSubPhase === "move" && (
          <button className="btn-holo" onClick={handleFinishMoves}>
            {hasChampionsToMove ? "Done Moving" : "Skip Moves"}
          </button>
        )}

        {state.turnSubPhase === "action" && (
          <>
            {hasChampionsToAttack && (
              <button
                className={`btn-holo ${actionMode === "attack" ? "ring-1 ring-red-400" : ""}`}
                onClick={() => {
                  setActionMode("attack");
                  setSelectedHandCard(null);
                  setPendingAttack(null);
                  setAbilityActive(false);
                }}
              >
                Attack{state.attackedChampions.size > 0 ? ` (${attackableChamps.length} left)` : ""}
              </button>
            )}
            {actionMode === "attack" && abilityAvailable && selectedChampion && (
              <button
                className={`btn-holo ${
                  abilityActive ? "ring-1 ring-amber-400" : ""
                } ${
                  selectedChampion.card.championClass === "defender"
                    ? "text-green-400"
                    : selectedChampion.card.championClass === "attacker"
                      ? "text-orange-400"
                      : "text-purple-400"
                }`}
                onClick={handleUseAbility}
              >
                {getAbilityName(selectedChampion.card.championClass)}
              </button>
            )}
            {canDeployChampion && (
              <button
                className={`btn-holo ${actionMode === "play" ? "ring-1 ring-green-400" : ""}`}
                onClick={() => {
                  setActionMode("play");
                  setSelectedHex(null);
                  setPendingAttack(null);
                  setAbilityActive(false);
                }}
                disabled={player.hand.length === 0}
              >
                Deploy Champion
              </button>
            )}
            <button className="btn-holo" onClick={handleFinishAction}>
              {allActionsDone ? "Done" : "Skip Remaining"}
            </button>
          </>
        )}

        {state.turnSubPhase === "move2" && (
          <button className="btn-holo" onClick={handleEndTurn}>
            {hasChampionsToMove ? "Done Moving" : "End Turn"}
          </button>
        )}
      </div>

      {/* Attack Preview Panel */}
      {pendingAttack && attackPreview && (
        <AttackPreview
          preview={attackPreview}
          onConfirm={handleConfirmAttack}
          onCancel={handleCancelAttack}
        />
      )}
    </div>
  );
}
