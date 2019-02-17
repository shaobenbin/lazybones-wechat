const { session} = require('electron');

app.directive("webviewList", ['AccountDao',function(dao) {
  return {
      restrict: 'EA',
      link : function(scope, element, attrs, rootScope) {
        scope.webviewList = []
        scope.webviewTemplate = $(webviewTemplate.innerHTML)[0];
        //接受到预增页面的消息
        ipcRenderer.on('prepare-new-wechat',function(event){
            if(Common.DEBUG_MODE){
              console.log("监听到prepare-new-wechat---事件源：");
              console.log(event);
            }
            scope.insertWebview($.now(),false);
        });

        //添加微信窗口
        scope.insertWebview = (webviewId,isShow)=>{
          if(Common.DEBUG_MODE){
            console.log("插入Webview---insertWebview---webviewId:");
          }

          //更新空页面id
          scope.$root.blankId = webviewId;
          $(scope.webviewTemplate).attr("id","webview-id-"+ webviewId);
          $(scope.webviewTemplate).attr("partition","persist:"+ webviewId);
          $(scope.webviewTemplate).attr("data-session-id",webviewId);
          element.append($(scope.webviewTemplate).clone());
          _initWebview(webviewId,isShow);
        }

        _initWebview = (webviewId,isShow) => {
            if(Common.DEBUG_MODE){
              console.log("初始化Webview---initWebview---webviewId:");
            }
            var realWebViewId = 'webview-id-'+webviewId;
            _thread = () => {
                if ( $('#'+realWebViewId).length < 1 ){
                  return setTimeout( _thread , 500 );
                }

                var webview = document.getElementById(realWebViewId);

                //dom解析之后页面指令已执行，模型更新应该在dom解析之前
                if(isShow){
                  scope.showWebview(webviewId);
                }
                webview.addEventListener('new-window', function (e) {
                    shell.openExternal(new MessageHandler().handleRedirectMessage(e.url));
                });
                webview.addEventListener("dom-ready", function() {

                  //监控监控小红点
                  // webview.addEventListener('did-get-response-details', function (e) {
                  //     let script = `$("body").scope().sendNoticeCount()`;
                  //     if(e.originalURL.indexOf("webwxsync")>0){
                  //       webview.executeJavaScript(script)
                  //     }
                  // });

                  // webview.session.defaultSession.webRequest.onCompleted(filter, (details) => {
                	// 	var url = details.url;
                  //   console.log("访问了某个url : " + url)
                  //   let script = `$("body").scope().sendNoticeCount()`;
                  //   if(url.indexOf("webwxsync")>0){
                  //     webview.executeJavaScript(script)
                  //   }
                	// });

                  //监控被踢出时
                  // webview.addEventListener('did-get-redirect-request', function (e) {
                  //   if(e.oldURL.indexOf("webwxlogout")>0){
                  //     console.log("webview拦截到微信登出");
                  //     Database.saveLogOutWxAccount(webviewId,0,scope.reloadLeftMenu);
                  //   }
                  // });

                  webview.insertCSS(WechatCSSInjector.commonCSS);

                  // let script = `
                  //   var body = document.body;
                  //   var div = document.createElement("div");
                  //   div.innerHTML = "<input type='hidden' id='webview-hidden-id' value=`+webviewId+` />";
                  //   body.appendChild(div);
                  //   `;
                  //
                  // console.log(webview);
                  // webview.executeJavaScript(script, false, ()=>{console.log("insert webview hidden id success!")})
                  webview.send("getWebviewHiddenId", webviewId);
                  if (Common.DEBUG_MODE) {
                    console.log("打开webview内部的调试器!");
                    webview.openDevTools();
                  }
                });

            }

            _thread();

        }
        //点击左侧关闭后移除webview
        scope.removeWebview = (targetId) => {
          if(Common.DEBUG_MODE){
            console.log("移除Webview页面---removeWebview---移除Id:" + targetId);
          }

          $("#"+"webview-id-"+targetId).remove();
          //删除当前页面时刷新右侧显示
          if(scope.$root.showId==targetId){
            if(Common.DEBUG_MODE){
              console.log("移除Webview页面为当前页面");
            }

            dao.findNextId(targetId,scope.showWebview);
          }
        }


        _load = () => {
          dao.query((data)=>{

            let _webviewList = [];

            if (data.accounts && data.accounts.length > 0){
              for(var i = 0;i < data.accounts.length;i++){
                scope.insertWebview(data.accounts[i].webviewId,i == 0);
              }
              scope.insertWebview($.now(),false);
            }else{
              scope.insertWebview($.now(),true);
            }

          });
        }


        _load();
      }
    }
}]);
