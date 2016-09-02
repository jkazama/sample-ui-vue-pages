<!-- 
- Modal.vue -
コンテンツのモーダル機能を提供する Vue コンポーネント。

[template]
Modal(ref="anyRefName")
  .panel.panel-default
    .panel-body

[js]
this.$refs.anyRefName.show() // 表示
this.$refs.anyRefName.hide() // 非表示

※ モーダル幅を調整したいときは .l-modal-container の width や height を明示的に指定してください。
-->
<style lang="sass">
.l-modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}
.l-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.l-modal-container {
  width: 600px;
  margin: 0px auto;
  transition: all .3s ease;
}
</style>

<template lang="pug">
.l-modal-mask(v-show="showModal")
  .l-modal-wrapper
    .l-modal-container(@keydown.esc="hide")
      slot
</template>

<script lang="babel">
export default {
  name: 'modal',
  data() {
    return {
      showModal: false,
      eventFns: {}
    }
  },
  mounted() {
    this.eventFns.keydown = (e) => {
      if (this.showModal && e.keyCode == 27) this.hide()
    }
    document.addEventListener("keydown", this.eventFns.keydown)
  },
  destroyed() {
    document.removeEventListener("keydown", this.eventFns.keydown)
  },
  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    }
  }
}
</script>