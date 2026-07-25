const CACHE_NAME = 'gym-tracker-9.67';

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll([
        './',
        './index.html',
        './manifest.json'
    ]).catch(() => {})));
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('message', e => {
    if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

// network-first עבור HTML/JS — תמיד מנסה את הרשת קודם (ללא cache-busting של הדפדפן)
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    const url = new URL(e.request.url);
    const isDoc = e.request.mode === 'navigate' ||
                  url.pathname.endsWith('.html') ||
                  url.pathname.endsWith('/') ||
                  url.pathname.endsWith('.js');
    if (isDoc) {
        e.respondWith(
            fetch(e.request, {cache:'no-store'}).then(r => {
                if (!r || r.status !== 200) return r;
                const clone = r.clone();
                caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
                return r;
            }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
        );
        return;
    }
    e.respondWith(
        fetch(e.request).then(r => {
            if (!r || r.status !== 200) return r;
            const clone = r.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
            return r;
        }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
    );
});
