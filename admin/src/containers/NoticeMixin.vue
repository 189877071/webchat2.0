<template>
<div>
    <el-card class="box-card">
        <!-- 头 -->
        <div slot="header" class="clearfix">
            <span> <i class="el-icon-info"></i> {{htitle}}</span>
            <div class="right">
                <el-button size="small" type="primary" @click="send" plain>{{sendt}}</el-button>
            </div>
        </div>
        <!-- 表单 -->
        <el-form label-position="top" label-width="80px">
            <el-form-item label="公告标题：">
                <el-input v-model="title" placeholder="输入公告标题"></el-input>
            </el-form-item>
            <el-form-item label="公告描述：">
                <el-input
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    resize='none'
                    v-model="description">
                </el-input>
            </el-form-item>
        </el-form>
        <div class="lable-title">公告内容：</div>
        <div class="ueditor-box">
            <script id="editor" type="text/plain" style="width:100%; height:600px;"></script>
        </div>
    </el-card>
</div>
</template>

<style lang="scss" scoped>
.lable-title {
    line-height: 40px;
    font-size: 14px;
    color: #606266;
    padding: 5px;
}
</style>

<script>
import commonMxin from "../commonMixin";
import axios from "../axios";

import { virtualDom } from '../fn';

export default {
    data() {
        return {
            title: "",
            editor: null,
            description: ''
        };
    },
    methods: {
        async send() {
            let content = this.editor.getContent();

            if (!this.title) {
                this.error("请先输入公告标题！");
                return;
            }
            if(!this.description) {
                this.error("公告描述不能为空！");
                return;
            }
            if (!content) {
                this.error("请输入公告内容！");
                return;
            }

            let url = "notice?optation=add";

            let data = {
                content: JSON.stringify(virtualDom(content)),
                title: this.title,
                description: this.description
            };
            
            if (this.$route.meta.update) {
                data.id = this.$route.params.id;
                url = "notice?optation=update";
            }

            const response = await axios.post(url, data);

            if (!response.data.success) {
                this.error("数据上传失败");
                return;
            }
            this.confirm("上传成功！", () => {
                this.$router.push("/noticelist");
            });
        }
    },
    mixins: [commonMxin],
    destroyed() {
        if (this.editor) {
            this.editor.destroy();
        }
    }
};
</script>
