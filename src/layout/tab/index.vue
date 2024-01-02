<script setup lang="ts">
import ContextMenu from './components/ContextMenu.vue'
import type { TabItem } from '@/store'
import { useAppStore, useTabStore } from '@/store'
import ScrollX from '@/components/common/ScrollX.vue'

const route = useRoute()
const router = useRouter()
const tabStore = useTabStore()
const appStore = useAppStore()

interface ContextMenuOption {
  show: boolean
  x: number
  y: number
  currentPath: string
}

const contextMenuOption = reactive<ContextMenuOption>({
  show: false,
  x: 0,
  y: 0,
  currentPath: '',
})

watch(
  () => route.path,
  () => {
    const { name, fullPath: path, meta: { keepAlive } } = route
    const title = route.meta?.title as string || ''
    tabStore.addTab({ name: name as string, path, title, keepAlive })
  },
  { immediate: true },
)

function handleTagClick(path: string) {
  tabStore.setActiveTab(path)
  router.push(path)
}

function showContextMenu() {
  contextMenuOption.show = true
}
function hideContextMenu() {
  contextMenuOption.show = false
}
function setContextMenu(x: number, y: number, currentPath: string) {
  Object.assign(contextMenuOption, { x, y, currentPath })
}

// 右击菜单
async function handleContextMenu(e: MouseEvent, tabItem: TabItem) {
  const { clientX, clientY } = e
  hideContextMenu()
  setContextMenu(clientX, clientY, tabItem.path)
  await nextTick()
  showContextMenu()
}
</script>

<template>
  <ScrollX bg-white dark:bg-dark :style="{ height: `${appStore.tab.height}px` }">
    <n-tag
      v-for="tab in tabStore.tabs"
      :key="tab.path"
      mx-5 cursor-pointer rounded-4 px-15
      :type="tabStore.activeTab === tab.path ? 'primary' : 'default'"
      :closable="tabStore.tabs.length > 1"
      @click="handleTagClick(tab.path)"
      @close.stop="tabStore.removeTab(tab.path)"
      @contextmenu.prevent="handleContextMenu($event, tab)"
    >
      {{ tab.title }}
    </n-tag>
  </ScrollX>

  <ContextMenu
    v-model:show="contextMenuOption.show"
    :current-path="contextMenuOption.currentPath"
    :x="contextMenuOption.x"
    :y="contextMenuOption.y"
  />
</template>

<style lang="scss">
.n-tag__close {
  box-sizing: content-box;
  padding: 2px;
  font-size: 12px;
  border-radius: 50%;
  transition: all 00.3s;
  transform: scale(0.9);
  transform: translateX(5px);
}
</style>
