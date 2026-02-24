"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import type { GameState, HexCoord, CombatResult, BoardChampion } from "@/types/game";
import {
  getMovableChampions,
  getValidMoves,
  getSwapTargets,
  moveChampion,
  getAttackTargets,
  getAttackableChampions,
  resolveAttack,
  previewAttack,
  playChampionFromHand,
  endTurn,
  getValidDeploymentTiles,
  hasAbilityAvailable,
  getAbilityName,
  resolveDefenderAbility,
  resolveAttackerAbility,
  resolveBruiserAbility,
  previewBruiserAbility,
  canDeployThisTurn,
} from "@/lib/game/gameEngine";
import { FACTION_THEMES } from "@/lib/game/factionThemes";
import { hexEquals } from "@/lib/game/hexMath";
import HexGrid from "./HexGrid";
import Card from "./Card";
import AttackPreview from "./AttackPreview";
import ChampionTooltip from "./ChampionTooltip";

type ActionMode = "none" | "move" | "attack" | "deploy";

export type TurnAction =
  | { type: "move"; from: HexCoord; to: HexCoord }
  | { type: "attack"; from: HexCoord; to: HexCoord }
  | { type: "deploy"; cardId: string; position: HexCoord }
  | { type: "ability"; coord: HexCoord; targetCoord?: HexCoord }
  | { type: "endTurn" };

interface TurnPhaseProps {
  state: GameState;
  onStateChange: (newState: GameState) => void;
  onAction?: (action: TurnAction) => void;
  disabled?: boolean;
}

export default function TurnPhase({ state, onStateChange, onAction, disabled }: TurnPhaseProps) {
  const [selectedHex, setSelectedHex] = useState<HexCoord | null>(null);
  const [selectedHandCard, setSelectedHandCard] = useState<string | null>(null);
  const [actionMode, setActionMode] = useState<ActionMode>("none");
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
  const [deckExpanded, setDeckExpanded] = useState(false);
  const [showEndTurnWarning, setShowEndTurnWarning] = useState(false);

  // Drag state
  const [dragChampion, setDragChampion] = useState<HexCoord | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const svgRef = useRef<SVGSVGElement | null>(null);

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

  const deployAvailable = canDeployThisTurn(state);

  const canChampionMove = useCallback((champId: string) => {
    return !state.movedChampions.has(champId);
  }, [state.movedChampions]);

  const canChampionAttack = useCallback((champId: string) => {
    return !state.attackedChampions.has(champId);
  }, [state.attackedChampions]);

  const abilityAvailable = useMemo(() => {
    if (!selectedChampion) return false;
    return hasAbilityAvailable(state, selectedChampion.card.id) &&
      canChampionAttack(selectedChampion.card.id);
  }, [state, selectedChampion, canChampionAttack]);

  const getValidTargets = useCallback((): HexCoord[] => {
    if (actionMode === "move" && selectedHex) {
      return getValidMoves(state, selectedHex).filter((n) => {
        const t = state.board.find((bt) => hexEquals(bt.coord, n));
        return t && !t.occupant;
      });
    }

    if (actionMode === "attack" && selectedHex) {
      return getAttackTargets(state, selectedHex).map((c) => c.position);
    }

    if (actionMode === "deploy" && selectedHandCard) {
      return getValidDeploymentTiles(state, state.currentPlayerIndex);
    }

    // When dragging, show valid moves for the dragged champion
    if (dragChampion) {
      const moves = getValidMoves(state, dragChampion).filter((n) => {
        const t = state.board.find((bt) => hexEquals(bt.coord, n));
        return t && !t.occupant;
      });
      const attacks = getAttackTargets(state, dragChampion).map((c) => c.position);
      return [...moves, ...attacks];
    }

    return [];
  }, [state, selectedHex, actionMode, selectedHandCard, dragChampion]);

  const computeSwapTargets = useCallback((): HexCoord[] => {
    if (actionMode === "move" && selectedHex) {
      return getSwapTargets(state, selectedHex);
    }
    if (dragChampion) {
      return getSwapTargets(state, dragChampion);
    }
    return [];
  }, [state, selectedHex, actionMode, dragChampion]);

  const validTargets = getValidTargets();
  const swapTargets = computeSwapTargets();

  function selectChampion(coord: HexCoord) {
    const tile = state.board.find((t) => hexEquals(t.coord, coord));
    if (!tile?.occupant || tile.occupant.playerId !== state.currentPlayerIndex) return;

    if (selectedHex && hexEquals(selectedHex, coord)) {
      setSelectedHex(null);
      setActionMode("none");
      setAbilityActive(false);
      return;
    }

    setSelectedHex(coord);
    setSelectedHandCard(null);
    setActionMode("none");
    setAbilityActive(false);
    setPendingAttack(null);
  }

  function handleHexClick(coord: HexCoord) {
    if (disabled) return;
    if (actionMode === "move" && selectedHex) {
      const moves = getValidMoves(state, selectedHex);
      if (moves.some((m) => hexEquals(m, coord))) {
        onAction?.({ type: "move", from: selectedHex, to: coord });
        const newState = moveChampion(state, selectedHex, coord);
        onStateChange(newState);
        setSelectedHex(null);
        setActionMode("none");
        return;
      }
    }

    if (actionMode === "attack" && selectedHex) {
      const targets = getAttackTargets(state, selectedHex);
      if (targets.some((t) => hexEquals(t.position, coord))) {
        setPendingAttack({ attacker: selectedHex, defender: coord });
        return;
      }
    }

    if (actionMode === "deploy" && selectedHandCard) {
      const validSpawns = getValidDeploymentTiles(state, state.currentPlayerIndex);
      if (validSpawns.some((s) => hexEquals(s, coord))) {
        onAction?.({ type: "deploy", cardId: selectedHandCard, position: coord });
        const newState = playChampionFromHand(state, selectedHandCard, coord);
        onStateChange(newState);
        setSelectedHandCard(null);
        setActionMode("none");
        return;
      }
    }

    setSelectedHex(null);
    setActionMode("none");
    setAbilityActive(false);
  }

  function handleChampionClick(coord: HexCoord) {
    if (disabled) return;
    const tile = state.board.find((t) => hexEquals(t.coord, coord));
    if (!tile?.occupant) return;

    if (tile.occupant.playerId === state.currentPlayerIndex) {
      if (actionMode === "move" && selectedHex && !hexEquals(selectedHex, coord)) {
        const swaps = getSwapTargets(state, selectedHex);
        if (swaps.some((s) => hexEquals(s, coord))) {
          onAction?.({ type: "move", from: selectedHex, to: coord });
          const newState = moveChampion(state, selectedHex, coord);
          onStateChange(newState);
          setSelectedHex(null);
          setActionMode("none");
          return;
        }
      }
      selectChampion(coord);
    } else if (actionMode === "attack" && selectedHex) {
      handleHexClick(coord);
    }
  }

  function handleDoubleClick(coord: HexCoord) {
    if (disabled) return;
    const tile = state.board.find((t) => hexEquals(t.coord, coord));
    if (!tile?.occupant || tile.occupant.playerId !== state.currentPlayerIndex) return;

    const champ = tile.occupant;
    if (!hasAbilityAvailable(state, champ.card.id)) return;
    if (!canChampionAttack(champ.card.id)) return;

    setSelectedHex(coord);
    setActionMode("none");

    if (champ.card.championClass === "defender") {
      onAction?.({ type: "ability", coord });
      const newState = resolveDefenderAbility(state, coord);
      onStateChange(newState);
      setSelectedHex(null);
      return;
    }
    if (champ.card.championClass === "attacker") {
      onAction?.({ type: "ability", coord });
      const newState = resolveAttackerAbility(state, coord);
      onStateChange(newState);
      setSelectedHex(null);
      return;
    }
    if (champ.card.championClass === "bruiser") {
      setSelectedHex(coord);
      setActionMode("attack");
      setAbilityActive(true);
    }
  }

  function handleConfirmAttack() {
    if (!pendingAttack || disabled) return;
    if (abilityActive && selectedChampion?.card.championClass === "bruiser") {
      onAction?.({ type: "ability", coord: pendingAttack.attacker, targetCoord: pendingAttack.defender });
    } else {
      onAction?.({ type: "attack", from: pendingAttack.attacker, to: pendingAttack.defender });
    }
    const newState = abilityActive && selectedChampion?.card.championClass === "bruiser"
      ? resolveBruiserAbility(state, pendingAttack.attacker, pendingAttack.defender)
      : resolveAttack(state, pendingAttack.attacker, pendingAttack.defender);
    onStateChange(newState);
    setPendingAttack(null);
    setSelectedHex(null);
    setActionMode("none");
    setAbilityActive(false);
  }

  function handleCancelAttack() {
    setPendingAttack(null);
    setAbilityActive(false);
  }

  function handleUseAbility() {
    if (!selectedChampion || !selectedHex || disabled) return;
    const champClass = selectedChampion.card.championClass;

    if (champClass === "defender") {
      onAction?.({ type: "ability", coord: selectedHex });
      const newState = resolveDefenderAbility(state, selectedHex);
      onStateChange(newState);
      setSelectedHex(null);
      setActionMode("none");
      setAbilityActive(false);
      return;
    }
    if (champClass === "attacker") {
      onAction?.({ type: "ability", coord: selectedHex });
      const newState = resolveAttackerAbility(state, selectedHex);
      onStateChange(newState);
      setSelectedHex(null);
      setActionMode("none");
      setAbilityActive(false);
      return;
    }
    if (champClass === "bruiser") {
      setAbilityActive(true);
      setActionMode("attack");
    }
  }

  function doEndTurn() {
    if (disabled) return;
    setShowEndTurnWarning(false);
    setDeckExpanded(false);
    onAction?.({ type: "endTurn" });
    const newState = endTurn(state);
    onStateChange(newState);
    setSelectedHex(null);
    setSelectedHandCard(null);
    setActionMode("none");
    setPendingAttack(null);
    setAbilityActive(false);
    setDragChampion(null);
    setDragPos(null);
  }

  function handleEndTurn() {
    if (deployAvailable) {
      setShowEndTurnWarning(true);
      return;
    }
    doEndTurn();
  }

  // --- Drag handlers ---
  function handlePointerDown(coord: HexCoord, e: React.PointerEvent) {
    const tile = state.board.find((t) => hexEquals(t.coord, coord));
    if (!tile?.occupant || tile.occupant.playerId !== state.currentPlayerIndex) return;

    dragStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
    setDragChampion(coord);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragStartRef.current || !dragChampion) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (!isDraggingRef.current && Math.sqrt(dx * dx + dy * dy) > 5) {
      isDraggingRef.current = true;
      setHoveredChampion(null);
    }

    if (isDraggingRef.current && svgRef.current) {
      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      setDragPos({ x: svgPt.x, y: svgPt.y });
    }
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!dragChampion) return;

    if (isDraggingRef.current && svgRef.current) {
      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgPt = pt.matrixTransform(svg.getScreenCTM()?.inverse());

      const dropCoord = findHexAtPoint(svgPt.x, svgPt.y);
      if (dropCoord && !hexEquals(dropCoord, dragChampion)) {
        handleDrop(dragChampion, dropCoord);
      }
    }

    dragStartRef.current = null;
    isDraggingRef.current = false;
    setDragChampion(null);
    setDragPos(null);
  }

  function findHexAtPoint(px: number, py: number): HexCoord | null {
    const HEX_SIZE = 38;
    let closest: HexCoord | null = null;
    let closestDist = Infinity;

    for (const tile of state.board) {
      const { x: hx, y: hy } = hexToPixelLocal(tile.coord, HEX_SIZE);
      const dist = Math.sqrt((px - hx) ** 2 + (py - hy) ** 2);
      if (dist < HEX_SIZE * 0.85 && dist < closestDist) {
        closestDist = dist;
        closest = tile.coord;
      }
    }
    return closest;
  }

  function hexToPixelLocal(coord: HexCoord, size: number) {
    const x = size * (3 / 2) * coord.q;
    const y = size * (Math.sqrt(3) / 2 * coord.q + Math.sqrt(3) * coord.r);
    return { x, y };
  }

  function handleDrop(from: HexCoord, to: HexCoord) {
    if (disabled) return;
    const fromTile = state.board.find((t) => hexEquals(t.coord, from));
    const toTile = state.board.find((t) => hexEquals(t.coord, to));
    if (!fromTile?.occupant) return;

    if (toTile?.occupant && toTile.occupant.playerId !== fromTile.occupant.playerId) {
      if (!state.attackedChampions.has(fromTile.occupant.card.id)) {
        setSelectedHex(from);
        setActionMode("attack");
        setPendingAttack({ attacker: from, defender: to });
      }
      return;
    }

    if (!state.movedChampions.has(fromTile.occupant.card.id)) {
      const moves = getValidMoves(state, from);
      if (moves.some((m) => hexEquals(m, to))) {
        onAction?.({ type: "move", from, to });
        const newState = moveChampion(state, from, to);
        onStateChange(newState);
      }
    }
  }

  const movableChamps = getMovableChampions(state, state.currentPlayerIndex);
  const attackableChamps = getAttackableChampions(state, state.currentPlayerIndex);

  const champCanMove = selectedChampion ? canChampionMove(selectedChampion.card.id) : false;
  const champCanAttack = selectedChampion ? canChampionAttack(selectedChampion.card.id) : false;
  const champHasTargets = selectedHex
    ? getAttackTargets(state, selectedHex).length > 0
    : false;

  return (
    <div className="flex flex-col md:flex-row md:items-stretch gap-3 w-full">
      {/* Left panel: info, hand, controls */}
      <div className="md:w-64 lg:w-72 shrink-0 flex flex-col gap-3 overflow-y-auto">
        {/* Turn info */}
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
            Turn {state.turnNumber} &mdash;{" "}
            <span style={{ color: theme.primary }}>{theme.name}</span>
          </p>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Select a champion to move, attack, or use abilities.
            {deployAvailable && " You may also deploy a champion this turn."}
          </p>
        </div>

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

        {/* Selected champion actions */}
        {selectedChampion && (
          <div className="player-panel px-4 py-3 flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">
              {selectedChampion.card.name}
            </p>

            {champCanMove && (
              <button
                className={`btn-holo text-sm ${actionMode === "move" ? "ring-1 ring-blue-400" : ""}`}
                onClick={() => {
                  setActionMode("move");
                  setSelectedHandCard(null);
                  setPendingAttack(null);
                  setAbilityActive(false);
                }}
              >
                Move
              </button>
            )}

            {champCanAttack && champHasTargets && (
              <button
                className={`btn-holo text-sm ${actionMode === "attack" && !abilityActive ? "ring-1 ring-red-400" : ""}`}
                onClick={() => {
                  setActionMode("attack");
                  setSelectedHandCard(null);
                  setPendingAttack(null);
                  setAbilityActive(false);
                }}
              >
                Attack
              </button>
            )}

            {abilityAvailable && (
              <button
                className={`btn-holo text-sm ${
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

            {!champCanMove && !champCanAttack && (
              <p className="text-xs text-[var(--text-muted)] italic">
                No actions remaining
              </p>
            )}
          </div>
        )}

        {/* Deploy section */}
        {deployAvailable && (
          <div className="flex flex-col gap-2">
            <button
              className={`btn-holo text-sm ${actionMode === "deploy" ? "ring-1 ring-green-400" : ""}`}
              onClick={() => {
                setActionMode("deploy");
                setDeckExpanded(true);
                setSelectedHex(null);
                setPendingAttack(null);
                setAbilityActive(false);
              }}
              disabled={player.hand.length === 0}
            >
              Deploy Champion
            </button>
          </div>
        )}

        {/* Compressed Hand Stack */}
        {player.hand.length > 0 && (
          <div className="flex flex-col items-center gap-1">
            <div
              className="relative cursor-pointer hover:brightness-110 transition-all"
              style={{ height: 32 * (player.hand.length - 1) + 192, width: 128 }}
              onClick={() => setDeckExpanded(true)}
            >
              {player.hand.map((card, i) => (
                <div
                  key={card.id}
                  className="absolute pointer-events-none"
                  style={{ top: i * 32, zIndex: i }}
                >
                  <Card
                    card={card}
                    small
                    selected={selectedHandCard === card.id}
                    disabled
                  />
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
              {player.hand.length} card{player.hand.length !== 1 ? "s" : ""} &mdash; click to view
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col gap-2 md:items-stretch">
          {showEndTurnWarning && deployAvailable ? (
            <div className="player-panel px-4 py-3 flex flex-col gap-2 animate-fade-in">
              <p className="text-sm text-amber-400">
                You haven&apos;t deployed a champion this turn. End turn anyway?
              </p>
              <div className="flex gap-2">
                <button
                  className="btn-holo flex-1 text-sm"
                  onClick={() => setShowEndTurnWarning(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-holo flex-1 text-sm ring-1 ring-amber-400"
                  onClick={doEndTurn}
                >
                  End Turn
                </button>
              </div>
            </div>
          ) : (
            <button className="btn-holo" onClick={handleEndTurn}>
              End Turn
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

      {/* Right panel: Board */}
      <div
        className="flex-1 min-w-0 flex items-center justify-center"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <HexGrid
          state={state}
          validTargets={validTargets}
          swapTargets={swapTargets}
          selectedHex={selectedHex}
          onHexClick={handleHexClick}
          onChampionClick={handleChampionClick}
          onChampionDoubleClick={handleDoubleClick}
          onChampionPointerDown={handlePointerDown}
          onChampionHover={(champion, e) => {
            if (champion && !isDraggingRef.current) setHoveredChampion({ champion, x: e.clientX, y: e.clientY });
          }}
          onChampionHoverEnd={() => setHoveredChampion(null)}
          dragGhost={isDraggingRef.current && dragChampion && dragPos ? { coord: dragChampion, pos: dragPos } : null}
          svgRef={svgRef}
        />

        {hoveredChampion && (
          <ChampionTooltip
            champion={hoveredChampion.champion}
            x={hoveredChampion.x}
            y={hoveredChampion.y}
          />
        )}
      </div>

      {/* Expanded Hand Overlay */}
      {deckExpanded && player.hand.length > 0 && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              setDeckExpanded(false);
              if (actionMode === "deploy") {
                setActionMode("none");
                setSelectedHandCard(null);
              }
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-4 p-8 max-w-[90vw]">
            {actionMode === "deploy" && (
              <p className="text-sm uppercase tracking-widest text-[var(--text-muted)]">
                Select a champion to deploy
              </p>
            )}
            <div className="flex gap-4 flex-wrap justify-center">
              {player.hand.map((card) => (
                <Card
                  key={card.id}
                  card={card}
                  selected={selectedHandCard === card.id}
                  onClick={() => {
                    if (actionMode === "deploy" && deployAvailable) {
                      setSelectedHandCard(card.id);
                      setSelectedHex(null);
                      setPendingAttack(null);
                      setDeckExpanded(false);
                    } else {
                      setDeckExpanded(false);
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
