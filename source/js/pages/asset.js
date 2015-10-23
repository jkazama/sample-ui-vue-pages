// Common
import "common"
import Header from "header"

// Page ViewModel
import * as Option from "platform/vue-option"
import withdrawalCrud from "components/asset/withdrawal-crud"
import withdrawalList from "components/asset/withdrawal-list"
let option = new Option.ComponentBuilder({
  el: ".container",
  components: {
    "withdrawalCrud": withdrawalCrud,
    "withdrawalList": withdrawalList
  },
  created: function() {
    this.initialized()
  },
  ready: function() {
    this.$on('action-success-crud', (v) => this.$children[1].search())
  }
}).build()
let Main = new Vue(option)
