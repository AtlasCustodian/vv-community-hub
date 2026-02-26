"use client";

import { useState, useRef } from "react";
import type { Equipment, Item, ItemSlot } from "@/types/explorer/explorer";
import type { FactionTheme } from "@/lib/explorer/factionThemes";
import PersonFigure from "./PersonFigure";
import ItemArt from "./ItemArt";
import ItemTooltip from "./ItemTooltip";

export interface DragData {
  source: "inventory" | "equipment";
  index?: number;
  slot?: ItemSlot;
}

interface InventoryPanelProps {
  equipment: Equipment;
  inventory: Item[];
  theme: FactionTheme;
  salvageComponents: number;
  gold: number;
  keys: number;
  onEquipFromInventory?: (inventoryIndex: number, targetSlot: ItemSlot) => void;
  onUnequipToInventory?: (slot: ItemSlot, targetIndex?: number) => void;
  onSwapInventorySlots?: (fromIndex: number, toIndex: number) => void;
  onInventoryContextMenu?: (index: number, e: React.MouseEvent) => void;
  onEquipmentContextMenu?: (slot: ItemSlot, e: React.MouseEvent) => void;
}

const INVENTORY_SLOT_COUNT = 10;

export default function InventoryPanel({
  equipment,
  inventory,
  theme,
  salvageComponents,
  gold,
  keys,
  onEquipFromInventory,
  onUnequipToInventory,
  onSwapInventorySlots,
  onInventoryContextMenu,
  onEquipmentContextMenu,
}: InventoryPanelProps) {
  const [hoveredInventoryItem, setHoveredInventoryItem] = useState<Item | null>(null);
  const [hoveredEquipItem, setHoveredEquipItem] = useState<Item | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const dragDataRef = useRef<DragData | null>(null);
  const emptySlots = INVENTORY_SLOT_COUNT - inventory.length;
  const salvageWeight = Math.floor(salvageComponents / 5);
  const goldWeight = Math.floor(gold / 20);

  function handleInventoryDragStart(e: React.DragEvent, index: number) {
    const data: DragData = { source: "inventory", index };
    dragDataRef.current = data;
    e.dataTransfer.setData("application/json", JSON.stringify(data));
    e.dataTransfer.effectAllowed = "move";
    setDraggingIndex(index);
  }

  function handleInventoryDragEnd() {
    setDraggingIndex(null);
    dragDataRef.current = null;
  }

  function handleSlotDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }

  function handleSlotDragLeave() {
    setDragOverIndex(null);
  }

  function handleSlotDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    setDragOverIndex(null);

    let data: DragData | null = null;
    try {
      data = JSON.parse(e.dataTransfer.getData("application/json"));
    } catch {
      data = dragDataRef.current;
    }
    if (!data) return;

    if (data.source === "equipment" && data.slot) {
      onUnequipToInventory?.(data.slot, dropIndex);
    } else if (data.source === "inventory" && data.index !== undefined && data.index !== dropIndex) {
      onSwapInventorySlots?.(data.index, dropIndex);
    }
  }

  function handleEmptySlotDrop(e: React.DragEvent, emptyIndex: number) {
    e.preventDefault();
    setDragOverIndex(null);

    let data: DragData | null = null;
    try {
      data = JSON.parse(e.dataTransfer.getData("application/json"));
    } catch {
      data = dragDataRef.current;
    }
    if (!data) return;

    if (data.source === "equipment" && data.slot) {
      onUnequipToInventory?.(data.slot);
    }
  }

  function handleEquipSlotDragStart(slot: ItemSlot) {
    dragDataRef.current = { source: "equipment", slot };
  }

  function handleEquipSlotDrop(targetSlot: ItemSlot) {
    const data = dragDataRef.current;
    if (!data) return;

    if (data.source === "inventory" && data.index !== undefined) {
      onEquipFromInventory?.(data.index, targetSlot);
    } else if (data.source === "equipment" && data.slot && data.slot !== targetSlot) {
      // equipment-to-equipment swap not supported, treat as no-op
    }
    dragDataRef.current = null;
  }

  return (
    <div className="vantheon-inventory-panel flex flex-col gap-4 animate-fade-in">
      <div
        className="h-px w-full rounded-full opacity-50"
        style={{ background: theme.gradientFrom }}
      />

      <div
        className="glass-card relative rounded-2xl p-4"
        style={{ borderColor: `color-mix(in srgb, ${theme.primary} 15%, transparent)` }}
      >
        <h3
          className="text-xs font-bold uppercase tracking-[0.15em] text-center mb-3"
          style={{ color: theme.primary }}
        >
          Equipment
        </h3>

        <PersonFigure
          equipment={equipment}
          theme={theme}
          onSlotHover={setHoveredEquipItem}
          onSlotDragStart={handleEquipSlotDragStart}
          onSlotDrop={handleEquipSlotDrop}
          onSlotContextMenu={(slot, e) => onEquipmentContextMenu?.(slot, e)}
        />
      </div>

      {/* Inventory Grid */}
      <div
        className="glass-card relative rounded-2xl p-4"
        style={{ borderColor: `color-mix(in srgb, ${theme.primary} 15%, transparent)` }}
      >
        <h3
          className="text-xs font-bold uppercase tracking-[0.15em] text-center mb-3"
          style={{ color: theme.primary }}
        >
          Inventory
        </h3>

        <div className="grid grid-cols-5 gap-2">
          {inventory.map((item, i) => (
            <div
              key={item.id + i}
              className={`inventory-slot filled relative rounded-lg border p-1.5 flex flex-col items-center justify-center aspect-square ${
                draggingIndex === i ? "dragging" : ""
              } ${dragOverIndex === i ? "drag-over" : ""}`}
              style={{
                borderColor: `color-mix(in srgb, ${theme.primary} 20%, transparent)`,
                background: `color-mix(in srgb, ${theme.primary} 4%, transparent)`,
              }}
              draggable
              onDragStart={(e) => handleInventoryDragStart(e, i)}
              onDragEnd={handleInventoryDragEnd}
              onDragOver={(e) => handleSlotDragOver(e, i)}
              onDragLeave={handleSlotDragLeave}
              onDrop={(e) => handleSlotDrop(e, i)}
              onMouseEnter={() => setHoveredInventoryItem(item)}
              onMouseLeave={() => setHoveredInventoryItem(null)}
              onContextMenu={(e) => {
                e.preventDefault();
                onInventoryContextMenu?.(i, e);
              }}
            >
              <ItemArt itemId={item.id} artId={item.artId} color={theme.primary} size={28} />
              <span
                className="text-[6px] text-center mt-0.5 leading-tight truncate w-full"
                style={{ color: `color-mix(in srgb, ${theme.primary} 60%, transparent)` }}
              >
                {item.name}
              </span>
            </div>
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className={`inventory-slot empty rounded-lg border p-1.5 flex items-center justify-center aspect-square ${
                dragOverIndex === inventory.length + i ? "drag-over" : ""
              }`}
              style={{
                borderColor: `color-mix(in srgb, ${theme.primary} 12%, transparent)`,
                background: `color-mix(in srgb, ${theme.primary} 3%, transparent)`,
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setDragOverIndex(inventory.length + i);
              }}
              onDragLeave={handleSlotDragLeave}
              onDrop={(e) => handleEmptySlotDrop(e, i)}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ opacity: 0.25 }}>
                <rect x="1" y="1" width="12" height="12" rx="2" stroke={theme.primary} strokeWidth="1" strokeDasharray="2 2" />
              </svg>
            </div>
          ))}
        </div>

        {/* Salvage Components display */}
        <div
          style={{
            marginTop: 12,
            padding: "8px 12px",
            borderRadius: 8,
            border: `1px solid color-mix(in srgb, ${theme.primary} 12%, transparent)`,
            background: `color-mix(in srgb, ${theme.primary} 4%, transparent)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4V10L7 13L1 10V4L7 1Z" stroke={theme.primary} strokeWidth="1" fill={`${theme.primary}15`} />
              <circle cx="7" cy="7" r="2" fill={theme.primary} opacity="0.5" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: theme.primary }}>
              Salvage
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: theme.primary }}>
              {salvageComponents}
            </span>
            {salvageWeight > 0 && (
              <span style={{ fontSize: 9, fontFamily: "var(--font-mono), monospace", color: "var(--color-muted)" }}>
                {salvageWeight}w
              </span>
            )}
          </div>
        </div>

        {/* Gold display */}
        <div
          style={{
            marginTop: 8,
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid rgba(251, 191, 36, 0.15)",
            background: "rgba(251, 191, 36, 0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5.5" stroke="#fbbf24" strokeWidth="1" fill="rgba(251, 191, 36, 0.15)" />
              <text x="7" y="10" textAnchor="middle" fill="#fbbf24" fontSize="8" fontWeight="bold">G</text>
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#fbbf24" }}>
              Gold
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "#fbbf24" }}>
              {gold}
            </span>
            {goldWeight > 0 && (
              <span style={{ fontSize: 9, fontFamily: "var(--font-mono), monospace", color: "var(--color-muted)" }}>
                {goldWeight}w
              </span>
            )}
          </div>
        </div>

        {/* Keys display */}
        <div
          style={{
            marginTop: 8,
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid rgba(168, 162, 158, 0.15)",
            background: "rgba(168, 162, 158, 0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round">
              <circle cx="8" cy="8" r="5" fill="rgba(168, 162, 158, 0.15)" />
              <path d="M13 13l8 8M17 17l2-2M19 19l2-2" />
            </svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#a8a29e" }}>
              Keys
            </span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--font-mono), monospace", color: "#a8a29e" }}>
            {keys}
          </span>
        </div>

        {(hoveredEquipItem || (hoveredInventoryItem && draggingIndex === null)) && (
          <div
            className="item-tooltip pointer-events-none absolute inset-0 z-50 flex items-center justify-center rounded-2xl p-4"
            style={{
              background: `color-mix(in srgb, var(--color-surface) 85%, transparent)`,
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="w-56">
              <ItemTooltip item={(hoveredEquipItem ?? hoveredInventoryItem)!} theme={theme} inline />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
