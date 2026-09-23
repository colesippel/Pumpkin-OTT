# Claude instructions

See **[AGENTS.md](AGENTS.md)** for the short version, and
**[AI-BRIEFING.md](AI-BRIEFING.md)** for full project context. Read one of them
before making any change.

The three things most likely to trip you up:

1. **The owner cannot run a terminal or install anything.** Output complete
   files with their full path, never diffs or snippets. No build step, no npm,
   no CDN links. The app must run by double-clicking `index.html`.
2. **The formula in `js/ott.js` is official published GPC data, verified against
   all 300 rows of the 2025 chart.** Do not change its constants, and do not
   substitute a different OTT formula from memory.
3. **You cannot run the tests** — `tests/test.html` is a browser page. Never
   claim you verified anything. Tell the owner to open it and confirm the banner
   is green.
