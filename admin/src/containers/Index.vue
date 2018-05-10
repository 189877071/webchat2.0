<template>
  <el-container class="all-box">
    <el-header>
      <div class="t-left">
        <router-link to="/">WEBCHAT-后台管理</router-link>
      </div>
      <div class="t-center">{{title}}</div>
      <div class="t-right">
        <a href="javascript:;"><i class="iconfont icon-084tuichu"></i> 退出</a>
      </div>
    </el-header>

    <el-container>
      <el-aside width="300px">
        <ul>
          <li><router-link to="/index"><i class="iconfont icon-shouye01"></i> 首页</router-link></li>
          <li><router-link to="/setting"><i class="iconfont icon-shezhi"></i> 参数设置</router-link></li>
          <li><router-link to="/userlists"><i class="iconfont icon-yonghu"></i> 用户列表</router-link></li>
          <li><router-link to="/adduser"><i class="iconfont icon-tianjiayonghu"></i> 添加用户</router-link></li>
          <li><router-link to="/2"><i class="iconfont icon-piliangpingjia"></i> 批量生产用户</router-link></li>
          <li><router-link to="/2"><i class="iconfont icon-tianjia"></i> 添加项目组</router-link></li>
          <li><router-link to="/2"><i class="iconfont icon-xiangmu"></i> 项目组列表</router-link></li>
          <li><router-link to="/2"><i class="iconfont icon-tianjiatupian"></i> 添加头像</router-link></li>
          <li><router-link to="/2"><i class="iconfont icon-tupian"></i> 头像列表</router-link></li>
          <li><router-link to="/2"><i class="iconfont icon-gonggao"></i> 发布公告</router-link></li>
          <li><router-link to="/2"><i class="iconfont icon-ai-list"></i> 公告列表</router-link></li>
        </ul>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>
<style lang="scss" scoped>
.all-box {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.el-header {
    background-color: #3c4248;
    height: 60px;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    a {
        color: #ccc;
        &:hover {
            color: #fff;
        }
    }
    .t-right {
        font-size: 16px;
    }
    .t-center {
        color: #fff;
        font-weight: bold;
    }
    .t-right {
        font-size: 16px;
    }
}

.el-aside {
    background-color: #545c64;
    li {
        height: 40px;
        line-height: 40px;
        text-indent: 50px;
        position: relative;
    }
    a {
        display: block;
        font-size: 14px;
        color: #fff;
        &:hover {
            background: #484f56;
            color: #fff;
        }
        &.router-link-active {
            background: #323639;
        }
    }
}

.el-main {
    position: relative;
}
</style>

<script>
import { mapState } from 'vuex'
export default {
    name: "Index",
    computed: {
        ...mapState('index', ['title'])
    },
    beforeRouteUpdate(to, from, next) {
        this.$store.commit('index/setTitle', to.meta.title);
        next();
    }
};
</script>