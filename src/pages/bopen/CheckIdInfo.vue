<template>
  <div class="checkidinfo container">
    <NavigatorBar @clickLeftHandler="clickLeft" :title="title" :background="titleBg" :color="titleColor"></NavigatorBar>
    <div class="label"> 身份证姓名</div>
    <input class="txt" placeholder="请输入姓名" v-model="idinfo.name" />
    <div class="label"> 身份证号</div>
    <input class="txt" placeholder="请输入身份证号" v-model="idinfo.idno" />
    <div class="label"> 身份证有效日期</div>
    <div class="date">
      <div class="dateRow">
        <div class="dateItemBox">
          <div class="dateItemBg">
            <span>起始有效日期</span>
            <span>{{idBegin}}</span>
          </div>
          <div class="dataItemCover">
            <input v-model="idBegin" type="date" class="date-cover" />
          </div>
        </div>
        <div class="gap"></div>
        <div class="dateItemBox">
          <div class="dateItemBg">
            <span>截止有效日期</span>
            <span>{{idEnd}}</span>
          </div>
          <div class="dataItemCover">
            <input v-model="idEnd" type="date" class="date-cover" />
          </div>
        </div>
      </div>
    </div>
    <div class="label"> 身份证有效地址</div>
    <input class="txt" placeholder="请输入身份证有效地址" v-model="idinfo.idAddress" />
    <div style="height:25px;"></div>
    <div class="agreeLabel" v-show="false">
      <input type="checkbox" v-model="checked" />&nbsp&nbsp我已阅读并同意
      <span style="color:#4080fb" class="list-panel">
        <span class="routerLink" v-for="protocol in protocolList" @click="readProtocol(protocol)" :key="protocol.id">
          {{protocol.name}}
        </span>
      </span>
    </div>
    <JButton title="确认并提交" @clickButtonHandler="clickButton"></JButton>
    <div style="height:30px;"></div>
  </div>
</template>
<script>
import NavigatorBar from "@/components/NavigatorBar";
import JButton from "@/components/JButton";
import utils from "@/lib/utils";
import params from "@/lib/params";
import valid from "@/lib/valid";
export default {
  name: "CheckIdInfo",
  data() {
    return {
      title: "证件信息核对",
      titleBg: params.whiteBgColor,
      titleColor: "#000",
      checked: true,
      idBegin: "1970-01-01",
      idEnd: "1970-01-01",
      idinfo: {
        name: "",
        idno: "",
        idBegin: "",
        idEnd: "",
        idAddress: ""
      },
      protocolList: [
        {
          id: 1,
          name: "协议名称"
        }
      ]
    };
  },
  created: function() {
    let idinfoStr = localStorage.getItem("idinfo");
    if (!utils.isEmpty(idinfoStr)) {
      this.idinfo = JSON.parse(idinfoStr);
    } else {
      this.idinfo = this.$route.query;
    }
    this.idBegin = this.idinfo.idBegin;
    this.idEnd = this.idinfo.idEnd;
    // utils.jPost("bopen/getprotocols", null, result => {
    //   this.protocolList = result.data;
    // });
  },
  methods: {
    readProtocol(protocol) {
      let jsonObj = this.idinfo;
      jsonObj.idBegin = this.idBegin;
      jsonObj.idEnd = this.idEnd;
      localStorage.setItem("idinfo", JSON.stringify(this.idinfo));
      this.$router.push({
        name: "ProtocolReader",
        params: {
          protocolid: protocol.id,
          name: protocol.name,
          title: protocol.title
        }
      });
    },
    clickLeft() {
      this.$router.back();
    },
    clickConfirm() {
      this.pop = false;
    },
    clickButton() {
      if (!valid.isCnAndEn(this.idinfo.name)) {
        utils.showAlert("", "姓名只能为中文汉字");
        return;
      }
      if (this.idinfo.name == "") {
        utils.showAlert("", "姓名不能为空");
        return;
      }
      if (!valid.isCardID(this.idinfo.idno)) {
        utils.showAlert("", "身份证号不正确");
        return;
      }
      if (this.idinfo.idno == "") {
        utils.showAlert("", "身份证号不能为空");
        return;
      }
      if (this.idinfo.idBegin == "") {
        utils.showAlert("", "身份证起始日期不能为空");
        return;
      }
      if (this.idinfo.idEnd == "") {
        utils.showAlert("", "身份证结束日期不能为空");
        return;
      }
      if (this.idinfo.idAddress == "") {
        utils.showAlert("", "身份证地址不能为空");
        return;
      }
      if (!this.checked) {
        utils.showAlert("", "请阅读并勾选用户投资协议");
      } else {
        utils.jPost(
          "bopen/submitidinfo",
          {
            bid: localStorage.getItem("bid"),
            name: this.idinfo.name,
            idno: this.idinfo.idno,
            idBegin: this.idBegin,
            idEnd: this.idEnd,
            idAddress: this.idinfo.idAddress,
            post_code: this.idinfo.post_code,
            sex: this.idinfo.sex,
            issuing_authority: this.idinfo.issuing_authority,
            birthday: this.idinfo.birthday
          },
          result => {
            this.$router.go(-2);
          }
        );
      }
    }
  },
  components: {
    NavigatorBar,
    JButton
  }
};
</script>
 <style>
.label {
  height: 35px;
  font-size: 13px;
  color: #666666;
  padding-left: 15px;
  line-height: 35px;
  text-align: left;
}

.txtDiv {
  width: 100%;
  height: 45px;
  background: white;
  padding: auto 15px;
}

.txt {
  width: 100%;
  height: 45px;
  font-size: 15px;
  color: #333333;
  background: white;
  /* line-height: 45px; */
  /* display: flex;
  align-items: center; */
  border: none;
  outline: none;
  padding: 0 15px 0 15px;
  box-sizing: border-box;
}

.date {
  height: 80px;
  background: white;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dateRow {
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.dateItemBox {
  /* width: 120px; //自动宽度就可以了*/
  height: 100%;
  padding: 0 20px;
  position: relative;
  left: 0;
  top: 0;
  background: transparent;
}

.dateItemBg {
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.dataItemCover {
  position: relative;
  width: 100%;
  height: 100%;
  top: -100%;
}

.date span {
  font-size: 15px;
  color: #666666;
  margin: 3px auto;
}

.gap {
  width: 1px;
  background: #eeeeee;
  height: 35px;
}

.agreeLabel {
  margin: auto 15px;
  text-align: left;
  font-size: 12px;
  vertical-align: middle;
  margin-bottom: 25px;
}

.agreeLabel input {
  outline: none;
  border: none;
}

.date-cover {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  border: none;
  outline: none;
  background: transparent;
  opacity: 0;
}

.routerLink {
  text-decoration: none;
  color: #4080f8;
  font-size: 12px;
}
</style>