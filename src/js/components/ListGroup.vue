<!-- 
- ListGroup.vue -
一覧表示機能を提供する Vue コンポーネント。
高さ固定レイアウトや処理中のスピン表示、自動ページング処理などに対応しています。

[template]
ListGroup(fixed=true, @bottom="next", :updating=updating)
  li.list-group-item(v-for="item in items")

※スクロール末尾で bottom イベントを発行しているため、上記例では末尾到達タイミングで親コンポーネント(VueList)のnextメソッドを呼び出しています。
-->
<template lang="pug">
div(:class="{'l-scrollable': fixed}", @scroll="scroll")
  ul.list-group
    li.list-group-item.l-list-wait-row(v-show="updating")
      i.fas.fa-spinner.fa-spin
    slot
</template>

<script lang="babel">
export default {
  name: 'list-group',
  props: {
    // 処理中判定フラグ。親コンポーネントの要素を指定してください。
    updating: {type: Boolean, default: false},
    // 固定モード。 true 時はルート要素に height 指定を行ってください。
    fixed: {type: Boolean, default: false}
  },
  methods: {
    scroll(e) {
      if (e.target.scrollHeight <= (e.target.scrollTop + e.target.offsetHeight)) {
        this.$emit('bottom')
      }
    }
  }
}
</script>