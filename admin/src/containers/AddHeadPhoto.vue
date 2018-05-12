<template>
<el-card class="box-card">
    <div slot="header" class="clearfix">
        <span><i class="el-icon-info"></i> 添加头像</span>
        <div class="head-right-box">
            <el-button type="primary" plain size="small" @click="uploadimg">上传</el-button>
        </div>
    </div>

    <el-card class="img-list-box">
        <my-upload-image v-model="files" />
        <transition name="el-fade-in-linear">
            <div class="mask" v-if="uploadmask">
                <p><i class="el-icon-upload"></i> 正在上传……</p>
            </div>
        </transition>
    </el-card>
</el-card>
</template>
<style lang="scss" scoped>
.head-right-box {
    float: right;
    position: relative;
    top: -5px;
}
.img-list-box {
    position: relative;
    .mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 10px;
        background: rgba(0, 0, 0, 0.3);
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
            font-size: 36px;
            position: relative;
            top: 5px;
        }
    }
}
</style>

<script>
import myUploadImage from "../components/UploadImage";
import axios from "../axios";
import commonMixin from "../commonMixin";
import { uploadImg } from "../fn";
export default {
    name: "AddHeadPhoto",
    components: {
        myUploadImage
    },
    data() {
        return {
            files: [],
            uploadmask: false
        };
    },
    mixins: [commonMixin],
    methods: {
        async uploadimg() {
            let [files] = [this.files];

            if (!files[0]) {
                this.error("请先选择要上传的图片！");
                return;
            }

            this.uploadmask = true;

            const whilleFn = i => {
                if(!files[i]) {
                    // 上传完毕
                    this.success('图片上传完毕！');
                    this.uploadmask = false;
                    return;
                }
                uploadImg(files[i]).then(name => {
                    console.log('123')
                    // name 为上传成功后的文件路径 false 表示上传失败
                    this.files.splice(i, 1);
                    whilleFn(++i);
                });
            };

            whilleFn(0);
        }
    }
};
</script>
