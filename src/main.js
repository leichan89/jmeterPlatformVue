import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'
// 配置请求的根路径
import global_ from './config/global.js'
import cookie from 'js-cookie'

Vue.prototype.GLOBAL = global_
axios.defaults.baseURL = global_.BASE_URL
axios.interceptors.request.use(config => {
  config.headers.Authorization = cookie.get('token')
  // 在最后必须return config
  return config
})

// 将axios挂载到Vue的原型对象上，这样每个Vue组件都可以直接通过this访问到$http，从而发起ajax请求
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
