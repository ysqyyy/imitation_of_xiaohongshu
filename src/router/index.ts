import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/my-recommend',
      name: 'my-recommend',
      component: () => import('../views/MyRecommendView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/myhome',
      name: 'myhome',
      component: () => import('../views/MyHomeView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue'),
    },
    {
      path: '/user/:id',
      name: 'user',
      component: () => import('../views/UserView.vue'),
    },
  ],
})

// 路由守卫 - 检查登录状态
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 动态导入auth工具，避免循环依赖
    import('@/utils/auth').then(({ auth }) => {
      if (!auth.isLoggedIn()) {
        // 用户未登录，跳转到首页
        next({ name: 'home' })
      } else {
        next()
      }
    })
  } else {
    next()
  }
})

export default router
