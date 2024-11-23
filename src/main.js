import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/common.scss'

const app = createApp(App)

// 路由注册，相当于之前的 Vue.use(router)
app.use(router)

app.mount('#app')
