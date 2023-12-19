<script setup lang="ts">
import { useTabStore } from '@/store'

const tabStore = useTabStore()
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <component :is="Component" v-if="tabStore.reloading" :key="route.path" />
  </router-view>
</template>
