import { defineStore } from 'pinia'
import { WITHOUT_TAB_PATHS, activeTab, tabs } from './helpers'
import { router } from '@/router'
import { setSession } from '@/utils'

export interface TabItem {
  name: string
  path: string
  title?: string
  keepAlive?: boolean
}

export const useTabStore = defineStore('tab', {
  state() {
    return {
      tabs: <Array<TabItem>> tabs || [],
      activeTab: <string> activeTab || '',
      reloading: <boolean> true,
    }
  },
  actions: {
    async setActiveTab(path: string) {
      await nextTick()
      this.activeTab = path
      setSession('activeTab', path)
    },
    setTabs(tabs: Array<TabItem>) {
      this.tabs = tabs
      setSession('tabs', tabs)
    },
    addTab(tab: TabItem) {
      const url = new URL(tab.path, 'http://example.com')
      const path = url.pathname
      this.setActiveTab(path)
      if (WITHOUT_TAB_PATHS.includes(path) || this.tabs.some(item => item.path === path))
        return
      this.setTabs([...this.tabs, tab])
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
      if (path === this.activeTab) {
        const activeIndex = this.tabs.findIndex(item => item.path === path)
        if (activeIndex > 0)
          router.push(this.tabs[activeIndex - 1].path)

        else
          router.push(this.tabs[activeIndex + 1].path)
      }
      this.setTabs(this.tabs.filter(tab => tab.path !== path))
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
      this.setTabs([])
      this.setActiveTab('')
    },
  },
})
