/*---------------------------*/
/*----- IndexedDataBase -----*/
/*---------------------------*/
//
// I've chose to use Indexed DataBase because its requests are
// async, that is not true with LocalStorage or SessionStorage.
//
// Also, IDB is the browser storage that is advise by Google Lighthouse
// in their Progressive Web Apps policies.
// Steeve.

var DataBase = (function () {

	if (!window.indexedDB) //if IDB isn't supported by browser
		alert('Votre navigateur ne supporte pas une version stable d\'IndexedDB. Certaines fonctionnalités ne seront pas disponibles. Veuillez mettre à jour votre navigateur.');


	var me = {
		registeredTime: {},
		station: {
			name: '',
			address: '',
			bikes: ''
		},
		user: {
			name: '',
			surname: ''
		}
	};

	/* PUBLIC FUNCTIONS
	-----------------------------------------------------------*/

	me.read = function () {
		var transaction = resultedData.transaction(["station"]);
		var objectStore = transaction.objectStore("station");
		var request = objectStore.get(1);

		request.onerror = function (event) {
			console.log("Unable to retrieve data from database!");
		};

		request.onsuccess = function (event) {

			if (request.result) {

				console.log("Nom: " + request.result.name + ", prénom: " + request.result.surname + ", signé: " + request.result.signed + ", date: " + request.result.date);
				console.log('Station: ' + request.result.stationName + ', adresse: ' + request.result.address + ', vélos dispo: ' + request.result.bikes);
				DataBase.registeredTime = request.result.date;
				DataBase.station.name = request.result.stationName;
				DataBase.station.address = request.result.address;
				DataBase.station.bikes = request.result.bikes;
				DataBase.user.name = request.result.name;
				DataBase.user.surname = request.result.surname ;
				$DOM.registeredBlock.find('.station-id').text(DataBase.station.name);
				$DOM.registeredBlock.find('.station-name').text(DataBase.station.address);

			} else {
				console.log("This store is empty");
			}
			setInterval(App.timer, 1000);
		};
	};

	me.add = function (name, surname, signed, stationName, address, bikes) {
		DataBase.remove();
		var request = resultedData.transaction(["station"], "readwrite")
			.objectStore("station")
			.add({
				id: 1,
				name: name,
				surname: surname,
				signed: signed,
				stationName: stationName,
				address: address,
				bikes: bikes,
				date: Date.now()
			});

		request.onsuccess = function () {
			console.log(name + ' is added to DB');
			DataBase.read();
		};

		request.onerror = function () {
			console.log("Unable to add data\r\nid is aready exist in your database! ");
		}
	};

	me.remove = function () {
		var request = resultedData.transaction(["station"], "readwrite")
			.objectStore("station")
			.delete(1);

		request.onsuccess = function (event) {
			console.log("IDB entry has been removed");
		};
	};

	me.update = function(){
		if (resultedData){
			var store = resultedData.transaction(["station"], "readwrite")
			.objectStore("station");
			var request = store.get(1);

			request.onsuccess = function(){
				if (request.result){
					var data = request.result;
					console.log(data);
					data.address = "";
					data.bikes = "";
					data.date ="";
					data.signed ="";
					data.stationName ="";
					
					var updatedData = store.put(data);
					updatedData.onsuccess = function(){
						console.log("Data updated : " + data);
					};
				}else{
					console.log("No entry yet");
				}
			};

			request.onerror = function () {
				console.log("No entry yet");
			};
		}
	};
	/* PRIVATE FUNCTIONS
	-----------------------------------------------------------*/

	var resultedData,
		timer,
		request = window.indexedDB.open("BookNbike", 1);

	/****** Methods of request (sub)objects ******/
	request.onerror = function (event) {
		console.log("Request error" + event);
	};
	request.onsuccess = function (event) {
		resultedData = request.result;
		console.log("success: " + resultedData);
		DataBase.read();
	};

	request.onupgradeneeded = function (event) {
		resultedData = event.target.result;
		var objectStore = resultedData.createObjectStore("station", {
				keyPath: "id",
				autoIncrement: false
			})//,
			// index = objectStore.createIndex('NameIndex', 'name');
	};

	return me;
})();
