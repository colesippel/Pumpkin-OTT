# AI briefing — Giant Pumpkin OTT Calculator

**Cole: paste this entire file into Claude or ChatGPT as your first message, then
ask for what you want. Everything below is written for the AI, not for you.**

---

You are helping build the **Giant Pumpkin OTT Calculator**. Read this whole
briefing before writing any code.

## Who you are working with

The project owner is an **architect/engineer with no programming background**.
He grows giant pumpkins competitively. He can:

- open files and folders, and save a file you give him
- copy and paste
- read carefully and think in systems (he designs buildings for a living)

He cannot:

- run terminal or command-line tools
- install developer software (Node, npm, Xcode, Android Studio, Flutter)
- debug a stack trace
- tell whether your code is correct by reading it

**What this means for you, concretely:**

1. **Give complete files, not fragments.** Never say "add this to your app.js"
   or "replace the function around line 40." Output the *entire* finished file
   with a clear header saying exactly which file it replaces. He will save over
   the old one. A diff or a snippet is useless to him.
2. **Never introduce a build step.** No npm, no package.json, no bundler, no
   TypeScript that needs compiling, no framework that needs installing, no CDN
   `<script src="https://...">` (the app must work offline). Plain HTML, CSS and
   JavaScript that runs by double-clicking a file. This is a hard constraint,
   not a preference.
3. **Explain what to do in numbered steps**, and name files by their full path.
4. **Comment your code generously**, in plain English, aimed at a smart person
   who has never programmed. Say *why*, not just *what*. Match the existing
   comment style in the project — it is deliberately heavy.
5. **Tell him to verify.** Every response that changes code must end with:
   "Now open `tests/test.html` and confirm the banner is still green, then open
   `index.html` and check [the specific thing you changed]."
6. **Never claim you tested something you didn't.** You cannot open his browser.
   Say "I could not run this — please check X and tell me what you see."

## What the app does

A giant pumpkin's weight is estimated from three tape measurements, without a
scale. This is called the **OTT** ("Over The Top") method:

- **Circumference** — around the middle of the pumpkin
- **Side to side** — ground to ground across the pumpkin, over the highest point
- **End to end** — ground to ground stem-to-blossom, over the highest point

Add the three together to get the **OTT total in inches**. Convert that to an
estimated weight in pounds using the official chart published each year by the
**GPC (Great Pumpkin Commonwealth)**.

## THE MATHS — do not change this

The app uses the official formula printed on the 2025 GPC chart PDF:

```
Weight_lbs = ((12.81 / (1 + 6.87 * 2^(-OTT/97)))^3 + (OTT/45.9)^3.014) - 10
```

Source: <https://gpc1.org/wp-content/uploads/2025/05/2025-GPC-AG-OTT-Chart.pdf>

This has been **verified to reproduce all 300 rows of the published chart
exactly** when rounded to the nearest pound. `tests/test.html` proves it on
every run.

**Rules:**

- Do **not** "simplify", "optimise" or "correct" these constants. They are
  published values, not arbitrary tuning.
- Do **not** replace the formula with a different one you know from training
  data. Several other OTT formulas exist (e.g. `0.0000795 * OTT^2.76`). They
  disagree with the official 2025 GPC chart. This project uses the GPC one.
- Only update the formula if the owner supplies a **newer official GPC chart**.
  If he does: update `js/ott.js`, `data/ott_2025.js` and `data/ott_2025.json`
  together, rename the data files for the new year, and update the expected
  values in `tests/test.html`.
- The official chart covers **OTT 160″–539″**. Outside that, the formula still
  computes, and the app deliberately flags the result as outside the published
  range rather than hiding it. Keep that behaviour.

## Project structure

```
giant-pumpkin-ott-calculator/
├── index.html               The one and only screen
├── css/styles.css           All colours and layout (CSS variables at the top)
├── js/
│   ├── ott.js               THE MATHS. No DOM code allowed in here.
│   └── app.js               Reads the inputs, calls ott.js, writes the answer
├── data/
│   ├── ott_2025.js          Official 300-row chart, loaded via <script>
│   └── ott_2025.json        Identical data, portable format, for a phone app
├── tests/test.html          Open in a browser. 17 checks. Must stay green.
├── sw.js                    Service worker — makes the app work offline
├── manifest.webmanifest     PWA metadata (name, icon, colours)
└── icons/                   Pumpkin skull logo, SVG + PNG sizes
```

### Architecture rules

- **`js/ott.js` contains maths and nothing else.** No `document`, no `window` UI
  code, no colours, no strings meant for a screen beyond plain error reasons.
  This isolation is what makes the maths testable and portable to a phone app.
- **`js/app.js` contains screen wiring and no maths.** If you find yourself
  typing `12.81` or `Math.pow` in app.js, you are in the wrong file.
- **Data lives in `data/`.** Two copies exist on purpose, and the reason is
  documented at the top of `data/ott_2025.js`: a browser opening a file straight
  off the hard drive (`file://`) is blocked from `fetch()`-ing a `.json` file,
  so runtime data is loaded through a `<script>` tag instead. The `.json` is the
  portable reference copy. **If you edit one, edit both** — a test checks they
  match.
- **Everything must keep working from `file://`.** The owner's main way of
  running this app is double-clicking `index.html`. Any feature that only works
  on a web server needs a graceful fallback, the way the service worker
  registration in `app.js` already does.

## Design language

From the owner's brief: **black background, orange accents, white text, pumpkin
skull logo, independent of any club.**

- Black `#0a0a0a`, panels `#151515`, orange `#f79646`, dim orange `#d2762a`,
  white `#f6f4f1`, grey `#9a9490`, red `#ff6b5a`
- All defined as CSS variables at the top of `css/styles.css`. Use the
  variables; don't hard-code new hex values.
- **Touch targets stay at least 52px tall.** This app gets used outdoors, on a
  phone, by someone kneeling in a pumpkin patch, possibly with muddy hands.
- Keep `env(safe-area-inset-*)` padding so content clears the iPhone notch.
- Number displays use `font-variant-numeric: tabular-nums` so digits don't
  jitter while typing.
- No web fonts. The app must stay instant and fully offline.
- Do not add any club or association branding. This app is independent.

## Honesty requirements

These are product requirements, not decoration. The owner competes at
weigh-offs; other growers will use this app.

- The result is always labelled an **estimate**. OTT lands within roughly 5–10%
  of true weight. Never present it as a measured weight.
- Measurements outside the published 160″–539″ chart range must stay visibly
  flagged.
- Don't invent chart data. If a feature needs numbers that aren't in
  `data/ott_2025.js`, say so and ask where to get them.

## Version 1 — already built, don't rebuild it

Three inputs, automatic OTT total, instant estimated weight, clear button,
offline support, decimal support, the dark/orange theme, and the accuracy
disclosures. All working and tested.

## What's next

`ROADMAP.md` lists the future features in dependency order:
saved pumpkins → photos → genetics/notes → growth history and charts → cloud
backup. Build them one at a time. `PROMPTS.md` has a starting prompt for each.

When you add a feature, remember two chores that are easy to forget:

1. Add any **new file** to the `FILES` list in `sw.js`, **and** bump the version
   in `CACHE_NAME` (`pumpkin-ott-v1` → `v2`). Skipping the bump means people who
   already installed the app keep seeing the old version forever.
2. Add **tests** to `tests/test.html` for any new logic, following the existing
   `test('name', function () { ... })` pattern.

## Before you finish any response

- [ ] Gave complete files, each with its full path clearly labelled
- [ ] No build step, no npm, no external CDN links, works from `file://`
- [ ] Comments in plain English explaining *why*
- [ ] No changes to the official formula constants or chart data
- [ ] Updated `sw.js` FILES list and bumped `CACHE_NAME` if files changed
- [ ] Added or updated tests in `tests/test.html` for new logic
- [ ] Told the owner exactly what to check, including the green test banner
- [ ] Was honest about what you could not verify yourself
