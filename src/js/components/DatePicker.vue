<!-- 
- DatePicker.vue -
日付/日時入力用 Vue コンポーネント。
入力ボックスの標準レイアウト適用と例外表示、シンプルなイベント処理をサポートします。

[template]
DatePicker(field="requestDay", v-model="item.requestDay", from-today=true, placeholder="希望日")

※v-model のバインドは必須です。
※field 未設定時は例外メッセージを無視します。
※updating 指定時は処理中に disabled が有効化されます。

内部で Flatpickr を利用しています。細かいオプションについては以下を参照してください。
https://chmln.github.io/flatpickr/
-->
<style lang="sass">
.form-control[readonly] {
  background-color: #fafafa;
}
</style>
<template lang="pug">
Message(:field="field")
  .input-group
    input.form-control(type="text", :placeholder="placeholder", :value="value", :disabled="updating")
    span.input-group-btn(v-if="time")
      button.btn.btn-default
        i.fa.fa-check
    span.input-group-btn
      button.btn.btn-default(@click="clearDate")
        i.fa.fa-times
</template>

<script lang="babel">
import * as Lib from 'platform/plain'
import moment from 'moment'
import Vue from 'vue'
import Message from 'components/Message.vue'
import Flatpickr from 'flatpickr'
// for localize
Flatpickr.l10n.weekdays = {
  shorthand: ['日', '月', '火', '水', '木', '金', '土'],
  longhand: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日']
}
Flatpickr.l10n.months = {
  shorthand: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  longhand: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
}
export default {
  name: 'date-picker',
  components: { Message },
  props: {
    /** 例外メッセージ表示で利用されるフィールドキー */
    field: {type: String},
    /** placeholder 文字列 */
    placeholder: {type: String},
    /** 拡張設定 */
    config: {type: Object, default: () => {}},
    /** 本日以降のみを選択可能にするか */
    fromToday: {type: Boolean, default: false},
    /** 時間表示判定 */
    time: {type: Boolean, default: false},
    /** 秒表示判定 */
    seconds: {type: Boolean, default: false},
    /** 処理中フラグ */
    updating: {type: Boolean, default: false},
    // from v-model
    value: {required: true}
  },
  data() {
    return {
      datepicker: null
    }
  },
  computed: {
  },
  mounted() {
    if (!this.datepicker) {
      let config = Object.assign({
        enableTime: this.time,
        enableSeconds: this.seconds,
        time_24hr: true,
        minDate: this.fromToday ? moment().format("YYYY-MM-DD") : null,
      }, this.config)
      this.datepicker = new Flatpickr(this.$el.querySelector("input"), config)
      this.datepicker.set('onChange', (d, v) => {
        this.updateValue(v)
      })
    }
  },
  beforeDestroy () {
    if (this.datepicker) {
      this.datepicker.destroy()
      this.datepicker = null
    }
  },
  methods: {
    updateValue(v){
      this.$emit('input', v)
    },
    clearDate() {
      this.updateValue(null)
    }
  }
}
</script>
