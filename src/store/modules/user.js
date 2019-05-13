import { login, logout, getUsers,getUsersId,addUser,editUsers,deleteUsers,deleteUsersIds } from '../../api/user'
import { getToken, setToken, removeToken } from '../../utils/auth'
import router, { resetRouter } from '../../router'

const state = {
  token: getToken(),
  id: '',
  username: '',
  email: '',
  phone: '',
  active: '',
  users: []
};
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
    //console.log('state.token哈哈'+state.token)
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  /*SET_ID: (state, id) => {
    state.id = id
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_ACTIVE: (state, active) => {
    state.active = active
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_USERS: (state, users) => {
    state.users = users
  }*/
};
const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username, password: password }).then(response => {
        console.log('登录好了')
        console.log('2552255'+response.data);
        let { code,access_token,refresh_token,token_type,scope,expires_in } = response;
        let user = {access_token:access_token,token_type:token_type,refresh_token:refresh_token,expires_in:expires_in,scope:scope};
        sessionStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('refresh_token',JSON.stringify(refresh_token));
        commit('SET_TOKEN', access_token);
        setToken(access_token);
        resolve();
      }).catch(error => {
        console.log('登录错误');
        reject(error)
      })
    })
  },
/* //添加用户
  addUser({ commit, state }) {
    return new Promise((resolve, reject) => {
      addUser(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data;

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles);
        commit('SET_NAME', name);
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction);
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //用户查询id
  getUsersId({ commit, state },userInfo) {
    const { id } = userInfo;
    return new Promise((resolve, reject) => {
      getUsersId(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { id, username, active, user_lable } = data.list
        const { total,code } = data
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },*/
  /*//获取用户
  getUsers({ commit},username) {
    return new Promise((resolve, reject) => {
      getUsers(username).then(response => {
        const { list,total,code,description } = response
        const users = list;
        if (code === !0) {
          reject('请求失败');
          this.$message({
            message:description,
            type:'success'
          })
        }
        if (!username || username.length <= 0) {
          reject('暂无数据');
          this.$message({
            message:description,
            type:'success'
          })
        }
        for(i=0;i<users.length;i++){
          let user = users[i];
          commit('SET_USER', user);
         /!* let username = users[i].username;
          let id = users[i].id;
          let active = users[i].active;
          let phone = users[i].phone;
          let email = users[i].email;*!/
         /!* commit('SET_ID', id);
          commit('SET_USERNAME', username);
          commit('SET_ACTIVE', active);
          commit('SET_PHONE', phone);
          commit('SET_EMAIL', email);
          commit('SET_USERS', users);*!/
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },*/

  // 登出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        console.log('注销好了'+state.token);
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        removeToken();
        resetRouter();
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  /*// remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // Dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }*/
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
