<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useEventStore } from "@/store/event";
import { Level } from "@/libs/log";
const event = useEventStore();

const item = ref({ modal: false, text: "" });

const colorMessage = computed(() => {
  switch (event.messages.level) {
    case Level.INFO:
      return "green lighten-1";
    case Level.WARN:
      return "orange darken-2";
    case Level.ERROR:
      return "deep-orange darken-1";
    default:
      return "grey";
  }
});

watch(event, () => {
  if (item.value.text !== event.messages.global) {
    item.value.text = event.messages.global;
    item.value.modal = true;
  }
});

const onSnackbar = (v: boolean) => {
  if (!v) {
    item.value.text = "";
  }
};
</script>

<template>
  <v-snackbar
    v-model="item.modal"
    location="top right"
    :color="colorMessage"
    :timeout="2000"
    @update:modelValue="onSnackbar"
  >
    <span class="text-white">
      {{ item.text }}
    </span>
  </v-snackbar>
</template>
