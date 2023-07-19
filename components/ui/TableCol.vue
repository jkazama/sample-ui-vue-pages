<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <td v-bind="$attrs" class="text-center text-caption text-sm-body-1">
    <slot />
  </td>
</template>

<style scoped></style>
