<template>
    <div class="ProtocolReader container">
        <NavigatorBar @clickLeftHandler="clickLeft" :title="title"></NavigatorBar>
        <div class="content">
            <p v-html="contentHtml"></p>
        </div>
        <JButton v-show="showBtn" :title="buttonTitle" @clickButtonHandler="clickButton"></JButton>
        <div style="height:30px;"></div>
    </div>
</template>
<script>
import NavigatorBar from "@/components/NavigatorBar"
import JButton from "@/components/JButton"
import utils from "@/lib/utils"

export default ({
    name: "ProtocolReader",
    data() {
        return {
            buttonTitle: "确认",
            title: '协议名称',
            contentHtml: "",
            showBtn:false
        }
    },
    created() {
        let protocolid = this.$route.params.protocolid
        this.title = this.$route.params.title
        utils.jPost("bopen/showprotocol", {protocolId:protocolid}, (result) => {
            if (result.code == 0) {
                let data = result.data
                this.contentHtml = data.content
                this.showBtn=true
            } 
        })
    },
    methods: {
        clickButton() {
            this.$router.back()
        },
        clickLeft: function() {
            this.$router.back()
        },
    },
    components: {
        NavigatorBar, JButton
    }

})
</script>
<style scoped>
.content {
    padding: 15px;
    font-size: 0.9rem;
    line-height: 1.5rem;
    text-align: left;
}
</style>
