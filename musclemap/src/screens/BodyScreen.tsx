import { useState } from 'react';
import { useStore } from '../lib/store';
import { assess, fmtPct, STATUS_COLOR, STATUS_LABEL, type Status } from '../lib/rules';
import { PART_LABEL, type PartId } from '../data/demoData';
import { LESSONS } from '../data/lessons';
import { BodyFigure } from '../components/BodyFigure';
import { Eyebrow, ScreenTitle, Sheet, SheetPortal, StatusPill } from '../components/ui';

export default function BodyScreen() {
  const { profile, day } = useStore();
  const [selected, setSelected] = useState<PartId | null>(null);

  const parts: PartId[] = ['calves', 'thighs', 'back'];
  const a = Object.fromEntries(parts.map((p) => [p, assess(profile, p, day)])) as Record<PartId, ReturnType<typeof assess>>;
  const statuses = Object.fromEntries(parts.map((p) => [p, a[p].status])) as Record<PartId, Status>;
  const sel = selected ? a[selected] : null;

  return (
    <div className="px-5 pb-10 pt-6">
      <ScreenTitle kicker="Compared with your own baseline" title="Body" lesson={LESSONS.body} />

      <section className="rounded-[22px] bg-blue px-3 pb-4 pt-5">
        <div className="grid grid-cols-2">
          {(['front', 'back'] as const).map((view) => (
            <figure key={view} className="flex flex-col items-center">
              <BodyFigure
                model={profile.body}
                view={view}
                statuses={statuses}
                selected={selected}
                onSelect={setSelected}
                className="h-[330px] w-auto"
              />
              <figcaption className="mt-2 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-mist">{view}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-3 text-center text-[15px] text-white">Tap a coloured part to see details</p>
      </section>

      <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3" aria-label="Legend">
        <Legend color={STATUS_COLOR.stable} label="Stable" range="0 to −3 %" />
        <Legend color={STATUS_COLOR.watch} label="Watch" range="−3 to −7 %" />
        <Legend color={STATUS_COLOR.losing} label="Losing" range="below −7 %" />
        <Legend color="#2A5299" label="Not measured" range="" />
      </ul>

      <SheetPortal>
        <Sheet open={!!sel} onClose={() => setSelected(null)} label={sel ? PART_LABEL[sel.part] : 'Body part'}>
          {sel && (
            <div>
              <Eyebrow className="mb-1">Day {day} · vs baseline</Eyebrow>
              <h2 className="font-display text-[28px] font-bold text-white">{PART_LABEL[sel.part]}</h2>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-navy p-4">
                <span className="font-display text-[44px] font-bold leading-none tracking-[-0.03em]" style={{ color: STATUS_COLOR[sel.status] }}>
                  {fmtPct(sel.now.pct)}
                </span>
                <StatusPill status={sel.status} />
              </div>
              <p className="mt-4 text-[17px] leading-snug text-white">{sel.sentence}</p>
              <p className="mt-3 text-[14px] text-mist">
                {STATUS_LABEL[sel.status]} · strength {sel.now.strength.toFixed(0)} kg · circumference {sel.now.circumference.toFixed(1)} cm
              </p>
            </div>
          )}
        </Sheet>
      </SheetPortal>
    </div>
  );
}

function Legend({ color, label, range }: { color: string; label: string; range: string }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="h-4 w-4 shrink-0 rounded-[4px]" style={{ background: color }} />
      <span className="text-[15px] text-white">
        {label}
        {range && <span className="ml-1.5 text-[13px] text-mist">{range}</span>}
      </span>
    </li>
  );
}
