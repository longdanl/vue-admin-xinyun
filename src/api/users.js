import request from '@/utils/request'

/*export function getRoutes() {
    return request({
        url: '/routes',
        method: 'get'
    })
}*/
//获取用户
export function getUsers() {
    return request({
        url: '/api/users',
        method: 'get'
    })
}

//根据id获取用户
export function getUsersById(userId) {
    return request({
        url: '/api/users/' + userId,
        method: 'get'
    })
}
//添加用户
export function addUsers(data) {
    return request({
        url: '/api/users',
        method: 'post',
        data
    })
}
//修改用户信息
export function updateUsers(data) {
    console.log(data.id + "--point2");
    return request({
        url:'/api/users/'+data.id,
        method: 'put',
        data: data
    })
}
//删除用户,双括号是人家后台角度认为的变量
export function deleteUsers(id) {
    return request({
        url: '/api/users/'+id,
        method: 'delete'
    })
}

//批量删除用户（传参为ids数组）
export function deleteUsersBatch(ids) {
    return request({
        url: '/api/users/delete',
        method: 'post',
        data: ids
    })
}
