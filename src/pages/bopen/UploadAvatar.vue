<template>
    <div class="uploadavatar container">
        <NavigatorBar @clickLeftHandler="clickLeft" :title="title"></NavigatorBar>
        <div class="panel">
            <div class="reason_div" v-show="reject_face.reject">
                照片被驳回，原因：
                <span>{{reject_face.reason}}</span>
            </div>
            <div class="imgBox" :style="{width:box_width+'px',height:box_height+'px'}">
                <div class="box0">
                    <div class="boxZ">
                        <img :style="{width:width+'px',height:height+'px'}" :src="image" @load="imgLoad" />
                    </div>
                    <div v-show="showfooter" class="boxfooter">{{warning_txt}}</div>
                    <div class="boxZ">
                        <input type="file" @change="selectLocalImg" accept="image/*" class="camera" />
                    </div>
                </div>
            </div>
        </div>
        <ul align="left">
            <div class="title">拍照注意事项</div>
            <li>1:此照片将在经纪人个人名片中展示</li>
            <li>2:必须是当前经纪人本人正面照</li>
            <li>3:五官清晰可见（照片需免冠，建议未化妆）</li>
            <li>4:建议在wifi，4G网络环境下上传照片</li>
        </ul>
        <JButton title="提交" :disable="disableBtn" @clickButtonHandler="clickButton"></JButton>
        <div style="height:30px;"></div>
    </div>
</template>
<script>
import NavigatorBar from "@/components/NavigatorBar";
import JButton from "@/components/JButton";
import utils from "@/lib/utils";
let imgStr = "static/avatarBg.jpg";
let uploadFile = null;
let compressBlob = null;
let crop_width = 600;
export default {
  name: "UploadAvatar",
  data: () => {
    return {
      title: "拍照验证",
      disableBtn: true,
      pop: false,
      image: imgStr,
      warning_txt: "点击拍摄本人正面大头照",
      showfooter: false,
      box_width: 195,
      box_height: 195,
      width: this.box_width,
      height: this.box_height,
      reject_face: {
        reject: false,
        reason: ""
      }
    };
  },
  created: function() {
    utils.showAlert("身份验证提醒", "请上传本人正面大头照，以验证你的真实身份");
  },
  mounted: function() {
    this.pop = true;
    let face_url = this.$route.params.face_img;
    this.reject_face = this.$route.params.reject_face;
    if (!utils.isEmpty(face_url)) {
      this.image = face_url;
      this.showFooterWarning();
      utils.showLoading();
      utils.getRemoteImageBlob("bopen/getimage", face_url, blob => {
        uploadFile = blob;
        setTimeout(function() {
          utils.hideLoading();
        }, 500);
      });
    }
  },
  methods: {
    clickLeft: function() {
      this.$router.back();
    },
    clickConfirm() {
      switch (this.dialogid) {
        case 1:
          this.pop = false;
          break;
        case 2:
          this.pop = false;
          this.clickLeft();
          break;
        default:
          break;
      }
    },
    selectLocalImg(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      this.createImage(files[0]);
    },
    createImage(file) {
      uploadFile = file;
      var reader = new FileReader();
      var vm = this;
      reader.onload = e => {
        vm.image = e.target.result;
        let myImage = new Image();
        myImage.src = e.target.result;
        myImage.onload = function(e1) {
          let img = e1.target;
          let width0 = crop_width;
          if (width0 > img.naturalWidth) {
            width0 = img.naturalWidth;
          }
          let height0 = parseInt(width0 * img.naturalHeight / img.naturalWidth);
          utils.compressImage(compressBlob, width0, height0, 1, function(blob) {
            blob.name = uploadFile.name
            uploadFile = blob
          });
        };
        vm.showFooterWarning();
        compressBlob = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    clickButton() {
      let param = new FormData(); // 创建form对象
      param.append("file", uploadFile,uploadFile.name); // 通过append向form对象添加数据
      param.append("bid", localStorage.getItem("bid")); // 通过append向form对象添加数据
      let obj = this;
      utils.jPost("bopen/uploadavatar", param, result => {
        utils.showAlert("", result.msg, "确认", function() {
          obj.clickLeft();
        });
      });
    },
    imgLoad(e) {
      let img = e.target;
      if (img.naturalWidth > img.naturalHeight) {
        this.width = this.box_width;
        this.height = this.width * img.naturalHeight / img.naturalWidth;
      } else {
        this.height = this.box_height;
        this.width = this.height * img.naturalWidth / img.naturalHeight;
      }
    },
    showFooterWarning: function() {
      this.showfooter = true;
      this.disableBtn = false;
    }
  },
  components: {
    NavigatorBar,
    JButton
  }
};
</script>
<style scoped>
.panel {
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.imgBox {
  /* width: 195px;
    height: 195px; */
  background: transparent;
  position: relative;
  left: 0;
  top: 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.imgBox img {
  max-width: 100%;
  max-height: 100%;
  /* min-width: 195px; */
  box-sizing: border-box;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

ul {
  padding: 0 15px 20px 15px;
  margin: 0;
}

ul .title {
  font-size: 16px;
  color: #f24a4a;
}

li {
  list-style: none;
  margin-top: 8px;
  color: #333333;
  font-size: 14px;
}

.camera {
  width: 100%;
  height: 100%;
  opacity: 0;
}

.boxZ {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
}

.box0 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.boxfooter {
  width: 100%;
  height: 30px;
  background: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 0;
  left: 0;
  color: white;
  font-size: 14px;
  line-height: 30px;
}
.reason_div {
  font-size: 14px;
  margin-bottom: 10px;
}
.reason_div span {
  color: #f24a4a;
}
</style>