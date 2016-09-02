/*----------------------------------
 - constants.js -
 JS全般で利用される定数
----------------------------------*/

// ログレベル定数
export const Level = {
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40
}

// イベント定数
export const Event = {
  Messages: "vue-event-messages",
  Login: 'vue-event-login',
  Logout: 'vue-event-logout'
}

// 実行アクション定数
export const Action = {
  Success: 'vue-action-success',
  Failure: 'vue-action-failure',
  SearchSuccess: 'vue-action-search-success'
}