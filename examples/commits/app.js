/* global Vue */

var apiURL = 'https://api.github.com/repos/vuejs/vue/commits?per_page=3&sha='

/**
 * Actual demo
 */

const vm = new Vue({

  el: '#demo',

  data: {
    branches: ['master', 'dev'],
    currentBranch: 'master',
    commits: null
  },
  beforeCreate: function () {
    console.log('---------------------beforeCreate----------------')
  },
  created: function () {
    console.log('---------------------created----------------')
    this.fetchData()
  },
  beforeMount: function () {
    console.log('---------------------beforeMount----------------')
  },
  mounted: function () {
    console.log('---------------------mounted----------------')
  },
  beforeDestroy: function () {
    console.log('---------------------beforeDestroy----------------')
  },
  destroyed: function () {
    console.log('---------------------destroyed----------------')
  },
  beforeUpdate: function () {
    console.log('---------------------beforeUpdate----------------')
  },
  updated: function () {
    console.log('---------------------updated----------------')
  },
  activated: function () {
    console.log('---------------------activated----------------')
  },
  deactivated: function () {
    console.log('---------------------deactivated----------------')
  },

  watch: {
    currentBranch: 'fetchData'
  },

  filters: {
    truncate: function (v) {
      var newline = v.indexOf('\n')
      return newline > 0 ? v.slice(0, newline) : v
    },
    formatDate: function (v) {
      return v.replace(/T|Z/g, ' ')
    }
  },

  methods: {
    fetchData: function () {
      var self = this
      // PhantomJS 是一个基于 WebKit 的服务器端 JavaScript API，它全面支持web而不需浏览器。
      // navigator.userAgent.indexOf('PhantomJS')是判断是否在PhantomJS环境中
      if (navigator.userAgent.indexOf('PhantomJS') > -1) {
        // use mocks in e2e to avoid dependency on network / authentication
        setTimeout(function () {
          // 在e2e中使用mock以避免依赖于网络/身份验证
          self.commits = window.MOCKS[self.currentBranch]
        }, 0)
      } else {
        var xhr = new XMLHttpRequest()
        xhr.open('GET', apiURL + self.currentBranch)
        xhr.onload = function () {
          self.commits = JSON.parse(xhr.responseText)
          console.log(self.commits[0].html_url)
        }
        xhr.send()
      }
    }
  }
})
console.log(vm)