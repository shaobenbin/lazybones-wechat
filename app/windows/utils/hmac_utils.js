
"use strict";

const crypto = require('crypto');
const key = 'abcDlg';

class HmacUtils {
  constructor() {

  }


}

HmacUtils.sign = function(url,method,params){
  var keys = []
  for(var key in params){
    keys.push(key);
  }

  keys.sort();

  var queryStr = ""
  for(var i=0;i<keys.length;i++){
    var key = keys[i];
    queryStr+=(key+"="+params[key]);
    if (i != (keys.length-1)){
      queryStr += "&";
    }
  }

  var sign_origin_str = method.toLowerCase()+"&"+encodeURIComponent(url.toLowerCase())+"&"+encodeURIComponent(queryStr);

  return this.encrypt(sign_origin_str);
}

HmacUtils.encrypt = function(text){
  return crypto.createHmac('sha1', key).update(text).digest('hex')
}

module.exports = HmacUtils;
