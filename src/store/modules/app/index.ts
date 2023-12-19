import type { GlobalThemeOverrides } from 'naive-ui'
import { darkTheme } from 'naive-ui'
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'
import { defineStore } from 'pinia'
import { getNaiveThemeOverrides, initThemeSettings } from './helpers'

type AppState = Theme.Setting
export const useAppStore = defineStore('app-store', {
  state: (): AppState => {
    return {
      ...initThemeSettings(),
    }
  },
  getters: {
    naiveThemeOverrides(): GlobalThemeOverrides {
      return getNaiveThemeOverrides({ primary: this.primaryColor, ...this.otherColor })
    },
    naiveTheme(): BuiltInGlobalTheme | undefined {
      return this.isDark ? darkTheme : undefined
    },
  },
  actions: {
    setIsMobile(isMobile: boolean) {
      this.isMobile = isMobile
    },
    /** 设置暗黑模式 */
    setDarkMode(darkMode: boolean) {
      this.isDark = darkMode
    },
    /** 切换/关闭 暗黑模式 */
    toggleDarkMode() {
      this.isDark = !this.isDark
    },
    /** 切换/关闭 暗黑模式 ViewTransitionAPI */
    toggleDark(event: MouseEvent) {
      // @ts-expect-error experimental API
      const isAppearanceTransition = document.startViewTransition
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!isAppearanceTransition) {
        this.isDark = !this.isDark
        return
      }

      const x = event.clientX
      const y = event.clientY
      const endRadius = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      )
      // @ts-expect-error: Transition API
      const transition = document.startViewTransition(async () => {
        this.isDark = !this.isDark
        await nextTick()
      })
      transition.ready
        .then(() => {
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ]
          document.documentElement.animate(
            {
              clipPath: this.isDark
                ? [...clipPath].reverse()
                : clipPath,
            },
            {
              duration: 400,
              easing: 'ease-out',
              pseudoElement: this.isDark
                ? '::view-transition-old(root)'
                : '::view-transition-new(root)',
            },
          )
        })
    },
    /** 切换/关闭 折叠侧边栏 */
    toggleCollapsed() {
      this.sider.collapsed = !this.sider.collapsed
    },
    /** 设置 折叠侧边栏 */
    setCollapsed(collapsed: boolean) {
      this.sider.collapsed = collapsed
    },
    /** 设置主题色 */
    setPrimaryColor(color: string) {
      this.primaryColor = color
    },
  },
})
