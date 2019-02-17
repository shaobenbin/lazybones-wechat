const path = require('path');
const cp = require('child_process');
const {app,ipcMain,Menu,MenuItem,BrowserWindow,dialog} = require('electron');
// const WeChatWindow = require('./windows/controllers/wechat');
// const LoginWindow = require('./windows/controllers/login')
const HmacUtils = require('./windows/utils/hmac_utils');
const http = require("http");
const request = require('request');
const SelfUpdate = require('./self_update');
const storage = require('electron-json-storage');
const Database = require('./windows/db/database');
const MainFrameWindow = require('./windows/controllers/main-frame')

let singleWindow = null;
let electronicWeChat = null;
let mainFrameWindow = null;

/*
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  //app.quit()
  let currentWindow = BrowserWindow.getFocusedWindow();
  if ( currentWindow == null ){
    let windows = BrowserWindow.getAllWindows();
    for(var i=0;i<windows.length;i++){
      if (windows[i].id != singleWindow.id){
        if (windows[i].isMinimized()) windows[i].restore();
        windows[i].show();
        windows[i].focus();
        break;
      }
    }
  }else{
    if (currentWindow.isMinimized()){
      currentWindow.restore();
      currentWindow.show();
    }
  }

  app.quit();
  return;

} else {
  createWindow();
}
*/

// var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
//   // 当另一个实例运行的时候，这里将会被调用，我们需要激活应用的窗口
//
//   if (singleWindow) {
//     // do nothing
//     ElectronicWeChatContext.triggerWindow = false;
//     if (electronicWeChat == null){
//       createWindow();
//     }else{
//       let currentWindow = BrowserWindow.getFocusedWindow();
//       if ( currentWindow == null ){
//         let windows = BrowserWindow.getAllWindows();
//         for(var i=0;i<windows.length;i++){
//           if (windows[i].id != singleWindow.id){
//             if (windows[i].isMinimized()) windows[i].restore();
//             windows[i].show();
//             windows[i].focus();
//             break;
//           }
//         }
//       }else{
//         if (currentWindow.isMinimized()){
//           currentWindow.restore();
//           currentWindow.show();
//         }
//       }
//
//     }
//   }
//
//   return true;
// });

// 这个实例是多余的实例，需要退出
// if (shouldQuit) {
//   app.quit();
//   return;
// }

/*
var handleStartupEvent = function() {

  if (process.platform !== 'win32') {
    return false;
  }

  function executeSquirrelCommand(args,done) {
    var updateDotExe = path.resolve(path.dirname(process.execPath),'..','update.exe');
    var child = cp.spawn(updateDotExe,args,{detached : true});
    child.on('close',function(code){
      done();
    });
  };

  function install(done) {
    var target = path.basename(process.execPath);
    executeSquirrelCommand(['--createShortcut',target],done);
  }

  function uninstall(done) {
    var target = path.basename(process.execPath);
    executeSquirrelCommand(['--removeShortcut',target],done);
  }

  var squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
      console.info("--squirrel-install");
      install(app.quit);
      return true;
    case '--squirrel-updated':
      console.info("--squirrel-updated");
      install(app.quit);
      return true;
    case '--squirrel-obsolete':
      console.info("--squirrel-obsolete");
      app.quit();
      return true;
    case '--squirrel-uninstall':
      console.info("--squirrel-quit");
      uninstall(app.quit);
      return true;
    default:
      return false;
  }
}
*/

// if (handleStartupEvent()) {
//   return;
// }



/**
 * 创建登陆窗口
**/
/*
let loginWindow
var login_check_error_count = 0
*/


function createWindow () {
    // Create the browser window.
    mainFrameWindow = new MainFrameWindow().initWindow();
    mainFrameWindow.show();

    new Database().initDatabase();
    initMainIpc();
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    app.quit();
})

app.on('activate', function () {
    if (mainFrameWindow === null) {
        createWindow()
    }
})


function initMainIpc(){

  ipcMain.on("user-login",(e,account,webviewId)=>{
    // 微信登录成功，用来控制左边的
    console.info("save account["+account+"],webviewId["+webviewId+"]");

    var saveAccount = new Promise(function(resolve, reject) {
      Database.saveLoginWxAccount(account,webviewId,0,(isNew)=>{
        mainFrameWindow.webContents.send("reload-left-menu");
        resolve(isNew);
      });
    })

    saveAccount.then(function(value){
      if(value){
        mainFrameWindow.webContents.send("prepare-new-wechat");
      }
    })


  });

  ipcMain.on("notifyUnreadMsg",(e,count,webviewId)=>{
      mainFrameWindow.webContents.send("refreshMsg",count,webviewId);
  });

  ipcMain.on("open-quick-replay",(e)=>{
      mainFrameWindow.webContents.send("open-quick-replay");
  });


}
