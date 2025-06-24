// src/api/category.js
import request from '@/utils/request'
import api from './api'  // api.js中需定义路径

// 获取分类列表
export function getCategoryList() {
  return request.get(api.categoryList) // 这里假设在 api.js 定义了 categoryList = '/miniBOM/category/list'
}

// 新增分类
export function createCategory(data) {
  return request.post(api.categoryCreate, data)
}

// 编辑分类
export function updateCategory(data) {
  return request.put(api.categoryUpdate, data)
}

// 删除分类
export function deleteCategory(code) {
  return request.delete(api.categoryDelete, { params: { code } })
}
