# Roadmap

The order here isn't arbitrary — each stage needs the one before it. Build them
one at a time, and confirm `tests/test.html` is green before starting the next.

---

## ✅ Stage 0 — Version 1 (done)

Three measurement inputs · automatic OTT total · instant estimated weight ·
clear button · works offline · decimals · dark/orange theme with pumpkin skull
logo · honest accuracy and out-of-range messaging.

Nothing here needs rebuilding. Use it as the pattern to copy.

---

## Stage 1 — Save a pumpkin

**Why first:** every other feature on your list attaches to a saved pumpkin.
Photos belong to a pumpkin. Genetics belong to a pumpkin. Growth history is a
list of measurements for one pumpkin. Nothing else can be built until a pumpkin
is a thing the app can store.

**What it does:** name a pumpkin ("2026 Big Girl"), save the current
measurement against it, see a list of your saved pumpkins, tap one to reopen it.

**How it should store data:** the browser's `localStorage`. It needs no account,
no server, no internet, and works from `file://`. One key, e.g. `pumpkins`,
holding a JSON array.

**Design the data shape now, carefully.** Getting this right makes every later
stage easy; getting it wrong means migrating data later. Suggested shape, which
already has room for the whole roadmap:

```js
{
  id: "p_1725800000000",        // unique, never reused
  name: "2026 Big Girl",
  seed: "",                     // Stage 3
  pollinatedBy: "",             // Stage 3
  notes: "",                    // Stage 3
  photos: [],                   // Stage 2
  measurements: [               // Stage 4 reads this as a series
    { date: "2026-08-14", circumference: 190, sideToSide: 125,
      endToEnd: 125, ott: 440, lbs: 1865 }
  ],
  createdAt: "2026-08-14T10:00:00.000Z"
}
```

**Watch out for:** `localStorage` is per-browser and per-device. Data saved in
Safari on a phone is not visible in Chrome on a laptop, and clearing browsing
data deletes it. The app should say so plainly somewhere, and Stage 5 (export)
is the answer. Build Stage 5 sooner rather than later if you start relying on
this.

---

## Stage 2 — Photos

**Depends on:** Stage 1.

**What it does:** attach photos to a saved pumpkin, taken with the phone camera
or picked from the library, and show them on that pumpkin's page.

**How:** `<input type="file" accept="image/*" capture="environment">` opens the
camera directly on a phone. Read the file, **resize it down** (roughly 1200px on
the long edge) onto a `<canvas>`, and store the result as a compressed JPEG data
URL.

**Watch out for:** `localStorage` holds only about 5MB *in total*. Two or three
full-resolution phone photos will blow through that and start throwing errors.
Resizing is not optional. Ask your AI to handle the "storage full" case with a
clear message rather than a silent failure. If photos become the main event,
this is the point to move storage to IndexedDB — say so to your AI and it will
know what you mean.

---

## Stage 3 — Genetics and notes

**Depends on:** Stage 1. Easiest stage on the list — it's just text fields.

**What it does:** record the seed ("2145 McMullen"), the pollinator, and free
notes for each pumpkin.

**Worth adding while you're in there:** growers write seeds as
`weight grower` (e.g. `2145 McMullen`) and crosses as `mother x father`. If the
app shows those in the conventional format, it'll feel like it was built by
someone who actually grows.

---

## Stage 4 — Growth history and charts

**Depends on:** Stages 1 and 3. This is the stage that makes the app genuinely
useful during a season rather than just at the end of one.

**What it does:** save a dated measurement each time you measure, then show the
history as a table and a chart of estimated weight over time. Growers use this
to spot a stall early — a flat line for a week means something is wrong.

**How to chart it without breaking the no-build-step rule:** draw it yourself
with inline SVG or a `<canvas>`. Do **not** let an AI add Chart.js from a CDN —
that breaks offline support, which is the whole point of a field app.

**Genuinely useful additions here:** pounds gained per day between the last two
measurements, and days since pollination. Both are single lines of arithmetic
and both are things growers actually track.

---

## Stage 5 — Backup and sharing

**Depends on:** Stage 1. **Do this earlier than its number suggests** if you
start keeping real season data in the app.

**Build it in two steps, easy first:**

**5a — Export / import a file (easy, no accounts, no internet).** A "Back up my
data" button that downloads a `.json` file of everything, and an "Import" button
that reads one back. This solves the real problem — losing a season's data to a
cleared browser cache — with no server and no sign-in. Do this one.

**5b — Real cloud sync (hard, and a genuine step change).** Syncing across
devices means accounts, a hosted database, and login screens. It means the app
is no longer a folder of files you own outright, and it usually costs money.
Only worth it if you want your data on your phone *and* your laptop, or want to
share a patch with someone else. If you go here, expect it to take longer than
everything above it combined.

---

## Beyond the brief — ideas from how growers actually work

Not requested, so not built. Listed because they're cheap to add once Stage 4
exists, and because they came up while researching the OTT method:

- **Circumference-only estimate.** A second published formula
  (`0.001517 × circumference^2.61374`) uses just one measurement. Less accurate
  for a final estimate but much faster for a daily growth check — which is what
  many growers use it for.
- **Metric mode.** Enter cm, read kg. The GPC publishes a metric chart too.
- **Chart browser.** Show the official 300-row table on screen. The data is
  already sitting in `data/ott_2025.js` waiting to be displayed.
- **Multi-year charts.** Compare this season's curve against last season's.
- **Measurement guide.** A short illustrated screen on how to take the three
  measurements correctly. Measurement error, not formula error, is the biggest
  source of a bad estimate — so this may improve real-world accuracy more than
  any code change.

---

## The rule that applies at every stage

After any change, open `tests/test.html`. **Green means go.** Red means stop and
fix it before building anything on top.
