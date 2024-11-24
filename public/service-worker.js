// const staticCacheName = 'site-static-v4';
// const dynamicCacheName = 'site-dynamic-v4';

// const assets = [
//     '/',
//     '*.css'
// ];

// // cache size limit function
// const limitCacheSize = (name, size) => {
//     caches.open(name).then(cache => {
//         cache.keys().then(keys => {
//             if (keys.length > size) {
//                 cache.delete(keys[0]).then(limitCacheSize(name, size));
//             }
//         });
//     });
// };

// // install event
// self.addEventListener('install', evt => {
//     console.log('service worker installed');
//     evt.waitUntil(
//         caches.open(staticCacheName).then((cache) => {
//             console.log('caching shell assets');
//             cache.addAll(assets);
//         })
//     );
// });

// // activate event
// self.addEventListener('activate', evt => {
//     console.log('service worker activated');
//     evt.waitUntil(
//         caches.keys().then(keys => {
//             //console.log(keys);
//             return Promise.all(keys
//                 .filter(key => key !== staticCacheName && key !== dynamicCacheName)
//                 .map(key => caches.delete(key))
//             );
//         })
//     );
// });

// // fetch events
// self.addEventListener('fetch', evt => {
//     if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
//         evt.respondWith(
//             caches.match(evt.request).then(cacheRes => {
//                 return cacheRes || fetch(evt.request).then(fetchRes => {
//                     return caches.open(dynamicCacheName).then(cache => {
//                         cache.put(evt.request.url, fetchRes.clone());
//                         // check cached items size
//                         limitCacheSize(dynamicCacheName, 15);
//                         return fetchRes;
//                     })
//                 });
//             }).catch(() => {
//                 if (evt.request.url.indexOf('.html') > -1) {
//                     return caches.match('/pages/fallback.html');
//                 }
//             })
//         );
//     }
// });







const CACHE_NAME = "telegram-clone-v-1";
const DB_NAME = "Telegram-clone";
const DB_VERSION = 1;
const DB_STORE_NAME = "myStore";

async function cacheCoreAssets() {
    const cache = await caches.open(CACHE_NAME);
    return cache.addAll([
        "/",
    ]);
}

self.addEventListener("install", (event) => {
    event.waitUntil(cacheCoreAssets());
    self.skipWaiting();
});

async function clearOldCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
    );
}

self.addEventListener("activate", (event) => {
    event.waitUntil(clearOldCaches());
    self.clients.claim();
});

async function dynamicCaching(request) {
    const cache = await caches.open(CACHE_NAME);

    try {
        const response = await fetch(request);
        const responseClone = response.clone();
        await cache.put(request, responseClone);
        return response;
    } catch (error) {
        console.error("Dynamic caching failed:", error);
        return caches.match(request);
    }
}

async function cacheFirstStrategy(request) {
    try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        const responseClone = networkResponse.clone();
        await cache.put(request, responseClone);
        return networkResponse;
    } catch (error) {
        console.error("Cache first strategy failed:", error);
        return caches.match("/offline");
    }
}

async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            const responseData = await responseClone.json();
            await addData(request.url, responseData);
            return networkResponse;
        }

        throw new Error("Network response was not ok");
    } catch (error) {
        console.error("Network first strategy failed:", error);
        const cachedResponse = await getData(request.url);

        if (cachedResponse) {
            console.log("Using cached response:", cachedResponse);
            return new Response(JSON.stringify(cachedResponse), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response("[]", { status: 200 });
    }
}

self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);
    return;
    event.respondWith(dynamicCaching(request));
});