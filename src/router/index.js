import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue' // 确保路径正确
import Register from '../views/Register.vue'
import CategoryManagement from '@/views/CategoryManagement.vue'

const routes = [
  {
    path: '/',
    redirect: '/login' // 关键！强制跳转到登录页
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },

  {
    path: '/category',
    name: 'CategoryManagement',
    component: CategoryManagement
  }


  // 其他路由暂时注释掉
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router