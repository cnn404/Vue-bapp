<template>
  <div class="CustInfoList container">
    <NavigatorBar @clickLeftHandler="clickLeft" :title="title"></NavigatorBar>
    <div class="select_div">
      <select v-model="time_index">
        <option v-for="(item,index) in time_select" :value="item.value" :key="index">{{item.txt}}</option>
      </select>
      <div class="middle_line"></div>
      <select v-model="register_index">
        <option v-for="(item,index) in register_select" :value="item.value" :key="index">{{item.txt}}</option>
      </select>
    </div>
    <div class="line"></div>
    <div style="height:8px;"></div>
    <div class="line"></div>
    <!-- <div class="listPanel"> -->
    <j-refresh-panel :style="{height:jrefresh_height+'px'}"  class="listPanel" page='1' pageSize='15' ref="jrefresh" action='page/todolist' :params='todolistParams' @refreshScroller='refreshScroller'>
      <div v-for="(item,index) in list" :key="index">
        <div class="listItem" @click="clickListItem(item)">
          <div class="left">
            <div class="ul0">
              <span class="cust_name">{{item.c_name}}&nbsp;&nbsp;</span>
              <span class="cust_mobile">{{item.mobilephone}}</span>
            </div>
            <div class="ul1">{{item.p_name}}
              <div class="sign">意向</div>
            </div>
            <div class="ul2">
              <img src="static/clock.png" /> {{item.create_time}}</div>
          </div>
          <div class="right">
            <span :style="{color:item.color}">{{item.step_name}}</span>
            <img v-show="item.can_click==1" src="static/arrow.png">
          </div>
        </div>
        <div class="lineRight" v-show="index!=list.length-1"></div>
      </div>
      <div class="line"></div>
    </j-refresh-panel>
    <!-- </div> -->
    <div style="margin-bottom:50px;"></div>
    <div class="footer">
      <div class="cell" @click="clickFooter">
        <div class="content">
          <div class="left">
            <img src="static/qa.png" />
            <span>为什么要登记客户</span>
          </div>
          <div class="right">
            <img src="static/backblue1.png" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import NavigatorBar from "@/components/NavigatorBar";
import utils from "@/lib/utils";
import JRefreshPanel from "@/components/JRefreshPanel";
import params from "@/lib/params"
export default {
  name: "CustInfoList",
  data: () => {
    return {
      title: "客户动态",
      time_index: 2,
      register_index: 1,
      jrefresh_height:100,
      time_select: [
        {
          value: 1,
          txt: "7天内"
        },
        {
          value: 2,
          txt: "一个月内"
        },
        {
          value: 3,
          txt: "三个月内"
        },
        {
          value: 4,
          txt: "半年内"
        },
        {
          value: 5,
          txt: "全部日期"
        }
      ],
      register_select: [
        {
          value: 1,
          txt: "未登记记录"
        },
        {
          value: 2,
          txt: "已登记记录"
        },
        {
          value: 3,
          txt: "全部记录"
        }
      ],
      list: [
        // {
        //   todo_id: "",
        //   sales_id: "",
        //   pid: "",
        //   c_name: "",
        //   mobilephone: "",
        //   p_name: "",
        //   p_code: "",
        //   create_time: "",
        //   step: "",
        //   status: "1"
        // }
      ],
      todolistParams: {
        time: this.time_index,
        status: this.register_index
      }
    };
  },
  mounted() {
    this.jrefresh_height = window.screen.height-50-10-50-utils.NavigatorHeight()
    utils.jPost("page/tododic", {}, result => {
      let data = result.data;
      this.time_select = data.time_select;
      this.register_select = data.register_select;
    });
    this.queryList();
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
    clickLeft() {
      this.$router.back();
    },
    clickFooter() {
      utils.showAlert(
        "",
        "<span style='text-align:left;'>关键的客户需求信息，能帮助系统为客户生成合适投资计划。同时便于我们为您提供更多的营销帮助。</span>",
        "我知道了"
      );
    },
    queryList() {
      // utils.jPost(
      //   "page/todolist",
      //   {
      //     time: this.time_index,
      //     status: this.register_index,
      //     page: 1
      //   },
      //   result => {
      //     let data = result.data;
      //     this.list = data;
      //   }
      // );
      this.$refs.jrefresh.updateScroller({
        time: this.time_index,
        status: this.register_index,
        page: 1,
      });
    },
    refreshScroller(jsonData) {
      this.list = jsonData;
    }
  },
  watch: {
    time_index: function() {
      this.queryList();
    },
    register_index: function() {
      this.queryList();
    }
  },
  components: {
    NavigatorBar,
    JRefreshPanel
  }
};
</script>
<style scoped>
.footer {
  height: 50px;
  background: transparent;
  width: 100%;
  position: fixed;
  display: flex;
  flex-direction: row;
  bottom: 0;
}

.footer .cell {
  height: 100%;
  width: 100%;
  background: #e1e5f0;
}

.cell .content {
  margin-left: 15px;
  margin-right: 15px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.footer .left {
  /* width: 100px; */
  height: 100%;
  background: transparent;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.footer .left img {
  width: 20px;
  margin-right: 5px;
}

.footer .left span {
  font-size: 16px;
  color: #3b5999;
}

.footer .right {
  /* width: 20px; */
  height: 100%;
  background: transparent;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.footer .right img {
  width: 10px;
}

.listPanel {
  width: 100%;
  background: white;
}

.listPanel .listItem {
  color: #000000;
  height: 100%;
  height: 100px;
  margin-left: 15px;
  margin-right: 15px;
  background: transparent;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}

.listPanel .left {
  /* width: 100px; */
  height: 100%;
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.listPanel .left .ul0 {
  font-size: 16px;
  color: #333333;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.listPanel .left .ul0 .cust_mobile {
  font-size: 14px;
}

.listPanel .left .ul0 .cust_name {
  max-width: 80px;
  background: transparent;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.listPanel .left .ul1 {
  font-size: 16px;
  color: #333333;
  height: 32px;
  background: transparent;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.listPanel .left .ul1 .sign {
  width: 32px;
  height: 18px;
  box-sizing: border-box;
  background: transparent;
  margin-left: 10px;
  border: 1px solid #3b5999;
  border-radius: 5px;
  color: #3b5999;
  font-size: 10px;
  text-align: center;
  line-height: 18px;
}

.listPanel .left .ul2 {
  font-size: 12px;
  color: #999999;
}

.listPanel .left .ul2 img {
  height: 10px;
  margin-right: 2px;
}

.listPanel .right {
  height: 100%;
  background: transparent;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.listPanel .right span {
  font-size: 17px;
  margin-right: 10px;
}

.listPanel .right img {
  width: 12px;
}

.select_div {
  width: 100%;
  height: 50px;
  background: white;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.select_div select {
  font-size: 16px;
  color: #3b5999;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  box-sizing: border-box;
  /* border: 1px solid #3b5999; */
}

.line {
  width: 100%;
  height: 1px;
  background: #eeeeee;
}

.middle_line {
  height: 30px;
  width: 1px;
  background: #3b5999;
}

.lineRight {
  margin-left: 15px;
  height: 1px;
  background: #eeeeee;
}
</style>
