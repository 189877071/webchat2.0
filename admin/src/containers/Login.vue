<template>
<div class="box">
    <el-card class="box-card">
        <form @submit.prevent="submit">
            <h1>WEBCHAT—后台管理</h1>
            <p>
                <el-input v-model="username" autofocus placeholder="请输入用户名"></el-input>
            </p>
            <p>
                <el-input v-model="password" type="password" placeholder="请输入密码"></el-input>
            </p>
            <p class="btn-box">
                <el-button type="primary" native-type="submit" class="display">登 录</el-button>
            </p>
        </form>
    </el-card>
</div>
</template>

<style lang="scss" scoped>
.box {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
}
.box-card {
    width: 480px;
    height: 320px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    h1 {
        color: #303133;
        text-align: center;
        font-size: 22px;
        line-height: 50px;
    }
    p {
        padding-bottom: 10px;
        &.btn-box {
            padding-bottom: 0;
        }
        .display {
            display: block;
            width: 100%;
        }
    }
}
</style>

<script>
import axios from "../axios";
import { mapState } from "vuex";
import commonMixin from "../commonMixin";
export default {
    name: "Index",
    data() {
        return {
            username: "",
            password: ""
        };
    },
    mixins: [commonMixin],
    methods: {
        async submit() {
            const response = await axios.post("login", {
                username: this.username,
                password: this.password
            });

            if (!response.data.success) {
                this.error("用户名或密码错误！");
                return;
            }

            this.$router.replace("/");
        }
    },
    computed: {
        ...mapState("init", ["login"])
    },
    mounted() {
        if (this.login) {
            this.$router.replace("/");
        }
    }
};
</script>