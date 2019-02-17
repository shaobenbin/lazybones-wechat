app.directive("frameLeftMenu", ['AccountDao',function(dao) {
  return {
      restrict: 'EA',
      templateUrl: 'frameLeftMenu.html',
      link : function(scope, element, attrs) {

        ipcRenderer.on('reload-left-menu',function(event){
          if(Common.DEBUG_MODE){
            console.log("监听到reload-left-menu---事件源：");
            console.log(event);
          }
          scope.reloadLeftMenu();
        });

        //接受到刷新小红点消息
        ipcRenderer.on('refreshMsg',function(event,count,webviewId){
            element.find("[data-id="+webviewId+"]").next().html(count);
          if (count == 0){
            element.find("[data-id="+webviewId+"]").next().hide();
          }else{
            element.find("[data-id="+webviewId+"]").next().show();
          }
        });

        // 删除、登陆时触发
        scope.reloadLeftMenu = () => {
            if(Common.DEBUG_MODE){
              console.log("刷新左列表---reloadLeftMenu");
            }
          dao.query((data)=>{
            scope.accountList = data.accounts;

            if(Common.DEBUG_MODE){
              console.log("reloadLeftMenu获取数据库:");
              console.log(data);
            }

            scope.$apply();
          });
        }

        // 新增一个微信窗口
        scope.addNew = () => {
          if(Common.DEBUG_MODE){
            console.log("新增微信---addNew");
          }
          //blankId为空可能达到限制也可能解除了限制,删除设备并不去增加blankId
          if(!scope.$root.blankId){

            if(Common.DEBUG_MODE){
              console.log("blankId为空");
            }

            scope.insertWebview($.now(),true);
            //防止达到限制后去show空页面,让insertWebview判断
            return;
          }
          //转跳扫描页面之前的页面为登录页面时记录最后展示的登录页面
          if(scope.$root.showId!=scope.$root.blankId){
            if(Common.DEBUG_MODE){
              console.log("切换到blankId页面");
            }
            scope.$root.lastLoginId = scope.$root.showId;
          }
          scope.showWebview(scope.$root.blankId);
        }

        // 切换微信帐号
        scope.switch = (webviewId) => {
            if(Common.DEBUG_MODE){
              console.log("切换微信帐号---switch---切换Id:" + webviewId);
            }
            scope.showWebview(webviewId);
        }

        //根据目标id显示webview窗口
        scope.showWebview = (webviewId)=>{
          if(Common.DEBUG_MODE){
            console.log("目标显示页面---showWebview---显示Id:" + webviewId);
          }
          //如果删除左边最后一个用户后则显示空页面
          //如果blankId为null不会执行
          if(!webviewId){
            if(Common.DEBUG_MODE){
              console.log("目标显示页面为空,切换到blankId页面");
            }

            webviewId = scope.$root.blankId;
          }
          scope.$root.showId = webviewId;
          $('webview').each(function(){
            if ( $(this).attr('data-session-id') == scope.$root.showId ) {
              $(this).removeClass('hide');
            } else {
              $(this).addClass('hide')
            }
          });
        }

        // 删除微信窗口
        scope.delete = (webviewId) => {
          if(Common.DEBUG_MODE){
            console.log("目标删除页面---delete---删除Id : " + webviewId);
          }
          //防止switch接受到delete事件造成showWebview执行两次
          event.stopPropagation();
          //数据删除前获取下一个id以删除webview
          scope.removeWebview(webviewId);
          dao.remove(webviewId,scope.reloadLeftMenu);
        }

        // 下一个未读消息
        scope.nextUnreadChat = (webviewId) => {
          if(Common.DEBUG_MODE){
            console.log("下一个未读消息---nextUnreadChat---双击Id : " + webviewId);
          }

          let script = `
          // 滚动条滚动
          function scroll2ReadPoint(){
            var isScroll = false;
            //没有小红点滚动至开头
            if($('.web_wechat_reddot_middle').length == 0){
              if ($('#J_NavChatScrollBody').scrollTop()> 50){
                $('#J_NavChatScrollBody').animate({scrollTop: 0}, 1000);
                return false;
              }
              return true;
            }
            // 点击选择聊天框
            $('.chat[ui-sref=chat]').click();
            //开始滚动
            $('.web_wechat_reddot_middle').each(function(){
              if($(this).parent().parent().position().top > 0&&isScroll==false){
                $('#J_NavChatScrollBody').animate({scrollTop: $(this).parent().parent().position().top + $('#J_NavChatScrollBody').scrollTop()}, 1000);
                isScroll = true;
              }
            });
            if(!isScroll){
              $('#J_NavChatScrollBody').animate({scrollTop: $('.web_wechat_reddot_middle').first().parent().parent().position().top+$('#J_NavChatScrollBody').scrollTop()}, 1000);
            }
            return true;
            }
            if(!scroll2ReadPoint()){
              setTimeout(scroll2ReadPoint, 300);
            }
            `;
            if($('#'+'webview-id-'+ webviewId)[0]){
              $('#'+'webview-id-'+ webviewId)[0].executeJavaScript(script)
            }
        }

        scope.reloadLeftMenu();
      }
    }
}]);
