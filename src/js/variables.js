/*----------------------------------
 - variables.js -
 JS全般で利用されるグローバル変数定義
----------------------------------*/

import {Level} from "constants"

const debug = process.env.NODE_ENV !== 'production'

export default {
  //#### Param [System]
  System: {
    logLevel: debug ? Level.DEBUG : Level.INFO
  },
  //#### Param [Session]
  Session: {
    key: 'so'
  },
  //#### Param [Api]
  Api: {
    //## Time out for API request(Ajax) in milisecond
    timeout: 120000,
    //## Time out for file upload in milisecond
    timeoutUpload: 300000,

    //#### for local-api-test
    //## API base path to Application Server
    root: debug ? 'http://localhost:8080/api' : '/api'

    //#### for remote-api-test
    //## API base path to Application Server
    //root: 'http://192.168.xxx.xxx/api'
  }
}
