<script lang="ts" setup>
withDefaults(defineProps<{
  bordered?: boolean
}>(), {
  bordered: false,
})
</script>

<template>
  <div class="auto-bg" :class="{ 'card-border': bordered }">
    <slot />
  </div>
</template>
