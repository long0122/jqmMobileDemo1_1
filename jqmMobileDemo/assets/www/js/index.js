			var isInit = 0;
			var myScroll,
			pullDownEl, pullDownOffset,
			pullUpEl, pullUpOffset, generatedCount = 0;
			/**
			 * 下拉刷新 
			 * myScroll.refresh();		// 数据加载完成后，调用界面更新方法
			 */
			function pullDownAction () {
				setTimeout(update, 1000);	// <-- Simulate network congestion, remove setTimeout from production!
			}
			
			/**
			 * 上拉刷新
			 * myScroll.refresh();		// 数据加载完成后，调用界面更新方法
			 */
			function pullUpAction() {
				setTimeout(loadData, 1000); // <-- Simulate network congestion, remove setTimeout from production!
			}

			/**
			 * 初始化iScroll控件
			 */
			function initIscroll() {
				if (myScroll != null) {
					myScroll.destroy();
				}
				pullDownEl = document.getElementById('pullDown');
				pullDownOffset = pullDownEl.offsetHeight;
				pullUpEl = document.getElementById('pullUp');
				pullUpOffset = pullUpEl.offsetHeight;

				myScroll = new iScroll(
						'wrapperIndex',
						{
							//scrollbarClass: 'myScrollbar', /* 自定义样式 */
							useTransition : false, //是否使用CSS变换
							topOffset: pullDownOffset,
							onRefresh : function() {
								if (pullDownEl.className.match('loading')) {
									pullDownEl.className = '';
									pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
								} else if (pullUpEl.className.match('loading')) {
									pullUpEl.className = '';
									pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
								}
							},
							onScrollMove : function() {
								if (this.y > 5 && !pullDownEl.className.match('flip')) {
									pullDownEl.className = 'flip';
									pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
									this.minScrollY = 0;
								} else if (this.y < 5 && pullDownEl.className.match('flip')) {
									pullDownEl.className = '';
									pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
									this.minScrollY = -pullDownOffset;
								} else if (this.y < (this.maxScrollY - 15)
										&& !pullUpEl.className.match('flip')) {
									pullUpEl.className = 'flip';
									pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
									this.maxScrollY = this.maxScrollY;
								} else if (this.y > (this.maxScrollY + 15)
										&& pullUpEl.className.match('flip')) {
									pullUpEl.className = '';
									pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
									this.maxScrollY = pullUpOffset;
								}
							},
							onScrollEnd : function() {
								if (pullDownEl.className.match('flip')) {
									pullDownEl.className = 'loading';
									pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';				
									pullDownAction();	// Execute custom function (ajax call?)
								} else if (pullUpEl.className.match('flip')) {
									pullUpEl.className = 'loading';
									pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
									pullUpAction(); // Execute custom function (ajax call?)
								}
							}
							
						});
				//页面初始化
				if(isInit==0){
					//判断是否读取缓存信息
					var localdatas = getCache("datas");
					//var localdatas = null;
					if(isCache&&localdatas!=null){
						myAlert('正在从缓存读取离线数据');
						$("#contentList").html("");
						desplay(localdatas);
						$("#contentList").listview('refresh');
						setTimeout(function(){
							myScroll.refresh();
							hideLoading();}, 200);
					}else{
						//load datas
				    	loadData();
						isInit=1;
					}
					
				}else{	//页面跳转
					var localdatas = getCache("datas");
					if(isCache&&localdatas!=null){
						myAlert('正在从缓存读取离线数据');
						showLoading();
						$("#contentList").html("");
						desplay(localdatas);
						$("#contentList").listview('refresh');
						setTimeout(function(){
							myScroll.refresh();
							hideLoading();}, 200);
					}
				}
			}

			
			
			var startNum = -1;
			var count = -1;
			function loadData() {
				if (startNum!=-1&&Number(startNum) >=Number(count)) {
					myAlert('已加载完全部信息');
					myScroll.refresh();
					return false;
				}
				
				try{
					if(!checkConnection()){
						myScroll.refresh();
						return false;
					}
					
				}catch(e){
						if(isInit!=0){
							 alert(e.name + ": " + e.message);
						}
					
					}
				showLoading();
						var params = {
							startNum : startNum,
							count : count
						};

						$.ajax({
							async : false,
							url : serverURL + '/ajax!jqmMobileDemoList2', // 跨域URL
							type : 'get',
							dataType : 'jsonp',
							jsonp : 'jsoncallback', //默认callback
							data : params,
							timeout : 5000,
							beforeSend : function() { //jsonp 方式此方法不被触发。原因可能是dataType如果指定为jsonp的话，就已经不是ajax事件了
							},
							success : function(json) { //客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数 
								desplay(json);
							},
							complete : function(XMLHttpRequest, textStatus) {
								//alert(textStatus);
								
							},
							error : function(xhr) {
								//jsonp 方式此方法不被触发
								//请求出错处理 
								myAlert("请求出错(请检查相关度网络状况.)");
							}
						});
				
			}

			function desplay(datas){
				var jsonObject = eval("(" + datas + ")");				
					if(jsonObject.startNum!=null){
						startNum = jsonObject.startNum;
						count = jsonObject.count;
						if(isCache){
							setCache("startNum",startNum);
							setCache("count",count);
						}
					}else{
						if(isCache){
							startNum = getCache("startNum");
							count = getCache("count");
						}
					}
				var _jsonList;
				if(jsonObject.str!=null){
					 _jsonList = jsonObject.str;
				}else{
					_jsonList = jsonObject;
				}
				var	jsonListStr = JSON.stringify(_jsonList);
				if(isCache&&jsonListStr!=null&&jsonListStr!=undefined){
					putCache("datas",jsonListStr);
				}
				var jsonList = JSON.parse(jsonListStr);
				for(var i=0;i<jsonList.length;i++){
					if(jsonList[i]==null){
						 continue;
					}
					var content = "<li>"
						content = content + "<img src=\"./img/headpic/"+jsonList[i].headCode+".jpg\" class=\"listpic\"/>";
						content = content + "<h3 class=\"listtitle\">"+jsonList[i].author+"<span class=\"timestyle\">"+jsonList[i].time+"</span></h3>";
						content = content + "<p>";
						content = content + jsonList[i].content;
						content = content + "</p>";
						if(jsonList[i].img!=null&&""!=jsonList[i].img&&undefined!=jsonList[i].img){
							content = content + "<img id='"+jsonList[i].imgName+"' src=\""+jsonList[i].img+"\"/>";
						}
						content = content + "</li>";
						$("#contentList").append(content);
						if(isCache&&jsonList[i].img!=null&&""!=jsonList[i].img&&undefined!=jsonList[i].img){
							try{
								localFile(jsonList[i].img,jsonList[i].imgName);
							}catch(e){
									if(isInit!=0){
										 alert(e.name + ": " + e.message);
									}
								
								}
						}
				 　　}
			
					$("#contentList").listview('refresh');
					
					setTimeout(function() { // <-- Simulate network congestion, remove setTimeout from production!			
						myScroll.refresh(); // 数据加载完成后，调用界面更新方法 Remember to refresh when contents are loaded (ie: on ajax completion)
						hideLoading();
						if (Number(startNum) >= Number(count)) {
							myAlert('已加载完全部信息');
						}
					}, 1500);
			}
			
			
			function update() {
				pullDownLoadData(getFirstCacheTimeAttriVal("datas"));
			}
			
			var pullDownStartNum = -1;
			var pullDownCount = -1;
			
			function pullDownLoadData(pullDownFirstTime) {
				if(pullDownFirstTime==null){
					myAlert('暂无更新');
					myScroll.refresh();
					return false;
				}
				if (pullDownStartNum!=-1&&Number(pullDownStartNum) >=Number(pullDownCount)) {
					myAlert('暂无更新');
					myScroll.refresh();
					return false;
				}
				if(!checkConnection()){
					myScroll.refresh();
					return false;
				}
				showLoading();
						var params = {
							pullDownStartNum : pullDownStartNum,
							pullDownCount : pullDownCount,
							pullDownFirstTime:pullDownFirstTime
						};
						$.ajax({
							async : false,
							url : serverURL + '/ajax!jqmMobileDemoPullDownList', // 跨域URL
							type : 'get',
							dataType : 'jsonp',
							jsonp : 'jsoncallback', //默认callback
							data : params,
							timeout : 5000,
							beforeSend : function() { //jsonp 方式此方法不被触发。原因可能是dataType如果指定为jsonp的话，就已经不是ajax事件了
							},
							success : function(json) { //客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数 
								pullDownDesplay(json);
							},
							complete : function(XMLHttpRequest, textStatus) {
								
							},
							error : function(xhr) {
								//jsonp 方式此方法不被触发
								//请求出错处理 
								myAlert("请求出错(请检查相关度网络状况.)");
							}
						});
				
			}
			
			function pullDownDesplay(datas){
				var jsonObject = eval("(" + datas + ")");				
					if(jsonObject.count!=null){
						pullDownStartNum = jsonObject.startNum;
						pullDownCount = jsonObject.count;
						if(isCache){
							setCache("pullDownStartNum",pullDownStartNum);
							setCache("pullDownCount",pullDownCount);
						}

					}else{
						pullDownStartNum = getCache("pullDownStartNum");
						pullDownCount = getCache("pullDownCount");
					}

					if (pullDownStartNum!=-1&&Number(pullDownCount)==0) {
						myAlert('亲，已经更新到最新信息了哟！');
						myScroll.refresh();
						return false;
					}
					
				var _jsonList;
				
				if(jsonObject.str!=null){
					 _jsonList = jsonObject.str;
				}else{
					_jsonList = jsonObject;
				}

				var	jsonListStr = JSON.stringify(_jsonList);

				if(isCache&&jsonListStr!=null&&jsonListStr!=""&&jsonListStr!=undefined){
					putCacheToFirst("datas",jsonListStr);
				}
				var jsonList = JSON.parse(jsonListStr);
				for(var i=0;i<jsonList.length;i++){
					if(jsonList[i]==null){
						 continue;
					}
					var content = "<li>"
						content = content + "<img src=\"./img/headpic/"+jsonList[i].headCode+".jpg\" class=\"listpic\"/>";
						content = content + "<h3 class=\"listtitle\">"+jsonList[i].author+"<span class=\"timestyle\">"+jsonList[i].time+"</span></h3>";
						content = content + "<p>";
						content = content + jsonList[i].content;
						content = content + "</p>";
						if(jsonList[i].img!=null&&""!=jsonList[i].img&&undefined!=jsonList[i].img){
							content = content + "<img id='"+jsonList[i].imgName+"' src=\""+jsonList[i].img+"\"/>";
						}
						content = content + "</li>";
						$("#contentList").prepend(content);
						if(isCache){
							try{
								localFile(jsonList[i].img,jsonList[i].imgName);
							}catch(e){
									alert(e.name + ": " + e.message);
								}
						}
				 　　}
			
					$("#contentList").listview('refresh');
					
					setTimeout(function() { // <-- Simulate network congestion, remove setTimeout from production!			
						myScroll.refresh(); // 数据加载完成后，调用界面更新方法 Remember to refresh when contents are loaded (ie: on ajax completion)
						hideLoading();
						if (Number(pullDownStartNum) >= Number(pullDownCount)) {
							myAlert('已经更新到最新信息');
						}
					}, 1500);
			}
			