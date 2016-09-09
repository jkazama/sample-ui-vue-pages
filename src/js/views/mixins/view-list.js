import Param from 'variables'
import {Level} from 'constants'
import * as Lib from 'platform/plain'
import Vue from 'vue'

import ViewBasic from 'views/mixins/view-basic'

/**
 * 検索を前提とした Vue Mixin コンポーネント
 * 一覧パネル等で利用してください。ページング検索(自動ロード方式)もサポートしています。
 * (API側でPagingListを返す必要があります)
 * 本クラスを利用する際は初期化時に以下の設定が必要です。
 * ・actionの実装
 * ---
 * - Props -
 * initialSearch: 初回検索を行うか(未指定時はtrue)
 * paging: ページング検索を行うか(未指定時はfalse)
  * - Data -
 * items: 検索結果一覧
 * page: ページング情報
 * updating: 処理中の時はtrue
 * - 標準API -
 * search: 検索します。
 * next: ページング時に次ページを呼び出してitemsへ追加します。
 * searchData: 検索条件をハッシュで生成します。
 * action: 実際の検索アクションを実装してください。 (必須)
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
    paging: {type: Boolean, default: false}
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
    // 検索時の処理はaction、検索条件はsearchDataに依存します。
    search() { this.renderSearch() },
    searchData() { return {} },
    action(param, success, failure) {
      Lib.Log.error('利用先でメソッドを実装してください [action]')
    },
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
    // 検索を行います。appendがfalseのときは常に一覧を初期化します。
    renderSearch(append = false) {
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
      }
      let failure = (error) => {
        this.updating = false
        this.apiFailure(error)
      }
      this.action(param, success, failure)
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