<script lang="ts" setup>
import { useThemeStore } from '@/store'

const theme = useThemeStore()
</script>

<template>
  <n-icon mr-20 cursor-pointer size="18" @click="theme.toggleDark">
    <icon-mdi-moon-waning-crescent v-if="theme.isDark" />
    <icon-mdi-white-balance-sunny v-else />
  </n-icon>
</template>
