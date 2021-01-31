/*
基于 axios 封装的请求模块
*/
import axios from 'axios'
import JSONbig from 'json-bigint'

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

// 导出请求方法
export default request

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
      config.headers.Authorization =
        `Bearer ${user.token}`
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

// 谁要使用谁就加载 request 模块
// import request from 'request.js'
// request.xxx
// request({
//     method: ,
//     url: ''
// })
