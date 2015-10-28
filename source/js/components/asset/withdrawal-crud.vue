<style lang="sass"></style>

<template lang="jade">
.l-withdrawal-crud
  .alert.alert-dismissible.l-message
  .row.l-row
    .col-md-4
      .input-group.l-model-absAmount
        input.form-control(type="text" placeholder="出金金額" v-model="item.absAmount" @keydown.enter="register")
        span.input-group-addon 円
    .col-md-2
      button.btn.btn-default.btn-block(@click="register") 依頼する
  .row.l-row
    .col-md-12
      .alert.alert-warning 出金依頼に関わる注記文言を記載。動作確認用サンプルなので導線なり重複依頼はルーズに。
</template>

<script lang="babel">
import * as Option from "platform/vue-option"
export default new Option.PanelCrudBuilder({
  el: ".l-withdrawal-crud",
  path: "/asset/cio/withdraw",
  data: {
    item: {
      absAmount: ""
    }
  },
  created: function() {
    this.initialized()
  },
  methods: {
    actionSuccessMessage: function() { return "依頼を受け付けました" },
    registerData: function() {
      this.item.currency = "JPY"
      return this.item
    }
  }
}).build()
</script>