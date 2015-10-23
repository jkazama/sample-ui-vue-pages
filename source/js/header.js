// Header
import Param from 'variables'
import * as Lib from 'platform/plain'
import * as Option from "platform/vue-option"
export default new Vue(new Option.ComponentBuilder({
  el: ".l-nav-header",
  data: {
    logined: false
  },
  created: function() {
    this.initialized()
    this.checkLogin(() => this.logined = true)
  },
  methods: {
    checkLogin: function(success) {
      let failure = (err) => {
        Lib.Log.debug('ログイン情報を確認できませんでした')
        location.href = "/timeout.html"
      }
      Lib.Ajax.get(`${Param.Api.root}/account/loginStatus`, {}, success, failure)
    },
    logout: function(e) {
      e.preventDefault()
      this.logined = false
      this.logoutSession()
      this.apiPost('/logout', {}, ((v) => true), ((e)=> false))
      Lib.Log.debug('ログアウトしました')
      location.href = "/login.html"
    }
  }
}).build())
