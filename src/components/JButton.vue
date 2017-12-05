<template>
    <div class="JButton" @touchstart="touchStart" @touchend="touchEnd">
        <div v-if="disable" class="BtnBox" :style="{background:disabledBg,'border-radius':radius}">
            <label>{{this.title}}</label>
        </div>
        <div v-else class="BtnBox" :style="{background:buttonBg,'border-radius':radius}">
            <label>{{this.title}}</label>
        </div>
        <div v-show="cover" class="coverBtn" :style="{'border-radius':radius}"></div>
    </div>
</template>
<script>
import params from "@/lib/params"
export default ({
    name: 'JButton',
    data: () => {
        return {
            buttonBg: params.blueBgColor,
            disabledBg: params.disableColor,
            cover: false,
            radius: '5px'
        }
    },
    props: {
        title: {
            default: "按钮"
        },
        disable: {
            default: false
        }
    },
    methods: {
        touchStart(e) {
            if (!this.disable) {
                this.cover = true
            }
            e.preventDefault()
            return false
        },
        touchEnd(e) {
            if (!this.disable) {
                this.cover = false
                this.$emit("clickButtonHandler")
            }
            e.preventDefault()
            return false
        }
    }
})
</script>
<style scoped>
.JButton {
    margin: auto 15px;
    height: 45px;
    position: relative;
    background: transparent;
}

.BtnBox {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 17px;
}

.coverBtn {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: black;
    width: 100%;
    opacity: 0.2;
    filter: alpha(opacity=20);
}
</style>