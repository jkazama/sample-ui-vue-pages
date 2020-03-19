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
<template>
  <message :field="field" :component-key="componentKey">
    <select
      class="form-control"
      :value="value"
      :class="styleClass"
      :disabled="disabled || updating"
      @change="onChange"
    >
      <option
        v-for="option in selectOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </message>
</template>

<script>
import Message from './Message.vue';
export default {
  name: 'SelectBox',
  components: { Message },
  props: {
    /** 例外紐付け先コンポーネントキー（標準では親コンポーネント） */
    componentKey: { type: String, default: null },
    /** 例外メッセージ表示で利用されるフィールドキー */
    field: { type: String, default: null },
    /** 値が空の時の表示文字列 */
    emptyword: { type: String, default: null },
    /** {label: 表示名, 値: value} なオブジェクト配列。単純な文字配列の時は同じ。 */
    options: { type: Array, default: () => [] },
    /** 処理中フラグ */
    updating: { type: Boolean, default: false },
    // from v-model
    value: { type: String, required: true },
    /** スタイルクラス定義 */
    styleClass: { type: Object, default: () => {} }
  },
  computed: {
    selectOptions() {
      const values = [];
      if (this.emptyword) {
        values.push({ label: this.emptyword, value: null });
      }
      if (this.options) {
        this.options.forEach(v => {
          if (typeof v === 'string') {
            values.push({ label: v, value: v });
          } else {
            values.push({ label: v.label, value: v.value });
          }
        });
      }
      return values;
    }
  },
  methods: {
    onChange(event) {
      this.$emit('input', event.target.value);
      this.$emit('change', event);
    }
  }
};
</script>
