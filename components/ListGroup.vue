<!--
- ListGroup.vue -
一覧表示機能を提供する Vue コンポーネント。
高さ固定レイアウトや処理中のスピン表示、自動ページング処理などに対応しています。

[template]
ListGroup(fixed=true, @bottom="next", :updating=updating)
  li.list-group-item(v-for="item in items")

※スクロール末尾で bottom イベントを発行しているため、上記例では末尾到達タイミングで親コンポーネント(VueList)のnextメソッドを呼び出しています。
-->
<style lang="scss" scoped>
.l-list-group-body {
  border: 1px solid #ddd;
  background-color: #efefef;
}
</style>

<template>
  <div
    class="l-list-group-body p-1"
    :class="{ 'l-scrollable': fixed }"
    :style="styleData"
    @scroll="scroll"
  >
    <ul class="list-group">
      <li v-show="updating" class="list-group-item text-center">
        <client-only>
          <font-awesome-icon v-if="updating" icon="spinner" spin />
        </client-only>
      </li>
      <slot />
    </ul>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
  name: 'ListGroup',
  props: {
    // 処理中判定フラグ。親コンポーネントの要素を指定してください。
    updating: { type: Boolean, default: false },
    // 固定モード。 true 時はルート要素に height 指定を行ってください。
    fixed: { type: Boolean, default: false },
    // 固定モード利用時の縦幅指定 [px]
    // 未指定時はウィンドウ幅を参考とした自動算出になります(モーダルでは適切に動作しません)
    fixedHeight: { type: Number, default: null },
    // 固定モードかつfixedHeight未指定時の末尾幅指定 [px]
    fixedBottom: { type: Number, default: 20 }
  },
  data() {
    return {
      height: 400,
      calculating: false
    };
  },
  computed: {
    styleData() {
      if (this.fixed) {
        const h = this.fixedHeight ? this.fixedHeight : this.height;
        return {
          height: h + 'px'
        };
      } else {
        return {};
      }
    },
    autoHeight() {
      return this.fixed && !this.fixedHeight;
    }
  },
  mounted() {
    if (this.autoHeight) {
      Vue.nextTick().then(() => {
        this.calculateHeight();
      });
      window.addEventListener('resize', this.calculateHeight);
    }
  },
  beforeDestroy() {
    if (this.autoHeight) {
      window.removeEventListener('resize', this.calculateHeight);
    }
  },
  methods: {
    scroll(e) {
      if (e.target.scrollHeight <= e.target.scrollTop + e.target.offsetHeight) {
        this.$emit('bottom');
      }
    },
    calculateHeight() {
      if (!this.calculating) {
        this.calculating = true;
        const top = this.$el.getBoundingClientRect().top;
        this.height = window.innerHeight - top - this.fixedBottom;
        this.calculating = false;
      }
    }
  }
};
</script>
