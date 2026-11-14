import type { Lesson } from '../components/ui';

export const LESSONS: Record<'scan' | 'body' | 'plan' | 'path' | 'progress', Lesson> = {
  scan: {
    title: 'What BIA and the 3D scan measure',
    body: [
      'BIA sends a tiny, harmless current between two sensor pads. Muscle is full of water and lets the current through easily, so when muscle shrinks the resistance goes up.',
      'The 3D scan measures the shape and size of your leg from the tablet camera. Together with your strength on the exercise machine, MuscleMap can tell real muscle loss apart from fluid moving around.',
    ],
  },
  body: {
    title: 'Why muscles shrink in space',
    body: [
      'In weightlessness your legs don’t have to carry you, so the body stops investing in them. Without daily training, astronauts can lose up to 20 % of leg muscle on a six-month mission.',
      'That’s why MuscleMap watches each body part separately and compares it only with you.',
    ],
  },
  plan: {
    title: 'Why calves matter most',
    body: [
      'Calves are the muscles that lose strength fastest in space. On Earth they work with every step and keep you balanced.',
      'Strong calves are what let you walk off the spacecraft on Mars on your own.',
    ],
  },
  path: {
    title: 'Why a path home',
    body: [
      'Long missions are hard on motivation. Each workout moves you one step closer to home, and some steps hold a video your family recorded before launch.',
      'You can’t skip ahead: the only way to unlock a message is to train.',
    ],
  },
  progress: {
    title: 'Why the baseline starts on day 15',
    body: [
      'In the first two weeks body fluid moves from your legs up to your chest and head, so your legs look smaller even though the muscle is still there.',
      'Once the fluid settles, on day 15, MuscleMap takes your personal space baseline. Every change after that is compared with it.',
    ],
  },
};
