/***********************/
/****** SLIDESHOW ******/
/***********************/

var Slideshow = (function () {

	var me = {};


	/* SLIDESHOW'S METHOD
	-------------------------------------------------------*/

	me.loadSlide = function () {

		// Display figure, title and description according to slidesCounter
		$slideTitle.text(slides[slidesCounter].title);
		$slideDescription.html(slides[slidesCounter].description);
		$DOM.greenButtons.attr('disabled', true);
		$slideContent.animate({
			opacity: 0
		}, 200, function () {
			$slideContent.css('background-image', slides[slidesCounter].url);
		}).animate({
			opacity: 1
		}, function () {
			$DOM.greenButtons.attr('disabled', false);
		});

		if (slidesCounter === (slides.length - 1)) {
			$forthButton.addClass('inactive');
			$DOM.scrollToMap.eq(0).removeClass('inactive');
		} else if (slidesCounter === 0)
			$backButton.addClass('inactive');
	};


	/* PRIVATE FUNCTIONS & VARIABLES
	---------------------------------------------------------*/

	// That says witch is the current slide to display
	var slidesCounter = 0;

	// Get DOM elements for slideshow using
	var $forthButton = $('#forth-button'),
		$backButton = $('#back-button'),
		$slideTitle = $('#slide-title'),
		$slideContent = $('#slide-content'),
		$slideDescription = $('#slide-description');

	// Each slide object wil be indexed in an array
	var slides = [];

	// Each title and description is firstly store in array 
	var titles = [
		'Bienvenue sur Book-N-Bike',
		'Application multi-plateforme.',
		'1. Parcourez la carte pour trouver une station.',
		'2. Séléctionnez une station pour obtenir plus d\'infos.',
		'3. Remplissez le formulaire, signez, c\'est réservé !'];

	var descriptions = [
		"Vous déplacer en ville n'aura jamais été aussi simple. <br>Suivez le guide...",
		"Utilisez Book-N-Bike où que vous soyez, depuis n'importe quel périphérique en seulement 3 étapes !",

		'En un coup d\'oeil repérez toutes les stations près de chez vous.',

		"Ne vous déplacez plus pour rien, grace à Book-N-Bike vous savez en direct si un vélo est disponible à la station de votre choix.",

		'Après envoi du formulaire, votre city bike vous est résevé pendant 20 minutes. <br>Chaque nouvelle réservation annule la précédente.'];

	// Make every slide an object by a prototype
	var slidePrototype = {
		init: function (title, index, description) {
			this.title = title;
			this.url = 'url("img/slide-' + index + '.png")';
			this.description = description;
		}
	};

	// Each slide get his own title, picture and description
	for (var slideNum = 0; slideNum < 5; slideNum++) {
		slides[slideNum] = Object.create(slidePrototype);
		slides[slideNum].init(titles[slideNum], slideNum, descriptions[slideNum])
	};


	/* EVENT LISTENERS
	---------------------------------------------*/

	$forthButton.click(function () {
		slidesCounter++;
		$backButton.removeClass('inactive');
		me.loadSlide();
	});

	$backButton.click(function () {
		slidesCounter--;
		$forthButton.removeClass('inactive')
		me.loadSlide();
	});

	return me;
})();
