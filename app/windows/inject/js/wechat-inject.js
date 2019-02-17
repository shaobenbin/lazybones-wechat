"use strict";

class WechatCSSInjector {}

WechatCSSInjector.commonCSS = `
  a{
    cursor:pointer;
  }

  div.header, div.title_wrap {
      -webkit-app-region: drag;
  }

  div.title.poi {
      -webkit-app-region: no-drag;
  }

  div.qrcode {
    margin-left: 170px;
    margin-top: 100px;
  }

  div.header .avatar, div.header .info {
      -webkit-app-region: no-drag;
  }

  div.main {
    height: 100% !important;
    min-height: 0 !important;
    padding-top: 0 !important;
  }

  div.main_inner {
    max-width: none !important;
    min-width: 0 !important;
    margin-left:160px;
    margin-top:40px;
    padding:0;
    height:calc(100% - 40px);
  }

  div.message_empty {
    margin-top: 50px;
  }

  div.img_preview_container div.img_opr_container {
    bottom: 50px !important;
  }

  p.copyright {
    display: none !important
  }

  a.web_wechat_screencut {
    display: none !important;
  }

  * {
    -webkit-user-select: none;
    -webkit-user-drag: none;
    #cursor: default !important;
  }

  pre, input {
    -webkit-user-select: initial;
    cursor: initial !important;
  }

  html, body {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  div.login_box {
    top: initial;
    left: initial;
    margin-left: initial;
    margin-top: initial;
    width: 100%;
    height: 100%;
  }

  div.login {
    min-width: 0;
    min-height: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  div.lang, div.copyright {
    display: none !important
  }

  /* Group mention: user selection box */
  div#userSelectionBox select option:hover {
    background: #eeeeee;
  }

  div#userSelectionBox select option {
    padding: 4px 10px;
    text-overflow: hidden;
    font-size: 14px;
  }

  .user_select_hint_text {
    padding: 4px 10px;
    font-size: 14px;
    background: #eeeeee;
  }

  div#userSelectionBox select {
    width: 120px;
    border: none;
    outline: none;
    height: inherit;
  }

  div#userSelectionBox {
    box-shadow: 1px 1px 10px #ababab;
    background: #fff;
    display: none;
    position: fixed;
    bottom: 140px;
    left: 300px;
  }

  span.measure_text {
    padding-left: 20px;
    outline: 0;
    border: 0;
    font-size: 14px;
  }

  .login_box .qrcode .close_qrcode{
      border-radius: 50px;
      box-shadow: 0 0 7px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(188, 188, 188, 0.1);
      display: block;
      float: left;
      margin: 0px 45%;
      overflow: hidden;
      padding: 10px 10px 10px 10px;
      position: relative;
      transition: box-shadow 0.3s ease-in-out 0s;
      text-align: center;
      font-size: 14px;
      color: #353535;
      cursor:pointer;
    }

    /* begin of model css */

    #popup, .bMulti {
      min-height: 250px;
    }
    #popup, #popup2, .bMulti {
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 25px 5px #999;
        color: #111;
        display: none;
        min-width: 550px;
        padding: 25px;
    }

    .popup-content {
      height:400px;overflow: auto;
    }

    .button.b-close, .button.bClose {
        border-radius: 7px;
        box-shadow: none;
        font: bold 131% sans-serif;
        padding: 0 6px 2px;
        position: absolute;
        right: -7px;
        top: -7px;
    }
    .button {
        background-color: #2b91af;
        border-radius: 10px;
        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
        color: #fff;
        cursor: pointer;
        display: inline-block;
        padding: 10px 20px;
        text-align: center;
        text-decoration: none;
    }
`
