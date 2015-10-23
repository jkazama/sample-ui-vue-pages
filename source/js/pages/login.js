// Common
import "common"

// Page ViewModel
import * as Lib from "platform/plain"
import * as Option from "platform/vue-option"
let option = new Option.ComponentBuilder({
  el: ".l-panel-login",
  data: {
    loginId: "",
    password: ""
  },
  methods: {
    login: function() {
      Lib.Log.debug(this.loginId)
      let success = (ret) => {
        Lib.Log.debug("ログインに成功しました - ")
        this.forward()
      }
      let failure = (error) => {
        this.clearMessage()
        switch (error.status) {
          case 400:
            this.message("IDまたはパスワードに誤りがあります")
            break
          default:
            this.message("要求処理に失敗しました", "danger")
        }
      }
      this.apiPost("/login", {loginId: this.loginId, password: this.password}, success, failure)
    },
    forward: function() {
      this.apiGet("/account/loginAccount", {}, (v) => {
        this.loginSession(v)
        location.href = "index.html"
      })
    }
  }
}).build()
let main = new Vue(option)
