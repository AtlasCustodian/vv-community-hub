import type {
  Card,
  GameState,
  Player,
  HexTile,
  HexCoord,
  BoardChampion,
  CombatResult,
  FactionId,
} from "@/types/game";
import { shuffleDeck } from "./cardBuilder";
import {
  generateBoard,
  getSpawnZones,
  hexNeighbors,
  hexEquals,
  hexDistance,
  getTile,
} from "./hexMath";
import { FACTION_THEMES } from "./factionThemes";

export function createInitialGameState(
  factionDecks: Record<FactionId, Card[]>,
  factionIds: FactionId[]
): GameState {
  const board = generateBoard();
  const spawnZones = getSpawnZones();

  const players: Player[] = factionIds.map((fid, i) => ({
    id: i,
    factionId: fid,
    factionName: FACTION_THEMES[fid].name,
    hand: [],
    drawPile: shuffleDeck([...factionDecks[fid]]),
    discardPile: [],
    score: 0,
    isEliminated: false,
    spawnZone: spawnZones[i],
  }));

  const playerTurnCounts: Record<number, number> = {};
  for (let i = 0; i < players.length; i++) {
    playerTurnCounts[i] = 0;
  }

  return {
    phase: "draft",
    players,
    board,
    currentPlayerIndex: 0,
    turnNumber: 0,
    turnOrder: [0, 1, 2],
    turnOrderIndex: 0,
    winner: null,
    draftSelections: new Map(),
    selectedChampionForMove: null,
    movedChampions: new Set(),
    attackedChampions: new Set(),
    usedAbilityChampions: new Set(),
    playerTurnCounts,
    hasDeployedThisTurn: false,
    lastCombatResult: null,
    log: ["Game started! Each player selects 2 champions from 5."],
  };
}

// --- Draft Phase ---

export function getDraftOptions(player: Player): {
  options: Card[];
  remaining: Card[];
} {
  const options = player.drawPile.slice(0, 5);
  const remaining = player.drawPile.slice(5);
  return { options, remaining };
}

export function completeDraft(
  state: GameState,
  playerIndex: number,
  selectedCardIds: string[]
): GameState {
  const newState = cloneState(state);
  const player = newState.players[playerIndex];
  const { options, remaining } = getDraftOptions(player);

  const selected = options.filter((c) => selectedCardIds.includes(c.id));
  const notSelected = options.filter((c) => !selectedCardIds.includes(c.id));

  // Draw 1 random from remaining deck
  const randomIdx = Math.floor(Math.random() * remaining.length);
  const randomCard = remaining[randomIdx];
  const finalRemaining = remaining.filter((_, i) => i !== randomIdx);

  player.hand = [...selected, randomCard];
  player.drawPile = shuffleDeck([...notSelected, ...finalRemaining]);

  newState.log.push(
    `${FACTION_THEMES[player.factionId].name} drafted ${selected.map((c) => c.name).join(", ")} and drew ${randomCard.name}.`
  );

  const nextPlayer = playerIndex + 1;
  if (nextPlayer < newState.players.length) {
    newState.currentPlayerIndex = nextPlayer;
    newState.phase = "interstitial";
  } else {
    newState.phase = "placement";
    newState.currentPlayerIndex = 0;
    newState.log.push("Draft complete! Place your first champion on the board.");
  }

  return newState;
}

// --- Placement Phase ---

export function getValidPlacementTiles(
  state: GameState,
  playerIndex: number
): HexCoord[] {
  const player = state.players[playerIndex];
  return player.spawnZone.filter((coord) => {
    const tile = getTile(coord, state.board);
    return tile && !tile.occupant;
  });
}

export function placeChampion(
  state: GameState,
  playerIndex: number,
  cardId: string,
  position: HexCoord
): GameState {
  const newState = cloneState(state);
  const player = newState.players[playerIndex];

  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return state;

  const card = player.hand[cardIndex];
  player.hand.splice(cardIndex, 1);

  const tile = getTile(position, newState.board);
  if (!tile) return state;

  tile.occupant = {
    card: { ...card },
    playerId: playerIndex,
    position: { ...position },
    currentHealth: card.health,
  };

  newState.log.push(
    `${FACTION_THEMES[player.factionId].name} placed ${card.name} on the board.`
  );

  const nextPlayer = playerIndex + 1;
  if (nextPlayer < newState.players.length) {
    newState.currentPlayerIndex = nextPlayer;
    newState.phase = "interstitial";
  } else {
    newState.phase = "turn";
    newState.turnNumber = 1;

    const firstPlayer = determineFirstPlayer(newState);
    const order: number[] = [];
    for (let i = 0; i < newState.players.length; i++) {
      order.push((firstPlayer + i) % newState.players.length);
    }
    newState.turnOrder = order;
    newState.turnOrderIndex = 0;
    newState.currentPlayerIndex = firstPlayer;

    newState.log.push(
      `All champions placed! ${FACTION_THEMES[newState.players[firstPlayer].factionId].name} goes first (highest defense).`
    );

    return autoDrawCard(newState);
  }

  return newState;
}

function getTotalBoardDefense(state: GameState, playerId: number): number {
  let total = 0;
  for (const tile of state.board) {
    if (tile.occupant && tile.occupant.playerId === playerId) {
      total += tile.occupant.card.defense;
    }
  }
  return total;
}

function determineFirstPlayer(state: GameState): number {
  let bestDefense = -1;
  let bestPlayer = 0;

  for (const player of state.players) {
    const totalDef = getTotalBoardDefense(state, player.id);
    if (totalDef > bestDefense) {
      bestDefense = totalDef;
      bestPlayer = player.id;
    }
  }

  return bestPlayer;
}

// --- Turn Phase ---

export function autoDrawCard(state: GameState): GameState {
  const newState = cloneState(state);
  const player = newState.players[newState.currentPlayerIndex];

  if (player.hand.length >= 5) {
    newState.log.push(`${FACTION_THEMES[player.factionId].name}'s hand is full (5 cards).`);
    return newState;
  }
  if (player.drawPile.length === 0) {
    newState.log.push(`${FACTION_THEMES[player.factionId].name} has no cards to draw.`);
    return newState;
  }

  const card = player.drawPile[0];
  player.drawPile = player.drawPile.slice(1);
  player.hand.push(card);

  newState.log.push(`${FACTION_THEMES[player.factionId].name} drew ${card.name}.`);
  return newState;
}

export function canDeployThisTurn(state: GameState): boolean {
  const playerId = state.currentPlayerIndex;
  const turnCount = state.playerTurnCounts[playerId] ?? 0;
  if (state.hasDeployedThisTurn) return false;
  if (state.players[playerId].hand.length === 0) return false;
  return turnCount % 2 === 0;
}

export function willDeployBeAvailable(state: GameState): boolean {
  const playerId = state.currentPlayerIndex;
  const turnCount = state.playerTurnCounts[playerId] ?? 0;
  return turnCount % 2 === 0;
}

export function getMovableChampions(
  state: GameState,
  playerIndex: number
): BoardChampion[] {
  return state.board
    .filter(
      (t) =>
        t.occupant &&
        t.occupant.playerId === playerIndex &&
        !state.movedChampions.has(t.occupant.card.id)
    )
    .map((t) => t.occupant!);
}

export function getValidMoves(
  state: GameState,
  position: HexCoord
): HexCoord[] {
  const fromTile = getTile(position, state.board);
  if (!fromTile?.occupant) return [];
  const playerId = fromTile.occupant.playerId;

  return hexNeighbors(position).filter((n) => {
    const tile = getTile(n, state.board);
    if (!tile) return false;
    if (!tile.occupant) return true;
    return (
      tile.occupant.playerId === playerId &&
      !state.movedChampions.has(tile.occupant.card.id)
    );
  });
}

export function getSwapTargets(
  state: GameState,
  position: HexCoord
): HexCoord[] {
  const fromTile = getTile(position, state.board);
  if (!fromTile?.occupant) return [];
  const playerId = fromTile.occupant.playerId;

  return hexNeighbors(position).filter((n) => {
    const tile = getTile(n, state.board);
    return (
      tile?.occupant &&
      tile.occupant.playerId === playerId &&
      !state.movedChampions.has(tile.occupant.card.id)
    );
  });
}

export function moveChampion(
  state: GameState,
  fromCoord: HexCoord,
  toCoord: HexCoord
): GameState {
  const newState = cloneState(state);
  const fromTile = getTile(fromCoord, newState.board);
  const toTile = getTile(toCoord, newState.board);

  if (!fromTile?.occupant || !toTile) return state;
  if (hexDistance(fromCoord, toCoord) !== 1) return state;
  if (state.movedChampions.has(fromTile.occupant.card.id)) return state;

  if (toTile.occupant) {
    if (toTile.occupant.playerId !== fromTile.occupant.playerId) return state;
    if (state.movedChampions.has(toTile.occupant.card.id)) return state;

    const champA = fromTile.occupant;
    const champB = toTile.occupant;
    champA.position = { ...toCoord };
    champB.position = { ...fromCoord };
    fromTile.occupant = champB;
    toTile.occupant = champA;

    newState.movedChampions.add(champA.card.id);
    newState.movedChampions.add(champB.card.id);
  } else {
    const champ = fromTile.occupant;
    champ.position = { ...toCoord };
    toTile.occupant = champ;
    fromTile.occupant = null;

    newState.movedChampions.add(champ.card.id);
  }

  return newState;
}

// --- Combat & Deploy ---

export function getAttackableChampions(
  state: GameState,
  playerIndex: number
): BoardChampion[] {
  return state.board
    .filter(
      (t) =>
        t.occupant &&
        t.occupant.playerId === playerIndex &&
        !state.attackedChampions.has(t.occupant.card.id)
    )
    .map((t) => t.occupant!)
    .filter((champ) => getAttackTargets(state, champ.position).length > 0);
}

export function getAttackTargets(
  state: GameState,
  attackerCoord: HexCoord
): BoardChampion[] {
  const attacker = getTile(attackerCoord, state.board)?.occupant;
  if (!attacker) return [];
  if (state.attackedChampions.has(attacker.card.id)) return [];

  return hexNeighbors(attackerCoord)
    .map((n) => getTile(n, state.board)?.occupant)
    .filter(
      (occ): occ is BoardChampion =>
        occ !== null && occ !== undefined && occ.playerId !== attacker.playerId
    );
}

function calculateCombat(
  board: HexTile[],
  attackerCoord: HexCoord,
  defenderCoord: HexCoord
): CombatResult | null {
  const attackerTile = getTile(attackerCoord, board);
  const defenderTile = getTile(defenderCoord, board);

  if (!attackerTile?.occupant || !defenderTile?.occupant) return null;

  const attacker = attackerTile.occupant;
  const defender = defenderTile.occupant;

  const defNeighbors = hexNeighbors(defenderCoord);
  let friendlyAdj = 0;
  let hostileAdj = 0;

  for (const n of defNeighbors) {
    const tile = getTile(n, board);
    if (tile?.occupant) {
      if (tile.occupant.playerId === defender.playerId) friendlyAdj++;
      else hostileAdj++;
    }
  }

  const effectiveDefense = defender.card.defense + friendlyAdj - hostileAdj;

  const atkNeighbors = hexNeighbors(attackerCoord);
  const attackerFriendlyAdj = atkNeighbors.filter((n) => {
    const tile = getTile(n, board);
    return tile?.occupant && tile.occupant.playerId === attacker.playerId;
  }).length;

  const loneWolfBonus = attackerFriendlyAdj === 0 ? 2 : 0;
  const effectiveAttack = attacker.card.attack + loneWolfBonus;

  const damage = Math.max(0, effectiveAttack - effectiveDefense);
  const remainingHealth = Math.max(0, defender.currentHealth - damage);
  const destroyed = remainingHealth <= 0;

  return {
    attackerId: attacker.card.id,
    defenderId: defender.card.id,
    attackerName: attacker.card.name,
    defenderName: defender.card.name,
    attackerPosition: { ...attackerCoord },
    defenderPosition: { ...defenderCoord },
    rawAttack: attacker.card.attack,
    effectiveAttack,
    loneWolfBonus,
    rawDefense: defender.card.defense,
    effectiveDefense,
    defenderFriendlyAdj: friendlyAdj,
    defenderHostileAdj: hostileAdj,
    defenderCurrentHealth: defender.currentHealth,
    damage,
    defenderDestroyed: destroyed,
    defenderRemainingHealth: remainingHealth,
  };
}

export function previewAttack(
  state: GameState,
  attackerCoord: HexCoord,
  defenderCoord: HexCoord
): CombatResult | null {
  return calculateCombat(state.board, attackerCoord, defenderCoord);
}

export function resolveAttack(
  state: GameState,
  attackerCoord: HexCoord,
  defenderCoord: HexCoord
): GameState {
  const newState = cloneState(state);

  const result = calculateCombat(newState.board, attackerCoord, defenderCoord);
  if (!result) return state;

  const defenderTile = getTile(defenderCoord, newState.board);
  if (!defenderTile?.occupant) return state;

  const defender = defenderTile.occupant;
  defender.currentHealth = result.defenderRemainingHealth;

  newState.lastCombatResult = result;
  newState.attackedChampions.add(result.attackerId);

  if (result.defenderDestroyed) {
    const defPlayer = newState.players[defender.playerId];
    defPlayer.discardPile.push(defender.card);
    defenderTile.occupant = null;

    const attackerTile = getTile(attackerCoord, newState.board);
    if (attackerTile?.occupant) {
      const atkPlayer = newState.players[attackerTile.occupant.playerId];
      atkPlayer.score += 3;

      attackerTile.occupant.position = { q: defenderCoord.q, r: defenderCoord.r };
      defenderTile.occupant = attackerTile.occupant;
      attackerTile.occupant = null;
    }

    newState.log.push(
      `${result.attackerName} attacked ${result.defenderName} for ${result.damage} damage — ${result.defenderName} was destroyed! ${result.attackerName} advances. (+3 kill points)`
    );

    checkElimination(newState, defender.playerId);
  } else {
    newState.log.push(
      `${result.attackerName} attacked ${result.defenderName} for ${result.damage} damage. (${defender.currentHealth} HP remaining)`
    );
  }

  return newState;
}

// --- Champion Abilities (once per card) ---

export function hasAbilityAvailable(state: GameState, cardId: string): boolean {
  return !state.usedAbilityChampions.has(cardId);
}

export function getAbilityName(championClass: Card["championClass"]): string {
  switch (championClass) {
    case "defender": return "Heal (+10 HP)";
    case "attacker": return "Cleave (All Adjacent)";
    case "bruiser": return "Lifesteal";
  }
}

export function resolveDefenderAbility(
  state: GameState,
  championCoord: HexCoord
): GameState {
  const newState = cloneState(state);
  const tile = getTile(championCoord, newState.board);
  if (!tile?.occupant) return state;

  const champ = tile.occupant;
  if (champ.card.championClass !== "defender") return state;
  if (newState.usedAbilityChampions.has(champ.card.id)) return state;

  const healAmount = Math.min(10, champ.card.maxHealth - champ.currentHealth);
  champ.currentHealth = Math.min(champ.card.maxHealth, champ.currentHealth + 10);

  newState.usedAbilityChampions.add(champ.card.id);
  newState.attackedChampions.add(champ.card.id);
  newState.log.push(
    `${champ.card.name} used Heal — restored ${healAmount} HP (${champ.currentHealth}/${champ.card.maxHealth} HP).`
  );

  return newState;
}

export function resolveAttackerAbility(
  state: GameState,
  championCoord: HexCoord
): GameState {
  const newState = cloneState(state);
  const tile = getTile(championCoord, newState.board);
  if (!tile?.occupant) return state;

  const champ = tile.occupant;
  if (champ.card.championClass !== "attacker") return state;
  if (newState.usedAbilityChampions.has(champ.card.id)) return state;

  const neighbors = hexNeighbors(championCoord);
  const enemyCoords: HexCoord[] = [];
  for (const n of neighbors) {
    const nTile = getTile(n, newState.board);
    if (nTile?.occupant && nTile.occupant.playerId !== champ.playerId) {
      enemyCoords.push(n);
    }
  }

  const results: string[] = [];
  for (const defCoord of enemyCoords) {
    const result = calculateCombat(newState.board, championCoord, defCoord);
    if (!result) continue;

    const defTile = getTile(defCoord, newState.board);
    if (!defTile?.occupant) continue;

    const defender = defTile.occupant;
    defender.currentHealth = result.defenderRemainingHealth;

    if (result.defenderDestroyed) {
      const defPlayer = newState.players[defender.playerId];
      defPlayer.discardPile.push(defender.card);
      defTile.occupant = null;
      results.push(`${result.defenderName} took ${result.damage} damage — DESTROYED`);
      checkElimination(newState, defender.playerId);
    } else {
      results.push(`${result.defenderName} took ${result.damage} damage (${defender.currentHealth} HP)`);
    }
  }

  newState.usedAbilityChampions.add(champ.card.id);
  newState.attackedChampions.add(champ.card.id);
  newState.lastCombatResult = null;

  if (results.length > 0) {
    newState.log.push(
      `${champ.card.name} used Cleave! ${results.join("; ")}.`
    );
  } else {
    newState.log.push(`${champ.card.name} used Cleave but hit no enemies.`);
  }

  return newState;
}

export function previewBruiserAbility(
  state: GameState,
  attackerCoord: HexCoord,
  defenderCoord: HexCoord
): CombatResult | null {
  const result = calculateCombat(state.board, attackerCoord, defenderCoord);
  if (!result) return null;

  const attackerTile = getTile(attackerCoord, state.board);
  if (!attackerTile?.occupant) return null;

  const maxHeal = attackerTile.occupant.card.maxHealth - attackerTile.occupant.currentHealth;
  result.attackerHealing = Math.min(result.damage, maxHeal);
  return result;
}

export function resolveBruiserAbility(
  state: GameState,
  attackerCoord: HexCoord,
  defenderCoord: HexCoord
): GameState {
  const newState = cloneState(state);

  const result = calculateCombat(newState.board, attackerCoord, defenderCoord);
  if (!result) return state;

  const attackerTile = getTile(attackerCoord, newState.board);
  const defenderTile = getTile(defenderCoord, newState.board);
  if (!attackerTile?.occupant || !defenderTile?.occupant) return state;

  const attacker = attackerTile.occupant;
  const defender = defenderTile.occupant;

  defender.currentHealth = result.defenderRemainingHealth;

  const maxHeal = attacker.card.maxHealth - attacker.currentHealth;
  const healing = Math.min(result.damage, maxHeal);
  attacker.currentHealth = Math.min(attacker.card.maxHealth, attacker.currentHealth + result.damage);
  result.attackerHealing = healing;

  newState.lastCombatResult = result;
  newState.usedAbilityChampions.add(result.attackerId);
  newState.attackedChampions.add(result.attackerId);

  if (result.defenderDestroyed) {
    const defPlayer = newState.players[defender.playerId];
    defPlayer.discardPile.push(defender.card);
    defenderTile.occupant = null;

    attacker.position = { q: defenderCoord.q, r: defenderCoord.r };
    defenderTile.occupant = attacker;
    attackerTile.occupant = null;

    newState.log.push(
      `${result.attackerName} used Lifesteal on ${result.defenderName} for ${result.damage} damage (healed ${healing} HP) — ${result.defenderName} was destroyed! ${result.attackerName} advances.`
    );
    checkElimination(newState, defender.playerId);
  } else {
    newState.log.push(
      `${result.attackerName} used Lifesteal on ${result.defenderName} for ${result.damage} damage, healing ${healing} HP. (${defender.currentHealth} HP remaining)`
    );
  }

  return newState;
}

export function getValidDeploymentTiles(
  state: GameState,
  playerIndex: number
): HexCoord[] {
  const friendlyPositions = state.board
    .filter((t) => t.occupant && t.occupant.playerId === playerIndex)
    .map((t) => t.coord);

  const seen = new Set<string>();
  const candidates: HexCoord[] = [];

  for (const pos of friendlyPositions) {
    for (const neighbor of hexNeighbors(pos)) {
      const key = `${neighbor.q},${neighbor.r}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const tile = getTile(neighbor, state.board);
      if (!tile || tile.occupant) continue;

      const adjacentToEnemy = hexNeighbors(neighbor).some((n2) => {
        const t = getTile(n2, state.board);
        return t?.occupant && t.occupant.playerId !== playerIndex;
      });

      if (!adjacentToEnemy) {
        candidates.push(neighbor);
      }
    }
  }

  return candidates;
}

export function playChampionFromHand(
  state: GameState,
  cardId: string,
  position: HexCoord
): GameState {
  if (!canDeployThisTurn(state)) return state;

  const newState = cloneState(state);
  const player = newState.players[newState.currentPlayerIndex];

  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return state;

  const validPlacements = getValidDeploymentTiles(newState, newState.currentPlayerIndex);

  if (!validPlacements.some((v) => hexEquals(v, position))) return state;

  const card = player.hand[cardIndex];
  player.hand.splice(cardIndex, 1);

  const tile = getTile(position, newState.board);
  if (!tile) return state;

  tile.occupant = {
    card: { ...card },
    playerId: player.id,
    position: { ...position },
    currentHealth: card.health,
  };

  newState.hasDeployedThisTurn = true;
  newState.movedChampions.add(card.id);
  newState.attackedChampions.add(card.id);
  newState.log.push(
    `${FACTION_THEMES[player.factionId].name} deployed ${card.name} to the battlefield.`
  );

  return newState;
}

// --- End of Turn ---

export function endTurn(state: GameState): GameState {
  const newState = cloneState(state);

  const nextIdx = newState.turnOrderIndex + 1;
  let roundEnded = false;

  if (nextIdx >= newState.turnOrder.length) {
    roundEnded = true;
  } else {
    let found = false;
    for (let i = nextIdx; i < newState.turnOrder.length; i++) {
      if (!newState.players[newState.turnOrder[i]].isEliminated) {
        newState.turnOrderIndex = i;
        found = true;
        break;
      }
    }
    if (!found) roundEnded = true;
  }

  if (roundEnded) {
    newState.turnNumber++;

    for (const tile of newState.board) {
      if (tile.occupant && tile.pointValue > 0) {
        const player = newState.players[tile.occupant.playerId];
        if (!player.isEliminated) {
          player.score += tile.pointValue;
        }
      }
    }
    newState.log.push(`Round ${newState.turnNumber - 1} complete — points scored!`);

    const activePlayers = newState.players
      .filter((p) => !p.isEliminated)
      .sort((a, b) => {
        const scoreDiff = b.score - a.score;
        if (scoreDiff !== 0) return scoreDiff;
        return getTotalBoardDefense(newState, b.id) - getTotalBoardDefense(newState, a.id);
      })
      .map((p) => p.id);
    newState.turnOrder = activePlayers;
    newState.turnOrderIndex = 0;
  }

  const winnerIdx = checkWinCondition(newState);
  if (winnerIdx !== null) {
    newState.phase = "victory";
    newState.winner = winnerIdx;
    newState.log.push(
      `${FACTION_THEMES[newState.players[winnerIdx].factionId].name} wins with ${newState.players[winnerIdx].score} points!`
    );
    return newState;
  }

  const nextPlayer = newState.turnOrder[newState.turnOrderIndex];

  if (nextPlayer === undefined || newState.players[nextPlayer].isEliminated) {
    const survivor = newState.players.find((p) => !p.isEliminated);
    if (survivor) {
      newState.phase = "victory";
      newState.winner = survivor.id;
    }
    return newState;
  }

  const currentPlayerId = state.turnOrder[state.turnOrderIndex];
  newState.playerTurnCounts[currentPlayerId] = (newState.playerTurnCounts[currentPlayerId] ?? 0) + 1;

  newState.currentPlayerIndex = nextPlayer;
  newState.phase = "interstitial";
  newState.hasDeployedThisTurn = false;
  newState.movedChampions = new Set();
  newState.attackedChampions = new Set();
  newState.selectedChampionForMove = null;
  newState.lastCombatResult = null;

  return newState;
}

// --- Projected Points ---

export function getProjectedPoints(
  state: GameState,
  playerId: number
): number {
  let points = 0;
  for (const tile of state.board) {
    if (
      tile.occupant &&
      tile.pointValue > 0 &&
      tile.occupant.playerId === playerId
    ) {
      points += tile.pointValue;
    }
  }
  return points;
}

// --- Helpers ---

function checkElimination(state: GameState, playerId: number): void {
  const player = state.players[playerId];
  const hasChampionsOnBoard = state.board.some(
    (t) => t.occupant && t.occupant.playerId === playerId
  );
  const hasCardsInHand = player.hand.length > 0;
  const hasCardsInDeck = player.drawPile.length > 0;

  if (!hasChampionsOnBoard && !hasCardsInHand && !hasCardsInDeck) {
    player.isEliminated = true;
    state.log.push(
      `${FACTION_THEMES[player.factionId].name} has been eliminated!`
    );
  }
}

function checkWinCondition(state: GameState): number | null {
  for (const player of state.players) {
    if (player.score >= 50) return player.id;
  }

  const activePlayers = state.players.filter((p) => !p.isEliminated);
  if (activePlayers.length === 1) return activePlayers[0].id;

  return null;
}

function cloneState(state: GameState): GameState {
  return {
    ...state,
    players: state.players.map((p) => ({
      ...p,
      hand: p.hand.map((c) => ({ ...c })),
      drawPile: p.drawPile.map((c) => ({ ...c })),
      discardPile: p.discardPile.map((c) => ({ ...c })),
      spawnZone: p.spawnZone.map((c) => ({ ...c })),
    })),
    board: state.board.map((t) => ({
      ...t,
      coord: { ...t.coord },
      occupant: t.occupant
        ? {
            ...t.occupant,
            card: { ...t.occupant.card },
            position: { ...t.occupant.position },
          }
        : null,
    })),
    turnOrder: [...state.turnOrder],
    movedChampions: new Set(state.movedChampions),
    attackedChampions: new Set(state.attackedChampions),
    usedAbilityChampions: new Set(state.usedAbilityChampions),
    playerTurnCounts: { ...state.playerTurnCounts },
    draftSelections: new Map(state.draftSelections),
    log: [...state.log],
    lastCombatResult: state.lastCombatResult
      ? { ...state.lastCombatResult }
      : null,
  };
}

export function getPlayerChampionsOnBoard(
  state: GameState,
  playerId: number
): BoardChampion[] {
  return state.board
    .filter((t) => t.occupant && t.occupant.playerId === playerId)
    .map((t) => t.occupant!);
}
