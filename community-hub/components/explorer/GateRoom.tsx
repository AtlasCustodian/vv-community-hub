"use client";

import type { FactionTheme } from "@/lib/explorer/factionThemes";

interface GateRoomProps {
  theme: FactionTheme;
  championName: string;
  onEnter: () => void;
}

export default function GateRoom({
  theme,
  championName,
  onEnter,
}: GateRoomProps) {
  const stoneColor = "#3d2a18";
  const stoneDark = "#2a1a0e";
  const stoneLight = "#5a4030";

  return (
    <div className="vantheon-gate-room flex flex-col items-center gap-6 animate-fade-in">
      <svg
        viewBox="0 0 600 520"
        className="w-full drop-shadow-2xl"
        style={{
          filter: `drop-shadow(0 0 40px ${theme.primary}10)`,
        }}
      >
        <defs>
          <filter id="gate-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="gate-glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="gate-stone-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={stoneLight} />
            <stop offset="50%" stopColor={stoneDark} />
            <stop offset="100%" stopColor="#1a1008" />
          </linearGradient>
          <linearGradient id="gate-stone-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={stoneLight} />
            <stop offset="50%" stopColor={stoneDark} />
            <stop offset="100%" stopColor="#1a1008" />
          </linearGradient>
          <linearGradient id="gate-metal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5a5a6a" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#3a3a48" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2a2a35" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="gate-inner-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.primary} stopOpacity="0.15" />
            <stop offset="60%" stopColor={theme.primary} stopOpacity="0.05" />
            <stop offset="100%" stopColor={theme.primary} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="torch-flame-l" cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="torch-flame-r" cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background grid */}
        <pattern id="gate-grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke={stoneColor} strokeWidth="0.3" opacity="0.2" />
        </pattern>
        <rect width="600" height="520" fill="url(#gate-grid)" opacity="0.4" />

        {/* Ground line */}
        <line x1="60" y1="460" x2="540" y2="460" stroke={stoneColor} strokeWidth="3" opacity="0.5" />
        <line x1="80" y1="465" x2="520" y2="465" stroke={stoneColor} strokeWidth="1.5" opacity="0.3" />

        {/* Stone foundation */}
        <rect x="120" y="440" width="360" height="25" rx="2" fill="url(#gate-stone-grad)" stroke={stoneLight} strokeWidth="1.5" />
        {/* Foundation stones */}
        {[130, 180, 230, 280, 330, 380, 430].map((x) => (
          <line key={`fs-${x}`} x1={x} y1="440" x2={x} y2="465" stroke={stoneLight} strokeWidth="0.5" opacity="0.4" />
        ))}

        {/* Left pillar */}
        <rect x="130" y="100" width="60" height="340" rx="3" fill="url(#gate-stone-grad)" stroke={stoneLight} strokeWidth="2" />
        <rect x="135" y="105" width="50" height="330" rx="2" fill="none" stroke={stoneColor} strokeWidth="0.5" opacity="0.4" />
        {/* Pillar stone lines */}
        {[140, 180, 220, 260, 300, 340, 380, 420].map((y) => (
          <line key={`lp-${y}`} x1="130" y1={y} x2="190" y2={y} stroke={stoneLight} strokeWidth="0.8" opacity="0.35" />
        ))}
        {/* Left pillar cap */}
        <rect x="122" y="88" width="76" height="18" rx="4" fill={stoneColor} stroke={stoneLight} strokeWidth="1.5" />
        <rect x="126" y="92" width="68" height="10" rx="2" fill="none" stroke={stoneLight} strokeWidth="0.5" opacity="0.3" />

        {/* Right pillar */}
        <rect x="410" y="100" width="60" height="340" rx="3" fill="url(#gate-stone-grad)" stroke={stoneLight} strokeWidth="2" />
        <rect x="415" y="105" width="50" height="330" rx="2" fill="none" stroke={stoneColor} strokeWidth="0.5" opacity="0.4" />
        {[140, 180, 220, 260, 300, 340, 380, 420].map((y) => (
          <line key={`rp-${y}`} x1="410" y1={y} x2="470" y2={y} stroke={stoneLight} strokeWidth="0.8" opacity="0.35" />
        ))}
        <rect x="402" y="88" width="76" height="18" rx="4" fill={stoneColor} stroke={stoneLight} strokeWidth="1.5" />
        <rect x="406" y="92" width="68" height="10" rx="2" fill="none" stroke={stoneLight} strokeWidth="0.5" opacity="0.3" />

        {/* Archway */}
        <path
          d="M190 100 L190 70 Q190 20 300 20 Q410 20 410 70 L410 100"
          fill={stoneColor}
          stroke={stoneLight}
          strokeWidth="2.5"
        />
        <path
          d="M195 100 L195 72 Q195 28 300 28 Q405 28 405 72 L405 100"
          fill="none"
          stroke={stoneLight}
          strokeWidth="0.5"
          opacity="0.3"
        />
        {/* Keystone */}
        <path
          d="M285 18 L300 10 L315 18 L310 35 L290 35Z"
          fill={stoneColor}
          stroke={theme.primary}
          strokeWidth="1.5"
        />
        <circle cx="300" cy="24" r="4" fill={theme.primary} opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Arch decorative stones */}
        {[40, 55, 70, 85].map((offset) => {
          const leftAngle = Math.PI - (offset / 100) * Math.PI;
          const rightAngle = (offset / 100) * Math.PI;
          return (
            <g key={`arch-${offset}`}>
              <circle
                cx={300 + Math.cos(leftAngle) * 105}
                cy={60 - Math.sin(leftAngle) * 40 + 10}
                r="2.5"
                fill={stoneLight}
                opacity="0.4"
              />
              <circle
                cx={300 + Math.cos(rightAngle) * 105}
                cy={60 - Math.sin(rightAngle) * 40 + 10}
                r="2.5"
                fill={stoneLight}
                opacity="0.4"
              />
            </g>
          );
        })}

        {/* Inner glow behind gate */}
        <ellipse cx="300" cy="280" rx="100" ry="160" fill="url(#gate-inner-glow)">
          <animate attributeName="rx" values="95;105;95" dur="4s" repeatCount="indefinite" />
          <animate attributeName="ry" values="155;165;155" dur="4s" repeatCount="indefinite" />
        </ellipse>

        {/* Gate opening (dark interior) */}
        <rect x="190" y="100" width="220" height="340" fill="#080604" />

        {/* Portcullis bars - vertical */}
        {[210, 240, 270, 300, 330, 360, 390].map((x) => (
          <g key={`bar-${x}`}>
            <rect x={x - 3} y="100" width="6" height="340" fill="url(#gate-metal-grad)" stroke="#5a5a6a" strokeWidth="0.5" />
            <line x1={x} y1="100" x2={x} y2="440" stroke="#7a7a8a" strokeWidth="0.3" opacity="0.2" />
          </g>
        ))}
        {/* Portcullis bars - horizontal */}
        {[140, 180, 220, 260, 300, 340, 380, 420].map((y) => (
          <g key={`hbar-${y}`}>
            <rect x="190" y={y - 2} width="220" height="4" fill="url(#gate-stone-h)" opacity="0.6" />
          </g>
        ))}
        {/* Bar intersection rivets */}
        {[210, 240, 270, 300, 330, 360, 390].map((x) =>
          [140, 180, 220, 260, 300, 340, 380, 420].map((y) => (
            <circle key={`rivet-${x}-${y}`} cx={x} cy={y} r="2.5" fill="#4a4a5a" stroke="#6a6a7a" strokeWidth="0.5" />
          ))
        )}

        {/* Portcullis spikes at bottom */}
        {[210, 240, 270, 300, 330, 360, 390].map((x) => (
          <path key={`spike-${x}`} d={`M${x - 4} 440 L${x} 454 L${x + 4} 440`} fill="#3a3a48" stroke="#5a5a6a" strokeWidth="0.8" />
        ))}

        {/* === LEFT TORCH === */}
        <g>
          {/* Torch bracket */}
          <rect x="100" y="160" width="30" height="8" rx="2" fill={stoneColor} stroke={stoneLight} strokeWidth="1" />
          <rect x="92" y="152" width="12" height="80" rx="2" fill={stoneColor} stroke={stoneLight} strokeWidth="1" />
          {/* Torch handle */}
          <rect x="95" y="120" width="6" height="36" rx="2" fill="#5a3a1a" stroke={stoneLight} strokeWidth="0.8" />
          {/* Flame glow */}
          <ellipse cx="98" cy="100" rx="20" ry="30" fill="url(#torch-flame-l)" opacity="0.4">
            <animate attributeName="rx" values="18;22;18" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="ry" values="28;34;28" dur="2s" repeatCount="indefinite" />
          </ellipse>
          {/* Flame core */}
          <path d="M98 80 L102 95 L98 115 L94 95Z" fill="#fbbf24" opacity="0.7">
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="1s" repeatCount="indefinite" />
          </path>
          <path d="M98 86 L100 95 L98 108 L96 95Z" fill="#fff" opacity="0.25">
            <animate attributeName="opacity" values="0.15;0.35;0.15" dur="0.8s" repeatCount="indefinite" />
          </path>
          {/* Sparks */}
          <circle cx="92" cy="78" r="1" fill="#fbbf24" opacity="0.5">
            <animate attributeName="cy" values="78;68;78" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="105" cy="74" r="0.8" fill="#f97316" opacity="0.4">
            <animate attributeName="cy" values="74;60;74" dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* === RIGHT TORCH === */}
        <g>
          <rect x="470" y="160" width="30" height="8" rx="2" fill={stoneColor} stroke={stoneLight} strokeWidth="1" />
          <rect x="496" y="152" width="12" height="80" rx="2" fill={stoneColor} stroke={stoneLight} strokeWidth="1" />
          <rect x="499" y="120" width="6" height="36" rx="2" fill="#5a3a1a" stroke={stoneLight} strokeWidth="0.8" />
          <ellipse cx="502" cy="100" rx="20" ry="30" fill="url(#torch-flame-r)" opacity="0.4">
            <animate attributeName="rx" values="18;22;18" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="ry" values="28;34;28" dur="2.2s" repeatCount="indefinite" />
          </ellipse>
          <path d="M502 80 L506 95 L502 115 L498 95Z" fill="#fbbf24" opacity="0.7">
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="1.1s" repeatCount="indefinite" />
          </path>
          <path d="M502 86 L504 95 L502 108 L500 95Z" fill="#fff" opacity="0.25">
            <animate attributeName="opacity" values="0.15;0.35;0.15" dur="0.9s" repeatCount="indefinite" />
          </path>
          <circle cx="508" cy="76" r="1" fill="#fbbf24" opacity="0.5">
            <animate attributeName="cy" values="76;64;76" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="495" cy="72" r="0.8" fill="#f97316" opacity="0.4">
            <animate attributeName="cy" values="72;58;72" dur="2.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2.8s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Dust particles floating */}
        {[
          { cx: 250, cy: 300, dur: "6s", r: 1.2 },
          { cx: 320, cy: 250, dur: "7s", r: 0.8 },
          { cx: 280, cy: 350, dur: "5s", r: 1 },
          { cx: 350, cy: 200, dur: "8s", r: 0.6 },
          { cx: 230, cy: 180, dur: "6.5s", r: 0.9 },
          { cx: 370, cy: 320, dur: "7.5s", r: 0.7 },
        ].map((p, i) => (
          <circle key={`dust-${i}`} cx={p.cx} cy={p.cy} r={p.r} fill={theme.primary} opacity="0.2">
            <animate attributeName="cy" values={`${p.cy};${p.cy - 40};${p.cy}`} dur={p.dur} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0;0.2" dur={p.dur} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Decorative runes on pillars */}
        <g opacity="0.4">
          <text x="160" y="200" textAnchor="middle" fill={theme.primary} fontSize="12" fontFamily="monospace" opacity="0.3">
            ᛟ
          </text>
          <text x="160" y="260" textAnchor="middle" fill={theme.primary} fontSize="12" fontFamily="monospace" opacity="0.3">
            ᛗ
          </text>
          <text x="160" y="320" textAnchor="middle" fill={theme.primary} fontSize="12" fontFamily="monospace" opacity="0.3">
            ᚦ
          </text>
          <text x="440" y="200" textAnchor="middle" fill={theme.primary} fontSize="12" fontFamily="monospace" opacity="0.3">
            ᛉ
          </text>
          <text x="440" y="260" textAnchor="middle" fill={theme.primary} fontSize="12" fontFamily="monospace" opacity="0.3">
            ᚱ
          </text>
          <text x="440" y="320" textAnchor="middle" fill={theme.primary} fontSize="12" fontFamily="monospace" opacity="0.3">
            ᚨ
          </text>
        </g>

        {/* Title */}
        <text
          x="300"
          y="498"
          textAnchor="middle"
          fill={theme.primary}
          fontSize="16"
          fontWeight="700"
          letterSpacing="0.2em"
          opacity="0.8"
        >
          THE GATE
        </text>
      </svg>

      {/* Description */}
      <div className="text-center max-w-md px-4">
        <p className="text-sm text-[var(--color-muted)] mb-1">
          A maze of tunnels and caves stretches out before you...
        </p>
        <p className="text-xs text-[var(--color-muted)] italic opacity-60">
          {championName} stands ready at the entrance, torch in hand.
        </p>
      </div>

      {/* Enter button */}
      <button
        onClick={onEnter}
        className="btn-stone px-10 py-3 text-base font-semibold tracking-wider uppercase gate-enter-btn"
        style={{
          borderColor: `${theme.primary}50`,
          boxShadow: `0 0 20px ${theme.primary}15, 0 4px 12px rgba(0,0,0,0.3)`,
        }}
      >
        Enter the Gate
      </button>
    </div>
  );
}
