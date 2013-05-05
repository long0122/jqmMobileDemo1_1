/**********
离线工具js
***********/  

/**
 * true表示支持离线
 */
var isCache = true;
/**
 * 初始化缓存状态
 */
function initCacheState(){
	isCache = getCache("isCache");
	if(isCache==null){
		isCache = true;
		setCache("isCache",true);
	}
	
	if(isCache){
		isCache =true;
	}else{
		isCache =false;
	}
}

/**
 * 设置缓存状态
 */
function setCacheState(val){
	 isCache = Boolean(val);
	 if(isCache){
		 setCache("isCache",true);
		 myAlert("已开启离线模式"); 
	 }else{
		 setCache("isCache","");
		 myAlert("已关闭离线模式"); 
	 }
	 
}

function checkCacheState(){
	if(isCache){
		myAlert("已开启离线模式"); 
	}else{
		myAlert("已关闭离线模式"); 
	}
}


	/**
	 * 下载图片
	 *  @param sourceUrl 目标图片地址
	 * 	@param targetUrl 图片存储地址
	 *  @param id        页面图片id
	 */
 
function downloadPic(sourceUrl,targetUrl,id){  
        var fileTransfer = new FileTransfer();   
        var uri = encodeURI(sourceUrl);    
        fileTransfer.download(  
        uri,targetUrl,function(entry){   
            var smallImage = document.getElementById(id);  
            smallImage.style.display = 'block';   
            smallImage.src = entry.fullPath;   
        },function(error){  
            console.log("下载网络图片出现错误");  
        });    
    } 
	var dir = "jqmMobileDemo_files";
	var fileSystem;
  /**
   * 加载图片 若缓存中没有该图片则下载
   * @param sourceUrl 目标图片地址
   * @param imgName 图片名称/图片id
   */
    function localFile(sourceUrl,imgName) {    
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){   
        	fileSystem = fs;
            //创建目录  
             fileSystem.root.getDirectory(dir, {create:true,exclusive:false},   
                function(fileEntry){ 
				            	 var dirPath = fileEntry.fullPath;  
				                 var _localFile = dir+"/"+imgName+".jpg";
				                 var _url = sourceUrl; 
				                 //查找文件  
				                 fileSystem.root.getFile(_localFile, null, function(fileEntry){  
				                    //文件存在就直接显示  
				                    var smallImage = document.getElementById(imgName);  
				                    smallImage.style.display = 'block';   
				                    smallImage.src = fileEntry.fullPath;    
				                }, function(){    
				                    //否则就到网络下载图片!  
				                    fileSystem.root.getFile(_localFile, {create:true,exclusive:false}, function(fileEntry){  
				                        var targetURL = fileEntry.toURL();  
				                        downloadPic(_url,targetURL,imgName);   
				                     },function(){  
				                        alert('下载图片出错');  
				                     });   
				                });  
				             },   
				                function(){  
				                	alert('创建目录失败');  
				                	console.log("创建目录失败");});  
         }, function(evt){  
            alert("加载文件系统出现错误");
            console.log("加载文件系统出现错误");  
        });   
    } 
    
    /**
     * 删除缓存目录及文件
     */
    function doDeleteCatcheFile() {
    	 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){ 
    	    fs.root.getDirectory(dir,{create:false},function(dirEntry) {
    	    	// 删除此目录及其所有内容 
    	    	dirEntry.removeRecursively(function(evt){  
    	    		clearCache();
        	        console.log("删除缓存文件成功!");  
	        	    }, function(evt){  
	    	    		myAlert("删除缓存文件失败!");
	        	        console.log("删除缓存文件失败");  
	        	    }); 
    	    	
    	    }, function(evt){  
    	        console.log("缓存文件不存在");  
    	        myAlert("缓存文件不存在");
    	    });   
    	 }, function(evt){  
             console.log("加载文件系统出现错误");  
             alert("加载文件系统出现错误");
         }); 
  } 
 
    function isDeleteCatcheFile() {
    	navigator.notification.confirm('确认删除缓存文件？', showConfirmDelete, '删除缓存', '确定,取消');
    }
    function showConfirmDelete(button) {
    	if (button == 1) {
    		doDeleteCatcheFile();
    	}
    }
    /**
     * 删除缓存数据
     */
	 function clearCache(){
		 localStorage.clear();
		 myAlert('清除缓存成功!');
		 doDeleteFile();
	  }
    
    /**
     * 合并cache
     * @param key
     * @param jsonData
     */
    function putCache(key,jsonData){
		//localStorage.clear();
    	var localdatas = localStorage.getItem(key);
    	if(localdatas==null||typeof localdatas === "undefined"){
    		localStorage.setItem(key,jsonData);
    	}else{
			var jsonList = JSON.parse(localdatas);
			var preLength = jsonList.length;
			var newJsonList = JSON.parse(jsonData);
			var newLength = newJsonList.length;
            
            //根据时间数据是否匹配来检查是否已经缓存
			var isExist = false;
			loop_1:for(var i=0;i<preLength;i++){
					for(var j=0;j<newLength;j++){
						if(newJsonList[j]==null||jsonList[i]==null){
							continue;
						}
						if(jsonList[i].time!=null&&newJsonList[j].time!=null&&jsonList[i].time==newJsonList[j].time){
							isExist = true;
							break loop_1;
						}
					}
			}

            if(isExist == false){
				//拼接json对象
				for(var i=0;i<newLength;i++){
					if(newJsonList[i]!=null){
						jsonList[preLength+i] = newJsonList[i];
					}
					
						
				}
			}
            
		//存入缓存
		localStorage.setItem(key,JSON.stringify(jsonList));
    }
    	
}
    function putCacheToFirst(key,jsonData){
    	var localdatas = localStorage.getItem(key);
    	if(localdatas==null||typeof localdatas === "undefined"){
    		localStorage.setItem(key,jsonData);
    	}else{
			var jsonList = JSON.parse(localdatas);
			var preLength = jsonList.length;
			var newJsonList = JSON.parse(jsonData);
			var newLength = newJsonList.length;
            
            //根据时间数据是否匹配来检查是否已经缓存
			var isExist = false;
			loop_1:for(var i=0;i<preLength;i++){
					for(var j=0;j<newLength;j++){
						if(newJsonList[j]==null||jsonList[i]==null){
							continue;
						}
						if(jsonList[i].time!=null&&newJsonList[j].time!=null&&jsonList[i].time==newJsonList[j].time){
							isExist = true;
							break loop_1;
						}
					}
			}

            if(isExist == false){
				//拼接json对象
				
				for(var i=0;i<preLength;i++){
					if(jsonList[i]!=null){
						newJsonList[newLength+1] = jsonList[i];
					}
					
				}
				
			}
            
		//存入缓存
		localStorage.setItem(key,JSON.stringify(newJsonList));
    }
    	
}
    
    /**
     * 设置cache
     * @param key
     * @param data
     */
	 function setCache(key,data){
		localStorage.setItem(key,data);
	 }
	 /**
	  * 获得getCache
	  * @param key 
	  * @returns
	  */
	 function getCache(key){
    	return localStorage.getItem(key);
    }

	 
	 
	 
	 /**
	  * 获得cache最新数据的time属性值
	  */
	 function getFirstCacheTimeAttriVal(key){
		 var localdatas = localStorage.getItem(key);
		 if(localdatas==null||typeof localdatas === "undefined"){
			 return null;
		 }else{
				var jsonList = JSON.parse(localdatas);
				return jsonList[0].time
		 }
	 }
	 
	