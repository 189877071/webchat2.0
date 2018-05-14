<template>
<div class="box">
    <el-card  class="box-card">
        <div slot="header" class="clearfix">
            <span><i class="el-icon-info"></i> 公告列表</span>
        </div>
        <div class="search-box">
            <div>
                <el-button type="danger" @click="deleteds" plain>删除所选</el-button>
                <router-link to="/addnotice">
                    <el-button type="primary" plain>发布公告</el-button>
                </router-link>
            </div>
            <div class="ml50">
                <el-input v-model="cpsearch" placeholder="输入要查找的内容" type="search"></el-input>
            </div>
        </div>
         <el-table :data="cplists" @selection-change="delArrChange" border style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column  prop="id" label="id"  width="80"></el-table-column>
            <el-table-column label="标题" width="">
                <template slot-scope="scope">
                    <router-link :to="`/updatanotice/${scope.row.id}`">{{scope.row.title}}</router-link>
                </template>
            </el-table-column>
            <el-table-column prop="otime" label="发布时间" width="150"></el-table-column>
            <el-table-column width="200"> 
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="$router.push(`/updatanotice/${scope.row.id}`)" plain>修改</el-button>
                    <el-button type="danger" size="small" @click="delet(scope.row.id, scope.$index)" plain>删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-box">
            <el-pagination 
                background 
                layout="prev, pager, next" 
                :page-size="n" 
                :current-page="active"
                @current-change="pageChange" 
                :total="showdata.length"></el-pagination>
        </div>
    </el-card>
</div>
</template>

<style lang="scss" scoped>
.search-box {
    height: 60px;
    display: flex;
    .ml50 {
        margin-left: 20px;
    }
}
.box a {
    color: #606266;
}
.page-box {
    display: flex;
    justify-content: center;
    height: 80px;
    align-items: center;
}
</style>


<script>
import axios from "../axios";
import commonMixin from "../commonMixin";
import { getDate, getActive } from "../fn";
export default {
    name: "NoticeList",
    data() {
        return {
            lists: [],
            delArr: [],
            active: 1,
            n: 15,
            search: "",
            initdata: [], // 原始数据
            showdata: [] // 要显示的数据
        };
    },
    mixins: [commonMixin],
    methods: {
        delArrChange(arr) {
            this.delArr = arr.map(item => item.id);
        },
        async getInfor() {
            const response = await axios.post("notice");
            if (!response.data.success) {
                this.error("获取数据失败！");
                return;
            }
            this.initdata = response.data.lists;
            this.resize();
        },
        filte() {
            this.showdata = [];
            if (!this.search) {
                for (let i = 0; i < this.initdata.length; i++) {
                    this.showdata.push(this.initdata[i]);
                }
                return;
            }
            for (let i = 0; i < this.initdata.length; i++) {
                if (this.initdata[i].title.search(this.search) > -1) {
                    this.showdata.push(this.initdata[i]);
                }
            }
        },
        resize() {
            this.filte();

            this.lists = [];

            const { active, n, showdata } = this;

            for (let i = (active - 1) * n; i < active * n; i++) {
                if (!showdata[i]) {
                    return;
                }
                this.lists.push(showdata[i]);
            }
        },
        pageChange(page) {
            this.active = page;
        },
        delet(id) {
            if (!id) return;
            this.confirm("你确定要删除吗？", async () => {
                const response = await axios.post("notice?optation=delete", {
                    id
                });

                if (!response.data.success) {
                    this.error("删除失败！");
                    return;
                }

                for (let i = 0; i < this.initdata.length; i++) {
                    if (this.initdata[i].id == id) {
                        this.initdata.splice(i, 1);
                        break;
                    }
                }

                this.resize();
            });
        },
        deleteds() {
            if (!this.delArr.length) {
                this.error("请先选择要删除的公告！");
                return;
            }
            this.confirm("确定要删除所选公告吗？", async () => {
                const response = await axios.post("notice?optation=delete", {
                    ids: this.delArr
                });
                if (!response.data.success) {
                    this.error("删除失败");
                    return;
                }
              
                for (let i = 0; i < this.initdata.length; i++) {
                    if (this.delArr.indexOf(this.initdata[i].id) > -1) {
                        this.initdata.splice(i, 1);
                        i--;
                    }
                }
                this.delArr = [];
                this.resize();
            });
        }
    },
    computed: {
        // 转换时间
        cplists() {
            let arr = [];
            for (let i = 0; i < this.lists.length; i++) {
                let item = { ...this.lists[i] };
                item.otime = getDate(item.otime);
                arr.push(item);
            }
            return arr;
        },
        cpsearch: {
            get() {
                return this.search;
            },
            set(newval) {
                clearTimeout(this.time);
                this.time = setTimeout(() => {
                    this.$router.push({
                        name: "NoticeList",
                        query: { search: newval, active: 1 }
                    });
                }, 300);
            }
        }
    },
    mounted() {
        this.time = null;
        this.getInfor();
    },
    watch: {
        active(newval) {
            this.$router.push({
                name: "NoticeList",
                query: { active: getActive(newval), search: this.search }
            });
        },
        "$route.query": {
            handler(newval) {
                const { active, search } = newval;
                this.active = getActive(active);
                this.search = search || "";
                this.resize();
            },
            immediate: true
        }
    }
};
</script>
