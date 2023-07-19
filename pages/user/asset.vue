<script lang="ts" setup>
import { ref } from "vue";

definePageMeta({
  middleware: "auth",
});

const tab = ref("withdraw");
</script>
<template>
  <div>
    <v-tabs v-model="tab" bg-color="blue-grey-lighten-2">
      <v-tab value="deposit">Deposit</v-tab>
      <v-tab value="withdraw">Withdraw</v-tab>
      <v-tab value="cashflow">Cashflow</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="deposit" transition="no">
        <UserAssetDeposit />
      </v-window-item>
      <v-window-item value="withdraw" transition="no">
        <UserAssetWithdraw />
      </v-window-item>
      <v-window-item value="cashflow" transition="no">
        <UserAssetCashflow />
      </v-window-item>
    </v-window>
  </div>
</template>
<style scoped></style>
