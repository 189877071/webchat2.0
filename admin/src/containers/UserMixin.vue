<template>
<el-card class="box-card">
    <div slot="header" class="clearfix">
        <span><i class="iconfont icon-tianjiayonghu t1"></i> {{title}}</span>
        <el-button type="primary" @click="submit" plain> 
            <i class="el-icon-success"></i> {{btn}}
        </el-button>
    </div>
    <el-form label-position="top">
        <el-form-item label="账户名：">
            <el-input placeholder="输入账户名" v-model="username"></el-input>
        </el-form-item>

        <el-form-item label="姓名：">
            <el-input placeholder="输入用户姓名" v-model="name"></el-input>
        </el-form-item>

        <el-form-item label="邮箱地址：">
            <el-input placeholder="输入邮箱地址" v-model="email"></el-input>
        </el-form-item>

        <el-form-item label="密码：">
            <el-input placeholder="输入密码" type="password" v-model="password"></el-input>
        </el-form-item>

        <el-form-item label="简介：">
            <el-input
                resize="none"
                type="textarea"
                :rows="5"
                v-model="synopsis"
                placeholder="请输入内容">
            </el-input>
        </el-form-item>

        <el-form-item label="年龄：">
            <el-date-picker
                v-model="age"
                align="right"
                type="date"
                class="w325"
                placeholder="选择出生日期"
                format="yyyy 年 MM 月 dd 日">
            </el-date-picker>
        </el-form-item>

        <el-form-item label="所在分组：">
            <el-select class="w325" v-model="activeClass" placeholder="请选择分组">
                <el-option
                    v-for="item in oclass"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="性别：">
            <el-radio v-model="sex" label="1">男</el-radio>
            <el-radio v-model="sex" label="2">女</el-radio>
        </el-form-item>

        <el-form-item label="选择头像：">
            <my-upload-image v-model="head" />
        </el-form-item>
    </el-form>
</el-card>
</template>

<style lang="scss" scoped>
.clearfix {
    display: flex;
    justify-content: space-between;
}
.t1 {
    position: relative;
    font-size: 24px;
    top: 3px;
}
.w325 {
    width: 325px;
}
</style>

<script>
import UploadImage from "../components/UploadImage";
import axios from "../axios";
import commonMixin from "../commonMixin";
export default {
    data() {
        return {
            username: "",
            password: "",
            name: "",
            email: "",
            age: "",
            sex: "1",
            head: "",
            synopsis: "",
            oclass: [],
            activeClass: 1
        };
    },
    mixins: [commonMixin],
    components: {
        myUploadImage: UploadImage
    },
    async mounted() {
        const response = await axios.post("userlist?optation=class", {
            _load: true
        });

        const { success, oclass } = response.data;

        if (!success) {
            this.error("后台数据获取失败！");
            return;
        }

        this.oclass = oclass;
    }
};
</script>

