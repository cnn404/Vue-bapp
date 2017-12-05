<template>
    <div class="addressinfo container">
        <NavigatorBar @clickLeftHandler="clickLeft" :title="title"></NavigatorBar>
        <div style="height:8px;"></div>
        <textarea :style="{color:greyColor}" class="area" placeholder="请输入联系地址" v-model="address"></textarea>
        <JButton :title="buttonTitle" @clickButtonHandler="clickButton"></JButton>
    </div>
</template>
<script>
import NavigatorBar from "@/components/NavigatorBar"
import JButton from "@/components/JButton"
import utils from "@/lib/utils"
import params from "@/lib/params"
export default ({
    name: "AdressInfo",
    data: () => {
        return {
            title: '填写地址',
            buttonTitle: "确认",
            greyColor: params.greyColor,
            address: "",
        }
    },
    created() {
        let address = this.$route.params.address
        if (!utils.isEmpty(address)) {
            this.address = address
        }
    },
    methods: {
        clickLeft: function() {
            this.$router.back()
        },
        clickButton: function() {
            if (this.address == "") {
                utils.showAlert("", "联系地址不能为空")
                return
            }
            let obj = this
            utils.jPost("bopen/submitaddress", {
                bid: localStorage.getItem("bid"),
                address: this.address
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