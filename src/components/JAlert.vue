<template>
    <div class="JAlert" v-show="this.$store.state.jAlertInfo.pop">
        <div class="dialog">
            <div class="title" v-show="showTitle" v-html="alertInfo.title"></div>
            <div class="content" :style="{'padding-top':padding+'px','padding-bottom':padding+'px'}" v-html="alertInfo.content"></div>
            <div class="footer">
                <div class="line"></div>
                <div class="buttons">
                  <div v-show="showTwoBtn" class="cancelBtn" :class="{touchEffect:isPressCancel}" @touchstart="cancel_touchstart" @touchend="cancel_touchend">
                    <div>{{alertInfo.cancel.title}}</div>
                  </div>
                  <div v-show="showTwoBtn" class="gap"></div>
                  <div class="confirmBtn" :class="{touchEffect:isPressConfirm}"  @touchstart="confirm_touchstart" @touchend="confirm_touchend">
                    <div>{{alertInfo.confirm.title}}</div>
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import utils from "@/lib/utils";
let canScroll = false;
export default {
  name: "JAlert",
  data: function() {
    return {
      isPressConfirm: false,
      isPressCancel: false,
      showTitle: true,
      padding: 0,
      showTwoBtn: false
    };
  },
  props: {
    alertInfo: {
      default: {
        title: {
          default: "提示"
        },
        content: {
          default: "这是一条提示内容"
        },
        confirm: {
          title: {
            default: "确认"
          },
          confirmFunc: null
        },
        cancel: {
          title: {
            default: "取消"
          },
          cancelFunc: null
        }
      }
    }
  },
  methods: {
    cancel_touchstart(e) {
      e.preventDefault();
      this.isPressCancel = true;
    },
    cancel_touchend(e) {
      e.preventDefault();
      this.isPressCancel = false;
      if (!utils.isEmpty(this.alertInfo.cancel.cancelFunc)) {
        this.alertInfo.cancel.cancelFunc();
      }
      utils.hideAlert();
    },
    confirm_touchstart(e) {
      e.preventDefault();
      this.isPressConfirm = true;
    },
    confirm_touchend(e) {
      e.preventDefault();
      this.isPressConfirm = false;
      // this.$emit('clickConfirmHandler');
      if (!utils.isEmpty(this.alertInfo.confirm.confirmFunc)) {
        this.alertInfo.confirm.confirmFunc();
      }
      utils.hideAlert();
    }
  },
  watch: {
    alertInfo: function() {
      if (utils.isEmpty(this.alertInfo.title)) {
        this.showTitle = false;
        this.padding = 20;
      } else {
        this.showTitle = true;
        this.padding = 10;
      }
      if (utils.isEmpty(this.alertInfo.cancel.cancelFunc)) {
        this.showTwoBtn = false;
      } else {
        this.showTwoBtn = true;
      }
    }
  }
};
</script>
<style scoped>
.JAlert {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
}

.dialog {
  width: 70%;
  min-width: 270px;
  max-width: 380px;
  background: white;
  transform-origin: 50% 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: space-between;
}

.title {
  width: 100%;
  height: 40px;
  font-weight: bold;
  font-size: 17px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.content {
  font-size: 15px;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
  margin-right: 15px;
  /* padding-top: 25px;
    padding-bottom: 25px; */
  /* padding-top: 12px;
    padding-bottom: 12px; */
}

.footer {
  height: 46px;
  width: 100%;
  bottom: 0;
}

.line {
  width: 100%;
  height: 1px;
  background: #eeeeee;
  /* background: black; */
}

.buttons {
  width: 100%;
  height: 45px;
  /* background: red; */
  box-sizing: border-box;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.confirmBtn123 {
  width: 100%;
  height: 100%;
  color: #4080f8;
  background: white;
  font-size: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.touchEffect {
  filter: brightness(0.95);
  -ms-filter: brightness(0.95);
  -webkit-filter: brightness(0.95);
}
.gap {
  width: 1px;
  height: 100%;
  background: #eeeeee;
  /* background: black; */
}
.cancelBtn {
  /* background: blue; */
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #4080f8;
  background: white;
  font-size: 17px;
}
.confirmBtn {
  /* background: yellow; */
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: #4080f8;
  background: white;
  font-size: 17px;
}
</style>