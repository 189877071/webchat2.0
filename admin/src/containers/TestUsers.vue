<template>
<div>
    <el-card  class="box-card">
        <div slot="header" class="clearfix">
            <span><i class="el-icon-info"></i> 批量添加测试用户</span>
            <div class="header-r">
                <el-button type="primary" size="small" :plain="btnonoff" :disabled="btnonoff" @click="getdata">生成数据</el-button>
                <el-button type="primary" size="small" :plain="!btnonoff" :disabled="!btnonoff" @click="submit">上传数据</el-button>
            </div>
        </div>

        <el-form label-position="top" label-width="80px">
            <el-form-item label="选择所在组：">
                <el-select v-model="activeClass"  placeholder="请选择" style="width: 100%;">
                    <el-option 
                        v-for="(key, index) in oclass"
                        :key="index"
                        :label="key.name" 
                        :value="key.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="textarea-box" 
                label="按照规则输入要添加用户的昵称：">
                <a href="http://www.qmsjmfb.com/" target="_break">昵称获取地址</a>
                <el-input type="textarea" v-model="text" resize="none" :rows="5"></el-input>
            </el-form-item>
        </el-form>

        <el-table :data="cpusers" border style="width: 100%" v-if="users.length">
            <el-table-column prop="" label="#" width="80">
                <template slot-scope="scope">{{scope.$index+1}}</template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width=""></el-table-column>
            <el-table-column prop="username" label="账户" width=""></el-table-column>
            <el-table-column prop="email" label="邮箱" width=""></el-table-column>
            <el-table-column prop="sex" label="性别" width=""></el-table-column>
            <el-table-column prop="class" label="分组" width=""></el-table-column>
            <el-table-column prop="age" label="年龄" width=""></el-table-column>
            <el-table-column label="操作" width="150">
                <div slot-scope="scope">
                    <el-button type="warning" size="small" @click="remove(scope.$index)">删除</el-button>
                </div>
            </el-table-column>
        </el-table>
    </el-card>
</div>
</template>

<style lang="scss" scoped>
.header-r {
    float: right;
    position: relative;
    top: -5px;
}
.textarea-box {
    position: relative;
    a {
        position: absolute;
        top: -50px;
        left: 210px;
        color: #67c23a;
        font-weight: bold;
    }
}
</style>

<script>
import axios from "../axios";
import { getAge, getClassName } from "../fn";
import commonMixin from "../commonMixin";
export default {
    name: "TestUsers",
    mixins: [commonMixin],
    data() {
        return {
            btnonoff: false,
            activeClass: 1,
            oclass: [],
            text: "",
            users: []
        };
    },
    computed: {
        cpusers() {
            let classname = getClassName(this.activeClass, this.oclass);

            let arr = this.users.map(item => {
                let obj = { ...item };
                obj.sex = item.sex == 1 ? "男" : "女";
                obj.age = getAge(item.age);
                obj.class = classname;
                return obj;
            });

            return arr;
        }
    },
    methods: {
        async submit() {
            if (!this.users.length) {
                this.error("请先添加数据");
                return;
            }

            const response = await axios.post("userlist?optation=adds", {
                users: this.users
            });

            if (!response.data.success) {
                this.error("数据添加失败！");
            } else {
                this.success("添加成功!");
            }

            this.users = [];
        },
        getdata() {
            if (!this.text) {
                this.error("请先输入数据！");
                return;
            }

            let oul = document.createElement("ul");

            oul.innerHTML = this.text;

            let ali = oul.querySelectorAll("li");

            let n = 0;

            let t = Date.now() - 1520000000000;

            let start = new Date("1990").getTime();

            let end = new Date("2010").getTime();

            this.users = [...ali].map(item => {
                n++;
                let data = {
                    name: item.innerText,
                    username: t + n + "",
                    email: t + n + "@qq.com",
                    sex: Math.round(Math.random() + 1),
                    age: Math.round(Math.random() * (end - start) + start),
                    class: this.activeClass
                };
                return data;
            });

            this.text = "";
        },
        remove(index) {
            this.users.splice(index, 1);
        }
    },
    async mounted() {
        const response = await axios.post("userlist?optation=class", {
            _load: true
        });

        const { success, oclass } = response.data;

        if (!success) {
            this.error("后台数据获取失败!");
            return;
        }

        this.oclass = oclass;
    },
    watch: {
        users(newval) {
            this.btnonoff = newval.length ? true : false;
        }
    }
};
</script>

