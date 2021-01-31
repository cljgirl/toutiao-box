/*
 * 项目的启动入口
 */

import Vue from 'vue'
import App from './App.vue' // 根组件
import router from './router'
// import './mock/index'
import Router from 'vue-router'

// 加载 element 组件库
import ElementUI from 'element-ui'

// 加载 element 组件库的样式
import 'element-ui/lib/theme-chalk/index.css'

// 加载全局样式文件
import './styles/index.less'

// 若是没有开启Devtools工具，在开发环境中开启，在生产环境中关闭
if (process.env.NODE_ENV === 'development') {
  Vue.config.devtools = true
} else {
  Vue.config.devtools = false
}

// 全局注册element组件
Vue.use(ElementUI)

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

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
