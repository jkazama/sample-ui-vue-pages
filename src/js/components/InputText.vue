<!-- 
- InputText.vue -
入力用 Vue コンポーネント。
入力ボックスの標準レイアウト適用と例外表示、シンプルなイベント処理をサポートします。

[template]
InputText(field="absAmount", placeholder="出金金額", suffix="円",
  v-model="item.absAmount", :updating="updating", :enter="register")

※v-model のバインドは必須です。
※field 未設定時は例外メッセージを無視します。
※updating 指定時は処理中に disabled が有効化されます。
-->
<template lang="pug">
Message(:field="field")
  .input-group(v-if="suffix")
    input.form-control(:type="typeName", :placeholder="placeholder", :value="value",
      @keydown="$emit('input', $event.target.value)", @keydown.enter="onEnter", :disabled="updating")
    span.input-group-addon(v-text="suffix" v-if="suffix")
  input.form-control(v-if="!suffix", :type="typeName", :placeholder="placeholder", :value="value",
      @keydown="$emit('input', $event.target.value)", @keydown.enter="onEnter", :disabled="updating")
</template>

<script lang="babel">
import * as Lib from 'platform/plain'
import Message from 'components/Message.vue'
export default {
  name: 'input-text',
  components: { Message },
  props: {
    /** 例外メッセージ表示で利用されるフィールドキー */
    field: {type: String},
    /** placeholder 文字列 */
    placeholder: {type: String},
    /** 末尾文字列 */
    suffix: {type: String, default: null},
    /** パスワード種別判定 */
    password: {type: Boolean, default: false},
    /** 処理中フラグ */
    updating: {type: Boolean, default: false},
    /** Enter キー押下事の処理イベント */
    enter: {type: Function},
    // from v-model
    value: {required: true}
  },
  computed: {
    typeName() {
      return this.password ? 'password' : 'text'
    }
  },
  methods: {
    onEnter(event) {
      if (this.enter) {
        this.enter(event)
      } else {
        Lib.Log.debug('enter empty executed. please set v-bind:enter="yourParentMethodName"')
      }
    }
  }
}
</script>