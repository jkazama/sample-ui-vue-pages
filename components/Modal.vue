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
<style lang="scss" scoped>
.l-modal-mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.l-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.l-modal-container {
  margin: 0px auto;
  transition: all 0.3s ease;
  background-color: #fff;
  padding: 1.2rem 2.4rem;
}
</style>

<template>
  <div v-show="show" class="l-modal-mask">
    <div class="l-modal-wrapper">
      <div class="l-modal-container" :class="styleClass" :style="styleData">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    /** モーダル表示をおこなうときはtrue */
    show: { type: Boolean, default: false },
    /** エスケープキーによるモーダル閉じを許容する時はtrue */
    escape: { type: Boolean, default: false },
    /** スタイルクラス定義 */
    styleClass: { type: Object, default: () => {} },
    /** モーダルの横幅指定 */
    styleWidth: { type: String, default: '800px' }
  },
  data() {
    return {
      eventFns: {}
    };
  },
  computed: {
    styleData() {
      return {
        width: this.styleWidth
      };
    }
  },
  mounted() {
    if (this.escape) {
      this.eventFns.keydown = e => {
        if (this.show && e.keyCode === 27) {
          this.$emit('hide', {});
        }
      };
      document.addEventListener('keydown', this.eventFns.keydown);
    }
  },
  destroyed() {
    if (this.escape) {
      document.removeEventListener('keydown', this.eventFns.keydown);
    }
  }
};
</script>
