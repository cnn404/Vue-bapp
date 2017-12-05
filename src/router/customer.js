import Vue from 'vue'
import Router from 'vue-router'
// import CustDetails from '@/pages/customer/CustDetails'
// import CustInfoList from '@/pages/customer/CustInfoList'
// import SubmitRegister from '@/pages/customer/SubmitRegister'

const CustDetails = () =>import ( /* webpackChunkName: "customer" */ "@/pages/customer/CustDetails")
const CustInfoList = () =>import ( /* webpackChunkName: "customer" */ "@/pages/customer/CustInfoList")
const SubmitRegister = () =>import ( /* webpackChunkName: "customer" */ "@/pages/customer/SubmitRegister")
import utils from '@/lib/utils'
import store from '@/store'
import Test from "@/pages/customer/Test"
Vue.use(Router)

let router = new Router({
  base: 'bapp',
  routes: [
    {
      path: '/test',
      name: 'Test',
      title: '测试',
      component: Test
    },
    {
      path: '/',
      name: 'CustDetails',
      title: '客户详情',
      component: CustDetails
    },
    {
      path: '/custinfolist',
      name: 'CustInfoList',
      title: '待办事项',
      component: CustInfoList
    },
    {
      path: '/submitregister',
      name: 'SubmitRegister',
      title: '事项详情',
      component: SubmitRegister
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
  // if (utils.isWeiXin()) {
  //   store.state.showNavi = false
  // } else {
  //   store.state.showNavi = true
  // }
  store.state.showNavi = false
})
router.beforeEach((to, from, next) => {
  utils.hideAlert()
  next()
})
export default router
