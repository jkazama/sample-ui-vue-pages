<style lang="scss" scoped>
.l-item-type {
  width: 8rem;
}
.l-item-day {
  width: 6rem;
}
.l-item-currency {
  width: 3rem;
}
.l-item-amount {
  width: 10rem;
}
</style>

<template>
  <div class="row">
    <div class="col">
      <list-group
        :fixed="true"
        :updating="updating"
        :fixed-bottom="60"
        @bottom="next"
      >
        <li
          v-for="item in items"
          :key="item.id"
          class="list-group-item d-flex flex-row"
        >
          <div class="l-item-day text-center">
            {{ item.requestDay | day }}
          </div>
          <div class="l-item-type text-center">
            <span class="badge badge-secondary">{{ item.statusType }}</span>
          </div>
          <div class="l-item-currency text-center ml-auto">
            {{ item.currency }}
          </div>
          <div class="l-item-amount text-right">
            {{ item.absAmount | amount }}
          </div>
        </li>
      </list-group>
    </div>
  </div>
</template>

<script>
import ViewList from '@/mixins/view-list';
import api from '@/api/asset';
export default {
  mixins: [ViewList],
  mounted() {
    this.$store.subscribe(mutation => {
      if (mutation.type === 'asset/update') {
        this.search();
      }
    });
  },
  methods: {
    action(data, success, failure) {
      api.findUnprocessedOut(data, success, failure);
    }
  }
};
</script>
