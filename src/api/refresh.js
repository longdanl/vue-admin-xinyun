import request from '../utils/request'
import qs from 'qs'
//登录
export function refresh(data) {
    return request({
        url: '/api/oauth/token',
        method: 'post',
        auth:{username:"test",password:"test"},
        data
    })
}
