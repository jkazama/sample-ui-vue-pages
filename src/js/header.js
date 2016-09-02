/*----------------------------------
 - header.js -
 ページヘッダ部のモジュール
 ----------------------------------*/

// Header
import * as Lib from 'platform/plain'
import ViewBasic from "views/mixins/view-basic"
const header = new Vue({
  el: '.l-nav-header',
  mixins: [ViewBasic],
  data() {
    return {
      logined: false
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
      this.apiGet('/account/loginStatus', {}, success, failure)
    },
    logout(e) {
      this.logined = false
      this.logoutSession()
      this.apiPost('/logout', {}, ((v) => true), ((e)=> false))
      Lib.Log.debug('ログアウトしました')
      location.href = "/login.html"
    }
  }
})
export {header}