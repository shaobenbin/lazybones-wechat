/**
 * Created by binbin on 18/8/16.
 */
 "use strict";

const path = require('path');
const { app, shell, BrowserWindow,session,ipcMain} = require('electron');
const Common = require('../common');
const Database = require('../db/database')
const MessageHandler = require('../handlers/messages');


class MainFrameClass {
  constructor() {
  }

  initWindow(){
    let mainFrameWindow = null;

    mainFrameWindow = new BrowserWindow({
      title: Common.ELECTRONIC_WECHAT,
      width: Common.WINDOW_SIZE.width,
      height: Common.WINDOW_SIZE.height,
      minWidth : Common.WINDOW_SIZE.min_width
    });

    mainFrameWindow.setTitle(Common.ELECTRONIC_WECHAT);
    mainFrameWindow.setMenu(null);
    if (Common.DEBUG_MODE) {
      mainFrameWindow.openDevTools();
    }
    // and load the index.html of the app.
    mainFrameWindow.loadURL(Common.getByPath('views/main-frame.html'));

    return mainFrameWindow;
  }
}

module.exports = MainFrameClass;
