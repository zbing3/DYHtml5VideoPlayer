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

function DYRect (x, y, width, height, time) {
	// body...
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.time = time;
}

DYRect.prototype.containPoint = function(point) {
	var deltaX = point.x - this.x;
	var deltaY = point.y - this.y;

	if(deltaX >= 0 && deltaX <= this.width
			&& deltaY >= 0 && deltaY <= this.height) {
		return true;
	}

	return false;
};

function DYVideo (options) {
	var opts = {
		el: '', //jQuery selector, required
		videoSrc: '',
		autoplay: true, // optional
		fps: 25, // default: 25, optional
		posterSrc: undefined // optional
	};

	this.regions = {
		tin: false,
		tout: false
	};

	$.extend(opts, options);
	// using opts below
	this.options = opts;

	var $root = $(this.options.el).addClass('dy-video');
	this.$el = $root;
	

	this.getEl = function() {
		return this.options.el;
	};

	this.getCurrentSrc = function()  {
		return this.videoSrc;
	};

	this.isAutoPlay = function() {
		return this.options.autoplay;
	};

	this.getFps = function() {
		return this.options.fps;
	};

	this.setFps = function(fps) {
		this.options.fps = fps;
	};
}

DYVideo.prototype.$ = function(selector) {
	return this.$el.find(selector);
};

DYVideo.prototype.render = function() {
	var tmpl = $('#dy-video-tmpl').html();
	var compiled = _.template(tmpl);
	var html = compiled(this.options);

	this.$el.append(html);

	var vw = this.$('.video-wrapper');
	vw.width(vw.width()).height(vw.height());

	this.video = this.$('.video-wrapper>video')[0];
	var $canvas = this.$('.canvas-wrapper>canvas');
	this.canvas = $canvas[0];
	this.$btnTrimIn = this.$('.video-wrapper>.video-controls>a.btn-trim-in');
	this.$btnTrimOut = this.$('.video-wrapper>.video-controls>a.btn-trim-out');
	this.$trimInDisplay = this.$('.canvas-wrapper>.trim-times .trim-time-in');
	this.$trimOutDisplay = this.$('.canvas-wrapper>.trim-times .trim-time-out');


	this.getVideo = function() {
		return this.video;
	};

	this.getCanvas = function() {
		return this.canvas;
	};

	_this = this;

	function trim (x, y, imgWidth, imgHeight, $trim) {
		var ctx = _this.getCanvas().getContext('2d');
		_video = false;
		var _video = _this.getVideo();
		
		var vWidth = _video.videoWidth;
		var vHeight = _video.videoHeight;
		//var height = vHeight / vWidth * imgWidth;

		var width = vWidth / vHeight * imgHeight;
		var posX = (imgWidth - width)/ 2 + x;		
	
		ctx.drawImage(_this.getVideo(), 0, 0, vWidth, vHeight, posX, y, width, imgHeight);

		var currentTime = _video.currentTime;
		var timeString = second2TimeString(Math.floor(currentTime));
		var currentSec = Math.floor(currentTime);

		$trim.attr('trimTime', currentSec).html(timeString);

		return new DYRect(posX, y, width, imgHeight, currentSec);
	}

	function playFrom (time) {
		if(time == 'none') {
			return;
		}

		_this.getVideo().currentTime = time;
	}

	this.$btnTrimIn.click(function(e) {
		e.preventDefault();

		var ctx = _this.getCanvas().getContext('2d');
		ctx.clearRect(10, 10, 160, 88);

		var region = trim(10, 10, 160, 88, _this.$trimInDisplay);
		_this.regions.tin = region;

		var frame = region.time * _this.getFps();	
		_this.$el.trigger('trimin', {
			currentTime: region.time,
			currentFrame: frame
		});

	});

	this.$btnTrimOut.click(function(e) {
		e.preventDefault();
		
		var ctx = _this.getCanvas().getContext('2d');
		ctx.clearRect(190, 10, 160, 88);

		var region = trim(190, 10, 160, 88, _this.$trimOutDisplay);
		_this.regions.tout = region;

		var frame = region.time * _this.getFps();	
		_this.$el.trigger('trimout', {
			currentTime: region.time,
			currentFrame: frame
		});
	});

	this.$trimInDisplay.click(function() {
		var time = $(this).attr('trimTime');
		playFrom(time);
	});

	this.$trimOutDisplay.click(function() {
		var time = $(this).attr('trimTime');
		playFrom(time);
	});

	$canvas.click(function(e) {
		var x = e.offsetX;
		var y = e.offsetY;

		_.each(_this.regions, function(rect, key) {
			if(rect == false) {
				return;
			}
			if(rect.containPoint({x:x, y:y})) {
				playFrom(rect.time);
			}
		});
	});
};

DYVideo.prototype.play = function(url) {
	if(!$.browser.msie) {
		this.videoSrc = url;
		this.video.src = url;
		this.video.load();

		return;
	}

	// ie can not chang src directly
	var newVideo = this.video.cloneNode(true);
	newVideo.src = url;
	this.video = newVideo;
	this.videoSrc = url;
	
	this.$('.video-wrapper>video').remove();
	this.$('.video-wrapper').prepend(newVideo);

	this.video.load();
};

DYVideo.prototype.clearTrims = function() {
	var _c = this.getCanvas();
	var ctx = _c.getContext('2d');
	ctx.clearRect(0, 0, _c.width, _c.height);

	this.$trimInDisplay.empty();
	this.$trimOutDisplay.empty();
}

DYVideo.prototype.trimin = function(func) {
	this.$el.bind('trimin', func);
};

DYVideo.prototype.trimout = function(func) {
	this.$el.bind('trimout', func);
};


DYVideo.prototype.setTrimIn = function(frame) {
	var second = frame / this.getFps();
	var str = second2TimeString(second);

	this.$trimInDisplay.attr('trimTime', second).html(str);
};

DYVideo.prototype.setTrimOut = function(frame) {
	var second = frame / this.getFps();
	var str = second2TimeString(second);
	
	this.$trimOutDisplay.attr('trimTime', second).html(str);
};




