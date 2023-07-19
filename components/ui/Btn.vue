<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <v-btn
    v-bind="$attrs"
    class="text-capitalize"
    color="blue-grey-darken-2"
    dark
  >
    <slot />
  </v-btn>
</template>
