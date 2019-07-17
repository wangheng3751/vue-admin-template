import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/article-category/list',
    method: 'get',
    params: query
  })
}

export function fetchArticleCategory(id) {
  return request({
    url: '/article-category/get',
    method: 'get',
    params: { id }
  })
}

export function createArticleCategory(data) {
  return request({
    url: '/article-category/create',
    method: 'post',
    data
  })
}

export function updateArticleCategory(data) {
  return request({
    url: '/article-category/update',
    method: 'post',
    data
  })
}

export function deleteArticleCategory(id) {
  return request({
    url: '/article-category/delete',
    method: 'get',
    params: { id }
  })
}
