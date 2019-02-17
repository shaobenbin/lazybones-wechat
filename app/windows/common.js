/**
 * Created by binbin on 8/26/16.
 */

"use strict";

const os = require("os");

class CommonConfig {
}

CommonConfig.ELECTRON = "懒虫微信云客服";
CommonConfig.ELECTRONIC_WECHAT = "懒虫微信云客服";
CommonConfig.APP_NAME = "lcykf";
CommonConfig.DEBUG_MODE = false;
CommonConfig.WINDOW_SIZE = {width: 1500, height: 750,min_width:1100};
CommonConfig.WINDOW_SIZE_LOGIN = {width: 380, height: 540};
CommonConfig.WINDOW_SIZE_LOADING = {width: 380, height: 120};
CommonConfig.USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) " +
    "Chrome/41.0.2227.1 Safari/537.36";
CommonConfig.WEB_WECHAT = "https://wx.qq.com/";

CommonConfig.MENTION_MENU_INITIAL_X = 300;
CommonConfig.MENTION_MENU_OFFSET_X = 30;
CommonConfig.MENTION_MENU_INITIAL_Y = 140;
CommonConfig.MENTION_MENU_OFFSET_Y = 45;
CommonConfig.MENTION_MENU_WIDTH = 120;
CommonConfig.MENTION_MENU_OPTION_HEIGHT = 30;
CommonConfig.MENTION_MENU_OPTION_DEFAULT_NUM = 4;
CommonConfig.MENTION_MENU_HINT_TEXT = "Mention:";
CommonConfig.MENTION_MENU_HINT_TEXT_CN = "选择回复的人:";
CommonConfig.MESSAGE_PREVENT_RECALL = "Blocked a message recall.";
CommonConfig.MESSAGE_PREVENT_RECALL_CN = "阻止了一次撤回";
CommonConfig.EMOJI_MAXIUM_SIZE = 120;

CommonConfig.VERSION_CODE = 10;
CommonConfig.VERSION_NAME = 'v2.2';

CommonConfig.UPDATE_URL = '';

CommonConfig.currentSize = null;
CommonConfig.currentPosition = null;

CommonConfig.getResource = (path) => {
  return `file://${__dirname}/static/`+path;
}

CommonConfig.getByPath = (path) => {
  return `file://${__dirname}/`+path;
}

module.exports = CommonConfig;
