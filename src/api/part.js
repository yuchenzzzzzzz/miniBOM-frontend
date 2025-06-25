// src/api/part.js
import request from '@/utils/request'
import api from './api.js'  // api.js中需定义路径

// 新增零件
export function createPart(data) {
  return request.post(api.partCreate, data)
}

// 查询零件列表
export function getPartList(params) {
  return request.get(api.partList, { params })
}

// 获取零件详情
export function getPartDetail(id) {
  return request.get(`${api.partDetail}/${id}`)
}

// 更新零件
export function updatePart(data) {
  return request.post(api.partUpdate, data)
}

// 删除零件
export function deletePart(id) {
  return request.delete(`${api.partDelete}/${id}`)
}
