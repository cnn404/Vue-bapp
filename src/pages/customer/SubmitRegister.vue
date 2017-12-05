<template>
    <div class="SubmitRegister container">
        <NavigatorBar @clickLeftHandler="clickLeft" :title="title"></NavigatorBar>
        <div style="height:8px;"></div>
        <div class="custDiv">
            <div class="cust_item">
                <div class="left">
                    <div class="line1">
                        <span class="title">客户<span style="opacity:0">信息</span></span>
                         <span class="desc">{{userInfo.c_name}} {{userInfo.mobilephone}}</span>
                    </div>
                    <div class="line2">
                         <span class="title">意向产品</span>
                         <span class="desc">{{userInfo.p_name}}</span>
                    </div>
                    <div class="line3">
                         <span class="title">产生时间</span>
                         <span class="desc">{{userInfo.create_time}}</span>
                    </div>
                </div>
                <div class="right">
                    <img src="static/call.png"  @touchend='clickCallBtn'/>
                </div>
            </div>
         </div>
         <div class="warningRow" v-show="userInfo.register">
             <div class="warningDiv">
                 <div class="warningTxt">
                     请您尽快联系客户，并登记客户以下信息，可获取我们为Ta量身制作的营销帮助。														
                 </div>
             </div>
         </div>
         <div class="panel_row" v-show="userInfo.register">
             <div class="panel_content">
                 <div class="list_item">
                     <div class="div0">总保额预算：</div>
                     <input v-model="total_budge" class="input0" type="number" pattern="\d*"/>
                 </div>
                <div class="list_item">
                     <div class="div0" style="opacity:0">总保额预算：</div>
                     <div class="radio_div">
                        <div @click="clickUSBtn" :class="[!usbtn_checked?'radioBtn_Default':'radioBtn_Checked']">美元</div>
                        <div @click="clickHKBtn" :class="[usbtn_checked?'radioBtn_Default':'radioBtn_Checked']">港元</div>
                     </div>
                 </div>
                 <div style="height:25px;"></div>
                 <div class="list_item">
                    <div class="div0">保费缴付期：</div>
                    <select v-model="period">
                        <option v-for="(item,index) in time_select" :value="item.value"  :key="index">{{item.txt}}</option>
                    </select>
                 </div>
                 <div class="list_item">
                    <div class="div0">受保人年龄：</div>
                    <div class="age_div">
                        <div class="input1">
                            <input type="number" pattern="\d*" v-model="age"/>
                        </div>
                        <div class="age">周岁</div>
                    </div>
                 </div>
            </div>
            <div style="height:25px;"></div>
            <j-button title="提交登记" @clickButtonHandler="clickButton"></j-button>
            <div style="height:15px;"></div>
         </div>

         <div class="register_div" v-show="!userInfo.register">
            <div style="height:8px;"></div>
            <div class="register_panel">
                <div class="register_content">
                    <div>总保额预算  <span class="span0">{{userInfo.budget}}</span></div>
                    <div>保费缴付期  <span class="span0">{{userInfo.time}}</span></div>
                    <div>受保人年龄  <span class="span0">{{userInfo.old}}</span></div>
                    <div>登记时间<span style="opacity:0">啊</span> <span class="span0">{{userInfo.register_time}}</span></div>
                </div>
                <div class="warning_row">
                    <div class="warning0_div">
                        <div class="warning0">
                            已登记，请根据指引，完成后续步骤。										
                        </div>												
                    </div>
                </div>
                <div class="help_div">
                    <div><img src="static/zhiyin2.png"/><a  @click="clickPoint"><span>保险产品销售指引</span></a></div>
                </div>
            </div>
         </div>
        <div class="footer" >
            <div class="div0">您可能需要：</div>
            <div class="div1"><img src="static/jsq.png"/><a  @click="clickCalculate"><span>客户收益计算器</span></a></div>
            <div class="div2" v-show="userInfo.register"><img src="static/zhiyin.png"/><a @click="clickPoint"><span>保险产品销售指引</span></a></div>
        </div>
    </div>
</template>
<script>
import NavigatorBar from "@/components/NavigatorBar";
import JButton from "@/components/JButton";
import utils from "@/lib/utils";
export default {
  name: "SubmitRegister",
  data: () => {
    return {
      title: "事项详情",
      time_select: [{ value: 2, txt: "2年缴付" }, { value: 5, txt: "5年缴付" }],
      age: "",
      usbtn_checked: true,
      period: 2, //2年
      total_budge: "",
      userInfo: {
        step: 0,
        sales_id: "",
        c_name: "",
        mobilephone: "",
        p_name: "",
        create_time: "",
        budget: "",
        time: "",
        old: "",
        register_time: "",
        calc_url: "",
        sale_url: ""
      }
    };
  },
  created() {
    this.sectododetail();
  },
  methods: {
    clickLeft: function() {
      this.$router.back();
    },
    clickUSBtn() {
      this.usbtn_checked = true;
    },
    clickHKBtn() {
      this.usbtn_checked = false;
    },
    sectododetail() {
      // this.userInfo.register = true;
      // return;
      utils.jPost(
        "page/sectododetail",
        { sales_id: this.$route.query.sales_id },
        result => {
          let data = result.data;
          this.userInfo = data;
          this.userInfo.step = parseInt(data.step);
          if (data.step == 0) {
            //未登记，立即登记
            this.userInfo.register = true;
          } else {
            //已登记
            this.userInfo.register = false;
          }
        }
      );
    },
    clickButton() {
      let jsonObj = {
        sales_id: this.$route.query.sales_id,
        budget: this.usbtn_checked
          ? this.total_budge + "美元"
          : this.total_budge + "港元",
        time: this.period + "年缴付",
        old: this.age + "周岁",
        budget_origin: this.usbtn_checked ? this.total_budge : this.total_budge,
        old_origin: this.age
      };
      if (this.age == "" || this.total_budge == "") {
        utils.showAlert("", "年龄和预算不能为空");
        return;
      }
      utils.jPost("page/registersubmit", jsonObj, result => {
        this.sectododetail();
        let data =
          result.data +
          (function(url) {
            utils.showAlert(
              "",
              "登记完成，<br/>请点击‘查看指引’完成后续步骤",
              "查看指引",
              function() {
                // location.href = url;
                utils.openWorldURL(url);
              },
              "关闭",
              function() {}
            );
          })(this.userInfo.sale_url);
      });
    },
    clickCallBtn() {
      window.location.href = "tel:" + this.userInfo.mobilephone;
    },
    clickPoint() {
      utils.openWorldURL(this.userInfo.sale_url);
    },
    clickCalculate() {
      utils.openWorldURL(this.userInfo.calc_url);
    }
  },
  watch: {
    age: function() {
      if (this.age > 100 || this.age < 0) {
        this.age = "";
        utils.showAlert("", "年龄介于0~100岁，请重新输入");
      }
    },
    total_budge: function() {
      if (this.total_budge != "") {
        if (!/^\+?[1-9][0-9]*$/.test(this.total_budge.toString())) {
          this.total_budge = "";
          utils.showAlert("", "请输入大于0的整数");
        } else {
          if (this.total_budge.toString().length >= 12) {
            this.total_budge = parseInt(
              this.total_budge.toString().slice(0, 12)
            );
          }
        }
      }
    }
  },
  components: {
    NavigatorBar,
    JButton
  }
};
</script>
<style scoped>
.help_div {
  height: 60px;
  width: 100%;
  /* background: red; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.help_div a {
  text-decoration: none;
  outline: none;
  font-size: 16px;
  color: #2772ff;
}
.help_div img {
  width: 15px;
  margin-right: 5px;
}
.register_panel .warning0_div {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #3b5999;
  position: relative;
  text-align: left;
  bottom: 5px;
}
.warning_row {
  /* width: 100%; */
  height: 40px;
  margin-left: 15px;
  margin-right: 15px;
  background: #ebeef5;
}
.register_panel .warning0 {
  position: absolute;
  bottom: 5px;
}
.register_content {
  font-size: 16px;
  color: #666666;
  text-align: left;
  margin-left: 15px;
  margin-right: 15px;
  padding-top: 15px;
  margin-bottom: 15px;
  /* background: yellow; */
}
.register_content div {
  margin-bottom: 3px;
}
.register_content .span0 {
  font-size: 16px;
  color: #333333;
}
.register_panel {
  /* width: 100%; */
  /* height: 300px; */
  background: white;
}
.footer {
  /* position: fixed; */
  margin-top: 15px;
  bottom: 0;
  background: transparent;
  /* height: 100px; */
  margin-left: 15px;
  margin-right: 15px;
  text-align: left;
}
.footer .div0 {
  font-size: 14px;
  color: #666666;
  margin-bottom: 10px;
}
.footer .div1 {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  font-size: 15px;
  color: #3b5999;
}
.footer .div2 {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 15px;
  font-size: 15px;
  color: #3b5999;
}
.footer img {
  width: 15px;
  margin-right: 5px;
}
.footer a {
  text-decoration: none;
  outline: none;
  color: #3b5999;
}
.panel_content .age_div {
  width: 200px;
  height: 30px;
  background: transparent;
  border: 1px solid #3b5999;
  border-radius: 2px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.age_div .input1 {
  height: 100%;
  background: transparent;
}
.age_div .input1 input {
  max-width: 100px;
  height: 30px;
  background: transparent;
  outline: none;
  border: none;
  padding: 0;
  margin: 0;
  font-size: 16px;
  color: #333333;
  padding-left: 5px;
}
.age_div .age {
  height: 100%;
  /* background: blue; */
  padding-right: 5px;
  padding-left: 5px;
  color: #3b5999;
  font-size: 16px;
  line-height: 30px;
}
.panel_row {
  width: 100%;
  /* height: 200px; */
  background: white;
}
.panel_content {
  margin-left: 15px;
  margin-right: 15px;
  background: transparent;
  padding-top: 15px;
}
.panel_content .list_item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.list_item select {
  width: 200px;
  height: 30px;
  background: white;
  outline: none;
  border: 1px solid #3b5999;
  border-radius: 2px;
  font-size: 16px;
  color: #333333;
  box-sizing: border-box;
}
.panel_content .div0 {
  font-size: 16px;
  color: #333333;
}
.panel_content .input0 {
  font-size: 16px;
  width: 200px;
  height: 30px;
  color: #333333;
  outline: none;
  box-sizing: border-box;
  border: 1px solid #3b5999;
  border-radius: 2px;
  padding-left: 5px;
  padding-right: 5px;
}

.panel_content .radio_div {
  width: 200px;
  /* height: 30px; */
  /* background: red; */
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.radio_div .radioBtn_Default {
  width: 70px;
  height: 25px;
  box-sizing: border-box;
  /* background: blue; */
  float: left;
  margin-right: 5px;
  border-radius: 3px;
  color: #3b5999;
  line-height: 25px;
  background: transparent;
  border: 1px solid #3b5999;
}
.radio_div .radioBtn_Checked {
  width: 70px;
  height: 25px;
  box-sizing: border-box;
  /* background: blue; */
  float: left;
  margin-right: 5px;
  border-radius: 3px;
  color: white;
  background: #3b5999;
  border: 1px solid #3b5999;
  line-height: 25px;
}
.radio_checked_style {
  color: white;
  background: #3b5999;
}

.warningRow {
  height: 50px;
}
.warningDiv {
  height: 100%;
  margin-left: 15px;
  margin-right: 15px;
  position: relative;
}
.warningTxt {
  text-align: left;
  font-size: 14px;
  color: #666666;
  position: absolute;
  bottom: 5px;
}
.custDiv {
  width: 100%;
  height: 100px;
  background: white;
}
.cust_item {
  margin-left: 15px;
  margin-right: 15px;
  height: 100%;
  background: transparent;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.cust_item .left {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.left .title {
  font-size: 16px;
  color: #666666;
  margin-right: 15px;
}
.left .desc {
  font-size: 16px;
  color: #333333;
}
.left .line1 {
  margin-bottom: 5px;
}
.left .line2 {
  margin-bottom: 5px;
}

.cust_item .right {
  /* width: 100px; */
  height: 100%;
  background: transparent;
}
.right img {
  width: 30px;
  margin-top: 20px;
}
</style>