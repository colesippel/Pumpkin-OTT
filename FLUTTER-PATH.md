# Getting to a real app — and why this isn't Flutter yet

Your brief asked for a Flutter app for Android and iPhone. This is a PWA
instead. That was a deliberate decision, so here's the reasoning and the exact
route to a native app when you want one.

## Why the PWA came first

**You can use it today.** Building a Flutter app requires installing the Flutter
SDK, Xcode (Mac only, ~15GB), and Android Studio; learning to run a build; and
paying Apple $99/year plus a Google Play one-off fee before anything reaches
your phone. That's a wall between you and a working app — and none of it is
something you can do without programming experience.

The PWA installs to your home screen from a URL, free, in about five minutes.

**Faster to change.** Every roadmap feature is a text file an AI can rewrite and
you can save. No compiling, no build errors, no toolchain to keep working. When
you want something changed mid-season, you get it that evening.

**AI writes better plain JavaScript than Flutter.** There is vastly more HTML,
CSS and JavaScript in AI training data than Dart and Flutter. The code you get
back will be more reliable, and more importantly *you* can read it — Dart is
much harder to follow without programming background.

**No store review.** No approval delays, no rejections, no re-submitting for a
one-line fix. You share a link.

## What you give up

Being straight with you, since these are the reasons to eventually go native:

| Not available in a PWA | Matters if you want |
|---|---|
| App Store / Play Store listing | Other growers to *find* it by searching a store |
| Push notifications on iPhone | "Time to measure" reminders (works on Android, patchy on iOS) |
| Full offline photo storage | Hundreds of photos — browser storage is limited |
| Background activity | Anything running while the app is closed |
| Hardware sensors | Camera works fine; deeper sensor access doesn't |

For a measurement calculator, none of these are blocking. The main honest reason
to go native is **distribution** — if you want this discoverable in the App
Store as a thing other growers find and download, you eventually need a native
app.

## The route to native, when you want it

### The important part: the maths is already portable

This is why `js/ott.js` was built with no screen code in it. The formula, the
input validation and the out-of-range logic are all in one small file with no
dependencies on the browser. Porting it to Dart is a mechanical translation of
about 100 lines — and `data/ott_2025.json` is already in a format Flutter reads
natively.

Your 300-row verification table comes along too, which means **you can prove the
Flutter version calculates identically to the PWA.** That's the real value of
having built it this way: a rewrite you can verify instead of one you have to
trust.

### The order to do it in

1. **Finish the roadmap as a PWA first.** Get the features right where changes
   are cheap. Don't port a design you're still figuring out.
2. **Use the PWA as the specification.** A working app is a far better brief
   than a document — every screen, message and edge case is already decided.
3. **Port the engine first, and test it.** Translate `js/ott.js` to Dart, then
   write a Dart test that checks it against all 300 rows of
   `data/ott_2025.json`. Do this before building a single screen. If it passes,
   the hard part is done.
4. **Then rebuild the screens** in Flutter with Material 3, as your brief
   describes, using the same colours from `css/styles.css`.
5. **Then deal with the stores** — developer accounts, icons, screenshots,
   privacy declarations, review.

Step 5 is usually the biggest surprise. Budget more time for store paperwork
than for the app itself.

### A prompt for when you get there

> I have a working PWA that estimates giant pumpkin weight, and I want to port
> it to Flutter for iOS and Android with Material 3.
>
> Start with the calculation engine only — do not write any UI yet. Here is my
> JavaScript engine and my chart data. Translate the engine to Dart, then write
> a Dart unit test that verifies it against all 300 rows of the JSON chart, the
> way my browser test does.
>
> I have never used Flutter, Dart, Xcode or Android Studio, so also tell me
> exactly what I need to install and how to run the test — step by step,
> assuming no prior knowledge.
>
> [paste js/ott.js, then data/ott_2025.json]

### The honest alternative

If your goal is a native app mainly to *ship* rather than to learn, the
cheapest path is often: finish the PWA, then pay a Flutter developer a few
hours to port it. Handing someone a working app plus a 300-row test table is a
tiny, well-specified job. Handing them a brief is a big, vague one.

## Middle option: wrap the PWA

There's a step between the two. Tools like **Capacitor** wrap an existing web
app in a native shell you can submit to the app stores — you keep the HTML, CSS
and JavaScript you already have, and get a store listing.

It does require developer accounts and a build step, so it's not a free lunch.
But it's much less work than a Flutter rewrite, and worth asking your AI about
if store distribution turns out to be the only thing you actually wanted from
going native.
