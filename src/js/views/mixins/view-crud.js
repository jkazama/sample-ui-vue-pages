import Param from 'variables'
import {Level} from 'constants'
import * as Lib from 'platform/plain'
import Vue from 'vue'

import ViewBasic from 'views/mixins/view-basic'

/**
 * 特定情報の登録/変更/削除を前提とした Vue Mixin。
 * 情報に対するCRUD目的のパネルで利用してください。
 * 本クラスを利用する際は初期化時に以下の設定が必要です。
 * ・actionの実装
 * ---
 * - Props -
 * autoFlattenItem: 更新時に与えたitemをflattenItem(ネストさせないオブジェクト化)とするか
 * - Data -
 * updating: 処理中の時はtrue
 * item: 登録/更新情報
 * - 標準API
 * register: 各種更新アクションをします
 * clear: メッセージや入力情報を初期化します
 * action: 実際の更新アクションを実装してください (必須)
 * registerData: 登録/変更情報をハッシュで生成します。(標準だと item をコピーして返します)
 */
export default {
  data() {
    return {
      item: {},          // 更新対象情報
      updating: false    // 処理中判定
    }
  },
  props: {
    autoFlattenItem: {type: Boolean, default: false}
  },
  mixins: [ViewBasic],
  components: {},
  created() {
    this.clear()
  },
  methods: {
    // 各種登録処理を行います。
    // 登録情報はregisterDataに依存します。
    register(event) {
      let param = this.registerData()
      if (0 < Object.keys(param).length) Lib.Log.debug(param)
      this.updating = true
      let success = (v, message = "処理を完了しました") => {
        this.updating = false
        this.actionSuccess(v, message)
      }
      let failure = (error) => {
        this.updating = false
        this.actionFailure(error)
      }
      this.action(param, success, failure)
    },
    // 各種メッセージの他、登録情報を初期化します
    clear() {
      this.clearMessage()
      Object.keys(this.item).forEach((k) => this.item[k] = null)
    },
    action(item, success, failure) {
      Lib.Log.error('利用先でメソッドを実装してください [action]')
    },
    // 登録/変更情報をハッシュで返します。
    // 標準ではitemの値をコピーして返します。
    registerData() {
      let data = _.clone(this.item)
      Object.keys(data).forEach((k) => {
        if (typeof data[k] === 'object') data[k] = null
      })
      return data
    }
  }
}