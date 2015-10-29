// Common
import "common"
import Header from "header"

// Page ViewModel
import {Action} from 'platform/vue-constants'
import * as Option from "platform/vue-option"
import withdrawalCrud from "components/asset/withdrawal-crud"
import withdrawalList from "components/asset/withdrawal-list"
let option = new Option.ComponentBuilder({
  components: {
    "withdrawalCrud": withdrawalCrud,
    "withdrawalList": withdrawalList
  },
  created: function() {
    this.initialized()
  },
  ready: function() {
    this.$on(Action.CrudSuccess, (v) => this.$children[1].search())
  }
}).build()
let Main = new Vue(option)
