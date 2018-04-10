/*******************************************/
/****** PROGRESSIVE WEB APPS FEATURES ******/
/*******************************************/

/*---------------*/
/*----- IDB -----*/
/*---------------*/
if (!window.indexedDB)
	alert('Votre navigateur ne supporte pas une version stable d\'IndexedDB. Quelques fonctionnalités ne seront pas disponibles.');

//Open or create the database
var request = window.indexedDB.open('MyAppDatabase', 3);


request.onupgradeneeded = function () {
	var dataBase = request.result;

	// Here comes the storage object 
	var objectStore = dataBase.createObjectStore('MyObjectStore', {
			keyPath: 'id'
		}),
		index = objectStore.createIndex('NameIndex', ['name.last', 'name.first']);
};


request.onsuccess = function () {
	// Start a new transaction
	var dataBase = request.result,
		transaction = dataBase.transaction('MyObjectStore', 'readwrite'),
		objectStore = transaction.objectStore('MyObjectStore'),
		index = objectStore.index('NameIndex');

	//Add some data
	objectStore.put({
		id: 12345,
		name: {
			first: 'John',
			last: 'Doe'
		},
		age: 42
	});
	objectStore.put({
		id: 67890,
		name: {
			first: 'Bob',
			last: 'Smith'
		},
		age: 35
	});

	//Query the data
	var getJohn = objectStore.get(12345),
		getBob = index.get(['Smith', 'Bob']);

	getJohn.onsuccess = function () {
		console.log(getJohn.result.name.first); // => "John"
	};

	getBob.onsuccess = function () {
		console.log(getBob.result.name.first); // => "Bob"
	};

	// Close the database when the transaction is done
	transaction.oncomplete = function () {
		dataBase.close();
	};

};


/*----------------------*/
/*--- Service Worker ---*/
/*----------------------*/

/****** PWA need to register at browser's Service Worker ******/
if ('serviceWorker' in navigator) {
	$(function () {
		navigator.serviceWorker.register('js/service_worker.js').then(
			function (registration) {
				//Succes
				console.log('serviceWorker registration successful with scope: ', registration.scope)
			},
			function (error) {
				console.log('serviceWorker registration failed: ', error)
			});
	});
}
//--------------------------------------------------------------------
