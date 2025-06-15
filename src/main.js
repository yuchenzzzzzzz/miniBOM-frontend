import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // 确保路径匹配你的路由文件

const app = createApp(App)
app.use(router)               // 必须调用use(router)
app.mount('#app')

