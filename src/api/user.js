import request from '../utils/request'
//登录
export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    auth:{username:"omc",password:"xinyun"},
    data
  });
}
//登出
export function logout(data) {
  return request({
    url: '/api/oauth/token?'+data,
    method: 'delete',
    auth:{username:"omc",password:"xinyun"},
  })
}

