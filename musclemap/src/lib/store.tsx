import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { GIFT_CIRCLES, PROFILES, type DemoDay, type FamilyMessage, type Profile, type ProfileId } from '../data/demoData';
import { pathProgress } from './rules';

export type Tab = 'scan' | 'body' | 'plan' | 'path' | 'progress';

interface Persisted {
  profileId: ProfileId;
  day: DemoDay;
  /** Exercise ids completed per `${profile}-${day}`. */
  completed: Record<string, string[]>;
  /** Gift circles whose message was opened or saved, per profile. */
  opened: Record<string, number[]>;
}

const KEY = 'musclemap-demo-v1';
const DEFAULTS: Persisted = { profileId: 'anna', day: 94, completed: {}, opened: {} };

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

interface Store {
  profile: Profile;
  day: DemoDay;
  tab: Tab;
  setTab: (t: Tab) => void;
  setDay: (d: DemoDay) => void;
  setProfile: (p: ProfileId) => void;
  completedToday: string[];
  markDone: (exerciseId: string) => void;
  progress: ReturnType<typeof pathProgress>;
  /** Message waiting to be shown full-screen. */
  unlocked: FamilyMessage | null;
  /** Ask Path Home to celebrate this message once the avatar arrives. */
  pendingUnlock: FamilyMessage | null;
  revealUnlock: () => void;
  closeUnlock: () => void;
  openMessage: (m: FamilyMessage) => void;
  isOpened: (circle: number) => boolean;
  resetDemo: () => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(load);
  const [tab, setTab] = useState<Tab>('scan');
  const [pendingUnlock, setPendingUnlock] = useState<FamilyMessage | null>(null);
  const [unlocked, setUnlocked] = useState<FamilyMessage | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* private mode — demo still works, just not remembered */
    }
  }, [state]);

  const profile = PROFILES[state.profileId];
  const dayKey = `${state.profileId}-${state.day}`;
  const completedToday = useMemo(() => state.completed[dayKey] ?? [], [state.completed, dayKey]);
  const progress = pathProgress(state.day, completedToday.length);

  const markDone = useCallback(
    (id: string) => {
      if (completedToday.includes(id)) return;
      const next = [...completedToday, id];
      const after = pathProgress(state.day, next.length);
      setState((s) => ({ ...s, completed: { ...s.completed, [dayKey]: next } }));
      if (GIFT_CIRCLES.includes(after.done) && after.done !== progress.done) {
        const msg = profile.messages.find((m) => m.circle === after.done) ?? null;
        setPendingUnlock(msg);
      }
    },
    [completedToday, dayKey, profile, progress.done, state.day],
  );

  const value: Store = {
    profile,
    day: state.day,
    tab,
    setTab,
    setDay: (day) => {
      setPendingUnlock(null);
      setState((s) => ({ ...s, day }));
    },
    setProfile: (profileId) => {
      setPendingUnlock(null);
      setState((s) => ({ ...s, profileId }));
    },
    completedToday,
    markDone,
    progress,
    unlocked,
    pendingUnlock,
    revealUnlock: () => {
      setUnlocked(pendingUnlock);
      setPendingUnlock(null);
    },
    closeUnlock: () => {
      if (unlocked) {
        const list = state.opened[state.profileId] ?? [];
        if (!list.includes(unlocked.circle)) {
          setState((s) => ({ ...s, opened: { ...s.opened, [s.profileId]: [...list, unlocked.circle] } }));
        }
      }
      setUnlocked(null);
    },
    openMessage: (m) => setUnlocked(m),
    isOpened: (c) => (state.opened[state.profileId] ?? []).includes(c),
    resetDemo: () => {
      setPendingUnlock(null);
      setUnlocked(null);
      setState((s) => ({ ...DEFAULTS, profileId: s.profileId }));
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore outside provider');
  return s;
}
