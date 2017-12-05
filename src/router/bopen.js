import Vue from 'vue'
import Router from 'vue-router'
import utils from '@/lib/utils'
import store from '@/store'
// import Home from '@/pages/bopen/Home'
// import AddressInfo from '@/pages/bopen/AddressInfo'
// import CheckIdInfo from '@/pages/bopen/CheckIdInfo'
// import EmailInfo from '@/pages/bopen/EmailInfo'
// import UploadAvatar from '@/pages/bopen/UploadAvatar'
// import UploadPhoto from '@/pages/bopen/UploadPhoto'
// import ProtocolReader from '@/pages/bopen/ProtocolReader'
const Home = () =>
  import ( /* webpackChunkName: "bopen" */ "@/pages/bopen/Home")
const AddressInfo = () =>
  import ( /* webpackChunkName: "bopen" */ "@/pages/bopen/AddressInfo")
const CheckIdInfo = () =>
  import ( /* webpackChunkName: "bopen" */ "@/pages/bopen/CheckIdInfo")
const EmailInfo = () =>
  import ( /* webpackChunkName: "bopen" */ "@/pages/bopen/EmailInfo")
const UploadAvatar = () =>
  import ( /* webpackChunkName: "bopen" */ "@/pages/bopen/UploadAvatar")
const UploadPhoto = () =>
  import ( /* webpackChunkName: "bopen" */ "@/pages/bopen/UploadPhoto")
const ProtocolReader = () =>
  import ( /* webpackChunkName: "bopen" */ "@/pages/bopen/ProtocolReader")
let router = new Router({
  // mode: 'history',
  base: 'bapp',
  routes: [
    // {
    //   path: '/',
    //   redirect: {
    //     name: 'test'
    //   }
    // },
    {
      path: '/',
      name: 'Home',
      title: '身份认证',
      component: Home
    },
    {
      path: '/addressinfo',
      name: 'AddressInfo',
      title: '填写地址',
      component: AddressInfo
    },
    {
      path: '/checkidinfo',
      name: 'CheckIdInfo',
      title: '证件信息核对',
      component: CheckIdInfo
    },
    {
      path: '/emailinfo',
      name: 'EmailInfo',
      title: '填写邮箱',
      component: EmailInfo
    },
    {
      path: '/uploadavatar',
      name: 'UploadAvatar',
      title: '拍照验证',
      component: UploadAvatar
    },
    {
      path: '/uploadphoto',
      name: 'UploadPhoto',
      title: '证件照片',
      component: UploadPhoto
    },
    {
      path: '/protocolreader',
      name: 'ProtocolReader',
      title: '阅读协议',
      component: ProtocolReader
    }
  ]
})
router.afterEach((transition) => {
  let name = transition.name
  let item = router.options.routes.filter((ele) => {
    return ele.name == name
  }).pop()
  let title = item.title
  utils.setTitle(title)
  store.state.showNavi = false
  // if (utils.isWeiXin()) {
  //   store.state.showNavi = false
  // } else {
  //   store.state.showNavi = true
  // }
  if (name == "Home") {
    utils.callNative({
      action: 1,
      title: title,
      style: 'blue'
    })
  } else {
    utils.callNative({
      action: 1,
      title: title,
      style: 'white'
    })
  }
})
router.beforeEach((to, from, next) => {  
  utils.hideAlert()
  next()
})
export default router
