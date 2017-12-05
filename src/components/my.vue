<template>
  <div class="JRefreshPanel" :style="{width:Width+'px',height:Height+'px'}">
    <div class="myContainer">
      <div class="refreshDiv" :style="{transform:'translateY('+this.translateY+'px'+')'}" @touchstart="touchevent" @touchmove="touchevent"
        @touchend="touchevent">
        <div class="header">
          <div class="iconDiv">
            <img :src="arrow" />
          </div>
          <div class="descDiv">
            <div class="txt">
              <span>下拉可以刷新</span>
              <span v-show="0">松开立即刷新</span>
              <span v-show="0">正在刷新数据</span>
            </div>
            <div>最后更新：今天13:04</div>
          </div>
        </div>
        <div class="panel">
          习近平欢迎梅德韦杰夫在中共十九大胜利闭幕后随即访华，强调俄罗斯是中国的最大邻国和全面战略协作伙伴，中方发展和深化中俄关系的明确目标和坚定决心不会改变。中方愿同俄方一道，扩大各领域、全方位合作，密切在国际事务中的协调和配合，推动构建人类命运共同体。相信中俄全面战略协作伙伴关系会在新起点上把握新机遇，展现新气象，取得新成果。
          　　习近平指出，中俄要充分发挥总理定期会晤机制的统筹协调作用，加强在能源、装备制造、农业、航天等领域合作，继续提升双方合作中的科技创新含量，将大数据、物联网、智慧城市等数字经济领域作为新的合作增长点。要做好“一带一路”建设同欧亚经济联盟对接，努力推动滨海国际运输走廊等项目落地，共同开展北极航道开发和利用合作，打造“冰上丝绸之路”。中俄教育、旅游、媒体等人文合作高潮迭起，“一带一路”沿线人文交流很有起色，双方要继续办好大型国家主题年活动，推动两国地方交流合作，进一步巩固两国关系的民意基础。
          　　梅德韦杰夫转达了俄罗斯总统普京对习近平主席的亲切问候和美好祝愿，对中共十九大胜利闭幕和习近平再次当选中共中央总书记表示热烈祝贺。梅德韦杰夫表示，中共十九大描绘了中国未来发展的宏伟蓝图，对中国和世界都意义重大。俄方衷心祝愿新时代中国特色社会主义事业不断取得成功，相信在此过程中俄中全面战略协作伙伴关系必将得到更加全面深入的发展。习主席今年7月对俄罗斯成功访问后，俄中双方在经济、能源、投资、创新、人文、欧亚经济联盟同“一带一路”建设对接等领域合作取得更多积极进展。俄方对此十分满意，愿进一步密切同中方各领域交流合作，加强在国际和地区事务中沟通协调。
        </div>
        <div class="footer">
          <div class="descDiv">
            <span>上拉可以加载更多</span>
            <span v-show="0">松开立即加载更多</span>
            <span v-show="0">正在加载更多数据</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  class Position {
    static TOP = "TOP";
    static MIDDLE = "MIDDLE";
    static BOTTOM = "BOTTOM";
  }
  let point;
  let max_top_pull = 100;
  let drag_ratio = 4;
  let DRGA_POSITION = Position.TOP;
  export default {
    name: "JRefreshPanel",
    data: function () {
      return {
        arrow: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAABQCAYAAAAOYsW+AAAAAXNSR0IArs4c6QAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAACHUlEQVRoBe2YzUrDQBCAm0S9eBJ8k1IreOrfG0gFQbHUmjYoQkHx6gMIglJJaqEoihTvemn6AG0fqa0z1SnpmNJ07Z6cvezOJjNf9tskkMRi0sSAGBADYkAMiIF/a8BSWXmpVLpOJBKdeDy+2u/3fZUapkqSZVlXmGea5oVK/jhXJXE0Gq1hHvUqNZRWrALiOQLmRrTFolqbWl5YVHMj2mJRrU0tLyyquRFtsajWppYXFtXciLZYVGtTywuLam5EW7yClW3bvoGuCl9/jVQqZefz+cEyiVR/OBw26/V6AWuP9xi++ooYwIGi7/tPrVZL6bsZa/AGUBfmqjhvGMYB1aaby6MEuIj9ZcF/oCdUG8ANsjkGe553CcAHOmEZ8BDoayaTcYhBK44B3OHwTqfzQmooIUrPoVD3OZ1OH9JqscYEjAGHw57vLQoPg2az2UIQ+gv8V3ilUnmEGpM9xZWGQUPBBIcfLPc4xhZl5QjFp+I7Y/x/ZCYUz5lSTUnY12q1Mw5vt9tvYXvOoXABzVkrJYZBg1m94zh3g8HgNHD8Hca7FCMEXjxHwTiXyx3zPaXj1M8F44khcMqf6vEiokAxKdIbqtvtfiSTyU24WbamSIFgEWhkMJ6IcPiNuAHDbYyDbVEo5kZSHYSUy+VbWPk5zSGUXvw0F6WPpDpYqNfrfcLP03V47+7gXe+6rh08LmMxIAbEgBgQA2JADMw18AVm+gapWVwucAAAAABJRU5ErkJggg==",
        SCROLL_Y: 0,
        translateY: 0
      };
    },
    methods: {
      scrollPanel(e) {
        let scroll = e.target;
        this.SCROLL_Y = scroll.scrollTop;
        let maxOffsetY = scroll.scrollHeight - scroll.offsetHeight;
        if (this.SCROLL_Y <= 0) {
          DRGA_POSITION = Position.TOP;
        } else if (this.SCROLL_Y >= maxOffsetY) {
          DRGA_POSITION = Position.BOTTOM;
        } else {
          DRGA_POSITION = Position.MIDDLE;
          this.translateY = 0;
        }
        console.log(DRGA_POSITION);
      },
      touchevent(e) {
        switch (e.type) {
          case "touchstart":
            point = e.touches[0];
            break;
          case "touchmove":
            let point1 = e.touches[0];
            if (DRGA_POSITION != Position.MIDDLE) {
              let deltaY = point1.pageY - point.pageY;
              this.translateY += deltaY / drag_ratio;
              if (this.translateY > max_top_pull) {
                this.translateY = max_top_pull;
              }
              if (this.translateY < -max_top_pull) {
                this.translateY = -max_top_pull;
              }
            }
            point = point1;
            break;
          case "touchend":
            this.translateY = 0;
            break;
          default:
            break;
        }
        e.preventDefault();
      }
    },
    props: {
      Width: {
        default: 0
      },
      Height: {
        default: 0
      }
    }
  };

</script>

<style scoped>
  .JRefreshPanel {
    background: red;
    width: 100%;
    height: 200px;
  }

  .myContainer {
    width: 100%;
    height: 100%;
    position: relative;
    left: 0;
    top: 0;
    background: black;
    overflow: hidden;
  }

  .refreshDiv {
    width: 100%;
    height: 100%;
    background: black;
    position: absolute;
    left: 0px;
    top: 0px;
    /* transform: translateY(0px); */
  }

  .panel {
    width: 100%;
    height: 100%;
    background: red;
    overflow: auto;
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
    margin-right: 20px;
  }

  .header .iconDiv img {
    height: 100%;
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
