/**
 * MuscleMap demo data — everything is local, nothing leaves the device.
 *
 * Story (Anna): days 0–15 the legs look smaller because body fluid moves
 * up towards the head in weightlessness. The personal "space baseline" is set
 * on day 15. After that, calves slide to −5 % (day 40) and −8 % (day 60), then
 * recover to −4 % by day 94 thanks to the adjusted training plan.
 */

export type PartId = 'calves' | 'thighs' | 'back';
export type ProfileId = 'anna' | 'leo';
export type BodyModel = 'female' | 'male';

/** [day, value] keyframes; values between keyframes are interpolated. */
type Keys = [number, number][];

interface PartSeries {
  /** % change vs the space baseline (day 15). */
  pct: Keys;
  /** Strength on the exercise machine, kg. */
  strength: Keys;
  /** Circumference at the space baseline, cm. */
  baseCircumference: number;
  /** Segmental BIA resistance at the space baseline, ohm. */
  baseBia: number;
}

export interface FamilyMessage {
  circle: number;
  title: string;
  from: string;
  video: string;
  note: string;
}

export interface Profile {
  id: ProfileId;
  name: string;
  age: number;
  body: BodyModel;
  role: string;
  parts: Record<PartId, PartSeries>;
  messages: FamilyMessage[];
}

export const MISSION = {
  name: 'Mars Transit',
  landingDay: 115,
  baselineDay: 15,
  chartEndDay: 120,
};

export const DEMO_DAYS = [15, 40, 60, 94] as const;
export type DemoDay = (typeof DEMO_DAYS)[number];

/** Path Home: 30 circles, family messages on 5, 15 and 30. */
export const PATH_LENGTH = 30;
export const GIFT_CIRCLES = [5, 15, 30];

/** Workouts already completed on Path Home when the demo day starts. */
export const WORKOUTS_DONE_BY_DAY: Record<DemoDay, number> = {
  15: 3,
  40: 7,
  60: 10,
  94: 14,
};

export const PART_LABEL: Record<PartId, string> = {
  calves: 'Calves',
  thighs: 'Thighs',
  back: 'Back',
};

const anna: Profile = {
  id: 'anna',
  name: 'Anna',
  age: 34,
  body: 'female',
  role: 'Flight engineer',
  parts: {
    calves: {
      pct: [
        [0, 4], [8, 1.5], [15, 0], [21, -1.6], [28, -3.0], [33, -3.9], [40, -5.0],
        [47, -6.2], [53, -7.2], [60, -8.0], [66, -7.8], [73, -6.9], [80, -5.8],
        [87, -4.8], [94, -4.0], [101, -3.6], [108, -3.3], [115, -3.1], [120, -3.0],
      ],
      strength: [
        [0, 80], [15, 80], [21, 79.5], [28, 78], [33, 76.8], [40, 75], [50, 72],
        [60, 70], [73, 71.5], [80, 73], [94, 76], [120, 78],
      ],
      baseCircumference: 36.4,
      baseBia: 78.0,
    },
    thighs: {
      pct: [
        [0, 2.5], [8, 1.0], [15, 0], [28, -2.0], [33, -2.7], [40, -3.6], [47, -3.9],
        [53, -4.1], [60, -4.6], [66, -4.5], [73, -4.3], [80, -4.2], [87, -4.15],
        [94, -4.1], [108, -3.9], [120, -3.8],
      ],
      strength: [
        [0, 120], [15, 120], [40, 120], [47, 118], [53, 116.5], [60, 114], [80, 114],
        [94, 115], [120, 117],
      ],
      baseCircumference: 55.8,
      baseBia: 52.0,
    },
    back: {
      pct: [
        [0, 0.6], [15, 0], [28, -0.3], [40, -0.6], [60, -1.1], [80, -0.7], [94, -0.4],
        [120, -0.2],
      ],
      strength: [[0, 90], [15, 90], [40, 89], [60, 88], [94, 89], [120, 90]],
      baseCircumference: 84.0,
      baseBia: 24.0,
    },
  },
  messages: [
    {
      circle: 5,
      title: 'Five workouts in!',
      from: 'Dad',
      video: '/videos/family_first.mp4',
      note: 'Recorded in the garden, three weeks before launch.',
    },
    {
      circle: 15,
      title: 'You reached the halfway point!',
      from: 'Mom & Leo',
      video: '/videos/family_halfway.mp4',
      note: 'Leo insisted on holding the camera himself.',
    },
    {
      circle: 30,
      title: 'Ready to walk home.',
      from: 'Everyone at home',
      video: '/videos/family_home.mp4',
      note: 'Save this one for landing day.',
    },
  ],
};

const leo: Profile = {
  id: 'leo',
  name: 'Leo',
  age: 38,
  body: 'male',
  role: 'Mission commander',
  parts: {
    calves: {
      pct: [
        [0, 3.5], [8, 1.3], [15, 0], [21, -1.9], [28, -3.4], [33, -4.4], [40, -5.5],
        [47, -6.6], [53, -7.3], [60, -7.6], [66, -7.4], [73, -6.8], [80, -6.0],
        [87, -5.1], [94, -4.5], [101, -4.0], [108, -3.7], [115, -3.4], [120, -3.3],
      ],
      strength: [
        [0, 105], [15, 105], [21, 104], [28, 102], [33, 100.5], [40, 98], [50, 94],
        [60, 92], [73, 93.5], [80, 95.5], [94, 99], [120, 101],
      ],
      baseCircumference: 39.2,
      baseBia: 70.0,
    },
    thighs: {
      pct: [
        [0, 2.2], [8, 0.8], [15, 0], [28, -1.8], [33, -2.6], [40, -3.4], [47, -3.7],
        [53, -3.9], [60, -4.4], [66, -4.3], [73, -4.0], [80, -3.9], [87, -3.85],
        [94, -3.8], [108, -3.6], [120, -3.5],
      ],
      strength: [
        [0, 160], [15, 160], [40, 160], [47, 157], [53, 155], [60, 152], [80, 152],
        [94, 153], [120, 156],
      ],
      baseCircumference: 58.6,
      baseBia: 46.0,
    },
    back: {
      pct: [
        [0, 0.5], [15, 0], [28, -0.4], [40, -0.8], [60, -1.4], [80, -1.0], [94, -0.6],
        [120, -0.3],
      ],
      strength: [[0, 130], [15, 130], [40, 128], [60, 127], [94, 128], [120, 130]],
      baseCircumference: 98.0,
      baseBia: 21.0,
    },
  },
  messages: [
    {
      circle: 5,
      title: 'Five workouts in!',
      from: 'Sara',
      video: '/videos/family_first.mp4',
      note: 'Recorded on the porch, three weeks before launch.',
    },
    {
      circle: 15,
      title: 'You reached the halfway point!',
      from: 'Sara & the twins',
      video: '/videos/family_halfway.mp4',
      note: 'The twins wrote the script themselves.',
    },
    {
      circle: 30,
      title: 'Ready to walk home.',
      from: 'Everyone at home',
      video: '/videos/family_home.mp4',
      note: 'Save this one for landing day.',
    },
  ],
};

export const PROFILES: Record<ProfileId, Profile> = { anna, leo };

/* ------------------------------------------------------------------ */
/* Lookups                                                             */
/* ------------------------------------------------------------------ */

function interp(keys: Keys, day: number): number {
  if (day <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [d1, v1] = keys[i];
    if (day <= d1) {
      const [d0, v0] = keys[i - 1];
      return v0 + ((v1 - v0) * (day - d0)) / (d1 - d0);
    }
  }
  return keys[keys.length - 1][1];
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export interface Measurement {
  day: number;
  part: PartId;
  /** % change vs space baseline. */
  pct: number;
  circumference: number;
  bia: number;
  strength: number;
}

export function measure(profile: Profile, part: PartId, day: number): Measurement {
  const s = profile.parts[part];
  const pct = round1(interp(s.pct, day));
  return {
    day,
    part,
    pct,
    // Circumference follows roughly half of the volume change.
    circumference: round1(s.baseCircumference * (1 + pct / 200)),
    // Less muscle (and less fluid) means higher segment resistance.
    bia: round1(s.baseBia * (1 - (pct * 0.9) / 100)),
    strength: round1(interp(s.strength, day)),
  };
}

/** Weekly measurements (every 7 days, 0–119) plus day 120, plus the demo days. */
export function measurementDays(upTo: number): number[] {
  const days = new Set<number>();
  for (let d = 0; d <= MISSION.chartEndDay; d += 7) days.add(d);
  days.add(MISSION.chartEndDay);
  DEMO_DAYS.forEach((d) => days.add(d));
  days.add(MISSION.baselineDay);
  return [...days].filter((d) => d <= upTo).sort((a, b) => a - b);
}

export function history(profile: Profile, part: PartId, upTo: number): Measurement[] {
  return measurementDays(upTo).map((d) => measure(profile, part, d));
}
