// sw.js

// This version name is now controlled by the index.html file.
// This file will be fetched by the browser, and it will read this version.
const CACHE_NAME = 'skingenius-v8'; 

const urlsToCache = [
    '/',
    '/index.html', // Explicitly cache the main file
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap',
    'https://fonts.gstatic.com/s/vazirmatn/v11/Dxx78-e6dG52Wk2bPpz2hLfg_W5o-32b.woff2',
    'https://raw.githubusercontent.com/mr-esmaily/SkinGenius/405144491fadaa87abc66ee9d00e15c14cd047ec/IMG_20250817_063212_060.jpg'
];

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Opened cache and caching files.');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
