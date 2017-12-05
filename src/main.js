// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import bopen from './router/bopen'
import customer from './router/customer'
import utils from './lib/utils'
Vue.config.productionTip = false

/* eslint-disable no-new */
let vueObj = {
  el: '#app',
  router: bopen,
  store: store,
  template: '<App/>',
  components: {
    App
  },
}
var domain = document.location.href;
if (domain.indexOf('localhost') >= 0 || domain.indexOf("bapp.stock.com") >= 0) { //本地环境
  store.state.APIURL = "http://bdev.cc.gg/"
  // store.state.APIURL = "http://bapp.stock.com/"  
} else { //其他开发、测试、生产都是按照php入口传过来的url解析
  store.state.APIURL = document.location.origin + "/"
}
let route = utils.GetQueryString("route")
let SID = utils.GetQueryString("SID")
localStorage.setItem("SID", SID)
switch (route) {
  case "bopen":
    vueObj.router = bopen
    break;
  case "customer":
    vueObj.router = customer
    break;
  default:
    break;
}
new Vue(vueObj)
