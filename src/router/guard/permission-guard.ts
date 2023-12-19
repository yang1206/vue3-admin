import type { Router } from 'vue-router'
import { isNullOrWhitespace } from '@/utils'
import { useAuthStore } from '@/store'

const WHITE_LIST = ['/login']
export function createPermissionGuard(router: Router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    const token = authStore.getToken

    /** 没有token的情况 */
    if (isNullOrWhitespace(token)) {
      if (WHITE_LIST.includes(to.path))
        return true

      return { path: 'login', query: { ...to.query, redirect: to.path } }
    }

    /** 有token的情况 */
    if (to.path === '/login')
      return { path: '/' }

    return true
  })
}
