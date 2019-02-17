"use strict";


class ContentChat {
  constructor() {

  }

  static getTemplate(){
    return `
        <!--BEGIN HD-->
        <div id="chatArea" ng-class="{'chatRoom':currentContact.isRoomContact(),'no-choose':!currentContact.getDisplayName()}" class="box chat">
        <div class="box_hd">
            <!--<a class="ext web_wechat_addfriend" href="javascript:;" ng-click="showChatRoomMembers($event)" ng-show="currentContact.isRoomContact()" title="Members"></a>-->
            <!--<a class="ext web_wechat_addfriend" href="javascript:;" ng-click="showProfile($event)" ng-show="!currentContact.isRoomContact()" title="Profile"></a>-->
            <div id="chatRoomMembersWrap"></div>
            <div class="title_wrap">
                <div class="title poi" ng-click="currentContact.MMCanCreateChatroom && showChatRoomMembers($event)">
                    <a class="title_name"  data-username="{{currentContact.UserName}}"  ng-bind-html="currentContact.getDisplayName()"></a>
                    <span class="title_count" ng-if="currentContact.MemberList.length">({{currentContact.MemberList.length}})</span>
                    <i class="" ng-class="{'web_wechat_up_icon': isShowChatRoomMembers, 'web_wechat_down_icon': !isShowChatRoomMembers}" ng-show="currentContact.getDisplayName() && currentContact.MMCanCreateChatroom"></i>
                </div>
                <a class="name_copy" hef="#" style="display:none" title="复制名字">
                  <img src="http://pmv4hdpiu.bkt.clouddn.com/copy.png" style="vertical-align: middle; height: 15px; margin-left: 3px;">
                </a>
            </div>
        </div>
        <!--END HD-->
        <!--BEGIN BD-->
        <div
             jquery-scrollbar
             class="box_bd chat_bd scrollbar-dynamic"
             data-cm='{"type":"clean","username":"{{currentUser}}"}'>




            <div mm-repeat="message in chatContent" data-height-calc="heightCalc" data-buffer-height="300" data-pre-calc="true">
                 <div class="clearfix"  message-directive></div>
            </div>

            <!--<div message-directive
                 ng-repeat="message in chatContent track by message.MsgId"
                 class="clearfix"
                 ng-class="{'slide-top':messagesAnimate}"
                 ></div>
    -->     <div id="prerender"  style="
          visibility: hidden;
      position: absolute;
      width: 100%;
      top: 333px;
      height: 0;
      padding: 0 19px;
      box-sizing: border-box;
      margin-left: -19px;
      overflow: hidden;
    "></div>
            <div ng-if="chatContent.length < 1" class="message_empty">
                <i class="web_wechat_nomes_icon" ng-hide="currentContact.getDisplayName()"></i>
                <p ng-show="currentContact.getDisplayName()">暂时没有新消息</p>
                <p ng-hide="currentContact.getDisplayName()">未选择聊天</p>
            </div>
        </div>
        <!--END BD-->
        <!--BEGIN FT-->
        <div class="box_ft" ng-controller="chatSenderController" ng-show="currentContact && !currentContact.isReadOnlyContact()">
            <div class="toolbar" id="tool_bar">
                <a class="web_wechat_face" ng-click="showEmojiPanel($event)" href="javascript:;" title="表情"></a>
                <a mm-action-track track-type="['click']" track-opt="{'target':'截图'}"class="web_wechat_screencut" ng-hide="noflash" ng-click="screenShot()" href="javascript:;" title="截屏"></a>
                <a mm-action-track track-type="['click']" ng-click="sendClick($event)" track-opt="{'target':'发文件'}"  class="web_wechat_pic js_fileupload" ng-hide="noflash" href="javascript:;" title="图片和文件"></a>
                <a href="#" style="cursor:pointer; margin-left: 5px;" class="quick-replay-a"><img title="快捷回复" style="vertical-align:middle;width: 22px; height: 22px;" src="http://pmv4hdpiu.bkt.clouddn.com/faqx32x02.png"></a>
            </div>
            <div class="content" mm-action-track track-type="['click','keydown']" track-opt="{target:'发送框',keys:['enter','backspace','blankspace']}" >
                <pre    id="editArea" contenteditable-directive mm-paste class="flex edit_area" contenteditable="true" ng-blur="editAreaBlur($event)" ng-model="editAreaCtn" ng-click="editAreaClick($event)" ng-keyup="editAreaKeyup($event)" ng-keydown="editAreaKeydown($event)"></pre>
                <span class="caret_pos_helper" id="caretPosHelper"></span>
            </div>

            <div class="action">
                <span ng-if="!isMacOS" class="desc">按下Ctrl+Enter换行</span>
                <span ng-if="isMacOS" class="desc">按下Cmd+Enter换行</span>
                <a class="btn btn_send" href="javascript:;" ng-click="sendTextMessage()">发送</a>
            </div>
        </div>
        <!--END FT-->
        <div id="J_CatchDrop" class="catch-drop-area"></div>
        </div>
    `
  }
}

module.exports = ContentChat;
