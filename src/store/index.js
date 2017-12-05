import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
export default new Vuex.Store({
    state:{
        showLoading:false,
        showNavi:true,//显示导航条
        APIURL:"",//从url解析
        jAlertInfo:{
            pop:false,//是否弹出消息框
            title:"提醒",
            content:"请确认您的操作",
            confirm:{
                title:"确认",
                confirmFunc:null
            },
            cancel:{
                title:"取消",
                cancelFunc:null
            }
        }       
    }
})
