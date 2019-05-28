import request from '@/utils/request'
//获取文件(分页)
export function getFiles(data) {
    return request({
        url: '/api/crbt/10086/files?'+data,
        method: 'get'
    })
}
//选择彩铃文件
export function getFile() {
    return request({
        url: '/api/crbt/10086/files?page_size=999',
        method: 'get'
    })
}
//查询文件
export function getFileByMemo(data) {
    return request({
       // url: '/api/crbt/10086/files',
        url: '/api/crbt/10086/files?search='+data,
        method: 'get',
    })
}
//下载文件
export function downloadFiles(filename) {
    return request({
        url: '/api/crbt/10086/files/'+filename,
        method: 'get'
    })
}
//上传文件
export function upload(data) {
    return request({
        url: '/api/crbt/10086/files',
        contentType: false, //必须
        method: 'post',
        data
    })
}
//获取号码列表(分页)
export function getPhoneList(data) {
    return request({
        url: '/api/crbt/10086/numberbindings?'+data,
        method: 'get'
    })
}
//查询号码
export function getPhones(data) {
    return request({
        url: '/api/crbt/10086/numberbindings?search='+data,
        method: 'get',
    })
}
//添加绑定号码
export function addPhone(data) {
    return request({
        url: '/api/crbt/10086/numberbindings',
        method: 'post',
        data
    })
}
//删除用户,双括号是人家后台角度认为的变量
export function deletePhone(id) {
    return request({
        url: '/api/crbt/10086/numberbindings/'+id,
        method: 'delete'
    })
}

//批量删除用户（传参为ids数组）
export function deletePhoneBatch(ids) {
    return request({
        url: '/api/crbt/10086/numberbindings/delete',
        method: 'post',
        data: ids
    })
}
//修改信息
export function updatePhone(id,data) {
    return request({
        url:'/api/crbt/10086/numberbindings/'+id,
        method: 'put',
        data: data
    })
}
