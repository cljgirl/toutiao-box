import Mock from 'mockjs'

// const data = Mock.mock({
//   'string|4': '哎呦！'
// })

// const data = Mock.mock({
//   'string|1-9': '哎呦！'
// })

// const data = Mock.mock({
//   string: '@cword()'
// })

// const data = Mock.mock({
//   str: '@cword(3)',
//   string: '@cword(3,10)'
// })
// const data = Mock.mock({
//   title: '@ctitle',
//   sentence: '@csentence()'
// })
// const data = Mock.mock({
//   paragraph: '@cparagraph'
// })
// const data = Mock.mock({
//   id: '@increment'
// })
// const data = Mock.mock({
//   idCard: '@id()',
//   name: '@cname()',
//   address: '@city(false)'
// })
// const data = Mock.mock({
//   img_url: "@image('200x100', '#ffcc33', '#FFF', 'png', '哈哈')"
// })
// const data = Mock.mock({
//   'list|10-15': [
//     {
//       name: '@cname()',
//       address: '@city(true)',
//       id: '@increment()'
//     }
//   ]
// })
Mock.mock(
  'http://api-toutiao-web.itheima.net/app/v1_0/authorizations',
  'post',
  {
    status: 201,
    msg: '登录成功hahhah '
  }
)
