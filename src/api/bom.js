// src/api/bom.js
import request from '@/utils/request'
import api from './api'

// 注意，这里根据接口文档，getRoot、getChildren用POST
// 并且删除请求使用data传递

// 获取BOM树根节点
export function getRoot(partId = 0) {
  return request.post(api.bomRoot, { partId })
}

// 获取指定节点的子节点列表
export function getChildren(sourceId) {
  return request.post(api.bomChildren, { sourceId })
}

// 新增BOM关联关系
export function createBomLink(data) {
  return request.post(api.bomCreate, data)
}

// 修改BOM关联关系
export function updateBomLink(data) {
  return request.put(api.bomUpdate, data)
}

// 删除BOM关联关系
export function deleteBomLink(bomLinkId) {
  return request.delete(api.bomDelete, { data: { bomLinkId } })
}
