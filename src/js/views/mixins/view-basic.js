import Param from 'variables'
import {Level, Event} from 'constants'
import * as Lib from "platform/plain"
import Vue from "vue"

import Message from "components/Message.vue"
import CommandButton from "components/CommandButton.vue"
import InputText from "components/InputText.vue"
import ListGroup from "components/ListGroup.vue"
import Modal from "components/Modal.vue"

/**
 * View コンポーネントのベーシックな Mixin。
 * 親パネルの他、ファイルアップロードや確認ダイアログ/単純表示等、シンプルな処理が必要なときなどに利用してください。
 * 本クラスを利用する際は初期化時に以下の設定が必要です。
 * ---
 * - 標準API
 * clear: グローバルエラー及び/コントロールエラーを初期化する
 * apiFailure: API実行時の標準例外ハンドリング
 * file: type=fileの値参照を返す。apiUploadのdata値へ設定する際に利用
 * files: type=fileの値参照一覧を返す。
 * flattenItem: 引数に与えたハッシュオブジェクトを結合文字列へ変換する
 * paramArray:　配列(オブジェクト)をフラットなパラメタ要素へ展開
 * renderWarning: 例外情報を画面へ反映する
 * renderColumnWarning: コントロール単位の画面例外反映
 */
export default {
  data() {
    return {}
  },
  components: {
    Message, CommandButton, InputText, ListGroup, Modal
  },
  created() {
    this.clear()
  },
  methods: {
    // メッセージを通知します。
    message(globalMessage = null, columnMessages = [], level = Level.INFO) {
      let messages = {global: globalMessage, columns: columnMessages, level: level}
      if (globalMessage) Lib.Log.debug(messages)
      EventEmitter.$emit(Event.Messages, messages)
    },
    // エラーメッセージを通知します。
    messageError(globalMessage, columnMessages = [], level = Level.ERROR) {
      this.message(globalMessage, columnMessages, level)
    },
    // グローバルエラー及び/コントロールエラーを初期化します
    clear() {
      this.clearMessage()
    },
    clearMessage() {
      this.message()
    },
    // ファイルオブジェクトを取得します。apiUpload時のdataへ設定するアップロード値を取得する際に使用してください。
    file(query = 'input[type="file"]') {
      return this.files(query)[0]
    },
    files(query = 'input[type="file"]') {
      let inputs = this.$el.querySelectorAll(query)
      let ret = new Array(inputs.length)
      let i = 0
      Array.from(inputs).forEach(input => {
        ret[i] = input.files[0]
        i++
      })
      return ret
    },
    // 引数に与えたハッシュオブジェクトでネストされたものを「.」付の一階層へ変換します。(引数は上書きしません)
    // {a: {b: {c: 'd'}}} -> {'a.b.c': 'd'}
    flattenItem(item) {
      return Lib.Utils.flatten(item)
    },
    //　配列(オブジェクト)をフラットなパラメタ要素へ展開します
    // 直接オブジェクトへ上書きしたい際は第3引数にハッシュオブジェクトを渡してください。
    // [{k: 'a'}, {k: 'b'}] -> {'params[0].k': 'a', 'params[1].k': 'b'}
    // ※ajax/SpringMVCでのネスト値不具合を解消します。
    // see http://stackoverflow.com/questions/5900840/post-nested-object-to-spring-mvc-controller-using-json
    paramArray(array, keyName = 'params', ret = {}) {
      let i = 0
      Array.from(array).forEach(param => {
        Object.keys(param).forEach(key => {
          let k = `${keyName}[${i}].${key}`
          ret[k] = param[key]
        })
        i++
      })
      return ret
    },
    // api Action Support
    actionSuccess(v, successMessage = "処理が成功しました") {
      Lib.Log.debug('success')
      this.message(successMessage, [], Level.INFO)
    },
    actionFailure(error) {
      let message = null
      let columns = []
      let level = Level.ERROR
      switch (error.status) {
        case 200:
          message = "要求処理は成功しましたが、戻り値の解析に失敗しました"
          break
        case 400:
          let parsed = this.parseApiError(error)
          if (parsed.global) Lib.Log.debug(parsed.global)
          message = parsed.global ? parsed.global : "入力情報を確認してください"
          level = Level.WARN
          columns = parsed.columns
          break
        case 401:
          message = "機能実行権限がありません"
          break
        default:
          message = "要求処理に失敗しました"
      }
      this.message(message, columns, level)
    },
    parseApiError (error) {
      let errs = JSON.parse(error.response.text)
      let parsed = {global: null, columns: []}
      Object.keys(errs).forEach((err) => {
        if (err) parsed.columns.push({key: err, messages: errs[err], level: Level.ERROR})
        else parsed.global = errs[err]
      })
      return parsed
    },
    // for session
    // ハッシュ情報をログインセッションへ紐付けします
    loginSession(sessionHash) {
      Lib.Session.login(sessionHash)
      EventEmitter.$emit(Event.Login, {})
    },
    // ログインセッション情報を破棄します
    logoutSession() {
      Lib.Session.logout()
      EventEmitter.$emit(Event.Logout, {})
    },
    // ログイン状態の時はtrue
    isLogin() { return Lib.Session.hasSession() },
    // セッション情報を取得します。key未指定時はログインセッションハッシュを返します
    sessionValue(key = null) { return Lib.Session.value(key) },
    // セッション情報を取得します。key未指定時はログインセッションハッシュを返します
    hasAuthority(id) {
      let list = this.sessionValue() ? this.sessionValue().authorities : null
      return list ? Array.from(list).includes(`ROLE_${id}`) : false
    }
  }
}