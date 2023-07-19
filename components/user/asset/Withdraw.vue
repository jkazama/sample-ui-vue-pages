<script lang="ts" setup>
import { ref, computed } from "vue";
import { UserCashOut, UserRegCashOut } from "../../../types/asset";
import { useEventStore } from "../../../store/event";
import { findUnprocessedCashOut, withdraw } from "../../../api/user/asset";
import { formatAmount } from "../../../libs/app";

const event = useEventStore();
const param = ref<UserRegCashOut>({ currency: "USD", absAmount: "1000" });
const items = ref<UserCashOut[]>([]);

const rNumber = new RegExp(/^([1-9]\d*|0)(\.\d+)?$/);
const canWithdraw = computed(() => {
  return param.value.absAmount && rNumber.test(param.value.absAmount);
});

const find = () => {
  findUnprocessedCashOut().then((v) => (items.value = v));
};
const doWithdraw = () => {
  withdraw(param.value).then(() => {
    event.notify("Withdrawal request completed.");
    find();
  });
};

find();
</script>

<template>
  <div class="d-flex flex-column">
    <v-card class="mx-4 mt-2" title="User Withdraw Request" flat>
      <v-card-text class="text-body-1">
        <v-row>
          <v-col sm="4" xs="7">
            <UiTextField
              label="Withdraw Amount"
              v-model="param.absAmount"
              autofocus
              :error-messages="event.messages.columns['absAmount']"
            ></UiTextField>
          </v-col>
          <v-col sm="3" xs="5">
            <UiBtn class="mt-4" :disabled="!canWithdraw" @click="doWithdraw">
              Withdraw
            </UiBtn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mx-4" title="User Withdraw Request List" flat>
      <v-card-text class="text-body-1">
        <UiTable style="width: 520px">
          <tr>
            <UiTableCol>Request Day</UiTableCol>
            <UiTableCol> Delivery Day </UiTableCol>
            <UiTableCol class="text-right">Amount</UiTableCol>
            <UiTableCol>Status</UiTableCol>
          </tr>
          <tr v-for="item in items" :key="item.cashInOutId">
            <UiTableCol>
              {{ item.requestDay }}
            </UiTableCol>
            <UiTableCol>
              {{ item.valueDay }}
            </UiTableCol>
            <UiTableCol class="text-right">
              {{ formatAmount(item.absAmount) }}
            </UiTableCol>
            <UiTableCol>
              <CommonActionStatusChip
                class="text-caption text-sm-body-1"
                :value="item.statusType"
              >
                {{ item.statusType }}
              </CommonActionStatusChip>
            </UiTableCol>
          </tr>
        </UiTable>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped></style>
