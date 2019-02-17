/**
 * Created by binbin on 8/26/16.
 */
"use strict";

const Common = require('./windows/common');
const {autoUpdater} = require('electron');
const os = require("os");

const { Menu,MenuItem } = require('electron');

class SelfUpdate {
  constructor() {
    this.version = Common.VERSION_CODE;
  }

  applyUpdater(window) {
      autoUpdater.addListener("update-available", (event) => {
          console.log("A new update is available");
          try{
            window.setTitle(window.getTitle()+",有新版更新中");
          }catch(e){
            console.info("window mybe destory!!")
          }
      });
      autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
          try{
            window.setTitle(window.getTitle()+`版本 ${releaseName} 下载完成`);
          }catch(e){
            console.info("window mybe destory!!")
          }

          console.log("A new update is ready to install", `Version ${releaseName} is downloaded and will be automatically installed on Quit`);
      });
      autoUpdater.addListener("error", (error) => {
          console.error(error);
      });
      autoUpdater.addListener("checking-for-update", (event) => {
          //window.setTitle(window.getTitle()+`checking-for-update`);
          console.log("checking-for-update");
      });
      autoUpdater.addListener("update-not-available", () => {
          //window.setTitle(`update-not-available`);
          console.log("update-not-available");
      });

      autoUpdater.setFeedURL(Common.UPDATE_URL);

      window.webContents.once("did-frame-finish-load", (event) => {
          console.info("did-frame-finish-load");
          //window.setTitle(`did-frame-finish-load`);
          autoUpdater.checkForUpdates();
      });
  }

}

module.exports = SelfUpdate;
