<script setup lang="ts">
function handleLinkClick() {
  window.open('https://github.com/yang1206/vue3-admin')
}
</script>

<template>
  <n-icon mr-20 size="18" style="cursor: pointer" @click="handleLinkClick">
    <icon-mdi:github />
  </n-icon>
</template>
