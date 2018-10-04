/*----------------------------------
 - asset.js -
 ----------------------------------*/

// Common
import "common"
import "header"

// Page ViewModel
import ViewBasic from "views/mixins/view-basic"
import WithdrawalCrud from "views/asset/WithdrawalCrud.vue"
import WithdrawalList from "views/asset/WithdrawalList.vue"

const app = new Vue({
  mixins: [ViewBasic],
  components: {
    "WithdrawalCrud": WithdrawalCrud,
    "WithdrawalList": WithdrawalList
  }
})
app.$mount('#app')