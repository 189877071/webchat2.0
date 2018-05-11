<template>
  <el-card>
    <div slot="header" class="clearfix">
        <span><i class="iconfont icon-tianjiayonghu t1"></i> 输入新用户信息</span>
        <el-button type="primary" @click="submit"> 
            <i class="el-icon-success"></i> 添加
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
                placeholder="选择出生日期">
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
            <!-- <my-upload-image :imgsrc="head" :imgdata.sync="head" /> -->
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
export default {
    name: "AddUser",
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
    
    components: {
        myUploadImage: UploadImage
    },
    async mounted() {
        const response = await axios.post("userlist?optation=class");
        const { success, oclass } = response.data;
        if (!success) {
            this.$store("init/error", "后台数据获取失败");
            return;
        }
        this.oclass = oclass;
    },
    methods: {
        submit() {
            if (this.$route.name == "AddUser") {
                this.add();
            }
        },
        error(text) {
            this.$store.commit("init/error", text);
        },
        async add() {
            if (!this.username || this.username.length < 5) {
                this.error("账户名长度不能少于5位字符！");
                return;
            }
            if (/\W/.test(this.username)) {
                this.error("账户名只能是字母，数字，下划线！");
                return;
            }

            const testUsername = await axios.post(
                "userlist?optation=username",
                { username: this.username }
            );

            if (!testUsername.data.success) {
                this.error("账户名已存在，请重新输入");
                return;
            }

            if (!this.password || this.password.length < 6) {
                this.error("密码长度不能少于6位字符！");
                return;
            }
            if (!this.name) {
                this.error("姓名不能为空！");
                return;
            }
            if (!this.email) {
                this.error("邮箱地址不能为空！");
                return;
            }
            if (
                !/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(
                    this.email
                )
            ) {
                this.error("请输入正确的邮箱地址！");
                return;
            }

            const testEmail = await axios.post("userlist?optation=email", {
                email: this.email
            });

            if (!testEmail.data.success) {
                this.error("邮箱地址已存在，请重新输入");
                return;
            }

            if (!this.age) {
                this.error("请设置用户年龄！");
                return;
            }
            if (!this.head) {
                this.error("请上传用户头像！");
                return;
            }

            let age = new Date(this.age).getTime();

            if (age > Date.now()) {
                age = Date.now();
            }

            const data = {
                username: this.username,
                password: this.password,
                name: this.name,
                email: this.email,
                sex: this.sex,
                headphoto: this.head,
                // headphoto: '/demo.jpg',
                oclass: this.activeClass,
                synopsis: this.synopsis,
                age
            };


            const response = await axios.post("userlist?optation=add", data);
            if (!response.data.success) {
                this.error("添加失败");
                return;
            }

            this.$store.commit("init/success", "添加成功");

            this.username = "";
            this.password = "";
            this.name = "";
            this.email = "";
            this.age = "";
            this.sex = "1";
            this.head = "";
            this.synopsis = "";
            this.activeClass = 1;
        }
    }
};
</script>

