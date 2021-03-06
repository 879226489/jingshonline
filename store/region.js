import * as Region from '@/api/dictionaries/region'
import utils from '@/utils'
export const state = () => ({
  // token: cookie.get('token'),
  regionTreeData: [],
  regionTreeDataForAntd: []
})

export const mutations = {
  REGION_DATA(state, value) {
    utils.filterAttributes({ data: value })
    state.regionTreeData = value
    state.regionTreeDataForAntd = utils.formatTreeDataForAntd(value)
  }
}

export const actions = {
  /**
   * 获取地区数据
   * @param {commit} param0
   * @param {object} query
   */
  async getRegionTreeData({ commit }, query) {
    return new Promise((resolve, reject) => {
      Region.getTree(query).then(response => {
        const { data } = response
        commit('REGION_DATA', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  /**
   * 获取地区详情
   * @param {commit} param0
   * @param {number} id
   */
  getRegionInfo({ commit }, id) {
    return new Promise((resolve, reject) => {
      Region.getInfo(id).then(response => {
        const { data } = response
        resolve(data)
      })
        .catch(error => {
          reject(error)
        })
    })
  },
  /**
   * 根据法院等级获取法院法院所有的地区信息
   * @param {commit} param0
   * @param {object} courtLevel
   */
  async getCourtRegionsData({ commit }, courtLevel) {
    return new Promise((resolve, reject) => {
      Region.getCourtRegions(courtLevel).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  /**
   * 根据法院等级获取法院法院获取该某个地区区域的子节点
   * @param {commit} param0
   * @param {object} courtLevel
   */
  async getCourtRegionsChildData({ commit }, courtLevel) {
    return new Promise((resolve, reject) => {
      Region.getCourtRegionsChild(courtLevel).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
