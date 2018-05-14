<template>
<div>
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
    <el-card class="box-card">
        <div class="flex-img">
            <el-card class="img-lsit" v-for="(val, index) in imgs" :key="index">
                <my-image :src="getUrl(val.url)" />
                <div class="mask"><i class="el-icon-delete" @click="delet(val.id, index)"></i></div>
            </el-card>
        </div>
        <div class="page-box" v-if="initImgs.length"> 
            <a href="javascript:;" @click="page"><i class="el-icon-refresh"></i> 加载更多</a>
        </div>
    </el-card>
</div>
</template>

<style lang="scss" scoped>
.head-right-box {
    float: right;
    position: relative;
    top: -5px;
}
.img-list-box,
.flex-img {
    position: relative;
    .mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 10px;
        background: rgba(255, 255, 255, 0.8);
        color: #666;
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
.flex-img {
    display: flex;
    flex-wrap: wrap;
    .img-lsit {
        width: 178px;
        height: 178px;
        margin: 10px;
        position: relative;
        &:hover .mask {
            opacity: 1;
        }
    }
    .mask {
        opacity: 0;
        transition: opacity 0.3s;
    }

    .mask i {
        font-size: 24px;
        cursor: pointer;
    }
    img {
        width: 100%;
        height: 100%;
    }
}
.page-box {
    text-align: center;
    font-size: 14px;
    height: 50px;
    line-height: 50px;
    a {
        color: #606266;
        &:hover {
            color: #409eff;
        }
    }
    i {
        position: relative;
        font-size: 18px;
        top: 3px;
    }
}
</style>

<script>
import myUploadImage from "../components/UploadImage";
import myImage from "../components/Image";
import axios from "../axios";
import commonMixin from "../commonMixin";
import { uploadImg } from "../fn";
import config from "../config";
export default {
    name: "AddHeadPhoto",
    components: {
        myUploadImage,
        myImage
    },
    data() {
        return {
            files: [],
            uploadmask: false,
            imgs: [],
            initImgs: []
        };
    },
    computed: {},
    mixins: [commonMixin],
    methods: {
        async uploadimg() {
            let [files] = [this.files];

            if (!files[0]) {
                this.error("请先选择要上传的图片！");
                return;
            }

            this.uploadmask = true;

            const whilleFn = () => {
                if (!files.length) {
                    // 上传完毕
                    this.success("图片上传完毕！");
                    this.uploadmask = false;
                    // 跟新图片数据
                    this.getdata();
                    return;
                }
                uploadImg(files[0]).then(name => {
                    // name 为上传成功后的文件路径 false 表示上传失败
                    this.files.shift();
                    whilleFn();
                });
            };

            whilleFn();
        },
        async getdata() {
            const response = await axios.post("headphoto");
            if (!response.data.success) {
                error("获取数据失败");
                return;
            }
            this.initImgs = response.data.imgs;
            // 每次显示20张
            this.imgs = [];
            this.page();
        },
        page() {
            if (!this.initImgs.length) return;
            for (let i = 0; i < 30; i++) {
                this.imgs.push(this.initImgs.shift());
                if (!this.initImgs.length) {
                    break;
                }
            }
        },
        async delet(id, index) {
            const response = await axios.post("headphoto?optation=deleted", {
                id
            });

            if (!response.data.success) {
                this.error("删除失败！");
                return;
            }

            this.success("删除成功！");

            let arr = this.imgs;

            arr.splice(index, 1);

            this.imgs = [];

            this.$nextTick(() => (this.imgs = arr));
        },
        getUrl(url) {
            return config.serverHostName + url;
        }
    },
    mounted() {
        this.getdata();
    }
};
</script>
