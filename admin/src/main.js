// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import './assets/ueditor/ueditor.config'
// import './assets/ueditor/ueditor.all'
// import './assets/ueditor/lang/zh-cn/zh-cn'
// import './assets/ueditor/ueditor.parse.min'

import './common.css'
import './ElementUi'
import Vue from 'vue'
import store from './store'
import App from './App'
import router from './router'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
