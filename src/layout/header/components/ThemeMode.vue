<script lang="ts" setup>
import { useAppStore } from '@/store'

const appStore = useAppStore()
</script>

<template>
  <n-icon mr-20 cursor-pointer size="18" @click="appStore.toggleDark">
    <icon-mdi-moon-waning-crescent v-if="appStore.isDark" />
    <icon-mdi-white-balance-sunny v-else />
  </n-icon>
</template>
