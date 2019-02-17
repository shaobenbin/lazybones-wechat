app.directive("frameTopMenu", [function() {
  return {
    restrict: 'EA',
    link : function(scope, element, attrs,rootScope) {
        scope.showQuickReplySettingDialog = ()=>{
          scope.isQRSettingShow = true;
        }

        scope.showVersion = ()=>{
            $('#popup').bPopup();
        }

        ipcRenderer.send("getUserInfo");
        ipcRenderer.on('returnUserInfo',function(event,userName,maxWx,expireTime){
          scope.userName = userName;
          scope.maxWx = maxWx;
          scope.expireTime = expireTime;
        });

        ipcRenderer.on('top_menu_notice',function(event,noticeInfo){
          try{
            let clickScript = `javascript:window.open("`+noticeInfo.url+`")`;
            if($('#notice-info-marquee').find('a').attr('href') != clickScript){
              $('#notice-info-marquee').find('a').attr('href',clickScript);
            }
            if($('#notice-info-marquee').find('marquee').html() != noticeInfo.message){
              $('#notice-info-marquee').find('marquee').html(noticeInfo.message);
            }
            }catch(e){
              // do nothing
          }
        });
    }
  }
}]);

app.directive("frameSlideMenu", [function() {
  return {
    restrict: 'EA',
    link : function(scope, element, attrs,rootScope) {
      var isOpen = false
      element.stop().animate({
              'marginTop':'-41px'
          },450);
      scope.openSlideMenu = ()=>{
        if(isOpen){
          isOpen = false;
          element.animate({
              'marginTop':'-41px'
          },200);
        }else{
          isOpen = true;
          element.animate({
              'marginTop':'0px'
          },200);
        }
      }

      scope.refreshPage = ()=>{
        if(Common.DEBUG_MODE){
          console.log("刷新页面： "+scope.$root.showId);
        }
        $('#'+'webview-id-'+ scope.$root.showId)[0].stop();
        $('#'+'webview-id-'+ scope.$root.showId)[0].loadURL("https://wx.qq.com");
      }

      scope.stopPage = ()=>{
        if(Common.DEBUG_MODE){
          console.log("重置页面： "+scope.$root.blankId);
        }
        $('#'+'webview-id-'+ scope.$root.blankId).remove();
        scope.insertWebview($.now(),true);
      }

      scope.gobackPage = ()=>{
        //在blankId页面删除lastLoginId页面触发，显示blankId页面,防止显示空白
        //lastLoginId为空和blankId即使同时为空，扫描页面不存在无法点击返回，不会执行showWebview
        if(!$('#'+'webview-id-'+ scope.$root.lastLoginId)[0]){
          scope.$root.lastLoginId = null;
        }

        if(Common.DEBUG_MODE){
          console.log("返回页面： "+scope.$root.lastLoginId);
        }
        scope.showWebview(scope.$root.lastLoginId);
      }

      scope.openWebviewDev = ()=>{
        $('#'+'webview-id-'+ scope.$root.showId)[0].openDevTools();
      }

      scope.openWindowDev = ()=>{
        remote.getCurrentWindow().openDevTools();
      }
    }
  }
}]);


app.directive("quickReplySettingDialog", ['$http',function(h) {
  return {
      restrict: 'EA',
      templateUrl: 'quickReplySettingDialog.html',
      link : function(scope, element, attrs) {

          scope.is_add_group_show = false;
          scope.isQRSettingShow = false;

          //快捷回复设置
          $('.kjhf-setting-a').click(()=>{
            $('.kjhf-setting-dialog').attr("data-type","quick-reply-settings");
            $('.kjhf-setting-dialog .title span:eq(0)').html(`<img src="../views/images/top_menu/kuaijiefuwu-logo.png" />新增组`);
            $('.kjhf-setting-dialog').css("left",'45%').css("top",'40%');
            $('.quick-reply-detail').hover(function(){
              $(this).find('img').css("display","block");
            },function(){
              $(this).find('img').css("display","none");
            });
            $('.group-title-info').hover(function(){
              $(this).find('.rightImg').css("display","block");
            },function(){
              $(this).find('.rightImg').css("display","none");
            });
            $('.quick-reply-detail').find('span').unbind('click');
          })
          $('.kjhf-setting-dialog').find('.group').find('li').mouseover(function(){
            $(this).find('img').show();
          }).mouseleave(function(){
            $(this).find('img').hide();
          });

          ipcRenderer.on('open-quick-replay',function(event){
            if(!$(".kjhf-setting-dialog").is(":hidden")){
              scope.isQRSettingShow = false;
              scope.$apply();
              return;
            }
            $('.kjhf-setting-dialog').attr("data-type","quick-reply");
            $('.kjhf-setting-dialog .title span:eq(0)').html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
            $('.quick-reply-detail').hover(function(){
              $(this).find('img').css("display","none");
            },function(){
              $(this).find('img').css("display","none");
            });
            $('.group-title-info').hover(function(){
              $(this).find('.rightImg').css("display","none");
            },function(){
              $(this).find('.rightImg').css("display","none");
            });
            $('.quick-reply-detail').find('span').unbind('click');
            $('.kjhf-setting-dialog').css("left",740+"px").css("top",210+"px");
            scope.isQRSettingShow = true;
            scope.$apply();
            $('.kjhf-setting-dialog').find('.update-data-set').trigger("click")
            $('.quick-reply-detail').find('span').click(function(){
              _insertEditArea($(this).html());
              scope.isQRSettingShow = false;
              scope.$apply();
            })

          });

          function _insertEditArea(insertHtml){
            let script = `
              var editable = true;
              if ( $('.edit_area').html() && $('.edit_area').html().replace("<br>","") == "`+insertHtml+`"){
                  editable = false;
              }
              if(!window.getSelection() || !window.getSelection().getRangeAt(0)){
                  editable = false;
              }
              if(editable){
                $('.edit_area').html("`+insertHtml+`");
                setTimeout($(".edit_area").trigger($.Event("keydown", { keyCode: 13,ctrlKey: true})), 1000);
                setTimeout($('.edit_area').focus(), 1500);
              }
            `;
            $('#'+'webview-id-'+ scope.$root.showId)[0].executeJavaScript(script);
          }

          function _saveQuickReply2Db(list){
            new Database().saveQuickReply(list);
          }

          new Database().getQuickReply((dataset)=>{
              if (dataset != undefined && dataset.length > 0) {
                scope.quickReplyGoupList = dataset;
              } else {
                scope.quickReplyGoupList = [];
              }
          })

          scope.updateDataSet = function() {
              new Database().getQuickReply((dataset)=>{
                if (dataset != undefined && dataset.length > 0) {
                  scope.quickReplyGoupList = dataset;
                } else {
                  scope.quickReplyGoupList = [];
                }
              })
          }

          function hideNewGroup(target){
            target.parent().find('textarea').val('')
            scope.is_add_group_show = false;
          }

          scope.closeDialog = () => {
            scope.isQRSettingShow = false;
          }

          function getGroupByUUID(group_uuid){
            let list = scope.quickReplyGoupList;
            for (let i = 0 ; i < list.length ; i++ ){
              var quickReplyGroup = list[i];
              if( quickReplyGroup.uuid == group_uuid   ){
                return quickReplyGroup;
              }
            }
            return undefined;
          }

          function addNewReply(group_uuid,reply) {
            let list = scope.quickReplyGoupList;
            let id = uuid.v1();
            for (let i = 0 ; i < list.length ; i++ ){
              var quickReplyGroup = list[i];
              if( quickReplyGroup.uuid == group_uuid   ){
                quickReplyGroup.quickReplyList.unshift({'content':reply,'uuid':id})
              }
            }

            scope.quickReplyGoupList = list;
            _saveQuickReply2Db(list);
          }

          scope.quickReplyGoupList = [];
          //TODO 这里通过 ajax获取

          // 新增一个组名字
          scope.addNewGroup = function() {
            if ($('.kjhf-setting-dialog').attr("data-type") != "quick-reply-settings"){
              return;
            }

            scope.is_add_group_show = true;
          }

          // 隐藏新增组的div
          scope.delNewGroup = function(event) {
            if ($('.kjhf-setting-dialog').attr("data-type") != "quick-reply-settings"){
              return;
            }

            var target = angular.element(event.currentTarget);
            hideNewGroup(target);
          }

          // 保存新增的组
          scope.saveNewGroup = function(event) {
            if ($('.kjhf-setting-dialog').attr("data-type") != "quick-reply-settings"){
              return;
            }

            let target = angular.element(event.currentTarget);
            let groupName = target.parent().find('textarea').val();
            if (!groupName) {
              alert("请输入组名!")
              return;
            }
            let groupId = uuid.v1();
            scope.quickReplyGoupList.unshift({'uuid':groupId,'name':groupName,"quickReplyList":[]});
            _saveQuickReply2Db(scope.quickReplyGoupList);
            hideNewGroup(target);
            adaptiveTextarea($('.quick-reply-content'), 1, 5);
          }

          scope.addNewReply = function(event) {
            if ($('.kjhf-setting-dialog').attr("data-type") != "quick-reply-settings"){
              return;
            }

            // 添加一个新的回复
            var target = angular.element(event.currentTarget);
            var groupUUID = target.parent().attr('data-uuid');
            var group = getGroupByUUID(groupUUID);
            if (group != undefined) {
              group.isNewQuickReplyVisible = true;
            }
          }

          scope.delNewReply = function(event) {
            if ($('.kjhf-setting-dialog').attr("data-type") != "quick-reply-settings"){
              return;
            }

            // 删除一个回复
            let target = angular.element(event.currentTarget);
            var groupUUID = target.parent().parent().parent().find('.group-title-info').attr('data-uuid');
            var group = getGroupByUUID(groupUUID);
            target.parent().find('textarea').val('');
            if (group != undefined) {
              group.isNewQuickReplyVisible = false;
            }
          }

          scope.saveNewReply = function() {
            if ($('.kjhf-setting-dialog').attr("data-type") != "quick-reply-settings"){
              return;
            }

            // 保存一个回复
            let target = angular.element(event.currentTarget);
            let content = target.parent().find('textarea').val();
            if (!content) {
              alert("请输入内容!")
              return;
            }
            let group_uuid = target.parent().parent().parent().find('.group-title-info').attr('data-uuid');
            if ( !content ){
              return;
            }

            addNewReply(group_uuid,content);

            var group = getGroupByUUID(group_uuid);
            target.parent().find('textarea').val('');
            if (group != undefined) {
              group.isNewQuickReplyVisible = false;
            }
          }

          scope.delGroup = function() {
            if ($('.kjhf-setting-dialog').attr("data-type") != "quick-reply-settings"){
              return;
            }

            // 删除一个组
            let target = angular.element(event.currentTarget);
            let group_uuid = target.parent().attr('data-uuid');
            let newGroupList = [];
            let list = scope.quickReplyGoupList;

            for (let i = 0 ; i < list.length ; i++ ){
              let quickReplyGroup = list[i];
              if ( quickReplyGroup.uuid != group_uuid ){
                newGroupList.push(quickReplyGroup);
              }
            }
            scope.quickReplyGoupList = newGroupList;
            _saveQuickReply2Db(newGroupList);
          }

          scope.delReply = function() {
            if ($('.kjhf-setting-dialog').attr("data-type") != "quick-reply-settings"){
              return;
            }

            // 删除一个快捷回复
            let target = angular.element(event.currentTarget);
            let reply_uuid = target.attr('data-uuid')
            let group_uuid = target.parent().parent().parent().find('.group-title-info').attr('data-uuid');
            let list = scope.quickReplyGoupList;

            for (let i = 0 ; i < list.length ; i++ ){
              var quickReplyGroup = list[i];
              if ( quickReplyGroup.uuid == group_uuid ){
                let newReplyList = [];
                for ( let j = 0 ; j < quickReplyGroup.quickReplyList.length ; j++ ){
                  if( quickReplyGroup.quickReplyList[j].uuid != reply_uuid ){
                    newReplyList.push( quickReplyGroup.quickReplyList[j] );
                  }
                }

                quickReplyGroup.quickReplyList = newReplyList;
              }
            }

            scope.quickReplyGoupList = list;
            _saveQuickReply2Db(list);
          }
      }
    }
}]);
