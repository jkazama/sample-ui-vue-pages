<style lang="scss" scoped>
.l-card-mock {
  height: 100%;
  .card-body {
    height: 100%;
  }
}
</style>

<template>
  <div>
    <div class="row">
      <div class="col-sm">
        <div class="card l-card-mock mb-2">
          <div class="card-body">
            <div class="card-title">
              <font-awesome-icon icon="info-circle" /> 資産残高
            </div>
            <div class="card-text" />
          </div>
        </div>
      </div>
      <div class="col-sm-8">
        <ul class="nav nav-tabs mb-3">
          <li class="nav-item">
            <a class="nav-link" href="#deposit" data-toggle="tab">入金</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link active"
              href="#withdrawal"
              data-toggle="tab"
            >出金依頼</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="#cashflow"
              data-toggle="tab"
            >入出金一覧</a>
          </li>
        </ul>
        <div class="tab-content">
          <div id="deposit" class="tab-pane">
            TBD
          </div>
          <div id="withdrawal" class="tab-pane active">
            <withdrawal-crud />
            <withdrawal-list />
          </div>
          <div id="cashflow" class="tab-pane">
            TBD
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ViewBasic from '@/mixins/view-basic';
import WithdrawalCrud from '@/components/asset/WithdrawalCrud.vue';
import WithdrawalList from '@/components/asset/WithdrawalList.vue';
export default {
  name: 'Asset',
  components: { WithdrawalCrud, WithdrawalList },
  mixins: [ViewBasic]
};
</script>
