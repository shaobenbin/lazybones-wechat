"use strict";


class NavChat {
  constructor() {

  }

  static getTemplate(){
    return `
    <div style="display:none">
      <span ng-repeat="chatContact1 in chatList">{{chatContact1.NoticeCount}} </span>
    </div>

    <div jquery-scrollbar class="chat_list scrollbar-dynamic" id="J_NavChatScrollBody">
      <p class="ico_loading" ng-hide="chatList.length > 0"><img src="https://res.wx.qq.com/zh_CN/htmledition/v2/images/icon/ico_loading302bc5.gif" alt=""/>Loading...</p>

      <div  data-no-cache="true" ng-repeat="chatContact in chatList track by chatContact.UserName" data-height="64" data-buffer-height="200">
          <div class="chat_item slide-left"
               ng-if="!chatContact.isShieldUser()"
               ng-click="itemClick(chatContact.UserName)"
               ng-class="{'active': (chatContact.UserName == currentUserName),'top':chatContact.isTop()}"
               data-cm='{"type":"chat","username":"{{chatContact.UserName}}"}'>

              <div class="ext">
                  <p class="attr">{{chatContact.MMDigestTime}}</p>
                  <p ng-if="chatContact.isMuted()" class="attr" ng-class="{'no_time': !chatContact.MMDigestTime}">
                      <i class="web_wechat_no-remind" ng-class="{'web_wechat_no-remind_hl': (chatContact.UserName == currentUserName)}"></i>
                  </p>
              </div>

              <div class="avatar">
                  <img class="img" src="https://res.wx.qq.com/zh_CN/htmledition/v2/images/web_wechat_no_contect302bc5.png" mm-src="{{chatContact.HeadImgUrl}}" alt=""/>

                  <i class="icon web_wechat_reddot" ng-if="chatContact.NoticeCount && chatContact.isMuted()"></i>

                  <i class="icon web_wechat_reddot_middle" ng-class="{web_wechat_reddot_middle: chatContact.NoticeCount < 99, web_wechat_reddot_bbig: chatContact.NoticeCount >=99}" ng-if="chatContact.NoticeCount && !chatContact.isMuted()">{{chatContact.NoticeCount>99?'99+':chatContact.NoticeCount;}}</i>

              </div>

              <div class="info">
                  <h3 class="nickname">
                      <span class="nickname_text" ng-bind-html="chatContact.getDisplayName()"></span>
                      <!--<span class="nickname_count" ng-if="chatContact.MemberList.length">({{chatContact.MemberList.length}})</span>-->
                  </h3>

                  <p class="msg" ng-if="chatContact.MMDigest">
                      <span class="status" ng-if="chatContact.MMStatus == CONF.MSG_SEND_STATUS_SENDING">
                          <i class="web_wechat_send" ng-class="{'web_wechat_send_w': chatContact.UserName == currentUserName}"></i>
                      </span>
                      <span ng-if="chatContact.NoticeCount>1 && chatContact.isMuted()">[{{chatContact.NoticeCount}} message&#40;s&#41;]</span>
                      <span ng-bind-html="chatContact.MMDigest"></span>
                  </p>
              </div>
          </div>
      </div>
    </div>
    `
  }
}

module.exports = NavChat;
