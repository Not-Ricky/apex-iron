const CACHE_NAME = 'apex-iron-modular-v4.6';
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './data.js',
  './app.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.includes('firebasedatabase.app') || url.includes('googleapis.com/v1beta')) {
    return;
  }

  // NETWORK-FIRST per HTML, JS e CSS dell'app: scarica sempre l'ultima versione da GitHub se online
  const isAppCode = event.request.mode === 'navigate' ||
    url.endsWith('index.html') ||
    url.endsWith('style.css') ||
    url.endsWith('data.js') ||
    url.endsWith('app.js') ||
    url.endsWith('/');

  if (isAppCode) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // CACHE-FIRST per asset esterni statici (Google Fonts, icone, manifest)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      });
    })
  );
});
