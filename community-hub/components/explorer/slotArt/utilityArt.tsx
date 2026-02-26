"use client";

interface ItemArtProps {
  color?: string;
  size?: number;
  className?: string;
}

const DC = "#c4a35a";
const DS = 64;

/* 1 - Backpack */
function Util1({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="u1-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4a3a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a1a0a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M24 8 L24 4 L40 4 L40 8" fill="none" stroke={color} strokeWidth="1.2" />
      <rect x="14" y="8" width="36" height="46" rx="4" fill="url(#u1-grad)" stroke={color} strokeWidth="1.5" />
      <rect x="18" y="12" width="28" height="2" rx="0.5" fill={color} opacity="0.15" />
      <rect x="20" y="18" width="24" height="14" rx="2" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <line x1="20" y1="24" x2="44" y2="24" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <rect x="28" y="22" width="8" height="6" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.8" opacity="0.5" />
      <rect x="20" y="36" width="24" height="10" rx="2" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="32" y1="36" x2="32" y2="46" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <path d="M14 16 L10 20 L10 44 L14 48" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <path d="M50 16 L54 20 L54 44 L50 48" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <rect x="14" y="50" width="36" height="4" rx="1" fill={`${color}12`} stroke={color} strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

/* 2 - Quiver */
function Util2({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="u2-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6b4423" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3d2a18" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M22 14 L22 56 Q22 60 28 60 L36 60 Q42 60 42 56 L42 14" fill="url(#u2-grad)" stroke={color} strokeWidth="1.5" />
      <rect x="20" y="10" width="24" height="6" rx="2" fill={`${color}20`} stroke={color} strokeWidth="1.2" />
      <line x1="26" y1="4" x2="26" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 4 L26 2 L28 4" fill="none" stroke={color} strokeWidth="1" />
      <line x1="32" y1="6" x2="32" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M30 6 L32 4 L34 6" fill="none" stroke={color} strokeWidth="1" />
      <line x1="38" y1="5" x2="38" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M36 5 L38 3 L40 5" fill="none" stroke={color} strokeWidth="1" />
      <line x1="22" y1="26" x2="42" y2="26" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="22" y1="40" x2="42" y2="40" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M42 20 L48 22 L48 38 L42 40" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

/* 3 - Healer's Kit */
function Util3({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="u3-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4a3a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a1a0a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M26 8 L26 4 L38 4 L38 8" fill="none" stroke={color} strokeWidth="1.2" />
      <rect x="10" y="8" width="44" height="36" rx="4" fill="url(#u3-grad)" stroke={color} strokeWidth="1.5" />
      <rect x="10" y="8" width="44" height="6" rx="2" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
      <circle cx="32" cy="10" r="2" fill={color} opacity="0.4" />
      <rect x="28" y="22" width="8" height="2" rx="0.5" fill="#dc4444" opacity="0.7" />
      <rect x="31" y="19" width="2" height="8" rx="0.5" fill="#dc4444" opacity="0.7" />
      <path d="M14 50 Q14 44 20 44 L28 44 L28 48 Q28 56 22 56 L14 56 Q10 56 10 52Z" fill="url(#u3-grad)" stroke={color} strokeWidth="1" opacity="0.7" />
      <path d="M16 48 L24 48" stroke={color} strokeWidth="0.5" opacity="0.4" />
      <path d="M16 52 L22 52" stroke={color} strokeWidth="0.5" opacity="0.4" />
      <path d="M36 46 Q36 42 42 42 L48 42 Q52 42 52 46 L52 52 L44 56 L36 52Z" fill="url(#u3-grad)" stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1="42" y1="42" x2="42" y2="54" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="48" y1="42" x2="48" y2="52" stroke={color} strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

/* 4 - Belt Pouch */
function Util4({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="u4-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6b4423" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3d2a18" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="8" y="10" width="48" height="6" rx="2" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
      <rect x="24" y="8" width="16" height="10" rx="2" fill={`${color}15`} stroke={color} strokeWidth="1" />
      <circle cx="32" cy="13" r="2" fill={color} opacity="0.3" />
      <path d="M18 16 L18 46 Q18 52 26 52 L38 52 Q46 52 46 46 L46 16" fill="url(#u4-grad)" stroke={color} strokeWidth="1.2" />
      <line x1="18" y1="24" x2="46" y2="24" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <rect x="26" y="28" width="12" height="8" rx="1" fill={`${color}12`} stroke={color} strokeWidth="0.6" opacity="0.4" />
      <line x1="32" y1="28" x2="32" y2="36" stroke={color} strokeWidth="0.4" opacity="0.3" />
    </svg>
  );
}

/* 5 - Charm Necklace */
function Util5({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M16 12 Q16 6 32 6 Q48 6 48 12 L48 16 Q48 36 32 44 Q16 36 16 16Z" fill="none" stroke={color} strokeWidth="1.2" />
      <path d="M20 14 Q20 10 32 10 Q44 10 44 14 L44 18 Q44 34 32 40 Q20 34 20 18Z" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <circle cx="32" cy="44" r="6" fill={`${color}15`} stroke={color} strokeWidth="1.2" />
      <circle cx="32" cy="44" r="2.5" fill={color} opacity="0.4">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="22" cy="20" r="2" fill={`${color}12`} stroke={color} strokeWidth="0.6" opacity="0.5" />
      <circle cx="42" cy="20" r="2" fill={`${color}12`} stroke={color} strokeWidth="0.6" opacity="0.5" />
      <circle cx="32" cy="16" r="1.5" fill={color} opacity="0.3" />
    </svg>
  );
}

/* 6 - Satchel */
function Util6({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="u6-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4a3a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a1a0a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M28 6 L28 2 L36 2 L36 6" fill="none" stroke={color} strokeWidth="1" />
      <rect x="12" y="6" width="40" height="38" rx="4" fill="url(#u6-grad)" stroke={color} strokeWidth="1.2" />
      <path d="M12 14 L52 14" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <rect x="22" y="18" width="20" height="12" rx="2" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4" />
      <rect x="28" y="22" width="8" height="4" rx="1" fill={`${color}12`} stroke={color} strokeWidth="0.6" />
      <path d="M12 44 L12 52 Q12 56 16 56 L48 56 Q52 56 52 52 L52 44" fill="url(#u6-grad)" stroke={color} strokeWidth="1" opacity="0.7" />
      <line x1="16" y1="48" x2="48" y2="48" stroke={color} strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

/* 7 - Bandolier */
function Util7({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M10 8 L54 52" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <path d="M10 8 L54 52" stroke={color} strokeWidth="6" opacity="0.15" strokeLinecap="round" />
      {[14, 22, 30, 38, 46].map((p) => {
        const x = 10 + ((54 - 10) * (p - 8)) / (52 - 8);
        return (
          <g key={p}>
            <rect x={x - 3} y={p - 2} width="6" height="8" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.8" transform={`rotate(40, ${x}, ${p + 2})`} />
          </g>
        );
      })}
    </svg>
  );
}

/* 8 - Grappling Hook */
function Util8({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="30" y="6" width="4" height="28" rx="1" fill={`${color}15`} stroke={color} strokeWidth="1" />
      <path d="M32 34 Q22 34 18 42" fill="none" stroke={color} strokeWidth="2" />
      <path d="M18 42 L14 38" stroke={color} strokeWidth="1.5" />
      <path d="M32 34 Q42 34 46 42" fill="none" stroke={color} strokeWidth="2" />
      <path d="M46 42 L50 38" stroke={color} strokeWidth="1.5" />
      <path d="M32 34 L32 44" stroke={color} strokeWidth="2" />
      <path d="M32 44 L32 48" stroke={color} strokeWidth="1.5" />
      <circle cx="32" cy="6" r="3" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <path d="M32 3 L32 -2" stroke={color} strokeWidth="0.6" opacity="0.3" strokeDasharray="1 1.5" />
    </svg>
  );
}

/* 9 - Compass */
function Util9({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="22" fill={`${color}08`} stroke={color} strokeWidth="1.5" />
      <circle cx="32" cy="32" r="20" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <circle cx="32" cy="32" r="2" fill={color} opacity="0.4" />
      <path d="M32 12 L34 28 L32 32 L30 28Z" fill={color} opacity="0.5" />
      <path d="M32 52 L30 36 L32 32 L34 36Z" fill={color} opacity="0.2" />
      <line x1="32" y1="10" x2="32" y2="14" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="32" y1="50" x2="32" y2="54" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="10" y1="32" x2="14" y2="32" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="50" y1="32" x2="54" y2="32" stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/* 10 - Waterskin */
function Util10({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="u10-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6b4423" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3d2a18" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M28 8 L28 4 L36 4 L36 8" fill="none" stroke={color} strokeWidth="1" />
      <rect x="30" y="2" width="4" height="4" rx="1" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
      <ellipse cx="32" cy="34" rx="16" ry="22" fill="url(#u10-grad)" stroke={color} strokeWidth="1.5" />
      <ellipse cx="32" cy="34" rx="12" ry="18" fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" />
      <path d="M22 28 Q32 24 42 28" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M20 38 Q32 34 44 38" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

/* 11 - Toolbox */
function Util11({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="u11-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M24 14 L24 8 L40 8 L40 14" fill="none" stroke={color} strokeWidth="1.2" />
      <rect x="8" y="14" width="48" height="32" rx="3" fill="url(#u11-grad)" stroke={color} strokeWidth="1.5" />
      <line x1="8" y1="22" x2="56" y2="22" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <rect x="28" y="18" width="8" height="8" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
      <circle cx="32" cy="22" r="1.5" fill={color} opacity="0.3" />
      <line x1="16" y1="30" x2="24" y2="30" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="40" y1="30" x2="48" y2="30" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <rect x="8" y="46" width="48" height="6" rx="2" fill={`${color}12`} stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

/* 12 - Rope Coil */
function Util12({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <ellipse cx="32" cy="32" rx="20" ry="20" fill="none" stroke={color} strokeWidth="2.5" />
      <ellipse cx="32" cy="32" rx="16" ry="16" fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
      <ellipse cx="32" cy="32" rx="12" ry="12" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <ellipse cx="32" cy="32" rx="8" ry="8" fill="none" stroke={color} strokeWidth="1" opacity="0.25" />
      <path d="M52 32 Q52 28 54 24 L58 20" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <circle cx="32" cy="32" r="3" fill={`${color}12`} stroke={color} strokeWidth="0.6" />
    </svg>
  );
}

/* 13 - Potion Belt */
function Util13({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="6" y="24" width="52" height="8" rx="2" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
      <rect x="26" y="22" width="12" height="12" rx="2" fill={`${color}15`} stroke={color} strokeWidth="1" />
      <circle cx="32" cy="28" r="2" fill={color} opacity="0.3" />
      {[12, 22, 42, 52].map((x) => (
        <g key={x}>
          <path d={`M${x - 3} 32 L${x - 3} 48 Q${x - 3} 52 ${x} 52 Q${x + 3} 52 ${x + 3} 48 L${x + 3} 32`} fill={`${color}10`} stroke={color} strokeWidth="0.8" />
          <path d={`M${x - 2} 32 L${x - 1} 28 L${x + 1} 28 L${x + 2} 32`} fill={`${color}15`} stroke={color} strokeWidth="0.5" />
          <circle cx={x} cy="44" r="1" fill={color} opacity="0.2" />
        </g>
      ))}
    </svg>
  );
}

/* 14 - Map Case */
function Util14({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="u14-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6b4423" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3d2a18" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="14" y="8" width="36" height="48" rx="6" fill="url(#u14-grad)" stroke={color} strokeWidth="1.5" />
      <ellipse cx="32" cy="8" rx="18" ry="4" fill={`${color}15`} stroke={color} strokeWidth="1" />
      <ellipse cx="32" cy="56" rx="18" ry="4" fill={`${color}15`} stroke={color} strokeWidth="1" />
      <line x1="14" y1="8" x2="14" y2="56" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="50" y1="8" x2="50" y2="56" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <rect x="22" y="20" width="20" height="24" rx="1" fill={`${color}08`} stroke={color} strokeWidth="0.6" opacity="0.4" />
      <line x1="26" y1="26" x2="38" y2="26" stroke={color} strokeWidth="0.4" opacity="0.3" />
      <line x1="26" y1="32" x2="38" y2="32" stroke={color} strokeWidth="0.4" opacity="0.3" />
      <line x1="26" y1="38" x2="34" y2="38" stroke={color} strokeWidth="0.4" opacity="0.3" />
    </svg>
  );
}

/* 15 - Trinket Box */
function Util15({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="u15-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4a3a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a1a0a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="10" y="18" width="44" height="32" rx="3" fill="url(#u15-grad)" stroke={color} strokeWidth="1.5" />
      <path d="M10 18 L54 18 L52 10 L12 10Z" fill={`${color}15`} stroke={color} strokeWidth="1" />
      <rect x="28" y="14" width="8" height="8" rx="1" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
      <circle cx="32" cy="18" r="1.5" fill={color} opacity="0.4" />
      <line x1="10" y1="30" x2="54" y2="30" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <circle cx="22" cy="38" r="3" fill={`${color}12`} stroke={color} strokeWidth="0.6" opacity="0.4">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="42" cy="38" r="3" fill={`${color}12`} stroke={color} strokeWidth="0.6" opacity="0.4">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <rect x="10" y="50" width="44" height="4" rx="1" fill={`${color}12`} stroke={color} strokeWidth="0.6" />
    </svg>
  );
}

export const UTILITY_ART: Record<string, React.FC<ItemArtProps>> = {
  "utility-1": Util1,
  "utility-2": Util2,
  "utility-3": Util3,
  "utility-4": Util4,
  "utility-5": Util5,
  "utility-6": Util6,
  "utility-7": Util7,
  "utility-8": Util8,
  "utility-9": Util9,
  "utility-10": Util10,
  "utility-11": Util11,
  "utility-12": Util12,
  "utility-13": Util13,
  "utility-14": Util14,
  "utility-15": Util15,
};

export const UTILITY_ART_ALIASES: Record<string, React.FC<ItemArtProps>> = {
  "utility-backpack": Util1,
  "utility-quiver": Util2,
  "utility-healers-kit": Util3,
};

export const UTILITY_ART_KEYS = Object.keys(UTILITY_ART);
