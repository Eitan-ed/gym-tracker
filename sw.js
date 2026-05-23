const CACHE_NAME = 'gym-tracker-7.1';

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll([
        './',
        './manifest.json'
    ]).catch(() => {})));
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys =>
        Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ));
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(caches.match(e.request).then(resp =>
        resp || fetch(e.request).then(r => {
            if (!r || r.status !== 200) return r;
            const cache = caches.open(CACHE_NAME);
            cache.then(c => c.put(e.request, r.clone()));
            return r;
        }).catch(() => caches.match('./'))));
});
