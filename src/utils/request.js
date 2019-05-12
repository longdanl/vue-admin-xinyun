import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '../store'
import { getToken } from '../utils/auth'

const service = axios.create({
  //TODO：以后这里需要做多环境处理
  baseURL: 'http://localhost:8081',
  withCredentials: true,
  timeout: 5000
});

// request interceptor
service.interceptors.request.use(
  config => {

  /* if (store.getters.token) {
    //先读取cookies，然后设置到store中：
    config.headers['X-Token'] = getToken();
   }*/
  if (store.state.token) {
     // console.log('store.token-----'+store.state.token);
      config.headers.Authorization = `Bearer ${store.state.token}`
  }
return config
},
  error => {
    console.log(error)
    return Promise.reject(error)
  }
);


service.interceptors.response.use(

  response => {
    const res = response.data;

    console.log(res);
   // console.log(res.access_token)
    //一般接口返回的通过的code为0：
    if (res.code !== 0 &&res.access_token==="" ) {
      Message({
        message: res.message || '错误error',
        type: 'error',
        duration: 5 * 1000
      });

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      return Promise.reject(res.message || 'error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error);
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error)
  }
);
export default service
