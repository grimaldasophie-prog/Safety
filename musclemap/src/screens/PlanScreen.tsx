import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { buildPlan, type PlanItem } from '../lib/rules';
import { GIFT_CIRCLES, PART_LABEL, PATH_LENGTH } from '../data/demoData';
import { LESSONS } from '../data/lessons';
import { Eyebrow, PrimaryButton, ScreenTitle, SheetPortal } from '../components/ui';
import { IconBack, IconCheck, IconChevron, IconPath } from '../components/Icons';
import { VideoPlayer } from '../components/VideoPlayer';

export default function PlanScreen() {
  const { profile, day, completedToday, setTab, progress } = useStore();
  const plan = buildPlan(profile, day);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const open = openIdx !== null ? plan.items[openIdx] ?? null : null;
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const doneCount = plan.items.filter((i) => completedToday.includes(i.exercise.id)).length;

  return (
    <div className="px-5 pb-10 pt-6">
      <ScreenTitle kicker={plan.kind === 'landing' ? `${plan.daysToLanding} days to gravity` : `Day ${day}`} title={plan.title} lesson={LESSONS.plan} />

      <div className="-mt-2 mb-5 flex items-center justify-between gap-3">
        <p className="text-[15px] leading-snug text-mist">{plan.subtitle}</p>
        <span className="shrink-0 rounded-full bg-blue px-3 py-1.5 font-display text-[13px] font-bold text-white">
          {doneCount}/{plan.items.length} done
        </span>
      </div>

      <ol className="space-y-3">
        {plan.items.map((item, i) => {
          const done = completedToday.includes(item.exercise.id);
          return (
            <li key={item.exercise.id}>
              <button
                onClick={() => setOpenIdx(i)}
                className={`flex w-full items-center gap-4 rounded-[20px] p-4 text-left transition-colors ${done ? 'bg-blue/50' : 'bg-blue hover:bg-blueHi'}`}
              >
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-[18px] font-bold ${
                    done ? 'bg-stable text-white' : 'bg-navy text-white'
                  }`}
                >
                  {done ? <IconCheck size={22} /> : `0${i + 1}`}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold uppercase tracking-[0.1em] text-mist">{PART_LABEL[item.exercise.part]}</span>
                  <span className={`mt-0.5 block font-display text-[19px] font-bold leading-tight ${done ? 'text-mist line-through decoration-2' : 'text-white'}`}>
                    {item.exercise.name}
                  </span>
                  <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="font-display text-[16px] font-bold text-white">
                      {item.sets} × {item.reps}
                    </span>
                    {item.loadKg && <span className="text-[14px] text-mist">· {item.loadKg} kg</span>}
                    {item.changes.map((c) => (
                      <Chip key={c} text={c} />
                    ))}
                  </span>
                </span>
                <IconChevron size={20} className="shrink-0 text-mist" />
              </button>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 border-l-[3px] border-red pl-3 text-[13px] leading-relaxed text-mist">
        Example thresholds. Real values would be set by the crew's medical specialists.
      </p>

      {open && (
        <ExerciseDetail
          item={open}
          index={openIdx ?? 0}
          onClose={() => setOpenIdx(null)}
          onDone={(gift) => {
            setOpenIdx(null);
            if (gift) setTab('path');
            else setToast(true);
          }}
        />
      )}

      <SheetPortal>
        <div
          className={`pointer-events-none absolute inset-x-4 bottom-[84px] z-30 transition-all duration-300 ${
            toast ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          role="status"
        >
          <button
            onClick={() => setTab('path')}
            className={`flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3.5 text-left text-navy ${toast ? 'pointer-events-auto' : ''}`}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-red text-white">
              <IconPath size={18} />
            </span>
            <span className="flex-1">
              <span className="block font-display text-[16px] font-bold">One step closer to home</span>
              <span className="block text-[13px] text-[#3A4A66]">
                Step {progress.done} of {PATH_LENGTH} · See Path Home
              </span>
            </span>
            <IconChevron size={18} />
          </button>
        </div>
      </SheetPortal>
    </div>
  );
}

function Chip({ text }: { text: string }) {
  const changed = text.startsWith('+') || text.startsWith('Added');
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[12px] font-semibold ${
        changed ? 'bg-red text-white' : 'bg-navy text-mist'
      }`}
    >
      {text}
    </span>
  );
}

function ExerciseDetail({
  item,
  index,
  onClose,
  onDone,
}: {
  item: PlanItem;
  index: number;
  onClose: () => void;
  onDone: (gift: boolean) => void;
}) {
  const { completedToday, markDone, progress } = useStore();
  const done = completedToday.includes(item.exercise.id);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(t);
  }, []);

  const ex = item.exercise;
  const nextIsGift = GIFT_CIRCLES.includes(progress.done + 1);

  return (
    <SheetPortal>
      <div
        className={`absolute inset-0 z-40 flex flex-col bg-navy transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${
          shown ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={ex.name}
      >
        <div className="flex items-center gap-2 px-3 pb-2 pt-[max(14px,env(safe-area-inset-top))]">
          <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full text-white hover:bg-white/10" aria-label="Back to plan">
            <IconBack size={22} />
          </button>
          <Eyebrow>Exercise {index + 1}</Eyebrow>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-6">
          <VideoPlayer src={ex.video} label={ex.name} tone="blue" />

          <div className="mt-5 text-[13px] font-semibold uppercase tracking-[0.1em] text-mist">{PART_LABEL[ex.part]}</div>
          <h2 className="mt-1 font-display text-[30px] font-bold leading-[1.05] tracking-[-0.02em] text-white">{ex.name}</h2>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Tile label="Sets" value={String(item.sets)} />
            <Tile label="Reps" value={item.reps} />
            <Tile label="Load" value={item.loadKg ? `${item.loadKg}` : '—'} unit={item.loadKg ? 'kg' : ''} />
          </div>

          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-[13px] font-semibold uppercase tracking-[0.1em] text-mist">Equipment</dt>
              <dd className="mt-1 text-[16px] text-white">{ex.equipment}</dd>
            </div>
            <div>
              <dt className="text-[13px] font-semibold uppercase tracking-[0.1em] text-mist">How</dt>
              <dd className="mt-1 text-[16px] leading-snug text-white">{ex.cue}</dd>
            </div>
            <div className="rounded-2xl bg-blue p-4">
              <dt className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-red">Why</dt>
              <dd className="mt-1 text-[17px] leading-snug text-white">{ex.why}</dd>
              {item.ruleNote && <dd className="mt-2 text-[14px] leading-snug text-mist">{item.ruleNote}</dd>}
            </div>
          </dl>
        </div>

        <div className="border-t border-white/10 px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
          {done ? (
            <div className="flex h-14 items-center justify-center gap-2 rounded-full bg-stable/15 font-display text-[17px] font-bold text-stable">
              <IconCheck size={20} /> Done today
            </div>
          ) : (
            <PrimaryButton
              onClick={() => {
                markDone(ex.id);
                onDone(nextIsGift);
              }}
            >
              Mark as done
              <span className="text-[14px] font-medium text-white/80">· +1 step home</span>
            </PrimaryButton>
          )}
        </div>
      </div>
    </SheetPortal>
  );
}

function Tile({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-2xl bg-blue px-3 py-3">
      <div className="text-[13px] text-mist">{label}</div>
      <div className="mt-0.5 font-display text-[26px] font-bold leading-none text-white">
        {value}
        {unit && <span className="ml-1 text-[14px] font-medium text-mist">{unit}</span>}
      </div>
    </div>
  );
}
