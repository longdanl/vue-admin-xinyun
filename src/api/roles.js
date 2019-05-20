import request from '@/utils/request'
//查询角色
export function getRoles() {
    return request({
        url: '/api/roles',
        method: 'get'
    });
}

/*//根据id获取用户
export function getUsersById(userId) {
    return request({
        url: '/api/users/' + userId,
        method: 'get'
    })
}*/
//添加角色
export function addRoles(data) {
    return request({
        url: '/api//roles',
        method: 'post',
        data
    })
}
//修改角色信息
export function updateRoles(id,data) {
    return request({
        url:'/api/roles/'+id,
        method: 'put',
        data: data
    })
}
//删除角色,双括号是人家后台角度认为的变量
export function deleteRoles(id) {
    return request({
        url: '/api/roles/'+id,
        method: 'delete'
    })
}

//批量删除角色（传参为ids数组）
export function deleteRolesBatch(ids) {
    return request({
        url: '/api/roles/delete',
        method: 'post',
        data: ids
    })
}
