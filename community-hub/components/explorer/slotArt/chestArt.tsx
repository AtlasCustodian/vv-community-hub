"use client";

interface ItemArtProps {
  color?: string;
  size?: number;
  className?: string;
}

const DC = "#c4a35a";
const DS = 64;

function Chest1({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="c1-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6b4423" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3d2a18" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M20 10 L12 18 L8 42 L14 54 L26 54 L28 48 L36 48 L38 54 L50 54 L56 42 L52 18 L44 10 L38 14 Q32 18 26 14Z" fill="url(#c1-grad)" stroke={color} strokeWidth="1.5" />
      <path d="M26 14 Q32 18 38 14" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="32" y1="18" x2="32" y2="48" stroke={color} strokeWidth="0.8" opacity="0.4" />
      {[24, 30, 36, 42].map((y) => (
        <g key={y}>
          <circle cx="30" cy={y} r="1" fill={color} opacity="0.5" />
          <circle cx="34" cy={y} r="1" fill={color} opacity="0.5" />
        </g>
      ))}
      <path d="M12 18 Q14 28 14 38" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" strokeDasharray="2 3" />
      <path d="M52 18 Q50 28 50 38" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" strokeDasharray="2 3" />
      <path d="M16 20 L20 20 L20 28 L16 28Z" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M44 20 L48 20 L48 28 L44 28Z" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

function Chest2({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="c2-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M18 8 L10 16 L6 44 L12 56 L28 56 L32 50 L36 56 L52 56 L58 44 L54 16 L46 8 L38 12 Q32 16 26 12Z" fill="url(#c2-grad)" stroke={color} strokeWidth="1.8" />
      <path d="M26 12 Q32 16 38 12" fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" />
      <line x1="32" y1="16" x2="32" y2="50" stroke={color} strokeWidth="1" opacity="0.3" />
      <path d="M22 24 L32 20 L42 24 L42 38 L32 42 L22 38Z" fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" />
      <circle cx="32" cy="30" r="3" fill={`${color}20`} stroke={color} strokeWidth="1" opacity="0.5" />
      {[10, 14, 50, 54].map((x) => (
        <g key={x}>
          {[16, 24, 32, 40, 48].map((y) => (
            <circle key={`r-${x}-${y}`} cx={x} cy={y} r="1.2" fill={color} opacity="0.25" />
          ))}
        </g>
      ))}
      <rect x="10" y="8" width="44" height="3" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

function Chest3({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="c3-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a1a4a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1a0a30" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M22 8 L14 16 L8 50 L16 58 L28 58 L30 52 L34 52 L36 58 L48 58 L56 50 L50 16 L42 8 L36 12 Q32 16 28 12Z" fill="url(#c3-grad)" stroke={color} strokeWidth="1.5" />
      <path d="M28 12 Q32 16 36 12" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M14 50 L8 58 L16 58" fill={`${color}10`} stroke={color} strokeWidth="0.8" opacity="0.4" />
      <path d="M50 50 L56 58 L48 58" fill={`${color}10`} stroke={color} strokeWidth="0.8" opacity="0.4" />
      <rect x="18" y="34" width="8" height="10" rx="1" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <rect x="19" y="35" width="3" height="4" rx="0.5" fill={color} opacity="0.15" />
      <path d="M32 16 L32 52" stroke={color} strokeWidth="0.6" opacity="0.25" strokeDasharray="3 2" />
      {[22, 28, 34].map((y) => (
        <circle key={y} cx="32" cy={y} r="0.8" fill={color} opacity="0.4" />
      ))}
    </svg>
  );
}

function Chest4({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="c4-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M20 10 L12 18 L8 44 L14 54 L26 54 L28 48 L36 48 L38 54 L50 54 L56 44 L52 18 L44 10 L38 14 Q32 18 26 14Z" fill="url(#c4-grad)" stroke={color} strokeWidth="1.2" />
      {[14, 20, 26, 32, 38, 44, 50].map((y) => (
        <g key={y}>
          <path d={`M14 ${y} Q32 ${y + 2} 50 ${y}`} fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" />
        </g>
      ))}
      <path d="M26 14 Q32 18 38 14" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <line x1="32" y1="18" x2="32" y2="48" stroke={color} strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

function Chest5({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="c5-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4a3a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3a2a1a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M20 10 L12 18 L10 48 L16 56 L28 56 L30 50 L34 50 L36 56 L48 56 L54 48 L52 18 L44 10 L38 14 Q32 18 26 14Z" fill="url(#c5-grad)" stroke={color} strokeWidth="1.5" />
      <path d="M26 14 Q32 18 38 14" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M12 18 L8 14 Q6 10 10 8 L18 10 L20 10" fill={`${color}15`} stroke={color} strokeWidth="1" opacity="0.6" />
      <path d="M52 18 L56 14 Q58 10 54 8 L46 10 L44 10" fill={`${color}15`} stroke={color} strokeWidth="1" opacity="0.6" />
      <path d="M16 26 L48 26" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="32" y1="18" x2="32" y2="50" stroke={color} strokeWidth="0.6" opacity="0.2" />
    </svg>
  );
}

function Chest6({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="c6-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a5a4a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a352a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M20 10 L12 18 L8 44 L14 54 L26 54 L28 48 L36 48 L38 54 L50 54 L56 44 L52 18 L44 10 L38 14 Q32 18 26 14Z" fill="url(#c6-grad)" stroke={color} strokeWidth="1.5" />
      {[16, 22, 28, 34, 40, 46].map((y) => (
        <g key={y}>
          {[16, 22, 28, 34, 40, 46].map((x) => (
            <path key={`s-${x}-${y}`} d={`M${x} ${y} L${x + 3} ${y} L${x + 3} ${y + 4} L${x} ${y + 4}Z`} fill="none" stroke={color} strokeWidth="0.4" opacity="0.15" />
          ))}
        </g>
      ))}
      <path d="M26 14 Q32 18 38 14" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="32" y1="18" x2="32" y2="48" stroke={color} strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}

function Chest7({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M22 8 L14 16 L10 48 L16 56 L28 56 L30 50 L34 50 L36 56 L48 56 L54 48 L50 16 L42 8 L36 12 Q32 16 28 12Z" fill={`${color}12`} stroke={color} strokeWidth="1.2" />
      <path d="M28 12 Q32 16 36 12" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <rect x="22" y="16" width="20" height="36" rx="1" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="32" y1="16" x2="32" y2="52" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <path d="M22 24 L42 24" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M22 36 L42 36" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <circle cx="32" cy="30" r="2" fill={`${color}20`} stroke={color} strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

function Chest8({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="c8-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path d="M20 10 L12 18 L8 44 L14 54 L26 54 L28 48 L36 48 L38 54 L50 54 L56 44 L52 18 L44 10 L38 14 Q32 18 26 14Z" fill="url(#c8-grad)" stroke={color} strokeWidth="1.5" />
      <path d="M26 14 Q32 18 38 14" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      {[18, 26, 34, 42].map((y) => (
        <g key={y}>
          <rect x="14" y={y} width="36" height="2" rx="0.5" fill={color} opacity="0.08" />
          {[18, 24, 30, 36, 42, 48].map((x) => (
            <circle key={`r-${x}-${y}`} cx={x} cy={y + 1} r="0.8" fill={color} opacity="0.15" />
          ))}
        </g>
      ))}
      <line x1="32" y1="18" x2="32" y2="48" stroke={color} strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

function Chest9({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M22 8 L14 16 L10 48 L16 56 L28 56 L30 50 L34 50 L36 56 L48 56 L54 48 L50 16 L42 8 L36 12 Q32 16 28 12Z" fill={`${color}10`} stroke={color} strokeWidth="1.2" />
      <path d="M28 12 Q32 16 36 12" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <rect x="14" y="20" width="36" height="4" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
      <rect x="14" y="40" width="36" height="4" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
      <line x1="32" y1="16" x2="32" y2="50" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M24 24 L24 40" fill="none" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <path d="M40 24 L40 40" fill="none" stroke={color} strokeWidth="0.6" opacity="0.25" />
    </svg>
  );
}

function Chest10({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="c10-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a3a4a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1a1a25" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M20 8 L10 16 L6 46 L14 58 L28 58 L30 50 L34 50 L36 58 L50 58 L58 46 L54 16 L44 8 L38 12 Q32 18 26 12Z" fill="url(#c10-grad)" stroke={color} strokeWidth="1.5" />
      <path d="M26 12 Q32 18 38 12" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="32" y1="18" x2="32" y2="50" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <path d="M10 36 L54 36" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M20 20 L16 22 L16 34 L20 36" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <path d="M44 20 L48 22 L48 34 L44 36" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      {[22, 28, 34].map((y) => (
        <circle key={y} cx="32" cy={y} r="1" fill={color} opacity="0.3" />
      ))}
    </svg>
  );
}

function Chest11({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="c11-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4a3a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2a1a0a" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M20 10 L12 18 L8 44 L14 54 L26 54 L28 48 L36 48 L38 54 L50 54 L56 44 L52 18 L44 10 L38 14 Q32 18 26 14Z" fill="url(#c11-grad)" stroke={color} strokeWidth="1.2" />
      <path d="M26 14 Q32 18 38 14" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <rect x="16" y="22" width="32" height="8" rx="1" fill={`${color}10`} stroke={color} strokeWidth="0.6" />
      <line x1="32" y1="18" x2="32" y2="48" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M20 36 Q22 32 24 36" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M40 36 Q42 32 44 36" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M28 36 Q32 32 36 36" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

function Chest12({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M20 10 L12 18 L8 44 L14 54 L26 54 L28 48 L36 48 L38 54 L50 54 L56 44 L52 18 L44 10 L38 14 Q32 18 26 14Z" fill={`${color}12`} stroke={color} strokeWidth="1.5" />
      <path d="M26 14 Q32 18 38 14" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <circle cx="32" cy="28" r="8" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <circle cx="32" cy="28" r="4" fill={`${color}15`} stroke={color} strokeWidth="0.6" opacity="0.5">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <path d="M24 20 L28 24" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M40 20 L36 24" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M24 36 L28 32" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M40 36 L36 32" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="32" y1="18" x2="32" y2="48" stroke={color} strokeWidth="0.6" opacity="0.2" />
    </svg>
  );
}

function Chest13({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="c13-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path d="M18 8 L10 16 L6 44 L12 54 L28 54 L30 48 L34 48 L36 54 L52 54 L58 44 L54 16 L46 8 L38 12 Q32 16 26 12Z" fill="url(#c13-grad)" stroke={color} strokeWidth="1.5" />
      <path d="M26 12 Q32 16 38 12" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M10 28 L54 28" fill="none" stroke={color} strokeWidth="1" opacity="0.3" />
      <line x1="32" y1="16" x2="32" y2="48" stroke={color} strokeWidth="0.8" opacity="0.3" />
      {[12, 16, 48, 52].map((x) => (
        <g key={x}>
          {[18, 26, 34, 42].map((y) => (
            <circle key={`r-${x}-${y}`} cx={x} cy={y} r="1" fill={color} opacity="0.2" />
          ))}
        </g>
      ))}
    </svg>
  );
}

function Chest14({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M22 8 L14 16 L10 48 L16 56 L28 56 L30 50 L34 50 L36 56 L48 56 L54 48 L50 16 L42 8 L36 12 Q32 16 28 12Z" fill={`${color}10`} stroke={color} strokeWidth="1.2" />
      <path d="M28 12 Q32 16 36 12" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M18 20 L32 16 L46 20 L46 24 L18 24Z" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
      <path d="M18 32 L46 32" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <path d="M18 40 L46 40" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="32" y1="16" x2="32" y2="50" stroke={color} strokeWidth="0.6" opacity="0.25" />
      {[22, 28, 34, 40, 46].map((y) => (
        <g key={y}>
          <circle cx="30" cy={y} r="0.8" fill={color} opacity="0.4" />
          <circle cx="34" cy={y} r="0.8" fill={color} opacity="0.4" />
        </g>
      ))}
    </svg>
  );
}

function Chest15({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="c15-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4a3a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2a1a0a" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M24 6 L14 14 L10 44 L16 54 L28 54 L30 48 L34 48 L36 54 L48 54 L54 44 L50 14 L40 6 Q32 12 24 6Z" fill="url(#c15-grad)" stroke={color} strokeWidth="1.2" />
      <path d="M24 6 Q32 12 40 6" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M14 14 Q10 18 8 24 L14 26" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <path d="M50 14 Q54 18 56 24 L50 26" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <line x1="32" y1="12" x2="32" y2="48" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M20 30 L44 30" fill="none" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <circle cx="32" cy="30" r="3" fill={`${color}10`} stroke={color} strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

export const CHEST_ART: Record<string, React.FC<ItemArtProps>> = {
  "chest-1": Chest1,
  "chest-2": Chest2,
  "chest-3": Chest3,
  "chest-4": Chest4,
  "chest-5": Chest5,
  "chest-6": Chest6,
  "chest-7": Chest7,
  "chest-8": Chest8,
  "chest-9": Chest9,
  "chest-10": Chest10,
  "chest-11": Chest11,
  "chest-12": Chest12,
  "chest-13": Chest13,
  "chest-14": Chest14,
  "chest-15": Chest15,
};

export const CHEST_ART_ALIASES: Record<string, React.FC<ItemArtProps>> = {
  "chest-leather-vest": Chest1,
  "chest-knights-breastplate": Chest2,
  "chest-scholars-robes": Chest3,
};

export const CHEST_ART_KEYS = Object.keys(CHEST_ART);
