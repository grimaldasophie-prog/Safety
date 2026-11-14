# MuscleMap

An offline app for astronauts on long missions. It tracks muscle loss in the calves and thighs
(segmental BIA, a 3D tablet scan and strength data from the exercise machine), compares each
body part with the astronaut's **own** baseline, builds a daily training plan, and motivates with
**Path Home**, where milestones unlock video messages from family.

> Every workout brings you closer to walking to your family on your own.

All data is fictional demo data. Nothing is sent anywhere: after the first visit the app works fully offline.

---

## The 60-second demo story

1. **Scan** tab → *Start measurement* → *Start BIA* → *Start scan*. See the saved result.
2. Use the **Demo day** buttons in the top right: **15 → 40 → 60 → 94**. Every screen updates.
   - Day 15: all green. Legs look smaller, but strength is unchanged → "Probably fluid shift."
   - Day 40: calves turn amber, so one extra set is added.
   - Day 60: calves turn red, so a second calf exercise is added and listed first.
   - Day 94: calves are recovering. The thighs stopped improving, so the load goes up one step.
3. On **Day 94**, open **Plan**, tap an exercise, then **Mark as done**. The avatar walks to step 15 and the
   *"You reached the halfway point!"* family message unlocks.
4. Tap the name under the logo ("Anna · Day 94…") to switch to **Leo, 38** (male body model) or to **Reset demo**.

---

## Run it on your computer (no coding needed)

You only need to do steps 1–2 once.

1. **Install Node.js.** Go to <https://nodejs.org>, download the **LTS** version and install it
   (click "Next" until it finishes).
2. **Get the project.** On the GitHub page of this repository click the green **Code** button →
   **Download ZIP**, then unzip it.
3. **Open a terminal in the `musclemap` folder.**
   - Mac: open the unzipped folder in Finder, right-click the `musclemap` folder →
     **New Terminal at Folder**.
   - Windows: open the `musclemap` folder, click the address bar, type `cmd` and press Enter.
4. Type this and press Enter (it downloads what the app needs, takes about a minute):
   ```
   npm install
   ```
5. Then type this and press Enter:
   ```
   npm run dev
   ```
6. Open the link it shows (usually <http://localhost:5173>) in Chrome. On a laptop the app appears inside
   a phone frame. To stop it, press `Ctrl + C` in the terminal.

> Offline mode only switches on in the built version (see "Test offline" below), not in `npm run dev`.

---

## Put it online for free

### Option A: Netlify Drop (easiest, no account setup)

1. In the terminal (inside the `musclemap` folder) run:
   ```
   npm run build
   ```
   This creates a folder called **`dist`**.
2. Go to <https://app.netlify.com/drop> and sign up for free (you can use your GitHub or Google account).
3. Drag the **`dist`** folder onto the page.
4. After a few seconds you get a link like `https://something.netlify.app`. That's your live app.
   To change the name: **Site configuration → Change site name**.

To update it later, run `npm run build` again and drag the new `dist` folder onto your site's
**Deploys** page.

### Option B: Vercel (updates itself every time you push to GitHub)

1. Go to <https://vercel.com> and click **Sign up → Continue with GitHub**.
2. Click **Add New… → Project**, then **Import** next to this repository.
3. Next to **Root Directory** click **Edit** and choose **`musclemap`**. Vercel detects "Vite" automatically.
4. Click **Deploy**. After about a minute you get a link like `https://musclemap.vercel.app`.

(Netlify can do the same: **Add new site → Import from Git**, choose the repo, set **Base directory**
to `musclemap`. Build settings are read from `netlify.toml`.)

---

## Test offline

1. Open the live link once in Chrome (or run `npm run build` then `npm run preview` locally).
2. Turn off Wi-Fi and reload the page. It still works.
3. On a phone or tablet: open the link and choose **Add to Home Screen**. It then opens like a normal app.

---

## Adding videos

Put `.mp4` files in `public/videos/`. The exact file names are listed in
[`public/videos/README.md`](public/videos/README.md). Missing videos show a tidy placeholder card, so the
app never breaks. After adding videos, build and deploy again.

---

## For developers

- Vite + React + TypeScript + Tailwind CSS, Recharts for charts. No backend, no login.
- `src/data/demoData.ts`: all demo data (Anna and Leo, measurements every 7 days, day 0–120).
- `src/lib/rules.ts`: the rules engine every screen uses (status thresholds, plan changes, landing prep, Path Home).
- `src/sw-template.js` + `vite.config.ts`: at build time a service worker is generated that precaches every
  file (and any videos present), so the app works offline after the first load.
- Fonts (Space Grotesk, IBM Plex Sans) are bundled locally, so there are no network requests.

The thresholds are examples only. Real values would be set by the crew's medical specialists.
