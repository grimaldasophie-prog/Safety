import { useEffect, useRef, useState } from 'react';
import { DEMO_DAYS, MISSION, PROFILES, type ProfileId } from './data/demoData';
import { useStore, type Tab } from './lib/store';
import { SheetPortal as SheetPortalLocal, Wordmark, Sheet, Eyebrow, StatusPill, PrimaryButton, GhostButton } from './components/ui';
import { IconBody, IconChevron, IconGift, IconPath, IconPlan, IconProgress, IconRefresh, IconScan } from './components/Icons';
import { Confetti } from './components/Illustrations';
import { VideoPlayer, type VideoHandle } from './components/VideoPlayer';
import { assess } from './lib/rules';
import ScanScreen from './screens/ScanScreen';
import BodyScreen from './screens/BodyScreen';
import PlanScreen from './screens/PlanScreen';
import PathScreen from './screens/PathScreen';
import ProgressScreen from './screens/ProgressScreen';

const TABS: { id: Tab; label: string; Icon: typeof IconScan }[] = [
  { id: 'scan', label: 'Scan', Icon: IconScan },
  { id: 'body', label: 'Body', Icon: IconBody },
  { id: 'plan', label: 'Plan', Icon: IconPlan },
  { id: 'path', label: 'Path Home', Icon: IconPath },
  { id: 'progress', label: 'Progress', Icon: IconProgress },
];

export default function App() {
  const { tab } = useStore();
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Path Home positions itself on the avatar.
    if (tab !== 'path') scroller.current?.scrollTo({ top: 0 });
  }, [tab]);

  return (
    <div className="phone-stage">
      <div className="phone-frame">
        <div className="relative flex h-full flex-col overflow-hidden bg-navy">
          <TopBar />
          <main ref={scroller} id="scroller" className="relative flex-1 overflow-y-auto overflow-x-hidden">
            <div key={tab} className="screen-in">
              {tab === 'scan' && <ScanScreen />}
              {tab === 'body' && <BodyScreen />}
              {tab === 'plan' && <PlanScreen />}
              {tab === 'path' && <PathScreen scroller={scroller} />}
              {tab === 'progress' && <ProgressScreen />}
            </div>
          </main>
          <TabBar />
          <div id="overlay-root" />
          <UnlockOverlay />
        </div>
      </div>
      <aside className="stage-caption" aria-hidden>
        <div className="font-display text-[13px] font-bold uppercase tracking-[0.16em] text-red">Hackathon demo</div>
        <p className="mt-2 font-display text-[22px] font-bold leading-tight text-white">
          Every workout brings you closer to walking to your family on your own.
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-mist">
          Try the story: switch Day 15 → 40 → 60 → 94, then finish a workout on the Plan tab.
        </p>
      </aside>
    </div>
  );
}

/* ---------------- Top bar ---------------- */

function TopBar() {
  const { profile, day, setDay } = useStore();
  const [menu, setMenu] = useState(false);

  return (
    <header className="shrink-0 border-b border-white/10 bg-navy px-4 pb-3 pt-[max(12px,env(safe-area-inset-top))]">
      <div className="flex items-center justify-between">
        <Wordmark />
        <div className="flex items-center gap-2">
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-mist/70">Demo</span>
          <div role="radiogroup" aria-label="Demo day" className="flex rounded-full bg-blue p-[3px]">
            {DEMO_DAYS.map((d) => (
              <button
                key={d}
                role="radio"
                aria-checked={d === day}
                onClick={() => setDay(d)}
                className={`h-8 min-w-[36px] rounded-full px-2 font-display text-[14px] font-bold transition-colors ${
                  d === day ? 'bg-red text-white' : 'text-mist hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => setMenu(true)}
        className="mt-2.5 flex items-center gap-2 rounded-full py-1 pr-2 text-left"
        aria-label="Open profile menu"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white font-display text-[13px] font-bold text-navy">
          {profile.name[0]}
        </span>
        <span className="text-[15px] text-mist">
          <span className="font-semibold text-white">{profile.name}</span> · Day {day} · {MISSION.name}
        </span>
        <IconChevron size={16} className="rotate-90 text-mist" />
      </button>
      <ProfileMenu open={menu} onClose={() => setMenu(false)} />
    </header>
  );
}

function ProfileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile, setProfile, resetDemo, day } = useStore();

  return (
    <SheetPortalLocal>
      <Sheet open={open} onClose={onClose} label="Profile">
        <Eyebrow className="mb-3">Crew profile</Eyebrow>
        <div className="space-y-2.5">
          {(Object.keys(PROFILES) as ProfileId[]).map((id) => {
            const p = PROFILES[id];
            const active = id === profile.id;
            const calves = assess(p, 'calves', day);
            return (
              <button
                key={id}
                onClick={() => {
                  setProfile(id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3.5 text-left transition-colors ${
                  active ? 'border-white bg-navy' : 'border-white/15 hover:border-white/40'
                }`}
              >
                <span className={`grid h-11 w-11 place-items-center rounded-full font-display text-[18px] font-bold ${active ? 'bg-red text-white' : 'bg-white text-navy'}`}>
                  {p.name[0]}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-[18px] font-bold text-white">
                    {p.name}, {p.age}
                  </span>
                  <span className="block text-[14px] text-mist">
                    {p.role} · {p.body} body model
                  </span>
                </span>
                <StatusPill status={calves.status} small />
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl bg-navy p-4">
          <Eyebrow className="mb-2 text-red">Future</Eyebrow>
          <p className="text-[15px] leading-relaxed text-mist">
            Full-body scan · muscle stimulation planning · mood check-ins.
          </p>
        </div>

        <button
          onClick={() => {
            resetDemo();
            onClose();
          }}
          className="mt-4 flex items-center gap-2 py-2 text-[15px] text-mist hover:text-white"
        >
          <IconRefresh size={18} /> Reset demo
        </button>
      </Sheet>
    </SheetPortalLocal>
  );
}


/* ---------------- Tab bar ---------------- */

function TabBar() {
  const { tab, setTab } = useStore();
  return (
    <nav className="shrink-0 border-t border-white/10 bg-navy pb-[max(6px,env(safe-area-inset-bottom))]" aria-label="Main">
      <ul className="grid grid-cols-5">
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <li key={id}>
              <button
                onClick={() => setTab(id)}
                aria-current={active ? 'page' : undefined}
                className="relative flex h-[62px] w-full flex-col items-center justify-center gap-1"
              >
                <span className={`absolute top-0 h-[3px] w-8 rounded-b bg-red transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`} />
                <Icon size={24} className={active ? 'text-red' : 'text-mist'} />
                <span className={`text-[11.5px] font-semibold ${active ? 'text-white' : 'text-mist'}`}>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------------- Message unlocked ---------------- */

function UnlockOverlay() {
  const { unlocked, closeUnlock } = useStore();
  const player = useRef<VideoHandle>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (unlocked) {
      const t = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(t);
    }
    setVisible(false);
  }, [unlocked]);

  if (!unlocked) return null;
  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col overflow-y-auto bg-navy px-6 pb-8 pt-12 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Message unlocked"
    >
      <Confetti />
      <div className="relative flex flex-1 flex-col">
        <div className="pop-in mx-auto grid h-24 w-24 place-items-center rounded-full bg-red text-white" style={{ ['--gift-ribbon' as string]: '#0B3D91' }}>
          <IconGift size={46} />
        </div>
        <Eyebrow className="mt-6 text-center text-red">Message unlocked</Eyebrow>
        <h2 className="mt-2 text-center font-display text-[32px] font-bold leading-[1.05] tracking-[-0.02em] text-white">
          {unlocked.title}
        </h2>
        <p className="mt-2 text-center text-[17px] text-mist">
          Message from <span className="font-semibold text-white">{unlocked.from}</span>
        </p>

        <div className="mt-7">
          <VideoPlayer ref={player} src={unlocked.video} label={`Message from ${unlocked.from}`} tone="blue" />
          <p className="mt-3 text-center text-[14px] text-mist">{unlocked.note}</p>
        </div>

        <div className="mt-auto space-y-3 pt-8">
          <PrimaryButton onClick={() => player.current?.play()}>
            Watch now
          </PrimaryButton>
          <GhostButton onClick={closeUnlock}>Save for later</GhostButton>
        </div>
      </div>
    </div>
  );
}
