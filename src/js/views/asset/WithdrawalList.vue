<style lang="sass">
.l-list-body {
  height: 210px;
}
</style>
<template lang="pug">
.l-withdrawal-list
  .row
    .col-md-12
      ListGroup(fixed=true, @bottom="next", :updating="updating").l-list-body
        li.list-group-item.clearfix(v-for="item in items")
          .l-item.l-item-day {{item.requestDay | day}}
          .l-item.l-item-type
            .label.label-default {{item.statusType}}
          .l-item.l-item-currency.pull-right  {{item.currency}}
          .l-item.l-item-amount.pull-right {{item.absAmount | amount}}
</template>

<script lang="babel">
import ViewList from "views/mixins/view-list"
export default {
  mixins: [ViewList],
  props: {
    path: {default: "/asset/cio/unprocessedOut/"}
  }
}
</script>