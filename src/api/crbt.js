import request from '@/utils/request'
//获取文件
export function getFiles() {
    return request({
        url: '/api/crbt/10086/files',
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
