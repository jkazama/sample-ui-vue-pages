// Common
import "common"
import Header from "header"

// Page ViewModel
import * as Option from "platform/vue-option"
let option = new Option.ComponentBuilder({
  el: ".container"
}).build()
let main = new Vue(option)
