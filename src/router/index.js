import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { getToken, setTitle, getUserId } from '@/libs/util'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes
})

const LOGIN_PAGE_NAME = 'login'

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  console.log('setPassWord')
  if (to.name === 'setPassWord') {
    next()
  } else {
    if (!token && to.name !== LOGIN_PAGE_NAME) {
      // 未登录且要跳转的页面不是登录页
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      })
    } else if (!token && to.name === LOGIN_PAGE_NAME) {
      // 未登陆且要跳转的页面是登录页
      next() // 跳转
    } else if (token && to.name === LOGIN_PAGE_NAME) {
      // 已登录且要跳转的页面是登录页
      next({
        name: homeName // 跳转到homeName页
      })
    } else {
      if (store.state.app.hasGetRouter) {
        next()
      } else {
        console.log(getUserId())
        store.dispatch('getRouters', getUserId()).then(routers => {
          // commonRoutes需要追加到路由解析最后的404，把原先的routers.js中的404删掉即可
          router.addRoutes(routers)
          next({ ...to })
        })
      }
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
