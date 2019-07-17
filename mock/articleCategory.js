import Mock from 'mockjs'


const data = Mock.mock({
  'items|30': [{
    id: '@id',
    name:"系统管理员",
    desc:"系统管理员,可管理整个系统",
    created_at: '@datetime',
    'status|1': ['published', 'draft', 'deleted']
  }]
})

export default [
  {
    url: '/article-category/list',
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
