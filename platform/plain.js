/* ----------------------------------
 - plain.js -
 JS全般で利用されるグローバル処理定義
---------------------------------- */

import axios from 'axios';
import moment from 'moment';

import { Level } from '@/enums';
import Param from '@/variables';

// ## ログユーティリティ
// variables.jsでログ出力レベルを変更させる事が可能です。
export class Log {
  static debug(msg) {
    if (this.valid(Level.DEBUG)) {
      this.console('[DEBUG] ', msg);
    }
  }
  static info(msg) {
    if (this.valid(Level.INFO)) {
      this.console('[INFO] ', msg);
    }
  }
  static warn(msg) {
    if (this.valid(Level.WARN)) {
      this.console('[WARN] ', msg);
    }
  }
  static error(msg) {
    if (this.valid(Level.ERROR)) {
      this.console('[ERROR] ', msg);
    }
  }
  static valid(checkLevel) {
    return Param.System.logLevel <= checkLevel;
  }
  static console(prefix, obj) {
    if (console) {
      // eslint-disable-next-line
      console.log(prefix, obj);
    }
  }
}

// ## 非同期API要求ユーティリティ
// リクエストは Form 戻り値はJSON形式を想定とします。
axios.defaults.baseURL = Param.Api.root;
axios.defaults.headers.common.Expires = -1;
axios.defaults.headers.common['Cache-Control'] =
  'no-cache,no-store,must-revalidate,max-age=-1,private';
axios.defaults.withCredentials = true;
export class Ajax {
  // GET形式のPromiseを返します。
  static promiseGet(url, data = {}) {
    const params = new URLSearchParams();
    Object.keys(data).forEach(key => {
      if (data[key]) {
        params.append(key, data[key]);
      }
    });
    return axios.get(this.requestUrl(url), { params });
  }
  // GET形式でサーバ側へリクエスト処理をします。
  static get(
    url,
    data = {},
    success = this.handleSuccess,
    failure = this.handleFailure
  ) {
    this.promiseGet(url, data)
      .then(res => {
        if (success) {
          success(res.data);
        }
      })
      .catch(err => {
        this.handlePreFailure(err);
        if (failure) {
          failure(err);
        }
      });
  }
  // POST形式のPromiseを返します。
  static promisePost(url, data = {}) {
    return axios.post(this.requestUrl(url), data);
  }
  // POST形式でサーバ側へリクエスト処理をします。
  static post(
    url,
    data = {},
    success = this.handleSuccess,
    failure = this.handleFailure
  ) {
    this.promisePost(url, data)
      .then(res => {
        if (success) {
          success(res.data);
        }
      })
      .catch(err => {
        this.handlePreFailure(err);
        if (failure) {
          failure(err);
        }
      });
  }
  // POST - Form形式のPromiseを返します。
  static promisePostForm(url, data = {}) {
    const params = new URLSearchParams();
    Object.keys(data).forEach(key => params.append(key, data[key]));
    const config = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    };
    return axios.post(this.requestUrl(url), params, config);
  }
  // POST - FOrm形式でサーバ側へリクエスト処理をします。
  static postForm(
    url,
    data = {},
    success = this.handleSuccess,
    failure = this.handleFailure
  ) {
    this.promisePostForm(url, data)
      .then(res => {
        if (success) {
          success(res.data);
        }
      })
      .catch(err => {
        this.handlePreFailure(err);
        if (failure) {
          failure(err);
        }
      });
  }
  // アップロード形式のPromiseを返します。
  static promiseUpload(url, data = {}) {
    const form = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key]) {
        form.append(key, data[key]);
      }
    });
    return axios.post(this.requestUrl(url), form);
  }
  // 指定したURLに対するアップロード処理をします。
  // 指定されたハッシュデータはFormDataへ紐付けられて送信されます。
  static upload(
    url,
    data = {},
    success = this.handleSuccess,
    failure = this.handleFailure
  ) {
    this.promiseUpload(url, data)
      .then(res => {
        if (success) {
          success(res.data);
        }
      })
      .catch(err => {
        this.handlePreFailure(err);
        if (failure) {
          failure(err);
        }
      });
  }
  // 接続先URLパスを整形します。
  static requestUrl(url) {
    // for nocache
    const time = Date.now().toString();
    if (url && url.includes('?')) {
      url += '&' + time;
    } else {
      url += '?' + time;
    }
    return url;
  }
  // リクエスト成功時の標準処理を行います。
  static handleSuccess(data) {
    Log.info(data);
  }
  // リクエスト失敗時の事前処理を行います。
  static handlePreFailure(err) {
    const res = err.response;
    if (res && res.status) {
      Log.warn('[' + res.status + '] ' + res.statusText);
      switch (res.status) {
        case 0:
          Log.error('接続先が見つかりませんでした');
          break;
        case 200:
          Log.error(
            '戻り値の解析に失敗しました。JSON形式で応答が返されているか確認してください'
          );
          break;
        case 400:
          Log.warn(res.data);
          break;
        case 401:
          Log.error('機能実行権限がありません');
          break;
        default:
          Log.error(res.data);
      }
    } else {
      Log.error(err);
    }
  }
  // リクエスト失敗時の処理を行います。
  // eslint-disable-next-line
  static handleFailure(err) {
    // nothing.
  }
}

// ## フォーマットユーティリティ
export class Formatter {
  static format(type, value) {
    switch (type) {
      case 'day':
        return value ? moment(value).format('YYYY/MM/DD') : '';
      case 'amount':
        return value || value === 0
          ? value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')
          : '';
      default:
        return value.toString();
    }
  }
}

// ## グローバルユーティリティ
export class Utils {
  // URLの引数を解析してハッシュを返します
  static parseQuery(url = null) {
    const target = url || window.location.search;
    if (!target) {
      return {};
    }
    const idx = target.indexOf('?');
    const query = idx === -1 ? target : target.substring(idx + 1);
    const values = query.split('&');
    const ret = {};
    Array.from(values)
      .map(v => v.split('='))
      .filter(pair => pair && pair.length === 2)
      .forEach(
        pair => (ret[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]))
      );
    return ret;
  }
  // 引数に与えたハッシュオブジェクトでネストされたものを「.」付の一階層へ変換します。(引数は上書きしません)
  // {a: {b: {c: 'd'}}} -> {'a.b.c': 'd'}
  // see http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
  static flatten(data) {
    const ret = {};
    const recurse = (v, prop) => {
      if (Object(v) !== v) {
        ret[prop] = v;
      } else if (Array.isArray(v)) {
        Array.from(v).forEach((value, i) => recurse(value, `prop[${i}]`));
        if (v.length === 0) {
          ret[prop] = [];
        }
      } else {
        let empty = true;
        Object.keys(v).forEach(key => {
          const value = v[key];
          empty = false;
          recurse(value, prop ? `${prop}.${key}` : key);
        });
        if (empty && prop) {
          ret[prop] = {};
        }
      }
    };
    recurse(data, '');
    return ret;
  }
}
