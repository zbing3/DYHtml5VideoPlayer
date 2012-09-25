##HTML5视频打点播放

###说明
---

HTML5视频打点播放器，封装了对html5 video的操作， 支持视频打点功能。该功能被用在中科大洋公司的项目， 用来切分视频。	

目前暂时只支持h.264/aac编码的视频， 多格式兼容暂时没做支持。	

浏览器支持情况:	

* IE9 +
* Google Chrome: 支持Windows/Mac OS, Linux需要安装h.264解码器(linx未测试)


###安装
---

	<link rel="stylesheet" href="css/html5video.css" type="text/css" media="screen" charset="utf-8">
	<script src="js/jquery-1.8.1.min.js" type="text/javascript" charset="utf-8"></script>

	<script src="js/underscore.js" type="text/javascript"></script>	


###快速使用
---

快速初始化视频播放器，并制定初始化视频地址。	


	<div id="dy-player"></div>
	<script type="text/javascript>
		var v = new DYVideo({
			el: '#dy-player',
			videoSrc: 'http://192.168.1.205/~lvjian/video/death.mp4'
		});
		v.render();
	</script>


###DYVideo初始化参数说明
---

	{
		el: '', //(必须) 只定在哪里创建组建， 支持jQuery选择器
		videoSrc: '', //(可选) 初始化视频播放地址
		autoplay: true, //(可选) 是否自动播放。 true|false, 默认true 
		fps: 25, //(可选) 视频制式， 一般分N制(25帧/秒), PA制(30帧/秒)。默认N制 
		posterSrc: undefined //(可选) 视频首帧图片，需要给网络地址。 
	}

###监听视频打点事件
---

如何监听事件:	


	var v = new DYVideo({
		el: '#dy-player',
		videoSrc: 'http://192.168.1.205/~lvjian/video/death.mp4'
	});
	
	v.trimin(function(e, data) {
		console.log('get trimin');
		console.log(data);
	});
	
	v.trimout(function(e, data) {
		console.log('get trimout');
		console.log(data);
	});

data数据结构:	

	{
		currentTime: 1, //以秒为单位的打点信息
		currentFrame: 25 //以帧数为单位的打点信息 
	}

###DYVideo属性说明
---

* __getEl() : String__ : 获取初始化时传入的el参数
* __getCurrentSrc() : String__ : 获取当前视频的路径
* __getFps() : number__ : 获取当前视频的帧率
* __setFps(fps:number)__ : 设置当前视频的帧率。 25|30
* __isAutoPlay() : boolean__ : 是否自自动播放
* __setTrimIn(frame:number)__ : 设置入点， 参数为帧数 
* __setTrimOut(frame:numner)__ : 设置出点， 参数为帧数

###DYVideo特殊属性
---

* __video__ : 当前视频播放器的dom对象
* __canvas__ : 当前缩略图的画布dom对象

###DYVideo方法
---

* __render()__ : 渲染组建， 在创建DYVideo后需要调用。
* __play(url:string)__ : 播放视频。 
* __clearTrims()__: 清空打点信息

