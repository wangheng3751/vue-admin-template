import Mock from 'mockjs'

const baseContent = '<p>我是测试数据我是测试数据</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 10)',
    content_short: '做人，无需去羡慕别人，也无需去花时间去羡慕别人是如何成功的，想的只要是自己如何能战胜自己，如何变得比昨天的自己强大就行。自己的磨练和坚持，加上自己的智慧和勤劳，会成功的。终将变成石佛那样受到成长的尊敬',
    content: baseContent,
    'status|1': ['published', 'draft', 'deleted'],
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    image_uri,
  }]
})

export default [
  {
    url: '/article/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
