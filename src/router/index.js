// createRouter：（函数）创建路由实例对象 new VueRouter()
// createWebHistory：（函数）创建 history 模式的路由 （常用的路由模式：history / hash）

import { createRouter, createWebHistory } from 'vue-router';

// 导入路由级别的组件
import BigScreen from '../views/BigScreen.vue';
import HomeView from '../views/HomeView.vue';

// {}内的东西为 路由的配置对象，返回一个当前的路由实例，使用 router 接收
const router = createRouter({
  // 指定当前的路由模式 history 模式的路由
  history: createWebHistory(import.meta.env.BASE_URL),
  // 定义路由对象
  routes: [
    {
      // path 和 commponent 是一一对应的关系
      path: '/',
      name: 'home',
      component: HomeView, // （不管用不用都会加载资源）
      redirect: '/big-screen' // 重定向
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/HomeView.vue'), // 路由的懒加载（只有访问这个路由的时候才会动态加载当前组件的所有相关资源）
    },
    // 将来做微前端接入的时候，需要匹配一个和主应用中所有路由都不一样的独一无二的路由路径
    // 所以定义了新的
    {
      path: '/big-screen',
      name: 'bigScreen',
      component: BigScreen
    }
  ],
})
// 默认导出 router，导出以后在 main.js 中导入
export default router
