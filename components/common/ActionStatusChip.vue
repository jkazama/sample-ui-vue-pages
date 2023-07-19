<script setup lang="ts">
import { ActionStatusType } from "@/types";
import { computed } from "vue";

export interface Props {
  value?: ActionStatusType;
}

const props = withDefaults(defineProps<Props>(), {
  value: ActionStatusType.UNPROCESSED,
});

const color = computed(() => {
  switch (props.value) {
    case ActionStatusType.UNPROCESSED:
      return "teal lighten-1";
    case ActionStatusType.PROCESSING:
      return "info lighten-1";
    case ActionStatusType.PROCESSED:
      return "green lighten-1";
    case ActionStatusType.CANCELLED:
      return "orange darken-2";
    case ActionStatusType.ERROR:
      return "deep-orange darken-1";
    default:
      return "grey";
  }
});
</script>

<template>
  <v-chip :color="color" label density="compact" v-bind="$attrs">
    <slot />
  </v-chip>
</template>
