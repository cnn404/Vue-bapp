<template>
   <div>
    <iscroll-view :options="this.options" class="scroll-view" ref="iscroll"
     @scroll="scroll"
     @pullUp='pullUp'
     @pullDown='pullDown'
     >
      <div class="header">
        <div class="iconDiv">
          <img :src="arrow" :class="[showUp?'arrowRotateUp':'arrowRotateDown']"/>
        </div>
        <div class="descDiv">
          <div class="txt">
            <span>{{pullDownTxt}}</span>
          </div>
          <div v-show="this.updateTime!=''">最后更新：今天{{updateTime}}</div>
        </div>
      </div>
      <div class="panel">
          <slot></slot>
      </div>
      <div class="footer">
        <div class="descDiv">
          <span>{{pullUpTxt}}</span>
        </div>
      </div>
    </iscroll-view>
  </div>
</template>
<script>
import Vue from "vue";
import IScrollView from "vue-iscroll-view";
import IScroll from "iscroll/build/iscroll-probe.js";
Vue.use(IScrollView, IScroll);
let MAX_PULL_DOWN = 60;
let MAX_PULL_UP = 30;
import utils from "@/lib/utils";
let currentPage = 1;
let POSITION = {
  TOP: -1,
  MIDDLE: 0,
  BOTTOM: 1
};
let currentPosition = POSITION.MIDDLE;
export default {
  name: "JRefreshPanel",
  data: function() {
    return {
      arrow:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAABQCAYAAAAOYsW+AAAAAXNSR0IArs4c6QAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAACHUlEQVRoBe2YzUrDQBCAm0S9eBJ8k1IreOrfG0gFQbHUmjYoQkHx6gMIglJJaqEoihTvemn6AG0fqa0z1SnpmNJ07Z6cvezOJjNf9tskkMRi0sSAGBADYkAMiIF/a8BSWXmpVLpOJBKdeDy+2u/3fZUapkqSZVlXmGea5oVK/jhXJXE0Gq1hHvUqNZRWrALiOQLmRrTFolqbWl5YVHMj2mJRrU0tLyyquRFtsajWppYXFtXciLZYVGtTywuLam5EW7yClW3bvoGuCl9/jVQqZefz+cEyiVR/OBw26/V6AWuP9xi++ooYwIGi7/tPrVZL6bsZa/AGUBfmqjhvGMYB1aaby6MEuIj9ZcF/oCdUG8ANsjkGe553CcAHOmEZ8BDoayaTcYhBK44B3OHwTqfzQmooIUrPoVD3OZ1OH9JqscYEjAGHw57vLQoPg2az2UIQ+gv8V3ilUnmEGpM9xZWGQUPBBIcfLPc4xhZl5QjFp+I7Y/x/ZCYUz5lSTUnY12q1Mw5vt9tvYXvOoXABzVkrJYZBg1m94zh3g8HgNHD8Hca7FCMEXjxHwTiXyx3zPaXj1M8F44khcMqf6vEiokAxKdIbqtvtfiSTyU24WbamSIFgEWhkMJ6IcPiNuAHDbYyDbVEo5kZSHYSUy+VbWPk5zSGUXvw0F6WPpDpYqNfrfcLP03V47+7gXe+6rh08LmMxIAbEgBgQA2JADMw18AVm+gapWVwucAAAAABJRU5ErkJggg==",
      pullDownTxt: "",
      pullUpTxt: "",
      listData: [],
      pageData: [],
      options: {
        preventDefault: false,
        snap: true,
        scrollbars: "customer",
        probeType: 2,
        fadeScrollbars: true,
        shrinkScrollbars: "clip"
      },
      updateTime: "",
      showUp: true
    };
  },
  methods: {
    pullUp() {
      if (currentPosition == POSITION.BOTTOM) {
        if (this.pageData.length == 0) {
          this.pullUpTxt = "没有更多了";
          return;
        }
        this.updateTime = utils.dateFormat("h:m", new Date());
        this.params.page = ++currentPage;
        utils.jPost(this.action, this.params, result => {
          this.pageData = result.data;
          this.listData.push.apply(this.listData, this.pageData);
          this.notifyDataUpdate(this.listData);
        });
      }
    },
    pullDown() {
      if (currentPosition == POSITION.TOP) {
        this.updateTime = utils.dateFormat("h:m", new Date());
        currentPage = 1;
        this.params.page = currentPage;
        utils.jPost(this.action, this.params, result => {
          this.pageData = result.data;
          this.listData = this.pageData;
          this.notifyDataUpdate(this.listData);
        });
      }
    },
    scroll(e) {
      if (e.y == 0) return;
      if (e.y > MAX_PULL_DOWN) {
        //松开立即刷新
        this.pullDownTxt = "松开立即加载更多";
        this.showUp = true;
        currentPosition = POSITION.TOP;
        return;
      } else if (e.y < MAX_PULL_DOWN) {
        //下拉可以刷新
        this.pullDownTxt = "下拉可以刷新";
        this.showUp = false;
        currentPosition = POSITION.MIDDLE;
      } else {
        currentPosition = POSITION.MIDDLE;
      }
      if (e.y < e.maxScrollY - MAX_PULL_UP) {
        this.pullUpTxt = "松开立即加载更多";
        currentPosition = POSITION.BOTTOM;
        return;
      } else if (e.y > e.maxScrollY - MAX_PULL_UP) {
        this.pullUpTxt = "上拉可以加载更多";
        currentPosition = POSITION.MIDDLE;
      } else {
        currentPosition = POSITION.MIDDLE;
      }
    },
    notifyDataUpdate(jsonData) {
      this.$emit("refreshScroller", jsonData);
      if (jsonData.length != 0) {
        this.$refs.iscroll.refresh();
      }
    },
    updateScroller(jsonData) {
      for (const key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
          const element = jsonData[key];
          this.params[key] = element;
        }
      }
      this.updateTime = utils.dateFormat("h:m", new Date());
      currentPage = 1;
      this.params.page = currentPage;
      utils.jPost(this.action, this.params, result => {
        this.pageData = result.data;
        this.listData = this.pageData;
        this.notifyDataUpdate(this.listData);
        this.$refs.iscroll.scrollTo(0, 0, 450);
      });
    }
  },
  created() {
    document.addEventListener("touchmove", function(e) {
      e.preventDefault();
    });
    this.params.pageSize = this.pageSize;
    this.params.page = this.page;
  },
  destroyed() {
    document.removeEventListener("touchmove", function(e) {
      e.preventDefault();
    });
  },
  mounted() {
    this.updateTime = utils.dateFormat("h:m", new Date());
    currentPage = 1;
    this.params.page = currentPage;
    utils.jPost(this.action, this.params, result => {
      this.listData = result.data;
      this.pageData = result.data;
      this.notifyDataUpdate(this.listData);
    });
  },
  props: {
    action: {
      required: true,
      default: null
    },
    params: {
      required: true
    },
    page: {
      required: true,
      default: 1
    },
    pageSize: {
      required: true,
      default: 20
    }
  },
  components: {}
};
</script>

<style scoped>
.scroll-view {
  touch-action: none;
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: transparent;
}

.panel {
  text-align: left;
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 0px;
  transform: translate(-50%, -100%);
}

.header .iconDiv {
  height: 50px;
  background: transparent;
  margin-right: 10px;
}

.header .iconDiv img {
  height: 100%;
}
@keyframes arrowToUp {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-180deg);
  }
}
@keyframes arrowToDown {
  from {
    transform: rotate(-180deg);
  }
  to {
    transform: rotate(0deg);
  }
}
.arrowRotateUp {
  animation: arrowToUp 0.3s;
  animation-fill-mode: forwards;
}
.arrowRotateDown {
  animation: arrowToDown 0.3s;
  animation-fill-mode: forwards;
}

.descDiv {
  font-size: 13px;
  color: grey;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
}

.header .descDiv .txt {
  margin-bottom: 8px;
}
.footer {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 100%);
}
</style>
<style>
.iScrollVerticalScrollbar {
  position: absolute;
  z-index: 9999;
  width: 3px;
  bottom: 2px;
  top: 3px;
  right: 2px;
  overflow: hidden;
}

.iScrollIndicator {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50px;
  width: 100%;
}
</style>


