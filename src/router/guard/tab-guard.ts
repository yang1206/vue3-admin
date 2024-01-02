import type { Router } from 'vue-router'
import { useRouterStore, useTabStore } from '@/store'

export const WITHOUT_TAB_PATHS = ['/404', '/login']

export function createTabGuard(router: Router) {
  router.afterEach((to) => {
    if (WITHOUT_TAB_PATHS.includes(to.path))
      return
    const tabStore = useTabStore()
    const routerStore = useRouterStore()
    const { name, fullPath: path } = to
    const title = to.meta?.title
    const icon = to.meta?.icon
    const keepAlive = to.meta?.keepAlive
    tabStore.addTab({ name: name as string, path, title, icon, keepAlive })

    const keepAliveComponents = routerStore.keepAliveComponents
    const currentComName: any = to.matched.find(item => item.name === to.name)?.name
    if (currentComName && !keepAliveComponents.includes(currentComName) && to.meta?.keepAlive) {
      // 需要缓存的组件
      keepAliveComponents.push(currentComName)
    }
    else if (!to.meta?.keepAlive || to.name === 'Redirect') {
      // 不需要缓存的组件
      const index = routerStore.keepAliveComponents.findIndex(name => name === currentComName)
      if (index !== -1)
        keepAliveComponents.splice(index, 1)
    }
    routerStore.setKeepAliveComponents(keepAliveComponents)
  })
}
