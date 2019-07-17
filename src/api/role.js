import request from '@/utils/request';

export function fetchList(query) {
    return request({
      url: '/role/list',
      method: 'get',
      params: query
    })
  }
  
  export function fetchRole(id) {
    return request({
      url: '/role/detail',
      method: 'get',
      params: { id }
    })
  }
  
  export function createRole(data) {
    return request({
      url: '/role/create',
      method: 'post',
      data
    })
  }
  
  export function updateRole(data) {
    return request({
      url: '/role/update',
      method: 'post',
      data
    })
  }