import { defineStore } from 'pinia'
import { removeToken, toLogin } from '@/utils'
import { usePermissionStore, useTabStore } from '@/store'
import { resetRouter } from '@/router'
import { getUser } from '@/api'

export type Role = 0 | 1 | 2
interface UserInfo {
  id?: string
  name?: string
  avatar?: string
  /**
   * 0游客，1管理员，2超级管理员
   */
  isAdmin?: Role
}

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: <UserInfo> {},
    }
  },
  getters: {
    userId(): string {
      return this.userInfo.id || ''
    },
    name(): string {
      return this.userInfo.name || ''
    },
    avatar(): string {
      return this.userInfo.avatar || ''
    },
    isAdmin(): Role {
      return this.userInfo.isAdmin || 0
    },
  },
  actions: {
    async getUserInfo() {
      try {
        const res: any = await getUser()
        if (res.code === 0) {
          const { id, name, avatar, isAdmin } = res.data
          this.userInfo = { id, name, avatar, isAdmin }
          return Promise.resolve(res.data)
        }
        else {
          return Promise.reject(res)
        }
      }
      catch (error) {
        return Promise.reject(error)
      }
    },
    async logout() {
      const { resetTabs } = useTabStore()
      const { resetPermission } = usePermissionStore()
      removeToken()
      resetPermission()
      resetTabs()
      resetRouter()
      this.$reset()
      toLogin()
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
