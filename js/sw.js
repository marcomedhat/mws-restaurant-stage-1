const defaultCacheName = 'restaurant-reviews-v3';

let images =[];
for(let i = 0; i <= 10; i++){
	images.push('./images/${i}.jpg');
}

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(defaultCacheName).then(cache => {
			cache.addAll(images);
			return cache.addAll([
				'./',
				'./index.html',
				'./restaurant.html',
				'./js/main.js',
				'./js/dbhelper.js',
				'./js/restaurant_info.js',
				'./js/sw_registration.js',
				'./data/restaurants.json',
				'./css/styles.css'
			]);
		}).then(self.skipWaiting())	
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.filter(cacheName => {
					return cacheName.startsWith('restaurant-') &&
							cacheName != defaultCacheName;
				}).map(cacheName => {
					return caches.delete(cacheName);
				})
			);
		})
	);
});

self.addEventListener("fetch", event => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          // console.log("[ServiceWorker] Found in cache ", event.request.url);
          return response;
        }
        return fetch(event.request);
      })
    );
  }
});

