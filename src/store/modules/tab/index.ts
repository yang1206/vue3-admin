import { defineStore } from 'pinia'
import { router } from '@/router'
import { sessionCryptoStorage } from '@/utils'

export interface TabItem {
  name: string
  path: string
  title?: string
  keepAlive?: boolean
  icon?: string
}

export const useTabStore = defineStore('tab', {
  state() {
    return {
      tabs: <Array<TabItem>> [],
      activeTab: <string> '',
      reloading: <boolean> true,
    }
  },
  getters: {
    activeIndex(): number {
      return this.tabs.findIndex(item => item.path === this.activeTab)
    },
  },
  actions: {
    async setActiveTab(path: string) {
      await nextTick()
      this.activeTab = path
    },
    setTabs(tabs: Array<TabItem>) {
      this.tabs = tabs
    },
    addTab(tab: TabItem) {
      const findIndex = this.tabs.findIndex(item => item.path === tab.path)
      if (findIndex !== -1)
        this.tabs.splice(findIndex, 1, tab)
      else
        this.setTabs([...this.tabs, tab])
      this.setActiveTab(tab.path)
    },
    async reloadTab(path: string, keepAlive?: boolean) {
      const findItem = this.tabs.find(item => item.path === path)
      if (!findItem)
        return
      if (keepAlive)
        findItem.keepAlive = false
      window.$loadingBar?.start()
      this.reloading = false
      await nextTick()
      this.reloading = true
      findItem.keepAlive = !!keepAlive
      setTimeout(() => {
        document.documentElement.scrollTo({ left: 0, top: 0 })
        window.$loadingBar?.finish()
      }, 100)
    },
    async removeTab(path: string) {
      this.setTabs(this.tabs.filter(tab => tab.path !== path))
      if (path === this.activeTab)
        router.push(this.tabs[this.tabs.length - 1].path)
    },
    removeOther(curPath: string) {
      this.setTabs(this.tabs.filter(tab => tab.path === curPath))
      if (curPath !== this.activeTab)
        router.push(this.tabs[this.tabs.length - 1].path)
    },
    removeLeft(curPath: string) {
      const curIndex = this.tabs.findIndex(item => item.path === curPath)
      const filterTabs = this.tabs.filter((item, index) => index >= curIndex)
      this.setTabs(filterTabs)
      if (!filterTabs.find(item => item.path === this.activeTab))
        router.push(filterTabs[filterTabs.length - 1].path)
    },
    removeRight(curPath: string) {
      const curIndex = this.tabs.findIndex(item => item.path === curPath)
      const filterTabs = this.tabs.filter((item, index) => index <= curIndex)
      this.setTabs(filterTabs)
      if (!filterTabs.find(item => item.path === this.activeTab))
        router.push(filterTabs[filterTabs.length - 1].path)
    },
    resetTabs() {
      this.$reset()
    },
  },
  persist: {
    key: 'tab',
    storage: sessionCryptoStorage,
  },
})
