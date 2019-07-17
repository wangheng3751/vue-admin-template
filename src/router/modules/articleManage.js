import Layout from '@/layout'

const articleManageRouter = {
  path: '/article',
  component: Layout,
  redirect: '/article/list',
  name: 'ArticleManage',
  meta: {
    title: '文章管理',
    icon: 'form'
  },
  children: [
    {
      path: 'edit/:id(\\d+)',
      component: () => import('@/views/article/edit'),
      name: 'ArticleEdit',
      hidden: true,
      meta: { title: '文章编辑' ,icon: 'edit'}
    },
    {
        path: 'create',
        component: () => import('@/views/article/create'),
        name: 'ArticleCreate',
        meta: { title: '新建文章' ,icon: 'edit'}
    },
    {
        path: 'list',
        component: () => import('@/views/article/list'),
        name: 'ArticleList',
        meta: { title: '文章列表',icon: 'list' }
    },
    {
      path: 'column',
      component: () => import('@/views/article/column'),
      name: 'ArticleColumn',
      meta: { title: '文章分类',icon: 'list' }
  }
  ]
}
export default articleManageRouter
