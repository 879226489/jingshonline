import Cookies from 'js-cookie'
import setting from './setting'

const cookies = {
  /**
   * @description 存储 cookie 值
   * @param {String} name cookie name
   * @param {String} value cookie value
   * @param {Object} setting cookie setting
   */
  set: (name, value, cookieSetting = {}) => {
    const currentCookieSetting = {}
    Object.assign(currentCookieSetting, cookieSetting)
    Cookies.set(`${setting.cookiePrefix}-${name}`, value, currentCookieSetting)
  },
  /**
   * @description 拿到 cookie 值
   * @param {String} name cookie name
   */
  get: name => {
    return Cookies.get(`${setting.cookiePrefix}-${name}`)
  },
  /**
   * @description 拿到 cookie 全部的值
   */
  getAll: () => {
    return Cookies.get()
  },

  /**
   * @description 删除 cookie
   * @param {String} name cookie name
   */
  remove: name => {
    return Cookies.remove(`${setting.cookiePrefix}-${name}`)
  }
}

export default cookies
