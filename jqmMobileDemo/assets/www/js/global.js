var serverURL = 'http://www.wglong.com';
//var serverURL = 'http://123.169.139.137:8080/wglWeb';

function goTo(page) {
	showLoading();
	$.mobile.changePage(page, {
		transition : "slide"
	});
}
function goBack() {
	$.mobile.back();
}

function showLoading() {
	$.mobile.loadingMessageTextVisible = true;
	$.mobile.showPageLoadingMsg("a", "加载中...");
}

function hideLoading() {
	$.mobile.hidePageLoadingMsg();
}

function showMyAlert(text) {
	$.mobile.loadingMessageTextVisible = true;
	$.mobile.showPageLoadingMsg("a", text, true);
}
function myAlert(text) {
	showMyAlert(text);
	setTimeout(hideLoading, 2000);
}

function errpic(thepic) {
	thepic.src = "../img/no_pic.png"
}

function getUrlParam(string) {
	var obj = new Array();
	if (string.indexOf("?") != -1) {
		var string = string.substr(string.indexOf("?") + 1);
		var strs = string.split("&");
		for ( var i = 0; i < strs.length; i++) {
			var tempArr = strs[i].split("=");
			obj[i] = tempArr[1];
		}
	}
	return obj;
}

// =========================PhoneGap==================================

// 等待加载PhoneGap
document.addEventListener("deviceready", onDeviceReady, false);
// PhoneGap加载完毕
function onDeviceReady() {
	// 按钮事件
	document.addEventListener("backbutton", eventBackButton, false); // 返回键
	document.addEventListener("menubutton", eventMenuButton, false); // 菜单键
	document.addEventListener("searchbutton", eventSearchButton, false); // 搜索键
}

// 返回键
function eventBackButton() {
	if ($.mobile.activePage.is('#indexPage')) {
		myAlert('再点击一次退出!');
		document.removeEventListener("backbutton", eventBackButton, false); // 注销返回键
		document.addEventListener("backbutton", exitApp, false);// 绑定退出事件
		// 3秒后重新注册
		var intervalID = window.setInterval(function() {
			window.clearInterval(intervalID);
			document.removeEventListener("backbutton", exitApp, false); // 注销返回键
			document.addEventListener("backbutton", eventBackButton, false); // 返回键
		}, 3000);
	}
	 else {
	 navigator.app.backHistory();
	 }

}

function exitApp() {
	navigator.app.exitApp();
}

// 菜单键
function eventMenuButton() {
	goTo('menu.html');
}
// 搜索键
function eventSearchButton() {
	myAlert('点击了搜索按钮!');
}

/**
 * 检查网络情况
 * @returns {Boolean}
 */
function checkConnection() {
	var networkState = navigator.network.connection.type;
	if (networkState == Connection.NONE) {
		navigator.notification.confirm('请确认网络连接已开启,并重试', showAlert, '提示',
				'确定');
		return false;
	}else{
		return true;
	}
}
function showAlert(button) {
	return false;
}
function isExit() {
	navigator.notification.confirm('确认退出？', showConfirm, '退出软件', '确定,取消');
}
function showConfirm(button) {
	if (button == 1) {
		navigator.app.exitApp();
	}
}