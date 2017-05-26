<!-- 
- Modal.vue -
コンテンツのモーダル機能を提供する Vue コンポーネント。

[template]
Modal(:show="modalAny", @hide="hideAnyModal", escape=true)
  .panel.panel-default
    .panel-body
      | any contents
      CommandButton(@click="hideAnyModal") 閉じる
CommandButton(@click="showAnyModal") 開く

※ @hide イベント指定は escape=true のときのみ必要

[js]
data() {
  return {
    modalAny: false
  }
},
methods: {
  showAnyModal() {
    this.modalAny = true
  },
  hideAnyModal() {
    this.modalAny = false
  }
}

※ モーダル幅を調整したいときは .l-modal-container の width や height を明示的に指定してください。
-->
<style lang="scss">
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
.l-modal-mask(v-show="show")
  .l-modal-wrapper
    .l-modal-container
      slot
</template>

<script lang="babel">
export default {
  name: 'modal',
  data() {
    return {
      eventFns: {}
    }
  },
  props: {
    /** モーダル表示をおこなうときはtrue */
    show: {type: Boolean, default: false},
    /** エスケープキーによるモーダル閉じを許容する時はtrue */
    escape: {type: Boolean, default: false},
  },
  mounted() {
    if (this.escape) {
      this.eventFns.keydown = (e) => {
        if (this.show && e.keyCode == 27) this.$emit('hide', {})
      }
      document.addEventListener("keydown", this.eventFns.keydown)
    }
  },
  destroyed() {
    if (this.escape) {
      document.removeEventListener("keydown", this.eventFns.keydown)
    }
  }
}
</script>
