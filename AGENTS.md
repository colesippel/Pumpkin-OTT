# Agent instructions

**Read `AI-BRIEFING.md` in this folder before doing anything.** It is the full
context document for this project. What follows is the short version.

## Context

Giant Pumpkin OTT Calculator — a PWA that estimates a giant pumpkin's weight
from three tape measurements using the official 2025 GPC chart.

**The owner is an architect/engineer with no programming experience.** He cannot
run a terminal, install developer tooling, or read a stack trace. He edits this
project by pasting into a web chat and saving the files it returns.

## Hard constraints

1. **Output complete files, never fragments or diffs.** Label each with its full
   path. The owner saves your output directly over the existing file.
2. **No build step, ever.** No npm, no `package.json`, no bundler, no framework
   install, no TypeScript needing compilation.
3. **No external network dependencies.** No CDN `<script>` or `<link>` tags, no
   web fonts, no remote images. The app must work with no internet — it's used
   in fields with no signal.
4. **Must keep working from `file://`.** Double-clicking `index.html` is the
   owner's primary way of running the app. Features that need a web server
   require a graceful fallback (see how `app.js` guards service worker
   registration).
5. **Never change the official formula constants or chart data.** See below.
6. **Comment in plain English, explaining why.** The existing comment density is
   deliberate — match it.

## The maths is verified — do not "improve" it

`js/ott.js` implements the formula printed on the official 2025 GPC chart PDF:

```
lbs = ((12.81 / (1 + 6.87 * 2^(-OTT/97)))^3 + (OTT/45.9)^3.014) - 10
```

It reproduces **all 300 published chart rows exactly**. Other OTT formulas exist
in training data (e.g. `0.0000795 * OTT^2.76`); they disagree with the official
chart and must not be substituted. Full provenance in `docs/OTT-REFERENCE.md`.

## Architecture

- `js/ott.js` — maths only. No DOM, no `document`, no colours, no UI strings.
  This isolation makes it testable and portable to a future Flutter app.
- `js/app.js` — DOM wiring only. No formulas.
- `data/ott_2025.js` — runtime chart data (loaded via `<script>`, so it works
  from `file://`). `data/ott_2025.json` is the identical portable copy.
  **Edit one, edit both** — a test verifies they match.
- `css/styles.css` — CSS variables at the top; use them rather than new hex
  values. Touch targets stay ≥52px (outdoor phone use). Keep the
  `env(safe-area-inset-*)` padding.
- `tests/test.html` — zero-dependency browser test page, 17 checks.

## Verification is mandatory

There is no CLI test runner. `tests/test.html` runs in a browser.

- You **cannot** run it yourself. Never claim you did.
- End every code-changing response by telling the owner to open
  `tests/test.html`, confirm the banner is green, and check the specific
  behaviour you changed.
- Add tests for any new logic, following the existing
  `test('name', function () { ... })` pattern.

## Two chores that are easy to forget

1. **Any new or renamed file** must be added to the `FILES` array in `sw.js`.
2. **Any file change** requires bumping `CACHE_NAME` in `sw.js`
   (`pumpkin-ott-v1` → `v2`). Skip it and already-installed phones keep serving
   the old version indefinitely.

## Product honesty

The output is an **estimate** (typically ±5–10%), never a measured weight. The
published chart covers OTT 160″–539″; results outside that stay visibly flagged.
Don't remove the accuracy disclosures, and don't invent chart data — if a feature
needs numbers that aren't in `data/ott_2025.js`, say so and ask.

The app is independent. Do not add club or association branding.
