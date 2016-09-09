/*----------------------------------
 - login.js -
 ----------------------------------*/

// Common
import "common"

// Page ViewModel
import {Level} from "constants"
import * as Lib from "platform/plain"
import ViewBasic from "views/mixins/view-basic"
import api from "api/context"
const app = new Vue({
  mixins: [ViewBasic],
  data() {
    return {
      loginId: "",
      password: "",
      updating: false
    }
  },
  methods: {
    login() {
      Lib.Log.debug(this.loginId)
      this.updating = true
      let success = (ret) => {
        this.updating = false
        Lib.Log.debug("ログインに成功しました - ")
        this.forward()
      }
      let failure = (error) => {
        this.updating = false
        switch (error.status) {
          case 400:
            this.messageError("IDまたはパスワードに誤りがあります", [], Level.WARN)
            break
          default:
            this.messageError("要求処理に失敗しました")
        }
      }
      api.login({loginId: this.loginId, password: this.password}, success, failure)
    },
    forward() {
      api.loginAccount(v => {
        this.loginSession(v)
        location.href = "index.html"
      })
    }    
  }
})
app.$mount('#app')