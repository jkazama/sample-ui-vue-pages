<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <v-table v-bind="$attrs" density="compact">
    <slot />
  </v-table>
</template>

<style scoped></style>
