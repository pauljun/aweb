export function fullscreen(element) {
	if (element.requestFullScreen) {
		element.requestFullScreen();
	} else if (element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	}else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
}

/**
 * exitFullscreen 退出全屏
 * @param  {Objct} element 选择器
 */
export function exitFullscreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	}else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
}

/**
 * 判读是否支持全屏
 */
export function fullscreenEnabled() {
	return (
		document.fullscreenEnabled ||
		document.mozFullScreenEnabled ||
		document.webkitFullscreenEnabled ||
		document.msFullscreenEnabled
	);
}

/**
 * [isFullscreen 判断浏览器是否全屏]
 * @return [全屏则返回当前调用全屏的元素,不全屏返回false]
 */
export function isFullscreen() {
	return (
		document.fullscreenElement ||
		document.msFullscreenElement ||
		document.mozFullScreenElement ||
		document.webkitFullscreenElement ||
		false
	);
}
// 添加 / 移除 全屏事件监听
export function fullScreenListener(isAdd, fullscreenchange) {
	const funcName = isAdd ? 'addEventListener' : 'removeEventListener';
	const fullScreenEvents = [
		'fullscreenchange',
		'mozfullscreenchange',
		'webkitfullscreenchange',
		'msfullscreenchange'
	];
	fullScreenEvents.map((v) => document[funcName](v, fullscreenchange));
}