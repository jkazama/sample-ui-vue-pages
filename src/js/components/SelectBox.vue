<!-- 
- SelectBox.vue -
選択入力用 Vue コンポーネント。
選択入力の標準レイアウト適用と例外表示、シンプルなイベント処理をサポートします。

[template]
SelectBox(field="statusType", v-model="item.statusType", :options="statusTypes",
  @change="search", :updating="updating")

※v-model のバインドは必須です。
※field 未設定時は例外メッセージを無視します。
※updating 指定時は処理中に disabled が有効化されます。
-->
<template lang="pug">
Message(:field="field")
  select.form-control(:value="value", :class="styleClass", @change="onChange", :disabled="updating")
    option(v-for="option in selectOptions", :value="option.value")
      | {{ option.label }}
</template>

<script lang="babel">
import * as Lib from 'platform/plain'
import Vue from 'vue'
import Message from 'components/Message.vue'
export default {
  name: 'select-box',
  components: { Message },
  props: {
    /** 例外メッセージ表示で利用されるフィールドキー */
    field: {type: String, default: null},
    /** 値が空の時の表示文字列 */
    emptyword: {type: String, default: null},
    /** {label: 表示名, 値: value} なオブジェクト配列。単純な文字配列の時は同じ。 */
    options: {type: Array, default: []},
    /** 処理中フラグ */
    updating: {type: Boolean, default: false},
    // from v-model
    value: {required: true},
    /** スタイルクラス定義 */
    styleClass: {type: Object, default: () => {}},
  },
  computed: {
    selectOptions() {
      var values = []
      if (this.emptyword) {
        values.push({label: this.emptyword, value: null})
      }
      if (this.options) {
        this.options.forEach(v => {
          if (typeof v === "string") {
            values.push({label: v, value: v})
          } else {
            values.push({label: v.label, value: v.value})
          }
        })
      }
      return values
    }
  },
  methods: {
    onChange(event) {
      this.$emit('input', event.target.value)
      this.$emit('change', event)
    }
  }
}
</script>
