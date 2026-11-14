import type { BodyModel, PartId } from '../data/demoData';
import { STATUS_COLOR, type Status } from '../lib/rules';

const NEUTRAL = '#2A5299';
const NEUTRAL_DARK = '#1A3C7A';

interface Shapes {
  torso: string;
  backMuscle: string;
  arm: string;
  thigh: string;
  calf: string;
  foot: string;
  shoulderX: number;
}

const FEMALE: Shapes = {
  torso:
    'M57 64 Q80 58 103 64 Q111 67 109 80 L103 108 Q99 126 100 140 Q105 160 108 178 L108 192 L52 192 L52 178 Q55 160 60 140 Q61 126 57 108 L51 80 Q49 67 57 64 Z',
  backMuscle: 'M60 72 Q80 66 100 72 L98 104 Q96 122 80 128 Q64 122 62 104 Z',
  arm: 'M53 72 L42 128 L39 182',
  thigh: 'M53 184 C51 216 56 252 63 280 L77.5 280 C78.5 252 79 216 79 184 Z',
  calf: 'M63 287 C55 300 57 328 64.5 370 L74 370 C77 330 79 302 77.5 287 Z',
  foot: 'M63 374 L75 374 L76 384 Q66 389 55 385 Q57 378 63 374 Z',
  shoulderX: 53,
};

const MALE: Shapes = {
  torso:
    'M52 62 Q80 56 108 62 Q120 66 118 82 L111 110 Q103 126 101 142 Q102 162 104 182 L104 192 L56 192 L56 182 Q58 162 59 142 Q57 126 49 110 L42 82 Q40 66 52 62 Z',
  backMuscle: 'M54 70 Q80 63 106 70 L101 104 Q94 124 80 130 Q66 124 59 104 Z',
  arm: 'M47 70 L36 128 L34 182',
  thigh: 'M51 184 C48 216 54 254 62 281 L78 281 C79 254 79 216 79 184 Z',
  calf: 'M62 288 C53 302 55 330 63.5 370 L74 370 C78 330 79 302 77.5 288 Z',
  foot: 'M62 374 L75 374 L76 384 Q65 389 53 385 Q56 378 62 374 Z',
  shoulderX: 47,
};

const mirror = 'translate(160 0) scale(-1 1)';

export function BodyFigure({
  model,
  view,
  statuses,
  selected,
  onSelect,
  className = '',
}: {
  model: BodyModel;
  view: 'front' | 'back';
  statuses: Record<PartId, Status>;
  selected: PartId | null;
  onSelect: (p: PartId) => void;
  className?: string;
}) {
  const s = model === 'female' ? FEMALE : MALE;

  const part = (id: PartId, d: string, extra?: { transform?: string; key?: string }) => {
    const isSel = selected === id;
    return (
      <path
        key={extra?.key ?? id}
        d={d}
        transform={extra?.transform}
        fill={STATUS_COLOR[statuses[id]]}
        stroke={isSel ? '#FFFFFF' : 'none'}
        strokeWidth={isSel ? 3 : 0}
        strokeLinejoin="round"
        className="cursor-pointer transition-[fill] duration-500 focus:outline-none"
        role="button"
        tabIndex={0}
        aria-label={`${id} — ${statuses[id]}`}
        onClick={() => onSelect(id)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(id)}
      />
    );
  };

  return (
    <svg viewBox="0 0 160 396" className={className} role="img" aria-label={`${model} body, ${view} view`}>
      {/* Hair behind head */}
      {model === 'female' ? (
        view === 'front' ? (
          <path d="M61 42 C58 18 70 9 80 9 C90 9 102 18 99 42 L100 58 C95 56 93 50 93 44 L67 44 C67 50 65 56 60 58 Z" fill={NEUTRAL_DARK} />
        ) : (
          <path d="M61 40 C58 16 70 9 80 9 C90 9 102 16 99 40 L100 58 Q80 64 60 58 Z" fill={NEUTRAL_DARK} />
        )
      ) : null}

      {/* Neck */}
      <rect x="73" y="46" width="14" height="18" rx="3" fill={NEUTRAL} />

      {/* Head */}
      {view === 'front' || model === 'male' ? <ellipse cx="80" cy="33" rx="15" ry="18" fill={NEUTRAL} /> : null}
      {model === 'female' && view === 'front' && (
        <path d="M65 30 C66 16 74 12 80 12 C88 12 96 17 95 30 C88 24 76 26 65 30 Z" fill={NEUTRAL_DARK} />
      )}
      {model === 'male' && (
        <path
          d={view === 'front' ? 'M65 30 C64 18 72 13 80 13 C89 13 96 18 95 30 C90 22 72 22 65 30 Z' : 'M65 36 C63 18 72 13 80 13 C88 13 97 18 95 36 Q80 42 65 36 Z'}
          fill={NEUTRAL_DARK}
        />
      )}

      {/* Arms */}
      <g fill="none" stroke={NEUTRAL} strokeWidth={model === 'male' ? 14 : 12} strokeLinecap="round" strokeLinejoin="round">
        <path d={s.arm} />
        <path d={s.arm} transform={mirror} />
      </g>

      {/* Torso */}
      <path d={s.torso} fill={NEUTRAL} />
      {view === 'back' && (
        <>
          {part('back', s.backMuscle)}
          <path d="M80 70 L80 182" stroke={NEUTRAL_DARK} strokeWidth="2" strokeDasharray="3 4" opacity="0.8" pointerEvents="none" />
        </>
      )}

      {/* Legs */}
      {part('thighs', s.thigh, { key: 'thigh-l' })}
      {part('thighs', s.thigh, { key: 'thigh-r', transform: mirror })}
      {part('calves', s.calf, { key: 'calf-l' })}
      {part('calves', s.calf, { key: 'calf-r', transform: mirror })}

      {/* Feet */}
      <path d={s.foot} fill={NEUTRAL} />
      <path d={s.foot} fill={NEUTRAL} transform={mirror} />
    </svg>
  );
}
