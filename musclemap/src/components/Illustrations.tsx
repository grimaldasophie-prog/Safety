import { useMemo, type CSSProperties } from 'react';

export function Rocket({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 40 60" aria-hidden>
      <path d="M20 2 C29 10 31 24 29 40 L11 40 C9 24 11 10 20 2 Z" fill="#FFFFFF" />
      <path d="M20 2 C24 5.5 26.5 10 27.8 15 L12.2 15 C13.5 10 16 5.5 20 2 Z" fill="#FC3D21" />
      <circle cx="20" cy="24" r="4.5" fill="#0B3D91" />
      <circle cx="20" cy="24" r="2" fill="#C9D3E3" />
      <path d="M11 30 L3 44 L11 42 Z" fill="#FC3D21" />
      <path d="M29 30 L37 44 L29 42 Z" fill="#FC3D21" />
      <rect x="15" y="40" width="10" height="4" fill="#C9D3E3" />
      <path d="M15 46 L25 46 L20 58 Z" fill="#F5B700" />
      <path d="M17.5 46 L22.5 46 L20 53 Z" fill="#FFFFFF" />
    </svg>
  );
}

export function House({ size = 92 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.82} viewBox="0 0 100 82" aria-hidden>
      {/* hill */}
      <ellipse cx="50" cy="80" rx="50" ry="8" fill="#2BB673" opacity="0.35" />
      {/* chimney */}
      <rect x="66" y="12" width="9" height="18" fill="#0B3D91" />
      {/* roof */}
      <path d="M12 40 L50 10 L88 40 Z" fill="#FC3D21" />
      {/* walls */}
      <rect x="20" y="38" width="60" height="40" fill="#FFFFFF" />
      {/* door */}
      <rect x="28" y="52" width="14" height="26" fill="#0B3D91" />
      <circle cx="39" cy="66" r="1.4" fill="#F5B700" />
      {/* warm window */}
      <rect x="52" y="50" width="20" height="16" fill="#F5B700" />
      <rect x="61" y="50" width="2" height="16" fill="#FFFFFF" />
      <rect x="52" y="57" width="20" height="2" fill="#FFFFFF" />
      {/* window glow spill (flat) */}
      <path d="M52 66 L72 66 L78 78 L46 78 Z" fill="#F5B700" opacity="0.28" />
    </svg>
  );
}

export function AstronautAvatar({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" aria-hidden>
      <circle cx="22" cy="22" r="22" fill="#FFFFFF" />
      <circle cx="22" cy="22" r="17" fill="#E4EAF3" />
      <path d="M9 21 C9 13 15 10 22 10 C29 10 35 13 35 21 C35 27 30 30 22 30 C14 30 9 27 9 21 Z" fill="#0B1D3A" />
      <path d="M14 17 C16 14 19 13 22 13" stroke="#C9D3E3" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <rect x="16" y="33" width="12" height="3.5" rx="1.75" fill="#FC3D21" />
    </svg>
  );
}

/** Side view of a lower leg (calf) or a full leg (thigh) for the scan steps. */
export function LegOutline({ part, className = '' }: { part: 'calves' | 'thighs'; className?: string }) {
  if (part === 'calves') {
    return (
      <svg viewBox="0 0 200 260" className={className} aria-hidden>
        <path
          d="M78 10 L122 10 C130 50 140 78 136 112 C132 146 118 176 114 212 L116 226 C134 228 158 234 166 246 L166 252 L84 252 L86 214 C80 170 62 132 66 92 C68 60 76 36 78 10 Z"
          fill="#0B3D91"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M96 30 C90 70 82 104 90 150" stroke="#2A5299" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden>
      <path
        d="M66 6 L132 6 C138 40 140 76 132 108 C126 128 118 136 116 150 C122 176 124 196 118 222 L120 232 C134 234 154 238 160 248 L160 254 L94 254 L96 224 C88 196 82 172 88 148 C78 124 66 96 64 60 C63 40 64 22 66 6 Z"
        fill="#0B3D91"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="104" cy="146" r="5" fill="#2A5299" />
    </svg>
  );
}

export function SensorLeg({ part, active }: { part: 'calves' | 'thighs'; active: boolean }) {
  const pads = part === 'calves' ? [64, 160] : [40, 120];
  return (
    <div className="relative mx-auto h-[230px] w-[180px]">
      <LegOutline part={part} className="h-full w-full" />
      <svg viewBox="0 0 200 260" className="absolute inset-0 h-full w-full" aria-hidden>
        {pads.map((y, i) => (
          <g key={y}>
            <rect x={part === 'calves' ? 70 + i * 4 : 68 + i * 14} y={y} width="60" height="16" rx="3" fill="#FC3D21" />
            <rect x={part === 'calves' ? 82 + i * 4 : 80 + i * 14} y={y + 6} width="36" height="4" rx="2" fill="#FFFFFF" />
          </g>
        ))}
        {active && (
          <path
            d={part === 'calves' ? 'M100 82 L104 160' : 'M100 58 L116 120'}
            stroke="#F5B700"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-current"
          />
        )}
      </svg>
    </div>
  );
}

const CONFETTI_COLORS = ['#FC3D21', '#FFFFFF', '#F5B700', '#2BB673', '#5B8DEF'];

export function Confetti({ count = 46 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        duration: 2.4 + Math.random() * 1.8,
        size: 6 + Math.random() * 8,
        rotate: Math.random() * 360,
        drift: (Math.random() - 0.5) * 80,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        shape: i % 3,
      })),
    [count],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece absolute top-[-20px] block"
          style={
            {
              left: `${p.left}%`,
              width: p.shape === 2 ? p.size * 0.5 : p.size,
              height: p.shape === 1 ? p.size : p.shape === 2 ? p.size * 1.6 : p.size * 0.5,
              background: p.color,
              borderRadius: p.shape === 1 ? '50%' : 1,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              '--drift': `${p.drift}px`,
              '--rot': `${p.rotate}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
