const CACHE_NAME = 'sign-pdf-v2';
const OFFLINE_URL = './offline.html';

const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icon.svg',
    './icon-192.png',
    './icon-512.png',
    './style.css',
    './main.js',
    './offline.html'
];

self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', (evt) => {
    evt.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (evt) => {
    if (evt.request.mode === 'navigate') {
        evt.respondWith(
            fetch(evt.request)
                .catch(() => {
                    return caches.match(OFFLINE_URL);
                })
        );
        return;
    }

    evt.respondWith(
        caches.match(evt.request).then((res) => {
            return res || fetch(evt.request).catch(() => {
                if (evt.request.destination === 'image') {
                    return caches.match('./icon.svg');
                }
            });
        })
    );
});
