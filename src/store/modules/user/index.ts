import { defineStore } from 'pinia'
import { fetchUser } from '@/api'

export type Role = 0 | 1 | 2
interface UserInfo {
  id?: string
  name?: string
  avatar?: string
  /**
   * 0游客，1管理员，2超级管理员
   */
  role?: Role
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
    role(): Role {
      return this.userInfo.role || 0
    },
  },
  actions: {
    async getUserInfo() {
      try {
        const res: any = await fetchUser()

        if (res.code === 0) {
          const { id, name, avatar, isAdmin } = res.data
          this.userInfo = { id, name, avatar, role: isAdmin }
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

    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})
