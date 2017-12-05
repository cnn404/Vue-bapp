<template>
  <div>
    <div class="mydiv" @click="clickBtn"></div>
    <j-refresh-panel ref="jrefresh" class="test" page='1' pageSize='125'  action='bopen/test' :params='params' @refreshScroller='refreshScroller'>
        <div class="item" @click="clickItem" v-for="(item,index) in listData" :key="index" >{{item.name}}---{{item.sex}}</div>
    </j-refresh-panel>
  </div>
</template>
<script>
import JRefreshPanel from "@/components/JRefreshPanel";
export default {
  name: "Test",
  data: () => {
    return {
      listData: [],
      params: {}
    };
  },
  created(){

  },
  methods: {
    refreshScroller(jsonData) {
      this.listData = jsonData;
    },
    clickBtn() {
      this.$refs.jrefresh.updateScroller({
        pageSize: 110,
        name: "jimmy",
        sex: "mail",
        friends: [{ name: "jimmy", sex: "femail" }]
      });
    },
    clickItem(){
      alert('Hello')
    }
  },
  mounted() {},
  components: {
    JRefreshPanel
  }
};
</script>

<style scoped>
.mydiv {
  width: 100px;
  height: 100px;
  background: red;
  /* border: none; */
  /* outline: none; */
}
.item{
  height: 50px;
  background: blue;
  margin-bottom: 10px;
}
.test {
  width: 350px;
  height: 300px;
  margin-top: 200px;
}
</style>
