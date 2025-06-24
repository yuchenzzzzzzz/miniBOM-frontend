// src/api/user.js
import request from '@/utils/request'
import api from './api'
import md5 from 'blueimp-md5'

// 登录
export function loginApi({ username, password }) {
  return request.post(api.login, {
    username,
    password: md5(password)
  })
}

// 修改密码
export function updatePwdApi({ oldPassword, newPassword, confirmPassword }) {
  return request.post(api.updatePwd, {
    old_pwd: md5(oldPassword),
    new_pwd: md5(newPassword),
    re_pwd: md5(confirmPassword)
  }, {
    headers: {
      Authorization: localStorage.getItem('token')
    }
  })
}

// 注册
export function registerApi({ username, password, email, phoneNumber }) {
  return request.post(api.register, {
    username,
    password: md5(password),
    email: email || null,
    phoneNumber: phoneNumber || null
  })
}