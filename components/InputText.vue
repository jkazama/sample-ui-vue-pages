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
<template>
  <message :field="field" :component-key="componentKey">
    <div v-if="suffix" class="input-group">
      <input
        class="form-control"
        :type="typeName"
        :placeholder="placeholder"
        :value="value"
        :disabled="updating"
        @input="onInput"
        @keydown.enter="onEnter"
      >
      <div v-if="suffixType" class="input-group-append">
        <span
          v-if="suffixType == 'text'"
          class="input-group-text"
          v-text="suffix"
        />
        <!-- eslint-disable vue/no-v-html -->
        <button
          v-if="suffixType == 'button'"
          class="btn btn-outline-secondary"
          @click="onEnter"
          v-html="suffix"
        />
        <!-- eslint-enable -->
      </div>
    </div>
    <input
      v-if="!suffix"
      class="form-control"
      :type="typeName"
      :placeholder="placeholder"
      :value="value"
      :disabled="updating"
      @input="onInput"
      @keydown.enter="onEnter"
    >
  </message>
</template>

<script>
import Message from './Message.vue';
export default {
  name: 'InputText',
  components: { Message },
  props: {
    /** 例外紐付け先コンポーネントキー（標準では親コンポーネント） */
    componentKey: { type: String, default: null },
    /** 例外メッセージ表示で利用されるフィールドキー */
    field: { type: String, default: null },
    /** placeholder 文字列 */
    placeholder: { type: String, default: null },
    /** 末尾文字列 (HTMLを許容するので取扱いには注意してください) */
    suffix: { type: String, default: null },
    /** 末尾文字種別 (text[default] or button) */
    suffixType: { type: String, default: 'button' },
    /** パスワード種別判定 */
    password: { type: Boolean, default: false },
    /** 処理中フラグ */
    updating: { type: Boolean, default: false },
    // from v-model
    value: { type: String, default: null }
  },
  computed: {
    typeName() {
      return this.password ? 'password' : 'text';
    }
  },
  methods: {
    onEnter(event) {
      this.$emit('enter', event);
    },
    onInput(event) {
      this.$emit('input', event.target.value);
    }
  }
};
</script>
