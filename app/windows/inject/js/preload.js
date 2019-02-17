"use strict";

const {ipcRenderer,shell} = require('electron');
const Common = require('../../common');
const MentionMenu = require('./mention_menu');
// const NavChat = require('../template/nav_chat');
const ContentChat = require('../template/content_chat')
const clipboard = require('electron').clipboard;

let webviewHiddenId = null;

class Injector {
  init() {
    ipcRenderer.on("getWebviewHiddenId", (event, webviewId)=>{
      if(!webviewHiddenId){
        webviewHiddenId = webviewId
      }
    })
    this.initAngularInjection();
    this.initInjectBundle();
    this.initIpc();
  }

  initInjectBundle() {
    let initModules = ()=> {
      if (!window.$) {
        return setTimeout(initModules, 3000);
      }

      MentionMenu.init();
    };

    window.onload = () => {
      initModules();
    };
  }

  initAngularInjection() {
    let self = this;
    let angular = window.angular = {};
    let angularBootstrapReal;
    Object.defineProperty(angular, 'bootstrap', {
      get: () => angularBootstrapReal ? function (element, moduleNames) {
        const moduleName = 'webwxApp';
        if (moduleNames.indexOf(moduleName) < 0) return;

        // let navChat = NavChat.getTemplate();

        // 聊天框窗口加入一些自定义功能，所以在这里我们替换微信原来的contentChat.html内容
        // 这里的实用功能包括但不限与：
        // 1. 快捷回复
        // 2. 复制名字
        let contentChat = ContentChat.getTemplate();

        var script_list = document.getElementsByTagName('script')
        for(var i=0;i<script_list.length;i++){
          // if (script_list[i].id == 'navChat.html'){
          //    let obj = script_list[i];
          //    obj.innerHTML = navChat;
          // }
          if (script_list[i].id == 'contentChat.html'){
             let obj = script_list[i];
             obj.innerHTML = contentChat;
          }
        }

        let constants = null;
        angular.injector(['ng', 'Services']).invoke(['confFactory', (confFactory) => (constants = confFactory)]);

        angular.module(moduleName).config(['$httpProvider', ($httpProvider) => {
          $httpProvider.defaults.transformResponse.push((value)=> {
            return self.transformResponse(value, constants);
          });
        }
        ]).run(['$rootScope', ($rootScope) => {
          $rootScope.mentionMenu = MentionMenu.inject;
        }]);

        //return null;
        return angularBootstrapReal.apply(angular, arguments);

      } : angularBootstrapReal,
      set: (real) => (angularBootstrapReal = real)
    });
  }

  initIpc(){
    if(Common.DEBUG_MODE){
      console.log("初始化Ipc監聽---initIpc");
    }
    //设置复制按钮
    let _thread = () => {
      if(!window.$||!$("body").scope()||!$("body").scope().$watch || !webviewHiddenId){
        if(Common.DEBUG_MODE){
          console.log("文档沒有加載完,正在重試");
        }
        return setTimeout(_thread,500);
      }

      $("body").scope().sendNoticeCount = ()=>{
        let count = 0;
        let chatList = $(".nav_view").scope().chatList;
        // let webviewId = $('#webview-hidden-id').val();
        let webviewId = webviewHiddenId;
        for(var i in chatList){
          if(!chatList[i].isMuted()){
            count+=chatList[i].NoticeCount
          }
        }
        ipcRenderer.send("notifyUnreadMsg",count,webviewId);
      }

      $("body").scope().$watch('account',function(newValue,oldValue,scope){
        if(Common.DEBUG_MODE){
          console.log("监听到登录账号变化");
        }
        //登录
        if(newValue){
          if(Common.DEBUG_MODE){
            console.log("账号新值不为空---newValue:" + newValue);
          }

          let _getUserInfo = () => {
            let loginWechatName = newValue.NickName;
            if(Common.DEBUG_MODE){
              console.log("登录的账号名称：" + loginWechatName);
            }
            let webviewId = webviewHiddenId;
            if(Common.DEBUG_MODE){
              console.log("登录账号的页面Id：" + webviewId);
            }
            ipcRenderer.send("user-login",loginWechatName,webviewId);
          }
          _getUserInfo();
        }
      });

      let setNameCopyLog = () => {

        $('#chatArea .box_hd').first().find('.title_wrap').find('.name_copy').click(function(){
          let name = $(this).parent().find('.title_name').html();
          clipboard.writeText(name);
        });
        $('.title_wrap').mouseover(function(){
          let name = $(this).find('.title_name').html();
          if (name){
            $(this).find('.name_copy').show();
          }else{
            $(this).find('.name_copy').hide();
          }
        })
        $('.title_wrap').mouseleave(function(){
          $(this).find('.name_copy').hide();
        })
      }
      setNameCopyLog();
      $('.quick-replay-a').click(
        function(){
          ipcRenderer.send("open-quick-replay");
        }
      );
    }

    _thread();
  }

  newLoginMonitor(){

  }

  transformResponse(value, constants) {
    if($("body").scope().sendNoticeCount){
      $("body").scope().sendNoticeCount();

    }

    if (!value) return value;

    switch (typeof value) {
      case 'object':
        /* Inject emoji stickers and prevent recalling. */
        return this.checkEmojiContent(value, constants);
      case 'string':
        /* Inject share sites to menu. */
        return this.checkTemplateContent(value);
    }
    return value;
  }

  static lock(object, key, value) {
    return Object.defineProperty(object, key, {
      get: () => value,
      set: () => {
      }
    });
  }

  checkEmojiContent(value, constants) {
    if (!(value.AddMsgList instanceof Array)) return value;
    value.AddMsgList.forEach((msg) => {
      switch (msg.MsgType) {
        case constants.MSGTYPE_EMOTICON:
          Injector.lock(msg, 'MMDigest', '[Emoticon]');
          Injector.lock(msg, 'MsgType', constants.MSGTYPE_EMOTICON);
          if (msg.ImgHeight >= Common.EMOJI_MAXIUM_SIZE) {
            Injector.lock(msg, 'MMImgStyle', {height: `${Common.EMOJI_MAXIUM_SIZE}px`, width: 'initial'});
          } else if (msg.ImgWidth >= Common.EMOJI_MAXIUM_SIZE) {
            Injector.lock(msg, 'MMImgStyle', {width: `${Common.EMOJI_MAXIUM_SIZE}px`, height: 'initial'});
          }
          break;
        case constants.MSGTYPE_RECALLED:
          Injector.lock(msg, 'MsgType', constants.MSGTYPE_SYS);
          Injector.lock(msg, 'MMActualContent', Common.MESSAGE_PREVENT_RECALL);
          Injector.lock(msg, 'MMDigest', Common.MESSAGE_PREVENT_RECALL);
          break;
      }
    });
    return value;
  }

  checkTemplateContent(value) {
    let optionMenuReg = /optionMenu\(\);/;
    let messageBoxKeydownReg = /editAreaKeydown\(\$event\)/;
    if (optionMenuReg.test(value)) {
      value = value.replace(optionMenuReg, "optionMenu();shareMenu();");
    } else if (messageBoxKeydownReg.test(value)) {
      value = value.replace(messageBoxKeydownReg, "editAreaKeydown($event);mentionMenu($event);");
    }
    return value;
  }

}


new Injector().init();
