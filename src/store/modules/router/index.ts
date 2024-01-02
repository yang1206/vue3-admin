import { defineStore } from 'pinia'
import { filterAsyncRoutes } from './helpers'
import { asyncRoutes, basicRoutes } from '@/router/routes'
import type { RoutesType } from '~/typings/router'
import type { Role } from '@/store'

export const useRouterStore = defineStore('router', {
  state() {
    return {
      accessRoutes: <RoutesType> [],
      keepAliveComponents: <string[]> [],
    }
  },
  getters: {
    routes(): RoutesType {
      return basicRoutes.concat(this.accessRoutes)
    },
    menus(): RoutesType {
      return this.routes.filter(route => route.name && !route.isHidden)
    },
  },
  actions: {
    generateRoutes(role: Role): RoutesType {
      const accessRoutes = filterAsyncRoutes(asyncRoutes, role).sort((a, b) => a.meta!.order! - b.meta!.order!)
      this.accessRoutes = accessRoutes
      return accessRoutes
    },
    resetPermission() {
      this.$reset()
    },
    setKeepAliveComponents(compNames: string[]) {
      // 设置需要缓存的组件
      this.keepAliveComponents = compNames
    },
  },
})
