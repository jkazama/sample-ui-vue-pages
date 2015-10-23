/** Directive
 * Vue.jsのカスタムディレクティブを定義します。
 * カスタムディレクティブはHTMLエレメントに「v-datepicker」など、新しい拡張属性を加えるものです。
 *# 例: input type="text" v-datepicker="item.testDay"
 * 参考: http://jp.vuejs.org/guide/custom-directive.html
 */
export default function() {
  /**
   * v-datepickerを定義したコンポーネントを日付選択コンポーネントへ変更します。
   * bootstrap-datepickerを有効とします。
   * 形式   [datepickerオプション] : [フィールドキー]
   * 使用例 v-datepicker="item.testDay"
   * 使用例 v-datepicker="'{autoclose: false}' : item.testDay"
   */
  Vue.directive('datepicker', {
    twoWay: true,
    bind: () => {
      // セパレート無しのformatは直接指定時に挙動が不安定になるので注意
      var options = {
        format: 'yyyy/mm/dd',   // datepicker format
        vmFormat: 'YYYY-MM-DD', // moment format
        weekStart: 1,
        todayBtn: 'linked',
        language: 'ja',
        autoclose: true,
        toggleActive: true,
        todayHighlight: true
      }
      let updOptions = this.arg ? eval(`(${this.arg})`) : {}
      if (updOptions) Object.keys(updOptions).forEach((k) => options[k] = updOptions[k])
      options.format = options.format.toLowerCase()
      this.format = options.format.toUpperCase()
      this.vmFormat = options.vmFormat
      this.$input = $(this.el).datepicker(options)
      // JQuery側データ変更検知
      this.$input.on('change', () => {
        day = this.$input.val()
        this.set(day ? moment(day, this.format).format(this.vmFormat) : null)
      })
    },
    unbind: () => { this.$input.off('change') },
    // VM側データ変更検知
    update: (day) => {
      if (day) this.$input.datepicker('update', moment(day, this.vmFormat).format(this.format))
    }
  })
}
