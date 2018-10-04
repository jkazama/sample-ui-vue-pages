<style lang="scss">
.l-list-body {
  height: 30rem;
}
</style>
<template lang="pug">
.row: .col
  ListGroup(fixed=true, @bottom="next", :updating="updating").l-list-body
    li.list-group-item.d-flex.flex-row(v-for="item in items")
      .l-item-day.text-center {{item.requestDay | day}}
      .l-item-type.text-center
        span.badge.badge-secondary {{item.statusType}}
      .l-item-currency.text-center.ml-auto  {{item.currency}}
      .l-item-amount.text-right {{item.absAmount | amount}}
</template>
<script lang="babel">
import {Action} from "constants"
import ViewList from "views/mixins/view-list"
import api from "api/asset"
export default {
  mixins: [ViewList],
  mounted() {
    EventEmitter.$on(Action.UpdateAsset, v => this.search())
  },
  methods: {
    action(data, success, failure) {
      api.findUnprocessedOut(data, success, failure)
    }
  }
}
</script>