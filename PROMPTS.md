# Copy-paste prompts

Ready-to-send messages for Claude or ChatGPT. Everything in a grey box below is
meant to be copied exactly as-is.

---

## The routine (do this every time)

1. Open a **new** chat in Claude or ChatGPT.
2. Paste **all of `AI-BRIEFING.md`** as your first message. Wait for a reply.
3. Paste the prompt for what you want, from below.
4. Also paste the **current contents of any file the AI needs to see.** It can't
   read your hard drive. If you're changing the app screen, paste `index.html`.
   If you're changing the maths, paste `js/ott.js`.
5. Save the files it gives you over the matching files in this folder.
6. **Open `tests/test.html`. Confirm the banner is green.**
7. Open `index.html` and check the thing you asked for actually happened.

**Start a fresh chat for each feature.** Long chats drift, forget the rules, and
start reintroducing things the briefing told them not to do.

---

## Prompt 1 — Save a pumpkin (Stage 1)

> I want to add the ability to save pumpkins, as described in Stage 1 of
> ROADMAP.md.
>
> Use the exact data shape suggested in ROADMAP.md Stage 1, including the fields
> reserved for later stages, so I don't have to migrate my data later. Store it
> in localStorage under a single key.
>
> What I want to be able to do:
> - type a name and save the current measurement to a new pumpkin
> - see a list of my saved pumpkins with their latest estimated weight
> - tap one to reopen it and see its details
> - delete one, with a confirmation step so I can't lose data by mis-tapping
>
> Keep it on the single existing screen if you can do it cleanly — show and hide
> sections rather than making separate pages. If separate pages genuinely are
> cleaner, explain why before you write the code.
>
> Follow every rule in the briefing: complete files only, no build step, works
> from file://, keep the existing look, comment for a non-programmer. Add tests
> to tests/test.html for the save/load/delete logic. Update the FILES list in
> sw.js and bump CACHE_NAME. End by telling me exactly what to check.
>
> Here are my current files:
> [paste index.html, then js/app.js, then css/styles.css]

---

## Prompt 2 — Photos (Stage 2)

> I want to add photos to saved pumpkins, as described in Stage 2 of
> ROADMAP.md.
>
> Use `<input type="file" accept="image/*" capture="environment">` so it opens
> the camera directly on a phone. Resize every photo to about 1200px on the long
> edge using a canvas before storing it — I know localStorage only holds about
> 5MB and full-size phone photos will overflow it.
>
> Handle the storage-full case with a clear message telling me what happened and
> what to do about it. Never fail silently.
>
> Follow every rule in the briefing. Add tests where the logic is testable.
> Update sw.js. Tell me what to check.
>
> Here are my current files:
> [paste index.html, then js/app.js, then css/styles.css]

---

## Prompt 3 — Genetics and notes (Stage 3)

> I want to add seed, pollinator and notes fields to each saved pumpkin, as
> described in Stage 3 of ROADMAP.md.
>
> Growers write seeds as "weight grower" (e.g. "2145 McMullen") and crosses as
> "mother x father". Display them that way. Notes should be a multi-line box
> that saves as I type.
>
> Follow every rule in the briefing. Update sw.js. Tell me what to check.
>
> Here are my current files:
> [paste index.html, then js/app.js]

---

## Prompt 4 — Growth history and charts (Stage 4)

> I want growth history and a chart, as described in Stage 4 of ROADMAP.md.
>
> Save a dated measurement each time I measure a pumpkin, then show:
> - a table of every measurement with its date, OTT and estimated weight
> - a chart of estimated weight over time
> - pounds gained per day between the two most recent measurements
> - days since pollination, if I've entered a pollination date
>
> IMPORTANT: draw the chart yourself with inline SVG or canvas. Do not add
> Chart.js or any other charting library, and do not link to any CDN. This app
> must keep working with no internet — that's the entire point of it.
>
> Make the chart readable on a phone screen in sunlight: thick lines, high
> contrast, few gridlines, orange on black to match the app.
>
> Follow every rule in the briefing. Add tests for the pounds-per-day and
> days-since-pollination maths. Update sw.js. Tell me what to check.
>
> Here are my current files:
> [paste index.html, then js/app.js, then css/styles.css]

---

## Prompt 5 — Backup my data to a file (Stage 5a)

> I want to back up and restore my data, as described in Stage 5a of
> ROADMAP.md.
>
> Add a "Back up my data" button that downloads everything as a .json file named
> with today's date, and an "Import" button that reads one of those files back
> in.
>
> On import, tell me what I'm about to do before you do it — how many pumpkins
> are in the file, and whether importing will replace or merge with what I
> already have. Let me cancel. I do not want to lose a season of data to a
> mis-tap.
>
> Follow every rule in the briefing. Update sw.js. Tell me what to check.
>
> Here are my current files:
> [paste index.html, then js/app.js]

---

## Fix-it prompts

### Tests went red

> I changed [describe what you changed] and now tests/test.html shows a red
> banner with this failure:
>
> [paste the exact red text, including the grey detail line under it]
>
> Please fix it. Do not change the official formula constants in js/ott.js or
> the chart numbers in data/ott_2025.js — those are published GPC values and are
> correct. The bug is in my new code, not in the official maths.
>
> Here are the files I changed:
> [paste them]

### App shows a blank screen

> My app now shows a completely blank page. Nothing appears.
>
> In Chrome, I pressed F12, clicked the "Console" tab, and this is the red error
> text:
>
> [paste it]
>
> Here is the file I last changed:
> [paste it]
>
> Please give me the corrected complete file and explain what went wrong in
> plain English.

### The AI gave me a fragment instead of a whole file

> That's a snippet, and I can't apply snippets — I'm not a programmer and I
> don't know where it goes. Please give me the complete, finished contents of
> the whole file, from the first line to the last, with the file path at the top.
> I'm going to save your output directly over my existing file.

### The AI wants to add a build step

> That requires installing developer tools, which I can't do — please re-read
> the constraints in the briefing I pasted at the start.
>
> Do it again using only plain HTML, CSS and JavaScript that runs by
> double-clicking index.html. No npm, no package.json, no bundler, no framework,
> and no links to any CDN or external website — the app must work with no
> internet.

### My phone still shows the old version

> I updated the app and put the new files online, but my phone still shows the
> old version.
>
> I think this is the service worker cache. Please check my sw.js: is every file
> in the FILES list, and has CACHE_NAME been bumped to a new version? Give me
> the corrected complete sw.js.
>
> [paste sw.js]

---

## Two prompts worth having in your back pocket

### Explain this to me

> Explain what this file does, in plain English, as if to an architect who has
> never programmed. Don't teach me to code — I want to understand what it's
> doing and why, so I can tell whether a future change is sensible.
>
> [paste the file]

### Is this a good idea?

> Before you write any code: I'm thinking of [describe the idea]. Tell me
> honestly whether that's a good idea for this project, what it would break,
> what it would cost in complexity, and whether there's a simpler way to get
> what I actually want. Push back if it's a bad idea — don't just agree with me.
>
> Then wait for me to decide before writing anything.

That second one is the most valuable prompt in this file. Use it often.
