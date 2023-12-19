<script setup lang="ts">
import { useAppStore } from '@/store'

const title = import.meta.env.VITE_APP_TITLE

const appStore = useAppStore()
</script>

<template>
  <router-link class="h-60 f-c-c" to="/">
    <icon-custom-logo class="text-36 color-primary" />
    <h2 v-show="!appStore.sider.collapsed" ml-15 max-w-140 flex-shrink-0 text-18 color-primary font-bold>
      {{ title }}
    </h2>
  </router-link>
</template>
