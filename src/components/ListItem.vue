
<!--说明：ListItem为手机端列表的组件，应用在左边有内容，右边有内容的场景
用户需要分别填写左右两个容器的内容
示例：
<list-item class="listItem" padding='15px'>
      <div slot="left">
        <div class="jrow">第一行</div>
        <div class="jrow">第二行1321231</div>
        <div class="jrow">第三行</div>
      </div>
      <div slot="right">
        <div class="jrow">
          第一行
          <img src="static/arrow.png" style="width:20px;" />
        </div>
          <div class="jrow">第三行123</div>
      </div>
</list-item>
-->
<template>
  <div class="ListItem" >
    <div class="panel">
      <div class="left" :style="{'padding-top':padding,'padding-bottom':padding}">
        <slot name="left"></slot>
      </div>
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: function() {
    return {};
  },
  props: {
    padding: {
      default: "15px"
    }
  }
};
</script>
<style scoped>
.ListItem {
  width: 100%;
}

.panel {
  height: 100%;
  margin-left: 15px;
  margin-right: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.left {
  max-width: 100%;
  height: 100%;
  overflow: hidden;
}
.left .jrow {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.right {
  max-width: 100%;
  height: 20%;
  overflow: hidden;
}
.right .jrow {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
</style>
