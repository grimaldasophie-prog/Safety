import { useEffect, useRef, useState } from 'react';
import { useStore } from '../lib/store';
import { assess, fmtPct, STATUS_COLOR } from '../lib/rules';
import { LESSONS } from '../data/lessons';
import { Eyebrow, PrimaryButton, ScreenTitle, StatusPill } from '../components/ui';
import { IconBluetooth, IconCheck, IconLock } from '../components/Icons';
import { LegOutline, SensorLeg } from '../components/Illustrations';

type Step = 'choose' | 'bia' | 'scan3d' | 'saved';
type Part = 'calves' | 'thighs';
const DURATION = 3000;

export default function ScanScreen() {
  const { profile, day } = useStore();
  const [step, setStep] = useState<Step>('choose');
  const [part, setPart] = useState<Part>('calves');

  // A new demo day or profile starts a fresh scan.
  useEffect(() => setStep('choose'), [day, profile.id]);

  return (
    <div className="px-5 pb-10 pt-6">
      <ScreenTitle kicker={`Day ${day} check-in`} title="Scan" lesson={LESSONS.scan} />

      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue px-3.5 py-2 text-[14px] text-white">
        <IconLock size={16} className="text-stable" />
        <span>
          <span className="font-semibold">Offline</span> · Data stays on this device
        </span>
      </div>

      <section className="rounded-[22px] bg-blue p-5">
        <Stepper step={step} />
        {step === 'choose' && <Choose part={part} setPart={setPart} onNext={() => setStep('bia')} />}
        {step === 'bia' && <Measure key="bia" kind="bia" part={part} onDone={() => setStep('scan3d')} />}
        {step === 'scan3d' && <Measure key="scan" kind="scan" part={part} onDone={() => setStep('saved')} />}
        {step === 'saved' && <Saved part={part} onAgain={() => setStep('choose')} />}
      </section>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border-2 border-white/10 px-4 py-3.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue text-white">
          <IconBluetooth size={18} />
        </span>
        <span className="flex-1 text-[15px] leading-snug text-white">
          Exercise machine
          <span className="block text-[13px] text-mist">Synced via Bluetooth · 07:40</span>
        </span>
        <span className="grid h-7 w-7 place-items-center rounded-full bg-stable text-white" aria-label="Synced">
          <IconCheck size={15} />
        </span>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const order: Step[] = ['choose', 'bia', 'scan3d', 'saved'];
  const idx = order.indexOf(step);
  const labels = ['Body part', 'BIA', '3D scan'];
  return (
    <ol className="mb-5 grid grid-cols-3 gap-2" aria-label="Scan steps">
      {labels.map((l, i) => {
        const done = i < idx;
        const active = i === idx;
        return (
          <li key={l}>
            <div className={`h-[5px] rounded-full ${done ? 'bg-stable' : active ? 'bg-red' : 'bg-white/15'}`} />
            <div className={`mt-2 text-[13px] font-semibold ${active ? 'text-white' : 'text-mist'}`}>
              {i + 1} · {l}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Choose({ part, setPart, onNext }: { part: Part; setPart: (p: Part) => void; onNext: () => void }) {
  const { profile, day } = useStore();
  return (
    <div>
      <h2 className="font-display text-[22px] font-bold text-white">What are we measuring?</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {(['calves', 'thighs'] as Part[]).map((p) => {
          const a = assess(profile, p, day);
          const active = p === part;
          return (
            <button
              key={p}
              onClick={() => setPart(p)}
              aria-pressed={active}
              className={`flex flex-col items-start rounded-2xl border-2 p-3 text-left transition-colors ${
                active ? 'border-white bg-navy' : 'border-white/15 hover:border-white/40'
              }`}
            >
              <LegOutline part={p} className="mx-auto h-[96px] w-[96px]" />
              <span className="mt-2 font-display text-[18px] font-bold text-white">{p === 'calves' ? 'Calves' : 'Thighs'}</span>
              <span className="mt-0.5 flex items-center gap-1.5 text-[13px] text-mist">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLOR[a.status] }} />
                Last week {fmtPct(a.weekAgo.pct)}
              </span>
            </button>
          );
        })}
      </div>
      <PrimaryButton className="mt-5" onClick={onNext}>
        Start measurement
      </PrimaryButton>
    </div>
  );
}

function Measure({ kind, part, onDone }: { kind: 'bia' | 'scan'; part: Part; onDone: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'running' | 'done'>('ready');
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const start = () => {
    setPhase('running');
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / DURATION);
      setProgress(p);
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else {
        setPhase('done');
        setTimeout(onDone, 650);
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const where = part === 'calves' ? 'calf' : 'thigh';
  const title = kind === 'bia' ? 'BIA measurement' : '3D scan';
  const instruction =
    kind === 'bia'
      ? `Place the two sensor pads on your ${where}. Hold still.`
      : `Move the tablet slowly around your ${where}.`;

  return (
    <div>
      <h2 className="font-display text-[22px] font-bold text-white">{title}</h2>
      <p className="mt-1.5 text-[16px] leading-snug text-mist">{instruction}</p>

      <div className="relative my-5 overflow-hidden rounded-2xl bg-navy py-4">
        {kind === 'bia' ? (
          <SensorLeg part={part} active={phase === 'running'} />
        ) : (
          <div className="relative mx-auto h-[230px] w-[180px]">
            <LegOutline part={part} className="h-full w-full" />
            {phase !== 'ready' && (
              <div className="pointer-events-none absolute inset-x-[-40px] inset-y-0">
                <div className="scan-line absolute inset-x-0 h-[3px] bg-red" style={{ top: `${scanY(progress)}%` }}>
                  <div className="absolute inset-x-0 top-[3px] h-10 bg-red/15" />
                </div>
              </div>
            )}
            {/* Corner brackets of the camera frame */}
            <svg className="absolute inset-[-14px] h-[calc(100%+28px)] w-[calc(100%+28px)]" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <path d="M2 14V2h12M86 2h12v12M98 86v12H86M14 98H2V86" fill="none" stroke="#C9D3E3" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        )}
        {phase === 'done' && (
          <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-stable px-3 py-1.5 text-[13px] font-semibold text-white">
            <IconCheck size={14} /> Done
          </div>
        )}
      </div>

      {phase === 'ready' ? (
        <PrimaryButton onClick={start}>{kind === 'bia' ? 'Start BIA' : 'Start scan'}</PrimaryButton>
      ) : (
        <div>
          <div className="h-3 overflow-hidden rounded-full bg-navy" role="progressbar" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-red" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-[14px] text-mist">
            <span>{phase === 'done' ? 'Measurement complete' : kind === 'bia' ? 'Measuring…' : 'Scanning…'}</span>
            <span className="font-display font-bold text-white">{Math.max(0, 3 - Math.floor(progress * 3))} s</span>
          </div>
        </div>
      )}
    </div>
  );
}

/** The scan line sweeps down, up, and down again over 3 s. */
function scanY(p: number) {
  const x = (p * 3) % 2;
  const y = x < 1 ? x : 2 - x;
  return y * 100;
}

function Saved({ part, onAgain }: { part: Part; onAgain: () => void }) {
  const { profile, day, setTab } = useStore();
  const a = assess(profile, part, day);
  const color = STATUS_COLOR[a.status];
  return (
    <div className="pop-in">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-stable text-white">
          <IconCheck size={16} />
        </span>
        <h2 className="font-display text-[22px] font-bold text-white">Saved</h2>
      </div>

      <div className="mt-4 flex items-end justify-between rounded-2xl bg-navy p-4">
        <div>
          <Eyebrow>{part === 'calves' ? 'Calves' : 'Thighs'} vs your baseline</Eyebrow>
          <div className="mt-1 font-display text-[44px] font-bold leading-none tracking-[-0.03em]" style={{ color }}>
            {fmtPct(a.now.pct)}
          </div>
        </div>
        <StatusPill status={a.status} />
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2">
        <Stat label="Circumference" value={`${a.now.circumference.toFixed(1)}`} unit="cm" />
        <Stat label="BIA" value={`${a.now.bia.toFixed(1)}`} unit="Ω" />
        <Stat label="Strength" value={`${a.now.strength.toFixed(0)}`} unit="kg" />
      </dl>

      <p className="mt-4 text-[16px] leading-snug text-white">{a.sentence}</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button onClick={onAgain} className="h-12 rounded-full border-2 border-white/30 font-display text-[15px] font-bold text-white hover:border-white/70">
          Scan again
        </button>
        <button onClick={() => setTab('body')} className="h-12 rounded-full bg-red font-display text-[15px] font-bold text-white">
          See body map
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="rounded-xl bg-navy px-3 py-2.5">
      <dt className="text-[12px] text-mist">{label}</dt>
      <dd className="mt-0.5 font-display text-[20px] font-bold text-white">
        {value}
        <span className="ml-0.5 text-[13px] font-medium text-mist">{unit}</span>
      </dd>
    </div>
  );
}
