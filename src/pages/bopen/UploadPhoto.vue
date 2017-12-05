<template>
    <div class="uploadphoto container">
        <NavigatorBar @clickLeftHandler="clickLeft" :title="title"></NavigatorBar>
        <div class="panel">
            <label class="label0">请分别上传身份证正面和背面照片</label>
            <div class="reason_div" v-show="reject_front.reject">
                照片被驳回，原因：
                <span>{{reject_front.reason}}</span>
            </div>
            <div class="imgBox">
                <div class="box0">
                    <div v-show="showImg" class="boxZ">
                        <img :src="id0" @load="id0Load" :style="{width:width0+'px',height:height0+'px'}" />
                    </div>
                    <div class="boxZ">
                        <input type="file" @change="selectLocalImg0" accept="image/*" class="camera" />
                    </div>
                </div>
            </div>
            <div class="reason_div" v-show="reject_back.reject">
                照片被驳回，原因：
                <span>{{reject_back.reason}}</span>
            </div>
            <div class="imgBox">
                <div class="box0">
                    <div v-show="showImg" class="boxZ">
                        <img :src="id1" @load="id1Load" :style="{width:width1+'px',height:height1+'px'}" />
                    </div>
                    <div class="boxZ">
                        <input type="file" @change="selectLocalImg1" accept="image/*" class="camera" />
                    </div>
                </div>
            </div>
        </div>
        <div class="gap"></div>
        <div class="panel">
            <div class="imgBox1">
                <img src="static/id3.jpg" />
            </div>
        </div>
        <div style="height:15px;"></div>
        <JButton title="确认" :disable="disableBtn" @clickButtonHandler="clickButton"></JButton>
        <div style="height:30px;"></div>
    </div>
</template>
<script>
import NavigatorBar from "@/components/NavigatorBar";
import JButton from "@/components/JButton";
import utils from "@/lib/utils";
import params from "@/lib/params";
let id0Name = "";
let id1Name = "";
let id0Str = "static/id0.png";
let id1Str = "static/id1.png";
let id0File = null;
let id1File = null;
let params_id_front_img = null;
let params_id_back_img = null;
let compressBlob0 = null;
let compressBlob1 = null;
let crop_width = 600;
export default {
  name: "UploadPhoto",
  data: () => {
    return {
      title: "证件照片",
      disableBtn: true,
      showImg: true,
      id0: id0Str,
      id1: id1Str,
      pop: false,
      dialogid: 1,
      popTitle: "身份证上传提醒",
      popContent: "请上传本人真实身份证相片，以验证你的身份。",
      box_height: 140,
      box_width: 0,
      height0: this.box_height,
      width0: this.box_width,
      height1: this.box_height,
      width1: this.box_width,
      reject_front: {
        reject: true,
        reason: ""
      },
      reject_back: {
        reject: true,
        reason: ""
      }
    };
  },
  created() {
    this.box_width = params.SCREEN_WIDTH - 30;
    let id_front_img = this.$route.query.id_front_img;
    let id_back_img = this.$route.query.id_back_img;
    this.reject_front = this.$route.query.reject_front;
    this.reject_back = this.$route.query.reject_back;
    params_id_front_img = decodeURI(id_front_img);
    params_id_back_img = decodeURI(id_back_img);
    if (!utils.isEmpty(params_id_front_img)) {
      this.id0 = params_id_front_img;
    }
    if (!utils.isEmpty(params_id_back_img)) {
      this.id1 = params_id_back_img;
    }
    utils.showLoading();
    utils.getRemoteImageBlob("bopen/getimage", params_id_front_img, blob0 => {
      id0File = blob0;
      utils.getRemoteImageBlob("bopen/getimage", params_id_back_img, blob1 => {
        id1File = blob1;
        setTimeout(function() {
          utils.hideLoading();
        }, 500);
      });
    });

    this.checkUploadFinished();
  },
  methods: {
    clickLeft() {
      this.$router.back();
    },
    clickConfirm() {
      this.pop = false;
    },
    clickButton() {
      //上传图片
      let param = new FormData();
      if (id0File != null) {
        param.append("fileData0", id0File,id0File.name);
      }
      if (id1File != null) {
        param.append("fileData1", id1File,id1File.name);
      }
      param.append("bid", localStorage.getItem("bid"));
      utils.jPost("bopen/uploadidimages", param, result => {
        let data = result.data;
        localStorage.removeItem("idinfo");
        this.$router.push({ name: "CheckIdInfo", query: result.data });
      });
    },
    selectLocalImg0(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      id0Name = files[0].name;
      this.createid0Image(files[0], this.checkUploadFinished);
    },
    selectLocalImg1(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      id1Name = files[0].name;
      this.createid1Image(files[0], this.checkUploadFinished);
    },
    createid0Image(file, callBack) {
      id0File = file;
      var reader = new FileReader();
      reader.onload = e => {
        this.id0 = e.target.result;
        compressBlob0 = e.target.result;
        let myImage = new Image();
        myImage.src = e.target.result;
        myImage.onload = function(e1) {
          let img = e1.target;
          let width0 = crop_width;
          if (width0 > img.naturalWidth) {
            width0 = img.naturalWidth;
          }
          let height0 = parseInt(width0 * img.naturalHeight / img.naturalWidth);
          utils.compressImage(compressBlob0, width0, height0, 1, function(
            blob
          ) {
            blob.name = id0File.name
            id0File = blob;
            callBack();
          });
        };
      };
      reader.readAsDataURL(file);
    },
    createid1Image(file, callBack) {
      id1File = file;
      var reader = new FileReader();
      reader.onload = e => {
        this.id1 = e.target.result;
        compressBlob1 = e.target.result;

        let myImage = new Image();
        myImage.src = e.target.result;
        myImage.onload = function(e1) {
          let img = e1.target;
          let width0 = crop_width;
          if (width0 > img.naturalWidth) {
            width0 = img.naturalWidth;
          }
          let height0 = parseInt(width0 * img.naturalHeight / img.naturalWidth);
          utils.compressImage(compressBlob1, width0, height0, 1, function(
            blob
          ) {
            blob.name = id1File.name
            id1File = blob;
            callBack();
          });
        };
      };
      reader.readAsDataURL(file);
    },
    checkUploadFinished() {
      if (this.id0 != id0Str && this.id1 != id1Str) {
        this.disableBtn = false;
      }
    },
    id0Load(e) {
      let img = e.target;
      let ratio_natural = img.naturalWidth / img.naturalHeight;
      let ratio_box = this.box_width / this.box_height;
      if (ratio_natural > ratio_box) {
        this.width0 = this.box_width;
        this.height0 = this.width0 * img.naturalHeight / img.naturalWidth;
      } else {
        this.height0 = this.box_height;
        this.width0 = this.height0 * img.naturalWidth / img.naturalHeight;
      }
    },
    id1Load(e) {
      let img = e.target;
      let ratio_natural = img.naturalWidth / img.naturalHeight;
      let ratio_box = this.box_width / this.box_height;
      if (ratio_natural > ratio_box) {
        this.width1 = this.box_width;
        this.height1 = this.width1 * img.naturalHeight / img.naturalWidth;
      } else {
        this.height1 = this.box_height;
        this.width1 = this.height1 * img.naturalWidth / img.naturalHeight;
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
.idBox {
  width: 100%;
  height: 50px;
}

.label0 {
  font-size: 15px;
  display: flex;
  justify-content: flex-start;
}

.panel {
  background: white;
  padding: 15px;
}

.imgBox {
  width: 100%;
  height: 140px;
  margin-top: 15px;
  position: relative;
  left: 0;
  top: 0;
  background: #79b1fd;
  border-radius: 5px;
  box-sizing: border-box;
  /* border: 1px solid rgba(0, 0, 0, 0.1); */
}

.imgBox1 {
  width: 100%;
  height: 140px;
  margin-top: 15px;
  position: relative;
  left: 0;
  top: 0;
  background: transparent;
  /* border-radius: 5px; */
}

.imgBox img {
  max-width: 100%;
  max-height: 100%;
  /* min-height: 140px; */
  box-sizing: border-box;
}

.imgBox1 img {
  width: 100%;
  height: 140px;
  box-sizing: border-box;
}

.gap {
  height: 8px;
}

.camera {
  width: 100%;
  height: 100%;
  background: transparent;
  position: relative;
}

.box0 {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.boxZ {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  box-sizing: border-box;
  border-radius: 5px;
  /* background: red; */
  /* border: 1px solid rgba(0, 0, 0, 0.1); */
}

.camera {
  width: 100%;
  height: 100%;
  opacity: 0;
}

.reason_div {
  font-size: 14px;
  margin-top: 15px;
}
.reason_div span {
  color: #f24a4a;
}
</style>