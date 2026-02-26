"use client";

interface ItemArtProps {
  color?: string;
  size?: number;
  className?: string;
}

const DC = "#c4a35a";
const DS = 64;

function Head1({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="hood-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d="M32 6 Q12 6 12 28 L12 40 Q12 44 16 46 L20 48 L20 52 L44 52 L44 48 L48 46 Q52 44 52 40 L52 28 Q52 6 32 6Z" fill="url(#hood-grad)" stroke={color} strokeWidth="1.5" />
      <path d="M20 34 Q20 28 32 22 Q44 28 44 34 L44 40 L20 40Z" fill={`${color}15`} stroke={color} strokeWidth="1" opacity="0.6" />
      <line x1="24" y1="36" x2="28" y2="36" stroke={color} strokeWidth="1" opacity="0.5" />
      <line x1="36" y1="36" x2="40" y2="36" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M16 20 Q16 12 32 8 Q48 12 48 20" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" strokeDasharray="2 2" />
      <path d="M18 24 Q18 16 32 10 Q46 16 46 24" fill="none" stroke={color} strokeWidth="0.8" opacity="0.2" strokeDasharray="2 2" />
      <line x1="32" y1="6" x2="32" y2="14" stroke={color} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

function Head2({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="h2-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#3a3a48" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M14 36 L14 20 Q14 6 32 6 Q50 6 50 20 L50 36 Q50 44 46 46 L46 50 L18 50 L18 46 Q14 44 14 36Z" fill="url(#h2-grad)" stroke={color} strokeWidth="1.8" />
      <rect x="14" y="30" width="36" height="6" rx="1" fill={`${color}20`} stroke={color} strokeWidth="1" />
      <line x1="28" y1="30" x2="28" y2="36" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <line x1="36" y1="30" x2="36" y2="36" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <line x1="32" y1="30" x2="32" y2="36" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <path d="M32 6 L32 16" stroke={color} strokeWidth="2" opacity="0.5" />
      <path d="M24 8 L32 4 L40 8" fill="none" stroke={color} strokeWidth="1.2" opacity="0.6" />
      {[16, 20, 24, 40, 44, 48].map((x) => (
        <circle key={x} cx={x} cy="28" r="1.5" fill={color} opacity="0.3" />
      ))}
      {[16, 20, 24, 40, 44, 48].map((x) => (
        <circle key={`b-${x}`} cx={x} cy="42" r="1.5" fill={color} opacity="0.3" />
      ))}
      <rect x="14" y="48" width="36" height="4" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
    </svg>
  );
}

function Head3({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <filter id="h3-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <ellipse cx="32" cy="32" rx="22" ry="16" fill="none" stroke={color} strokeWidth="2.5" />
      <ellipse cx="32" cy="32" rx="20" ry="14" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <circle cx="32" cy="16" r="4" fill={`${color}30`} stroke={color} strokeWidth="1.5" filter="url(#h3-glow)" />
      <circle cx="32" cy="16" r="2" fill={color} opacity="0.5">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      {[14, 22, 42, 50].map((x) => (
        <g key={x}>
          <line x1={x} y1={21} x2={x + 2} y2={19} stroke={color} strokeWidth="1" opacity="0.5" />
          <line x1={x - 1} y1={23} x2={x + 1} y2={21} stroke={color} strokeWidth="0.8" opacity="0.3" />
        </g>
      ))}
      <circle cx="14" cy="28" r="1.5" fill={color} opacity="0.4">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="28" r="1.5" fill={color} opacity="0.4">
        <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function Head4({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="h4-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M16 38 L16 22 Q16 8 32 8 Q48 8 48 22 L48 38 Q48 46 44 48 L44 52 L20 52 L20 48 Q16 46 16 38Z" fill="url(#h4-grad)" stroke={color} strokeWidth="1.5" />
      <path d="M10 22 L16 18 L16 26Z" fill={`${color}20`} stroke={color} strokeWidth="1" />
      <path d="M54 22 L48 18 L48 26Z" fill={`${color}20`} stroke={color} strokeWidth="1" />
      <rect x="16" y="32" width="32" height="5" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
      <line x1="24" y1="32" x2="24" y2="37" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <line x1="32" y1="32" x2="32" y2="37" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <line x1="40" y1="32" x2="40" y2="37" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <circle cx="32" cy="14" r="2" fill={color} opacity="0.3" />
    </svg>
  );
}

function Head5({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="h5-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <path d="M32 2 L14 28 Q10 34 14 38 L20 42 L20 52 L44 52 L44 42 L50 38 Q54 34 50 28Z" fill="url(#h5-grad)" stroke={color} strokeWidth="1.5" />
      <path d="M20 36 Q20 30 32 26 Q44 30 44 36 L44 42 L20 42Z" fill={`${color}12`} stroke={color} strokeWidth="0.8" opacity="0.5" />
      <circle cx="32" cy="2" r="2.5" fill={color} opacity="0.4" />
      <line x1="32" y1="4" x2="32" y2="16" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M22 28 L32 6 L42 28" fill="none" stroke={color} strokeWidth="0.6" opacity="0.2" strokeDasharray="2 2" />
    </svg>
  );
}

function Head6({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="h6-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2a2a35" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1a1a22" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path d="M12 28 Q12 12 32 12 Q52 12 52 28 L52 36 L12 36Z" fill="url(#h6-grad)" stroke={color} strokeWidth="1.2" />
      <path d="M16 36 L16 44 L24 48 L40 48 L48 44 L48 36" fill={`${color}10`} stroke={color} strokeWidth="1" />
      <rect x="16" y="30" width="32" height="8" rx="1" fill={`${color}20`} stroke={color} strokeWidth="1" />
      <path d="M22 34 L42 34" stroke={color} strokeWidth="0.6" opacity="0.4" />
      <path d="M18 44 Q20 40 32 38 Q44 40 46 44" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="32" y1="12" x2="32" y2="30" stroke={color} strokeWidth="0.6" opacity="0.2" />
    </svg>
  );
}

function Head7({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M16 36 L12 24 L18 14 L32 10 L46 14 L52 24 L48 36 L44 40 L20 40Z" fill={`${color}15`} stroke={color} strokeWidth="1.5" />
      <path d="M18 14 L32 10 L46 14" fill="none" stroke={color} strokeWidth="2" />
      {[20, 26, 32, 38, 44].map((x) => (
        <path key={x} d="M${x} 14 L${x} 10" stroke={color} strokeWidth="0.8" opacity="0.3" />
      ))}
      <circle cx="32" cy="22" r="4" fill={`${color}20`} stroke={color} strokeWidth="1" />
      <circle cx="32" cy="22" r="1.5" fill={color} opacity="0.5" />
      <path d="M20 40 L20 48 L44 48 L44 40" fill={`${color}08`} stroke={color} strokeWidth="0.8" />
      {[18, 24, 30, 36, 42, 46].map((x) => (
        <line key={x} x1={x} y1="36" x2={x} y2="40" stroke={color} strokeWidth="0.6" opacity="0.3" />
      ))}
    </svg>
  );
}

function Head8({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M14 32 Q14 28 18 26 L46 26 Q50 28 50 32 L50 36 Q50 38 46 38 L18 38 Q14 36 14 32Z" fill={`${color}20`} stroke={color} strokeWidth="1.2" />
      <path d="M18 26 L18 22 Q20 18 24 20 L24 26" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <path d="M40 26 L40 22 Q42 18 46 20 L46 26" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <line x1="18" y1="32" x2="46" y2="32" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M50 30 L56 28 L56 34 L50 32" fill={`${color}10`} stroke={color} strokeWidth="0.8" opacity="0.6" />
      <path d="M14 30 L8 28 L8 34 L14 32" fill={`${color}10`} stroke={color} strokeWidth="0.8" opacity="0.6" />
      <circle cx="32" cy="32" r="2" fill={color} opacity="0.3" />
    </svg>
  );
}

function Head9({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="h9-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <ellipse cx="32" cy="30" rx="20" ry="22" fill="url(#h9-grad)" stroke={color} strokeWidth="1.2" />
      <ellipse cx="32" cy="30" rx="16" ry="18" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <path d="M32 8 Q26 14 26 24" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <path d="M32 8 Q38 14 38 24" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <path d="M20 40 Q20 34 32 30 Q44 34 44 40 L44 46 L20 46Z" fill={`${color}12`} stroke={color} strokeWidth="0.8" opacity="0.5" />
      <line x1="26" y1="42" x2="30" y2="42" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <line x1="34" y1="42" x2="38" y2="42" stroke={color} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

function Head10({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="h10-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a3a48" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M16 40 L16 22 Q16 10 32 10 Q48 10 48 22 L48 40 Q48 44 44 44 L20 44 Q16 44 16 40Z" fill="url(#h10-grad)" stroke={color} strokeWidth="1.2" />
      <rect x="16" y="38" width="32" height="6" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
      <line x1="22" y1="38" x2="22" y2="44" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="32" y1="38" x2="32" y2="44" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <line x1="42" y1="38" x2="42" y2="44" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <ellipse cx="32" cy="24" rx="8" ry="6" fill="none" stroke={color} strokeWidth="0.6" opacity="0.2" />
    </svg>
  );
}

function Head11({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="h11-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M16 38 L16 22 Q16 8 32 8 Q48 8 48 22 L48 38 Q48 44 44 46 L44 50 L20 50 L20 46 Q16 44 16 38Z" fill="url(#h11-grad)" stroke={color} strokeWidth="1.5" />
      <rect x="16" y="30" width="32" height="5" rx="1" fill={`${color}18`} stroke={color} strokeWidth="0.8" />
      <path d="M32 8 L32 2" stroke={color} strokeWidth="1.5" />
      <path d="M30 2 Q32 -2 34 2 L34 8" fill={color} opacity="0.2" stroke={color} strokeWidth="0.8" />
      <path d="M28 4 Q32 -1 36 4" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      {[18, 22, 26, 38, 42, 46].map((x) => (
        <circle key={x} cx={x} cy="28" r="1" fill={color} opacity="0.25" />
      ))}
    </svg>
  );
}

function Head12({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="h12-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6b4423" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#3d2a18" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M16 36 L16 22 Q16 10 32 10 Q48 10 48 22 L48 36 Q48 42 44 44 L20 44 Q16 42 16 36Z" fill="url(#h12-grad)" stroke={color} strokeWidth="1.2" />
      <path d="M16 22 Q16 10 32 10 Q48 10 48 22" fill="none" stroke={color} strokeWidth="1.5" />
      <line x1="16" y1="28" x2="48" y2="28" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <path d="M22 28 L22 20" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" strokeDasharray="1.5 2" />
      <path d="M42 28 L42 20" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" strokeDasharray="1.5 2" />
      <rect x="28" y="10" width="8" height="3" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

function Head13({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="h13-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M14 36 L14 20 Q14 6 32 6 Q50 6 50 20 L50 36 Q50 44 46 46 L46 52 L18 52 L18 46 Q14 44 14 36Z" fill="url(#h13-grad)" stroke={color} strokeWidth="1.2" />
      {[10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54].map((x, i) => (
        <circle key={i} cx={Math.min(Math.max(x, 16), 48)} cy={12 + (i % 3) * 2} r="1.2" fill={color} opacity="0.15" />
      ))}
      <path d="M18 30 Q18 24 32 18 Q46 24 46 30" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <rect x="14" y="34" width="36" height="4" rx="1" fill={`${color}12`} stroke={color} strokeWidth="0.6" />
      <line x1="22" y1="38" x2="26" y2="38" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <line x1="38" y1="38" x2="42" y2="38" stroke={color} strokeWidth="0.8" opacity="0.4" />
    </svg>
  );
}

function Head14({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M20 42 L20 24 Q20 12 32 12 Q44 12 44 24 L44 42 Q44 48 40 50 L24 50 Q20 48 20 42Z" fill={`${color}12`} stroke={color} strokeWidth="1.2" />
      <path d="M14 22 L20 18" fill="none" stroke={color} strokeWidth="1.5" />
      <path d="M10 20 L14 22 L12 26" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
      <path d="M50 22 L44 18" fill="none" stroke={color} strokeWidth="1.5" />
      <path d="M54 20 L50 22 L52 26" fill={`${color}20`} stroke={color} strokeWidth="0.8" />
      <path d="M32 4 L28 12" fill="none" stroke={color} strokeWidth="1.2" />
      <path d="M32 4 L36 12" fill="none" stroke={color} strokeWidth="1.2" />
      <path d="M32 4 L32 12" fill="none" stroke={color} strokeWidth="1.2" />
      <circle cx="32" cy="4" r="2" fill={color} opacity="0.3" />
      <rect x="20" y="34" width="24" height="4" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.6" />
    </svg>
  );
}

function Head15({ color = DC, size = DS, className }: ItemArtProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
      <defs>
        <linearGradient id="h15-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a4a3a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a2a1a" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d="M16 38 L16 22 Q16 8 32 8 Q48 8 48 22 L48 38 Q48 44 44 46 L44 50 L20 50 L20 46 Q16 44 16 38Z" fill="url(#h15-grad)" stroke={color} strokeWidth="1.5" />
      <path d="M20 14 L18 8 L22 10" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M44 14 L46 8 L42 10" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <path d="M28 10 L32 4 L36 10" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
      <rect x="16" y="30" width="32" height="5" rx="1" fill={`${color}15`} stroke={color} strokeWidth="0.8" />
      <path d="M22 35 Q22 30 32 26 Q42 30 42 35" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      {[20, 26, 38, 44].map((x) => (
        <circle key={x} cx={x} cy="22" r="1.5" fill={color} opacity="0.2" />
      ))}
    </svg>
  );
}

export const HEAD_ART: Record<string, React.FC<ItemArtProps>> = {
  "head-1": Head1,
  "head-2": Head2,
  "head-3": Head3,
  "head-4": Head4,
  "head-5": Head5,
  "head-6": Head6,
  "head-7": Head7,
  "head-8": Head8,
  "head-9": Head9,
  "head-10": Head10,
  "head-11": Head11,
  "head-12": Head12,
  "head-13": Head13,
  "head-14": Head14,
  "head-15": Head15,
};

export const HEAD_ART_ALIASES: Record<string, React.FC<ItemArtProps>> = {
  "head-scouts-hood": Head1,
  "head-knights-helm": Head2,
  "head-scholars-circlet": Head3,
};

export const HEAD_ART_KEYS = Object.keys(HEAD_ART);
