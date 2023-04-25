<script setup lang="ts">
import { useThemeStore } from '@/store'

const title = import.meta.env.VITE_APP_TITLE

const themeStore = useThemeStore()
</script>

<template>
  <router-link class="h-60 f-c-c" to="/">
    <icon-custom-logo text-36 color-primary />
    <h2 v-show="!themeStore.sider.collapsed" ml-15 max-w-140 flex-shrink-0 text-18 font-bold color-primary>
      {{ title }}
    </h2>
  </router-link>
</template>
