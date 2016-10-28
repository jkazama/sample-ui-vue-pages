<!-- 
- CommandButton.vue -
ボタン Vue コンポーネント。
ボタンの標準レイアウト適用とシンプルなイベント処理をサポートします。

[template]
CommandButton(@click="register", :updating="updating") OK
-->
<template lang="pug">
button.btn.btn-default.btn-block(disabled=updating, @click="onClick")
  slot
  i.fa.fa-spinner.fa-spin(v-if="updating")
</template>

<script lang="babel">
export default {
  name: 'command-button',
  props: {
    updating: {type: Boolean, default: false}
  },
  methods: {
    onClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>