/* @flow */

import config from 'core/config'
import { warn, cached } from 'core/util/index'
import { mark, measure } from 'core/util/perf'

import Vue from './runtime/index'
import { query } from './util/index'
import { compileToFunctions } from './compiler/index'
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from './util/compat'

const idToTemplate = cached(id => {
  // 通过ID获取DOM元素（使用querySelector方法）
  const el = query(id)
  return el && el.innerHTML
})

// 缓存原型上的$mount方法
const mount = Vue.prototype.$mount
// 重新定义原型上的$mount方法
Vue.prototype.$mount = function (
  el?: string | Element, // 可以是字符串或者元素节点
  hydrating?: boolean // 
): Component {
  el = el && query(el)
  /* istanbul ignore if */
  // 如果el为body或者html标签，则抛出警告
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }
  // 缓存配置项
  const options = this.$options
  // resolve template/el and convert to render function
  // 解析 模板/el 并转换为渲染函数
  // 如果配置项中没有定义 render 方法，则会把 el 或者 template 字符串转换成 render 方法
  if (!options.render) {
    // 缓存模板
    let template = options.template
    if (template) {
      // 如果模板为字符串
      if (typeof template === 'string') {
        // 如果字符串以#开头，说明传入的是id,
        // 还有一种情况，就是template='<div>...</div>'，
        // 这种template直接就是html模板的，则不需要做处理,直接交到后面处理成render
        if (template.charAt(0) === '#') {
          // 通过id获取dom元素，并返回元素的innerHTML
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) { // 如果存在nodeType属性，说明是dom元素
        // 保存元素的innerHTML
        template = template.innerHTML
      } else { // 如果既不是字符串，也不是dom元素，则抛出警告
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      // 返回el元素的outerHTML
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }
      // compileToFunctions方法的源是在src\compiler\to-function.js
      const { render, staticRenderFns } = compileToFunctions(template, {
        outputSourceRange: process.env.NODE_ENV !== 'production',
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML (el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    const container = document.createElement('div')
    container.appendChild(el.cloneNode(true))
    return container.innerHTML
  }
}

Vue.compile = compileToFunctions

export default Vue
