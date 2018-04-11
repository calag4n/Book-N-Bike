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
				console.log("Name: " + request.result.name + ", addresse: " + request.result.address + ", date: " + request.result.date);
				dataBase.registeredTime = request.result.date;
			} else {
				console.log("This store is empty");
			}
			timer = setInterval(bookingTimer, 1000);
		};
	},

	add: function (name, address, bikes) {
		dataBase.remove();
		var request = resultedDatas.transaction(["station"], "readwrite")
			.objectStore("station")
			.add({
				id: 1,
				name: name,
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
		timer = setInterval(bookingTimer, 1000);
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
	timerZone: $('.timer'),
	formSubmit: $('#book-up'),
	formControls: $('.mb-3'),
	canvas: $('#myCanvas'),
	canvasWrapper: $('#canvas-wrapper')
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

//--------------------------------------------------------------------

/***************************/
/****** CANVAS OBJECT ******/
/***************************/

var signature = {
	mousePressed: false,
	lastX: 0,
	lastY: 0,
	ctx: document.getElementById('myCanvas').getContext("2d"),
	done: false,

	draw: function (x, y, isDown) {
		if (isDown) {
			this.ctx.beginPath();
			this.ctx.strokeStyle = 'black';
			this.ctx.lineWidth = 3;
			this.ctx.lineJoin = "round";
			this.ctx.moveTo(this.lastX, this.lastY);
			this.ctx.lineTo(x, y);
			this.ctx.closePath();
			this.ctx.stroke();
		}
		this.lastX = x;
		this.lastY = y;
	},

	clearArea: function () {
		// Use the identity matrix while clearing the canvas
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
	}
};


$DOM.canvas.attr('width', $DOM.canvasWrapper.width());


$DOM.canvas.mousedown(function (e) {
	signature.mousePressed = true;
	signature.draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
});

$DOM.canvas.mousemove(function (e) {
	if (signature.mousePressed) {
		signature.draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
		signature.done = true;
	}
});

$DOM.canvas.mouseup(function (e) {
	signature.mousePressed = false;
});
$DOM.canvas.mouseleave(function (e) {
	signature.mousePressed = false;
});

$(window).resize(function () {
	$DOM.canvas.attr('width', $DOM.canvasWrapper.width());
});









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
	$DOM.timerZone.text('Il reste : ' + minutes + ' minutes et ' + seconds + 'secondes.');
};


//--------------------------------------------------------------------
//
//
//
//

/******************************/
/****** EVENTS LISTENERS ******/
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

$DOM.formSubmit.click(function () {
	$DOM.formControls.each(function () {
		if ($(this).has('input')) {
			if (($(this).children('input').val() === '') || (!signature.done)) {
				$(this).addClass('has-error').children('span').removeAttr('hidden');

			} else
				$(this).removeClass('has-error').addClass('has-success');
		}
	});
});


//--------------------------------------------------------------------


/****** Page loaded, script begin ******/
$(function () {
	loadSlide();

});
//-----------------------------------------------------------------END
