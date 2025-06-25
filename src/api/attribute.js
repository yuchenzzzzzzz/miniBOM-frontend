// src/api/attribute.js
import request from '@/utils/request'
import api from './api.js'  // api.js中需定义路径

// 新增属性
export function createAttribute(data) {
  return request.post(api.attributeCreate, data)
}

// 查询属性列表
export function getAttributeList(params) {
  return request.get(api.attributeList, { params })
}

// 更新属性
export function updateAttribute(data) {
  return request.post(api.attributeUpdate, data)
}

// 删除属性
export function deleteAttribute(id) {
  return request.delete(`${api.attributeDelete}/${id}`)
}