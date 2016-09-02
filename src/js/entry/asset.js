/*----------------------------------
 - asset.js -
 ----------------------------------*/

// Common
import "common"
import Header from "header"

// Page ViewModel
import {Action} from 'constants'
import ViewBasic from "views/mixins/view-basic"
import WithdrawalCrud from "views/asset/WithdrawalCrud.vue"
import WithdrawalList from "views/asset/WithdrawalList.vue"

const app = new Vue({
  mixins: [ViewBasic],
  components: {
    "WithdrawalCrud": WithdrawalCrud,
    "WithdrawalList": WithdrawalList
  },
  mounted() {
    EventEmitter.$on(Action.Success, (v) => this.$refs.list.search())
  }
})
app.$mount('#app')