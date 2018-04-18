var filesToCache = [
        		'/',
        		'/service_worker.js',
        		'/index.html',
				'/css/bootstrap.min.css',
				'/css/styles.css',
				'/js/jquery-3.2.1.js',
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


self.addEventListener('install', function (e) {
	console.log('Service worker installed');
	e.waitUntil(
		caches.open('pwa').then(function (cache) {
			return cache.addAll(filesToCache);
		})
	)
});

self.addEventListener('fetch', function (e) {
	console.log('ServiceWorker fetch : ' + e.request.url);
	e.respondWith(
		caches.match(e.request).then(function (response) {
			return response || fetch(e.request);
		})
	);
});
