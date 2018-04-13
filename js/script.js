/*******************************/
/****** GOOGLE MAPS'S API ******/
/*******************************/


$('#map').html('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAo-wOejIa5KeD-XsqSQA9LN79efwmxOkY&callback=initMap" async defer></script>');

var $template = $('.template'), //Must have a DOM object for maps.InfoWindow
	$stationName = $('.station-name'),
	$availableBikes = $('.available-bikes'),
	$availableStands = $('.available-stands'),


	$infoWindowsWrapper = $('#info-windows-wrapper');


function initMap() {

	var map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 45.74,
			lng: 4.83
		},
		zoom: 15
	});

	ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=51d504f995e48a567cd425dc85f0771829b79a65",
		function (result) {
			var stations = JSON.parse(result);

			var markers = stations.map(function (station) {

				var infos = {
						name: station.name,
						address: station.address,
						bikes: station.available_bikes,
						stands: station.available_bike_stands,
						banking: (station.banking) ? 'Oui' : 'Non',
						bonus: (station.bonus) ? 'Oui' : 'Non'
					},
					colorNumber = function (int) {
						if (int < 1)
							return 'red';
						return (int < 6) ? 'orange' : 'green';
					}

				$templateCloned = $template.clone(true);

				$templateCloned.removeClass('template').addClass('clone');
				$templateCloned.css('color', 'black');
				$templateCloned.find('.station-name').text(infos.address);
				$templateCloned.find('.available-bikes').text(infos.bikes);
				$templateCloned.find('.available-stands').text(infos.stands);

				$infoWindowsWrapper.append($templateCloned);

				var marker = new google.maps.Marker({
					position: station.position,
					map: map,
					icon: getMarker(infos.bikes)
				});
				attachInfoWindow(marker, $templateCloned, infos);
				return marker;
			});


		});
}

function getMarker(availableBikes) {
	return (availableBikes > 0) ? 'img/green_marker.png' : 'img/red_marker.png';
}

function attachInfoWindow(marker, $templateCloned, infos) {

	var infoWindow = new google.maps.InfoWindow({
		content: $templateCloned[0]
	});

	function getColor(dataToColor) {
		switch (true) {
			case dataToColor === 'Oui':
			case dataToColor > 5:
				return 'green';
				break;
			case dataToColor === 'Non':
			case dataToColor < 1:
				return 'red';
				break;
			default:
				return 'orange';
				break;
		}
	}



	marker.addListener('click', function () {
		infoWindow.open(map, marker);
		$('#infos-station .station-id').text(infos.name);
		$('#infos-station .station-name').text(infos.address);
		$('#infos-station .available-bikes').text(infos.bikes).css('color', getColor(infos.bikes));
		$('#infos-station .available-stands').text(infos.stands);
		$('#infos-station .banking').text(infos.banking).css('color', getColor(infos.banking));
		$('#infos-station .bonus').text(infos.bonus);

	});
}



//---------------------------------------------------------------------------
//
//
//
//

/*******************************************/
/****** PROGRESSIVE WEB APPS FEATURES ******/
/*******************************************/

/*---------------------------*/
/*----- IndexedDataBase -----*/
/*---------------------------*/

if (!window.indexedDB) //if IDB isn't supported by browser
	alert('Votre navigateur ne supporte pas une version stable d\'IndexedDB. Quelques fonctionnalités ne seront pas disponibles.');

var resultedDatas,
	timer,
	request = window.indexedDB.open("BookNbike", 1);


/****** Methods of request (sub)object ******/
request.onerror = function (event) {
	console.log("Request error" + event);
};
request.onsuccess = function (event) {
	resultedDatas = request.result;
	console.log("success: " + resultedDatas);
	dataBase.read();
};

request.onupgradeneeded = function (event) {
	resultedDatas = event.target.result;
	var objectStore = resultedDatas.createObjectStore("station", {
			keyPath: "id",
			autoIncrement: false
		}),
		index = objectStore.createIndex('NameIndex', 'name');
}



var dataBase = {
	registeredTime: {},
	station: {
		name: '',
		address: '',
		bikes: '',
		stands: '',
		banking: '',
		bonus: ''
	},
	user: {
		name: '',
		surname: ''
	},


	read: function () {
		var transaction = resultedDatas.transaction(["station"]);
		var objectStore = transaction.objectStore("station");
		var request = objectStore.get(1);

		request.onerror = function (event) {
			console.log("Unable to retrieve data from database!");
		};

		request.onsuccess = function (event) {
			// Do something with the request.result!
			if (request.result) {

				console.log("Nom: " + request.result.name + ", prénom: " + request.result.surname + ", signé: " + request.result.signed + ", date: " + request.result.date);
				console.log('Station: ' + request.result.stationName + ', adresse: ' + request.result.address + ', vélos dispo: ' + request.result.bikes);
				dataBase.registeredTime = request.result.date;
				dataBase.station.name = request.result.stationName;
				dataBase.station.address = request.result.address;
				$DOM.registeredBlock.find('.station-id').text(dataBase.station.name);
				$DOM.registeredBlock.find('.station-name').text(dataBase.station.address);
			} else {
				console.log("This store is empty");
			}
			timer = setInterval(bookingTimer, 1000);

		};
	},

	add: function (name, surname, signed, stationName, address, bikes) {
		dataBase.remove();
		var request = resultedDatas.transaction(["station"], "readwrite")
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
			dataBase.read();
		};

		request.onerror = function () {
			console.log("Unable to add data\r\nid is aready exist in your database! ");
		}
		//timer = setInterval(bookingTimer, 1000);
	},

	remove: function () {
		var request = resultedDatas.transaction(["station"], "readwrite")
			.objectStore("station")
			.delete(1);

		request.onsuccess = function (event) {
			console.log("IDB entry has been removed");
		};
	}
}



/*----------------------*/
/*--- Service Worker ---*/
/*----------------------*/

/****** PWA need to register at browser's Service Worker ******/
/*
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
}*/
//--------------------------------------------------------------------
//
//
//
//

/******************************/
/****** GLOBAL VARIABLES ******/
/******************************/

/****** Get DOM elements as properties of $DOM object ******/
var $DOM = {
	panel: $('.panel'),
	panelBody: $('.panel-body'),
	panelHeading: $('.panel-heading'),
	forthButton: $('#forth-button'),
	backButton: $('#back-button'),
	greenButtons: $('.green-arrow'),
	scrollToMap: $('.scroll-to-map'),
	scrollToForm: $('#scrolldown-to-form'),
	scrollToHome: $('#scrollup-to-home'),
	slideTitle: $('#slide-title'),
	slideContent: $('#slide-content'),
	slideDescription: $('#slide-description'),
	homeSection: $('#home'),
	bookingSection: $('#booking'),
	formSection: $('#form'),
	dataColored: $('.data-color'),
	registeredBlock: $('#registered'),
	timerZone: $('.timer'),
	formSubmit: $('#book-up'),
	formControls: $('.mb-3'),
	canvasWrapper: $('#canvas-wrapper'),
	formValues: {
		name: $('#name'),
		surname: $('#surname')
	},
	stationDatas: {
		id: $('#infos-station .station-id'),
		address: $('#infos-station .station-name'),
		bikes: $('#infos-station .available-bikes')
	}
};



/***** Make every slide an object by a prototype ******/
var slidePrototype = {
		init: function (title, index, description) {
			this.title = title;
			this.url = 'url("img/slide-' + index + '.png")';
			this.description = description;
		}
	},

	slides = [],

	titles = ["Bienvenue sur Book-N-Bike", 'Application multi-plateforme.', '1. Parcourez la carte pour trouver une station.', '2. Séléctionnez une station pour obtenir plus d\'infos.', "3. Remplissez le formulaire, signez, c'est réservé !", ],

	descriptions = ["Vous déplacer en ville n'aura jamais été aussi simple. <br>Suivez le guide...", "Utilisez Book-N-Bike où que vous soyez, depuis n'importe quel périphérique en seulement 3 étapes !", 'En un coup d\'oeil repérez toutes les stations près de chez vous.', "Ne vous déplacez plus pour rien, grace à Book-N-Bike vous savez en direct si un vélo est disponible à la station de votre choix.", 'Après envoi du formulaire, votre city bike vous est résevé pendant 20 minutes. <br>Chaque nouvelle réservation annule la précédente.']


/****** Each slide has his own title, picture and description ******/
for (var slideNum = 0; slideNum < 5; slideNum++) {
	slides[slideNum] = Object.create(slidePrototype);
	slides[slideNum].init(titles[slideNum], slideNum, descriptions[slideNum])
};

var slidesCounter = 0;

var isTouchDevice = 'ontouchstart' in document.documentElement;


var pressDownType = function () {
	if ('ontouchstart' in document.documentElement)
		return 'touchstart';
	else
		return 'mousedown';
};

var moveType = function () {
	if ('ontouchstart' in document.documentElement)
		return 'touchmove';
	else
		return 'mousemove';
};

var endType = function () {
	if ('ontouchstart' in document.documentElement)
		return 'touchend';
	else
		return 'mouseup';
};
//--------------------------------------------------------------------

/***************************/
/****** CANVAS OBJECT ******/
/***************************/

var signature = {
	painting: false,
	started: false,
	canvas: $("#canvas"),
	done: false,

	drawLine: function () {

		if (!signature.started) {
			signature.context.beginPath();
			signature.context.moveTo(signature.cursorX, signature.cursorY);
			signature.started = true;
			signature.done = true;
		} else {
			signature.context.lineTo(signature.cursorX, signature.cursorY);
			signature.context.strokeStyle = '#000';
			signature.context.lineWidth = 4;
			signature.context.stroke();
		}

	},
	move: function (e, mobile, obj) {
		if (signature.painting) {
			if (mobile) {
				// Event mobile :
				var ev = e.originalEvent;
				e.preventDefault();

				// Set finger coordinates
				signature.cursorX = (ev.targetTouches[0].pageX - obj.offsetLeft); // 10 = décalage du curseur
				signature.cursorY = (ev.targetTouches[0].pageY - obj.offsetTop);
			} else {
				// Set mouse coordinates
				signature.cursorX = (e.pageX - obj.offsetLeft); // 10 = cursor's shift
				signature.cursorY = (e.pageY - obj.offsetTop);
			}
			signature.drawLine();
		}
	},
	moveEnd: function () {
		signature.painting = false;
		signature.started = false;
	},
	moveStart: function (e, mobile, obj) {
		signature.painting = true;

		if (mobile) {
			// Event mobile :
			var ev = e.originalEvent;
			e.preventDefault();

			// Set finger coordinates
			signature.cursorX = (ev.pageX - obj.offsetLeft); // 10 = cursor's shift
			signature.cursorY = (ev.pageY - obj.offsetTop);
		} else {
			// Set mouse coordinates
			signature.cursorX = (e.pageX - this.offsetLeft);
			signature.cursorY = (e.pageY - this.offsetTop);
		}
	}
}
// Set canvas context
signature.context = signature.canvas[0].getContext('2d');
signature.context.globalCompositeOperation = 'destination-over';
signature.context.lineJoin = 'round';
signature.context.lineCap = 'round';

// -----------------------
// Finger events
// -----------------------

signature.canvas.bind('touchstart', function (e) {
	signature.moveStart(e, true, this);
});

$(this).bind('touchend', function () {
	signature.moveEnd();
});

signature.canvas.bind('touchmove', function (e) {
	signature.move(e, true, this);
});

// -----------------------
// Mouse events
// -----------------------

signature.canvas.mousedown(function (e) {
	signature.moveStart(e, false, this);
});

$(this).mouseup(function () {
	signature.moveEnd();
});

signature.canvas.mousemove(function (e) {
	signature.move(e, false, this);
});








/*----------------------------------------*/









/***********************/
/****** FUNCTIONS ******/
/***********************/

function loadSlide() {
	$DOM.slideTitle.text(slides[slidesCounter].title);
	$DOM.slideContent.css('background-image', slides[slidesCounter].url);
	$DOM.slideDescription.html(slides[slidesCounter].description);
	if (slidesCounter === (slides.length - 1)) {
		$DOM.forthButton.addClass('inactive');
		$DOM.scrollToMap.eq(0).removeClass('inactive');
	} else if (slidesCounter === 0)
		$DOM.backButton.addClass('inactive');
}

function bookingTimer() {
	var totalSeconds = Math.floor(1200 - ((Date.now() - dataBase.registeredTime) / 1000)),
		seconds = totalSeconds % 60;
	totalSeconds = (totalSeconds - seconds) / 60;
	var minutes = totalSeconds % 60;
	if (seconds > -1 && minutes > -1)
		$DOM.registeredBlock.css('display', 'block');
	else
		$DOM.registeredBlock.css('display', 'none');
	$DOM.timerZone.text(minutes + ' min ' + seconds + ' sec.');
};

function sizing() {
	signature.canvas.attr('width', $DOM.canvasWrapper.width());
	$DOM.panel.each(function () {
		$(this).children('.panel-body').height($(this).height() - $(this).children('.panel-heading').height() - 20); //Need to substract the padding of .panel-heading
	});
}
//--------------------------------------------------------------------
//
//
//
//

/******************************/
/****** DOM EVENTS LISTENERS ******/
/******************************/

$DOM.forthButton.click(function () {
	slidesCounter++;
	$DOM.backButton.removeClass('inactive');
	loadSlide();
});

$DOM.backButton.click(function () {
	slidesCounter--;
	$DOM.forthButton.removeClass('inactive')
	loadSlide();
});

$DOM.greenButtons.hover(function () {
	$(this).css('color', '#00ff39');
}, function () {
	$(this).css('color', '#85CBF8')
});

$DOM.scrollToMap.click(function () {
	$('html, body').animate({
		scrollTop: $DOM.bookingSection.offset().top
	}, 1000);
});

$DOM.scrollToForm.click(function () {
	$('html, body').animate({
		scrollTop: $DOM.formSection.offset().top
	}, 1000);
});

$DOM.scrollToHome.click(function () {
	$('html, body').animate({
		scrollTop: $DOM.homeSection.offset().top
	}, 1000);
});
$DOM.registeredBlock.click(function () {
	$(this).children('.panel-body').toggle();
});

$DOM.formSubmit.click(function () {
	//Take care of all controls are filling including signature
	var formIsFullfill = 0;
	$DOM.formControls.each(function () {
		if ($(this).children('input').val() !== undefined) {
			if ($(this).children('input').val() === '') {
				$(this).addClass('has-error').children('span').css('opacity', 1);
			} else {
				$(this).removeClass('has-error').addClass('has-success').children('span').css('opacity', 0);
				formIsFullfill++;
			}
		} else if (!signature.done) {
			$(this).addClass('has-error').children('span').css('opacity', 1);
		} else {
			$(this).removeClass('has-error').addClass('has-success').children('span').css('opacity', 0);
			formIsFullfill++;
		}
	});
	if (formIsFullfill === 3 && $availableBikes.eq(0).text() > 0) {
		dataBase.add($DOM.formValues.name.val(), $DOM.formValues.surname.val(), signature.done, $DOM.stationDatas.id.text(), $DOM.stationDatas.address.text(), $DOM.stationDatas.bikes.text());
		$DOM.registeredBlock.css('display', 'block');
		$DOM.registeredBlock.find('.station-id').text(dataBase.station.name);

	}
});

$(window).resize(function () {
	signature.done = false;
	sizing();
});


//--------------------------------------------------------------------


/****** Page loaded, script begin ******/
$(function () {
	loadSlide();
	sizing();

});
//-----------------------------------------------------------------END









//---------------------------------------------------------TEST ZONE
