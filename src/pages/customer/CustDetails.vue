<template>
  <div class="CustDetails container">
    <NavigatorBar @clickLeftHandler="clickLeft" :title="title"></NavigatorBar>
    <div style="height:8px;"></div>
    <div class="line"></div>
    <div class="cust_item" @click="clickInfoItem">
      <div class="cust_info">
        <div class="left">
          <div class="info">
            <span class="name">{{sells.custname}}</span>&nbsp;&nbsp;
            <span class="phone">{{sells.mobilephone}}</span>
          </div>
          <div class="mark">备注：{{sells.mark}}</div>
        </div>
        <div class="right">
          <img src="static/arrow.png">
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="labelDiv">
      <span>Ta的投资，您的业绩</span>
    </div>
    <div class="line"></div>
    <div class="slider">
      <div class="slider_panel">
        <div class="item" @click="clickItemLeft">
          <div class="item_title" :class="{fontBlue:item_clicked}">保险</div>
          <div v-show="item_clicked" class="item_line"></div>
        </div>
        <div class="item" @click="clickItemRight">
          <div class="item_title" :class="{fontBlue:!item_clicked}">股票</div>
          <div v-show="!item_clicked" class="item_line"></div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="infoBox">
      <span class="warning">{{warning}}</span>
      <div v-show="show_insure" class="insurePanel">
        <div v-for="(item,index) in sells.invest.insure.list" :key="index">
          <div class="list_item" @click="clickListItem(item)">
            <div class="item_info">
              <div class="left">
                <div class="info">{{item.product}}</div>
                <div class="mark" v-show="item.benefit_name==''?false:true">受保人：{{item.benefit_name}}({{item.benefit_idno}})</div>
              </div>
              <div class="right">
                <span :style="{color:item.color}">{{item.step_name}}</span>
                <img v-show="item.can_click==1" src="static/arrow.png">
              </div>
            </div>
          </div>
          <div class="lineRight" v-show="index+1!=sells.invest.insure.list.length"></div>
        </div>
        <div class="line"></div>
      </div>
      <div v-show="show_stock" class="stockPanel"></div>
    </div>
  </div>
</template>
<script>
  import NavigatorBar from "@/components/NavigatorBar";
  import utils from "@/lib/utils";
  let contact_id = "";
  export default {
    name: "CustDetails",
    data: () => {
      return {
        title: "客户详情",
        item_clicked: true,
        warning: "",
        show_insure: true,
        show_stock: false,
        sells: {
          custname: "",
          mobilephone: "",
          mark: "",
          invest: {
            insure: {
              category: "保险",
              list: [
                // {
                //   p_name: "习近平",
                //   p_code: "23111",
                //   step: "0",
                //   id: "23232861b4a222e7abb8e8611f123232",
                //   product: "展示用444(23111)",
                //   benefit_name: "",
                //   benefit_idno: "",
                //   status: "0"
                // }
                // {
                //   p_name: "习近平1",
                //   p_code: "232",
                //   step: "0",
                //   id: "wewcc861b4a222e7abb8e8611f1wewew",
                //   product: "展示用333(232)",
                //   benefit_name: "",
                //   benefit_idno: "",
                //   status: "0",
                // }
              ]
            },
            stock: {
              category: "股票",
              list: []
            }
          }
        }
      };
    },
    created() {
      contact_id = this.$route.query.contact_id;
      utils.jPost("page/custinfo", {
        contact_id: contact_id
      }, result => {
        let data = result.data;
        this.sells = data;
        if (this.sells.invest.insure.list.length == 0) {
          this.show_insure = false;
          this.warning = "很遗憾，ta暂未投资此类产品";
          this.item_clicked = true;
        }
      });
    },
    methods: {
      clickListItem(jsonObj) {
        if (jsonObj.can_click == 1) {
          this.$router.push({
            name: "SubmitRegister",
            query: jsonObj
          });
        }
      },
      clickInfoItem() {
        utils.openInsideLocation("buser/baseinfo?contact_id=" + contact_id);
      },
      clickLeft() {
        this.$router.back();
      },
      clickItemLeft() {
        this.item_clicked = true;
        if (this.sells.invest.insure.list.length == 0) {
          this.warning = "很遗憾，ta暂未投资此类产品";
        } else {
          this.warning = "";
        }

        this.show_stock = false;
        this.show_insure = true;
      },
      clickItemRight() {
        this.item_clicked = false;
        this.warning = "功能开发中，敬请期待！";
        this.show_stock = true;
        this.show_insure = false;
      }
    },
    components: {
      NavigatorBar
    }
  };

</script>
<style scoped>
  .cust_item {
    width: 100%;
    height: 70px;
    background: white;
  }

  .cust_info {
    height: 100%;
    margin-left: 15px;
    margin-right: 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .cust_info .left {
    max-width: 70%;
    height: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    text-align: left;
  }

  .cust_info .right {
    width: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
  }

  .cust_info .right img {
    width: 10px;
  }

  .cust_info .mark {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
    color: #333333;
    margin-top: 5px;
  }

  .phone {
    font-size: 15px;
    color: #2772ff;
  }

  .labelDiv {
    height: 35px;
    width: 100%;
    position: relative;
    font-size: 14px;
    margin-bottom: 5px;
  }

  .labelDiv span {
    position: absolute;
    left: 15px;
    bottom: 0;
    color: #999999;
  }

  .slider {
    height: 35px;
    width: 100%;
    background: white;
    position: relative;
  }

  .slider_panel {
    height: 100%;
    margin-left: 30px;
    margin-right: 30px;
    /* background: red; */
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    font-size: 16px;
  }

  .slider_panel .item {
    width: 45%;
    height: 100%;
  }

  .item_title {
    width: 100%;
    height: 34px;
    background: white;
    line-height: 34px;
  }

  .item_line {
    width: 80%;
    height: 1px;
    background: #3b5999;
    margin-left: auto;
    margin-right: auto;
  }

  .fontBlue {
    color: #3b5999;
  }

  .infoBox {
    position: relative;
    width: 100%;
    background: transparent;
  }

  .infoBox .warning {
    padding-top: 80px;
    display: block;
    color: #333333;
    font-size: 15px;
  }

  .infoBox .insurePanel {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    background: white;
  }

  .list_item {
    width: 100%;
    height: 60px;
    background: white;
  }

  .item_info {
    height: 100%;
    margin-left: 15px;
    margin-right: 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .item_info .left {
    max-width: 70%;
    height: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    text-align: left;
  }

  .item_info .right {
    /* width: 20px; */
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: transparent;
  }

  .item_info .right span {
    font-size: 15px;
    margin-right: 10px;
  }

  .item_info .right img {
    width: 10px;
  }

  .item_info .info {
    font-size: 16px;
    color: #333333;
  }

  .item_info .mark {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    color: #333333;
    margin-top: 5px;
  }

  .line {
    width: 100%;
    height: 1px;
    background: #eeeeee;
  }

  .lineRight {
    margin-left: 15px;
    height: 1px;
    background: #eeeeee;
  }

</style>
