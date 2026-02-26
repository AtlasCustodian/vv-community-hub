"use client";

interface ItemArtProps {
  color?: string;
  size?: number;
  className?: string;
}

const DC = "#c4a35a";
const DS = 64;

/* 1 - Rogue Slippers */
function Feet1({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="f1-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a3a3a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M8 28 L8 38 Q8 46 16 48 L36 48 Q44 48 48 42 L50 38 L50 32 Q48 26 40 24 L18 24 Q10 24 8 28Z" fill="url(#f1-grad)" stroke={color} strokeWidth="1.2" />
      <path d="M10 30 Q10 26 18 26 L38 26 Q46 26 48 32" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="18" y1="38" x2="38" y2="38" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <path d="M8 44 L8 50 Q8 54 14 56 L36 56 Q44 56 48 52 L52 48 L52 42 Q48 38 42 36 L18 36 Q10 38 8 44Z" fill="url(#f1-grad)" stroke={color} strokeWidth="1.2" transform="translate(2, 2)" />
      <path d="M12 48 Q12 42 20 40 L40 40 Q48 42 50 46" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

/* 2 - Iron Greaves */
function Feet2({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="f2-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M10 8 L26 8 L26 46 Q26 54 18 56 Q10 54 10 46Z" fill="url(#f2-grad)" stroke={color} strokeWidth="1.5" />
      <line x1="10" y1="8" x2="26" y2="8" stroke={color} strokeWidth="2.5" />
      <line x1="10" y1="14" x2="26" y2="14" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="10" y1="30" x2="26" y2="30" stroke={color} strokeWidth="1" opacity="0.4" />
      {[12, 20, 28, 36].map((y) => (
        <g key={y}>
          <circle cx="12" cy={y} r="1" fill={color} opacity="0.3" />
          <circle cx="24" cy={y} r="1" fill={color} opacity="0.3" />
        </g>
      ))}
      <path d="M38 8 L54 8 L54 46 Q54 54 46 56 Q38 54 38 46Z" fill="url(#f2-grad)" stroke={color} strokeWidth="1.5" />
      <line x1="38" y1="8" x2="54" y2="8" stroke={color} strokeWidth="2.5" />
      <line x1="38" y1="14" x2="54" y2="14" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="38" y1="30" x2="54" y2="30" stroke={color} strokeWidth="1" opacity="0.4" />
      {[12, 20, 28, 36].map((y) => (
        <g key={`r-${y}`}>
          <circle cx="40" cy={y} r="1" fill={color} opacity="0.3" />
          <circle cx="52" cy={y} r="1" fill={color} opacity="0.3" />
        </g>
      ))}
      <path d="M14 42 L22 42" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <path d="M42 42 L50 42" stroke={color} strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

/* 3 - Pilgrim Sandals */
function Feet3({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="f3-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6b4423" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3d2a18" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M6 32 Q6 26 14 24 L30 24 Q38 24 40 30 L40 36 Q38 40 30 42 L14 42 Q6 40 6 32Z" fill="url(#f3-grad)" stroke={color} strokeWidth="1.2" />
      <path d="M14 24 L14 20 Q16 18 18 20 L18 24" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
      <path d="M24 24 L24 22 Q26 20 28 22 L28 24" fill="none" stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1="10" y1="34" x2="36" y2="34" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M10 40 Q10 36 16 34 L32 34 Q40 36 44 40 L44 46 Q42 50 34 52 L18 52 Q10 50 10 42Z" fill="url(#f3-grad)" stroke={color} strokeWidth="1.2" transform="translate(6, 6)" />
      <path d="M22 40 L22 36 Q24 34 26 36 L26 40" fill="none" stroke={color} strokeWidth="1" opacity="0.6" transform="translate(6, 6)" />
      <path d="M32 40 L32 38 Q34 36 36 38 L36 40" fill="none" stroke={color} strokeWidth="1" opacity="0.6" transform="translate(6, 6)" />
    </svg>
  );
}

/* 4 - Plate Sabatons */
function Feet4({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="f4-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M6 22 L6 36 Q6 44 14 46 L34 46 Q42 46 46 40 L48 36 L48 26 Q46 20 38 18 L16 18 Q8 18 6 22Z" fill="url(#f4-grad)" stroke={color} strokeWidth="1.5" />
      {[22, 28, 34, 40].map((y) => (
        <line key={y} x1="8" y1={y} x2="46" y2={y} stroke={color} strokeWidth="0.6" opacity="0.25" />
      ))}
      <circle cx="12" cy="32" r="1.5" fill={color} opacity="0.3" />
      <circle cx="40" cy="32" r="1.5" fill={color} opacity="0.3" />
      <path d="M6 38 Q4 42 6 46 L6 52 Q6 58 14 58 L34 58 Q44 58 48 52 L50 48 L50 42 Q48 38 40 36 L16 36 Q8 38 6 42Z" fill="url(#f4-grad)" stroke={color} strokeWidth="1.5" transform="translate(2, -2)" />
    </svg>
  );
}

/* 5 - Fur Boots */
function Feet5({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="f5-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4a3a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3a2a1a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M8 20 L8 38 Q8 46 16 48 L36 48 Q44 48 48 42 L50 38 L50 24 Q48 18 40 16 L18 16 Q10 16 8 20Z" fill="url(#f5-grad)" stroke={color} strokeWidth="1.2" />
      <path d="M8 20 Q12 16 20 16" fill="none" stroke={color} strokeWidth="1.5" />
      <path d="M10 22 Q10 18 16 18 L36 18 Q44 18 46 24" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      {[18, 22, 26, 30].map((y) => (
        <path key={y} d={`M10 ${y} Q12 ${y - 1} 14 ${y} Q16 ${y + 1} 18 ${y}`} fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
      ))}
      <path d="M10 42 L10 52 Q10 58 18 58 L38 58 Q46 58 50 52 L52 48 L52 42 Q50 36 42 34 L20 34 Q12 36 10 42Z" fill="url(#f5-grad)" stroke={color} strokeWidth="1.2" transform="translate(0, 0)" />
    </svg>
  );
}

/* 6 - Moccasins */
function Feet6({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="f6-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6b4423" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#3d2a18" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path d="M8 30 Q8 24 16 22 L34 22 Q42 22 44 28 L44 34 Q42 38 34 40 L16 40 Q8 38 8 30Z" fill="url(#f6-grad)" stroke={color} strokeWidth="1.2" />
      <path d="M20 22 Q20 18 24 18 L28 18 Q32 18 32 22" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <line x1="12" y1="32" x2="40" y2="32" stroke={color} strokeWidth="0.5" opacity="0.25" />
      <path d="M12 44 Q12 38 20 36 L38 36 Q46 36 48 42 L48 48 Q46 52 38 54 L20 54 Q12 52 12 44Z" fill="url(#f6-grad)" stroke={color} strokeWidth="1.2" transform="translate(2, 2)" />
      <path d="M26 38 Q26 34 30 34 L34 34 Q38 34 38 38" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" transform="translate(2, 2)" />
    </svg>
  );
}

/* 7 - Treads */
function Feet7({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M8 26 L8 36 Q8 44 16 46 L36 46 Q44 46 48 40 L50 36 L50 28 Q48 22 40 20 L18 20 Q10 20 8 26Z" fill={`${color}12`} stroke={color} strokeWidth="1.5" />
      <line x1="8" y1="20" x2="50" y2="20" stroke={color} strokeWidth="2" />
      {[24, 30, 36, 42].map((y) => (
        <line key={y} x1="10" y1={y} x2="48" y2={y} stroke={color} strokeWidth="0.5" opacity="0.2" />
      ))}
      <path d="M10 42 L10 50 Q10 56 18 58 L38 58 Q46 58 50 52 L52 48 L52 42 Q50 36 42 34 L20 34 Q12 36 10 42Z" fill={`${color}12`} stroke={color} strokeWidth="1.5" transform="translate(0, -2)" />
      <line x1="10" y1="32" x2="52" y2="32" stroke={color} strokeWidth="2" />
    </svg>
  );
}

/* 8 - Leg Wraps */
function Feet8({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M12 8 L24 8 L24 48 Q24 56 18 56 Q12 56 12 48Z" fill={`${color}10`} stroke={color} strokeWidth="1.2" />
      {[12, 18, 24, 30, 36, 42].map((y) => (
        <path key={y} d={`M10 ${y} L26 ${y + 4}`} fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      ))}
      <path d="M40 8 L52 8 L52 48 Q52 56 46 56 Q40 56 40 48Z" fill={`${color}10`} stroke={color} strokeWidth="1.2" />
      {[12, 18, 24, 30, 36, 42].map((y) => (
        <path key={`r-${y}`} d={`M38 ${y} L54 ${y + 4}`} fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      ))}
    </svg>
  );
}

/* 9 - Armored Boots */
function Feet9({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="f9-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M8 24 L8 38 Q8 46 16 48 L36 48 Q44 48 48 42 L50 38 L50 28 Q48 22 40 20 L18 20 Q10 20 8 24Z" fill="url(#f9-grad)" stroke={color} strokeWidth="1.5" />
      <rect x="8" y="20" width="42" height="4" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
      <rect x="8" y="32" width="42" height="4" rx="1" fill={`${color}12`} stroke={color} strokeWidth="0.6" />
      {[26, 38, 44].map((y) => (
        <g key={y}>
          <circle cx="12" cy={y} r="1" fill={color} opacity="0.25" />
          <circle cx="44" cy={y} r="1" fill={color} opacity="0.25" />
        </g>
      ))}
      <path d="M10 42 L10 50 Q10 56 18 58 L38 58 Q46 58 50 52 L52 48 L52 42 Q50 38 42 36 L20 36 Q12 38 10 42Z" fill="url(#f9-grad)" stroke={color} strokeWidth="1.5" transform="translate(0, -4)" />
    </svg>
  );
}

/* 10 - Clogs */
function Feet10({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="f10-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6b4423" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3d2a18" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M6 28 Q6 22 14 20 L32 20 Q40 20 42 26 L42 30 Q40 34 32 36 L14 36 Q6 34 6 28Z" fill="url(#f10-grad)" stroke={color} strokeWidth="1.5" />
      <rect x="6" y="34" width="36" height="6" rx="1" fill={`${color}20`} stroke={color} strokeWidth="1" />
      <path d="M12 44 Q12 38 20 36 L38 36 Q46 36 48 42 L48 46 Q46 50 38 52 L20 52 Q12 50 12 44Z" fill="url(#f10-grad)" stroke={color} strokeWidth="1.5" transform="translate(4, 4)" />
      <rect x="16" y="54" width="36" height="6" rx="1" fill={`${color}20`} stroke={color} strokeWidth="1" />
    </svg>
  );
}

/* 11 - Winged Boots */
function Feet11({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M14 20 L14 38 Q14 46 22 48 L42 48 Q50 48 54 42 L56 38 L56 28 Q54 22 46 20 L24 20 Q16 20 14 24Z" fill={`${color}12`} stroke={color} strokeWidth="1.2" />
      <line x1="14" y1="20" x2="56" y2="20" stroke={color} strokeWidth="2" />
      <path d="M14 28 L6 20 L10 24 L4 16 L10 22" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M14 32 L8 28 L10 30 L6 26" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <line x1="20" y1="36" x2="48" y2="36" stroke={color} strokeWidth="0.5" opacity="0.25" />
      <circle cx="20" cy="28" r="1.5" fill={color} opacity="0.3" />
    </svg>
  );
}

/* 12 - Knee-High Boots */
function Feet12({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="f12-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4a3a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a1a0a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M10 6 L26 6 L26 46 Q26 54 18 56 Q10 54 10 46Z" fill="url(#f12-grad)" stroke={color} strokeWidth="1.2" />
      <line x1="10" y1="6" x2="26" y2="6" stroke={color} strokeWidth="2" />
      <path d="M10 6 Q8 8 10 10" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <path d="M26 6 Q28 8 26 10" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="10" y1="20" x2="26" y2="20" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="10" y1="36" x2="26" y2="36" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M38 6 L54 6 L54 46 Q54 54 46 56 Q38 54 38 46Z" fill="url(#f12-grad)" stroke={color} strokeWidth="1.2" />
      <line x1="38" y1="6" x2="54" y2="6" stroke={color} strokeWidth="2" />
      <line x1="38" y1="20" x2="54" y2="20" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="38" y1="36" x2="54" y2="36" stroke={color} strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

/* 13 - Chain Boots */
function Feet13({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M10 8 L26 8 L26 46 Q26 54 18 56 Q10 54 10 46Z" fill={`${color}12`} stroke={color} strokeWidth="1.2" />
      {[10, 16, 22, 28, 34, 40].map((y) => (
        <g key={y}>
          {[12, 16, 20, 24].map((x) => (
            <circle key={`l-${x}-${y}`} cx={x} cy={y} r="1" fill={color} opacity="0.15" />
          ))}
        </g>
      ))}
      <path d="M38 8 L54 8 L54 46 Q54 54 46 56 Q38 54 38 46Z" fill={`${color}12`} stroke={color} strokeWidth="1.2" />
      {[10, 16, 22, 28, 34, 40].map((y) => (
        <g key={`r-${y}`}>
          {[40, 44, 48, 52].map((x) => (
            <circle key={`r-${x}-${y}`} cx={x} cy={y} r="1" fill={color} opacity="0.15" />
          ))}
        </g>
      ))}
      <line x1="10" y1="8" x2="26" y2="8" stroke={color} strokeWidth="2" />
      <line x1="38" y1="8" x2="54" y2="8" stroke={color} strokeWidth="2" />
    </svg>
  );
}

/* 14 - Strapped Sandals */
function Feet14({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M6 30 Q6 24 14 22 L30 22 Q38 22 40 28 L40 34 Q38 38 30 40 L14 40 Q6 38 6 30Z" fill={`${color}12`} stroke={color} strokeWidth="1.2" />
      <path d="M12 22 L12 18" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M20 22 L20 16 L26 16 L26 22" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <path d="M34 22 L34 18" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M12 44 Q12 38 20 36 L36 36 Q44 36 46 42 L46 48 Q44 52 36 54 L20 54 Q12 52 12 44Z" fill={`${color}12`} stroke={color} strokeWidth="1.2" transform="translate(4, 2)" />
      <path d="M22 38 L22 34" fill="none" stroke={color} strokeWidth="1" opacity="0.5" transform="translate(4, 2)" />
      <path d="M30 38 L30 32 L36 32 L36 38" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" transform="translate(4, 2)" />
    </svg>
  );
}

/* 15 - Spiked Boots */
function Feet15({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="f15-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M8 24 L8 38 Q8 46 16 48 L36 48 Q44 48 48 42 L50 38 L50 28 Q48 22 40 20 L18 20 Q10 20 8 24Z" fill="url(#f15-grad)" stroke={color} strokeWidth="1.5" />
      <line x1="8" y1="20" x2="50" y2="20" stroke={color} strokeWidth="2" />
      <path d="M12 48 L10 54" stroke={color} strokeWidth="1.2" />
      <path d="M22 48 L22 54" stroke={color} strokeWidth="1.2" />
      <path d="M32 48 L34 54" stroke={color} strokeWidth="1.2" />
      <path d="M42 46 L46 52" stroke={color} strokeWidth="1.2" />
      <line x1="14" y1="32" x2="44" y2="32" stroke={color} strokeWidth="0.6" opacity="0.25" />
      {[14, 22, 30, 38].map((x) => (
        <circle key={x} cx={x} cy="26" r="1" fill={color} opacity="0.25" />
      ))}
    </svg>
  );
}

export const FEET_ART: Record<string, React.FC<ItemArtProps>> = {
  "feet-1": Feet1,
  "feet-2": Feet2,
  "feet-3": Feet3,
  "feet-4": Feet4,
  "feet-5": Feet5,
  "feet-6": Feet6,
  "feet-7": Feet7,
  "feet-8": Feet8,
  "feet-9": Feet9,
  "feet-10": Feet10,
  "feet-11": Feet11,
  "feet-12": Feet12,
  "feet-13": Feet13,
  "feet-14": Feet14,
  "feet-15": Feet15,
};

export const FEET_ART_ALIASES: Record<string, React.FC<ItemArtProps>> = {
  "feet-rogues-slippers": Feet1,
  "feet-iron-greaves": Feet2,
  "feet-sandals": Feet3,
};

export const FEET_ART_KEYS = Object.keys(FEET_ART);
