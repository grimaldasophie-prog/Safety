# Videos for MuscleMap

Drop `.mp4` files into this folder using the exact names below.
Any file that is missing simply shows a clean "Video not on this device yet" card in the app,
so you can add them one at a time.

Keep them short (10–60 s) and small (under ~15 MB each, 720p is plenty) so they load fast
and can be stored for offline use.

## Exercise videos (Plan → tap an exercise)

| File name                       | Exercise                     |
| ------------------------------- | ---------------------------- |
| `ex_calf_raises.mp4`            | Calf raises                  |
| `ex_single_leg_calf_raises.mp4` | Single-leg calf raises       |
| `ex_squats.mp4`                 | Squats on resistance device  |
| `ex_split_squats.mp4`           | Split squats                 |
| `ex_deadlifts.mp4`              | Deadlifts                    |
| `ex_balance_stand.mp4`          | Balance stand (landing prep) |
| `ex_sit_to_stand.mp4`           | Sit-to-stand (landing prep)  |

## Family messages (Path Home gift circles)

| File name             | Unlocks at | Shown as                         |
| --------------------- | ---------- | -------------------------------- |
| `family_first.mp4`    | Circle 5   | "Five workouts in!"              |
| `family_halfway.mp4`  | Circle 15  | "You reached the halfway point!" |
| `family_home.mp4`     | Circle 30  | "Ready to walk home."            |

After adding videos, run `npm run build` again (and redeploy) so the offline cache picks them up.
