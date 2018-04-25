/*******************************/
/****** GOOGLE MAPS'S API ******/
/*******************************/

var GoogleMaps = (function () {

	//Object returned
	var me = {

		//Must have  DOM objects for maps.InfoWindow
		$template: $('.template'),
		$stationName: $('.station-name'),
		$availableBikes: $('.available-bikes'),
		$availableStands: $('.available-stands'),
		$infoWindowsWrapper: $('#info-windows-wrapper')
	};

	$('#map').html('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAo-wOejIa5KeD-XsqSQA9LN79efwmxOkY&callback=GoogleMaps.init" async defer></script>');


	/* PUBLIC FUNCTIONS
	-----------------------------------------------------------*/

	me.init = function () {

		var map = new google.maps.Map(document.getElementById('map'), {
			center: {
				lat: 45.74,
				lng: 4.83
			},
			zoom: 15
		});

		// GET AJAX request
		$.get("https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=51d504f995e48a567cd425dc85f0771829b79a65",

			// Callback
			function (stations) {

				//Browse through the array for making a marker for each station
				var markers = stations.map(function (station) {

					var infos = {
						name: station.name,
						address: station.address,
						bikes: station.available_bikes,
						stands: station.available_bike_stands,
						banking: (station.banking) ? 'Oui' : 'Non',
						bonus: (station.bonus) ? 'Oui' : 'Non'
					}

					var $templateCloned = me.$template.clone(true);

					$templateCloned.removeClass('template').addClass('clone');
					$templateCloned.css('color', 'black');
					$templateCloned.find('.station-name').text(infos.address);
					$templateCloned.find('.available-bikes').text(infos.bikes);
					$templateCloned.find('.available-stands').text(infos.stands);

					me.$infoWindowsWrapper.append($templateCloned);

					var marker = new google.maps.Marker({
						position: station.position,
						map: map,
						icon: getMarker(infos.bikes)
					});
					attachInfoWindow(marker, $templateCloned, infos);
					return marker;
				});

			}, "json");
	}

	/* PRIVATE FUNCTIONS
	-----------------------------------------------------------*/

	//Will display either red or green icon according to bikes availability
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


	return me;
})();
