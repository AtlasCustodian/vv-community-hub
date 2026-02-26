"use client";

interface ItemArtProps {
  color?: string;
  size?: number;
  className?: string;
}

const DC = "#c4a35a";
const DS = 64;

/* 1 - Tower Shield */
function LHand1({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="lh1-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#3a3a48" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M12 8 L52 8 L52 42 Q52 56 32 60 Q12 56 12 42Z" fill="url(#lh1-grad)" stroke={color} strokeWidth="2" />
      <path d="M16 12 L48 12 L48 40 Q48 52 32 56 Q16 52 16 40Z" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="32" y1="12" x2="32" y2="56" stroke={color} strokeWidth="1" opacity="0.3" />
      <line x1="16" y1="28" x2="48" y2="28" stroke={color} strokeWidth="1" opacity="0.3" />
      <circle cx="32" cy="28" r="6" fill={`${color}15`} stroke={color} strokeWidth="1.2" opacity="0.5" />
      <circle cx="32" cy="28" r="2" fill={color} opacity="0.3" />
      {[14, 50].map((x) => (
        <g key={x}>
          {[12, 22, 32, 42].map((y) => (
            <circle key={`s-${x}-${y}`} cx={x} cy={y} r="1.5" fill={color} opacity="0.25" />
          ))}
        </g>
      ))}
      <rect x="12" y="6" width="40" height="4" rx="1" fill={`${color}12`} stroke={color} strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

/* 2 - Thieves Tools */
function LHand2({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="10" y="8" width="44" height="48" rx="4" fill="#1a1008" stroke={color} strokeWidth="1.2" opacity="0.5" />
      <rect x="12" y="10" width="40" height="2" rx="0.5" fill={color} opacity="0.15" />
      <path d="M18 20 L18 50" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 20 L20 16 L22 20" fill="none" stroke={color} strokeWidth="1" />
      <path d="M26 22 L26 48" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M26 22 L24 18" fill="none" stroke={color} strokeWidth="0.8" />
      <path d="M26 22 L28 19 L30 22" fill="none" stroke={color} strokeWidth="0.8" />
      <path d="M34 24 L34 46" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M34 24 L36 20 Q38 18 38 22 L36 24" fill="none" stroke={color} strokeWidth="0.8" />
      <path d="M42 20 L42 44" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M42 20 L44 18 L44 22" fill="none" stroke={color} strokeWidth="0.8" />
      <rect x="40" y="20" width="4" height="3" rx="0.5" fill={`${color}20`} stroke={color} strokeWidth="0.5" />
      <circle cx="48" cy="14" r="3" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <circle cx="48" cy="14" r="1" fill={color} opacity="0.3" />
    </svg>
  );
}

/* 3 - Lantern */
function LHand3({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <radialGradient id="lh3-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#f97316" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>
      <line x1="32" y1="2" x2="32" y2="10" stroke={color} strokeWidth="1.5" />
      <path d="M28 10 L36 10" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <rect x="22" y="10" width="20" height="6" rx="2" fill={`${color}25`} stroke={color} strokeWidth="1.2" />
      <path d="M22 16 L18 24 L18 44 L22 50 L42 50 L46 44 L46 24 L42 16Z" fill="#1a1008" stroke={color} strokeWidth="1.5" />
      <ellipse cx="32" cy="34" rx="12" ry="14" fill="url(#lh3-glow)" />
      <path d="M32 26 L34 32 L32 38 L30 32Z" fill="#fbbf24" opacity="0.6">
        <animate attributeName="opacity" values="0.4;0.7;0.4" dur="1.5s" repeatCount="indefinite" />
      </path>
      <circle cx="32" cy="32" r="3" fill="#fbbf24" opacity="0.3">
        <animate attributeName="r" values="2.5;3.5;2.5" dur="2s" repeatCount="indefinite" />
      </circle>
      <line x1="22" y1="20" x2="42" y2="20" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <line x1="20" y1="30" x2="44" y2="30" stroke={color} strokeWidth="0.5" opacity="0.2" />
      <line x1="20" y1="40" x2="44" y2="40" stroke={color} strokeWidth="0.5" opacity="0.2" />
      <rect x="24" y="50" width="16" height="4" rx="1" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

/* 4 - Buckler */
function LHand4({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="20" fill={`${color}12`} stroke={color} strokeWidth="2" />
      <circle cx="32" cy="32" r="15" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <circle cx="32" cy="32" r="6" fill={`${color}15`} stroke={color} strokeWidth="1" opacity="0.5" />
      <circle cx="32" cy="32" r="2" fill={color} opacity="0.3" />
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 32 + Math.cos(rad) * 8;
        const y1 = 32 + Math.sin(rad) * 8;
        const x2 = 32 + Math.cos(rad) * 14;
        const y2 = 32 + Math.sin(rad) * 14;
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.6" opacity="0.3" />;
      })}
    </svg>
  );
}

/* 5 - Focus Orb */
function LHand5({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <radialGradient id="lh5-glow" cx="40%" cy="40%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="28" r="16" fill="url(#lh5-glow)" stroke={color} strokeWidth="1.5" />
      <circle cx="28" cy="24" r="4" fill="white" opacity="0.08" />
      <circle cx="32" cy="28" r="8" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3">
        <animate attributeName="r" values="7;9;7" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="32" cy="28" r="3" fill={color} opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
      </circle>
      <path d="M26 44 L32 42 L38 44 L38 52 Q38 56 32 58 Q26 56 26 52Z" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

/* 6 - Round Shield */
function LHand6({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="lh6-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="24" fill="url(#lh6-grad)" stroke={color} strokeWidth="2" />
      <circle cx="32" cy="32" r="20" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <circle cx="32" cy="32" r="8" fill={`${color}15`} stroke={color} strokeWidth="1.2" />
      <circle cx="32" cy="32" r="3" fill={color} opacity="0.3" />
      <line x1="32" y1="8" x2="32" y2="56" stroke={color} strokeWidth="0.6" opacity="0.2" />
      <line x1="8" y1="32" x2="56" y2="32" stroke={color} strokeWidth="0.6" opacity="0.2" />
    </svg>
  );
}

/* 7 - Parry Dagger */
function LHand7({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M31 10 L32 8 L33 10 L33.5 28 L30.5 28Z" fill={`${color}30`} stroke={color} strokeWidth="0.8" />
      <line x1="32" y1="10" x2="32" y2="26" stroke="white" strokeWidth="0.2" opacity="0.12" />
      <path d="M22 28 L42 28 L40 32 L24 32Z" fill={`${color}20`} stroke={color} strokeWidth="1" />
      <path d="M22 28 L18 24" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <path d="M42 28 L46 24" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <rect x="30" y="32" width="4" height="18" rx="1" fill="#2a1a10" stroke={color} strokeWidth="0.8" />
      <circle cx="32" cy="54" r="3" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

/* 8 - Torch */
function LHand8({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <radialGradient id="lh8-glow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="29" y="24" width="6" height="34" rx="1.5" fill="#3d2a18" stroke={color} strokeWidth="1" />
      <path d="M30 26 L30 56" stroke={color} strokeWidth="0.4" opacity="0.2" strokeDasharray="2 2" />
      <ellipse cx="32" cy="16" rx="10" ry="14" fill="url(#lh8-glow)" />
      <path d="M28 22 Q32 4 36 22" fill="#f97316" opacity="0.3">
        <animate attributeName="d" values="M28 22 Q32 4 36 22;M28 22 Q30 6 36 22;M28 22 Q34 4 36 22;M28 22 Q32 4 36 22" dur="1s" repeatCount="indefinite" />
      </path>
      <path d="M30 22 Q32 10 34 22" fill="#fbbf24" opacity="0.5">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.8s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

/* 9 - Net */
function LHand9({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="34" r="22" fill="none" stroke={color} strokeWidth="1.2" />
      {[18, 26, 34, 42, 50].map((y) => (
        <line key={`h-${y}`} x1="10" y1={y} x2="54" y2={y} stroke={color} strokeWidth="0.5" opacity="0.3" />
      ))}
      {[18, 26, 34, 42, 50].map((x) => (
        <line key={`v-${x}`} x1={x} y1="12" x2={x} y2="56" stroke={color} strokeWidth="0.5" opacity="0.3" />
      ))}
      <circle cx="32" cy="8" r="3" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
      <path d="M32 11 L32 14" stroke={color} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

/* 10 - Kite Shield */
function LHand10({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="lh10-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M12 8 L52 8 L52 32 L32 60 L12 32Z" fill="url(#lh10-grad)" stroke={color} strokeWidth="1.8" />
      <path d="M16 12 L48 12 L48 30 L32 54 L16 30Z" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="32" y1="12" x2="32" y2="54" stroke={color} strokeWidth="0.8" opacity="0.3" />
      <line x1="16" y1="24" x2="48" y2="24" stroke={color} strokeWidth="0.6" opacity="0.25" />
      <circle cx="32" cy="26" r="4" fill={`${color}12`} stroke={color} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

/* 11 - Ward Totem */
function LHand11({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="28" y="20" width="8" height="38" rx="2" fill="#3d2a18" stroke={color} strokeWidth="1" />
      <path d="M24 8 L32 4 L40 8 L40 22 L24 22Z" fill={`${color}15`} stroke={color} strokeWidth="1.2" />
      <circle cx="32" cy="14" r="3" fill={`${color}20`} stroke={color} strokeWidth="0.8">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <line x1="32" y1="22" x2="32" y2="56" stroke={color} strokeWidth="0.4" opacity="0.2" strokeDasharray="2 2" />
      {[28, 34, 40, 46].map((y) => (
        <g key={y}>
          <line x1="28" y1={y} x2="36" y2={y} stroke={color} strokeWidth="0.4" opacity="0.2" />
        </g>
      ))}
    </svg>
  );
}

/* 12 - Hook */
function LHand12({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="30" y="28" width="4" height="28" rx="1" fill="#3d2a18" stroke={color} strokeWidth="1" />
      <path d="M32 28 Q44 28 44 16 Q44 6 36 6 L28 6 Q22 6 22 12" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="22" cy="14" r="2" fill={color} opacity="0.3" />
      <rect x="28" y="56" width="8" height="4" rx="2" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
      <path d="M30 34 L30 52" stroke={color} strokeWidth="0.4" opacity="0.2" strokeDasharray="1.5 1.5" />
    </svg>
  );
}

/* 13 - Armguard */
function LHand13({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="lh13-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M16 14 L48 14 L48 50 Q48 56 42 56 L22 56 Q16 56 16 50Z" fill="url(#lh13-grad)" stroke={color} strokeWidth="1.5" />
      <rect x="16" y="14" width="32" height="4" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
      <rect x="16" y="28" width="32" height="4" rx="1" fill={`${color}12`} stroke={color} strokeWidth="0.6" />
      <rect x="16" y="42" width="32" height="4" rx="1" fill={`${color}12`} stroke={color} strokeWidth="0.6" />
      {[20, 24, 34, 38, 48, 52].map((y) => (
        <g key={y}>
          <circle cx="20" cy={y} r="1" fill={color} opacity="0.2" />
          <circle cx="44" cy={y} r="1" fill={color} opacity="0.2" />
        </g>
      ))}
    </svg>
  );
}

/* 14 - Spell Scroll */
function LHand14({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <rect x="18" y="12" width="28" height="44" rx="2" fill={`${color}10`} stroke={color} strokeWidth="1.2" />
      <ellipse cx="32" cy="12" rx="14" ry="4" fill={`${color}15`} stroke={color} strokeWidth="1" />
      <ellipse cx="32" cy="56" rx="14" ry="4" fill={`${color}15`} stroke={color} strokeWidth="1" />
      {[20, 26, 32, 38, 44].map((y) => (
        <line key={y} x1="22" y1={y} x2="42" y2={y} stroke={color} strokeWidth="0.4" opacity="0.3" />
      ))}
      <circle cx="32" cy="32" r="4" fill={`${color}12`} stroke={color} strokeWidth="0.6" opacity="0.4">
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* 15 - Spiked Shield */
function LHand15({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="lh15-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M14 10 L50 10 L50 40 Q50 54 32 58 Q14 54 14 40Z" fill="url(#lh15-grad)" stroke={color} strokeWidth="1.5" />
      <circle cx="32" cy="30" r="6" fill={`${color}15`} stroke={color} strokeWidth="1" />
      <circle cx="32" cy="30" r="2" fill={color} opacity="0.3" />
      <path d="M32 10 L32 4" stroke={color} strokeWidth="1.5" />
      <path d="M14 24 L8 22" stroke={color} strokeWidth="1.5" />
      <path d="M50 24 L56 22" stroke={color} strokeWidth="1.5" />
      <path d="M20 48 L16 54" stroke={color} strokeWidth="1.2" />
      <path d="M44 48 L48 54" stroke={color} strokeWidth="1.2" />
      <line x1="14" y1="24" x2="50" y2="24" stroke={color} strokeWidth="0.6" opacity="0.25" />
    </svg>
  );
}

export const LEFT_HAND_ART: Record<string, React.FC<ItemArtProps>> = {
  "leftHand-1": LHand1,
  "leftHand-2": LHand2,
  "leftHand-3": LHand3,
  "leftHand-4": LHand4,
  "leftHand-5": LHand5,
  "leftHand-6": LHand6,
  "leftHand-7": LHand7,
  "leftHand-8": LHand8,
  "leftHand-9": LHand9,
  "leftHand-10": LHand10,
  "leftHand-11": LHand11,
  "leftHand-12": LHand12,
  "leftHand-13": LHand13,
  "leftHand-14": LHand14,
  "leftHand-15": LHand15,
};

export const LEFT_HAND_ART_ALIASES: Record<string, React.FC<ItemArtProps>> = {
  "lhand-shield": LHand1,
  "lhand-thieves-tools": LHand2,
  "lhand-lantern": LHand3,
};

export const LEFT_HAND_ART_KEYS = Object.keys(LEFT_HAND_ART);
