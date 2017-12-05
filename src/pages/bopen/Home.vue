<template>
  <div class="home container">
    <NavigatorBar @clickLeftHandler="clickLeft" :iconLeft="iconLeft" :title="title" :background="titleBg" :color="titleColor"></NavigatorBar>
    <div class="info" :style="{background:infoBg}">
      <div class="avatar">
        <img :src="avatar" />
      </div>
      <div class="desc" align="left">
        <label class="nickname">{{nickname}}</label>
        <label class="other">{{other}}&nbsp;&nbsp;{{idno}}</label>
      </div>
    </div>
    <div style="height:8px;"></div>
    <div class="itemPanel">
      <div class="line_hor"></div>
      <div v-for="(step,index) in stepList" :key="index">
        <div class="item mobile" @click="clickStepItem(step)">
          <div class='left'>
            <div class="imgBoxLeft">
              <img class="imgself" :src="step.icon" />
            </div>
            <label>{{step.stepname}}</label>
          </div>
          <div class="right">
            <label v-if="step.status==0">{{step.stepdesc}}</label>
            <label v-else-if="step.status==1">{{step.stepdesc}}</label>
            <label v-else-if="step.status==2">{{step.stepdesc}}</label>
            <label v-else>{{step.stepdesc}}</label>
            <div v-if="step.status==2 && (step.step==10 || step.step==20||step.step==30)" class="imgBoxRight">
              <img class="imgFinished" src="static/finished.png" />
            </div>
            <div v-else-if="step.step==40||step.step==50||step.status!=2" class="imgBoxRight">
              <img class="imgArrow" src="static/arrow.png" />
            </div>
          </div>
        </div>
        <div v-show="!((index+1)==stepList.length)" class="line"></div>
      </div>
      <div class="line_hor"></div>
    </div>
  </div>
</template>
<script>
  import NavigatorBar from "@/components/NavigatorBar";
  import utils from "@/lib/utils";
  import params from "@/lib/params";
  let id_front_img = null;
  let id_back_img = null;
  let face_img = null;
  export default {
    name: "Home",
    data: () => {
      return {
        title: "身份认证",
        iconLeft: "static/back.png",
        titleBg: params.blueBgColor,
        titleColor: "#FFFFFF",
        infoBg: params.blueBgColor,
        nickname: "经纪人_",
        other: "未实名",
        avatar: "static/avatar.jpg",
        mobilephone: "",
        bid: "",
        idno: "",
        //status:  0：未完成 1：待审核 2：已完善（不可再编辑） 3：审核不通过
        stepList: [{
            step: 10,
            icon: "static/mobile.png",
            stepname: "手机",
            status: 0,
            addition: {},
            stepdesc: "未完成"
          },
          {
            step: 20,
            icon: "static/id.png",
            stepname: "证件照片",
            status: 0,
            addition: {},
            stepdesc: "未完成"
          },
          {
            step: 30,
            icon: "static/face.png",
            stepname: "人脸照片",
            status: 0,
            addition: {},
            stepdesc: "未完成"
          },
          {
            step: 40,
            icon: "static/email.png",
            stepname: "邮箱",
            status: 0,
            addition: {},
            stepdesc: "未完成"
          },
          {
            step: 50,
            icon: "static/address.png",
            stepname: "联系地址",
            status: 0,
            addition: {},
            stepdesc: "未完成"
          }
        ]
      };
    },
    mounted: function () {
      this.mobilephone = this.$route.query.mobilephone;
      this.bid = this.$route.query.bid;
      let sid = this.$route.query.SID;
      if (!utils.isEmpty(sid)) {
        localStorage.setItem("SID", sid);
      } else {
        sid = localStorage.getItem("SID");
      }
      let jsonObj = {};
      if (utils.isEmpty(this.mobilephone) && !utils.isEmpty(this.bid)) {
        //传bid
        jsonObj.bid = this.bid;
        localStorage.setItem("bid", this.bid);
      } else if (!utils.isEmpty(this.mobilephone) && utils.isEmpty(this.bid)) {
        //传手机号
        jsonObj.mobilephone = this.mobilephone;
        localStorage.setItem("mobilephone", this.mobilephone);
      } else if (!utils.isEmpty(this.mobilephone) && !utils.isEmpty(this.bid)) {
        jsonObj.bid = this.bid;
        localStorage.setItem("bid", this.bid);
      } else {
        if (utils.isEmpty(sid)) {
          utils.showAlert("", "缺少bid、手机号、SID");
          return;
        }
      }
      //手机号查询用户开户信息
      utils.jPost("bopen/getstatus", jsonObj, result => {
        if (result.code == 0) {
          let data = result.data;
          let avatar = data.avatar;
          if (!utils.isEmpty(avatar)) {
            this.avatar = avatar;
          }
          if (data.isRealName) {
            this.other = "已实名";
            this.idno = data.idno.replace(
              /^(\d{3})\d{11}(\d+)/,
              "$1***********$2"
            );
          } else {
            this.other = "未实名";
          }
          this.stepList.map(item => {
            let obj = data.steps
              .filter(dataItem => {
                return dataItem.step == item.step;
              })
              .pop();
            item.status = obj.status;
            item.addition = obj.addition;
            //status:  0：未完成 1：待审核 2：已完成（不可再编辑） 3：审核不通过
            switch (obj.status) {
              case 0:
                item.stepdesc = "未完成";
                break;
              case 1:
                item.stepdesc = "待审核";
                break;
              case 2:
                switch (obj.step) {
                  case 10:
                    item.stepdesc = obj.addition.mobilephone.replace(
                      /^(\d{3})\d{4}(\d+)/,
                      "$1****$2"
                    );
                    break;
                  case 20:
                    item.stepdesc = "已完善";
                    break;
                  case 30:
                    item.stepdesc = "已完善";
                    break;
                  case 40:
                    item.stepdesc = obj.addition.email;
                    break;
                  case 50:
                    item.stepdesc = obj.addition.address;
                    break;
                  default:
                    break;
                }
                break;
              case 3:
                item.stepdesc = "审核不通过";
                break;
              default:
                break;
            }
          });
          if (data.avatar != "") {
            this.avatar = data.avatar;
          }
          this.nickname = data.name;
          localStorage.setItem("bid", data.bid);
        }
      });
    },
    components: {
      NavigatorBar
    },
    methods: {
      clickLeft: () => {
        // utils.callNative({ action: 2 })
      },
      clickStepItem: function (info) {
        switch (info.step) {
          case 10:
            if (info.status != 2) {
              this.$router.push({
                name: "Home"
              });
            }
            break;
          case 20:
            if (info.status != 2) {
              this.$router.push({
                name: "UploadPhoto",
                query: info.addition
              });
            }
            break;
          case 30:
            if (info.status != 2) {
              this.$router.push({
                name: "UploadAvatar",
                params: info.addition
              });
            }
            break;
          case 40:
            this.$router.push({
              name: "EmailInfo",
              params: info.addition
            });
            break;
          case 50:
            this.$router.push({
              name: "AddressInfo",
              params: info.addition
            });
            break;
          default:
            break;
        }
      }
    }
  };

</script>
<style scoped>
  .info {
    height: 64px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 15px;
  }

  .avatar {
    width: 45px;
    height: 45px;
  }

  .avatar img {
    width: 100%;
    height: 100%;
  }

  .desc {
    height: 45px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-self: center;
    margin-left: 10px;
    color: white;
  }

  .nickname {
    font-size: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }

  .other {
    font-size: 13px;
    display: flex;
    justify-content: flex-start;
  }

  .itemPanel {
    background: white;
    width: 100%;
    height: auto;
  }

  .item {
    height: 45px;
    background: white;
    padding-left: 15px;
    padding-right: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .touchEffect {
    filter: brightness(0.8);
    -ms-filter: brightness(0.8);
    -webkit-filter: brightness(0.8);
  }

  .item .left {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .item .left label {
    font-size: 15px;
    color: #333333;
  }

  .item .right {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .item .right label {
    color: #999999;
    font-size: 15px;
    background: transparent;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 150px;
  }

  .line {
    height: 1px;
    background: #eeeeee;
    margin-left: 15px;
  }

  .line_hor {
    height: 1px;
    background: #eeeeee;
  }

  .imgBoxLeft {
    width: 20px;
    height: 20px;
    margin-right: 15px;
  }

  .imgBoxRight {
    width: 20px;
    height: 20px;
    margin-left: 0;
    background: transparent;

    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .imgself {
    height: 100%;
    float: right;
  }

  .imgArrow {
    width: 8px;
  }

  .imgFinished {
    width: 15px;
  }

</style>
