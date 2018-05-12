<template>
    <div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span> <i class="el-icon-info"></i> {{title}}</span>
                <div class="head-right">
                    <el-button type="primary" size="small" @click="submit" >提交</el-button>
                </div>
            </div>

            <el-form label-position="top" label-width="80px">
                <el-form-item label="名称分组名称：">
                    <el-input v-model="newGroup.name" placeholder="输入分组名称(长度必须是4~7个字符)"></el-input>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input v-model="newGroup.sort" placeholder="排序(不能小于0)" type="number" ></el-input>
                </el-form-item>
                <el-form-item label="分组介绍：">
                    <el-input v-model="newGroup.synopsis" type="textarea" resize="none" rows="5" placeholder="分组介绍"></el-input>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="box-card" v-if="!up">
            <div slot="header" class="clearfix">
                <span> <i class="el-icon-info"></i> 分组列表</span>
            </div>
            <el-table :data="oclass" border style="width: 100%">
                <el-table-column prop="id" label="id" ></el-table-column>
                <el-table-column prop="name" label="名称" ></el-table-column>
                <el-table-column prop="synopsis" label="简介" ></el-table-column>
                <el-table-column prop="sort" label="排序"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" plain size="small" @click="toggleUpdate(scope.row, scope.$index)">修改</el-button>
                        <el-button type="danger" plain size="small" @click="delet(scope.row.id, scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<style lang="scss" scoped>
.head-right {
    float: right;
    position: relative;
    top: -5px;
}
.box-card {
    margin-bottom: 50px;
}
</style>

<script>
import axios from "../axios";
export default {
    name: "Group",
    data() {
        return {
            oclass: [],
            newGroup: {
                name: "",
                sort: 0,
                synopsis: ""
            },
            title: "添加分组",
            up: false,
            upid: 0
        };
    },
    async mounted() {
        const response = await axios.post("userlist?optation=class", {
            _load: true
        });

        const { success, oclass } = response.data;

        if (!success) {
            this.$store.commit("init/error", "后台数据获取失败");
            return;
        }
        this.oclass = oclass;
    },
    methods: {
        submit() {
            const { name, sort, synopsis } = this.newGroup;
            if (name.length < 1 || name.length > 7) {
                this.$store.commit(
                    "init/error",
                    "用户名长度不能不符合规划(应为1~7个字符之间的字符串)"
                );
                return;
            }
            if (sort < 0) {
                this.$store.commit("init/error", "排序参数不能小于0");
                return;
            }
            if (!this.up) {
                this.add();
            } else {
                this.update();
            }
        },
        async add() {
            const { name, sort, synopsis } = this.newGroup;

            const response = await axios.post("group?optation=add", {
                name,
                sort,
                synopsis
            });

            if (!response.data.success) {
                this.$store.commit("init/error", "数据添加失败！");
                return;
            }

            this.$store.commit("init/success", "添加成功!");

            this.oclass.push({ id: response.data.id, name, sort, synopsis });

            this.reset();
        },
        reset() {
            this.newGroup.name = "";
            this.newGroup.sort = 0;
            this.newGroup.synopsis = "";
            this.upid = 0;
            this.up = false;
        },
        async delet(id, index) {
            if (!id) {
                this.$store.commit("init/error", "请指定要删除的分组");
                return;
            }

            const res = await axios.post('group?optation=seluser', { id });

            if(!res.data.success) {
                this.$store.commit("init/error", "系统出错!");
                return;
            }

            if(res.data.users > 0) {
                this.$store.commit("init/error", "该分组下还有用户不能删除!");
                return;
            }

            this.$store.commit("init/confirm", {
                title: "你确定要删除吗？",
                callback: async () => {
                    const response = await axios.post("group?optation=delete", {
                        id
                    });

                    if (!response.data.success) {
                        this.$store.commit("init/error", "删除失败");
                        return;
                    }

                    this.oclass.splice(index, 1);
                }
            });
        },
        toggleUpdate(data, index) {
            this.up = true;
            this.newGroup.name = data.name;
            this.newGroup.sort = data.sort;
            this.newGroup.synopsis = data.synopsis;
            this.upid = data.id;
        },
        async update() {
            const { name, sort, synopsis } = this.newGroup;

            const response = await axios.post("group?optation=update", {
                name,
                sort,
                synopsis,
                id: this.upid
            });

            if (!response.data.success) {
                this.$store.commit("init/error", "数据修改失败！");
                return;
            }

            this.$store.commit("init/success", "修改成功!");

            for(let i=0; i<this.oclass.length; i++) {
                let item = this.oclass[i];
                if(item.id == this.upid) {
                    item.name = name;
                    item.sort = sort;
                    item.synopsis = synopsis;
                    break;
                }
            }

            this.reset();
        }
    }
};
</script>

