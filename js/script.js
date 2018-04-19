//---------------------------------------------------------------------------
//
//
//
//

/*******************************************/
/****** PROGRESSIVE WEB APPS FEATURES ******/
/*******************************************/





/*----------------------*/
/*--- Service Worker ---*/
/*----------------------*/

/****** PWA need to register at browser's Service Worker ******/


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

	greenButtons: $('.green-arrow'),
	scrollToMap: $('.scroll-to-map'),
	scrollToForm: $('#scrolldown-to-form'),
	scrollToHome: $('#scrollup-to-home'),

	homeSection: $('#home'),
	bookingSection: $('#booking'),
	mapSection: $('#map-container'),
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






//--------------------------------------------------------------------

var app = (function () {

	var me = {};

	me.timer = function () {
		var totalSeconds = Math.floor(1200 - ((Date.now() - DataBase.registeredTime) / 1000)),
			seconds = totalSeconds % 60;
		totalSeconds = (totalSeconds - seconds) / 60;
		var minutes = totalSeconds % 60;
		if (seconds > -1 && minutes > -1)
			$DOM.registeredBlock.css('display', 'block');
		else
			$DOM.registeredBlock.css('display', 'none');
		$DOM.timerZone.text(minutes + ' min ' + seconds + ' sec.');
	};


	return me;
})();







/***********************/
/****** FUNCTIONS ******/
/***********************/





function sizing() {
	//canvas has to be (re)size with js for it works
	Signature.canvas.attr('width', $DOM.canvasWrapper.width());

	//To display the .panel-body at the entire screen, we need to substract the .panel-heading's padding
	var mapHeight = ($DOM.mapSection.height() - $DOM.mapSection.find('.panel-heading').height() - 20)
	$DOM.mapSection.find('.panel-body').height(mapHeight);
}


//--------------------------------------------------------------------
//
//
//
//

/**********************************/
/****** DOM EVENTS LISTENERS ******/
/**********************************/



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

	//Take care of all controls are filling including Signature
	var formIsFullfill = 0;
	$DOM.formControls.each(function () {
		if ($(this).children('input').val() !== undefined) {
			if ($(this).children('input').val() === '') {
				$(this).addClass('has-error').children('span').css('opacity', 1);
			} else {
				$(this).removeClass('has-error').addClass('has-success').children('span').css('opacity', 0);
				formIsFullfill++;
			}
		} else if (!Signature.done) {
			$(this).addClass('has-error').children('span').css('opacity', 1);
		} else {
			$(this).removeClass('has-error').addClass('has-success').children('span').css('opacity', 0);
			formIsFullfill++;
		}
	});

	//If all form controls are filled and the choosen station got at least one bike
	if (formIsFullfill === 3 && GoogleMaps.$availableBikes.eq(0).text() > 0) {

		var name = $DOM.formValues.name.val(),
			surname = $DOM.formValues.surname.val(),
			signed = Signature.done,
			stationName = $DOM.stationDatas.id.text(),
			stationAddress = $DOM.stationDatas.address.text(),
			bikes = $DOM.stationDatas.bikes.text();

		//Saving datas
		DataBase.add(name, surname, signed, stationName, stationAddress, bikes);

		// Display the registered window with timer
		$DOM.registeredBlock.css('display', 'block');
		$DOM.registeredBlock.find('.station-id').text(stationName);

	}
});

$(window).resize(function () {
	Signature.done = false;
	sizing();
});


//--------------------------------------------------------------------


/****** Page loaded, script begin ******/
$(function () {
	Slideshow.loadSlide();
	sizing();
});
//-----------------------------------------------------------------END









//---------------------------------------------------------TEST ZONE
