<template>
  <div>
      <el-card class="box-card">
        <div slot="header" class="clearfix title-box">
          <span> <i class="iconfont icon-shujuku"></i> 数据库信息设置</span>
          <transition name="el-fade-in-linear">
            <el-button class="btn" v-if="mysql.btn" type="text" @click="mysqlSubmit"> 
              <i class="el-icon-setting"></i> 提交修改
            </el-button>
          </transition>
        </div>

        <el-form label-position="top" label-width="80px" :model="mysql">
          <el-form-item label="主机名：" class="label-box">
            <el-input v-model="mysql.host" placeholder="输入数据库主机名"></el-input>
          </el-form-item>
          <el-form-item label="用户名：">
            <el-input v-model="mysql.user" placeholder="输入数据库用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码：">
            <el-input v-model="mysql.password" placeholder="输入数据库密码"></el-input>
          </el-form-item>
          <el-form-item label="数据仓库名称：">
            <el-input v-model="mysql.database" placeholder="输入数据仓库名称"></el-input>
          </el-form-item>
          <el-form-item label="连接池数量：">
            <el-input v-model="mysql.connectionLimit" type="number" placeholder="输入数据仓库名称"></el-input>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix title-box">
          <span> <i class="iconfont icon-youxiang"></i> 邮箱信息设置</span>
          <transition name="el-fade-in-linear">
            <el-button class="btn" v-if="email.btn" type="text" @click="emailSubmit"> 
              <i class="el-icon-setting"></i> 提交修改
            </el-button>
          </transition>
        </div>
        <el-form label-position="top" label-width="80px" :model="email">
          <el-form-item label="邮箱服务器地址：" class="label-box">
            <el-input v-model="email.host" placeholder="输入邮箱服务器地址"></el-input>
          </el-form-item>
          <el-form-item label="端口：">
            <el-input v-model="email.port" type="number" placeholder="输入邮箱端口"></el-input>
          </el-form-item>
          <el-form-item label="用户名：">
            <el-input v-model="email.user" placeholder="输入邮箱用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码：">
            <el-input v-model="email.pass" placeholder="输入邮箱密码"></el-input>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="box-card">
        <div slot="header" class="clearfix title-box">
          <span> <i class="iconfont icon-shezhi"></i> 修改登录信息</span>
          <transition name="el-fade-in-linear">
            <el-button class="btn" v-if="administrator.btn" type="text" @click="adminSubmit"> 
                <i class="el-icon-setting"></i> 提交修改
            </el-button>
          </transition>
        </div>
        <el-form label-position="top" label-width="80px" :model="administrator">
          <el-form-item label="管理员用户名：" class="label-box">
            <el-input v-model="administrator.username" placeholder="输入管理员用户名"></el-input>
          </el-form-item>
          <el-form-item label="登录密码：">
            <el-input v-model="administrator.password" type="password" placeholder="输入登录密码"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
  </div>
</template>

<style lang="scss" scoped>
.box-card {
    margin-bottom: 40px;
}
.title-box {
    i {
        position: relative;
        font-size: 24px;
        top: 3px;
    }
    i.el-icon-setting {
        top: 2px;
        font-size: 18px;
    }
    .btn {
        float: right;
        padding: 3px 0;
        color: #333;
    }
}
</style>

<script>
import commonMixin from "../commonMixin";
import axios from "../axios";
export default {
    name: "Setting",
    data() {
        return {
            mysql: {
                database: "",
                host: "",
                user: "",
                password: "",
                connectionLimit: "",
                btn: false
            },
            email: {
                host: "",
                pass: "",
                port: "",
                user: "",
                btn: false
            },
            administrator: {
                username: "",
                password: "",
                btn: false
            },
            infor: null
        };
    },
    mixins: [commonMixin],
    methods: {
        initInfor(data) {
            const { mysql, email, administrator } = data;
            this.mysql.database = mysql.database;
            this.mysql.host = mysql.host;
            this.mysql.user = mysql.user;
            this.mysql.password = mysql.password;
            this.mysql.connectionLimit = mysql.connectionLimit;

            this.email.host = email.host;
            this.email.pass = email.pass;
            this.email.port = email.port;
            this.email.user = email.user;

            this.administrator.username = administrator.username;

            this.infor = data;
        },
        async mysqlSubmit() {
            for (var key in this.mysql) {
                if (key == "btn") continue;
                if (this.mysql[key] == "") {
                    this.error("请填写完整参数");
                    return;
                }
            }
            const connectionLimit = parseInt(this.mysql.connectionLimit);
            if (isNaN(connectionLimit)) {
                this.error("连接池数量只能是数字");
                return;
            } else if (connectionLimit < 1) {
                this.error("连接池数量不能少于 “1” ");
                return;
            }

            const response = await axios.post(
                "setting?optation=mysql",
                this.mysql
            );

            const { success } = response.data;

            if (!success) {
                this.error("修改失败");
            } else {
                this.success("数据库配置信息修改成功！");
            }
        },
        async emailSubmit() {
            for (var key in this.email) {
                if (key == "btn") continue;
                if (this.email[key] == "") {
                    this.error("请填写完整参数");
                    return;
                }
            }
            const port = parseInt(this.email.port);
            if (isNaN(port)) {
                this.error("端口号只能是数字");
                return;
            } else if (port < 1) {
                this.error("端口号不能少于1");
                return;
            }

            const response = await axios.post(
                "setting?optation=email",
                this.email
            );
            const { success } = response.data;
            if (!success) {
                this.error("修改失败");
            } else {
                this.success("邮箱配置信息修改成功！");
            }
        },
        async adminSubmit() {
            if (!this.administrator.username || !this.administrator.password) {
                this.error("请填写完整参数！");
                return;
            }
            if (this.administrator.password.length < 6) {
                this.error("密码长度不能少于6位数");
                return;
            }

            const response = await axios.post(
                "setting?optation=administrator",
                this.administrator
            );

            const { success } = response.data;
            
            if (!success) {
                this.error("修改失败");
            } else {
                this.success("管理员登录信息修改成功！");
            }
        }
    },
    watch: {
        mysql: {
            handler(newVal) {
                if (!this.infor) return;
                for (var key in this.infor.mysql) {
                    if (
                        this.mysql[key] &&
                        this.infor.mysql[key] != this.mysql[key]
                    ) {
                        this.mysql.btn = true;
                        return;
                    }
                }
                this.mysql.btn = false;
            },
            deep: true
        },
        email: {
            handler(newVal) {
                if (!this.infor) return;
                for (var key in this.infor.email) {
                    if (this.infor.email[key] != this.email[key]) {
                        this.email.btn = true;
                        return;
                    }
                }
                this.email.btn = false;
            },
            deep: true
        },
        administrator: {
            handler(newVal) {
                if (this.administrator.password) {
                    this.administrator.btn = true;
                    return;
                }
                this.administrator.btn = false;
            },
            deep: true
        }
    },
    async created() {
        // 要获取 数据库配置信息 邮箱配置信息 管理员账户
        const response = await axios.post("setting");
        const { success } = response.data;
        if (!success) {
            this.error("获取数据失败");
            return;
        }
        this.initInfor(response.data);
    }
};
</script>
