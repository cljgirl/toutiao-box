/*
  全局通信
  呼叫中心
  作用：可以让任何组件之间相互通信
*/
import Vue from 'vue'

export default new Vue()

// 假设 a 组件要给 b 组件发送数据
// b 注册通信的事件
// import globalBus from '@/utils/global-bus
// globalBus.$on('自定义事件名称', (data) => {
//   // 处理函数
// })

// a 发布通信的事件
// import globalBus from '@/utils/global-bus'
// globalBus.$emit('自定义事件名称', 可选数据)

// 注意：通信两端所使用的事件名称必须保持一致，否则是无效的
// 反之，如果 b 要给 a 发送数据
// 那肯定就是 a 注册事件，b 发送数据
