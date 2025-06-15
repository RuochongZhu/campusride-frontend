import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RideshareView from '@/views/RideshareView.vue'
import ActivitiesView from '@/views/ActivitiesView.vue'
import MarketplaceView from '@/views/MarketplaceView.vue'
import LeaderboardView from '@/views/LeaderboardView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { 
      requiresAuth: true,
      title: 'CampusRide - Campus Transportation & Community'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { 
      requiresAuth: false,
      title: 'Login - CampusRide',
      hideNavigation: true
    }
  },
  {
    path: '/rideshare',
    name: 'Rideshare',
    component: RideshareView,
    meta: { 
      requiresAuth: true,
      title: 'Rideshare - CampusRide'
    }
  },
  {
    path: '/activities',
    name: 'Activities',
    component: ActivitiesView,
    meta: { 
      requiresAuth: true,
      title: 'Campus Activities - CampusRide'
    }
  },
  {
    path: '/marketplace',
    name: 'Marketplace',
    component: MarketplaceView,
    meta: { 
      requiresAuth: true,
      title: 'Campus Marketplace - CampusRide'
    }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: LeaderboardView,
    meta: { 
      requiresAuth: true,
      title: 'Leaderboard - CampusRide'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'CampusRide'
  
  const requiresAuth = to.meta.requiresAuth
  const isAuthenticated = checkAuthStatus()
  
  if (requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

function checkAuthStatus() {
  // 简化版认证检查，你可以后续完善
  const token = localStorage.getItem('userToken')
  return !!token
}

export default router
