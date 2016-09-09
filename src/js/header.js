/*----------------------------------
 - header.js -
 ページヘッダ部のモジュール
 ----------------------------------*/

// Header
import * as Lib from 'platform/plain'
import ViewBasic from "views/mixins/view-basic"
import api from "api/context"
const header = new Vue({
  el: '.l-nav-header',
  mixins: [ViewBasic],
  data() {
    return {
      logined: false
    }
  },
  computed: {
    user() {
      return this.sessionValue() 
    }
  },
  beforeMount() {
    this.checkLogin(() => this.logined = true)
  },
  methods: {
    checkLogin(success) {
      let failure = (err) => {
        Lib.Log.debug('ログイン情報を確認できませんでした')
        this.logined = false
        if (this.sessionValue()) {
          this.logoutSession()
          location.href = "/timeout.html"
        } else {
          location.href = "/login.html"
        }
      }
      api.loginStatus(success, failure)
    },
    logout(e) {
      this.logined = false
      this.logoutSession()
      api.logout()
      Lib.Log.debug('ログアウトしました')
      location.href = "/login.html"
    }
  }
})
export {header}