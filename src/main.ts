import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 提前发起身份恢复；路由守卫与页面共享同一个去重后的 Promise。
useAuthStore().restore()

app.mount('#app')
