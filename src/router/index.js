import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Jmxs from '../components/jmxs/Jmxs.vue'
import Tasks from '../components/tasks/Tasks.vue'
import Flows from '../components/tasks/Flows.vue'
import editJmx from '../components/jmxs/editJmx.vue'
import Params from '../components/params/Params'
import cookie from 'js-cookie'

Vue.use(VueRouter)

// path的前后注意要有空格，严格注意空格问题
const routes = [
  // path表示监听的地址
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登陆'
    }
  },
  // children:子路由,component：组件
  // redirect重定向，访问home时，就访问子路由welcome
  {
    path: '/home',
    component: Home,
    redirect: 'jmxs',
    children: [
      {
        // 暂时没想好主页，先不跳转到welcome
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/jmxs',
        component: Jmxs,
        name: 'jmxs',
        meta: {
          title: 'JMX列表'
        }
      },
      {
        path: '/jmxs/edit',
        component: editJmx,
        name: 'editJmx'
      },
      {
        path: '/tasks',
        component: Tasks,
        meta: {
          title: '任务列表'
        }
      },
      {
        path: '/tasks/flows',
        component: Flows,
        meta: {
          title: '流水列表'
        }
      },
      {
        path: '/params',
        component: Params,
        meta: {
          title: '全局参数'
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 解决重复点击路由报错的问题，单重复点击报的错不影响功能的使用
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next('/login') 强制跳转

  // 访问登陆页面直接放行
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
  if (to.path === '/login') return next()
  // 从cookie中获取token
  const tokenStr = cookie.get('token')
  // 没有token，强制跳转到登陆页面
  if (!tokenStr) return next('/login')
  next()
})

export default router
