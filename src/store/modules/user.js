import { login, logout} from '../../api/user'
import { getToken, setToken, removeToken } from '../../utils/auth'
import router, { resetRouter } from '../../router'
import qs from "qs"

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
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
 /* SET_USER: (state, user) => {
    state.user = user
  },*/
  /*SET_ID: (state, id) => {
    state.id = id
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
        console.log('登录成功');
        let { code,access_token,refresh_token,token_type,scope,expires_in } = response;
        let user = {username,access_token:access_token,token_type:token_type,refresh_token:refresh_token,expires_in:expires_in,scope:scope};
        sessionStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('refresh_token',JSON.stringify(refresh_token));
        commit('SET_TOKEN', access_token);
        commit('SET_USERNAME', username);
        setToken(access_token);
        resolve();
      }).catch(error => {
        console.log('登录错误');
        reject(error)
      })
    })
  },
  // 登出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      console.log("state"+state.token);
      logout(qs.stringify({"access_token":state.token})).then(() => {
        console.log('注销好了'+state.token);
        commit('SET_TOKEN', '');
        console.log('token-----'+state.token);
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
