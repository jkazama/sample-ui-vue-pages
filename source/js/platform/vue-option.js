// ### Vue向け オプションビルダー ###

import Param from 'variables'
import {Level} from 'constants'
import * as Lib from "platform/plain"
import {Event, Action, Style} from 'platform/vue-constants'

/**
# Vue向けOptionビルダークラス
# ファイルアップロードや確認ダイアログ/単純表示等、シンプルな処理が必要なときは
# 本インスタンスのbuild実行戻り値(optionハッシュ)を元にVue.jsオブジェクトを作成してください。
# 作成方式は通常のVue.jsと同様です。(new Vue / Vue.extend / Vue.component)
# メソッド定義は「function」を明記する記法で行ってください。(メソッド内部では「() =>」を用いた記法も利用可)
# 本クラスを利用する際は初期化時に以下の設定が必要です。
# ・createdメソッド内でinitializedを呼び出す
# ---
# - 拡張属性[attributes] -
# el.scrollBody: 例外発生時にスクロール制御する際の親el(未指定時は.panel-body)
# - 標準API
# show: パネルを表示する
# hide: パネルを非表示にする
# clear: グローバルエラー及び/コントロールエラーを初期化する
# scrollTop: スクロール位置を最上位へ移動する
# changeFlag: 指定要素(dataに対するパス)を反転した値にする(booleanを想定)
# apiGet: APIへのGET処理を行う
# apiPost: APIへのPOST処理を行う
# apiUpload: APIへのファイルアップロード処理(POST)を行う
# apiUrl: APIプリフィックスを付与したURLを返す
# apiFailure: API実行時の標準例外ハンドリング
# file: type=fileの値参照を返す。apiUploadのdata値へ設定する際に利用
# files: type=fileの値参照一覧を返す。
# flattenItem: 引数に与えたハッシュオブジェクトを結合文字列へ変換する
# paramArray:　配列(オブジェクト)をフラットなパラメタ要素へ展開
# renderWarning: 例外情報を画面へ反映する
# renderColumnWarning: コントロール単位の画面例外反映
*/
export class ComponentBuilder {
  // 初期化コンストラクタ
  constructor(options) {
    if (!options) return Lib.Log.error('コンストラクタ引数は必須です')
    this.optionsOrigin = options ? options : {}
    this.options = _.clone(options)
    // binding extension
    let ext = this.options.ext ? this.options.ext : {}
    this.options.ext = Object.assign(this.defaultExtension(), ext)
    // binding el
    let el = (typeof options.el === 'function') ? options.el() : (options.el ? options.el : 'body')
    this.options.el = () => el
    // binding data
    let data = (typeof options.data === 'function') ? options.data() : options.data
    this.options.data = () => Object.assign(this.defaultData(), data)
    // binding method
    this.defaultMethods = this.loadDefaultMethods()
    this.overrideMethods = this.loadOverrideMethods()
    this.options.methods = _.clone(this.defaultMethods)
    let m = this.options.methods
    Object.keys(this.overrideMethods).forEach((k) => m[k] = this.overrideMethods[k])
    if (this.optionsOrigin.methods) {
      Object.keys(this.optionsOrigin.methods).forEach((k) => {
        m[k] = this.optionsOrigin.methods[k]
      })
    }
  }
  // 初期化時の拡張情報
  defaultExtension() {
    return {
      el: { scrollBody: '.panel-body' }
    }
  }
  // 初期化時のdata情報
  defaultData() {
    return {}
  }
  // データ初期化処理を行います
  setup() { /* 継承先で必要に応じて実装してください */ }
  build() {
    this.setup()
    return this.options
  }
  loadOverrideMethods() { /** 継承先で上書きメソッドを定義してください */ return {}}
  loadDefaultMethods() { return {
    ext: function() { return this.$options.ext },
    // 指定したdata要素キーに紐づくカラムメッセージのJQueryオブジェクトを返します
    // ※事前にv-messageディレクティブで対象コントロールに対して紐付けが行われている必要があります。
    $columnMessage: function(key) {
      return $(this.$el).find(`${Style.MessagePrefix}${key.replace('.', '-')}`)
    },
    // 初期化処理。createdで呼び出される事を期待します。
    initialized: function() {
      this.clear()
    },
    // パネルを表示します
    show: function(speed = 100) {
      this.clearMessage()
      $(this.$el).show(speed)
      this.scrollTop()
    },
    // パネルを隠します
    hide: function() {
      $(this.$el).hide()
    },
    // メッセージを通知します。
    message: function(globalMessage = null, columnMessages = [], level = Level.INFO) {
      let messages = {global: globalMessage, columns: columnMessages, level: level}
      if (globalMessage) Lib.Log.debug(messages)
      this.$emit(Event.Messages, messages)
    },
    // エラーメッセージを通知します。
    messageError: function(globalMessage, columnMessages = [], level = Level.ERROR) {
      this.message(globalMessage, columnMessages, level)
      // 例外発生箇所へ移動
      if (!columnMessages || columnMessages.length === 0) {
        this.scrollTop()
      } else {
        this.scrollTo(this.ext().el.scrollBody, Object.keys(columnMessages)[0])
      }
    },
    // グローバルエラー及び/コントロールエラーを初期化します
    clear: function() {
      this.clearMessage()
    },
    clearMessage: function() {
      this.message()
    },
    // 指定したel内の要素キーで例外を持つ最上位のコントロールへスクロール移動します。
    // ※有効化するには事前に各カラム要素に対してv-messageの付与が必要です。
    scrollTo: function(el, keyColumn) {
      let $body = $(el, $(this.$el))
      let $target = this.$columnMessage(keyColumn)
      if (0 < $target.length) {
        let bodyTop = $body.offset() ? $body.offset().top : 0
        $body.scrollTop($target.offset().top - bodyTop + $body.scrollTop())
      } else {
        this.scrollTop()
      }
    },
    // スクロール位置を最上位へ移動します。elにはスクローラブルな親要素を指定してください
    scrollTop: function(el = Style.DefaultScrollTop) {
      $(el, $(this.$el)).scrollTop(0)
    },
    // 指定要素(dataに対するパス)を反転した値にします(booleanを想定)
    changeFlag: function(flagPath) {
      this.$set(flagPath, !this.$get(flagPath))
    },
    // APIへのGET処理を行います
    apiGet: function(path, data, success, failure = this.apiFailure) {
      Lib.Ajax.get(this.apiUrl(path), data, success, failure)
    },
    // APIへのPOST処理を行います
    apiPost: function(path, data, success, failure = this.apiFailure) {
      Lib.Ajax.post(this.apiUrl(path), data, success, failure)
    },
    // APIへのファイルアップロード処理(POST)を行います
    // アップロード対象キーの値はfileメソッドを利用して定義するようにしてください
    apiUpload: function(path, data, success, failure = this.apiFailure) {
      Lib.Ajax.upload(this.apiUrl(path), data, success, failure)
    },
    // APIプリフィックスを付与したURLを返します。
    apiUrl: function(path) {
      return `${Param.Api.root}${path}`
    },
    // ファイルオブジェクトを取得します。apiUpload時のdataへ設定するアップロード値を取得する際に使用してください。
    file: function(el) {
      return this.files(el)[0]
    },
    files: function(el) {
      return $(el, $(this.$el)).prop('files')
    },
    // 引数に与えたハッシュオブジェクトでネストされたものを「.」付の一階層へ変換します。(引数は上書きしません)
    // {a: {b: {c: 'd'}}} -> {'a.b.c': 'd'}
    flattenItem: function(item) {
      return Lib.Utils.flatten(item)
    },
    //　配列(オブジェクト)をフラットなパラメタ要素へ展開します
    // 直接オブジェクトへ上書きしたい際は第3引数にハッシュオブジェクトを渡してください。
    // [{k: 'a'}, {k: 'b'}] -> {'params[0].k': 'a', 'params[1].k': 'b'}
    // ※jquery/SpringMVCでのネスト値不具合を解消します。
    // see http://stackoverflow.com/questions/5900840/post-nested-object-to-spring-mvc-controller-using-json
    paramArray: function(array, keyName = 'params', ret = {}) {
      var i = 0
      Array.from(array).forEach((param) => {
        Object.keys(param).forEach((key) => {
          let k = `${keyName}[${i}].${key}`
          ret[k] = param[key]
        })
        i++
      })
      return ret
    },
    // API実行時の標準例外ハンドリングを行います。
    apiFailure: function(error) {
      switch (error.status) {
        case 200:
          this.messageError("要求処理は成功しましたが、戻り値の解析に失敗しました")
          break
        case 400:
          let parsed = this.parseApiError(error)
          this.messageError(parsed.global ? parsed.global : "入力情報を確認してください", parsed.columns, Level.WARN)
          break
        case 401:
          this.messageError("機能実行権限がありません")
          break
        default:
          this.messageError("要求処理に失敗しました")
      }
    },
    parseApiError: function(error) {
      let errs = JSON.parse(error.responseText)
      let parsed = {global: null, columns: []}
      Object.keys(errs).forEach((err) => {
        if (err) parsed.columns.push({key: err, values: errs[err]})
        else parsed.global = errs[err]
      })
      return parsed
    },
    // for session
    // ハッシュ情報をログインセッションへ紐付けします
    loginSession: function(sessionHash) { Lib.Session.login(sessionHash) },
    // ログインセッション情報を破棄します
    logoutSession: function() { Lib.Session.logout() },
    // ログイン状態の時はtrue
    isLogin: function() { return Lib.Session.hasSession() },
    // セッション情報を取得します。key未指定時はログインセッションハッシュを返します
    sessionValue: function(key = null) { return Lib.Session.value(key) },
    // セッション情報を取得します。key未指定時はログインセッションハッシュを返します
    hasAuthority: function(id) {
      let list = this.sessionValue() ? this.sessionValue().authorities : null
      return list ? Array.from(list).includes(`ROLE_${id}`) : false
    }
  }}
}

/**
# 検索を前提としたVueOptionビルダークラス
# 一覧パネル等で利用してください。ページング検索(自動ロード方式)もサポートしています。
# (API側でPagingListを返す必要があります)
# メソッド定義は「function」を明記する記法で行ってください。(メソッド内部では「() =>」を用いた記法も利用可)
# 本クラスを利用する際は初期化時に以下の設定が必要です。
# ・path属性の定義
# ・createdメソッド内でinitializedを呼び出す
# ---
# - 拡張属性[ext] -
# initialSearch: 初回検索を行うか(未指定時はtrue)
# paging: ページング検索を行うか(未指定時はfalse)
# el.scrollBody: 例外発生時にスクロール制御する際の親el(未指定時は.panel-body)
# - グローバル属性 -
# path: 検索APIパス(必須: 標準でapiUrlへ渡されるパス)
# - 予約Data[data] -
# searchFlag: 検索パネル表示状態
# items: 検索結果一覧
# page: ページング情報
# updating: 処理中の時はtrue
# - 拡張メソッド[methods] -
# search: 検索する
# searchData: 検索条件をハッシュで生成する
# searchPath: 検索時の呼び出し先URLパスを生成する(apiUrlへ渡されるパス)
# layoutSearch: 検索後のレイアウト調整を行う(検索結果は@itemsに格納済)
*/
export class PanelListBuilder extends ComponentBuilder {
  constructor(options) {
    super(options)
  }
  // 初期化時の拡張情報
  defaultExtension() {
    return {
      initialSearch: true,
      paging: false,
      el: { scrollBody: '.panel-body' }
    }
  }
  // 初期化時のdata情報
  defaultData() {
    return {
      items: [],
      page: (this.options.ext.paging ? {page: 1, total: 0} : null),
      updating: false    // 処理中判定
    }
  }
  setup() {
    if (!this.options.path) throw new Error('path属性は必須です')
  }
  loadOverrideMethods() { return {
    // 初期化後処理。Vue.jsのcreatedメソッドから呼び出す事で以下の処理が有効化されます。
    // ・listBody要素のbottomイベントに自動ページング処理を紐付け
    // ・初期検索を実行
    initialized: function() {
      // イベント登録
      if (this.ext().paging) {
        this.$panels.body.onBottom(() => this.next())
      }
      // 初期化
      if (this.ext().initialSearch) this.search()
    },
    show: function(speed = 100) {
      this.initSearch()
      $(this.$el).show(speed)
    },
    // 検索パネルを表示する際の初期化処理
    initSearch: function() { /* 必要に応じて同名のメソッドで拡張実装してください */ },
    // 検索処理を行います
    // 検索時の接続URLはsearchPath、検索条件はsearchDataに依存します。
    // 検索成功時の後処理はlayoutSearchを実装する事で差し込み可能です。
    search: function() { this.renderSearch() },
    // 次ページの検索を行います。
    // 検索結果は一覧にそのまま追加されます。
    // ※タイミングによっては重複レコードが発生しますが、現時点ではそれらを取り除く処理は実装していません。
    next: function() {
      this.page.page = this.page.page + 1
      Lib.Log.debug(`- search next to ${this.page.page}`)
      this.renderSearch(true)
    },
    // 各種メッセージの他、検索結果を初期化します
    clear: function() {
      this.clearMessage()
      this.$set('items', [])
    },
    // 検索条件となるハッシュ情報を返します。
    searchData: function() { /* 利用先で設定してください */ return {} },
    // 検索時のURLパスを返します。ここで返すURLパスはapiUrlの引数に設定されます。
    searchPath: function() { return this.$options.path },
    // 検索を行います。appendがfalseのときは常に一覧を初期化します。
    renderSearch: function(append = false) {
      Lib.Log.debug(`- search url: ${this.apiUrl(this.searchPath())}`)
      let param = this.searchData()
      if (0 < Object.keys(param).length) Lib.Log.debug(param)
      if (this.ext().paging) {
        param["page.page"] = this.page.page
      }
      if (append === false) {
        this.clear()
        if (this.page) this.page.page = 1
      }
      this.updating = true
      let success = (data) => {
        this.updating = false
        this.renderList(data, append)
        this.layoutSearch()
      }
      let failure = (error) => {
        this.updating = false
        this.apiFailure(error)
      }
      this.apiGet(this.searchPath(), param, success, failure)
    },
    // 検索結果をitemsへ格納します。
    // itemsがv-repeat等で画面要素と紐づいていた時は画面側にも内容が反映されます。
    renderList: function(data, append) {
      Lib.Log.debug('- search result -')
      Lib.Log.debug(data)
      let list = () => {
        if (this.ext().paging) {
          if (data.page) {
            this.page = data.page
            return data.list
          } else {
            Lib.Log.warn('page属性を含む検索結果を受信できませんでした')
            return data
          }
        } else { return data }
      }
      if (append) {
        Array.from(list()).forEach((item) => this.items.push(item))
      } else {
        this.$set("items", list())
      }
    },
    // 検索後の後処理を行います。
    // 検索結果となる一覧変数(items)が設定されている保証があります。
    layoutSearch: function() { /* 必要に応じて同名のメソッドで拡張実装してください */ }
  }}
}

/**
# 特定情報の登録/変更/削除を前提としたOptionビルダークラス
# 情報に対するCRUD目的のパネルで利用してください。
# メソッド定義は「function」を明記する記法で行ってください。(メソッド内部では「() =>」を用いた記法も利用可)
# 本クラスを利用する際は初期化時に以下の設定が必要です。
# ・path属性の定義
# ・createdメソッド内でinitializedを呼び出す
# また利用する際は登録時にshowRegister。変更/削除時にshowUpdateを呼び出すようにしてください。
# ---
# - 拡張属性[ext] -
# popup: ポップアップパネルの時はtrue
# flattenItem: 更新時に与えたitemをflattenItem(ネストさせないオブジェクト化)とするか
# el.scrollBody: 例外発生時にスクロール制御する際の親el(未指定時は.panel-body)
# - グローバル属性 -
# path: CRUD-API基準パス(必須)。
#   pathが「/hoge/」の時。 登録時: /hoge/, 更新時: /hoge/{idPath}/, 削除時: /hoge/{idPath}/delete
# - 予約Data[data] -
# updateFlag: 更新モードの時はtrue
# updating: 処理中の時はtrue
# item: 登録/更新情報
# - 拡張メソッド[methods] -
# showRegister: 登録モードで表示します
# initRegister: 登録モードで表示する際の初期化処理
# showUpdate: 変更モードで表示します
# initUpdate: 変更モードで表示する際の初期化処理(@item未設定)
# layoutUpdate: 変更モードで表示する際のレイアウト処理(@item設定済)
# register: 登録/変更します
# registerData: 登録/変更情報をハッシュで生成します
# registerPath: 登録先パスを生成します
# updatePath: 変更先パスを生成します
# deletePath: 削除先パスを生成します
# actionSuccess: 成功時のイベント処理
# actionSuccessMessage: 登録/変更/削除時の表示文言
# actionSuccessAfter: 成功時のイベント後処理
# actionFailure: 失敗時のイベント処理
# actionFailureAfter: 失敗時のイベント処理
*/
export class PanelCrudBuilder extends ComponentBuilder {
  constructor(options) {
    super(options)
  }
  // 初期化時の拡張情報
  defaultExtension() {
    return {
      popup: false,
      flattenItem: false,
      el: { scrollBody: '.panel-body' }
    }
  }
  // 初期化時のdata情報
  defaultData() {
    return {
      item: {},          // 更新対象情報
      updateFlag: false, // 更新モードの時はtrue
      updating: false    // 処理中判定
    }
  }
  // 初期化処理を行います
  setup() {
    if (!this.options.path) throw new Error('path属性は必須です')
  }
  loadOverrideMethods() { return {
    // IDのjQueryオブジェクトを取得します。
    // 利用する際は事前にv-identifierをIDコンポーネントへ紐付けしている必要があります。
    $id: function() {
      return $(`${Style.ColumnPrefix}-id`, $(this.$el))
    },
    // 初期化後処理。Vue.jsのcreatedメソッドから呼び出す事で以下の処理が有効化されます。
    // ・ポップアップ指定に伴う自身の非表示制御
    initialized: function() {
      if (this.ext().popup) this.hide()
    },
    // 登録/変更処理を行います。
    // 実行時の接続URLは前述のattributes解説を参照。実際の呼び出しはregisterPath/updatePathの値を利用。
    // 登録情報はregisterDataに依存します。
    // 登録成功時の後処理はactionSuccessAfter、失敗時の後処理はactionFailureAfterを実装する事で差し込み可能です。
    register: function(event) {
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
    delete: function(event) {
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
    clear: function() {
      this.clearMessage()
      Object.keys(this.item).forEach((k) => this.$set(`item.${k}`, null))
    },
    // 登録モードで自身を表示します
    showRegister: function() {
      this.hide()
      this.updateFlag = false
      this.clear()
      this.initRegister()
      this.show()
      Lib.Log.debug(`show register [${this.$el ? this.$el.className : 'unknown'}]`)
    },
    // 登録モードで表示する際の初期化処理を行います
    initRegister: function() { /* 必要に応じて同名のメソッドで拡張実装してください */ },
    // 変更モードで自身を表示します
    showUpdate: function(item) {
      this.hide()
      this.updateFlag = true
      this.clear()
      let v = _.clone(item)
      this.initUpdate(v)
      this.item = this.ext().flattenItem === true ? this.flattenItem(v) : v
      this.layoutUpdate()
      this.show()
      Lib.Log.debug(`show update [${this.$el ? this.$el.className : "unknown"}]`)
    },
    // 変更モードで表示する際の初期化処理を行います(this.item未設定)
    // itemバインドがまだされていない点に注意してください。itemバインド後の処理が必要な時は
    // layoutUpdateを実装してください。
    initUpdate: function(item) { /* 必要に応じて同名のメソッドで拡張実装してください */ },
    // 変更モードで表示する際のレイアウト処理を行います(this.item設定済)
    layoutUpdate: function(item) { /* 必要に応じて同名のメソッドで拡張実装してください */ },
    // 登録時のURLパスを返します。ここで返すURLパスはapiUrlの引数に設定されます。
    registerPath: function(item) { return this.$options.path },
    // 更新時のURLパスを返します。ここで返すURLパスはapiUrlの引数に設定されます。
    updatePath: function() { return `${this.registerPath()}${this.idPath()}/` },
    // 削除時のURLパスを返します。ここで返すURLパスはapiUrlの引数に設定されます。
    deletePath: function() { return `${this.registerPath()}${this.idPath()}/delete` },
    // 更新/削除時に利用されるID情報を返します。
    // $idが定義されている時はその値、未定義の時はitem.idを利用します。
    // 各利用先で上書き定義する事も可能です。
    idPath: function() { return 0 < this.$id().size() ? this.$id().val() : this.item.id },
    // 登録/変更情報をハッシュで返します。
    // 標準ではitemの値をコピーして返します。
    registerData: function() {
      let data = _.clone(this.item)
      Object.keys(data).forEach((k) => {
        if (typeof data[k] === 'object') data[k] = null
      })
      return data
    },
    // 登録/変更/削除時の成功処理を行います。
    actionSuccess: function(v) {
      this.$dispatch(Action.CrudSuccess, v)
      if (this.ext().popup) {
        this.clear()
        this.hide()
      } else {
        if (this.updateFlag === false) this.clear()
        this.scrollTop()
        this.message(this.actionSuccessMessage())
      }
      Lib.Log.debug('success')
      this.actionSuccessAfter(v)
    },
    // 登録/変更/削除時の表示文言を返します。
    actionSuccessMessage: function() { return this.updateFlag ? '変更(削除)を完了しました' : '登録を完了しました' },
    // 登録/変更/削除時の成功後処理を行います。
    actionSuccessAfter: function(v) { /* 必要に応じて同名のメソッドで拡張実装してください */ },
    // 登録/変更/削除時の失敗処理を行います。
    actionFailure: function(xhr) {
      this.apiFailure(xhr)
      this.actionFailureAfter(xhr)
    },
    // 登録/変更/削除時の失敗後処理を行います。
    actionFailureAfter: function(xhr) { /* 必要に応じて同名のメソッドで拡張実装してください */ }
  }}
}
