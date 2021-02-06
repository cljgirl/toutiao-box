/*
基于 axios 封装的请求模块
*/
import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'

// 非组件模块可以这样加载使用 element 的 message 提示组件
import { Message } from 'element-ui'

// 创建一个 axios 实例，说白了就是复制了一个 axios
// 我们通过这个实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net', // 请求的基础路径
  // `transformRequest` 允许在向服务器发送前，修改请求数据
  transformResponse: [
    function (data) {
      // 后端返回的数据可能不是JSON格式字符串
      // 如果不是的话，那么JSONbig.parse调用会报错
      // 所以用try-catch来捕获异常，处理异常的发生
      try {
        // 如果转换成功，则直接把结果返回
        return JSONbig.parse(data)
      } catch (err) {
        // 如果转换失败了，直接进这里
        // 我们在这里将数据原封不动的直接返回给请求使用
        console.log('转换失败', err)
        return data
      }
      // axios 默认在内部使用 JSON.parse 来转换处理原始数据
      // return JSON.parse(data)
    }
  ]
})

// 请求拦截器
request.interceptors.request.use(
  // 任何所有的请求都会经过这里
  // config 是当前请求相关的配置信息
  // config 是可以修改的
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // 如果有登录用户信息，则统一设置 token
    if (user) {
      // `Bearer ${user.token}` 字符串拼接
      // 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDIzMTg2NTEsInVzZXJfaWQiOjEsInJlZnJlc2giOmZhbHNlLCJ2ZXJpZmllZCI6dHJ1ZX0.VwVsL34emQ_xTPwXTeBd-LIuasZuy5m7v778X9vG2UA'
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 然后我们就可以在允许请求出去之前定制统一业务功能处理
    // 例如：统一设置token

    // 当这里 return config 之后请求在真正的发出去
    return config
  },
  // 请求失败，会经过这里
  function (error) {
    return Promise.reject(error)
  }
)
// 响应拦截器
request.interceptors.response.use(
  function (response) {
    // 任何处于2xx范围内的状态代码都会导致该函数触发
    // 使用响应数据
    return response
  },
  function (error) {
    // 任何超出此范围的状态代码的2XX原因此功能可触发
    // 做一些与响应错误

    const { status } = error.response
    // 任何超出 2xx 的响应码都会进入这里
    if (status === 401) {
      // 跳转到登录页面
      // 清除本地存储中的用户登录状态
      window.localStorage.removeItem('user')
      router.push('/login')
      Message.error('登录状态无效，请重新登录')
    } else if (status === 403) {
      // token 未携带或已过期
      Message({
        type: 'warning',
        message: '没有操作权限'
      })
    } else if (status === 400) {
      // 客户端参数错误
      Message.error('参数错误，请检查请求参数')
    } else if (status >= 500) {
      Message.error('服务端内部异常，请稍后重试')
    }
    console.log('状态码异常')
    return Promise.reject(error)
  }
)

// 导出请求方方法
export default request
// 谁要使用谁就加载 request 模块
// import request from 'request.js'
// request.xxx
// request({
//     method: ,
//     url: ''
// })
