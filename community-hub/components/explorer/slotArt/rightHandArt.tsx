"use client";

interface ItemArtProps {
  color?: string;
  size?: number;
  className?: string;
}

const DC = "#c4a35a";
const DS = 64;

/* 1 - Longsword */
function RHand1({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="rh1-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8a8a9a" stopOpacity="0.7" />
          <stop offset="50%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3a3a4a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M30 6 L32 4 L34 6 L34 38 L30 38Z" fill="url(#rh1-grad)" stroke={color} strokeWidth="1.2" />
      <line x1="32" y1="6" x2="32" y2="36" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="31" y1="8" x2="31" y2="34" stroke="white" strokeWidth="0.3" opacity="0.15" />
      <rect x="22" y="38" width="20" height="4" rx="1" fill={`${color}30`} stroke={color} strokeWidth="1.5" />
      <circle cx="24" cy="40" r="1" fill={color} opacity="0.4" />
      <circle cx="40" cy="40" r="1" fill={color} opacity="0.4" />
      <rect x="29" y="42" width="6" height="14" rx="1" fill="#3d2a18" stroke={color} strokeWidth="1" />
      <path d="M30 44 L30 54" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="1.5 1.5" />
      <path d="M34 44 L34 54" stroke={color} strokeWidth="0.5" opacity="0.3" strokeDasharray="1.5 1.5" />
      <rect x="28" y="56" width="8" height="4" rx="2" fill={`${color}25`} stroke={color} strokeWidth="1" />
    </svg>
  );
}

/* 2 - Dagger */
function RHand2({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="rh2-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8a8a9a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#4a4a5a" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path d="M31 6 L32 4 L33 6 L34 30 L30 30Z" fill="url(#rh2-grad)" stroke={color} strokeWidth="1" />
      <line x1="32" y1="6" x2="32" y2="28" stroke={color} strokeWidth="0.4" opacity="0.3" />
      <line x1="31.5" y1="8" x2="31.5" y2="26" stroke="white" strokeWidth="0.3" opacity="0.12" />
      <path d="M26 30 L38 30 L36 34 L28 34Z" fill={`${color}25`} stroke={color} strokeWidth="1.2" />
      <rect x="30" y="34" width="4" height="18" rx="1" fill="#2a1a10" stroke={color} strokeWidth="0.8" />
      <path d="M30 38 Q32 40 34 38" fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" />
      <path d="M30 44 Q32 46 34 44" fill="none" stroke={color} strokeWidth="0.5" opacity="0.4" />
      <circle cx="32" cy="56" r="3" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

/* 3 - Tome */
function RHand3({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="rh3-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4a2a1a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#2a1a0a" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect x="12" y="10" width="40" height="48" rx="3" fill="url(#rh3-grad)" stroke={color} strokeWidth="1.8" />
      <rect x="14" y="10" width="2" height="48" fill={`${color}20`} />
      <line x1="16" y1="10" x2="16" y2="58" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <rect x="18" y="14" width="30" height="3" rx="0.5" fill={color} opacity="0.12" />
      <rect x="18" y="54" width="30" height="3" rx="0.5" fill={color} opacity="0.12" />
      <circle cx="32" cy="32" r="8" fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" />
      <circle cx="32" cy="32" r="4" fill={`${color}15`} stroke={color} strokeWidth="0.8" opacity="0.6">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
      </circle>
      <path d="M32 24 L34 28 L38 28 L35 31 L36 36 L32 33 L28 36 L29 31 L26 28 L30 28Z" fill={color} opacity="0.2" />
      <circle cx="22" cy="14" r="1.5" fill={color} opacity="0.3" />
      <circle cx="42" cy="14" r="1.5" fill={color} opacity="0.3" />
    </svg>
  );
}

/* 4 - Mace */
function RHand4({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="30" y="24" width="4" height="32" rx="1" fill="#3d2a18" stroke={color} strokeWidth="1" />
      <path d="M30 26 L30 54" stroke={color} strokeWidth="0.4" opacity="0.3" strokeDasharray="1.5 1.5" />
      <rect x="28" y="56" width="8" height="4" rx="2" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
      <path d="M24 8 L40 8 L44 14 L40 24 L24 24 L20 14Z" fill={`${color}20`} stroke={color} strokeWidth="1.5" />
      <line x1="24" y1="8" x2="24" y2="24" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <line x1="32" y1="8" x2="32" y2="24" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <line x1="40" y1="8" x2="40" y2="24" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <circle cx="32" cy="16" r="2" fill={color} opacity="0.3" />
    </svg>
  );
}

/* 5 - Staff */
function RHand5({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="30" y="10" width="4" height="48" rx="1.5" fill="#3d2a18" stroke={color} strokeWidth="1" />
      <path d="M30 14 L30 56" stroke={color} strokeWidth="0.4" opacity="0.2" strokeDasharray="2 2" />
      <circle cx="32" cy="8" r="5" fill={`${color}15`} stroke={color} strokeWidth="1.2" />
      <circle cx="32" cy="8" r="2" fill={color} opacity="0.4">
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
      </circle>
      <path d="M28 22 Q30 20 32 22" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M32 22 Q34 20 36 22" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <rect x="29" y="56" width="6" height="4" rx="1" fill={`${color}20`} stroke={color} strokeWidth="0.6" />
    </svg>
  );
}

/* 6 - Axe */
function RHand6({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="rh6-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8a8a9a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#5a5a6a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="30" y="18" width="4" height="38" rx="1" fill="#3d2a18" stroke={color} strokeWidth="1" />
      <path d="M34 8 L48 16 L48 28 L34 22Z" fill="url(#rh6-grad)" stroke={color} strokeWidth="1.2" />
      <line x1="34" y1="12" x2="46" y2="18" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="34" y1="18" x2="46" y2="24" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <rect x="28" y="56" width="8" height="4" rx="2" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
      <path d="M30 28 L30 54" stroke={color} strokeWidth="0.4" opacity="0.2" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

/* 7 - Spear */
function RHand7({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="rh7-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8a8a9a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#5a5a6a" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect x="31" y="16" width="3" height="42" rx="1" fill="#3d2a18" stroke={color} strokeWidth="0.8" />
      <path d="M29 16 L32.5 2 L36 16Z" fill="url(#rh7-grad)" stroke={color} strokeWidth="1" />
      <line x1="32.5" y1="4" x2="32.5" y2="14" stroke={color} strokeWidth="0.4" opacity="0.3" />
      <rect x="29" y="14" width="7" height="3" rx="0.5" fill={`${color}20`} stroke={color} strokeWidth="0.6" />
      <rect x="30" y="56" width="5" height="4" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.6" />
    </svg>
  );
}

/* 8 - Rapier */
function RHand8({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="rh8-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9a9aaa" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#5a5a6a" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path d="M31 6 L32 4 L33 6 L33 38 L31 38Z" fill="url(#rh8-grad)" stroke={color} strokeWidth="0.8" />
      <line x1="32" y1="6" x2="32" y2="36" stroke="white" strokeWidth="0.2" opacity="0.15" />
      <ellipse cx="32" cy="40" rx="10" ry="3" fill="none" stroke={color} strokeWidth="1.2" />
      <path d="M22 40 Q22 44 32 44 Q42 44 42 40" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <rect x="30" y="42" width="4" height="14" rx="1" fill="#2a1a10" stroke={color} strokeWidth="0.8" />
      <circle cx="32" cy="58" r="2.5" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

/* 9 - Warhammer */
function RHand9({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="rh9-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3a3a4a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="30" y="22" width="4" height="34" rx="1" fill="#3d2a18" stroke={color} strokeWidth="1" />
      <rect x="20" y="6" width="24" height="18" rx="2" fill="url(#rh9-grad)" stroke={color} strokeWidth="1.5" />
      <line x1="20" y1="12" x2="44" y2="12" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="20" y1="18" x2="44" y2="18" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <circle cx="32" cy="12" r="2" fill={color} opacity="0.3" />
      <rect x="28" y="56" width="8" height="4" rx="2" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

/* 10 - Scimitar */
function RHand10({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="rh10-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8a8a9a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#5a5a6a" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path d="M28 6 L30 4 Q36 18 40 34 L34 38 Q30 22 28 6Z" fill="url(#rh10-grad)" stroke={color} strokeWidth="1" />
      <path d="M30 8 Q34 20 38 32" fill="none" stroke="white" strokeWidth="0.3" opacity="0.12" />
      <rect x="24" y="38" width="16" height="4" rx="1" fill={`${color}25`} stroke={color} strokeWidth="1.2" />
      <rect x="29" y="42" width="6" height="14" rx="1" fill="#2a1a10" stroke={color} strokeWidth="0.8" />
      <rect x="28" y="56" width="8" height="4" rx="2" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

/* 11 - Flail */
function RHand11({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="30" y="28" width="4" height="28" rx="1" fill="#3d2a18" stroke={color} strokeWidth="1" />
      <rect x="28" y="56" width="8" height="4" rx="2" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
      <path d="M32 28 L32 18" stroke={color} strokeWidth="1" strokeDasharray="2 2" />
      <circle cx="32" cy="12" r="8" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x = 32 + Math.cos(rad) * 8;
        const y = 12 + Math.sin(rad) * 8;
        return <circle key={angle} cx={x} cy={y} r="1.5" fill={color} opacity="0.4" />;
      })}
    </svg>
  );
}

/* 12 - Glaive */
function RHand12({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="rh12-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8a8a9a" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#5a5a6a" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect x="31" y="18" width="3" height="40" rx="1" fill="#3d2a18" stroke={color} strokeWidth="0.8" />
      <path d="M28 18 L32.5 2 L36 18 L42 10 L36 18Z" fill="url(#rh12-grad)" stroke={color} strokeWidth="1" />
      <line x1="32.5" y1="4" x2="32.5" y2="16" stroke={color} strokeWidth="0.4" opacity="0.3" />
      <rect x="29" y="16" width="7" height="3" rx="0.5" fill={`${color}20`} stroke={color} strokeWidth="0.6" />
      <rect x="30" y="56" width="5" height="4" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.6" />
    </svg>
  );
}

/* 13 - Short Sword */
function RHand13({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="rh13-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8a8a9a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#5a5a6a" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path d="M30 12 L32 10 L34 12 L34 34 L30 34Z" fill="url(#rh13-grad)" stroke={color} strokeWidth="1" />
      <line x1="32" y1="12" x2="32" y2="32" stroke={color} strokeWidth="0.4" opacity="0.3" />
      <rect x="24" y="34" width="16" height="3" rx="1" fill={`${color}25`} stroke={color} strokeWidth="1" />
      <rect x="29" y="37" width="6" height="16" rx="1" fill="#3d2a18" stroke={color} strokeWidth="0.8" />
      <path d="M30 40 L30 50" stroke={color} strokeWidth="0.4" opacity="0.2" strokeDasharray="1.5 1.5" />
      <rect x="28" y="53" width="8" height="4" rx="2" fill={`${color}18`} stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

/* 14 - Pickaxe */
function RHand14({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="30" y="20" width="4" height="36" rx="1" fill="#3d2a18" stroke={color} strokeWidth="1" />
      <path d="M18 10 L34 20 L34 16 L22 8Z" fill={`${color}20`} stroke={color} strokeWidth="1.2" />
      <path d="M46 10 L30 20 L30 16 L42 8Z" fill={`${color}20`} stroke={color} strokeWidth="1.2" />
      <line x1="26" y1="14" x2="32" y2="18" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="38" y1="14" x2="32" y2="18" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <rect x="28" y="56" width="8" height="4" rx="2" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

/* 15 - Claw Gauntlet */
function RHand15({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="rh15-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M16 32 L48 32 L48 48 Q48 54 42 56 L22 56 Q16 54 16 48Z" fill="url(#rh15-grad)" stroke={color} strokeWidth="1.2" />
      <path d="M20 32 L18 10 L22 12 L22 32" fill={`${color}15`} stroke={color} strokeWidth="1" />
      <path d="M28 32 L26 6 L30 8 L30 32" fill={`${color}15`} stroke={color} strokeWidth="1" />
      <path d="M36 32 L34 6 L38 8 L38 32" fill={`${color}15`} stroke={color} strokeWidth="1" />
      <path d="M44 32 L46 10 L42 12 L42 32" fill={`${color}15`} stroke={color} strokeWidth="1" />
      <line x1="16" y1="40" x2="48" y2="40" stroke={color} strokeWidth="0.6" opacity="0.3" />
      {[22, 28, 34, 40].map((x) => (
        <circle key={x} cx={x} cy="46" r="1" fill={color} opacity="0.25" />
      ))}
    </svg>
  );
}

export const RIGHT_HAND_ART: Record<string, React.FC<ItemArtProps>> = {
  "rightHand-1": RHand1,
  "rightHand-2": RHand2,
  "rightHand-3": RHand3,
  "rightHand-4": RHand4,
  "rightHand-5": RHand5,
  "rightHand-6": RHand6,
  "rightHand-7": RHand7,
  "rightHand-8": RHand8,
  "rightHand-9": RHand9,
  "rightHand-10": RHand10,
  "rightHand-11": RHand11,
  "rightHand-12": RHand12,
  "rightHand-13": RHand13,
  "rightHand-14": RHand14,
  "rightHand-15": RHand15,
};

export const RIGHT_HAND_ART_ALIASES: Record<string, React.FC<ItemArtProps>> = {
  "rhand-iron-sword": RHand1,
  "rhand-dagger": RHand2,
  "rhand-tome": RHand3,
};

export const RIGHT_HAND_ART_KEYS = Object.keys(RIGHT_HAND_ART);
