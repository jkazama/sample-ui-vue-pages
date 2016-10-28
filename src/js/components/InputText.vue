<!-- 
- InputText.vue -
入力用 Vue コンポーネント。
入力ボックスの標準レイアウト適用と例外表示、シンプルなイベント処理をサポートします。

[template]
InputText(field="absAmount", placeholder="出金金額",
  v-model="item.absAmount", :updating="updating", @enter="register")

※v-model のバインドは必須です。
※field 未設定時は例外メッセージを無視します。
※updating 指定時は処理中に disabled が有効化されます。
-->
<template lang="pug">
Message(:field="field")
  .input-group(v-if="suffix")
    input.form-control(:type="typeName", :placeholder="placeholder", :value="value",
      @input="onInput", @keydown.enter="onEnter", :disabled="updating")
    span.input-group-addon(v-text="suffix" v-if="suffixType == 'text'")
    span.input-group-btn(v-if="suffixType == 'button'")
      button.btn.btn-default(v-html="suffix", @click="onEnter")
  input.form-control(v-if="!suffix", :type="typeName", :placeholder="placeholder", :value="value",
      @input="onInput", @keydown.enter="onEnter", :disabled="updating")
</template>

<script lang="babel">
import * as Lib from 'platform/plain'
import Vue from 'vue'
import Message from 'components/Message.vue'
export default {
  name: 'input-text',
  components: { Message },
  props: {
    /** 例外メッセージ表示で利用されるフィールドキー */
    field: {type: String},
    /** placeholder 文字列 */
    placeholder: {type: String},
    /** 末尾文字列 (HTMLを許容するので取扱いには注意してください) */
    suffix: {type: String, default: null},
    /** 末尾文字種別 (text[default] or button) */
    suffixType: {type: String, default: "button"},
    /** パスワード種別判定 */
    password: {type: Boolean, default: false},
    /** 処理中フラグ */
    updating: {type: Boolean, default: false},
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
      this.$emit('enter', event)
    },
    onInput(event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>
