// ### Vue向け オプションビルダー ###

import Param from 'variables'
import * as Lib from "platform/plain"

/**
# Vue向けOptionビルダークラス
# ファイルアップロードや確認ダイアログ/単純表示等、シンプルな処理が必要なときは
# 本インスタンスのbuild実行戻り値(optionハッシュ)を元にVue.jsオブジェクトを作成してください。
# 作成方式は通常のVue.jsと同様です。(new Vue / Vue.extend / Vue.component)
# メソッド定義は「function」を明記する記法で行ってください。(メソッド内部では「() =>」を用いた記法も利用可)
# 本クラスを利用する際は初期化時に以下の設定が必要です。
# ・createdメソッド内でinitializedを呼び出す
# ---
# - 拡張属性[attr] -
# el.message: メッセージ表示用のエレメント属性(未指定時は.l-message)
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
    this.options.attr = this.options.attr ? this.options.attr : {}
    this.options.attr.el = this.options.attr.el ? this.options.attr.el : {}
    this.options.attr.el.message = this.options.attr.el.message ? this.options.attr.el.message : '.l-message'
    this.options.attr.el.modelPrefix = this.options.attr.el.modelPrefix ? this.options.attr.el.modelPrefix : '.l-model-'
    let el = (typeof options.el === 'function') ? options.el() : (options.el ? options.el : 'body')
    this.options.el = () => el
    let data = (typeof options.data === 'function') ? options.data() : options.data
    this.options.data = () => data
    this.defaultMethods = this.loadDefaultMethods()
    this.options.methods = _.clone(this.defaultMethods)
    if (this.optionsOrigin.methods) {
      Object.keys(this.optionsOrigin.methods).forEach((k) => {
        this.options.methods[k] = this.optionsOrigin.methods[k]
      })
    }
  }
  // 初期化時のattributes設定を行います
  bindOptions() { /* 継承先で必要に応じて実装してください */ }
  // 初期化時のmethods設定を行います
  bindMethods() { /* 継承先で必要に応じて実装してください */ }
  // データ初期化処理を行います
  setup() { /* 継承先で必要に応じて実装してください */ }
  build() {
    // 定義指定に対する拡張挿入
    this.bindOptions()
    this.bindMethods()
    this.setup()
    return this.options
  }
  loadDefaultMethods() { return {
    attr: function() { return this.$options.attr },
    $main: function() { return $(this.$el) },
    $message: function() { return $(this.attr().el.message, this.$main()) },
    // 指定したdata要素キーに紐づくJQueryオブジェクトを返します
    // ※事前に対象コントロールに対し「.l-model-[dataKey]」が付与されている必要があります
    //   ネストオブジェクト対応としてkeyに「.」が含まれていた時は「-」である事を期待します。
    //   e.x. dataKey: hoge.hoga -> .l-model-hoge-hoga
    $obj: function(key) {
      let k = key ? key.replace(/\./g, '-') : ""
      return this.$main().find(this.attr().el.modelPrefix + k)
    },
    // 初期化処理
    initialized: function() {
      this.clear()
    },
    // パネルを表示します
    show: function(speed = 100) {
      this.message()
      this.clearMessage()
      this.$main().show(speed)
      this.scrollTop()
    },
    // パネルを隠します
    hide: function() {
      this.$main().hide()
    },
    // $message要素においてメッセージを表示します
    // message: メッセージ文字列
    // type: 表示種別(success/warning(default)/danger)
    message: function(message, type = 'warning', speed = 100) {
      if (message) {
        this.$message().text(message)
        this.$message().removeClassRegex(/\btext-\S+/g)
        this.$message().removeClassRegex(/\balert-\S+/g)
        this.$message().addClass(`alert-${type} alert-dismissible`)
        this.$message().show(speed)
        Lib.Log.debug(message)
      } else {
        this.$message().hide()
      }
    },
    // グローバルエラー及び/コントロールエラーを初期化します
    clear: function() {
      this.message()
      this.clearMessage()
    },
    clearMessage: function() {
      this.$main().find('.l-message-group .l-message-group-item').remove()
      this.$main().find('.l-message-group .input-group').unwrap()
      this.$main().find('.l-message-group .form-control').unwrap()
    },
    // スクロール位置を最上位へ移動します。elにはスクローラブルな親要素を指定してください
    scrollTop: function(el = '.panel-body') {
      $(el, this.$main()).scrollTop(0)
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
      return $(el, this.$main()).prop('files')
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
      this.clearMessage()
      switch (error.status) {
        case 200:
          this.message('要求処理は成功しましたが、戻り値の解析に失敗しました', 'warning')
          break
        case 400:
          this.message('入力情報を確認してください')
          this.renderWarning($.parseJSON(error.responseText))
          break
        case 401:
          this.message('機能実行権限がありません', 'danger')
          break
        default:
          this.message('要求処理に失敗しました', 'danger')
      }
    },
    // 例外ハッシュ(要素キー: エラー文字列)をUI要素へ紐づけます。
    // 要素キーが空文字の時はグローバル例外として取り扱います。
    // 要素キーが設定されている時はrenderColumnWarningが呼び出されます。
    renderWarning: function(warn) {
      var gwarn = null
      var cwarns = {}
      Object.keys(warn).forEach((key) => {
        let value = warn[key]
        if (key === '') {
          gwarn = value[0]
        } else {
          cwarns[key] = value[0]
        }
      })
      // render global
      if (gwarn) this.message(gwarn)
      // render columns
      Object.keys(cwarns).forEach((key) => this.renderColumnWarning(key, cwarns[key]))
    },
    // 指定したdata要素キーに警告エラーメッセージを付与します
    // UI側入力チェックなどで利用してください
    // ※事前に対象コントロールに対し「.l-model-[dataKey]」が付与されている必要があります
    renderColumnWarning: function(key, message) {
      let $column = this.$obj(key)
      if ($column.length === 0) return
      let prevMsg = $column.parent().find(".l-message-group-item").text()
      if (prevMsg === message) return // 同一メッセージはスルー
      $column.wrap('<div class="input-group l-message-group" />')
      $column.parent().append(`<div class="l-message-group-item text-danger">${message}</div>`)
    },
    // for session
    // ハッシュ情報をログインセッションへ紐付けします
    loginSession: function(sessionHash) { Lib.Session.login(sessionHash) },
    // ログインセッション情報を破棄します
    logoutSession: function() { Lib.Session.logout() },
    // セッション情報を取得します。key未指定時はログインセッションハッシュを返します
    sessionValue: function(key = null) { Lib.Session.value(key) },
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
# - 拡張属性[attr] -
# initialSearch: 初回検索を行うか(未指定時はtrue)
# paging: ページング検索を行うか(未指定時はfalse)
# el.search: 検索条件要素(未指定時は.l-panel-search)
# el.listBody: 一覧表示要素(未指定時は.l-list-body)
# el.listCount: 検索結果件数表示要素(未指定時は.l-list-cnt span)
# el.listWaitRow: 検索中の処理待ちアイコン要素(未指定時は.l-list-wait-row)
# - グローバル属性 -
# path: 検索APIパス(必須: 標準でapiUrlへ渡されるパス)
# - 予約Data[data] -
# searchFlag: 検索パネル表示状態
# items: 検索結果一覧
# page: ページング情報
# - 拡張メソッド[methods] -
# search: 検索する
# searchData: 検索条件をハッシュで生成する
# searchPath: 検索時の呼び出し先URLパスを生成する(apiUrlへ渡されるパス)
# layoutSearch: 検索後のレイアウト調整を行う(検索結果は@itemsに格納済)
*/
export class PanelListBuilder extends ComponentBuilder {
  constructor(options) {
    super(options)
    this.overrideMethods = this.loadOverrideMethods()
  }
  // 初期化時のattributes設定を行います
  bindOptions() {
    let attr = this.options.attr
    attr.initialSearch = attr.hasOwnProperty('initialSearch') ? attr.initialSearch : true
    attr.paging = attr.hasOwnProperty('paging') ? attr.paging : false
    attr.el.listBody = (attr.el && attr.el.listBody) ? attr.el.listBody : '.l-list-body'
    attr.el.listCount = (attr.el && attr.el.listCount) ? attr.el.listCount : '.l-list-cnt span'
    attr.el.listWaitRow = (attr.el && attr.el.listWaitRow) ? attr.el.listWaitRow : '.l-list-wait-row'
  }
  // 初期化時のmethods設定を行います
  bindMethods() {
    let m = this.options.methods
    Object.keys(this.overrideMethods).forEach((k) => m[k] = this.overrideMethods[k])
    if (this.optionsOrigin.methods) {
      Object.keys(this.optionsOrigin.methods).forEach((k) => m[k] = this.optionsOrigin.methods[k])
    }
  }
  // 初期化処理を行います
  setup() {
    if (!this.options.path) throw new Error('path属性は必須です')
    var data = this.optionsOrigin.data ? this.optionsOrigin.data : {}
    if (typeof data === 'function') data = data()
    data.items = data.items ? data.items : []
    data.page = this.options.attr.paging ? {page: 1, total: 0} : null
    // 予約属性
    this.options.data = () => data
  }
  loadOverrideMethods() { return {
    $body: function() { return $(this.attr().el.listBody, this.$main()) },
    $waitRow: function() { return $(this.attr().el.listWaitRow, this.$body()) },
    $count: function() { return $(this.attr().el.listCount, this.$main()) },
    // 初期化後処理。Vue.jsのcreatedメソッドから呼び出す事で以下の処理が有効化されます。
    // ・page情報を監視して検索結果の件数を表示する
    // ・listBody要素のbottomイベントに自動ページング処理を紐付け
    // ・初期検索を実行
    initialized: function() {
      this.$waitRow().hide()
      // イベント登録
      if (this.attr().paging) {
        this.$watch('page', (page) => this.$count().text(page.total ? page.total : '-1'))
        this.$panels.body.onBottom(() => this.next())
      } else {
        this.$watch('items', (items) => this.$count().text(this.items.length))
      }
      // 初期化
      if (this.attr().initialSearch) this.search()
    },
    show: function(speed = 100) {
      this.initSearch()
      this.$main().show(speed)
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
      this.message()
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
      if (this.attr().paging) {
        param["page.page"] = this.page.page
      }
      if (append === false) {
        this.clear()
        if (this.page) this.page.page = 1
      }
      if (this.$waitRow().size()) this.$waitRow().show()
      let success = (data) => {
        this.$waitRow().hide()
        this.renderList(data, append)
        this.layoutSearch()
      }
      let failure = (error) => {
        this.$waitRow().hide()
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
        if (this.attr().paging) {
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
# - 拡張属性[attributes] -
# popup: ポップアップパネルの時はtrue
# spinner: register呼び出し時に呼び出し元のコントロール末尾に処理中スピナーを表示するか(標準はtrue)
# list: 親の検索リスト。設定時は更新完了後に検索を自動的に呼び出す。
# flattenItem: 更新時に与えたitemをflattenItem(ネストさせないオブジェクト化)とするか
# el.id: IDのinputに紐づく要素キー(未指定時は.l-model-id)
#   設定時はAPIパス構築時に値が利用されるほか、showUpdate利用時にdisabled状態となる。
# el.scrollBody: 例外発生時にスクロール制御する際の親el(未指定時は.panel-body)
# - グローバル属性 -
# path: CRUD-API基準パス(必須)。
#   pathが「/hoge/」の時。 登録時: /hoge/, 更新時: /hoge/{idPath}/, 削除時: /hoge/{idPath}/delete
# - 予約Data[data] -
# updateFlag: 更新モードの時はtrue
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
# startAction: イベント開始処理を行います。(2度押し対応)
# endAction: イベント完了処理を行います。(2度押し対応)
# actionSuccess: 成功時のイベント処理
# actionSuccessMessage: 登録/変更/削除時の表示文言
# actionSuccessAfter: 成功時のイベント後処理
# actionFailure: 失敗時のイベント処理
# actionFailureAfter: 失敗時のイベント処理
*/
export class PanelCrudBuilder extends ComponentBuilder {
  constructor(options) {
    super(options)
    this.overrideMethods = this.loadOverrideMethods()
  }
  // 初期化時のattributes設定を行います
  bindOptions() {
    let attr = this.options.attr
    attr.popup = attr.hasOwnProperty('popup') ? attr.popup : false
    attr.spinner = attr.hasOwnProperty('spinner') ? attr.spinner : true
    attr.flattenItem = attr.hasOwnProperty('flattenItem') ? attr.flattenItem : false
    attr.el.id = attr.el.id ? attr.el.id : 'id'
    attr.el.scrollBody = attr.el.scrollBody ? attr.el.scrollBody : '.panel-body'
  }
  // 初期化時のmethods設定を行います
  bindMethods() {
    let m = this.options.methods
    Object.keys(this.overrideMethods).forEach((k) => m[k] = this.overrideMethods[k])
    if (this.optionsOrigin.methods) {
      Object.keys(this.optionsOrigin.methods).forEach((k) => m[k] = this.optionsOrigin.methods[k])
    }
  }
  // 初期化処理を行います
  setup() {
    if (!this.options.path) throw new Error('path属性は必須です')
    var data = this.optionsOrigin.data ? this.optionsOrigin.data : {}
    if (typeof data === 'function') data = data()
    data.item = data.item ? data.item : {}
    data.updateFlag = data.hasOwnProperty('updateFlag') ? data.updateFlag : false
    // 予約属性
    this.itemOrigin = _.clone(data.item)
    this.options.data = () => data
  }
  loadOverrideMethods() { return {
    $id: function() { return $(this.attr().el.modelPrefix + this.attr().el.id, this.$main()) },
    // 初期化後処理。Vue.jsのcreatedメソッドから呼び出す事で以下の処理が有効化されます。
    // ・ポップアップ指定に伴う自身の非表示制御
    initialized: function() {
      if (this.attr().popup) this.hide()
    },
    // 登録/変更処理を行います。
    // 実行時の接続URLは前述のattributes解説を参照。実際の呼び出しはregisterPath/updatePathの値を利用。
    // 登録情報はregisterDataに依存します。
    // 登録成功時の後処理はactionSuccessAfter、失敗時の後処理はactionFailureAfterを実装する事で差し込み可能です。
    register: function(event) {
      let $btn = this.startAction(event)
      let path = this.updateFlag ? this.updatePath() : this.registerPath()
      Lib.Log.debug(`- register url: ${this.apiUrl(path)}`)
      let param = this.registerData()
      if (0 < Object.keys(param).length) Lib.Log.debug(param)
      let success = (v) => {
        this.actionSuccess(v)
        this.endAction($btn)
      }
      let failure = (error) => {
        this.actionFailure(error)
        this.endAction($btn)
      }
      this.apiPost(path, param, success, failure)
    },
    // イベント開始処理を行います。
    // 具体的にはイベントオブジェクト(ボタンを想定)をdisableにして末尾に処理中のspinnerを表示します。
    startAction: function(event, el = null) {
      if (!event || !this.attr().spinner) return null
      let $btn = $(el ? el : event.target)
      $btn.disable()
      $btn.append('<i class="fa fa-spinner fa-spin l-spin-crud" />')
      return $btn
    },
    // イベント終了処理を行います。startActionの戻り値を引数に設定してください
    endAction: function($btn) {
      if (!$btn || !this.attr().spinner) return
      $('.l-spin-crud', $btn).remove()
      $btn.enable()
    },
    // 削除処理を行います。
    // 削除時の接続URLは前述のattributes解説を参照。実際の呼び出しはdeletePathの値を利用。
    // 削除成功時の後処理はactionSuccessAfter、失敗時の後処理はactionFailureAfterを実装する事で差し込み可能です。
    delete: function(event) {
      let $btn = this.startAction(event)
      let path = this.deletePath()
      Lib.Log.debug(`- delete url: ${this.apiUrl(path)}`)
      let success = (v) => {
        this.actionSuccess(v)
        this.endAction($btn)
      }
      let failure = (error) => {
        this.actionFailure(error)
        this.endAction($btn)
      }
      this.apiPost(path, {}, success, failure)
    },
    // 各種メッセージの他、登録情報を初期化します
    clear: function() {
      this.message()
      this.clearMessage()
      Object.keys(this.item).forEach((k) => this.$set(`item.${k}`, null))
    },
    // 登録モードで自身を表示します
    showRegister: function() {
      this.hide()
      this.updateFlag = false
      this.clear()
      this.$id().removeAttr("disabled")
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
      this.$id().attr('disabled', 'true')
      let v = _.clone(item)
      this.initUpdate(v)
      this.item = this.attr().flattenItem === true ? this.flattenItem(v) : v
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
      this.$dispatch('action-success-crud', v)
      if (this.attr().popup) {
        this.clear()
        this.hide()
      } else {
        if (this.updateFlag === false) this.clear()
        this.scrollTop()
        this.message(this.actionSuccessMessage(), 'success')
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
      var gwarn = null
      var cwarns = {}
      switch (xhr.status) {
        case 400:
          let warn = $.parseJSON(xhr.responseText)
          Object.keys(warn).forEach((key) => {
            let value = warn[key]
            if (key === '') {
              gwarn = value[0]
            } else {
              cwarns[key] = value[0]
            }
          })
          if (gwarn) {
            this.scrollTop()
          } else {
            this.scrollToColumn(this.attr().el.scrollBody, cwarns)
          }
      }
      this.actionFailureAfter(xhr, gwarn, cwarns)
    },
    // 登録/変更/削除時の失敗後処理を行います。
    actionFailureAfter: function(xhr, gwarn, cwarns) { /* 必要に応じて同名のメソッドで拡張実装してください */ },
    // 指定したbodyEl内の要素キーで例外を持つ最上位のコントロールへスクロール移動します。
    scrollToColumn: function(bodyEl, cwarns) {
      let keys = Object.keys(cwarns)
      if (0 < keys.length) {
        let $body = $(bodyEl, this.$main())
        let $target = this.$obj(keys[0])
        if (0 < $target.length) {
          let bodyTop = $body.offset() ? $body.offset().top : 0
          $body.scrollTop($target.offset().top - bodyTop + $body.scrollTop())
        } else {
          this.scrollTop()
        }
      }
    }
  }}
}
