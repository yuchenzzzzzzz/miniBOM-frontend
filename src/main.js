import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // 确保路径匹配你的路由文件
import axios from 'axios'


axios.defaults.baseURL = 'http://localhost:8080'

// 添加响应拦截器（处理 401 未授权）
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // 清空 token，跳转到登录页
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)
app.use(router)               // 必须调用use(router)
app.mount('#app')


