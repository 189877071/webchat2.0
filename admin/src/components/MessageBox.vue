<template>
<transition name="el-fade-in-linear">
    <div class="message-box" v-if="show">

        <div class="content-box" v-if="alertSuccess">
            <div class="title"> <i class="success el-icon-success"></i> 操作成功</div>
            <div class="content">{{alertSuccess}}</div>
            <div class="btns">
                <el-button type="primary" @click="close('success')">确 定</el-button>
            </div>
            <div class="close">
                <i class="el-icon-close" @click="close('success')"></i>
            </div>
        </div>

        <div class="content-box" v-if="alertError">
            <div class="title"> <i class="error el-icon-warning"></i> 错误信息</div>
            <div class="content">{{alertError}}</div>
            <div class="btns">
                <el-button type="warning" @click="close('error')">确定</el-button>
            </div>
            <div class="close">
                <i class="el-icon-close" @click="close('error')"></i>
            </div>
        </div>

        <div class="content-box" v-if="confirmT">
            <div class="title"> <i class="success el-icon-question"></i> 提示信息</div>
            <div class="content">{{confirmT}}</div>
            <div class="btns">
                <el-button type="" @click="corfirmClose">取消</el-button>
                <el-button type="primary" @click="corfirmCallback">确定</el-button>
            </div>
            <div class="close">
                <i class="el-icon-close" @click="close('error')"></i>
            </div>
        </div>

    </div>
</transition>
</template>

<style lang="scss" scoped>
.message-box {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 20000;
    text-align: center;
    &:after {
        content: "";
        display: inline-block;
        height: 100%;
        width: 0;
        vertical-align: middle;
    }
}
.content-box {
    display: inline-block;
    width: 420px;
    padding-bottom: 10px;
    vertical-align: middle;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    font-size: 18px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
    overflow: hidden;
    backface-visibility: hidden;
    padding-bottom: 30px;
    position: relative;
    .title {
        position: relative;
        padding: 25px 15px 10px 15px;
    }
    .content {
        position: relative;
        padding: 10px 15px;
        color: #606266;
        font-size: 14px;
    }
    .btns {
        padding: 5px 15px 0;
    }
    .close {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 0;
        border: none;
        outline: none;
        background: transparent;
        font-size: 20px;
        cursor: pointer;
        &:hover {
            color: #666;
        }
    }
    .success {
        color: #67c23a;
    }
    .error {
        color: #e6a23c;
    }
}
</style>

<script>
import { mapState } from "vuex";
export default {
    name: "MessageBox",
    computed: {
        ...mapState("init", [
            "alertError",
            "alertSuccess",
            "confirmT",
            "confirmC"
        ]),
        show() {
            return this.alertError || this.alertSuccess || this.confirmT
                ? true
                : false;
        }
    },
    methods: {
        close(key) {
            this.$store.commit("init/" + key, "");
        },
        corfirmCallback() {
            this.confirmC && this.confirmC();
            this.corfirmClose();
        },
        corfirmClose() {
            this.$store.commit("init/confirm", { title: "", callback: false });
        }
    },
    mounted() {
        console.log(this.confirmT);
    }
};
</script>
