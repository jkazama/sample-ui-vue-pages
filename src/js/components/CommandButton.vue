<!-- 
- CommandButton.vue -
ボタン Vue コンポーネント。
ボタンの標準レイアウト適用とシンプルなイベント処理をサポートします。

[template]
CommandButton(@click.native="register", :updating="updating") OK

※上記例では native を付与して直接親コンポーネントのメソッドを実行しています。
-->
<template lang="pug">
button.btn.btn-default.btn-block(disabled=updating)
  slot
  i.fa.fa-spinner.fa-spin(v-if="updating")
</template>

<script lang="babel">
export default {
  name: 'command-button',
  props: {
    updating: {type: Boolean, default: false}
  },
  methods: {}
}
</script>