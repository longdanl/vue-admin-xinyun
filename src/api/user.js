import request from '../utils/request'
import qs from 'qs'
//登录
export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    auth:{username:"omc",password:"xinyun"},
    data
  })
}

/*//获取用户信息
export function getInfo() {
  return request({
    url: '/api/users',
    method: 'get',
  })
}*/
//登出
export function logout(data) {
  return request({
    url: '/api/oauth/token',
    method: 'delete',
    data
  })
}

