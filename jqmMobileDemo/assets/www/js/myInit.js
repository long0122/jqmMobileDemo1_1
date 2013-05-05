$(document).bind("mobileinit", function() {
			//不支持3D转屏的设备禁止转屏效果
			$.mobile.transitionFallbacks.slide = "none";
			//禁止hover延迟
			$.mobile.buttonMarkup.hoverDelay = "false";
		});



			
