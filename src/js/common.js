/*----------------------------------
 - common.js -
 ページ毎に共通で実行される処理
  ----------------------------------*/

// Register Global Event
import Vue from "vue"
window.Vue = Vue
window.EventEmitter = new Vue()

// Vue Custom Filter
import * as filters from './filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})