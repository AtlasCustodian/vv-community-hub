const PLAYER_ID_KEY = "vantheon-player-id";
const PLAYER_NAME_KEY = "vantheon-player-name";

function generateUUID(): string {
  return crypto.randomUUID();
}

export function getPlayerId(): string {
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = generateUUID();
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

export function getPlayerName(): string | null {
  return localStorage.getItem(PLAYER_NAME_KEY);
}

export function setPlayerName(name: string): void {
  localStorage.setItem(PLAYER_NAME_KEY, name);
}

export async function ensurePlayerRegistered(displayName: string): Promise<void> {
  const id = getPlayerId();
  setPlayerName(displayName);
  await fetch("/api/arena/players", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, displayName }),
  });
}
