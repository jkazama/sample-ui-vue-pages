<!--
- CommandButton.vue -
ボタン Vue コンポーネント。
ボタンの標準レイアウト適用とシンプルなイベント処理をサポートします。

[template]
CommandButton(@click="register", :updating="updating") OK
-->
<template>
  <button
    class="btn btn-secondary btn-block"
    :disabled="invalid"
    @click="onClick"
  >
    <slot />
    <font-awesome-icon v-if="updating" icon="spinner" spin />
  </button>
</template>

<script>
export default {
  name: 'CommandButton',
  props: {
    updating: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  computed: {
    invalid() {
      return this.updating || this.disabled;
    }
  },
  methods: {
    onClick(e) {
      this.$emit('click', e);
    }
  }
};
</script>
