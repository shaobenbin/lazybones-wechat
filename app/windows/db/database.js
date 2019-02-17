/**
 * Created by binbin on 8/30/16.
 */
"use strict";

const storage = require('electron-json-storage');
const {dialog} = require('electron');
const Common = require('../common');

class Database {
  constructor() {

  }

  initDatabase(){
    var data = {};
    data.accounts = [];
    storage.set('login_wechat_accounts_v1',data);
    if(Common.DEBUG_MODE){
      console.log("初始化数据库");
    }
  }

  saveQuickReply(dataset) {
    storage.set('quick_reply_v1', dataset, function(error) {
      if (error) throw error;
    });
  }

  getQuickReply(callback) {
    storage.get('quick_reply_v1', function(error, data) {
      if (error) throw error;
      callback(data);
    });
  }

  removeQuickReply() {
    storage.remove('quick_reply_v1', function(error, data) {
      if (error) throw error;
    });
  }

  /********** 左边菜单栏的微信号 - begin **********/
  static getLoginWxAccounts(callback){
    storage.get('login_wechat_accounts_v1',function(error,data){
      if (data == undefined || data == null || data.accounts == undefined || data.accounts == null){
        return Database.getLoginWxAccounts(callback);
      }
      if(Common.DEBUG_MODE){
        console.log(data);
      }

      callback(data);
    });
  }

  static saveLogOutWxAccount(loginOutWebviewId,unreadCount,callback){
    if(Common.DEBUG_MODE){
      console.log("数据库设置登出账号---saveLogOutWxAccount---登出账号webviewId：" + loginOutWebviewId);
    }

    this.getLoginWxAccounts((data) => {
      for(let i=0;i<data.accounts.length;i++){
        //已有则被踢了
        if (data.accounts[i].webviewId == loginOutWebviewId){
          if(Common.DEBUG_MODE){
            console.log("找到登出账号并重置账号为null");
          }
          data.accounts[i].account = data.accounts[i].account+"(登出)";
        }
      }
      storage.set('login_wechat_accounts_v1',data);
      callback()
    });
  }

  static saveLoginWxAccount(account,webviewId,unreadCount,callback) {
    if(Common.DEBUG_MODE){
      console.log("数据库设置登录账号---saveLoginWxAccount---登入账号account：" + account);
      console.log("数据库设置登录账号---saveLoginWxAccount---登入账号webviewId：" + webviewId);
    }

    if(!webviewId){
      if(Common.DEBUG_MODE){
        console.log("数据库设置登录账号webviewId为空");
      }
      return;
    }
    this.getLoginWxAccounts((data) => {
      var isNew = true;
      for(let i=0;i<data.accounts.length;i++){
        if (data.accounts[i].webviewId == webviewId){
          if(Common.DEBUG_MODE){
            console.log("登入账号webviewId已存在，非新增登录");
          }
          data.accounts[i].account = account;
          isNew = false;
        }
      }
      if(isNew){
        // 新增
        data.accounts.push({'account':account,'webviewId':webviewId,'unreadCount':unreadCount});
      }
      storage.set('login_wechat_accounts_v1',data);
      callback(isNew)
    });
  }

  removeLoginWxAccount(windowId){
    this.getLoginWxAccounts((data) => {
      let newAccounts = [];
      for(let i=0;i<data.accounts.length;i++){
        let accountInfo = data.accounts[i];
        if (accountInfo.windowId == parseInt(windowId)){
          continue;
        }

        newAccounts.push(accountInfo);
      }

      data.accounts = newAccounts;
      storage.set('login_wechat_accounts_v1',data);
    });
  }


  maintenanceUnreadCount(account,windowId,unreadCount){
    this.getLoginWxAccounts((data) => {
      for(let i=0;i<data.accounts.length;i++){
        let accountInfo = data.accounts[i];
        if (accountInfo.account == account && accountInfo.webviewId == webviewId){
          if (accountInfo.unreadCount == unreadCount){
            return;
          }

          accountInfo.unreadCount = unreadCount
        }
      }
    });
  }

  cleanLoginWxAccount(){
    storage.remove('login_wechat_accounts_v1', function(error, data) {
      if (error) throw error;
      if(Common.DEBUG_MODE){
        console.log("登录账号被清空！");
      }
    });
  }

  /********** 左边菜单栏的微信号 - end **********/

}

module.exports = Database;
