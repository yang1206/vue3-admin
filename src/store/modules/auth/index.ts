import { defineStore } from 'pinia'
import { getLocal, removeLocal, setLocal } from '@/utils'
import { usePermissionStore, useTabStore } from '@/store'
import { resetRouter, router } from '@/router'
import { TOKEN_CODE } from '@/constants'

interface AuthStore {
  token: string
}
export const useAuthStore = defineStore('auth', {
  state: (): AuthStore => ({
    token: getLocal<string>(TOKEN_CODE)!,
  }),
  getters: {
    getToken(): string {
      return this.token || getLocal<string>(TOKEN_CODE)!
    },
  },
  actions: {

    async logout() {
      const { resetTabs } = useTabStore()
      const { resetPermission } = usePermissionStore()
      this.removeToken()
      resetPermission()
      resetTabs()
      resetRouter()
      this.$reset()
      this.toLogin()
    },
    async setToken(token: string) {
      this.token = token
      setLocal(TOKEN_CODE, token)
    },
    removeToken() {
      removeLocal(TOKEN_CODE)
    },
    toLogin() {
      const currentRoute = unref(router.currentRoute)
      const needRedirect = !currentRoute.meta.requireAuth && !['/404', '/login'].includes(router.currentRoute.value.path)
      router.replace({
        path: '/login',
        query: needRedirect ? { ...currentRoute.query, redirect: currentRoute.path } : {},
      })
    },
    toFourZeroFour() {
      router.replace({
        path: '/404',
      })
    },
  },
})
