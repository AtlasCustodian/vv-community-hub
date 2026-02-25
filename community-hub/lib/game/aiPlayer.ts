import type {
  GameState,
  AIDifficulty,
  Card,
  HexCoord,
  BoardChampion,
  HexTile,
} from "@/types/game";
import {
  getDraftOptions,
  getValidPlacementTiles,
  getMovableChampions,
  getValidMoves,
  moveChampion,
  getAttackableChampions,
  getAttackTargets,
  previewAttack,
  resolveAttack,
  canDeployThisTurn,
  getValidDeploymentTiles,
  playChampionFromHand,
  hasAbilityAvailable,
  resolveDefenderAbility,
  resolveAttackerAbility,
  resolveBruiserAbility,
  endTurn,
  autoDrawCard,
  willDeployBeAvailable,
  getPlayerChampionsOnBoard,
} from "./gameEngine";
import { hexDistance, hexNeighbors, getTile } from "./hexMath";

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function tilePointValue(board: HexTile[], coord: HexCoord): number {
  const tile = getTile(coord, board);
  return tile?.pointValue ?? 0;
}

function countAdjacentEnemies(
  board: HexTile[],
  coord: HexCoord,
  playerId: number
): number {
  return hexNeighbors(coord).filter((n) => {
    const t = getTile(n, board);
    return t?.occupant && t.occupant.playerId !== playerId;
  }).length;
}

function countAdjacentFriendlies(
  board: HexTile[],
  coord: HexCoord,
  playerId: number
): number {
  return hexNeighbors(coord).filter((n) => {
    const t = getTile(n, board);
    return t?.occupant && t.occupant.playerId === playerId;
  }).length;
}

// ---------------------------------------------------------------------------
// Draft AI
// ---------------------------------------------------------------------------

export function aiDraft(
  state: GameState,
  difficulty: AIDifficulty
): string[] {
  const player = state.players[state.currentPlayerIndex];
  const { options } = getDraftOptions(player);

  if (options.length <= 2) return options.map((c) => c.id);

  switch (difficulty) {
    case "easy":
      return shuffled(options).slice(0, 2).map((c) => c.id);

    case "medium": {
      const scored = options
        .map((c) => ({ card: c, score: c.attack + c.defense }))
        .sort((a, b) => b.score - a.score);
      return scored.slice(0, 2).map((s) => s.card.id);
    }

    case "hard": {
      const classCount: Record<string, number> = {
        attacker: 0,
        defender: 0,
        bruiser: 0,
      };
      for (const c of player.hand) classCount[c.championClass]++;

      const scored = options
        .map((c) => {
          let score = c.attack * 1.3 + c.defense * 1.0 + c.health * 0.1;
          if (classCount[c.championClass] === 0) score += 3;
          if (c.championClass === "bruiser") score += 1;
          return { card: c, score };
        })
        .sort((a, b) => b.score - a.score);
      return scored.slice(0, 2).map((s) => s.card.id);
    }
  }
}

// ---------------------------------------------------------------------------
// Placement AI
// ---------------------------------------------------------------------------

export function aiPlace(
  state: GameState,
  difficulty: AIDifficulty
): { cardId: string; position: HexCoord } {
  const player = state.players[state.currentPlayerIndex];
  const validTiles = getValidPlacementTiles(state, state.currentPlayerIndex);
  const hand = player.hand;

  if (hand.length === 0 || validTiles.length === 0) {
    return { cardId: hand[0]?.id ?? "", position: validTiles[0] ?? { q: 0, r: 0 } };
  }

  switch (difficulty) {
    case "easy":
      return { cardId: pickRandom(hand).id, position: pickRandom(validTiles) };

    case "medium": {
      const bestCard = [...hand].sort(
        (a, b) => b.attack + b.defense - (a.attack + a.defense)
      )[0];
      const bestTile = [...validTiles].sort(
        (a, b) => hexDistance(a, { q: 0, r: 0 }) - hexDistance(b, { q: 0, r: 0 })
      )[0];
      return { cardId: bestCard.id, position: bestTile };
    }

    case "hard": {
      let bestScore = -Infinity;
      let bestCardId = hand[0].id;
      let bestPos = validTiles[0];

      for (const card of hand) {
        for (const pos of validTiles) {
          let score = tilePointValue(state.board, pos) * 2;
          score -= hexDistance(pos, { q: 0, r: 0 }) * 1.5;
          score += card.attack * 1.2 + card.defense * 0.8;

          const enemyAdj = countAdjacentEnemies(state.board, pos, state.currentPlayerIndex);
          if (enemyAdj > 0 && card.championClass === "defender") score += 3;
          if (enemyAdj === 0) score += 2;

          if (score > bestScore) {
            bestScore = score;
            bestCardId = card.id;
            bestPos = pos;
          }
        }
      }
      return { cardId: bestCardId, position: bestPos };
    }
  }
}

// ---------------------------------------------------------------------------
// Turn AI - returns a sequence of actions the AI wants to take
// ---------------------------------------------------------------------------

interface AIAction {
  type: "move" | "attack" | "deploy" | "ability" | "endTurn";
  apply: (state: GameState) => GameState;
}

export function aiPlanTurn(
  state: GameState,
  difficulty: AIDifficulty
): AIAction[] {
  switch (difficulty) {
    case "easy":
      return planTurnEasy(state);
    case "medium":
      return planTurnMedium(state);
    case "hard":
      return planTurnHard(state);
  }
}

// ---------------------------------------------------------------------------
// Easy: random valid actions
// ---------------------------------------------------------------------------

function planTurnEasy(state: GameState): AIAction[] {
  const actions: AIAction[] = [];
  const pid = state.currentPlayerIndex;
  let simState = state;

  if (canDeployThisTurn(simState) && simState.players[pid].hand.length > 0) {
    const deployTiles = getValidDeploymentTiles(simState, pid);
    if (deployTiles.length > 0) {
      const card = pickRandom(simState.players[pid].hand);
      const pos = pickRandom(deployTiles);
      const capturedCard = card.id;
      const capturedPos = { ...pos };
      actions.push({
        type: "deploy",
        apply: (s) => playChampionFromHand(s, capturedCard, capturedPos),
      });
      simState = playChampionFromHand(simState, capturedCard, capturedPos);
    }
  }

  const movable = getMovableChampions(simState, pid);
  if (movable.length > 0) {
    const champ = pickRandom(movable);
    const moves = getValidMoves(simState, champ.position);
    const emptyMoves = moves.filter((m) => !getTile(m, simState.board)?.occupant);
    if (emptyMoves.length > 0) {
      const target = pickRandom(emptyMoves);
      const from = { ...champ.position };
      const to = { ...target };
      actions.push({
        type: "move",
        apply: (s) => moveChampion(s, from, to),
      });
      simState = moveChampion(simState, from, to);
    }
  }

  const attackable = getAttackableChampions(simState, pid);
  if (attackable.length > 0) {
    const attacker = pickRandom(attackable);
    const targets = getAttackTargets(simState, attacker.position);
    if (targets.length > 0) {
      const target = pickRandom(targets);
      const atkPos = { ...attacker.position };
      const defPos = { ...target.position };
      actions.push({
        type: "attack",
        apply: (s) => resolveAttack(s, atkPos, defPos),
      });
    }
  }

  actions.push({ type: "endTurn", apply: (s) => endTurn(s) });
  return actions;
}

// ---------------------------------------------------------------------------
// Medium: heuristic-based decisions
// ---------------------------------------------------------------------------

function planTurnMedium(state: GameState): AIAction[] {
  const actions: AIAction[] = [];
  const pid = state.currentPlayerIndex;
  let simState = state;

  // Deploy: pick the highest-stat card, best tile
  if (canDeployThisTurn(simState) && simState.players[pid].hand.length > 0) {
    const deployTiles = getValidDeploymentTiles(simState, pid);
    if (deployTiles.length > 0) {
      const bestCard = [...simState.players[pid].hand].sort(
        (a, b) => b.attack + b.defense - (a.attack + a.defense)
      )[0];
      const bestTile = [...deployTiles].sort((a, b) => {
        const aScore = tilePointValue(simState.board, a) - hexDistance(a, { q: 0, r: 0 }) * 0.5;
        const bScore = tilePointValue(simState.board, b) - hexDistance(b, { q: 0, r: 0 }) * 0.5;
        return bScore - aScore;
      })[0];

      const capturedCard = bestCard.id;
      const capturedPos = { ...bestTile };
      actions.push({
        type: "deploy",
        apply: (s) => playChampionFromHand(s, capturedCard, capturedPos),
      });
      simState = playChampionFromHand(simState, capturedCard, capturedPos);
    }
  }

  // Move: each champion toward higher-value tiles or toward enemies
  const movable = getMovableChampions(simState, pid);
  for (const champ of movable) {
    const moves = getValidMoves(simState, champ.position);
    const emptyMoves = moves.filter((m) => !getTile(m, simState.board)?.occupant);
    if (emptyMoves.length === 0) continue;

    const scored = emptyMoves.map((m) => {
      let score = tilePointValue(simState.board, m) * 3;
      score -= hexDistance(m, { q: 0, r: 0 });
      const enemyAdj = countAdjacentEnemies(simState.board, m, pid);
      if (enemyAdj > 0) score += 4;
      return { coord: m, score };
    });

    const currentScore =
      tilePointValue(simState.board, champ.position) * 3 -
      hexDistance(champ.position, { q: 0, r: 0 });

    scored.sort((a, b) => b.score - a.score);
    if (scored[0] && scored[0].score > currentScore) {
      const from = { ...champ.position };
      const to = { ...scored[0].coord };
      actions.push({
        type: "move",
        apply: (s) => moveChampion(s, from, to),
      });
      simState = moveChampion(simState, from, to);
    }
  }

  // Abilities
  const championsOnBoard = getPlayerChampionsOnBoard(simState, pid);
  for (const champ of championsOnBoard) {
    if (!hasAbilityAvailable(simState, champ.card.id)) continue;
    if (simState.attackedChampions.has(champ.card.id)) continue;

    if (champ.card.championClass === "defender") {
      if (champ.currentHealth < champ.card.maxHealth * 0.5) {
        const pos = { ...champ.position };
        actions.push({
          type: "ability",
          apply: (s) => resolveDefenderAbility(s, pos),
        });
        simState = resolveDefenderAbility(simState, champ.position);
      }
    } else if (champ.card.championClass === "attacker") {
      const adjEnemies = countAdjacentEnemies(simState.board, champ.position, pid);
      if (adjEnemies >= 2) {
        const pos = { ...champ.position };
        actions.push({
          type: "ability",
          apply: (s) => resolveAttackerAbility(s, pos),
        });
        simState = resolveAttackerAbility(simState, champ.position);
      }
    }
  }

  // Attack: prefer kills, then highest damage
  const attackable = getAttackableChampions(simState, pid);
  for (const attacker of attackable) {
    const targets = getAttackTargets(simState, attacker.position);
    if (targets.length === 0) continue;

    const scored = targets.map((t) => {
      const preview = previewAttack(simState, attacker.position, t.position);
      if (!preview) return { target: t, score: 0 };
      let score = preview.damage * 2;
      if (preview.defenderDestroyed) score += 15;
      return { target: t, score };
    });

    scored.sort((a, b) => b.score - a.score);
    if (scored[0] && scored[0].score > 0) {
      const atkPos = { ...attacker.position };
      const defPos = { ...scored[0].target.position };

      if (attacker.card.championClass === "bruiser" &&
          hasAbilityAvailable(simState, attacker.card.id) &&
          attacker.currentHealth < attacker.card.maxHealth * 0.7) {
        actions.push({
          type: "ability",
          apply: (s) => resolveBruiserAbility(s, atkPos, defPos),
        });
        simState = resolveBruiserAbility(simState, atkPos, defPos);
      } else {
        actions.push({
          type: "attack",
          apply: (s) => resolveAttack(s, atkPos, defPos),
        });
        simState = resolveAttack(simState, atkPos, defPos);
      }
    }
  }

  actions.push({ type: "endTurn", apply: (s) => endTurn(s) });
  return actions;
}

// ---------------------------------------------------------------------------
// Hard: evaluates all move+attack combos for optimal sequence
// ---------------------------------------------------------------------------

function scoreBoardState(state: GameState, playerId: number): number {
  let score = 0;
  const player = state.players[playerId];
  score += player.score * 2;

  for (const tile of state.board) {
    if (!tile.occupant) continue;
    if (tile.occupant.playerId === playerId) {
      score += tile.pointValue * 3;
      score += tile.occupant.currentHealth * 0.3;
      score += tile.occupant.card.attack * 0.5;
      const friendlyAdj = countAdjacentFriendlies(state.board, tile.coord, playerId);
      score += friendlyAdj * 0.5;
    } else {
      score -= tile.pointValue * 2;
      if (tile.occupant.currentHealth <= 5) score += 2;
    }
  }

  for (const p of state.players) {
    if (p.id !== playerId && p.isEliminated) score += 20;
  }

  return score;
}

function planTurnHard(state: GameState): AIAction[] {
  const actions: AIAction[] = [];
  const pid = state.currentPlayerIndex;
  let simState = state;

  // Deploy first (best card + best tile by scoring)
  if (canDeployThisTurn(simState) && simState.players[pid].hand.length > 0) {
    const deployTiles = getValidDeploymentTiles(simState, pid);
    if (deployTiles.length > 0) {
      let bestScore = -Infinity;
      let bestCard: Card | null = null;
      let bestTile: HexCoord | null = null;

      for (const card of simState.players[pid].hand) {
        for (const tile of deployTiles) {
          const testState = playChampionFromHand(simState, card.id, tile);
          const score = scoreBoardState(testState, pid);
          if (score > bestScore) {
            bestScore = score;
            bestCard = card;
            bestTile = tile;
          }
        }
      }

      if (bestCard && bestTile) {
        const capturedCard = bestCard.id;
        const capturedPos = { ...bestTile };
        actions.push({
          type: "deploy",
          apply: (s) => playChampionFromHand(s, capturedCard, capturedPos),
        });
        simState = playChampionFromHand(simState, capturedCard, capturedPos);
      }
    }
  }

  // Evaluate all possible move+attack combos per champion
  const movable = getMovableChampions(simState, pid);
  const moveActions: AIAction[] = [];

  for (const champ of movable) {
    const validMoves = getValidMoves(simState, champ.position);
    const emptyMoves = validMoves.filter((m) => !getTile(m, simState.board)?.occupant);
    const candidates: { from: HexCoord; to: HexCoord; score: number }[] = [];

    // Staying in place is also an option
    const stayScore =
      tilePointValue(simState.board, champ.position) * 3 -
      countAdjacentEnemies(simState.board, champ.position, pid) * 2 +
      countAdjacentFriendlies(simState.board, champ.position, pid);

    for (const dest of emptyMoves) {
      let score = tilePointValue(simState.board, dest) * 3;
      score -= hexDistance(dest, { q: 0, r: 0 });

      const testState = moveChampion(simState, champ.position, dest);
      const attackable = getAttackTargets(testState, dest);
      for (const target of attackable) {
        const preview = previewAttack(testState, dest, target.position);
        if (preview) {
          let atkValue = preview.damage * 2;
          if (preview.defenderDestroyed) atkValue += 15;
          score += atkValue;
        }
      }

      const enemyAdj = countAdjacentEnemies(simState.board, dest, pid);
      const friendlyAdj = countAdjacentFriendlies(simState.board, dest, pid);
      score += friendlyAdj * 0.5;
      score -= enemyAdj * 1.5;

      candidates.push({ from: { ...champ.position }, to: { ...dest }, score });
    }

    candidates.sort((a, b) => b.score - a.score);
    if (candidates[0] && candidates[0].score > stayScore) {
      const best = candidates[0];
      moveActions.push({
        type: "move",
        apply: (s) => moveChampion(s, best.from, best.to),
      });
      simState = moveChampion(simState, best.from, best.to);
    }
  }

  actions.push(...moveActions);

  // Abilities (before attacks where beneficial)
  const championsOnBoard = getPlayerChampionsOnBoard(simState, pid);
  for (const champ of championsOnBoard) {
    if (!hasAbilityAvailable(simState, champ.card.id)) continue;
    if (simState.attackedChampions.has(champ.card.id)) continue;

    if (champ.card.championClass === "defender") {
      const hpRatio = champ.currentHealth / champ.card.maxHealth;
      if (hpRatio < 0.6) {
        const pos = { ...champ.position };
        actions.push({
          type: "ability",
          apply: (s) => resolveDefenderAbility(s, pos),
        });
        simState = resolveDefenderAbility(simState, champ.position);
      }
    } else if (champ.card.championClass === "attacker") {
      const adjEnemies = countAdjacentEnemies(simState.board, champ.position, pid);
      const targets = getAttackTargets(simState, champ.position);
      let totalCleaveValue = 0;
      for (const t of targets) {
        const preview = previewAttack(simState, champ.position, t.position);
        if (preview) {
          totalCleaveValue += preview.damage * 2;
          if (preview.defenderDestroyed) totalCleaveValue += 15;
        }
      }
      const singleBest = targets.reduce((best, t) => {
        const preview = previewAttack(simState, champ.position, t.position);
        if (!preview) return best;
        const val = preview.damage * 2 + (preview.defenderDestroyed ? 15 : 0);
        return val > best ? val : best;
      }, 0);

      if (adjEnemies >= 2 && totalCleaveValue > singleBest * 1.3) {
        const pos = { ...champ.position };
        actions.push({
          type: "ability",
          apply: (s) => resolveAttackerAbility(s, pos),
        });
        simState = resolveAttackerAbility(simState, champ.position);
      }
    }
  }

  // Attacks: evaluate each attacker's best target
  const attackable = getAttackableChampions(simState, pid);
  for (const attacker of attackable) {
    const targets = getAttackTargets(simState, attacker.position);
    if (targets.length === 0) continue;

    let bestTarget: BoardChampion | null = null;
    let bestValue = 0;
    let useBruiser = false;

    for (const target of targets) {
      const preview = previewAttack(simState, attacker.position, target.position);
      if (!preview) continue;

      let value = preview.damage * 2;
      if (preview.defenderDestroyed) value += 15;

      if (
        attacker.card.championClass === "bruiser" &&
        hasAbilityAvailable(simState, attacker.card.id)
      ) {
        const healable = attacker.card.maxHealth - attacker.currentHealth;
        const potentialHeal = Math.min(preview.damage, healable);
        const bruiserValue = value + potentialHeal * 1.5;
        if (bruiserValue > value && potentialHeal > 2) {
          if (bruiserValue > bestValue) {
            bestValue = bruiserValue;
            bestTarget = target;
            useBruiser = true;
          }
          continue;
        }
      }

      if (value > bestValue) {
        bestValue = value;
        bestTarget = target;
        useBruiser = false;
      }
    }

    if (bestTarget && bestValue > 0) {
      const atkPos = { ...attacker.position };
      const defPos = { ...bestTarget.position };

      if (useBruiser) {
        actions.push({
          type: "ability",
          apply: (s) => resolveBruiserAbility(s, atkPos, defPos),
        });
        simState = resolveBruiserAbility(simState, atkPos, defPos);
      } else {
        actions.push({
          type: "attack",
          apply: (s) => resolveAttack(s, atkPos, defPos),
        });
        simState = resolveAttack(simState, atkPos, defPos);
      }
    }
  }

  actions.push({ type: "endTurn", apply: (s) => endTurn(s) });
  return actions;
}

// ---------------------------------------------------------------------------
// Convenience: run the full AI interstitial → turn continuation
// ---------------------------------------------------------------------------

export function aiHandleInterstitial(state: GameState): GameState {
  const player = state.players[state.currentPlayerIndex];
  const hasDrafted = player.hand.length > 0;

  let nextPhase: GameState["phase"];
  if (!hasDrafted) {
    nextPhase = "draft";
  } else if (state.turnNumber === 0) {
    nextPhase = "placement";
  } else {
    nextPhase = "turn";
  }

  let newState: GameState = { ...state, phase: nextPhase };
  if (nextPhase === "turn" && willDeployBeAvailable(newState)) {
    newState = autoDrawCard(newState);
  }

  return newState;
}
