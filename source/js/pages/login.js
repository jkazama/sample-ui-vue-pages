/*----------------------------------
 - login.js -
 ----------------------------------*/

// Common
import "common"

// Page ViewModel
import {Level} from "constants"
import * as Lib from "platform/plain"
import * as Option from "platform/vue-option"
let option = new Option.ComponentBuilder({
  el: ".l-panel-login",
  data: {
    loginId: "",
    password: "",
    updating: false
  },
  created: function() {
    this.initialized()
    if (this.isLogin()) {
      location.href = "index.html"
    }
  },
  methods: {
    login: function() {
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
