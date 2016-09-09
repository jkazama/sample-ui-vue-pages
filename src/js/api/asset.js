import Param from 'variables'
import * as Lib from "platform/plain"

const apiUrl = (path) => `${Param.Api.root}${path}`

export default {
  // 出金依頼をします。
  withdraw(data, success, failure) {
    Lib.Ajax.post(apiUrl('/asset/cio/withdraw'), data, success, failure)
  },
  // 未処理の出金情報を検索します。
  findUnprocessedOut(data, success, failure) {
    Lib.Ajax.get(apiUrl('/asset/cio/unprocessedOut/'), data, success, failure)
  }
}