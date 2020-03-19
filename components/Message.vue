<!--
- Message.vue -
エラーメッセージ表示機能を提供する Vue コンポーネント。
グローバルイベント(Event.Messages)で通知された内容を表示します。

[template]
Message(global=true)
Message(global=true, globalKey=anyEventKey)
Message(field=anyMessageKey)
  <input type="text" …
-->
<style lang="scss" scoped>
.l-message-global {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1;
}
.l-message-group {
  display: block;
  input,
  textarea,
  select {
    border-color: #ed4c4c;
    background-color: #f6e3e3;
  }
  .l-message-group-item {
    font-size: 75%;
    padding: 0.2em;
    margin-bottom: 0.2em;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div>
    <div v-if="global && message">
      <transition v-if="notification" name="fade">
        <div class="l-message-global">
          <div
            v-if="message"
            class="alert p-2"
            :class="[classAlert, classText]"
          >
            <font-awesome-icon icon="exclamation-triangle" /> &nbsp;{{
              message
            }}
          </div>
        </div>
      </transition>
    </div>
    <div v-if="!global">
      <div :class="{ 'input-group': message, 'l-message-group': message }">
        <slot />
        <div v-if="message" class="l-message-group-item" :class="[classText]">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Level } from '@/enums';
export default {
  name: 'Message',
  props: {
    // グローバル例外表示フラグ
    global: { type: Boolean, default: false },
    // グローバル例外識別キー
    globalKey: { type: String, default: null },
    // フィールド例外表示キー (グローバル例外表示フラグが false 時に有効)
    field: { type: String, default: null },
    // グローバル例外表示期間（msec）
    showTime: { type: Number, default: 2000 }
  },
  data() {
    return {
      classAlert: null,
      classText: null,
      notification: false
    };
  },
  computed: {
    message() {
      if (this.global) {
        return this.globalMessage(this.$store.state.context.message.global);
      } else {
        return this.columnMessage(this.$store.state.context.message.columns);
      }
    }
  },
  methods: {
    globalMessage(msg) {
      this.notification = false;
      let message = msg.message;
      message = Array.isArray(message) ? message[0] : message;
      const valid = this.globalKey ? this.globalKey === msg.messageKey : true;
      if (message && valid) {
        const type = this.messageType(msg.level);
        this.classAlert = `alert-${type}`;
        this.classText = null;
        this.notification = true;
        setTimeout(() => {
          this.notification = false;
        }, this.showTime);
        return message;
      } else {
        this.classAlert = null;
        this.classText = null;
        return null;
      }
    },
    columnMessage(columns) {
      if (columns && columns.length > 0) {
        const column = Array.from(columns).find(v => v.key === this.field);
        const type = this.messageType(column.level);
        this.classText = `text-${type}`;
        return column ? column.messages[0] : null;
      }
      return null;
    },
    messageType(level) {
      switch (level) {
        case Level.INFO:
          return 'success';
        case Level.WARN:
          return 'warning';
        case Level.ERROR:
          return 'danger';
        default:
          return 'default';
      }
    }
  }
};
</script>
