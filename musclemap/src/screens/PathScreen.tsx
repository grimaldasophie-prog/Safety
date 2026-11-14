import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { useStore } from '../lib/store';
import { daysToLanding } from '../lib/rules';
import { GIFT_CIRCLES, PATH_LENGTH } from '../data/demoData';
import { LESSONS } from '../data/lessons';
import { ScreenTitle } from '../components/ui';
import { IconCheck, IconGift, IconLock } from '../components/Icons';
import { AstronautAvatar, House, Rocket } from '../components/Illustrations';

const W = 350; // design width of the map
const STEP = 82;
const TOP = 170;
const BOTTOM = 150;
const H = TOP + (PATH_LENGTH - 1) * STEP + BOTTOM;

function pos(i: number) {
  // i is 1-based, circle 1 at the bottom.
  const y = H - BOTTOM - (i - 1) * STEP;
  const x = W / 2 + 96 * Math.sin((i - 1) * 0.62);
  return { x, y };
}

/** Smooth curve through points (Catmull-Rom → cubic Bézier). */
function smooth(points: { x: number; y: number }[]) {
  if (points.length < 2) return '';
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;
  }
  return d;
}

/** Remembers where the avatar was last shown, so a new step animates. */
const lastSeen: Record<string, number> = {};

export default function PathScreen({ scroller }: { scroller: RefObject<HTMLDivElement> }) {
  const { profile, day, progress, pendingUnlock, revealUnlock, openMessage, isOpened } = useStore();
  const { done, current, readyPct } = progress;
  const mapRef = useRef<HTMLDivElement>(null);
  const key = `${profile.id}-${day}`;
  const [avatarAt, setAvatarAt] = useState(() => lastSeen[key] ?? (pendingUnlock ? current - 1 : current));
  const [hint, setHint] = useState<number | null>(null);

  const allPoints = useMemo(() => Array.from({ length: PATH_LENGTH }, (_, i) => pos(i + 1)), []);
  const start = { x: W / 2, y: H - 60 };
  const end = { x: W / 2, y: 88 };
  const road = smooth([start, ...allPoints, end]);
  const walked = smooth([start, ...allPoints.slice(0, Math.max(1, avatarAt))]);

  // Centre the current circle in view.
  useLayoutEffect(() => {
    const sc = scroller.current;
    const map = mapRef.current;
    if (!sc || !map) return;
    const mapTop = map.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop;
    const target = pos(avatarAt).y;
    sc.scrollTop = Math.max(0, mapTop + target - sc.clientHeight * 0.62);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Walk the avatar forward, then reveal any unlocked message.
  useEffect(() => {
    let t1: number | undefined;
    let t2: number | undefined;
    if (avatarAt !== current) {
      t1 = window.setTimeout(() => {
        setAvatarAt(current);
        const sc = scroller.current;
        const map = mapRef.current;
        if (sc && map) {
          const mapTop = map.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop;
          sc.scrollTo({ top: Math.max(0, mapTop + pos(current).y - sc.clientHeight * 0.62), behavior: 'smooth' });
        }
      }, 450);
    }
    lastSeen[key] = current;
    if (pendingUnlock) t2 = window.setTimeout(revealUnlock, avatarAt !== current ? 1700 : 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, pendingUnlock]);

  useEffect(() => {
    if (hint === null) return;
    const t = setTimeout(() => setHint(null), 2400);
    return () => clearTimeout(t);
  }, [hint]);

  const av = pos(avatarAt);
  const dtl = daysToLanding(day);

  return (
    <div className="pb-6">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-navy px-5 pb-4 pt-6">
        <ScreenTitle kicker="Your training journey" title="Path Home" lesson={LESSONS.path} />
        <div className="-mt-1 mb-2.5 flex items-baseline justify-between">
          <span className="font-display text-[24px] font-bold text-white">
            <span className="text-red">{readyPct}%</span> ready
          </span>
          <span className="rounded-full bg-blue px-3 py-1.5 font-display text-[14px] font-bold text-white">
            {dtl} days to gravity
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-blue" aria-hidden>
          <div className="h-full rounded-full bg-red transition-[width] duration-700" style={{ width: `${readyPct}%` }} />
        </div>
        <p className="mt-3.5 font-display text-[16px] font-bold leading-snug text-white">
          Every workout brings you closer to walking to your family on your own.
        </p>
      </div>

      <div ref={mapRef} className="relative mx-auto mt-2" style={{ width: W, height: H, maxWidth: '100%' }}>
        <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
          {/* stars */}
          {STARS.map((s, i) => (
            <circle key={i} cx={s[0]} cy={s[1] * H} r={s[2]} fill="#FFFFFF" opacity={0.25 + (i % 3) * 0.12} />
          ))}
          <path d={road} fill="none" stroke="#0B3D91" strokeWidth="18" strokeLinecap="round" />
          <path d={road} fill="none" stroke="#1A4FA8" strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round" />
          <path d={walked} fill="none" stroke="#2BB673" strokeWidth="6" strokeLinecap="round" className="transition-all duration-700" />
        </svg>

        {/* House */}
        <div className="absolute flex flex-col items-center" style={{ left: W / 2 - 50, top: 0, width: 100 }}>
          <House size={100} />
          <span className="mt-1 font-display text-[13px] font-bold uppercase tracking-[0.14em] text-white">Home</span>
        </div>

        {/* Rocket */}
        <div className="absolute flex flex-col items-center" style={{ left: W / 2 - 40, top: H - 118, width: 80 }}>
          <Rocket size={44} />
          <span className="mt-1 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-mist">Day 0</span>
        </div>

        {allPoints.map((p, idx) => {
          const n = idx + 1;
          const isGift = GIFT_CIRCLES.includes(n);
          const isDone = n <= done;
          const isCurrent = n === current && done < PATH_LENGTH;
          const msg = profile.messages.find((m) => m.circle === n);
          const r = isGift ? 30 : 24;
          const labelLeft = p.x > W / 2;

          let cls = 'bg-[#3A4C6B] text-[#8C9BB5]';
          let icon = <IconLock size={17} />;
          if (isGift && !isDone) {
            cls = 'bg-red text-white';
            icon = <IconGift size={26} />;
          } else if (isGift && isDone) {
            cls = 'bg-stable text-white';
            icon = <IconGift size={24} />;
          } else if (isDone) {
            cls = 'bg-stable text-white';
            icon = <IconCheck size={20} />;
          } else if (isCurrent) {
            cls = 'bg-white text-navy';
            icon = <span className="font-display text-[15px] font-bold">{n}</span>;
          }

          return (
            <div key={n}>
              <button
                className={`absolute grid place-items-center rounded-full ${cls} ${isGift ? 'ring-4 ring-navy' : ''}`}
                style={{ left: p.x - r, top: p.y - r, width: r * 2, height: r * 2, ['--gift-ribbon' as string]: isDone ? '#1E8F57' : '#C42A14' }}
                aria-label={`Step ${n}${isGift ? ', family message' : ''}${isDone ? ', done' : isCurrent ? ', current' : ', locked'}`}
                onClick={() => {
                  if (isGift && isDone && msg) openMessage(msg);
                  else setHint(n);
                }}
              >
                {icon}
              </button>
              {isGift && (
                <div
                  className={`absolute w-[140px] ${labelLeft ? 'text-right' : 'text-left'}`}
                  style={{ top: p.y - 22, left: labelLeft ? p.x - r - 152 : p.x + r + 12 }}
                >
                  <div className="font-display text-[15px] font-bold leading-tight text-white">Family message</div>
                  <div className="text-[13px] leading-tight text-mist">
                    {isDone ? (isOpened(n) ? 'Tap to watch again' : 'Unlocked · tap to watch') : `${n - done} workout${n - done === 1 ? '' : 's'} away`}
                  </div>
                </div>
              )}
              {hint === n && !(isGift && isDone) && (
                <div
                  className="pop-in absolute z-10 whitespace-nowrap rounded-xl bg-white px-3 py-2 text-[13px] font-semibold text-navy"
                  style={{ top: p.y - r - 44, left: Math.min(W - 170, Math.max(0, p.x - 80)) }}
                >
                  {isDone ? `Step ${n} · done` : isCurrent ? 'You are here · finish a workout' : `Locked · ${n - done} workouts to go`}
                </div>
              )}
            </div>
          );
        })}

        {/* Avatar */}
        {done < PATH_LENGTH && (
          <div
            className="pointer-events-none absolute z-[5] transition-[left,top] duration-[900ms] ease-[cubic-bezier(.4,0,.2,1)]"
            style={{ left: av.x - 26, top: av.y - 26 }}
          >
            <div className="avatar-bob rounded-full ring-4 ring-red">
              <AstronautAvatar size={52} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Deterministic starfield: [x, yFraction, r]
const STARS: [number, number, number][] = Array.from({ length: 70 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12345.6789;
  return [Math.abs(a % 1) * W, Math.abs(b % 1), 0.8 + (i % 3) * 0.5];
});
