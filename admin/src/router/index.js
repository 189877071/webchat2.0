import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: () => import('@/containers/Index'),
      redirect: '/index',
      beforeEnter(to, form, next) {
        store.commit('index/setTitle', to.meta.title);
        next();
      },
      children: [
        {
          path: 'index',
          name: 'Home',
          component: () => import('@/containers/Home'),
          meta: { title: '首页' }
        },
        {
          path: 'setting',
          name: 'Setting',
          component: () => import('@/containers/Setting'),
          meta: { title: '参数设置' }
        },
        {
          path: '/userlists',
          name: 'UserLists',
          component: () => import('@/containers/UserLists'),
          meta: { title: '用户列表' }
        },
        {
          path: '/adduser',
          name: 'AddUser',
          component: () => import('@/containers/AddUser'),
          meta: { title: '添加用户' }
        },
        {
          path: '/updateuser/:id',
          name: 'UpdateUser',
          component: () => import('@/containers/UpdateUser'),
          meta: { title: '修改用户信息' }
        },
        {
          path: '/testusers',
          name: 'TestUsers',
          component: () => import('@/containers/TestUsers'),
          meta: { title: '添加测试用户' }
        },
        {
          path: '/group',
          name: 'Group',
          component: () => import('@/containers/Group'),
          meta: { title: '分组设置' }
        },
        {
          path: '/addheadphoto',
          name: 'AddHeadPhoto',
          component: () => import('@/containers/AddHeadPhoto'),
          meta: { title: '添加头像' }
        },
        {
          path: '/addnotice',
          name: 'AddNotice',
          component: () => import('@/containers/AddNotice'),
          meta: { title: '发布公告' }
        },
        {
          path: '/noticelist',
          name: 'NoticeList',
          component: () => import('@/containers/NoticeList'),
          meta: { title: '公告列表' }
        },
        {
          path: '/updatanotice/:id',
          name: 'UpdateNotice',
          component: () => import('@/containers/UpdateNotice'),
          meta: { title: '修改公告', update: true }
        }
      ]
    },
    {
      path: '/login',
      name: '登录',
      component: () => import('@/containers/Login')
    }
  ]
})
