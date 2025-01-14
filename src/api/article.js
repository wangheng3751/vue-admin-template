import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/article/list',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/view',
    method: 'get',
    params: { id }
  })
}

export function deleteArticle(id) {
  return request({
    url: '/article/delete',
    method: 'get',
    params: { id }
  })
}

export function createArticle(data) {
  return request({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/update',
    method: 'post',
    data
  })
}

export function fetchCategoryList(query) {
  return request({
    url: '/article-category/list',
    method: 'get'
  })
}
