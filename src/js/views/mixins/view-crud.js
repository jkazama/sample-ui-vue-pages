import Param from 'variables'
import {Level, Event, Action} from 'constants'
import * as Lib from 'platform/plain'

import ViewBasic from 'views/mixins/view-basic'

/**
 * 特定情報の登録/変更/削除を前提とした Vue Mixin。
 * 情報に対するCRUD目的のパネルで利用してください。
 * 本クラスを利用する際は初期化時に以下の設定が必要です。
 * ・path属性の定義
 * ---
 * - Props -
 * autoFlattenItem: 更新時に与えたitemをflattenItem(ネストさせないオブジェクト化)とするか
 * path: CRUD-API基準パス(必須)。
 *   pathが「/hoge/」の時。 登録時: /hoge/, 更新時: /hoge/{idPath}/, 削除時: /hoge/{idPath}/delete
 * - Data -
 * updateFlag: 更新モードの時はtrue
 * updating: 処理中の時はtrue
 * item: 登録/更新情報
 * actionSuccessKey: 処理成功時に $emit されるイベントキー
 * actionFailureKey: 処理失敗時に $emit されるイベントキー
 * - 標準API
 * register: 登録/変更します
 * registerData: 登録/変更情報をハッシュで生成します
 * registerPath: 登録先パスを生成します
 * updatePath: 変更先パスを生成します
 * deletePath: 削除先パスを生成します
 * actionSuccess: 成功時のイベント処理
 * actionSuccessMessage: 登録/変更/削除時の表示文言
 * actionFailure: 失敗時のイベント処理
 */
export default {
  data() {
    return {
      item: {},          // 更新対象情報
      updating: false    // 処理中判定
    }
  },
  props: {
    updateFlag: {type: Boolean, default: false},
    autoFlattenItem: {type: Boolean, default: false},
    path: {type: String, required: true},
    // 処理完了後に emit されるイベントキー
    actionSuccessKey: {type: String, default: Action.Success},
    // 処理失敗後に emit されるイベントキー
    actionFailureKey: {type: String, default: Action.Failure}
  },
  mixins: [ViewBasic],
  components: {},
  created() {
    this.clear()
    this.initialized()
  },
  methods: {
    // 初期化後処理。Vue.jsのcreatedメソッドから呼び出す事で以下の処理が有効化されます。
    // ・ポップアップ指定に伴う自身の非表示制御
    initialized() {
      if (this.popup) this.hide()
    },
    // 登録/変更処理を行います。
    // 実行時の接続URLは前述のattributes解説を参照。実際の呼び出しはregisterPath/updatePathの値を利用。
    // 登録情報はregisterDataに依存します。
    // 登録成功時の後処理はactionSuccessAfter、失敗時の後処理はactionFailureAfterを実装する事で差し込み可能です。
    register(event) {
      let path = this.updateFlag ? this.updatePath() : this.registerPath()
      Lib.Log.debug(`- register url: ${this.apiUrl(path)}`)
      let param = this.registerData()
      if (0 < Object.keys(param).length) Lib.Log.debug(param)
      this.updating = true
      let success = (v) => {
        this.updating = false
        this.actionSuccess(v)
      }
      let failure = (error) => {
        this.updating = false
        this.actionFailure(error)
      }
      this.apiPost(path, param, success, failure)
    },
    // 削除処理を行います。
    // 削除時の接続URLは前述のattributes解説を参照。実際の呼び出しはdeletePathの値を利用。
    // 削除成功時の後処理はactionSuccessAfter、失敗時の後処理はactionFailureAfterを実装する事で差し込み可能です。
    delete(event) {
      let path = this.deletePath()
      Lib.Log.debug(`- delete url: ${this.apiUrl(path)}`)
      this.updating = true
      let success = (v) => {
        this.updating = false
        this.actionSuccess(v)
      }
      let failure = (error) => {
        this.updating = false
        this.actionFailure(error)
      }
      this.apiPost(path, {}, success, failure)
    },
    // 各種メッセージの他、登録情報を初期化します
    clear() {
      this.clearMessage()
      Object.keys(this.item).forEach((k) => this.item[k] = null)
    },
    // 登録時のURLパスを返します。ここで返すURLパスはapiUrlの引数に設定されます。
    registerPath(item) { return this.path },
    // 更新時のURLパスを返します。ここで返すURLパスはapiUrlの引数に設定されます。
    updatePath() { return `${this.registerPath()}${this.idPath()}/` },
    // 削除時のURLパスを返します。ここで返すURLパスはapiUrlの引数に設定されます。
    deletePath() { return `${this.registerPath()}${this.idPath()}/delete` },
    // 更新/削除時に利用されるID情報を返します。
    // $idが定義されている時はその値、未定義の時はitem.idを利用します。
    // 各利用先で上書き定義する事も可能です。
    idPath() { return this.item.id },
    // 登録/変更情報をハッシュで返します。
    // 標準ではitemの値をコピーして返します。
    registerData() {
      let data = _.clone(this.item)
      Object.keys(data).forEach((k) => {
        if (typeof data[k] === 'object') data[k] = null
      })
      return data
    },
    // 登録/変更/削除時の成功処理を行います。
    actionSuccess(v) {
      EventEmitter.$emit(Action.Success, v)
      if (this.updateFlag === false) this.clear()
      this.message(this.actionSuccessMessage())
      Lib.Log.debug('success')
    },
    // 登録/変更/削除時の表示文言を返します。
    actionSuccessMessage() { return this.updateFlag ? '変更(削除)を完了しました' : '登録を完了しました' },
    // 登録/変更/削除時の失敗処理を行います。
    actionFailure(xhr) {
      this.apiFailure(xhr)
      EventEmitter.$emit(Action.Failure, xhr)
    }
  }
}