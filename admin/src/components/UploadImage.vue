<template>
<div>
    <div class="upload-box" v-if="!show" :class="{active: imgsrc}">
        <div v-if="!imgsrc">
            <i class="el-icon-plus icon"></i>
        </div>
        <div v-else>
            <img :src="imgsrc" alt="">
        </div>
        <input class="file" @change="showimg($event)" type="file" accept="image/*">
    </div>

    <div v-else>
        <div class="upload-box m10">
            <div><i class="el-icon-plus icon"></i></div>
            <input class="file" multiple type="file" @change="showimgs($event)" accept="image/*">
        </div>
        <div class="updates-box">
            <el-card class="img-lsit" v-for="(val, index) in imgsrc" :key="index">
                <my-image :src="val" />
                <div class="img-mask">
                    <i class="el-icon-delete" @click="delet(index)"></i>
                </div>
            </el-card>
        </div>
    </div>
</div>
</template>

<style lang="scss" scoped>
.list-enter-active,
.list-leave-active {
    transition: all 1s;
}
.list-enter,
.list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
.upload-box {
    width: 178px;
    height: 178px;
    border: 1px dashed #dcdfe6;
    border-radius: 10px;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;

    &:hover,
    &.active {
        border-color: #409eff;
    }
    img {
        width: 100%;
        height: 100%;
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
.updates-box {
    display: flex;
    flex-wrap: wrap;
}
.img-lsit {
    width: 178px;
    height: 178px;
    margin: 10px;
    position: relative;
    &:hover .mask {
        opacity: 1;
    }
    img {
        width: 100%;
        height: 100%;
    }
    .img-mask {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        left: 0;
        top: 0;
        background: rgba(255, 255, 255, 0.8);
        transition: opacity 0.3s;
        opacity: 0;
        &:hover {
            opacity: 1;
        }
        i {
            color: #666;
            font-size: 24px;
            cursor: pointer;
        }
    }
}
</style>

<script>
import myImage from "./Image";
export default {
    name: "UpdateImage",
    props: ["imgsrc"],
    model: {
        prop: "imgsrc",
        event: "change"
    },
    components: {
        myImage
    },
    methods: {
        async showimg(evt) {
            let file = evt.target.files[0];
            if (!file) return;
            const imgurl = await this.getImgURL(file);
            this.$emit("change", imgurl);
        },
        showimgs(evt) {
            let files = evt.target.files;
            let arr = [...this.imgsrc];
            const fn = async n => {
                if (!files[n]) {
                    this.$emit("change", arr);
                    return;
                }
                const imgurl = await this.getImgURL(files[n]);
                arr.push(imgurl);
                fn(++n);
            };
            fn(0);
        },
        getImgURL(file) {
            return new Promise(resolve => {
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

                    resolve(oCanvas.toDataURL());

                    oFileReader = oImage = oCanvas = context = null;
                };
                oFileReader.readAsDataURL(file);
            });
        },
        delet(index) {
            let arr = [...this.imgsrc];
            arr.splice(index, 1);
            this.$emit("change", arr);
        }
    },
    data() {
        return {
            show: false
        };
    },
    mounted() {
        if (Array.isArray(this.imgsrc)) {
            this.show = true;
        }
    }
};
</script>