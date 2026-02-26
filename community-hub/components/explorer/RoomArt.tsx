"use client";

import React from "react";
import type { RoomType, RoomSize, RoomMaterial } from "@/types/explorer/vantheon";
import type { FactionTheme } from "@/lib/explorer/factionThemes";

interface RoomArtProps {
  roomType: RoomType;
  size: RoomSize;
  material: RoomMaterial;
  theme: FactionTheme;
  seed?: string;
}

const MATERIAL_COLORS: Record<RoomMaterial, { wall: string; floor: string; accent: string }> = {
  dirt: { wall: "#3d2a18", floor: "#2a1a0e", accent: "#5a4030" },
  metal: { wall: "#3a3a48", floor: "#2a2a35", accent: "#5a5a6a" },
  wood: { wall: "#4a3520", floor: "#2e2010", accent: "#6b4a2a" },
  brick: { wall: "#5a2a1a", floor: "#3a1a0e", accent: "#7a4030" },
};

function seededRand(seed: string, index: number): number {
  let h = 0;
  const str = seed + index;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return ((h & 0x7fffffff) % 1000) / 1000;
}

function sizeScale(size: RoomSize): { w: number; h: number; detail: number } {
  if (size === "small" || size === "key") return { w: 500, h: 350, detail: 3 };
  if (size === "medium" || size === "merchant") return { w: 600, h: 400, detail: 5 };
  return { w: 700, h: 450, detail: 8 };
}

function WallsAndFloor({ mc, s, theme }: { mc: typeof MATERIAL_COLORS.dirt; s: ReturnType<typeof sizeScale>; theme: FactionTheme }) {
  return (
    <>
      <rect width={s.w} height={s.h} fill={mc.floor} rx="4" />
      <rect x="0" y="0" width={s.w} height={s.h * 0.15} fill={mc.wall} />
      <rect x="0" y={s.h * 0.85} width={s.w} height={s.h * 0.15} fill={mc.wall} />
      <rect x="0" y="0" width={s.w * 0.06} height={s.h} fill={mc.wall} />
      <rect x={s.w * 0.94} y="0" width={s.w * 0.06} height={s.h} fill={mc.wall} />
      <line x1={s.w * 0.06} y1={s.h * 0.15} x2={s.w * 0.94} y2={s.h * 0.15} stroke={mc.accent} strokeWidth="1.5" opacity="0.5" />
      <line x1={s.w * 0.06} y1={s.h * 0.85} x2={s.w * 0.94} y2={s.h * 0.85} stroke={mc.accent} strokeWidth="1.5" opacity="0.5" />
      <rect x={s.w * 0.06} y={s.h * 0.15} width={s.w * 0.88} height={s.h * 0.7} fill="none" stroke={`${theme.primary}15`} strokeWidth="1" />
    </>
  );
}

function Torches({ s, theme, count, seed }: { s: ReturnType<typeof sizeScale>; theme: FactionTheme; count: number; seed: string }) {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const side = i % 2 === 0;
    positions.push({
      x: side ? s.w * 0.08 : s.w * 0.92,
      y: s.h * 0.2 + (s.h * 0.6 * (i / Math.max(1, count - 1))),
    });
  }
  return (
    <>
      {positions.map((p, i) => (
        <g key={`torch-${i}`}>
          <rect x={p.x - 2} y={p.y} width="4" height="12" fill="#5a3a1a" stroke="#7a5a30" strokeWidth="0.5" />
          <ellipse cx={p.x} cy={p.y - 6} rx="8" ry="12" fill="#fbbf24" opacity="0.15">
            <animate attributeName="ry" values="10;14;10" dur={`${1.5 + seededRand(seed, i) * 0.5}s`} repeatCount="indefinite" />
          </ellipse>
          <path d={`M${p.x} ${p.y - 2} L${p.x + 2} ${p.y - 8} L${p.x} ${p.y - 16} L${p.x - 2} ${p.y - 8}Z`} fill="#fbbf24" opacity="0.6">
            <animate attributeName="opacity" values="0.4;0.7;0.4" dur={`${1 + seededRand(seed, i + 100)}s`} repeatCount="indefinite" />
          </path>
        </g>
      ))}
    </>
  );
}

function HallwayDetails({ s, mc, seed }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string }) {
  const stones: React.ReactElement[] = [];
  for (let i = 0; i < s.detail + 2; i++) {
    const x = s.w * 0.1 + seededRand(seed, i * 10) * s.w * 0.8;
    const y = s.h * 0.2 + seededRand(seed, i * 10 + 1) * s.h * 0.6;
    stones.push(
      <rect key={i} x={x} y={y} width={8 + seededRand(seed, i) * 12} height={4 + seededRand(seed, i + 1) * 6} rx="1" fill={mc.accent} opacity="0.2" />
    );
  }
  return (
    <>
      {stones}
      <line x1={s.w * 0.3} y1={s.h * 0.5} x2={s.w * 0.7} y2={s.h * 0.5} stroke={mc.accent} strokeWidth="0.8" opacity="0.15" strokeDasharray="6 4" />
      <line x1={s.w * 0.25} y1={s.h * 0.55} x2={s.w * 0.75} y2={s.h * 0.55} stroke={mc.accent} strokeWidth="0.5" opacity="0.1" strokeDasharray="4 6" />
    </>
  );
}

function CaveDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  const stalactites: React.ReactElement[] = [];
  for (let i = 0; i < s.detail + 3; i++) {
    const x = s.w * 0.1 + seededRand(seed, i * 7) * s.w * 0.8;
    const len = 15 + seededRand(seed, i * 7 + 1) * 25;
    stalactites.push(
      <path key={i} d={`M${x - 3} ${s.h * 0.15} L${x} ${s.h * 0.15 + len} L${x + 3} ${s.h * 0.15}`} fill={mc.accent} opacity="0.4" />
    );
  }
  const stalagmites: React.ReactElement[] = [];
  for (let i = 0; i < s.detail + 2; i++) {
    const x = s.w * 0.12 + seededRand(seed, i * 13) * s.w * 0.76;
    const len = 10 + seededRand(seed, i * 13 + 1) * 20;
    stalagmites.push(
      <path key={i} d={`M${x - 4} ${s.h * 0.85} L${x} ${s.h * 0.85 - len} L${x + 4} ${s.h * 0.85}`} fill={mc.accent} opacity="0.35" />
    );
  }
  return (
    <>
      {stalactites}
      {stalagmites}
      <ellipse cx={s.w * 0.5} cy={s.h * 0.5} rx={s.w * 0.15} ry={s.h * 0.08} fill={theme.primary} opacity="0.04" />
    </>
  );
}

function ChamberDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  const pillars: React.ReactElement[] = [];
  const count = Math.max(2, Math.floor(s.detail / 2));
  for (let i = 0; i < count; i++) {
    const x = s.w * 0.15 + (s.w * 0.7 * i) / (count - 1);
    pillars.push(
      <g key={i}>
        <rect x={x - 6} y={s.h * 0.18} width="12" height={s.h * 0.64} fill={mc.accent} opacity="0.3" stroke={mc.accent} strokeWidth="0.8" />
        <rect x={x - 8} y={s.h * 0.16} width="16" height="6" fill={mc.accent} opacity="0.4" />
        <rect x={x - 8} y={s.h * 0.82} width="16" height="6" fill={mc.accent} opacity="0.4" />
      </g>
    );
  }
  return (
    <>
      {pillars}
      <rect x={s.w * 0.4} y={s.h * 0.45} width={s.w * 0.2} height={s.h * 0.1} rx="2" fill="none" stroke={theme.primary} strokeWidth="1" opacity="0.2" />
    </>
  );
}

function CampDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      {/* Campfire */}
      <ellipse cx={s.w * 0.5} cy={s.h * 0.55} rx="14" ry="8" fill="#3a1a0a" opacity="0.5" />
      {[-4, 0, 4].map((dx, i) => (
        <path key={i} d={`M${s.w * 0.5 + dx} ${s.h * 0.55} L${s.w * 0.5 + dx + 1} ${s.h * 0.55 - 12} L${s.w * 0.5 + dx + 2} ${s.h * 0.55}`} fill="#f97316" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur={`${1 + i * 0.3}s`} repeatCount="indefinite" />
        </path>
      ))}
      <ellipse cx={s.w * 0.5} cy={s.h * 0.5 - 8} rx="12" ry="16" fill="#fbbf24" opacity="0.08">
        <animate attributeName="rx" values="10;14;10" dur="2s" repeatCount="indefinite" />
      </ellipse>
      {/* Bedrolls */}
      <rect x={s.w * 0.2} y={s.h * 0.6} width="20" height="8" rx="2" fill={mc.accent} opacity="0.3" transform={`rotate(-15, ${s.w * 0.2 + 10}, ${s.h * 0.6 + 4})`} />
      <rect x={s.w * 0.7} y={s.h * 0.4} width="20" height="8" rx="2" fill={mc.accent} opacity="0.3" transform={`rotate(10, ${s.w * 0.7 + 10}, ${s.h * 0.4 + 4})`} />
      {/* Crates */}
      <rect x={s.w * 0.75} y={s.h * 0.6} width="16" height="14" rx="1" fill={mc.accent} opacity="0.35" stroke={mc.accent} strokeWidth="0.8" />
      <line x1={s.w * 0.75} y1={s.h * 0.6 + 7} x2={s.w * 0.75 + 16} y2={s.h * 0.6 + 7} stroke={mc.accent} strokeWidth="0.5" opacity="0.3" />
    </>
  );
}

function ShrineDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      {/* Altar */}
      <rect x={s.w * 0.4} y={s.h * 0.45} width={s.w * 0.2} height={s.h * 0.15} rx="3" fill={mc.accent} opacity="0.4" stroke={theme.primary} strokeWidth="1.5" />
      <rect x={s.w * 0.42} y={s.h * 0.43} width={s.w * 0.16} height="4" rx="1" fill={theme.primary} opacity="0.15" />
      {/* Glow */}
      <ellipse cx={s.w * 0.5} cy={s.h * 0.48} rx="30" ry="40" fill={theme.primary} opacity="0.06">
        <animate attributeName="opacity" values="0.04;0.08;0.04" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Candles */}
      {[0.35, 0.5, 0.65].map((xr, i) => (
        <g key={i}>
          <rect x={s.w * xr - 1.5} y={s.h * 0.38} width="3" height="10" fill="#e8d8c0" opacity="0.5" />
          <circle cx={s.w * xr} cy={s.h * 0.36} r="2" fill="#fbbf24" opacity="0.6">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${1.5 + i * 0.4}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* Runes */}
      {["ᛟ", "ᛗ", "ᚦ"].map((rune, i) => (
        <text key={i} x={s.w * (0.2 + i * 0.3)} y={s.h * 0.3} textAnchor="middle" fill={theme.primary} fontSize="14" fontFamily="monospace" opacity="0.2">
          {rune}
        </text>
      ))}
    </>
  );
}

function PitDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      <ellipse cx={s.w * 0.5} cy={s.h * 0.52} rx={s.w * 0.25} ry={s.h * 0.18} fill="#0a0604" stroke={mc.accent} strokeWidth="2" opacity="0.8" />
      <ellipse cx={s.w * 0.5} cy={s.h * 0.52} rx={s.w * 0.22} ry={s.h * 0.15} fill="none" stroke={mc.accent} strokeWidth="0.8" opacity="0.3" strokeDasharray="4 4" />
      {/* Rocks on edge */}
      {[0.28, 0.38, 0.62, 0.72].map((xr, i) => (
        <circle key={i} cx={s.w * xr} cy={s.h * (0.38 + seededRand(seed, i * 5) * 0.24)} r={3 + seededRand(seed, i * 5 + 1) * 4} fill={mc.accent} opacity="0.3" />
      ))}
      {/* Mist from pit */}
      <ellipse cx={s.w * 0.5} cy={s.h * 0.48} rx={s.w * 0.15} ry="8" fill={theme.primary} opacity="0.05">
        <animate attributeName="ry" values="6;12;6" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.03;0.07;0.03" dur="4s" repeatCount="indefinite" />
      </ellipse>
    </>
  );
}

function LibraryDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  const shelfCount = Math.max(2, Math.floor(s.detail / 2));
  return (
    <>
      {Array.from({ length: shelfCount }).map((_, i) => {
        const x = s.w * 0.12 + (s.w * 0.76 * i) / (shelfCount - 1);
        const shelves = 3 + Math.floor(seededRand(seed, i * 20) * 2);
        return (
          <g key={i}>
            <rect x={x - 8} y={s.h * 0.18} width="16" height={s.h * 0.64} fill={mc.accent} opacity="0.25" stroke={mc.accent} strokeWidth="0.8" />
            {Array.from({ length: shelves }).map((_, j) => {
              const sy = s.h * 0.2 + (s.h * 0.58 * j) / (shelves - 1);
              return <line key={j} x1={x - 8} y1={sy} x2={x + 8} y2={sy} stroke={mc.accent} strokeWidth="0.6" opacity="0.4" />;
            })}
          </g>
        );
      })}
      {/* Scattered book */}
      <rect x={s.w * 0.45} y={s.h * 0.7} width="12" height="8" rx="1" fill="#4a2a1a" opacity="0.4" transform={`rotate(25, ${s.w * 0.45 + 6}, ${s.h * 0.7 + 4})`} />
      <rect x={s.w * 0.55} y={s.h * 0.72} width="10" height="7" rx="1" fill="#2a1a4a" opacity="0.35" transform={`rotate(-10, ${s.w * 0.55 + 5}, ${s.h * 0.72 + 3})`} />
    </>
  );
}

function ArmoryDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      {/* Weapon rack left */}
      <g>
        <rect x={s.w * 0.15} y={s.h * 0.2} width="6" height={s.h * 0.5} fill={mc.accent} opacity="0.3" />
        <rect x={s.w * 0.15 + 10} y={s.h * 0.2} width="6" height={s.h * 0.5} fill={mc.accent} opacity="0.3" />
        <line x1={s.w * 0.15} y1={s.h * 0.3} x2={s.w * 0.15 + 16} y2={s.h * 0.3} stroke={mc.accent} strokeWidth="1.5" opacity="0.4" />
        <line x1={s.w * 0.15} y1={s.h * 0.5} x2={s.w * 0.15 + 16} y2={s.h * 0.5} stroke={mc.accent} strokeWidth="1.5" opacity="0.4" />
        {/* Swords on rack */}
        {[0, 4, 8].map((dx, i) => (
          <line key={i} x1={s.w * 0.15 + dx + 2} y1={s.h * 0.22} x2={s.w * 0.15 + dx + 2} y2={s.h * 0.5} stroke="#5a5a6a" strokeWidth="1.2" opacity="0.4" />
        ))}
      </g>
      {/* Armor stand */}
      <g>
        <rect x={s.w * 0.7} y={s.h * 0.3} width="20" height="30" rx="3" fill={mc.accent} opacity="0.25" stroke="#5a5a6a" strokeWidth="1" />
        <rect x={s.w * 0.7 + 7} y={s.h * 0.6} width="6" height="15" fill={mc.accent} opacity="0.2" />
        <rect x={s.w * 0.7 + 2} y={s.h * 0.75} width="16" height="4" rx="1" fill={mc.accent} opacity="0.25" />
        <circle cx={s.w * 0.7 + 10} cy={s.h * 0.25} r="6" fill="none" stroke="#5a5a6a" strokeWidth="1" opacity="0.3" />
      </g>
      {/* Shield on wall */}
      <path d={`M${s.w * 0.5 - 8} ${s.h * 0.2} L${s.w * 0.5 + 8} ${s.h * 0.2} L${s.w * 0.5 + 8} ${s.h * 0.3} Q${s.w * 0.5 + 8} ${s.h * 0.38} ${s.w * 0.5} ${s.h * 0.4} Q${s.w * 0.5 - 8} ${s.h * 0.38} ${s.w * 0.5 - 8} ${s.h * 0.3}Z`} fill={mc.accent} opacity="0.25" stroke={theme.primary} strokeWidth="1" />
    </>
  );
}

function FungalDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  const mushrooms: React.ReactElement[] = [];
  for (let i = 0; i < s.detail + 4; i++) {
    const x = s.w * 0.1 + seededRand(seed, i * 9) * s.w * 0.8;
    const y = s.h * 0.5 + seededRand(seed, i * 9 + 1) * s.h * 0.3;
    const h = 8 + seededRand(seed, i * 9 + 2) * 16;
    const cap = 6 + seededRand(seed, i * 9 + 3) * 10;
    const hue = seededRand(seed, i * 9 + 4) > 0.5 ? theme.primary : "#a78bfa";
    mushrooms.push(
      <g key={i}>
        <rect x={x - 1.5} y={y - h} width="3" height={h} fill={mc.accent} opacity="0.4" />
        <ellipse cx={x} cy={y - h} rx={cap} ry={cap * 0.5} fill={hue} opacity="0.15" />
        <ellipse cx={x} cy={y - h - 1} rx={cap * 0.7} ry={cap * 0.3} fill={hue} opacity="0.1" />
      </g>
    );
  }
  return (
    <>
      {mushrooms}
      {/* Ambient spore glow */}
      {[0.3, 0.5, 0.7].map((xr, i) => (
        <circle key={i} cx={s.w * xr} cy={s.h * (0.3 + seededRand(seed, i * 30) * 0.3)} r="2" fill={theme.primary} opacity="0.2">
          <animate attributeName="opacity" values="0.1;0.3;0.1" dur={`${2 + i}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${s.h * (0.3 + seededRand(seed, i * 30) * 0.3)};${s.h * (0.25 + seededRand(seed, i * 30) * 0.3)};${s.h * (0.3 + seededRand(seed, i * 30) * 0.3)}`} dur={`${3 + i}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

function FloodedDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      {/* Water surface */}
      <rect x={s.w * 0.06} y={s.h * 0.6} width={s.w * 0.88} height={s.h * 0.25} fill="#1a3a5a" opacity="0.3" rx="2" />
      {/* Ripples */}
      {[0.3, 0.5, 0.7].map((xr, i) => (
        <ellipse key={i} cx={s.w * xr} cy={s.h * 0.68} rx={12 + i * 4} ry="3" fill="none" stroke="#3b82f6" strokeWidth="0.8" opacity="0.2">
          <animate attributeName="rx" values={`${10 + i * 4};${16 + i * 4};${10 + i * 4}`} dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.05;0.2" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
      {/* Reflections */}
      <line x1={s.w * 0.2} y1={s.h * 0.65} x2={s.w * 0.25} y2={s.h * 0.67} stroke="#60a5fa" strokeWidth="0.5" opacity="0.15" />
      <line x1={s.w * 0.6} y1={s.h * 0.63} x2={s.w * 0.68} y2={s.h * 0.66} stroke="#60a5fa" strokeWidth="0.5" opacity="0.15" />
      {/* Drips from ceiling */}
      {[0.25, 0.45, 0.75].map((xr, i) => (
        <circle key={i} cx={s.w * xr} cy={s.h * 0.2} r="1.5" fill="#60a5fa" opacity="0.3">
          <animate attributeName="cy" values={`${s.h * 0.15};${s.h * 0.6};${s.h * 0.15}`} dur={`${3 + i}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur={`${3 + i}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

function KeyRoomDetails({ s, mc, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; theme: FactionTheme }) {
  return (
    <>
      {/* Pedestal */}
      <rect x={s.w * 0.44} y={s.h * 0.55} width={s.w * 0.12} height={s.h * 0.12} rx="2" fill={mc.accent} opacity="0.4" stroke={theme.primary} strokeWidth="1.5" />
      <rect x={s.w * 0.42} y={s.h * 0.53} width={s.w * 0.16} height="4" rx="1" fill={mc.accent} opacity="0.5" />
      {/* Key */}
      <g>
        <circle cx={s.w * 0.5} cy={s.h * 0.42} r="8" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.8">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <rect x={s.w * 0.5 - 1.5} y={s.h * 0.42 + 8} width="3" height="14" fill="#fbbf24" opacity="0.8" />
        <rect x={s.w * 0.5 + 1.5} y={s.h * 0.42 + 16} width="5" height="2.5" fill="#fbbf24" opacity="0.8" />
        <rect x={s.w * 0.5 + 1.5} y={s.h * 0.42 + 12} width="3.5" height="2.5" fill="#fbbf24" opacity="0.8" />
      </g>
      {/* Glow */}
      <ellipse cx={s.w * 0.5} cy={s.h * 0.45} rx="25" ry="30" fill="#fbbf24" opacity="0.06">
        <animate attributeName="opacity" values="0.04;0.08;0.04" dur="3s" repeatCount="indefinite" />
      </ellipse>
    </>
  );
}

function DoorRoomDetails({ s, mc, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; theme: FactionTheme }) {
  const doorX = s.w * 0.3;
  const doorW = s.w * 0.4;
  const doorY = s.h * 0.18;
  const doorH = s.h * 0.64;
  return (
    <>
      {/* Door frame */}
      <rect x={doorX - 8} y={doorY - 4} width={doorW + 16} height={doorH + 8} rx="3" fill={mc.accent} opacity="0.3" />
      {/* Door */}
      <rect x={doorX} y={doorY} width={doorW} height={doorH} rx="2" fill="#1a1008" stroke={theme.primary} strokeWidth="2" />
      <rect x={doorX + 4} y={doorY + 4} width={doorW - 8} height={doorH - 8} rx="1" fill="none" stroke={theme.primary} strokeWidth="0.8" opacity="0.3" />
      {/* Door handle / keyhole */}
      <circle cx={doorX + doorW * 0.7} cy={doorY + doorH * 0.5} r="6" fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.6">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
      </circle>
      <ellipse cx={doorX + doorW * 0.7} cy={doorY + doorH * 0.5 + 12} rx="2.5" ry="4" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
      {/* Sigils on door */}
      <text x={doorX + doorW * 0.5} y={doorY + doorH * 0.3} textAnchor="middle" fill={theme.primary} fontSize="20" fontFamily="monospace" opacity="0.25">ᛟ</text>
      <text x={doorX + doorW * 0.5} y={doorY + doorH * 0.7} textAnchor="middle" fill={theme.primary} fontSize="20" fontFamily="monospace" opacity="0.25">ᚨ</text>
      {/* Glow around door */}
      <rect x={doorX - 2} y={doorY - 2} width={doorW + 4} height={doorH + 4} rx="3" fill="none" stroke={theme.primary} strokeWidth="1" opacity="0.15">
        <animate attributeName="opacity" values="0.1;0.2;0.1" dur="3s" repeatCount="indefinite" />
      </rect>
    </>
  );
}

function MerchantRoomDetails({ s, mc, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; theme: FactionTheme }) {
  const stallX = s.w * 0.25;
  const stallW = s.w * 0.5;
  const stallY = s.h * 0.35;
  const stallH = s.h * 0.3;
  return (
    <>
      {/* Stall table */}
      <rect x={stallX} y={stallY + stallH * 0.6} width={stallW} height={stallH * 0.4} rx="2" fill={mc.accent} opacity="0.45" stroke={mc.accent} strokeWidth="1.5" />
      {/* Cloth canopy */}
      <path
        d={`M${stallX - 10} ${stallY} Q${stallX + stallW * 0.25} ${stallY - 15} ${stallX + stallW * 0.5} ${stallY} Q${stallX + stallW * 0.75} ${stallY + 15} ${stallX + stallW + 10} ${stallY}`}
        fill="#fbbf24"
        opacity="0.12"
        stroke="#fbbf24"
        strokeWidth="1"
      />
      {/* Support poles */}
      <rect x={stallX - 4} y={stallY} width="4" height={stallH} fill={mc.accent} opacity="0.5" />
      <rect x={stallX + stallW} y={stallY} width="4" height={stallH} fill={mc.accent} opacity="0.5" />
      {/* Wares on table */}
      {[0.3, 0.45, 0.6].map((xr, i) => (
        <g key={i}>
          <rect x={s.w * xr - 5} y={stallY + stallH * 0.45} width="10" height="12" rx="1" fill={theme.primary} opacity="0.15" stroke={theme.primary} strokeWidth="0.8" />
        </g>
      ))}
      {/* Merchant figure */}
      <g>
        <circle cx={s.w * 0.5} cy={stallY - 20} r="10" fill={mc.accent} opacity="0.4" stroke="#fbbf24" strokeWidth="1" />
        <path d={`M${s.w * 0.5 - 12} ${stallY - 10} L${s.w * 0.5 + 12} ${stallY - 10} L${s.w * 0.5 + 8} ${stallY + stallH * 0.5} L${s.w * 0.5 - 8} ${stallY + stallH * 0.5}Z`} fill={mc.accent} opacity="0.35" />
        <circle cx={s.w * 0.5 - 3} cy={stallY - 22} r="1.5" fill="#fbbf24" opacity="0.4" />
        <circle cx={s.w * 0.5 + 3} cy={stallY - 22} r="1.5" fill="#fbbf24" opacity="0.4" />
      </g>
      {/* Lantern */}
      <g>
        <rect x={s.w * 0.72} y={stallY - 10} width="6" height="10" rx="1" fill="#fbbf24" opacity="0.2" stroke="#fbbf24" strokeWidth="0.8" />
        <ellipse cx={s.w * 0.72 + 3} cy={stallY - 14} rx="6" ry="8" fill="#fbbf24" opacity="0.08">
          <animate attributeName="opacity" values="0.06;0.12;0.06" dur="2s" repeatCount="indefinite" />
        </ellipse>
      </g>
      {/* Gold coins scattered */}
      {[0.35, 0.5, 0.65].map((xr, i) => (
        <circle key={`coin-${i}`} cx={s.w * xr + (i - 1) * 3} cy={stallY + stallH * 0.5 + 4} r="3" fill="#fbbf24" opacity="0.25" stroke="#fbbf24" strokeWidth="0.5" />
      ))}
    </>
  );
}

function CryptDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  const sarcophagi: React.ReactElement[] = [];
  const count = Math.max(2, Math.floor(s.detail / 2));
  for (let i = 0; i < count; i++) {
    const x = s.w * 0.15 + (s.w * 0.7 * i) / (count - 1);
    const top = i % 2 === 0;
    const y = top ? s.h * 0.2 : s.h * 0.6;
    sarcophagi.push(
      <g key={i}>
        <rect x={x - 10} y={y} width="20" height="30" rx="2" fill={mc.accent} opacity="0.3" stroke={mc.accent} strokeWidth="1" />
        <rect x={x - 8} y={y + 2} width="16" height="4" rx="1" fill={mc.accent} opacity="0.4" />
        <line x1={x - 6} y1={y + 15} x2={x + 6} y2={y + 15} stroke={theme.primary} strokeWidth="0.5" opacity="0.2" />
      </g>
    );
  }
  return (
    <>
      {sarcophagi}
      <text x={s.w * 0.5} y={s.h * 0.5} textAnchor="middle" fill={theme.primary} fontSize="18" fontFamily="monospace" opacity="0.12">&#x2620;</text>
      {[0.3, 0.7].map((xr, i) => (
        <circle key={i} cx={s.w * xr} cy={s.h * 0.5} r="2" fill={theme.primary} opacity="0.15">
          <animate attributeName="opacity" values="0.08;0.2;0.08" dur={`${3 + i}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

function ForgeDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      {/* Anvil */}
      <rect x={s.w * 0.45} y={s.h * 0.55} width={s.w * 0.1} height={s.h * 0.08} rx="1" fill={mc.accent} opacity="0.5" />
      <rect x={s.w * 0.43} y={s.h * 0.53} width={s.w * 0.14} height="4" rx="1" fill="#5a5a6a" opacity="0.4" />
      {/* Furnace */}
      <rect x={s.w * 0.2} y={s.h * 0.25} width={s.w * 0.15} height={s.h * 0.35} rx="3" fill={mc.accent} opacity="0.35" stroke={mc.accent} strokeWidth="1.5" />
      <rect x={s.w * 0.22} y={s.h * 0.5} width={s.w * 0.11} height={s.h * 0.08} rx="1" fill="#f97316" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="1.5s" repeatCount="indefinite" />
      </rect>
      {/* Bellows */}
      <ellipse cx={s.w * 0.7} cy={s.h * 0.5} rx="15" ry="10" fill={mc.accent} opacity="0.25" />
      <rect x={s.w * 0.7 - 2} y={s.h * 0.42} width="4" height={s.h * 0.08} fill={mc.accent} opacity="0.3" />
      {/* Sparks */}
      {[0.35, 0.5, 0.55].map((xr, i) => (
        <circle key={i} cx={s.w * xr} cy={s.h * (0.3 + seededRand(seed, i * 20) * 0.15)} r="1" fill="#f97316" opacity="0.4">
          <animate attributeName="opacity" values="0.2;0.5;0" dur={`${0.8 + i * 0.3}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${s.h * 0.35};${s.h * 0.25};${s.h * 0.35}`} dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

function SewerDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      {/* Channel */}
      <rect x={s.w * 0.3} y={s.h * 0.4} width={s.w * 0.4} height={s.h * 0.2} rx="2" fill="#1a2a1a" opacity="0.4" />
      <rect x={s.w * 0.32} y={s.h * 0.42} width={s.w * 0.36} height={s.h * 0.16} rx="1" fill="#2a3a2a" opacity="0.3" />
      {/* Pipes */}
      {[0.15, 0.85].map((xr, i) => (
        <g key={i}>
          <rect x={s.w * xr - 4} y={s.h * 0.2} width="8" height={s.h * 0.6} rx="4" fill="#3a3a48" opacity="0.3" stroke="#5a5a6a" strokeWidth="0.8" />
          <circle cx={s.w * xr} cy={s.h * 0.8} r="5" fill="none" stroke="#5a5a6a" strokeWidth="0.8" opacity="0.25" />
        </g>
      ))}
      {/* Drips */}
      {[0.4, 0.6].map((xr, i) => (
        <circle key={i} cx={s.w * xr} cy={s.h * 0.3} r="1" fill="#4ade80" opacity="0.2">
          <animate attributeName="cy" values={`${s.h * 0.2};${s.h * 0.4};${s.h * 0.2}`} dur={`${2.5 + i}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur={`${2.5 + i}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Grate */}
      <rect x={s.w * 0.42} y={s.h * 0.7} width={s.w * 0.16} height="4" rx="1" fill="#3a3a48" opacity="0.4" />
      {[0.44, 0.48, 0.52, 0.56].map((xr, i) => (
        <line key={i} x1={s.w * xr} y1={s.h * 0.7} x2={s.w * xr} y2={s.h * 0.7 + 4} stroke="#5a5a6a" strokeWidth="1" opacity="0.3" />
      ))}
    </>
  );
}

function GardenDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  const flowers: React.ReactElement[] = [];
  for (let i = 0; i < s.detail + 3; i++) {
    const x = s.w * 0.12 + seededRand(seed, i * 11) * s.w * 0.76;
    const y = s.h * 0.5 + seededRand(seed, i * 11 + 1) * s.h * 0.25;
    const h = 12 + seededRand(seed, i * 11 + 2) * 18;
    const hue = ((i * 73) % 360);
    flowers.push(
      <g key={i}>
        <line x1={x} y1={y} x2={x} y2={y - h} stroke="#2a5a2a" strokeWidth="1.5" opacity="0.4" />
        <circle cx={x} cy={y - h} r={3 + seededRand(seed, i * 11 + 3) * 3} fill={`hsl(${hue}, 60%, 60%)`} opacity="0.25" />
      </g>
    );
  }
  return (
    <>
      {flowers}
      {/* Vines on walls */}
      <path d={`M${s.w * 0.08} ${s.h * 0.2} Q${s.w * 0.12} ${s.h * 0.4} ${s.w * 0.1} ${s.h * 0.6}`} stroke="#2a5a2a" strokeWidth="2" fill="none" opacity="0.25" />
      <path d={`M${s.w * 0.92} ${s.h * 0.25} Q${s.w * 0.88} ${s.h * 0.45} ${s.w * 0.9} ${s.h * 0.65}`} stroke="#2a5a2a" strokeWidth="2" fill="none" opacity="0.25" />
      {/* Leaves on ground */}
      {[0.3, 0.5, 0.7].map((xr, i) => (
        <ellipse key={i} cx={s.w * xr} cy={s.h * 0.78} rx="6" ry="3" fill="#2a5a2a" opacity="0.15" transform={`rotate(${seededRand(seed, i * 30) * 60 - 30}, ${s.w * xr}, ${s.h * 0.78})`} />
      ))}
    </>
  );
}

function PrisonDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  const cellCount = Math.max(2, Math.floor(s.detail / 2));
  return (
    <>
      {Array.from({ length: cellCount }).map((_, i) => {
        const x = s.w * 0.15 + (s.w * 0.7 * i) / (cellCount - 1);
        return (
          <g key={i}>
            <rect x={x - 12} y={s.h * 0.2} width="24" height={s.h * 0.55} fill="none" stroke={mc.accent} strokeWidth="1" opacity="0.3" />
            {[-6, 0, 6].map((dx, j) => (
              <line key={j} x1={x + dx} y1={s.h * 0.2} x2={x + dx} y2={s.h * 0.75} stroke="#5a5a6a" strokeWidth="1.5" opacity="0.3" />
            ))}
          </g>
        );
      })}
      {/* Chains */}
      <path d={`M${s.w * 0.3} ${s.h * 0.18} Q${s.w * 0.35} ${s.h * 0.3} ${s.w * 0.3} ${s.h * 0.4}`} stroke="#5a5a6a" strokeWidth="1.5" fill="none" opacity="0.25" strokeDasharray="3 2" />
      <path d={`M${s.w * 0.7} ${s.h * 0.18} Q${s.w * 0.65} ${s.h * 0.3} ${s.w * 0.7} ${s.h * 0.4}`} stroke="#5a5a6a" strokeWidth="1.5" fill="none" opacity="0.25" strokeDasharray="3 2" />
    </>
  );
}

function LaboratoryDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      {/* Workbench */}
      <rect x={s.w * 0.25} y={s.h * 0.5} width={s.w * 0.5} height={s.h * 0.08} rx="2" fill={mc.accent} opacity="0.4" stroke={mc.accent} strokeWidth="1" />
      <rect x={s.w * 0.28} y={s.h * 0.58} width="4" height={s.h * 0.2} fill={mc.accent} opacity="0.3" />
      <rect x={s.w * 0.68} y={s.h * 0.58} width="4" height={s.h * 0.2} fill={mc.accent} opacity="0.3" />
      {/* Beakers */}
      {[0.32, 0.42, 0.52, 0.62].map((xr, i) => {
        const color = ["#4ade80", "#a78bfa", "#f97316", "#22d3ee"][i];
        return (
          <g key={i}>
            <rect x={s.w * xr - 3} y={s.h * 0.43} width="6" height="10" rx="1" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
            <rect x={s.w * xr - 2} y={s.h * 0.47} width="4" height="5" fill={color} opacity="0.15" />
            <circle cx={s.w * xr} cy={s.h * 0.46} r="1" fill={color} opacity="0.3">
              <animate attributeName="opacity" values="0.15;0.4;0.15" dur={`${1.5 + i * 0.5}s`} repeatCount="indefinite" />
            </circle>
          </g>
        );
      })}
      {/* Scattered papers */}
      <rect x={s.w * 0.7} y={s.h * 0.35} width="10" height="7" rx="1" fill="#e8d8c0" opacity="0.2" transform={`rotate(15, ${s.w * 0.7 + 5}, ${s.h * 0.35 + 3})`} />
    </>
  );
}

function ThroneDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      {/* Throne */}
      <rect x={s.w * 0.42} y={s.h * 0.3} width={s.w * 0.16} height={s.h * 0.35} rx="3" fill={mc.accent} opacity="0.35" stroke={theme.primary} strokeWidth="1.5" />
      <rect x={s.w * 0.44} y={s.h * 0.2} width={s.w * 0.12} height={s.h * 0.12} rx="2" fill={mc.accent} opacity="0.4" />
      {/* Crown motif */}
      <path d={`M${s.w * 0.46} ${s.h * 0.21} L${s.w * 0.48} ${s.h * 0.17} L${s.w * 0.5} ${s.h * 0.21} L${s.w * 0.52} ${s.h * 0.17} L${s.w * 0.54} ${s.h * 0.21}`} fill="none" stroke="#fbbf24" strokeWidth="1.5" opacity="0.3" />
      {/* Steps */}
      <rect x={s.w * 0.35} y={s.h * 0.65} width={s.w * 0.3} height="6" rx="1" fill={mc.accent} opacity="0.3" />
      <rect x={s.w * 0.38} y={s.h * 0.6} width={s.w * 0.24} height="6" rx="1" fill={mc.accent} opacity="0.25" />
      {/* Banners */}
      {[0.2, 0.8].map((xr, i) => (
        <g key={i}>
          <rect x={s.w * xr - 1} y={s.h * 0.16} width="2" height={s.h * 0.35} fill={mc.accent} opacity="0.3" />
          <rect x={s.w * xr - 6} y={s.h * 0.2} width="12" height={s.h * 0.25} rx="1" fill={theme.primary} opacity="0.08" />
        </g>
      ))}
      {/* Carpet glow */}
      <rect x={s.w * 0.44} y={s.h * 0.65} width={s.w * 0.12} height={s.h * 0.18} rx="1" fill={theme.primary} opacity="0.05" />
    </>
  );
}

function BridgeDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      {/* Void below */}
      <rect x={s.w * 0.1} y={s.h * 0.6} width={s.w * 0.8} height={s.h * 0.25} rx="2" fill="#060408" opacity="0.5" />
      {/* Bridge planks */}
      <rect x={s.w * 0.15} y={s.h * 0.48} width={s.w * 0.7} height={s.h * 0.12} rx="2" fill={mc.accent} opacity="0.3" />
      {Array.from({ length: 8 }).map((_, i) => {
        const x = s.w * 0.17 + (s.w * 0.66 * i) / 7;
        return <line key={i} x1={x} y1={s.h * 0.48} x2={x} y2={s.h * 0.6} stroke={mc.accent} strokeWidth="0.8" opacity="0.25" />;
      })}
      {/* Rope rails */}
      <path d={`M${s.w * 0.15} ${s.h * 0.42} Q${s.w * 0.5} ${s.h * 0.46} ${s.w * 0.85} ${s.h * 0.42}`} fill="none" stroke={mc.accent} strokeWidth="1.5" opacity="0.3" />
      <path d={`M${s.w * 0.15} ${s.h * 0.44} Q${s.w * 0.5} ${s.h * 0.48} ${s.w * 0.85} ${s.h * 0.44}`} fill="none" stroke={mc.accent} strokeWidth="1" opacity="0.2" />
      {/* Wind lines */}
      {[0.35, 0.55, 0.75].map((xr, i) => (
        <line key={i} x1={s.w * xr} y1={s.h * 0.7} x2={s.w * (xr + 0.08)} y2={s.h * 0.72} stroke={theme.primary} strokeWidth="0.5" opacity="0.1">
          <animate attributeName="opacity" values="0.05;0.15;0.05" dur={`${2 + i}s`} repeatCount="indefinite" />
        </line>
      ))}
    </>
  );
}

function NestDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      {/* Nest mound */}
      <ellipse cx={s.w * 0.5} cy={s.h * 0.65} rx={s.w * 0.25} ry={s.h * 0.12} fill={mc.accent} opacity="0.3" />
      <ellipse cx={s.w * 0.5} cy={s.h * 0.62} rx={s.w * 0.2} ry={s.h * 0.08} fill={mc.accent} opacity="0.2" />
      {/* Eggs */}
      {[0.4, 0.5, 0.6].map((xr, i) => (
        <ellipse key={i} cx={s.w * xr} cy={s.h * 0.58} rx="5" ry="7" fill="#e8d8c0" opacity="0.25" stroke={mc.accent} strokeWidth="0.5">
          <animate attributeName="opacity" values="0.2;0.3;0.2" dur={`${3 + i}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
      {/* Bones */}
      {[0.2, 0.35, 0.7, 0.8].map((xr, i) => (
        <line key={i} x1={s.w * xr} y1={s.h * (0.7 + seededRand(seed, i * 7) * 0.1)} x2={s.w * xr + 10} y2={s.h * (0.72 + seededRand(seed, i * 7 + 1) * 0.08)} stroke="#e8d8c0" strokeWidth="1.5" opacity="0.15" strokeLinecap="round" />
      ))}
      {/* Claw marks */}
      {[0.12, 0.88].map((xr, i) => (
        <g key={i}>
          {[0, 5, 10].map((dy, j) => (
            <line key={j} x1={s.w * xr - 3} y1={s.h * 0.3 + dy} x2={s.w * xr + 3} y2={s.h * 0.35 + dy} stroke={mc.accent} strokeWidth="1" opacity="0.2" />
          ))}
        </g>
      ))}
    </>
  );
}

function CrystalDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  const crystals: React.ReactElement[] = [];
  for (let i = 0; i < s.detail + 4; i++) {
    const x = s.w * 0.12 + seededRand(seed, i * 8) * s.w * 0.76;
    const bottom = seededRand(seed, i * 8 + 1) > 0.5;
    const y = bottom ? s.h * 0.85 : s.h * 0.15;
    const h = 12 + seededRand(seed, i * 8 + 2) * 22;
    const dir = bottom ? -1 : 1;
    const hue = ((i * 51 + 180) % 360);
    crystals.push(
      <path key={i} d={`M${x - 4} ${y} L${x} ${y + dir * h} L${x + 4} ${y}`} fill={`hsl(${hue}, 50%, 60%)`} opacity="0.2" />
    );
  }
  return (
    <>
      {crystals}
      {/* Central glow */}
      <ellipse cx={s.w * 0.5} cy={s.h * 0.5} rx={s.w * 0.12} ry={s.h * 0.1} fill={theme.primary} opacity="0.06">
        <animate attributeName="opacity" values="0.04;0.08;0.04" dur="3s" repeatCount="indefinite" />
      </ellipse>
      {/* Light refractions */}
      {[0.25, 0.5, 0.75].map((xr, i) => (
        <line key={i} x1={s.w * xr} y1={s.h * 0.3} x2={s.w * (xr + 0.05)} y2={s.h * 0.7} stroke={theme.primary} strokeWidth="0.5" opacity="0.08">
          <animate attributeName="opacity" values="0.05;0.12;0.05" dur={`${2 + i * 0.7}s`} repeatCount="indefinite" />
        </line>
      ))}
    </>
  );
}

function FrozenDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      {/* Ice floor */}
      <rect x={s.w * 0.06} y={s.h * 0.7} width={s.w * 0.88} height={s.h * 0.15} rx="2" fill="#a0c4e8" opacity="0.1" />
      {/* Icicles from ceiling */}
      {Array.from({ length: s.detail + 4 }).map((_, i) => {
        const x = s.w * 0.1 + seededRand(seed, i * 6) * s.w * 0.8;
        const len = 10 + seededRand(seed, i * 6 + 1) * 20;
        return <path key={i} d={`M${x - 2} ${s.h * 0.15} L${x} ${s.h * 0.15 + len} L${x + 2} ${s.h * 0.15}`} fill="#a0c4e8" opacity="0.2" />;
      })}
      {/* Frost patches */}
      {[0.25, 0.5, 0.75].map((xr, i) => (
        <ellipse key={i} cx={s.w * xr} cy={s.h * 0.75} rx={12 + i * 4} ry="4" fill="#a0c4e8" opacity="0.08" />
      ))}
      {/* Snow flurries */}
      {[0.2, 0.4, 0.6, 0.8].map((xr, i) => (
        <circle key={i} cx={s.w * xr} cy={s.h * (0.3 + seededRand(seed, i * 40) * 0.3)} r="1" fill="#fff" opacity="0.2">
          <animate attributeName="cy" values={`${s.h * 0.25};${s.h * 0.7};${s.h * 0.25}`} dur={`${4 + i * 1.5}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.2;0.05;0.2" dur={`${4 + i * 1.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
    </>
  );
}

function VolcanicDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      {/* Lava pools */}
      <ellipse cx={s.w * 0.35} cy={s.h * 0.6} rx={s.w * 0.12} ry={s.h * 0.06} fill="#f97316" opacity="0.2">
        <animate attributeName="opacity" values="0.15;0.25;0.15" dur="2s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx={s.w * 0.65} cy={s.h * 0.55} rx={s.w * 0.08} ry={s.h * 0.04} fill="#ef4444" opacity="0.15">
        <animate attributeName="opacity" values="0.1;0.2;0.1" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      {/* Cracks glowing */}
      <line x1={s.w * 0.2} y1={s.h * 0.5} x2={s.w * 0.45} y2={s.h * 0.55} stroke="#f97316" strokeWidth="1.5" opacity="0.2" />
      <line x1={s.w * 0.55} y1={s.h * 0.48} x2={s.w * 0.8} y2={s.h * 0.52} stroke="#f97316" strokeWidth="1" opacity="0.15" />
      {/* Heat waves */}
      {[0.3, 0.5, 0.7].map((xr, i) => (
        <path key={i} d={`M${s.w * xr - 8} ${s.h * 0.35} Q${s.w * xr} ${s.h * 0.3} ${s.w * xr + 8} ${s.h * 0.35}`} fill="none" stroke="#f97316" strokeWidth="0.5" opacity="0.1">
          <animate attributeName="opacity" values="0.05;0.15;0.05" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
        </path>
      ))}
      {/* Obsidian rocks */}
      {[0.2, 0.5, 0.75].map((xr, i) => (
        <polygon key={i} points={`${s.w * xr},${s.h * 0.7} ${s.w * xr + 8},${s.h * 0.65} ${s.w * xr + 12},${s.h * 0.7}`} fill="#1a1a2a" opacity="0.3" />
      ))}
    </>
  );
}

function ClockworkDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  const gears: React.ReactElement[] = [];
  const gearPositions = [
    { x: s.w * 0.25, y: s.h * 0.35, r: 18 },
    { x: s.w * 0.55, y: s.h * 0.4, r: 14 },
    { x: s.w * 0.75, y: s.h * 0.3, r: 20 },
    { x: s.w * 0.4, y: s.h * 0.65, r: 12 },
  ];
  for (let i = 0; i < Math.min(gearPositions.length, s.detail); i++) {
    const g = gearPositions[i];
    const teeth = 8;
    const points: string[] = [];
    for (let t = 0; t < teeth * 2; t++) {
      const angle = (t * Math.PI) / teeth;
      const rad = t % 2 === 0 ? g.r : g.r * 0.75;
      points.push(`${g.x + Math.cos(angle) * rad},${g.y + Math.sin(angle) * rad}`);
    }
    gears.push(
      <g key={i}>
        <polygon points={points.join(" ")} fill="none" stroke="#5a5a6a" strokeWidth="1.5" opacity="0.25">
          <animateTransform attributeName="transform" type="rotate" from={`0 ${g.x} ${g.y}`} to={`${i % 2 === 0 ? 360 : -360} ${g.x} ${g.y}`} dur={`${8 + i * 2}s`} repeatCount="indefinite" />
        </polygon>
        <circle cx={g.x} cy={g.y} r="3" fill="#5a5a6a" opacity="0.3" />
      </g>
    );
  }
  return (
    <>
      {gears}
      {/* Pipes */}
      <line x1={s.w * 0.1} y1={s.h * 0.5} x2={s.w * 0.9} y2={s.h * 0.5} stroke="#5a5a6a" strokeWidth="3" opacity="0.15" />
      <line x1={s.w * 0.1} y1={s.h * 0.52} x2={s.w * 0.9} y2={s.h * 0.52} stroke="#5a5a6a" strokeWidth="1" opacity="0.1" />
      {/* Steam puffs */}
      {[0.3, 0.6].map((xr, i) => (
        <ellipse key={i} cx={s.w * xr} cy={s.h * 0.45} rx="6" ry="4" fill="#fff" opacity="0.05">
          <animate attributeName="ry" values="3;8;3" dur={`${3 + i}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.03;0.08;0.03" dur={`${3 + i}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
    </>
  );
}

function WebDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      {/* Radial web */}
      <circle cx={s.w * 0.5} cy={s.h * 0.45} r={s.w * 0.2} fill="none" stroke="#e8e8f0" strokeWidth="0.5" opacity="0.12" />
      <circle cx={s.w * 0.5} cy={s.h * 0.45} r={s.w * 0.13} fill="none" stroke="#e8e8f0" strokeWidth="0.5" opacity="0.1" />
      <circle cx={s.w * 0.5} cy={s.h * 0.45} r={s.w * 0.06} fill="none" stroke="#e8e8f0" strokeWidth="0.5" opacity="0.08" />
      {/* Web spokes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const r = s.w * 0.22;
        return (
          <line key={i} x1={s.w * 0.5} y1={s.h * 0.45} x2={s.w * 0.5 + Math.cos(angle) * r} y2={s.h * 0.45 + Math.sin(angle) * r * 0.7} stroke="#e8e8f0" strokeWidth="0.5" opacity="0.1" />
        );
      })}
      {/* Corner webs */}
      <path d={`M${s.w * 0.06} ${s.h * 0.15} Q${s.w * 0.15} ${s.h * 0.2} ${s.w * 0.06} ${s.h * 0.35}`} fill="none" stroke="#e8e8f0" strokeWidth="0.5" opacity="0.15" />
      <path d={`M${s.w * 0.94} ${s.h * 0.15} Q${s.w * 0.85} ${s.h * 0.2} ${s.w * 0.94} ${s.h * 0.35}`} fill="none" stroke="#e8e8f0" strokeWidth="0.5" opacity="0.15" />
      {/* Cocoons */}
      {[0.25, 0.75].map((xr, i) => (
        <ellipse key={i} cx={s.w * xr} cy={s.h * 0.6} rx="6" ry="10" fill="#e8e8f0" opacity="0.08" stroke="#e8e8f0" strokeWidth="0.5" />
      ))}
    </>
  );
}

function RuinsDetails({ s, mc, seed, theme }: { s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }) {
  return (
    <>
      {/* Broken columns */}
      {[0.2, 0.5, 0.8].map((xr, i) => {
        const fullH = s.h * 0.5;
        const brokenH = fullH * (0.3 + seededRand(seed, i * 15) * 0.5);
        return (
          <g key={i}>
            <rect x={s.w * xr - 6} y={s.h * 0.85 - brokenH} width="12" height={brokenH} fill={mc.accent} opacity="0.3" />
            <path d={`M${s.w * xr - 6} ${s.h * 0.85 - brokenH} L${s.w * xr - 3} ${s.h * 0.85 - brokenH - 4} L${s.w * xr + 2} ${s.h * 0.85 - brokenH - 2} L${s.w * xr + 6} ${s.h * 0.85 - brokenH}`} fill={mc.accent} opacity="0.25" />
          </g>
        );
      })}
      {/* Rubble piles */}
      {[0.3, 0.6].map((xr, i) => (
        <g key={i}>
          {[0, 6, 12].map((dx, j) => (
            <circle key={j} cx={s.w * xr + dx - 6} cy={s.h * 0.78 - j * 2} r={3 + seededRand(seed, i * 20 + j) * 3} fill={mc.accent} opacity="0.2" />
          ))}
        </g>
      ))}
      {/* Vines on ruins */}
      <path d={`M${s.w * 0.2} ${s.h * 0.5} Q${s.w * 0.25} ${s.h * 0.6} ${s.w * 0.22} ${s.h * 0.75}`} stroke="#2a5a2a" strokeWidth="1.5" fill="none" opacity="0.15" />
      <path d={`M${s.w * 0.8} ${s.h * 0.45} Q${s.w * 0.75} ${s.h * 0.55} ${s.w * 0.78} ${s.h * 0.7}`} stroke="#2a5a2a" strokeWidth="1.5" fill="none" opacity="0.15" />
    </>
  );
}

const ROOM_DETAIL_MAP: Record<RoomType, React.FC<{ s: ReturnType<typeof sizeScale>; mc: typeof MATERIAL_COLORS.dirt; seed: string; theme: FactionTheme }>> = {
  hallway: HallwayDetails,
  cave: CaveDetails,
  chamber: ChamberDetails,
  camp: CampDetails,
  shrine: ShrineDetails,
  pit: PitDetails,
  library: LibraryDetails,
  armory: ArmoryDetails,
  fungal: FungalDetails,
  flooded: FloodedDetails,
  crypt: CryptDetails,
  forge: ForgeDetails,
  sewer: SewerDetails,
  garden: GardenDetails,
  prison: PrisonDetails,
  laboratory: LaboratoryDetails,
  throne: ThroneDetails,
  bridge: BridgeDetails,
  nest: NestDetails,
  crystal: CrystalDetails,
  frozen: FrozenDetails,
  volcanic: VolcanicDetails,
  clockwork: ClockworkDetails,
  web: WebDetails,
  ruins: RuinsDetails,
};

export default function RoomArt({ roomType, size, material, theme, seed = "default" }: RoomArtProps) {
  const mc = MATERIAL_COLORS[material];
  const s = sizeScale(size);

  const isKey = size === "key";
  const isDoor = size === "door";
  const isMerchant = size === "merchant";

  const DetailComponent = isKey || isDoor || isMerchant ? null : ROOM_DETAIL_MAP[roomType];

  return (
    <svg
      viewBox={`0 0 ${s.w} ${s.h}`}
      className="w-full room-art-enter"
      style={{ maxHeight: 400, filter: `drop-shadow(0 0 20px ${theme.primary}08)` }}
    >
      <WallsAndFloor mc={mc} s={s} theme={theme} />
      <Torches s={s} theme={theme} count={size === "large" ? 4 : size === "medium" ? 3 : 2} seed={seed} />

      {DetailComponent && <DetailComponent s={s} mc={mc} seed={seed} theme={theme} />}
      {isKey && <KeyRoomDetails s={s} mc={mc} theme={theme} />}
      {isDoor && <DoorRoomDetails s={s} mc={mc} theme={theme} />}
      {isMerchant && <MerchantRoomDetails s={s} mc={mc} theme={theme} />}

      {/* Dust particles */}
      {Array.from({ length: 4 }).map((_, i) => (
        <circle
          key={`dust-${i}`}
          cx={s.w * (0.2 + seededRand(seed, i * 50) * 0.6)}
          cy={s.h * (0.2 + seededRand(seed, i * 50 + 1) * 0.5)}
          r={0.8 + seededRand(seed, i * 50 + 2)}
          fill={theme.primary}
          opacity="0.15"
        >
          <animate
            attributeName="cy"
            values={`${s.h * (0.2 + seededRand(seed, i * 50 + 1) * 0.5)};${s.h * (0.15 + seededRand(seed, i * 50 + 1) * 0.5)};${s.h * (0.2 + seededRand(seed, i * 50 + 1) * 0.5)}`}
            dur={`${4 + i * 1.5}s`}
            repeatCount="indefinite"
          />
          <animate attributeName="opacity" values="0.15;0;0.15" dur={`${4 + i * 1.5}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Room title */}
      <text x={s.w * 0.5} y={s.h - 8} textAnchor="middle" fill={theme.primary} fontSize="11" fontWeight="600" letterSpacing="0.15em" opacity="0.6">
        {isKey ? "KEY CHAMBER" : isDoor ? "THE DOOR" : isMerchant ? "MERCHANT" : roomType.toUpperCase()}
      </text>
    </svg>
  );
}
