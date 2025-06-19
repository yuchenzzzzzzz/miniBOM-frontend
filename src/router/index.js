import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue' // 确保路径正确
import Register from '../views/Register.vue'
import CategoryList from '../views/Category/CategoryList.vue'
import CategoryAdd from '../views/Category/CategoryAdd.vue'
import CategoryEdit from '../views/Category/CategoryEdit.vue'

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
    name: 'CategoryList',
    component: CategoryList
  },
  {
    path: '/category/add',
    name: 'CategoryAdd',
    component: CategoryAdd
  },
  {
    path: '/category/edit/:id',
    name: 'CategoryEdit',
    component: CategoryEdit,
    props: true
  }

  // 其他路由暂时注释掉
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router