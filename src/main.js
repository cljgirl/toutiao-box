/*
 * 项目的启动入口
 */

import Vue from 'vue'
import App from './App.vue' // 根组件
import router from './router'

// 关闭生产环境提示
Vue.config.productionTip = false

// 创建 Vue 根实例
// 把 router 配置到根实例中
// 通过 render 方法把 App 根组件渲染到 #app 入口节点
new Vue({
  router,
  render: h => h(App)
  // el: '#app' // 等价于 $mount('#app')
}).$mount('#app')