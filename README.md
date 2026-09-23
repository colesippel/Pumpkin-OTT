# Giant Pumpkin OTT Calculator

Estimate a giant pumpkin's weight from three tape measurements, using the
official [2025 GPC OTT chart](https://gpc1.org/wp-content/uploads/2025/05/2025-GPC-AG-OTT-Chart.pdf).

An offline-capable PWA. No build step, no dependencies — open `index.html`.

## Quick start

| I want to… | Do this |
|---|---|
| **Use the app** | Double-click `index.html` |
| **Check the maths is right** | Double-click `tests/test.html` — look for a green banner |
| **Understand the project** | Read [START-HERE.md](START-HERE.md) |
| **Get an AI to build a feature** | Paste [AI-BRIEFING.md](AI-BRIEFING.md) into it, then a prompt from [PROMPTS.md](PROMPTS.md) |
| **Put it on my phone** | Read [HOSTING.md](HOSTING.md) |
| **Know what to build next** | Read [ROADMAP.md](ROADMAP.md) |

## Status

**Version 1 is complete and tested.** Three measurement inputs, automatic OTT
total, instant estimated weight in lbs and kg, clear button, offline support,
decimal support, dark/orange theme with pumpkin skull logo, and explicit
accuracy and out-of-range messaging.

Saved pumpkins, photos, genetics, notes, growth history, charts and backup are
mapped out in [ROADMAP.md](ROADMAP.md) with a ready-made prompt for each.

## How the maths works

```
OTT = circumference + side-to-side + end-to-end        (inches)

lbs = ((12.81 / (1 + 6.87 * 2^(-OTT/97)))^3 + (OTT/45.9)^3.014) - 10
```

That formula is printed on the official 2025 GPC chart and **reproduces all 300
published rows exactly** — `tests/test.html` verifies it on every run.

Results are estimates, typically within 5–10% of true weight. The published
chart covers OTT 160"–539"; outside that range the app flags the result.

Provenance and accuracy detail: [docs/OTT-REFERENCE.md](docs/OTT-REFERENCE.md).

## Structure

```
index.html               The single screen
css/styles.css           Colours and layout (CSS variables at the top)
js/ott.js                The maths — no DOM code, portable to other platforms
js/app.js                Screen wiring — no maths
data/ott_2025.js         Official 300-row chart (script-loaded, works offline)
data/ott_2025.json       Identical data, portable format
tests/test.html          17 checks, zero dependencies, runs in a browser
sw.js                    Service worker (offline support)
manifest.webmanifest     PWA metadata
icons/                   Pumpkin skull logo, SVG + PNG
```

Independent project. Not affiliated with any club or growing association.
