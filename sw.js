/* =============================================================================
   sw.js — the "service worker": what makes the app work with no signal
   =============================================================================

   A service worker is a small script the browser keeps running in the
   background. The first time someone visits the app, it saves a copy of every
   file listed in FILES below. After that the app opens instantly and works in a
   pumpkin patch with no bars of reception.

   >>> THE ONE THING TO REMEMBER <<<

   If you add, rename or delete a file in this project, you must:
     1. add or update it in the FILES list below, AND
     2. change the version number in CACHE_NAME (e.g. v1 -> v2)

   If you skip step 2, people who already used the app keep seeing the OLD
   version forever, because the browser is happily serving its saved copy.
   Changing the version name is what tells every phone "throw away the old
   files and fetch the new ones".
   ============================================================================= */

/* CHANGE THIS every time you change any file in the app. */
const CACHE_NAME = 'pumpkin-ott-v1';

/* Every file the app needs in order to work offline. */
const FILES = [
  './',
  './index.html',
  './css/styles.css',
  './js/ott.js',
  './js/app.js',
  './data/ott_2025.js',
  './manifest.webmanifest',
  './icons/logo.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

/* ---------------------------------------------------------------------------
   INSTALL - save a copy of everything.
   --------------------------------------------------------------------------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      // addAll fails as a group if any single file 404s, which would silently
      // leave the app without offline support. Adding files one at a time and
      // logging failures means a typo in FILES is visible instead of fatal.
      .then((cache) => Promise.all(
        FILES.map((file) => cache.add(file).catch((err) => {
          console.warn('[sw] could not cache', file, err);
        }))
      ))
      .then(() => self.skipWaiting())   // start using the new version right away
  );
});

/* ---------------------------------------------------------------------------
   ACTIVATE - delete caches from older versions of the app.
   --------------------------------------------------------------------------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names.filter((name) => name !== CACHE_NAME)
             .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

/* ---------------------------------------------------------------------------
   FETCH - answer every request for a file.

   Strategy: "network first, fall back to the saved copy."
     - Online  -> fetch the newest version and quietly refresh the saved copy,
                  so the grower is never stuck on a stale app.
     - Offline -> serve the saved copy.

   The alternative ("cache first") loads a few milliseconds faster but is a
   known source of "I fixed it but my phone still shows the old app" confusion,
   which is a bad trade for a non-programmer to inherit.
   --------------------------------------------------------------------------- */
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle normal page loads of our own files.
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Save a fresh copy for next time (clone: a response can only be read once).
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) =>
          // If it isn't saved either, fall back to the main screen so a
          // navigation never lands on the browser's dinosaur page.
          cached || (request.mode === 'navigate'
            ? caches.match('./index.html')
            : undefined)
        )
      )
  );
});
