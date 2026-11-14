import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IconClose, IconInfo } from './Icons';
import { STATUS_COLOR, STATUS_LABEL, type Status } from '../lib/rules';

/* ---------------- Wordmark ---------------- */

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <circle cx="16" cy="16" r="9" fill="#FC3D21" />
      <ellipse cx="16" cy="16" rx="15" ry="5.2" fill="none" stroke="#fff" strokeWidth="2.2" transform="rotate(-22 16 16)" />
      <path d="M7 16a9 9 0 0 1 18 0" fill="#FC3D21" />
      <circle cx="28.3" cy="11" r="2.2" fill="#fff" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <div className="flex items-center gap-2">
      <Logo />
      <span className="font-display text-[21px] font-bold leading-none tracking-[-0.02em] text-white">
        Muscle<span className="text-red">Map</span>
      </span>
    </div>
  );
}

/* ---------------- Status ---------------- */

export function StatusPill({ status, small }: { status: Status; small?: boolean }) {
  const dark = status === 'watch';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-display font-bold uppercase tracking-[0.08em] ${
        small ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'
      }`}
      style={{ background: STATUS_COLOR[status], color: dark ? '#0B1D3A' : '#fff' }}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`font-display text-[12px] font-bold uppercase tracking-[0.14em] text-mist ${className}`}>
      {children}
    </div>
  );
}

/** Retro double rule: a thick red line over a thin white one. */
export function Stripe({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-[3px] ${className}`} aria-hidden>
      <div className="h-[4px] w-10 bg-red" />
      <div className="h-[2px] w-10 bg-white/80" />
    </div>
  );
}

/* ---------------- Screen header ---------------- */

export function ScreenTitle({
  title,
  kicker,
  lesson,
  right,
}: {
  title: string;
  kicker?: string;
  lesson?: Lesson;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div>
        {kicker && <Eyebrow className="mb-2">{kicker}</Eyebrow>}
        <h1 className="font-display text-[30px] font-bold leading-[1.05] tracking-[-0.02em] text-white">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2 pt-1">
        {right}
        {lesson && <InfoButton lesson={lesson} />}
      </div>
    </div>
  );
}

/* ---------------- Bottom sheet ---------------- */

export function Sheet({
  open,
  onClose,
  children,
  label,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
}) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const t = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(t);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), 260);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!mounted) return null;
  return (
    <div className="absolute inset-0 z-40" role="dialog" aria-modal="true" aria-label={label}>
      <button
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 bg-[#050E1F]/70 transition-opacity duration-200 ${shown ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 max-h-[88%] overflow-y-auto rounded-t-[26px] bg-blue px-6 pb-8 pt-3 transition-transform duration-[260ms] ease-[cubic-bezier(.2,.8,.2,1)] ${
          shown ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto mb-4 h-1.5 w-11 rounded-full bg-white/25" />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-mist hover:bg-white/10"
        >
          <IconClose size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}

/* ---------------- Mini lessons ---------------- */

export interface Lesson {
  title: string;
  body: string[];
}

export function InfoButton({ lesson }: { lesson: Lesson }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Learn: ${lesson.title}`}
        className="grid h-10 w-10 place-items-center rounded-full border-2 border-white/25 text-white transition-colors hover:border-white/60"
      >
        <IconInfo size={20} />
      </button>
      <LessonSheet lesson={lesson} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function LessonSheet({ lesson, open, onClose }: { lesson: Lesson; open: boolean; onClose: () => void }) {
  // Rendered through the nearest positioned ancestor (the phone frame).
  return (
    <SheetPortal>
      <Sheet open={open} onClose={onClose} label={lesson.title}>
        <Eyebrow className="mb-2 text-red">Mini lesson</Eyebrow>
        <h2 className="mb-4 pr-8 font-display text-[24px] font-bold leading-tight text-white">{lesson.title}</h2>
        <div className="space-y-3 text-[16px] leading-relaxed text-mist">
          {lesson.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Sheet>
    </SheetPortal>
  );
}

export function SheetPortal({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<HTMLElement | null>(null);
  useEffect(() => setTarget(document.getElementById('overlay-root')), []);
  return target ? createPortal(children, target) : null;
}

/* ---------------- Buttons ---------------- */

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-full bg-red font-display text-[17px] font-bold text-white transition-transform active:scale-[0.98] disabled:bg-white/15 disabled:text-mist ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-14 w-full items-center justify-center gap-2 rounded-full border-2 border-white/30 font-display text-[17px] font-bold text-white transition-colors hover:border-white/70 ${className}`}
    >
      {children}
    </button>
  );
}
