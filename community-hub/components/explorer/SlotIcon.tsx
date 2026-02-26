"use client";

import type { ItemSlot } from "@/types/explorer/explorer";

interface SlotIconProps {
  slot: ItemSlot;
  color?: string;
  size?: number;
  className?: string;
}

function HeadSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 36 L16 24 Q16 8 32 8 Q48 8 48 24 L48 36" fill={`${color}12`} />
        <path d="M16 36 Q16 44 22 46 L22 52 L42 52 L42 46 Q48 44 48 36" fill={`${color}08`} />
        <line x1="20" y1="28" x2="26" y2="28" opacity={0.5} />
        <line x1="38" y1="28" x2="44" y2="28" opacity={0.5} />
        <path d="M12 36 L16 36" opacity={0.6} />
        <path d="M48 36 L52 36" opacity={0.6} />
      </g>
    </svg>
  );
}

function ChestSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 18 L32 10 L50 18 L50 48 L32 54 L14 48 Z" fill={`${color}12`} />
        <line x1="32" y1="10" x2="32" y2="54" opacity={0.3} />
        <path d="M14 18 L32 24 L50 18" fill="none" opacity={0.5} />
        <line x1="8" y1="22" x2="14" y2="18" opacity={0.4} />
        <line x1="56" y1="22" x2="50" y2="18" opacity={0.4} />
      </g>
    </svg>
  );
}

function LegsSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 8 L44 8 L44 16 L38 16 L38 50 L42 54 L34 54 L32 48 L30 54 L22 54 L26 50 L26 16 L20 16 Z" fill={`${color}12`} />
        <line x1="26" y1="24" x2="26" y2="30" opacity={0.4} />
        <line x1="38" y1="24" x2="38" y2="30" opacity={0.4} />
        <line x1="20" y1="8" x2="44" y2="8" strokeWidth={3} />
      </g>
    </svg>
  );
}

function HandSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 8 L32 48" />
        <path d="M28 8 L36 8" strokeWidth={3} />
        <path d="M24 46 L40 46" opacity={0.7} />
        <path d="M26 50 L38 50 L38 56 L26 56 Z" fill={`${color}12`} />
        <circle cx="32" cy="22" r="2" fill={color} opacity={0.4} />
      </g>
    </svg>
  );
}

function FeetSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 20 L16 42 Q16 52 24 52 L40 52 Q48 52 48 42 L48 20" fill={`${color}12`} />
        <path d="M16 36 L48 36" opacity={0.4} />
        <path d="M24 52 L24 56" opacity={0.5} />
        <path d="M32 52 L32 56" opacity={0.5} />
        <path d="M40 52 L40 56" opacity={0.5} />
        <line x1="16" y1="20" x2="48" y2="20" strokeWidth={3} />
      </g>
    </svg>
  );
}

function UtilitySVG({ color, size }: { color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 14 L46 14 L46 50 Q46 54 42 54 L22 54 Q18 54 18 50 Z" fill={`${color}12`} />
        <path d="M22 14 L22 8 L28 8" opacity={0.5} />
        <path d="M42 14 L42 8 L36 8" opacity={0.5} />
        <line x1="26" y1="24" x2="38" y2="24" opacity={0.4} />
        <line x1="26" y1="30" x2="38" y2="30" opacity={0.4} />
        <line x1="26" y1="36" x2="34" y2="36" opacity={0.4} />
        <rect x="28" y="42" width="8" height="6" rx="1" fill={`${color}20`} stroke={color} strokeWidth={1.5} opacity={0.6} />
      </g>
    </svg>
  );
}

const SLOT_SVGS: Record<ItemSlot, React.FC<{ color: string; size: number }>> = {
  head: HeadSVG,
  chest: ChestSVG,
  legs: LegsSVG,
  rightHand: HandSVG,
  leftHand: HandSVG,
  feet: FeetSVG,
  utility: UtilitySVG,
};

export default function SlotIcon({
  slot,
  color = "currentColor",
  size = 32,
  className = "",
}: SlotIconProps) {
  const Icon = SLOT_SVGS[slot];

  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      <Icon color={color} size={size} />
    </span>
  );
}
