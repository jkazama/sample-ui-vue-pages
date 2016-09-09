import Param from 'variables'
import * as Lib from "platform/plain"

const apiUrl = (path) => `${Param.Api.root}${path}`

export default {
  login(data, success, failure) {
    Lib.Ajax.post(apiUrl('/login'), data, success, failure)
  },
  logout() {
    Lib.Ajax.post(apiUrl('/logout'), {}, v => true, e => false)
  },
  loginStatus(success, failure) {
    Lib.Ajax.get(apiUrl('/account/loginStatus'), {}, success, failure)
  },
  loginAccount(success) {
    Lib.Ajax.get(apiUrl('/account/loginAccount'), {}, success, e => false)
  }
}