<script setup lang="ts">
import { useRouterStore, useTabStore } from '@/store'

const tabStore = useTabStore()
const routerStore = useRouterStore()
const keepAliveComponents = computed(() => routerStore.keepAliveComponents)
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <KeepAlive :include="keepAliveComponents">
      <component :is="Component" v-if="tabStore.reloading" :key="route.path" />
    </KeepAlive>
  </router-view>
</template>
