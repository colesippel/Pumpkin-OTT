# Start here, Cole

This folder is a **working app**, not a pile of instructions. Before you read
anything else, go see it run.

## 1. Look at what you already have (30 seconds)

Find the file called **`index.html`** in this folder and double-click it.

Your web browser opens the Giant Pumpkin OTT Calculator. Type three
measurements into it. It works.

Try these numbers to see it in action:

| Circumference | Side to side | End to end | You should see |
|---|---|---|---|
| 190 | 125 | 125 | Total OTT 440″, **1,865 lbs** |
| 63.25 | 45 | 45.625 | Total OTT 153.875″, **87 lbs** + an orange warning |

That second one shows an orange note because a 153″ pumpkin is smaller than the
official chart covers. The app tells you that instead of quietly guessing.

## 2. Check the maths is right (30 seconds)

Open the folder called **`tests`** and double-click **`test.html`**.

You should see a green banner: **ALL 17 CHECKS PASSED**.

That page compares this app against all 300 rows of the official 2025 GPC
chart. Green means the app agrees with the official numbers exactly.

**This is your safety net.** Any time an AI changes something for you, open
this page again. Green means the maths still works. Red means the AI broke
something and needs to fix it. You don't need to understand any code to use
this — you just need to see the colour.

## 3. What's already done vs. what's next

**Already working — your whole Version 1:**

- Three measurement inputs, decimals supported
- OTT total added up automatically as you type
- Instant estimated weight in pounds (and kilograms)
- Clear button
- Works with no internet once installed
- Black background, orange accents, white text, pumpkin skull logo
- Honest about accuracy, and about measurements outside the official chart

**Not done yet — the "Future" list from your brief:**

- Saved pumpkins
- Photos
- Genetics / parentage
- Notes
- Growth history and charts
- Cloud backup

Those are all mapped out in **`ROADMAP.md`**, in a sensible build order.

## 4. How to get an AI to build the rest

This is the part that matters, so it gets its own short version here and a
longer version in `PROMPTS.md`.

**The routine, every single time:**

1. Open Claude or ChatGPT in your browser.
2. Copy **all** of `AI-BRIEFING.md` and paste it in as your first message.
   That one file teaches the AI everything about this project.
3. Then copy the prompt for the feature you want from `PROMPTS.md` and send it.
4. The AI gives you back file contents. Save them over the matching files here.
5. **Open `tests/test.html` and confirm it's still green.**
6. Open `index.html` and check the app still does what you expect.

Step 5 is the one people skip. Don't. It's the difference between "the AI
changed something" and "the AI changed something and the numbers are still
right."

**If the tests go red:** paste the red text back to the AI and say *"this test
is now failing, fix it without changing the official chart numbers."*

## 5. Getting it on your phone

See **`HOSTING.md`**. Short version: this is a PWA — a website that installs to
your phone's home screen like a real app, with its own icon, and works with no
signal. It's free to host and there's no app store to deal with.

## The files, in plain English

| File / folder | What it is |
|---|---|
| `index.html` | The app screen. Double-click to run. |
| `css/styles.css` | All the colours and layout |
| `js/ott.js` | **The maths.** The official GPC formula. Handle with care. |
| `js/app.js` | Connects the screen to the maths |
| `data/ott_2025.js` | The official 300-row chart, as the app reads it |
| `data/ott_2025.json` | The same chart in a portable format, for a future phone app |
| `tests/test.html` | Your safety net. Double-click. Look for green. |
| `sw.js` | The bit that makes it work offline |
| `icons/` | The pumpkin skull logo, in several sizes |
| `manifest.webmanifest` | Tells phones the app's name, colour and icon |
| `AI-BRIEFING.md` | **Paste this into any AI first.** |
| `PROMPTS.md` | Ready-to-send prompts for each new feature |
| `ROADMAP.md` | What to build next, and in what order |
| `HOSTING.md` | Getting it online and onto your phone |
| `docs/OTT-REFERENCE.md` | Where the formula came from, and how accurate it is |
| `docs/FLUTTER-PATH.md` | How to turn this into a real App Store app later |

## Two things worth knowing up front

**Your brief asked for Flutter.** This is built as a PWA instead. That was a
deliberate call, and `docs/FLUTTER-PATH.md` explains the reasoning and exactly
how to get to a native app when you want one. The short version: a PWA gets you
onto a phone today with no Xcode, no Android Studio, and no $99/year Apple
developer account — and the maths in `js/ott.js` ports over unchanged when you
do go native.

**The numbers in this app are real.** The formula in `js/ott.js` is the official
one printed on the 2025 GPC chart, and it reproduces all 300 published rows
exactly. It isn't an approximation someone invented. Don't let an AI "improve"
it. Details in `docs/OTT-REFERENCE.md`.
