import type { GameSave } from "@/types/explorer";

const LOCAL_KEY = "rogue-explorer-save";

export function saveToLocal(save: GameSave): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(save));
  } catch {
    console.error("Failed to save to localStorage");
  }
}

export function loadFromLocal(): GameSave | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameSave;
  } catch {
    return null;
  }
}

export function clearLocal(): void {
  try {
    localStorage.removeItem(LOCAL_KEY);
  } catch {
    // ignore
  }
}

export async function saveToServer(save: GameSave): Promise<boolean> {
  try {
    const res = await fetch("/api/saves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: save.id,
        champion: save.champion,
        tower: save.tower,
        status: save.status,
      }),
    });
    return res.ok;
  } catch {
    console.error("Failed to save to server");
    return false;
  }
}

export async function loadFromServer(
  saveId: string,
): Promise<GameSave | null> {
  try {
    const res = await fetch(`/api/saves/${saveId}`);
    if (!res.ok) return null;
    return (await res.json()) as GameSave;
  } catch {
    return null;
  }
}
