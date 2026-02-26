"use client";

interface ItemArtProps {
  color?: string;
  size?: number;
  className?: string;
}

const DC = "#c4a35a";
const DS = 64;

function Legs1({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="l1-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6b4423" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3d2a18" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M16 6 L48 6 L48 18 L42 18 L42 56 L36 56 L34 50 L30 50 L28 56 L22 56 L22 18 L16 18Z" fill="url(#l1-grad)" stroke={color} strokeWidth="1.5" />
      <line x1="16" y1="6" x2="48" y2="6" stroke={color} strokeWidth="2.5" />
      <rect x="28" y="6" width="8" height="4" rx="1" fill={`${color}20`} stroke={color} strokeWidth="0.8" opacity="0.5" />
      <path d="M22 26 Q24 24 22 22" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" strokeDasharray="1.5 2" />
      <path d="M42 26 Q40 24 42 22" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" strokeDasharray="1.5 2" />
      <ellipse cx="22" cy="34" rx="3" ry="4" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <ellipse cx="42" cy="34" rx="3" ry="4" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="22" y1="18" x2="42" y2="18" stroke={color} strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}

function Legs2({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="l2-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M14 6 L50 6 L50 18 L44 18 L44 56 L38 56 L36 50 L28 50 L26 56 L20 56 L20 18 L14 18Z" fill="url(#l2-grad)" stroke={color} strokeWidth="1.8" />
      <line x1="14" y1="6" x2="50" y2="6" stroke={color} strokeWidth="3" />
      <rect x="14" y="14" width="36" height="6" rx="1" fill={`${color}15`} stroke={color} strokeWidth="1" />
      {[16, 22, 28, 34, 40, 46].map((x) => (
        <circle key={x} cx={x} cy="17" r="1.2" fill={color} opacity="0.3" />
      ))}
      <path d="M20 24 L20 28 L18 28 L18 32 L20 32 L20 36" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <path d="M44 24 L44 28 L46 28 L46 32 L44 32 L44 36" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      {[30, 38, 46].map((y) => (
        <g key={y}>
          <circle cx="20" cy={y} r="1" fill={color} opacity="0.25" />
          <circle cx="44" cy={y} r="1" fill={color} opacity="0.25" />
        </g>
      ))}
    </svg>
  );
}

function Legs3({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="l3-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4a3a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3a2a1a" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M18 6 L46 6 L46 18 L40 18 L40 56 L36 56 L34 52 L30 52 L28 56 L24 56 L24 18 L18 18Z" fill="url(#l3-grad)" stroke={color} strokeWidth="1.2" />
      <line x1="18" y1="6" x2="46" y2="6" stroke={color} strokeWidth="2" />
      <path d="M26 28 L30 28 L30 34 L26 34Z" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4" />
      <line x1="26" y1="28" x2="30" y2="34" stroke={color} strokeWidth="0.4" opacity="0.3" />
      <path d="M38 40 L42 38 L42 44 L38 44Z" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="24" y1="18" x2="40" y2="18" stroke={color} strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2" />
      <line x1="30" y1="44" x2="34" y2="44" stroke={color} strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}

function Legs4({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="l4-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M16 6 L48 6 L48 18 L42 18 L42 56 L36 56 L34 50 L30 50 L28 56 L22 56 L22 18 L16 18Z" fill="url(#l4-grad)" stroke={color} strokeWidth="1.2" />
      <line x1="16" y1="6" x2="48" y2="6" stroke={color} strokeWidth="2.5" />
      {[14, 22, 30, 38, 46].map((y) => (
        <g key={y}>
          <path d={`M22 ${y} Q24 ${y - 1} 22 ${y - 2}`} fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
          <path d={`M42 ${y} Q40 ${y - 1} 42 ${y - 2}`} fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
        </g>
      ))}
      <line x1="22" y1="18" x2="42" y2="18" stroke={color} strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}

function Legs5({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M16 6 L48 6 L48 14 L46 14 L40 56 L36 56 L34 48 L30 48 L28 56 L24 56 L18 14 L16 14Z" fill={`${color}15`} stroke={color} strokeWidth="1.2" />
      <line x1="16" y1="6" x2="48" y2="6" stroke={color} strokeWidth="2.5" />
      <rect x="26" y="6" width="12" height="4" rx="1" fill={`${color}18`} stroke={color} strokeWidth="0.6" />
      <path d="M22 20 L42 20" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <path d="M20 14 L44 14" fill="none" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <line x1="24" y1="32" x2="28" y2="32" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="36" y1="32" x2="40" y2="32" stroke={color} strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

function Legs6({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="l6-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4a3a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3a2a1a" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M14 6 L50 6 L50 18 L46 18 L46 56 L38 56 L36 50 L28 50 L26 56 L18 56 L18 18 L14 18Z" fill="url(#l6-grad)" stroke={color} strokeWidth="1.2" />
      <line x1="14" y1="6" x2="50" y2="6" stroke={color} strokeWidth="2.5" />
      <path d="M18 24 Q22 22 18 20" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M46 24 Q42 22 46 20" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M18 36 Q22 34 18 32" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M46 36 Q42 34 46 32" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="18" y1="18" x2="46" y2="18" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <rect x="28" y="6" width="8" height="4" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.6" />
    </svg>
  );
}

function Legs7({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="l7-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path d="M16 6 L48 6 L48 16 L44 16 L44 56 L36 56 L34 50 L30 50 L28 56 L20 56 L20 16 L16 16Z" fill="url(#l7-grad)" stroke={color} strokeWidth="1.5" />
      <line x1="16" y1="6" x2="48" y2="6" stroke={color} strokeWidth="2.5" />
      <rect x="16" y="14" width="32" height="4" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
      <rect x="16" y="28" width="4" height="10" rx="1" fill={`${color}12`} stroke={color} strokeWidth="0.6" />
      <rect x="44" y="28" width="4" height="10" rx="1" fill={`${color}12`} stroke={color} strokeWidth="0.6" />
      {[22, 30, 38, 46].map((y) => (
        <g key={y}>
          <circle cx="22" cy={y} r="1" fill={color} opacity="0.2" />
          <circle cx="42" cy={y} r="1" fill={color} opacity="0.2" />
        </g>
      ))}
    </svg>
  );
}

function Legs8({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M18 6 L46 6 L46 18 L40 18 L40 56 L36 56 L34 50 L30 50 L28 56 L24 56 L24 18 L18 18Z" fill={`${color}10`} stroke={color} strokeWidth="1.2" />
      <line x1="18" y1="6" x2="46" y2="6" stroke={color} strokeWidth="2" />
      <rect x="18" y="12" width="28" height="3" rx="0.5" fill={`${color}12`} stroke={color} strokeWidth="0.6" />
      <line x1="24" y1="18" x2="40" y2="18" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M24 26 Q28 24 24 22" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M40 26 Q36 24 40 22" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="28" y1="40" x2="36" y2="40" stroke={color} strokeWidth="0.6" opacity="0.25" />
    </svg>
  );
}

function Legs9({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="l9-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4a3a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3a2a1a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M16 6 L48 6 L48 18 L44 18 L44 56 L38 56 L36 50 L28 50 L26 56 L20 56 L20 18 L16 18Z" fill="url(#l9-grad)" stroke={color} strokeWidth="1.5" />
      <line x1="16" y1="6" x2="48" y2="6" stroke={color} strokeWidth="2.5" />
      {[18, 24, 30, 36, 42, 48].map((y) => (
        <g key={y}>
          <path d={`M20 ${y} L44 ${y}`} fill="none" stroke={color} strokeWidth="0.4" opacity="0.15" />
        </g>
      ))}
      <path d="M22 20 Q24 22 22 24 Q24 26 22 28" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <path d="M42 20 Q40 22 42 24 Q40 26 42 28" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}

function Legs10({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M18 6 L46 6 L46 14 L42 14 L42 36 L46 36 L46 40 L42 40 L42 56 L36 56 L34 50 L30 50 L28 56 L22 56 L22 40 L18 40 L18 36 L22 36 L22 14 L18 14Z" fill={`${color}12`} stroke={color} strokeWidth="1.2" />
      <line x1="18" y1="6" x2="46" y2="6" stroke={color} strokeWidth="2" />
      <line x1="22" y1="14" x2="42" y2="14" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <rect x="28" y="6" width="8" height="3" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.6" />
      <ellipse cx="22" cy="26" rx="3" ry="4" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <ellipse cx="42" cy="26" rx="3" ry="4" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

function Legs11({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="l11-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <path d="M16 6 L48 6 L48 18 L42 18 L42 56 L36 56 L34 50 L30 50 L28 56 L22 56 L22 18 L16 18Z" fill="url(#l11-grad)" stroke={color} strokeWidth="1.5" />
      <line x1="16" y1="6" x2="48" y2="6" stroke={color} strokeWidth="2.5" />
      <rect x="16" y="14" width="32" height="4" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
      <rect x="16" y="30" width="32" height="4" rx="1" fill={`${color}12`} stroke={color} strokeWidth="0.6" />
      {[20, 26, 36, 42, 48].map((y) => (
        <g key={y}>
          <circle cx="22" cy={y} r="1" fill={color} opacity="0.2" />
          <circle cx="42" cy={y} r="1" fill={color} opacity="0.2" />
        </g>
      ))}
    </svg>
  );
}

function Legs12({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M16 6 L48 6 L48 18 L42 18 L42 56 L36 56 L34 50 L30 50 L28 56 L22 56 L22 18 L16 18Z" fill={`${color}12`} stroke={color} strokeWidth="1.2" />
      <line x1="16" y1="6" x2="48" y2="6" stroke={color} strokeWidth="2.5" />
      <circle cx="22" cy="30" r="3" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="42" cy="30" r="3" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <line x1="22" y1="18" x2="42" y2="18" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <line x1="22" y1="42" x2="42" y2="42" stroke={color} strokeWidth="0.6" opacity="0.25" />
    </svg>
  );
}

function Legs13({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M16 6 L48 6 L48 16 L44 16 L40 56 L36 56 L34 48 L30 48 L28 56 L24 56 L20 16 L16 16Z" fill={`${color}12`} stroke={color} strokeWidth="1.2" />
      <line x1="16" y1="6" x2="48" y2="6" stroke={color} strokeWidth="2.5" />
      <line x1="20" y1="16" x2="44" y2="16" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <path d="M22 22 L42 22" fill="none" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <path d="M24 34 L40 34" fill="none" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <rect x="28" y="6" width="8" height="4" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.6" />
    </svg>
  );
}

function Legs14({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="l14-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a4a3a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2a1a0a" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M16 6 L48 6 L48 18 L42 18 L42 56 L36 56 L34 50 L30 50 L28 56 L22 56 L22 18 L16 18Z" fill="url(#l14-grad)" stroke={color} strokeWidth="1.2" />
      <line x1="16" y1="6" x2="48" y2="6" stroke={color} strokeWidth="2.5" />
      {[14, 20, 26, 32, 38, 44, 50].map((y) => (
        <g key={y}>
          <path d={`M22 ${y} L22 ${y + 4}`} fill="none" stroke={color} strokeWidth="0.5" opacity="0.15" strokeDasharray="1 1.5" />
          <path d={`M42 ${y} L42 ${y + 4}`} fill="none" stroke={color} strokeWidth="0.5" opacity="0.15" strokeDasharray="1 1.5" />
        </g>
      ))}
      <line x1="22" y1="18" x2="42" y2="18" stroke={color} strokeWidth="0.6" opacity="0.3" />
    </svg>
  );
}

function Legs15({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="l15-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a4a3a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a1a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M16 6 L48 6 L48 18 L42 18 L42 56 L36 56 L34 50 L30 50 L28 56 L22 56 L22 18 L16 18Z" fill="url(#l15-grad)" stroke={color} strokeWidth="1.5" />
      <line x1="16" y1="6" x2="48" y2="6" stroke={color} strokeWidth="2.5" />
      {[20, 28, 36, 44].map((y) => (
        <g key={y}>
          <circle cx="24" cy={y} r="1.5" fill={color} opacity="0.15" />
          <circle cx="40" cy={y} r="1.5" fill={color} opacity="0.15" />
        </g>
      ))}
      <line x1="22" y1="18" x2="42" y2="18" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <rect x="28" y="6" width="8" height="4" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.6" />
    </svg>
  );
}

export const LEGS_ART: Record<string, React.FC<ItemArtProps>> = {
  "legs-1": Legs1,
  "legs-2": Legs2,
  "legs-3": Legs3,
  "legs-4": Legs4,
  "legs-5": Legs5,
  "legs-6": Legs6,
  "legs-7": Legs7,
  "legs-8": Legs8,
  "legs-9": Legs9,
  "legs-10": Legs10,
  "legs-11": Legs11,
  "legs-12": Legs12,
  "legs-13": Legs13,
  "legs-14": Legs14,
  "legs-15": Legs15,
};

export const LEGS_ART_ALIASES: Record<string, React.FC<ItemArtProps>> = {
  "legs-leather-trousers": Legs1,
  "legs-knights-pauldrons": Legs2,
  "legs-travelers-attire": Legs3,
};

export const LEGS_ART_KEYS = Object.keys(LEGS_ART);
