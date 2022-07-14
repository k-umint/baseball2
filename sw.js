// const WorkboxPlugin = require('workbox-webpack-plugin');
// const cacheId = 'imguma';
// module.exports = [{
//     plugins: [
//         new WorkboxPlugin.GenerateSW({
//             cacheId: cacheId,
//             swDest: path.join(OUTPUT.rootStaticAbsolutePath, 'sw.js'),
//             clientsClaim: true,
//             skipWaiting: true,
//             offlineGoogleAnalytics: true,
//             directoryIndex: '/',
//             cleanupOutdatedCaches: true,
//         }),
//     ]
// }]

var CACHE_NAME = 'pwa-sample-caches';
var urlsToCache = [
    // キャッシュ化したいコンテンツ
];

self.addEventListener('install', function(event) {
    console.log('sw event: install called');

    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log('sw event: fetch called');

    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            return response ? response : fetch(event.request);
        })
    );
});

self.addEventListener('push', function(event) {
    console.log('sw event: push called');

    var notificationDataObj = event.data.json();
    var content = {
        body: notificationDataObj.body,
    };
    event.waitUntil(
        self.registration.showNotification(notificationDataObj.title, content)
    );
});