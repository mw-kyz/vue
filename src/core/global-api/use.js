/* @flow */

import { toArray } from '../util/index'

// VUe.use方法就是在这定义的
export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    // 获取已经注册的插件，如不存在，初始化为空数组（同时this.installedPlugins也初始化为空数组）
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 如果已经被注册，直接中断执行，返回this
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    // 将arguments由类数组转为数组，并去除第一位，因为第一位是插件，后面接着的才是参数
    const args = toArray(arguments, 1)
    // 在参数第一位添加当前vue实例，也就是this
    args.unshift(this)
    // 如果传入的是对象，那么看是否存在install方法
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') { // 如果直接传入的是函数，那么这个函数就相当于install
      plugin.apply(null, args)
    }
    // 添加新的已注册的插件
    installedPlugins.push(plugin)
    return this
  }
}
