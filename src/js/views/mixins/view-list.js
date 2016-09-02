import Param from 'variables'
import {Level, Action} from 'constants'
import * as Lib from 'platform/plain'

import ViewBasic from 'views/mixins/view-basic'

/**
 * 検索を前提とした Vue Mixin コンポーネント
 * 一覧パネル等で利用してください。ページング検索(自動ロード方式)もサポートしています。
 * (API側でPagingListを返す必要があります)
 * 本クラスを利用する際は初期化時に以下の設定が必要です。
 * ・path属性の定義
 * ---
 * - Props -
 * initialSearch: 初回検索を行うか(未指定時はtrue)
 * paging: ページング検索を行うか(未指定時はfalse)
 * path: 検索APIパス(必須: 標準でapiUrlへ渡されるパス)
 * actionSuccessKey: 処理成功時に $emit されるイベントキー
 * - Data -
 * items: 検索結果一覧
 * page: ページング情報
 * updating: 処理中の時はtrue
 * - 標準API -
 * search: 検索する
 * next: ページング時に次ページを呼び出してitemsへ追加する
 * searchData: 検索条件をハッシュで生成する
 * searchPath: 検索時の呼び出し先URLパスを生成する(apiUrlへ渡されるパス)
 */
export default {
  data() {
    return {
      items: [],
      page: (this.paging ? {page: 1, total: 0} : null),
      updating: false
    }
  },
  mixins: [ViewBasic],
  components: {},
  props: {
    initialSearch: {type: Boolean, default: true},
    paging: {type: Boolean, default: false},
    path: {type: String, required: true},
    // 検索完了後に emit されるイベントキー
    actionSuccessKey: {type: String, default: Action.SearchSuccess}
  },
  created() {
    this.clear()
    this.initialized()
  },
  methods: {
    // 初期化後処理
    // ・初期検索を実行
    initialized() {
      if (this.initialSearch) this.search()
    },
    // 検索処理を行います
    // 検索時の接続URLはsearchPath、検索条件はsearchDataに依存します。
    // 検索成功時の後処理はlayoutSearchを実装する事で差し込み可能です。
    search() { this.renderSearch() },
    // 次ページの検索を行います。
    // 検索結果は一覧にそのまま追加されます。
    // ※タイミングによっては重複レコードが発生しますが、現時点ではそれらを取り除く処理は実装していません。
    next() {
      if (!this.paging) return
      this.page.page = this.page.page + 1
      Lib.Log.debug(`- search next to ${this.page.page}`)
      this.renderSearch(true)
    },
    // 各種メッセージの他、検索結果を初期化します
    clear() {
      this.clearMessage()
      Vue.set(this, 'items', [])
    },
    // 検索条件となるハッシュ情報を返します。
    searchData() { /* 利用先で設定してください */ return {} },
    // 検索時のURLパスを返します。ここで返すURLパスはapiUrlの引数に設定されます。
    searchPath() { return this.path },
    // 検索を行います。appendがfalseのときは常に一覧を初期化します。
    renderSearch(append = false) {
      Lib.Log.debug(`- search url: ${this.apiUrl(this.searchPath())}`)
      let param = this.searchData()
      if (0 < Object.keys(param).length) Lib.Log.debug(param)
      if (append === false) {
        this.clear()
        if (this.page) this.page.page = 1
      }
      if (this.paging) {
        param["page.page"] = this.page.page
      }
      this.updating = true
      let success = (data) => {
        this.updating = false
        this.renderList(data, append)
        EventEmitter.$emit(this.actionSuccessKey, data)
      }
      let failure = (error) => {
        this.updating = false
        this.apiFailure(error)
      }
      this.apiGet(this.searchPath(), param, success, failure)
    },
    // 検索結果をitemsへ格納します。
    // itemsがv-for等で画面要素と紐づいていた時は画面側にも内容が反映されます。
    renderList(data, append) {
      Lib.Log.debug('- search result -')
      Lib.Log.debug(data)
      let list = () => {
        if (this.paging) {
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
        Vue.set(this, 'items', list())
      }
    }
  }
}