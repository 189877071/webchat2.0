<template>
  <div class="upload-box" :class="{active: imgsrc}">
      <div v-if="!imgsrc">
            <i class="el-icon-plus icon"></i>
      </div>
      <div v-else>
          <img :src="imgsrc" alt="">
      </div>
      <input class="file" @change="change($event)" type="file" accept="image/*">
  </div>
</template>

<style lang="scss" scoped>
.upload-box {
    width: 178px;
    height: 178px;
    border: 1px dashed #dcdfe6;
    border-radius: 3px;
    position: relative;
    box-sizing: border-box;
    &:hover,
    &.active {
        border-color: #409eff;
    }
    img {
        width: 166px;
        height: 166px;
        padding: 5px;
    }
}
.icon {
    display: block;
    width: 178px;
    height: 178px;
    font-size: 24px;
    text-align: center;
    line-height: 178px;
    color: #8c939d;
}
.file {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    left: 0;
    top: 0;
}
</style>

<script>
export default {
    name: "UpdateImage",
    props: ["imgsrc"],
    model: {
        prop: "imgsrc",
        event: "change"
    },
    methods: {
        change(evt) {
            const _this = this;
            let file = evt.target.files[0];
            let oFileReader = new FileReader();
            let oImage = new Image();
            let oCanvas = document.createElement("canvas");
            oCanvas.width = 200;
            oCanvas.height = 200;
            let context = oCanvas.getContext("2d");
            oFileReader.addEventListener("load", function(evt) {
                oImage.src = this.result;
            });
            oImage.onload = function() {
                context.drawImage(
                    this,
                    0,
                    0,
                    this.width,
                    this.height,
                    0,
                    0,
                    200,
                    200
                );
                // _this.imgsrc = oCanvas.toDataURL();
                _this.$emit("change", oCanvas.toDataURL());
            };
            oFileReader.readAsDataURL(file);
        }
    }
};
</script>