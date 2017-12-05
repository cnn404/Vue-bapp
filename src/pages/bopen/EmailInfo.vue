<template>
    <div class="emailinfo container">
        <NavigatorBar @clickLeftHandler="clickLeft" :title="title"></NavigatorBar>
        <div style="height:8px;"></div>
        <textarea :style="{color:greyColor}" class="area" placeholder="请输入邮箱地址" v-model="email"></textarea>
        <JButton :title="buttonTitle" @clickButtonHandler="clickButton"></JButton>
    </div>
</template>
<script>
import NavigatorBar from "@/components/NavigatorBar"
import JButton from "@/components/JButton"
import utils from "@/lib/utils"
import params from "@/lib/params"
import valid from "@/lib/valid"
export default ({
    name: "EmailInfo",
    data: () => {
        return {
            title: '填写邮箱',
            buttonTitle: "确认",
            greyColor: params.greyColor,
            email: "",
        }
    },
    created() {
        let email = this.$route.params.email
        if (!utils.isEmpty(email)) {
            this.email = email
        }
    },
    methods: {
        clickLeft: function() {
            this.$router.back()
        },
        clickButton: function() {
            if (this.email == "") {
                utils.showAlert("", "邮箱地址不能为空")
                return
            }
            if (!valid.isEmail(this.email)) {
                utils.showAlert("", "邮箱格式不正确")
                return
            }
            let obj = this
            utils.jPost("bopen/submitemail", {
                bid: localStorage.getItem("bid"),
                email: this.email
            }, (result) => {
                obj.clickLeft()
            })
        }
    },
    components: {
        NavigatorBar, JButton
    }
})
</script>
<style scoped>
.area {
    width: 100%;
    height: 120px;
    background: white;
    border: none;
    resize: none;
    margin-bottom: 25px;
    padding: 15px;
    box-sizing: border-box;
    outline: none;
    font-size: 15px;
}
</style>