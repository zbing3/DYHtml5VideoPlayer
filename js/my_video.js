$(document).ready(function() {

	$('a.button').click(function() {
		$(this).blur();
	});
	
	function second2TimeString (sec) {
		if (sec <= 0) {
			return '0:00:00';
		}
		
		var hour = Math.floor(sec / 3600);
		var strHour = '' + hour;
		
		var min = Math.floor((sec - hour * 3600) / 60);
		var strMin = min < 10 ? '0' + min : '' + min;
		
		var second = sec - hour * 3600 - min * 60;
		var strSecond = second < 10 ? '0' + second : '' + second;
		
		return [strHour, strMin, strSecond].join(':');
	}

	function playFrom (time) {
		if(time == 'none') {
			return;
		}
		
		var video = document.getElementById('video');		
		video.currentTime = time;
	}


	function Rect (x, y, width, height, time) {
		// body...
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.time = time;
	}

	Rect.prototype.containPoint = function(point) {
		var deltaX = point.x - this.x;
		var deltaY = point.y - this.y;

		if(deltaX >= 0 && deltaX <= this.width
				&& deltaY >= 0 && deltaY <= this.height) {
			return true;
		}

		return false;
	};


	var Regions = {
		tin: false,
		tout: false
	};

	function trim (x, y, imgWidth, imgHeight, $trim) {
		var video = document.getElementById('video');
		
		var trimCanvas = document.getElementById('trims-canvas');
		var ctx = trimCanvas.getContext('2d');
		
		var vWidth = video.videoWidth;
		var vHeight = video.videoHeight;
		//var height = vHeight / vWidth * imgWidth;

		var width = vWidth / vHeight * imgHeight;
		var posX = (imgWidth - width)/ 2 + x;		
		
		ctx.drawImage(video, 0, 0, vWidth, vHeight, posX, y, width, imgHeight);
	
		var currentTime = video.currentTime;
		var timeString = second2TimeString(Math.floor(currentTime));
		var currentSec = Math.floor(currentTime);

		$trim.attr('trimTime', currentSec).html(timeString);

		return new Rect(posX, y, width, imgHeight, currentSec);
	}
	
	$('a.btn-trim-in').click(function(e) {
		e.preventDefault();
		var region = trim(10, 10, 160, 88, $('.trim-time-in'));
		Regions.tin = region;
	});
	
	
	$('a.btn-trim-out').click(function(e) {
		e.preventDefault();
		var region = trim(190, 10, 160, 88, $('.trim-time-out'));
		Regions.tout = region;
	});

	
	$('.trim-time-in, .trim-time-out').bind('click', function() {
		var time = $(this).attr('trimTime');
		playFrom(time);
	});
	
	$('#trims-canvas').click(function(e) {
		var x = e.offsetX;
		var y = e.offsetY;

		for(var prop in Regions) {
			var rect = Regions[prop];
			if(rect.containPoint({x:x, y:y})) {
				playFrom(rect.time);
			}
		}
	});
});






