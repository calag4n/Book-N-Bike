var cacheName = 'PWa',
	filesToCache = [
        		'/',
				// '/service_worker.js',
				'/manifest.json',
				'/index.html',
				'/favicon.png',
				// '/bootstrap.min.css',
				'/css/styles.css',
				// '/jquery-3.3.1.min.js',
				// '/bootstrap.min.js',
				'/js/GoogleMaps.js',
				'/js/DataBase.js',
				'/js/Slideshow.js',
				'/js/Signature.js',
				'/js/App.js',
				'/img/blank.png',
				'img/bg.png',
				'/img/slide-0.png',
				'/img/slide-1.png',
				'/img/slide-2.png',
				'/img/slide-3.png',
				'/img/slide-4.png',
				'https://code.jquery.com/jquery-3.3.1.min.js',
				'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
				'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
				'https://fonts.googleapis.com/css?family=Damion|Lobster',
				'https://use.fontawesome.com/releases/v5.0.8/js/all.js',
				'https://maps.googleapis.com/maps/api/js?key=AIzaSyAo-wOejIa5KeD-XsqSQA9LN79efwmxOkY&callback=GoogleMaps.init'
      			];

// This add all the files to cache
self.addEventListener('install', function (e) {
	//console.log('Service worker installed');
	e.waitUntil(
		caches.open(cacheName).then(function (cache) {
			return cache.addAll(filesToCache);
		})
	)
});

//This code ensures that service worker updates its cache whenever any of the file to cache has changed
self.addEventListener('activate', function (e) {
	//console.log('[ServiceWorker] Activate');
	e.waitUntil(
		caches.keys().then(function (keyList) {
			return Promise.all(keyList.map(function (key) {
				if (key !== cacheName) {
					//console.log('[ServiceWorker] Removing old cache', key);
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
	//console.log('ServiceWorker fetch : ' + e.request.url);
	e.respondWith(
		caches.match(e.request).then(function (response) {
			//console.log('Fetched : ' + (response || fetch(e.request)));
			return response || fetch(e.request);
		})
	);
});
