/**
 * MuscleMap rules engine — the single source of truth for every screen.
 *
 * Example thresholds only. Real values would be set by the crew's medical
 * specialists.
 */
import {
  GIFT_CIRCLES,
  MISSION,
  PATH_LENGTH,
  PART_LABEL,
  WORKOUTS_DONE_BY_DAY,
  measure,
  type DemoDay,
  type Measurement,
  type PartId,
  type Profile,
} from '../data/demoData';

export type Status = 'stable' | 'watch' | 'losing';

export const STATUS_LABEL: Record<Status, string> = {
  stable: 'Stable',
  watch: 'Watch',
  losing: 'Losing',
};

export const STATUS_COLOR: Record<Status, string> = {
  stable: '#2BB673',
  watch: '#F5B700',
  losing: '#FC3D21',
};

/** 0 % to −3 % stable · −3 % to −7 % watch · below −7 % losing. */
export function statusFor(pct: number): Status {
  if (pct > -3) return 'stable';
  if (pct >= -7) return 'watch';
  return 'losing';
}

const SCAN_DROP = -0.3; // % points in 7 days
const STRENGTH_DROP = 0.01; // 1 % in 7 days
const IMPROVEMENT = 0.3; // % points in 14 days
export const LANDING_PREP_DAYS = 21;

export interface Assessment {
  part: PartId;
  now: Measurement;
  weekAgo: Measurement;
  status: Status;
  scanDropped: boolean;
  strengthDropped: boolean;
  /** Scan dropped while strength held — most likely fluid, not muscle. */
  fluidShift: boolean;
  noImprovement14: boolean;
  /** One plain-language sentence for the astronaut. */
  sentence: string;
  /** Short caption for the trend chart. */
  trendCaption: string;
}

export function assess(profile: Profile, part: PartId, day: number): Assessment {
  const now = measure(profile, part, day);
  const weekAgo = measure(profile, part, Math.max(0, day - 7));
  const twoWeeksAgo = measure(profile, part, Math.max(0, day - 14));
  const status = statusFor(now.pct);
  const scanDropped = now.pct - weekAgo.pct <= SCAN_DROP;
  const strengthDropped = now.strength < weekAgo.strength * (1 - STRENGTH_DROP);
  const fluidShift = scanDropped && !strengthDropped;
  const noImprovement14 = now.pct - twoWeeksAgo.pct < IMPROVEMENT;
  const improving = now.pct - twoWeeksAgo.pct >= IMPROVEMENT;

  const name = PART_LABEL[part];
  let sentence: string;
  if (fluidShift) {
    sentence = `Your ${name.toLowerCase()} measure smaller, but your strength hasn't changed. Probably fluid shift. Scan again in 7 days.`;
  } else if (status === 'losing') {
    sentence = `Your ${name.toLowerCase()} have lost more than 7 % since your space baseline. Today's plan adds an extra exercise to win it back.`;
  } else if (status === 'watch' && improving) {
    sentence = `Your ${name.toLowerCase()} are coming back. Keep the routine — it's working.`;
  } else if (status === 'watch') {
    sentence = `Your ${name.toLowerCase()} are a little smaller than your baseline. Steady training keeps it from going further.`;
  } else {
    sentence = `Your ${name.toLowerCase()} are holding steady. Nothing to change.`;
  }

  let trendCaption: string;
  if (day <= MISSION.baselineDay) {
    trendCaption = 'Fluid shift period. Your space baseline is set today.';
  } else if (status === 'stable') {
    trendCaption = `Holding close to your baseline (${fmtPct(now.pct)}).`;
  } else if (improving) {
    trendCaption = `Recovering: up ${(now.pct - twoWeeksAgo.pct).toFixed(1)} points in two weeks.`;
  } else {
    trendCaption = `Down ${Math.abs(now.pct).toFixed(1)} % since day ${MISSION.baselineDay}. The plan is adjusted for this.`;
  }

  return {
    part,
    now,
    weekAgo,
    status,
    scanDropped,
    strengthDropped,
    fluidShift,
    noImprovement14,
    sentence,
    trendCaption,
  };
}

export function fmtPct(n: number): string {
  if (n === 0) return '0.0 %';
  return `${n > 0 ? '+' : '−'}${Math.abs(n).toFixed(1)} %`;
}

/* ------------------------------------------------------------------ */
/* Training plan                                                       */
/* ------------------------------------------------------------------ */

export interface Exercise {
  id: string;
  name: string;
  part: PartId;
  sets: number;
  reps: string;
  loadKg?: number;
  loadStepKg?: number;
  equipment: string;
  why: string;
  video: string;
  cue: string;
}

export const EXERCISES: Record<string, Exercise> = {
  calf_raises: {
    id: 'calf_raises',
    name: 'Calf raises',
    part: 'calves',
    sets: 2,
    reps: '15',
    loadKg: 40,
    loadStepKg: 5,
    equipment: 'Resistance device · calf platform',
    why: 'Calves lose strength fastest in space — on Earth they work with every single step.',
    video: '/videos/ex_calf_raises.mp4',
    cue: 'Rise slowly onto your toes, hold one second, lower for three.',
  },
  single_leg_calf_raises: {
    id: 'single_leg_calf_raises',
    name: 'Single-leg calf raises',
    part: 'calves',
    sets: 3,
    reps: '10',
    loadKg: 25,
    loadStepKg: 5,
    equipment: 'Resistance device · single-foot plate',
    why: 'One leg at a time means the stronger side can’t do the weaker side’s work.',
    video: '/videos/ex_single_leg_calf_raises.mp4',
    cue: 'Keep the knee soft. Same tempo on both legs.',
  },
  squats: {
    id: 'squats',
    name: 'Squats on resistance device',
    part: 'thighs',
    sets: 2,
    reps: '10',
    loadKg: 60,
    loadStepKg: 5,
    equipment: 'Resistance device · shoulder harness',
    why: 'Your thighs lift you out of the seat on landing day. Squats keep that first stand easy.',
    video: '/videos/ex_squats.mp4',
    cue: 'Feet hip-width, sit back until thighs are level, drive up through the heels.',
  },
  split_squats: {
    id: 'split_squats',
    name: 'Split squats',
    part: 'thighs',
    sets: 3,
    reps: '8',
    loadKg: 30,
    loadStepKg: 5,
    equipment: 'Resistance device · shoulder harness',
    why: 'Split stance trains each thigh on its own, like climbing stairs.',
    video: '/videos/ex_split_squats.mp4',
    cue: 'Long stance, back knee towards the floor, front knee over the toes.',
  },
  deadlifts: {
    id: 'deadlifts',
    name: 'Deadlifts',
    part: 'back',
    sets: 2,
    reps: '8',
    loadKg: 70,
    loadStepKg: 5,
    equipment: 'Resistance device · bar',
    why: 'A strong back protects your spine when gravity comes back.',
    video: '/videos/ex_deadlifts.mp4',
    cue: 'Flat back, hinge at the hips, stand tall at the top.',
  },
  balance_stand: {
    id: 'balance_stand',
    name: 'Balance stand',
    part: 'calves',
    sets: 3,
    reps: '45 s',
    equipment: 'Foot loops · eyes open, then closed',
    why: 'Your balance system needs to relearn “down” before you walk on Mars.',
    video: '/videos/ex_balance_stand.mp4',
    cue: 'Stand on one foot, loops loose. Switch legs each set.',
  },
  sit_to_stand: {
    id: 'sit_to_stand',
    name: 'Sit-to-stand',
    part: 'thighs',
    sets: 3,
    reps: '12',
    loadKg: 50,
    loadStepKg: 5,
    equipment: 'Resistance device · seat attachment',
    why: 'Practise the exact move of standing up from your landing seat.',
    video: '/videos/ex_sit_to_stand.mp4',
    cue: 'Arms crossed, stand up in one smooth move, sit down slowly.',
  },
};

const PRIMARY: Record<PartId, string> = {
  calves: 'calf_raises',
  thighs: 'squats',
  back: 'deadlifts',
};
const SECONDARY: Record<PartId, string> = {
  calves: 'single_leg_calf_raises',
  thighs: 'split_squats',
  back: 'deadlifts',
};

export interface PlanItem {
  exercise: Exercise;
  sets: number;
  reps: string;
  loadKg?: number;
  /** Short rule chips shown on the card, e.g. "+1 set". */
  changes: string[];
  /** Longer note shown in the detail view. */
  ruleNote?: string;
}

export interface Plan {
  kind: 'standard' | 'landing';
  title: string;
  subtitle: string;
  items: PlanItem[];
  daysToLanding: number;
}

export function daysToLanding(day: number) {
  return Math.max(0, MISSION.landingDay - day);
}

function landingCountdown(days: number) {
  return days <= 1 ? 'Landing prep starts tomorrow.' : `Landing prep starts in ${days} days.`;
}

export function buildPlan(profile: Profile, day: number): Plan {
  const dtl = daysToLanding(day);

  if (dtl < LANDING_PREP_DAYS) {
    const items: PlanItem[] = ['balance_stand', 'sit_to_stand', 'calf_raises'].map((id) => {
      const ex = EXERCISES[id];
      return {
        exercise: ex,
        sets: ex.sets,
        reps: ex.reps,
        loadKg: ex.loadKg,
        changes: ['Landing prep'],
        ruleNote: `Fewer than ${LANDING_PREP_DAYS} days to landing, so the plan switches to standing, balance and stepping.`,
      };
    });
    return {
      kind: 'landing',
      title: 'Landing prep',
      subtitle: `${dtl} days to gravity. Training for your first steps.`,
      items,
      daysToLanding: dtl,
    };
  }

  const items: PlanItem[] = [];
  const front: PlanItem[] = [];

  (['calves', 'thighs', 'back'] as PartId[]).forEach((part) => {
    const a = assess(profile, part, day);
    // Back is only trained here if it needs attention; otherwise it's covered by the daily routine.
    if (part === 'back' && a.status === 'stable') return;

    const ex = EXERCISES[PRIMARY[part]];
    const item: PlanItem = { exercise: ex, sets: ex.sets, reps: ex.reps, loadKg: ex.loadKg, changes: [] };
    const bothDropped = a.scanDropped && a.strengthDropped;

    if (a.fluidShift) {
      item.changes.push('Fluid shift · no change');
      item.ruleNote = 'Scan dropped but strength held steady. Probably fluid shift. Scan again in 7 days.';
    } else if (bothDropped && a.status === 'losing') {
      item.sets += 1;
      item.changes.push('+1 set');
      const ex2 = EXERCISES[SECONDARY[part]];
      front.push({
        exercise: ex2,
        sets: ex2.sets,
        reps: ex2.reps,
        loadKg: ex2.loadKg,
        changes: ['Added today'],
        ruleNote: `${PART_LABEL[part]} are below −7 % and strength dropped too, so a second exercise was added and put first.`,
      });
      item.ruleNote = `${PART_LABEL[part]} scan and strength both dropped this week.`;
    } else if (bothDropped && a.status === 'watch') {
      item.sets += 1;
      item.changes.push('+1 set');
      item.ruleNote = `${PART_LABEL[part]} scan and strength both dropped this week, so one extra set was added.`;
    } else if (a.status !== 'stable' && a.noImprovement14 && item.loadKg && ex.loadStepKg) {
      item.loadKg += ex.loadStepKg;
      item.changes.push(`+${ex.loadStepKg} kg`);
      item.ruleNote = `No improvement in 14 days, so the load goes up one step to ${item.loadKg} kg.`;
    }
    items.push(item);
  });

  const all = [...front, ...items].slice(0, 3);
  return {
    kind: 'standard',
    title: "Today's plan",
    subtitle:
      dtl - LANDING_PREP_DAYS <= 14
        ? landingCountdown(dtl - LANDING_PREP_DAYS + 1)
        : 'Built from this morning’s scan and machine data.',
    items: all,
    daysToLanding: dtl,
  };
}

/* ------------------------------------------------------------------ */
/* Path Home                                                           */
/* ------------------------------------------------------------------ */

export function pathProgress(day: DemoDay, completedToday: number) {
  const done = Math.min(PATH_LENGTH, WORKOUTS_DONE_BY_DAY[day] + completedToday);
  const current = Math.min(PATH_LENGTH, done + 1);
  const readyPct = Math.round((done / PATH_LENGTH) * 100);
  const nextGift = GIFT_CIRCLES.find((g) => g > done) ?? null;
  return { done, current, readyPct, nextGift };
}
