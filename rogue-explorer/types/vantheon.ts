import type { ExplorerStat } from "./explorer";

export type RoomSize = "small" | "medium" | "large" | "key" | "door";

export type RoomMaterial = "dirt" | "metal" | "wood" | "brick";

export interface RoomTemplate {
  id: string;
  name: string;
  size: RoomSize;
  description: string;
  materials: RoomMaterial[];
  minFloor: number;
  tags: string[];
  statChecks?: ExplorerStat[];
  disguise?: RoomSize;
}

export type RoomStatus = "undiscovered" | "entered" | "completed";

export interface RoomInstance {
  instanceId: string;
  templateId: string;
  status: RoomStatus;
  loot?: string[];
  outcome?: string;
}

export interface FloorLayout {
  floorNumber: number;
  rooms: RoomInstance[];
  material: RoomMaterial;
  keyRoomIndex: number;
  doorRoomIndex: number;
}

export interface TowerEvent {
  floor: number;
  roomInstanceId: string;
  type: string;
  timestamp: string;
}

export interface TowerState {
  currentFloor: number;
  currentRoomIndex: number;
  floors: FloorLayout[];
  keyItems: string[];
  events: TowerEvent[];
}
