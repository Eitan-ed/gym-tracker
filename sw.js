const CACHE_NAME = 'gym-tracker-v5.8';

const ASSETS = [
  './gym-tracker.html',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './images/ex1.png',
  './images/ex2.png',
  './images/ex3.png',
  './images/ex4.png',
  './images/ex5a.png',
  './images/ex5b.png',
  './images/ex6.png',
  './images/ex7b.png',
  './images/ex7c.png',
  './images/ex8.png',
  './images/ex9.png',
  './images/ex10a.png',
  './images/ex10b.png'
];

// התקנה — מאחסן assets בסיסיים
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS).catch(() => {}))
  );
});

// הפעלה — מוחק caches ישנים
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// בקשות — Network First: תמיד מנסה רשת, fallback לcache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
