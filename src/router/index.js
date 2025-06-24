import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'; 
import Register from '@/views/Register.vue'; 
import AttributeManager from '@/views/AttributeManager.vue'
import Part from '@/views/Part.vue'
import Home from '@/views/Home.vue'
import CategoryManagement from '@/views/CategoryManagement.vue'
import BOM from '@/views/BOM.vue'
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/attributemanager', name: 'AttributeManager', component: AttributeManager }, 
  { path: '/part',name: 'Part',component: Part},
  { path: '/home',name: 'Home',component: Home},
  { path: '/categorymanagement',name: 'CategoryManagement',component: CategoryManagement} ,
  { path: '/bom', name: 'BOM',component:BOM}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token')
//   if (!token && to.path !== '/login') {
//     next('/login') // 未登录就强制跳转登录
//   } else {
//     next()
//   }
// })


export default router;