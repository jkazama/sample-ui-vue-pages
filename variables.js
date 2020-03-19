/* ----------------------------------
 - variables.js -
 JS全般で利用されるグローバル変数定義
---------------------------------- */

import { Level } from './enums';
// #### Param [System]
export default {
  System: {
    logLevel: Level[process.env.VUE_APP_LOG_LEVEL]
  },
  // #### Param [Session]
  Session: {
    key: process.env.VUE_APP_SESSION_KEY
  },
  // #### Param [Api]
  Api: {
    // ## Time out for API request(Ajax) in milisecond
    timeout: 120000,
    // ## Time out for file upload in milisecond
    timeoutUpload: 300000,
    // ## API base path to Application Server
    root: process.env.VUE_APP_API_ROOT
  }
};
