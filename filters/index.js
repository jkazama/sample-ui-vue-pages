/* ----------------------------------
 Vue.jsのカスタムフィルタ定義
 カスタムフィルタは変数を表示する際に値のフォーマッティングなどを可能にします。
 例: {{createDay | day}}
 参考:
 http://jp.vuejs.org/guide/custom-filter.html
 https://github.com/vuejs/vue/issues/2756
---------------------------------- */

import moment from 'moment';

// 値が未設定の場合に引数へ与えた標準ラベルを表示します。
export function defaultText(v, label = '-') {
  return v || label;
}

// 値に改行が含まれていたときに<br>タグへ変換します。
export function multiline(v) {
  return v ? v.replace(/\r?\n/g, '<br/>') : '';
}

// 日付を「/」区切りのフォーマットへ変換します。
export function day(v) {
  return v ? moment(v).format('YYYY/MM/DD') : '';
}

// 日付を「年月日」形式のフォーマットへ変換します。
export function dayJp(v) {
  return v ? moment(v).format('YYYY年MM月DD日') : '';
}

// 日時型を「yyyy/MM/dd hh:mm」形式へ変換します。引数にtrueを指定したときは秒も含めます。
export function date(v, s = 'true') {
  let fmt = 'YYYY/MM/DD HH:mm';
  if (s === 'true') {
    fmt = `${fmt}:ss`;
  }
  return v ? moment(v).format(fmt) : '';
}

// 日時型を「hh:mm:ss」形式へ変換します。
export function time(v) {
  return v ? moment(v).format('HH:mm:ss') : '';
}

// 日付を「yyyy/MM」形式へ変換します。
export function month(v) {
  return v ? moment(v).format('YYYY/MM') : '';
}

// 日付を「yyyy年MM月」形式へ変換します。
export function monthJp(v) {
  return v ? moment(v).format('YYYY年MM月') : '';
}

// 金額を「,」区切りへ変換します。
export function amount(v) {
  if (v) {
    return v.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  } else if (v != null && v.toString() === '0') {
    return '0';
  } else {
    return '';
  }
}

// 金額を「,」区切りへ変換します。末尾に円を付与します。
export function amountYenWith(v) {
  const unit = ' 円';
  if (v) {
    return v.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + unit;
  } else if (v != null && v.toString() === '0') {
    return `0${unit}`;
  } else {
    return '';
  }
}

// 数量を「,」区切りへ変換します。
export function quantity(v) {
  if (v) {
    return v.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  } else if (v != null && v.toString() === '0') {
    return '0';
  } else {
    return '';
  }
}

// 割合の末尾に%を付与します。
export function rate(v) {
  return v ? `${v} %` : '';
}
