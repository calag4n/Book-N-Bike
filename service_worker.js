var cacheName = 'Pwa',
	filesToCache = [
        		'/',
        		'/service_worker.js',
        		'/index.html',
				'/css/bootstrap.min.css',
				'/css/styles.css',
				'/js/jquery-3.3.1.js',
				'/js/bootstrap.min.js',
				'/js/ajax.js',
				'/js/GoogleMaps.js',
				'/js/DataBase.js',
				'/js/Slideshow.js',
				'/js/Signature.js',
				'/js/script.js',
				'/img/slide-0.png',
				'/img/slide-1.png',
				'/img/slide-2.png',
				'/img/slide-3.png',
				'/img/slide-4.png',
      			];

// This add all the files to cache
self.addEventListener('install', function (e) {
	console.log('Service worker installed');
	e.waitUntil(
		caches.open(cacheName).then(function (cache) {
			return cache.addAll(filesToCache);
		})
	)
});

//This code ensures that service worker updates its cache whenever any of the file to cache has changed
self.addEventListener('activate', function (e) {
	console.log('[ServiceWorker] Activate');
	e.waitUntil(
		caches.keys().then(function (keyList) {
			return Promise.all(keyList.map(function (key) {
				if (key !== cacheName) {
					console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);

	// Lets activate the service worker faster.
	return self.clients.claim();
});

// Now serve files from cache
self.addEventListener('fetch', function (e) {
	console.log('ServiceWorker fetch : ' + e.request.url);
	e.respondWith(
		caches.match(e.request).then(function (response) {
			console.log('Fetched : ' + (response || fetch(e.request)));
			return response || fetch(e.request);
		})
	);
});
