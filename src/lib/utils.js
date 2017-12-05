import store from '@/store'
import axios from "axios"
import params from "@/lib/params"
import canvasToBlob from "@/lib/canvas-to-blob"

function jPost(action, jsonObj, successCallback) {
  this.showLoading()
  let obj = this
  let sid = localStorage.getItem("SID")
  action += "?SID=" + (isEmpty(sid) ? "" : sid)
  let host = store.state.APIURL
  axios.post(host + action, jsonObj, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }
  }).then(function (result) {
    let data = result.data
    if (data.code == 0) { //返回正确
      localStorage.setItem("SID", data.SID)
      successCallback(data)
    } else if (data.code == -32001 || data.code == -32002 || data.code == -32003) { //去默认错误页面
      window.location = store.state.APIURL + "system/error"
    } else {
      obj.showAlert("系统错误", data.msg)
    }
    obj.hideLoading()
  }, function (error) {
    obj.hideLoading()
    alert(JSON.stringify(error))
  })
}

function openURL(action) {
  let host = store.state.APIURL
  let sid = localStorage.getItem("SID")
  let url = host + action + "&SID=" + sid
  this.callNative({
    action: 0,
    url: url
  })
}

function openWorldURL(url) {
  this.callNative({
    action: 0,
    url: url
  })
}
/*内部URL跳转*/
function openInsideLocation(action) {
  window.location.href = store.state.APIURL + action
}
/*外部URL跳转*/
function openWorldLocation(url) {
  window.location.href = url
}
//获取跨域的文件Blob格式
function getRemoteImageBlob(action, fileUrl, callBack) {
  // this.showLoading()
  let host = store.state.APIURL
  let url = host + action + "?url=" + fileUrl
  let xhr = new XMLHttpRequest()
  xhr.open("GET", url)
  xhr.responseType = "blob"
  xhr.onload = () => {
    callBack(xhr.response)
    // +function (obj) {
    //     setTimeout(function () {
    //       obj.hideLoading()
    //     }, 300);
    //   }(this)
  }
  xhr.send()
}

function compressImage(img64, width, height, ratio, callBack) {
  var canvas, ctx, img64;
  let img  = new Image()   
  img.src = img64        
  canvas = document.createElement('canvas');          
  canvas.width = width;   
  canvas.height = height;            
  ctx = canvas.getContext("2d");    
  ctx.drawImage(img, 0, 0, width, height);      
  // img64 = canvas.toDataURL("image/jpeg", ratio);   
  canvas.toBlob(function (blob) {
    callBack(blob)
  })         
}

function getSystemType() {
  var ua = window.navigator.userAgent;
  if (navigator.userAgent.match(/android/i)) {
    return params.SYSTEM_ANDRIOD;
  } else if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
    return params.SYSTEM_IOS;
  } else {
    return params.SYSTEM_UNKNOW;
  }
}

function isWeiXin() {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}

function isEmpty(obj) {
  if (obj == "" || obj == null || obj == undefined) {
    return true
  } else {
    return false
  }
}

function showLoading() {
  store.state.showLoading = true
}

function hideLoading() {
  store.state.showLoading = false
}

function callNative(options) {
  var prefix = "js-call://";
  if (getSystemType() == params.SYSTEM_IOS) {
    prefix = "js-call:/?";
  }
  var url = prefix + JSON.stringify(options);
  var iframe = document.createElement("IFRAME");
  iframe.setAttribute("src", url);
  document.documentElement.appendChild(iframe);
  iframe.parentNode.removeChild(iframe);
  iframe = null;
}
//设置导航标题
function setTitle(title) {
  document.title = title
  var mobile = navigator.userAgent.toLowerCase()
  if (/iphone|ipad|ipod/.test(mobile)) {
    var iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    // iframe.setAttribute('src', '')
    var iframeCallback = function () {
      setTimeout(function () {
        iframe.removeEventListener('load', iframeCallback)
        document.body.removeChild(iframe)
      }, 0)
    }
    iframe.addEventListener('load', iframeCallback)
    document.body.appendChild(iframe)
  }
}
//显示弹框
function showAlert(title, content, confirmTitle = "确认", confirmFunc = null, cancelTitle = "取消", cancelFunc = null) {
  store.state.jAlertInfo = {
    pop: true,
    title: title,
    content: content,
    confirm: {
      title: confirmTitle,
      confirmFunc: confirmFunc
    },
    cancel: {
      title: cancelTitle,
      cancelFunc: cancelFunc
    }
  }
}

function hideAlert() {
  store.state.jAlertInfo.pop = false
}

function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let params = window.location.href.split('?')[1]
  var r = params.match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}
function NavigatorHeight(){
  if(store.state.showNavi){
    return 0
  }else{
    if(this.getSystemType()==params.SYSTEM_ANDRIOD){
      return 44
    }else{
      return 64
    }
  }
}
/** 
 * 和PHP一样的时间戳格式化函数 
 * @param {string} format 格式 
 * @param {int} timestamp 要格式化的时间 默认为当前时间 
 * @return {string}   格式化的时间字符串 
 */
function dateFormat(format, myDate) { 
  var date = {
    "M+": myDate.getMonth() + 1,
    "d+": myDate.getDate(),
    "h+": myDate.getHours(),
    "m+": myDate.getMinutes(),
    "s+": myDate.getSeconds(),
    "q+": Math.floor((myDate.getMonth() + 3) / 3),
    "S+": myDate.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (myDate.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
        date[k] : ("00" + date[k]).substr(("" + date[k]).length));
    }
  }
  return format;
}
export default ({
  jPost: jPost,
  openURL: openURL,
  openWorldURL: openWorldURL,
  openInsideLocation: openInsideLocation,
  openWorldLocation: openWorldLocation,
  callNative: callNative,
  isEmpty: isEmpty,
  showLoading: showLoading,
  hideLoading: hideLoading,
  setTitle: setTitle,
  showAlert: showAlert,
  hideAlert: hideAlert,
  GetQueryString: GetQueryString,
  getSystemType: getSystemType,
  isWeiXin: isWeiXin,
  getRemoteImageBlob: getRemoteImageBlob,
  compressImage: compressImage,
  dateFormat: dateFormat,
  NavigatorHeight:NavigatorHeight
})
