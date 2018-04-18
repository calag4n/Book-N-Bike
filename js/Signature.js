/******************************************/
/****** CANVAS ELEMENT FOR SIGNATURE ******/
/******************************************/

var Signature = (function () {

	var me = {
		canvas: $("#canvas"),
		done: false
	};

	// Set canvas context
	var context = me.canvas[0].getContext('2d');
	context.globalCompositeOperation = 'destination-over';
	context.lineJoin = 'round';
	context.lineCap = 'round';

	var painting = false,
		started = false,
		cursorX,
		cursorY;

	function drawLine() {

		if (!started) {
			context.beginPath();
			context.moveTo(cursorX, cursorY);
			started = true;
			me.done = true;
		} else {
			context.lineTo(cursorX, cursorY);
			context.strokeStyle = '#000';
			context.lineWidth = 4;
			context.stroke();
		}
	}

	function move(e, mobile, obj) {
		if (painting) {
			if (mobile) {
				// Event mobile :
				var ev = e.originalEvent;
				e.preventDefault();

				// Set finger coordinates
				cursorX = (ev.targetTouches[0].pageX - obj.offsetLeft); // 10 = décalage du curseur
				cursorY = (ev.targetTouches[0].pageY - obj.offsetTop);
			} else {
				// Set mouse coordinates
				cursorX = (e.pageX - obj.offsetLeft); // 10 = cursor's shift
				cursorY = (e.pageY - obj.offsetTop);
			}
			drawLine();
		}
	}

	function moveEnd() {
		painting = false;
		started = false;
	}

	function moveStart(e, mobile, obj) {
		painting = true;

		if (mobile) {
			// Event mobile :
			var ev = e.originalEvent;
			e.preventDefault();

			// Set finger coordinates
			cursorX = (ev.pageX - obj.offsetLeft); // 10 = cursor's shift
			cursorY = (ev.pageY - obj.offsetTop);
		} else {
			// Set mouse coordinates
			cursorX = (e.pageX - this.offsetLeft);
			cursorY = (e.pageY - this.offsetTop);
		}
	}

	// -----------------------
	// Finger events
	// -----------------------

	me.canvas.bind('touchstart', function (e) {
		moveStart(e, true, this);
	});

	$(window).bind('touchend', function () {
		moveEnd();
	});

	me.canvas.bind('touchmove', function (e) {
		move(e, true, this);
	});

	// -----------------------
	// Mouse events
	// -----------------------

	me.canvas.mousedown(function (e) {
		moveStart(e, false, this);
	});

	$(window).mouseup(function () {
		moveEnd();
	});

	me.canvas.mousemove(function (e) {
		move(e, false, this);
	});

	return me;
})();




//--------------------------------------------------- END
