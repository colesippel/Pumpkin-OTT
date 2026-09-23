# Getting it online and onto your phone

Three ways to run this app, from zero effort to most capable. You can stay at
level 1 forever if you want.

---

## Level 1 — Double-click it (works right now)

Double-click `index.html`. The app opens in your browser and works.

**Good for:** using it on the computer it's saved on, and checking changes an AI
made for you.

**Doesn't do:** installing to your phone, or offline mode. Browsers deliberately
restrict what a file opened straight off a hard drive can do — the app notices
and skips the offline setup rather than breaking.

---

## Level 2 — Put it online (about 5 minutes, free, no account juggling)

You need this level to get the app on your phone. Hosting a folder of files like
this one is free and doesn't expire.

### Netlify Drop — the fastest way

1. Go to <https://app.netlify.com/drop>
2. Drag the whole `giant-pumpkin-ott-calculator` folder onto the page.
3. It gives you a URL like `random-name-123.netlify.app`. That's your app, live.
4. Sign up (free) if you want to keep the URL permanently and give it a nicer
   name.

**To update it later:** drag the folder on again.

### GitHub Pages — better if you plan to keep changing it

More setup up front, but it keeps a history of every version, so a bad change is
undoable. Ask your AI: *"walk me through putting a folder of HTML files on
GitHub Pages, step by step, assuming I've never used GitHub."*

### Either way, one thing matters

Both give you an **`https://`** address. That's required for the app to install
to a phone home screen and work offline — phones won't allow it otherwise.

---

## Level 3 — Install it on your phone

Once you have an `https://` URL:

### iPhone

1. Open the URL in **Safari** (this doesn't work in Chrome on iOS).
2. Tap the **Share** button — the square with the arrow pointing up.
3. Scroll down, tap **Add to Home Screen**.
4. Tap **Add**.

### Android

1. Open the URL in **Chrome**.
2. Tap the **⋮** menu.
3. Tap **Install app** or **Add to Home screen**.

### What you get

The pumpkin skull icon on your home screen. It opens full-screen with no browser
address bar — indistinguishable from a normal app. **It works with no signal**,
which is the point: pumpkin patches have bad reception, and the app has to work
anyway.

Visit the URL once with a connection before you go out to the patch. That first
visit is when the app saves itself to the phone.

---

## The one gotcha, and how to avoid it

**Symptom:** you update the app, upload the new files, and your phone still
shows the old version.

**Cause:** the phone saved a copy of the app so it works offline. It's doing
exactly what you asked it to. You have to tell it the copy is stale.

**Fix:** open `sw.js`, find this line near the top —

```js
const CACHE_NAME = 'pumpkin-ott-v1';
```

— and change the version: `v1` → `v2`. Then re-upload.

**Every time an AI changes any file in this app, that version number must go
up.** `AI-BRIEFING.md` tells the AI this, but AIs forget. If your phone is
showing something stale, this is almost always why. There's a ready-made prompt
for it in `PROMPTS.md`.

---

## Sharing it with other growers

Your URL is a normal web address. Send it to anyone; they can install it the
same way. No app store, no approval process, no fee.

Two things to think about first:

- **Their data is theirs alone.** Everything saves on their own phone. You won't
  see their pumpkins and they won't see yours.
- **It's an estimate, and other people's expectations are not in your control.**
  The app is explicit about that in its footer. Keep that text — it's there so
  nobody turns up to a weigh-off feeling misled.

---

## What this costs

Nothing, at every level above. Free hosting, no store fees, no developer
account, no subscription. The only paid path is the App Store one — see
`docs/FLUTTER-PATH.md` for what that involves and whether you actually need it.
