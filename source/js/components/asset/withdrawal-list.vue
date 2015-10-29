<style lang="sass"></style>

<template lang="jade">
.l-withdrawal-list
  div(v-message="global")
  .row
    .col-md-12
      .l-list-body.l-scrollable
        ul.list-group
          li.list-group-item.l-list-wait-row(v-show="updating" v-disable:spinner="updating")
          li.list-group-item.clearfix(v-for="item in items")
            .l-item.l-item-day(v-text="item.requestDay | day")
            .l-item.l-item-type
              .label.label-default(v-text="item.statusType")
            .l-item.l-item-currency.pull-right(v-text="item.currency")
            .l-item.l-item-amount.pull-right(v-text="item.absAmount | amount")
</template>

<script lang="babel">
import * as Option from "platform/vue-option"
export default new Option.PanelListBuilder({
  el: ".l-withdrawal-list",
  path: "/asset/cio/unprocessedOut/",
  created: function() { this.initialized() }
}).build()
</script>