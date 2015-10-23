/*----------------------------------
 - ui.coffee -
 Vue.jsに依存しないUI関連の汎用関数群
----------------------------------*/

export class Select {
  /*
  # selectのoptionsへ設定するオブジェクト一覧を生成します。
  # 通常のオブジェクト一覧をtext/valueを保持するオブジェクト一覧へ変換します。
  # ---
  # list - key/value変換対象オブジェクト一覧
  # defaultLabel - 指定時は値が空のラベル要素を追加します
  # valueField - 指定したオブジェクトのvalueへバインドするフィールド名
  # textField - 指定したオブジェクトのtextへバインドするフィールド名
  */
  static values(list, defaultLabel = null, valueField='value', textField='text') {
    let items = Array.from(list).map((v) => {
      let text = v[textField] != null ? v[textField].toString() : ''
      let value = v[valueField] != null ? v[valueField].toString() : ''
      return {text: text, value: value}
    })
    return defaultLabel ? [{value: "", text: defaultLabel}].concat(items) : items
  }
  // 指定した年月に応じた日一覧(text/value)を返します。
  static calendarDay(year, month, defaultLabel = null) {
    if (!year || !month) return ""
    let daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth()
    let list = Array.from(new Array(daysInMonth).keys()).slice(1).map((v) => {return {text: v, value: v}})
    return this.values(list, defaultLabel)
  }
  // 指定した年に応じた月一覧(text/value)を返します。
  static calendarMonth(defaultLabel = null) {
    let list = Array.from(new Array(12).keys()).slice(1).map((v) => {return {text: v, value: v}})
    return this.values(list, defaultLabel)
  }
  // 指定した範囲の年一覧(text/value)を返します。
  // ---
  // size - maxからの表示範囲年数
  // max - 最大表示年。未指定時は今年
  // reverse - 一覧表示順。未指定時は昇順
  static calendarYear(defaultLabel = null, size=10, max=null, reverse = false) {
    let maxYear = max ? max : moment().format("YYYY")
    let minYear = maxYear - size
    let list = []
    if (reverse) {
      for (var i = maxYear; minYear <= i; i--) list.push({text: i, value: i})
    } else{
      for (var i = minYear; i <= maxYear; i++) list.push({text: i, value: i})
    } 
    return this.values(list, defaultLabel)
  }
  // 時間一覧(text/value)を返します。(24時間)
  static calendarHour(defaultLabel = null) {
    let list = Array.from(new Array(24).keys()).slice(1).map((v) => {return {text: v, value: v}})
    return this.values(list, defaultLabel)
  }
  // 時間一覧(text/value)を返します。(12時間)
  static calendarHourHalf(defaultLabel = null) {
    let list = Array.from(new Array(12).keys()).slice(1).map((v) => {return {text: v, value: v}})
    return this.values(list, defaultLabel)
  }
  // 分一覧(text/value)を返します。
  static calendarMinute(defaultLabel = null) {
    let list = Array.from(new Array(5).keys()).map((v) => {return {text: v * 10, value: v * 10}})
    return this.values(list, defaultLabel)
  }
}
