"use client";

import type { ChampionClass } from "@/types/game";

interface ClassIconProps {
  championClass: ChampionClass;
  color?: string;
  size?: number;
  className?: string;
}

function AttackerSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Crossed swords */}
      <g stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        {/* Left blade */}
        <line x1="12" y1="52" x2="42" y2="10" />
        <line x1="42" y1="10" x2="48" y2="12" />
        <line x1="42" y1="10" x2="44" y2="16" />
        {/* Left guard */}
        <line x1="22" y1="38" x2="28" y2="44" />
        {/* Right blade */}
        <line x1="52" y1="52" x2="22" y2="10" />
        <line x1="22" y1="10" x2="16" y2="12" />
        <line x1="22" y1="10" x2="20" y2="16" />
        {/* Right guard */}
        <line x1="42" y1="38" x2="36" y2="44" />
      </g>
      {/* Center clash spark */}
      <circle cx="32" cy="31" r="3" fill={color} opacity={0.6} />
    </svg>
  );
}

function DefenderSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield body */}
      <path
        d="M32 6 L54 16 L54 32 Q54 50 32 58 Q10 50 10 32 L10 16 Z"
        stroke={color}
        strokeWidth={3}
        fill={`${color}15`}
        strokeLinejoin="round"
      />
      {/* Inner chevron */}
      <path
        d="M22 28 L32 38 L42 28"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.7}
      />
      {/* Top accent line */}
      <line
        x1="32" y1="14" x2="32" y2="22"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.7}
      />
    </svg>
  );
}

function BruiserSVG({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fist - front view */}
      <g stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        {/* Main fist body */}
        <path
          d="M18 38 L18 28 Q18 22 24 22 L26 22 L26 18 Q26 14 30 14 L32 14 Q36 14 36 18 L36 20 Q38 18 42 18 Q46 18 46 24 L46 28 Q50 28 50 34 L50 40 Q50 52 38 54 L26 54 Q18 54 18 46 Z"
          fill={`${color}15`}
        />
        {/* Knuckle lines */}
        <line x1="24" y1="28" x2="24" y2="34" opacity={0.5} />
        <line x1="30" y1="26" x2="30" y2="34" opacity={0.5} />
        <line x1="36" y1="26" x2="36" y2="34" opacity={0.5} />
        <line x1="42" y1="28" x2="42" y2="34" opacity={0.5} />
        {/* Impact lines */}
        <line x1="14" y1="16" x2="20" y2="20" opacity={0.4} />
        <line x1="10" y1="24" x2="16" y2="26" opacity={0.4} />
        <line x1="48" y1="14" x2="44" y2="18" opacity={0.4} />
        <line x1="54" y1="22" x2="48" y2="24" opacity={0.4} />
      </g>
    </svg>
  );
}

export default function ClassIcon({
  championClass,
  color = "currentColor",
  size = 32,
  className = "",
}: ClassIconProps) {
  const icons: Record<ChampionClass, React.ReactNode> = {
    attacker: <AttackerSVG color={color} size={size} />,
    defender: <DefenderSVG color={color} size={size} />,
    bruiser: <BruiserSVG color={color} size={size} />,
  };

  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      {icons[championClass]}
    </span>
  );
}

export function ClassIconSVG({
  championClass,
  color = "currentColor",
  size = 14,
}: {
  championClass: ChampionClass;
  color?: string;
  size?: number;
}) {
  if (championClass === "attacker") {
    return (
      <g>
        <line x1={-size/2} y1={size/2} x2={size/3} y2={-size/2} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        <line x1={size/2} y1={size/2} x2={-size/3} y2={-size/2} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        <circle cx={0} cy={0} r={1.5} fill={color} opacity={0.6} />
      </g>
    );
  }

  if (championClass === "defender") {
    return (
      <g>
        <path
          d={`M0 ${-size/2} L${size/2} ${-size/3} L${size/2} ${size/6} Q${size/2} ${size/2} 0 ${size/2} Q${-size/2} ${size/2} ${-size/2} ${size/6} L${-size/2} ${-size/3} Z`}
          stroke={color}
          strokeWidth={1.5}
          fill={`${color}20`}
          strokeLinejoin="round"
        />
        <path
          d={`M${-size/4} 0 L0 ${size/5} L${size/4} 0`}
          stroke={color}
          strokeWidth={1}
          fill="none"
          opacity={0.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  }

  // bruiser
  return (
    <g>
      <path
        d={`M${-size/3} ${size/6} L${-size/3} ${-size/6} Q${-size/3} ${-size/3} ${-size/6} ${-size/3} L${size/6} ${-size/3} Q${size/3} ${-size/3} ${size/3} ${-size/6} L${size/3} ${size/6} Q${size/3} ${size/2} 0 ${size/2} Q${-size/3} ${size/2} ${-size/3} ${size/6} Z`}
        stroke={color}
        strokeWidth={1.5}
        fill={`${color}20`}
        strokeLinejoin="round"
      />
      <line x1={-size/6} y1={-size/6} x2={-size/6} y2={size/8} stroke={color} strokeWidth={0.8} opacity={0.5} />
      <line x1={size/8} y1={-size/6} x2={size/8} y2={size/8} stroke={color} strokeWidth={0.8} opacity={0.5} />
    </g>
  );
}
