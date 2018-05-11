<template>
  <div>
      <el-card class="box-card">
        <div class="li-top">
          <div class="p50">
            <el-button type="danger" @click="deletes">删除</el-button>
            <el-button type="primary" @click="add">添加用户</el-button>
          </div>

          <div>
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="搜索:">
                <el-input type="search" v-model="cptext" placeholder="输入要搜索用户的信息"></el-input>
              </el-form-item>

              <el-form-item label="选择字段:">
                <el-select v-model="cpcolumn" placeholder="选择搜索字段">
                  <el-option label="用户姓名" value="1"></el-option>
                  <el-option label="用户账号" value="2"></el-option>
                  <el-option label="用户邮箱" value="3"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="选择分组:">
                <el-select v-model="cpclass" placeholder="所有用户">
                  <el-option label="所有用户" value=""></el-option>
                  <el-option v-for="(key, index) in oclass" :key="index" :label="key.name" :value="key.id"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item v-if="showRestore">
                <el-button @click="restore">还原</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <el-table ref="multipleTable" tooltip-effect="dark" :data="cplists" border  @selection-change="deleteUserChange">
          <el-table-column type="selection" width="38"></el-table-column>
          <el-table-column prop="id" label="id" width="55"></el-table-column>
          <el-table-column prop="username" label="账号" width=""></el-table-column>
          <el-table-column prop="name" label="姓名" width=""></el-table-column>
          <el-table-column prop="sex" label="性别" width=""></el-table-column>
          <el-table-column prop="age" label="年龄" width=""></el-table-column>
          <el-table-column prop="email" label="邮箱" width=""></el-table-column>
          <el-table-column prop="class" label="分组" width=""></el-table-column>
          <el-table-column prop="logindate" label="最近登陆时间" width=""></el-table-column>
          <el-table-column prop="resdate" label="注册时间" width=""></el-table-column>
          <el-table-column prop="issystem" label="测试账户" width=""></el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="$router.push({ name: 'UpdateUser', params: { id: scope.row.id } })">修改</el-button>
                <el-button type="danger" size="small" @click="odelete(scope.row.id, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="page-box">
            <el-pagination 
                background 
                layout="prev, pager, next" 
                :current-page="cppage" 
                :total="count" 
                :page-size="n" 
                @current-change="togglePage">
            </el-pagination>
        </div>
      </el-card>
  </div>
</template>

<style lang="scss" scoped>
.li-top {
    display: flex;
    .p50 {
        padding-right: 50px;
    }
}
.page-box {
    padding: 20px 0;
    display: flex;
    justify-content: center;
}
</style>

<script>
import axios from "../axios";
import { getDate } from "../fn";
export default {
    data() {
        return {
            lists: [],
            oclass: [],
            count: 0,
            n: 0,
            deleteuser: [],
            showRestore: false
        };
    },
    methods: {
        deleteUserChange(val) {
            this.deleteuser = val;
        },
        restore() {
            this.$router.push({ name: "UserLists" });
        },
        togglePage(page) {
            this.push({
                text: this.cptext,
                oclass: this.cpclass,
                page,
                column: this.cpcolumn
            });
        },
        push(query, t) {
            clearTimeout(this.time);
            const fn = () => this.$router.push({ name: "UserLists", query });
            if (t) {
                this.time = setTimeout(fn, 200);
            } else {
                fn();
            }
        },
        odelete(id, index) {
            if (!id || typeof index != "number") {
                this.$store.commit("init/error", "请指定要删除用户的id");
                return;
            }
            this.$store.commit("init/confirm", {
                title: "你确定要删除该用户吗？",
                callback: () => {
                    axios
                        .post("userlist?optation=delete", { id })
                        .then(response => {
                            if (!response.data.success) {
                                this.$store.commit("init/error", "删除失败");
                                return;
                            }
                            this.lists.splice(index, 1);
                        });
                }
            });
        },
        deletes() {
            if (this.deleteuser.length == 0) {
                this.$store.commit("init/error", "请选择要删除的用户");
                return;
            }
            let ids = this.deleteuser.map(item => item.id);
            this.$store.commit("init/confirm", {
                title: "你确定要删除这些用户吗？",
                callback: () => {
                    axios
                        .post("userlist?optation=delete", { ids })
                        .then(response => {
                            if (!response.data.success) {
                                this.$store.commit("init/error", "删除失败");
                                return;
                            }
                            for (let i = 0; i < this.lists.length; i++) {
                                let item = this.lists[i];
                                for (
                                    let j = 0;
                                    j < this.deleteuser.length;
                                    j++
                                ) {
                                    if (item.id == this.deleteuser[j].id) {
                                        this.lists.splice(i, 1);
                                        i--;
                                    }
                                }
                            }
                        });
                }
            });
        },
        add() {
            this.$router.push("/adduser");
        }
    },
    computed: {
        cplists() {
            let arr = [];
            for (let i = 0; i < this.lists.length; i++) {
                let item = { ...this.lists[i] };
                for (let i = 0; i < this.oclass.length; i++) {
                    if (item.class == this.oclass[i].id) {
                        item.class = this.oclass[i].name;
                        continue;
                    }
                }
                item.sex = item.sex == 1 ? "男" : "女";
                item.issystem = item.issystem == 1 ? "YES" : "NO";
                item.logindate = getDate(item.logindate);

                item.resdate = getDate(item.resdate);
                arr.push(item);
            }
            return arr;
        },
        cppage() {
            return this.$route.query.page ? Number(this.$route.query.page) : 1;
        },
        cptext: {
            get() {
                return this.$route.query.text;
            },
            set(newval) {
                const column = !newval ? 1 : this.cpcolumn;
                this.push(
                    { text: newval, oclass: this.cpclass, page: 1, column },
                    true
                );
            }
        },
        cpclass: {
            get() {
                return this.$route.query.oclass
                    ? Number(this.$route.query.oclass)
                    : "";
            },
            set(newval) {
                this.push({
                    text: this.cptext,
                    oclass: newval,
                    page: 1,
                    column: this.cpcolumn
                });
            }
        },
        cpcolumn: {
            get() {
                return this.$route.query.column && this.$route.query.text
                    ? this.$route.query.column + ""
                    : "1";
            },
            set(newval) {
                if (this.cptext)
                    this.push({
                        text: this.cptext,
                        oclass: this.cpclass,
                        page: 1,
                        column: newval
                    });
            }
        }
    },
    watch: {
        "$route.query": {
            handler(newval, oddval) {
                if (
                    newval.text ||
                    (newval.column && newval.column != 1) ||
                    newval.oclass
                ) {
                    this.showRestore = true;
                } else {
                    this.showRestore = false;
                }

                axios
                    .post("userlist", { ...newval, _load: true })
                    .then(response => {
                        const {
                            success,
                            lists,
                            class: oclass,
                            count,
                            n
                        } = response.data;
                        if (!success) {
                            this.$store.commit(
                                "init/error",
                                "获取用户列表失败"
                            );
                            return;
                        }
                        this.lists = lists;
                        this.oclass = oclass;
                        this.count = count;
                        this.n = n;
                    });
            },
            immediate: true
        }
    }
};
</script>

