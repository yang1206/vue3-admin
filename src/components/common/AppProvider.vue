<script setup lang="ts">
import { kebabCase } from 'lodash-es'
import { NLoadingBarProvider, NNotificationProvider, dateZhCN, useDialog, useLoadingBar, useMessage, useNotification, zhCN } from 'naive-ui'
import { useCssVar } from '@vueuse/core'
import type { GlobalThemeOverrides } from 'naive-ui'
import { NGlobalDialog, NGlobalMessage, NInstallProvider } from 'naive-ui-pro-components'
import { useAppStore } from '@/store'

// 挂载naive组件的方法至window, 以便在全局使用
function setupNaiveTools() {
  window.$loadingBar = useLoadingBar()
  window.$message = useMessage()
  window.$dialog = useDialog()
  window.$notification = useNotification()
}

const NaiveProviderContent = defineComponent({
  setup() {
    setupCssVar()
    setupNaiveTools()
  },
  render() {
    return h('div')
  },
})

const appStore = useAppStore()

type ThemeVars = Exclude<GlobalThemeOverrides['common'], undefined>
type ThemeVarsKeys = keyof ThemeVars

// watch(
//   () => themStore.naiveThemeOverrides.common,
//   (common) => {
//     for (const key in common) {
//       useCssVar(`--${kebabCase(key)}`, document.documentElement).value = common[key as ThemeVarsKeys] || ''
//       if (key === 'primaryColor')
//         window.localStorage.setItem('__THEME_COLOR__', common[key as ThemeVarsKeys] || '')
//     }
//   },
//   { immediate: true },
// )

function setupCssVar() {
  const common = appStore.naiveThemeOverrides.common
  for (const key in common) {
    useCssVar(`--${kebabCase(key)}`, document.documentElement).value = common[key as ThemeVarsKeys] || ''
    if (key === 'primaryColor')
      window.localStorage.setItem('__THEME_COLOR__', common[key as ThemeVarsKeys] || '')
  }
}
function handleWindowResize() {
  appStore.setIsMobile(document.body.offsetWidth <= 640)
}
onMounted(() => {
  handleWindowResize()
  window.addEventListener('resize', handleWindowResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleWindowResize)
})
</script>

<template>
  <n-config-provider
    :locale="zhCN" :date-locale="dateZhCN"
    wh-full
    :theme-overrides="appStore.naiveThemeOverrides"
    :theme="appStore.naiveTheme"
  >
    <NInstallProvider
      :install="[
        NGlobalMessage,
        NGlobalDialog,
        NLoadingBarProvider,
        NNotificationProvider,
      ]"
    >
      <slot />
      <NaiveProviderContent />
    </NInstallProvider>
  </n-config-provider>
</template>
