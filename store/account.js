import * as account from '@/api/account'
import cookie from '@/plugins/cookie'

export const state = () => ({
  token: cookie.get('token'),
  name: '',
  realName: '',
  avatar: '',
  introduction: '',
  roles: [],
  lawyerInfo: {}
})
export const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },

  SET_NAME: (state, name) => {
    state.name = name
  },

  SET_REAL_NAME: (state, realName) => {
    state.realName = realName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_LAWYER_INFO: (state, lawyerInfo) => {
    state.lawyerInfo = lawyerInfo
  }
}
export const actions = {
  // user login
  Login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      account
        .login(userInfo)
        .then(response => {
          const { data } = response
          commit('SET_TOKEN', data)
          cookie.set('token', data)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  /**
          * user register
          * @param {commit} commit
          * @param {object} register
          */
  Register({ commit }, register) {
    return new Promise((resolve, reject) => {
      account
        .register(register)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  /**
          * user logout
          * @param {*} param0
          */
  Logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_NAME', '')
      commit('SET_REAL_NAME', '')
      commit('SET_AVATAR', '')
      cookie.remove('token') // 移除token
      // resetRouter() // 重置路由
      resolve()
    })
  },

  // get user info
  GetLoginUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      account
        .getLoginUserInfo()
        .then(response => {
          const { data } = response
          if (!data) {
            reject('获取登录用户信息失败,请重新登录')
          }
          const { userName, realName, avatar } = data
          commit('SET_TOKEN', cookie.get('token'))
          commit('SET_NAME', userName)
          commit('SET_REAL_NAME', realName)
          commit('SET_AVATAR', avatar)
          commit('SET_LAWYER_INFO', data)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  ResetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      cookie.remove()
      resolve()
    })
  },
  /**
  * 修改密码
  * @param {commit} commit
  * @param {boject} changePasswordData
  */
  ChangePassWord({ commit }, changePasswordData) {
    return new Promise((resolve, reject) => {
      account
        .ChangePassword(changePasswordData)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  /**
  * 修改邮箱
  * @param {commit} commit
  * @param {boject} ChangeEmailData
  */
  ChangeEmail({ commit }, ChangeEmailData) {
    return new Promise((resolve, reject) => {
      account
        .ChangeEmail(ChangeEmailData)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  /**
  * 修改手机号
  * @param {commit} commit
  * @param {boject} ChangePhoneData
  */
  ChangePhone({ commit }, ChangePhoneData) {
    return new Promise((resolve, reject) => {
      account
        .ChangePhone(ChangePhoneData)
        .then(response => {
          const { data } = response
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
