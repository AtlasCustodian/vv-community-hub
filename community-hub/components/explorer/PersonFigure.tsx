"use client";

import { useState } from "react";
import type { Equipment, Item, ItemSlot } from "@/types/explorer/explorer";
import { SLOT_LABELS } from "@/types/explorer/explorer";
import type { FactionTheme } from "@/lib/explorer/factionThemes";
import ItemArt from "./ItemArt";

interface PersonFigureProps {
  equipment: Equipment;
  theme: FactionTheme;
  onSlotHover?: (item: Item | null) => void;
  onSlotDragStart?: (slot: ItemSlot) => void;
  onSlotDrop?: (slot: ItemSlot) => void;
  onSlotContextMenu?: (slot: ItemSlot, e: React.MouseEvent) => void;
}

interface SlotPosition {
  slot: ItemSlot;
  bodyX: number;
  bodyY: number;
  boxX: number;
  boxY: number;
  side: "left" | "right";
}

const SLOT_POSITIONS: SlotPosition[] = [
  { slot: "head", bodyX: 200, bodyY: 60, boxX: 320, boxY: 30, side: "right" },
  { slot: "chest", bodyX: 200, bodyY: 140, boxX: 320, boxY: 110, side: "right" },
  { slot: "rightHand", bodyX: 155, bodyY: 160, boxX: 30, boxY: 100, side: "left" },
  { slot: "leftHand", bodyX: 245, bodyY: 160, boxX: 320, boxY: 190, side: "right" },
  { slot: "legs", bodyX: 200, bodyY: 230, boxX: 30, boxY: 200, side: "left" },
  { slot: "feet", bodyX: 200, bodyY: 310, boxX: 320, boxY: 280, side: "right" },
  { slot: "utility", bodyX: 200, bodyY: 185, boxX: 30, boxY: 300, side: "left" },
];

const SLOT_BOX_W = 80;
const SLOT_BOX_H = 60;

export default function PersonFigure({
  equipment,
  theme,
  onSlotHover,
  onSlotDragStart,
  onSlotDrop,
  onSlotContextMenu,
}: PersonFigureProps) {
  const [dragOverSlot, setDragOverSlot] = useState<ItemSlot | null>(null);

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox="0 0 430 360"
        className="w-full"
        style={{ maxHeight: 400 }}
      >
        <defs>
          <filter id="person-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="person-body-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={theme.primary} stopOpacity="0.15" />
            <stop offset="100%" stopColor={theme.primary} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Connection lines */}
        {SLOT_POSITIONS.map(({ slot, bodyX, bodyY, boxX, boxY }) => {
          const item = equipment[slot];
          const endX = boxX + SLOT_BOX_W / 2;
          const endY = boxY + SLOT_BOX_H / 2;
          return (
            <line
              key={`line-${slot}`}
              x1={bodyX}
              y1={bodyY}
              x2={endX}
              y2={endY}
              stroke={item ? theme.primary : `${theme.primary}30`}
              strokeWidth={item ? 1.5 : 0.8}
              strokeDasharray={item ? "none" : "4 3"}
              opacity={item ? 0.5 : 0.25}
            />
          );
        })}

        {/* Humanoid silhouette */}
        <g filter="url(#person-glow)">
          <circle cx="200" cy="50" r="22" fill="url(#person-body-grad)" stroke={theme.primary} strokeWidth="1.5" opacity="0.7" />
          <circle cx="192" cy="48" r="2" fill={theme.primary} opacity="0.3" />
          <circle cx="208" cy="48" r="2" fill={theme.primary} opacity="0.3" />
          <rect x="194" y="72" width="12" height="14" fill="url(#person-body-grad)" stroke={theme.primary} strokeWidth="1" opacity="0.5" />
          <path d="M168 86 L232 86 L226 200 L174 200Z" fill="url(#person-body-grad)" stroke={theme.primary} strokeWidth="1.5" opacity="0.6" />
          <rect x="172" y="185" width="56" height="8" rx="2" fill={`${theme.primary}12`} stroke={theme.primary} strokeWidth="0.8" opacity="0.5" />
          <path d="M168 90 L140 150 L145 165 L155 160 L170 110" fill="url(#person-body-grad)" stroke={theme.primary} strokeWidth="1.2" opacity="0.5" />
          <path d="M232 90 L260 150 L255 165 L245 160 L230 110" fill="url(#person-body-grad)" stroke={theme.primary} strokeWidth="1.2" opacity="0.5" />
          <path d="M174 200 L170 280 L162 310 L178 310 L182 280 L192 200" fill="url(#person-body-grad)" stroke={theme.primary} strokeWidth="1.2" opacity="0.5" />
          <path d="M208 200 L218 280 L222 310 L238 310 L230 280 L226 200" fill="url(#person-body-grad)" stroke={theme.primary} strokeWidth="1.2" opacity="0.5" />
        </g>

        {/* Connection dots on body */}
        {SLOT_POSITIONS.map(({ slot, bodyX, bodyY }) => {
          const item = equipment[slot];
          return (
            <circle
              key={`dot-${slot}`}
              cx={bodyX}
              cy={bodyY}
              r={item ? 4 : 3}
              fill={item ? theme.primary : `${theme.primary}40`}
              opacity={item ? 0.7 : 0.4}
            />
          );
        })}

        {/* Equipment slot boxes (visual only) */}
        {SLOT_POSITIONS.map(({ slot, boxX, boxY }) => {
          const item = equipment[slot];
          const isOver = dragOverSlot === slot;
          return (
            <g key={`box-${slot}`}>
              <rect
                x={boxX}
                y={boxY}
                width={SLOT_BOX_W}
                height={SLOT_BOX_H}
                rx="6"
                fill={isOver ? `${theme.primary}15` : item ? `${theme.primary}08` : `${theme.primary}04`}
                stroke={isOver ? `${theme.primary}80` : item ? `${theme.primary}40` : `${theme.primary}18`}
                strokeWidth={isOver ? 2 : item ? 1.5 : 1}
                strokeDasharray={item || isOver ? "none" : "3 3"}
              />
              {item ? (
                <>
                  <foreignObject x={boxX + 4} y={boxY + 2} width={SLOT_BOX_W - 8} height={SLOT_BOX_H - 18}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                      <ItemArt itemId={item.id} artId={item.artId} color={theme.primary} size={32} />
                    </div>
                  </foreignObject>
                  <text x={boxX + SLOT_BOX_W / 2} y={boxY + SLOT_BOX_H - 6} textAnchor="middle" fill={theme.primary} fontSize="7" fontWeight="600" letterSpacing="0.04em">
                    {item.name}
                  </text>
                </>
              ) : (
                <>
                  <text x={boxX + SLOT_BOX_W / 2} y={boxY + SLOT_BOX_H / 2 - 4} textAnchor="middle" fill={`${theme.primary}50`} fontSize="8" fontWeight="600" letterSpacing="0.06em">
                    {SLOT_LABELS[slot].toUpperCase()}
                  </text>
                  <text x={boxX + SLOT_BOX_W / 2} y={boxY + SLOT_BOX_H / 2 + 10} textAnchor="middle" fill={`${theme.primary}30`} fontSize="7" fontStyle="italic">
                    Empty
                  </text>
                </>
              )}
            </g>
          );
        })}

        {/* Invisible interaction overlays inside SVG via foreignObject */}
        {SLOT_POSITIONS.map(({ slot, boxX, boxY }) => {
          const item = equipment[slot];
          return (
            <foreignObject key={`overlay-${slot}`} x={boxX} y={boxY} width={SLOT_BOX_W} height={SLOT_BOX_H}>
              <div
                style={{ width: "100%", height: "100%", cursor: item ? "grab" : "default" }}
                draggable={!!item}
                onDragStart={(e) => {
                  if (!item) { e.preventDefault(); return; }
                  e.dataTransfer.setData("application/json", JSON.stringify({ source: "equipment", slot }));
                  e.dataTransfer.effectAllowed = "move";
                  onSlotDragStart?.(slot);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  setDragOverSlot(slot);
                }}
                onDragLeave={() => setDragOverSlot(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverSlot(null);
                  onSlotDrop?.(slot);
                }}
                onMouseEnter={() => item && onSlotHover?.(item)}
                onMouseLeave={() => onSlotHover?.(null)}
                onContextMenu={(e) => {
                  if (!item) return;
                  e.preventDefault();
                  onSlotContextMenu?.(slot, e);
                }}
              />
            </foreignObject>
          );
        })}
      </svg>
    </div>
  );
}
