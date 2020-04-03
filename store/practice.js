import * as Practice from '@/api/dictionaries/practice'
export const state = () => ({
  PracticeTreeData: [],
  lawsuitTreeData: [],
  nolawsuitTreeData: []
})

export const mutations = {
  SET_PRACTICE_TREE_DATA: (state, data) => {
    state.PracticeTreeData = data
  },
  SET_LAWSUIT_TREE_DATA: (state, data) => {
    state.lawsuitTreeData = data
  },
  SET_NOLAWSUIT_TREE_DATA: (state, data) => {
    state.nolawsuitTreeData = data
  }
}

export const actions = {
  /**
  * 获取领域数据
  * @param {commit} param0
  * @param {object} query
  */
  getPracticeTreeData({ commit }, query) {
    return new Promise((resolve, reject) => {
      Practice.getTree(query)
        .then(response => {
          const { data } = response
          commit('SET_PRACTICE_TREE_DATA', data)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  /**
  * 根据type获取领域数据
  * @param {commit} commit
  * @param {number} type
  */
  getPracticeTreeDataOfType({ commit }, type) {
    return new Promise((resolve, reject) => {
      Practice.getTreeOfType(type)
        .then(response => {
          const { data } = response
          type === 1 ? commit('SET_LAWSUIT_TREE_DATA', data) : commit('SET_NOLAWSUIT_TREE_DATA', data)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  /**
  * 获取领域详情
  * @param {commit} param0
  * @param {number} id
  */
  getPracticeInfo({ commit }, id) {
    return new Promise((resolve, reject) => {
      Practice.getInfo(id)
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
