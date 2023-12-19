<script setup lang="ts">
import { useAppStore } from '@/store'

const appStore = useAppStore()
</script>

<template>
  <n-icon size="20" cursor-pointer @click="appStore.toggleCollapsed()">
    <icon-mdi:format-indent-increase v-if="appStore.sider.collapsed" />
    <icon-mdi:format-indent-decrease v-else />
  </n-icon>
</template>
