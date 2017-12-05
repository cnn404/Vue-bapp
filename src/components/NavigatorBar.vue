<template>
    <div v-show="this.$store.state.showNavi" class="navigatorbar" :style="{background:background}">
            <div class="leftBtn" @click="clickLeft">
                <img :src="iconLeft" />
            </div>
            <div class="title" :style="{color:color}">
                {{this.title}}
            </div>
            <div  class="rightBtn" @click="clickRight">
                <img :src="iconRight" v-show="showRight"/>
            </div>
    </div>
</template>
<script>
import utils from "@/lib/utils"
export default ({
    name: 'NavigatorBar',
    data: function() {
        return {
            showRight:false
        }
    },
    props: {
        title: {
            default: '我的标题'
        },
        iconLeft: {
            default: 'static/backblue.png'
        },
        iconRight: {
            default: ''
        },
        background: {
            default: '#FFFFFF'
        },
        color: {
            default: 'black'
        }
    },
    mounted(){
        if(utils.isEmpty(this.iconRight)){
            this.showRight=false
        }
    },
    methods: {
        clickLeft: function() {
            this.$emit('clickLeftHandler')
        },
        clickRight: function() {
            this.$emit('clickRightHandler')
        }
    }
})
</script>
<style scoped>
.navigatorbar {
      width: 100%;
    height: 44px;
    /* background: blue; */
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.leftBtn {
    width: 45px;
    height: 100%;
    /* background: red; */
    display: flex;
    justify-content: center;
    align-items: center;
}

.leftBtn img {
    width: 10px;
}

.title {
    background: transparent;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.rightBtn {
    width: 45px;
    height: 100%;
    /* background: peru; */
    display: flex;
    justify-content: center;
    align-items: center;
}

.rightBtn img {
    width: 10px;
}
</style>
