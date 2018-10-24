/******************************************/
/****** CANVAS ELEMENT FOR SIGNATURE ******/
/******************************************/

var Signature = (function () {

	var me = {
		canvas: $("#canvas"),
		context: {},
		done: false
	};


	/* PUBLIC SCOPE
	-----------------------------------------------*/

	// Set canvas context
	me.context = me.canvas[0].getContext('2d');
	
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

	/* PRIVATE SCOPE
	---------------------------------------------------*/
	var painting = false,
		started = false,
		cursorX,
		cursorY;
	
	function drawLine() {

		if (!started) {
			me.context.beginPath();
			me.context.moveTo(cursorX, cursorY);
			started = true;
			me.done = true;
		} else {
			me.context.lineTo(cursorX, cursorY);
			me.context.strokeStyle = '#000';
			me.context.lineWidth = 4;
			me.context.stroke();
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

	return me;
})();




//--------------------------------------------------- END
