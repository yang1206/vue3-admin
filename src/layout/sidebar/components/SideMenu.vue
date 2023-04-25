<script setup lang="ts">
import type { MenuInst, MenuOption } from 'naive-ui'
import type { Meta, RouteType } from '~/typings/router'
import { useAppStore, usePermissionStore, useThemeStore } from '@/store'
import { isUrl, renderCustomIcon, renderIcon } from '@/utils'

const router = useRouter()
const currentRoute = useRoute()
const permissionStore = usePermissionStore()
const themeStore = useThemeStore()
const appStore = useAppStore()

const menu = ref<MenuInst>()
watch(currentRoute, async () => {
  await nextTick()
  menu.value?.showOption()
})

const menuOptions = computed(() => {
  return permissionStore.menus.map((item: RouteType) => getMenuItem(item)).sort((a: { order: number }, b: { order: number }) => a.order - b.order)
})

function resolvePath(basePath: string, path: string) {
  if (isUrl(path))
    return path
  return (
    `/${
    [basePath, path]
      .filter(path => !!path && path !== '/')
      .map(path => path.replace(/(^\/)|(\/$)/g, ''))
      .join('/')}`
  )
}

type MenuItem = MenuOption & {
  key: string
  label: string
  routeName?: string
  routePath?: string
  path: string
  order: number
  icon?: (() => import('vue').VNodeChild)
  children?: MenuItem[]
}

function getMenuItem(route: RouteType, basePath = ''): MenuItem {
  let menuItem: MenuItem = {
    label: (route.meta && route.meta.title) || route.name,
    key: route.name,
    routeName: route.name,
    path: resolvePath(basePath, route.path),
    icon: getIcon(route.meta),
    order: route.meta?.order || 0,
  }

  const visibleChildren = route.children ? route.children.filter((item: RouteType) => item.name && !item.isHidden) : []

  if (!visibleChildren.length)
    return menuItem

  if (visibleChildren.length === 1) {
    // 单个子路由处理
    const singleRoute = visibleChildren[0]
    menuItem = {
      label: singleRoute.meta?.title || singleRoute.name,
      key: singleRoute.name,
      path: resolvePath(menuItem.path, singleRoute.path),
      icon: getIcon(singleRoute.meta),
      order: menuItem.order,
      type: 'group',
    }
    const visibleItems = singleRoute.children ? singleRoute.children.filter((item: RouteType) => item.name && !item.isHidden) : []

    if (visibleItems.length === 1)
      menuItem = getMenuItem(visibleItems[0], menuItem.path)
    else if (visibleItems.length > 1)
      menuItem.children = visibleItems.map(item => getMenuItem(item, menuItem.path)).sort((a, b) => a.order - b.order)
  }
  else {
    menuItem.children = visibleChildren
      .map(item => getMenuItem(item, menuItem.path))
      .sort((a, b) => a.order - b.order)
  }

  return menuItem
}

function getIcon(meta?: Meta): (() => import('vue').VNodeChild) | undefined {
  if (meta?.customIcon)
    return renderCustomIcon(meta.customIcon, { size: 18 })
  if (meta?.icon)
    return renderIcon(meta.icon, { size: 18 })
  return undefined
}

function handleMenuSelect(key: string, item: MenuOption) {
  const menuItem = item as MenuItem & MenuOption
  if (isUrl(menuItem.path)) {
    window.open(menuItem.path)
    return
  }
  if (menuItem.path === currentRoute.path && !currentRoute.meta?.keepAlive)
    appStore.reloadPage()
  else
    router.push(menuItem.path)

  // 手机端自动收起菜单
  themeStore.isMobile && themeStore.setCollapsed(true)
}
</script>

<template>
  <n-scrollbar class="flex-1-hidden">
    <n-menu
      ref="menu"
      class="side-menu"
      accordion
      :indent="18"
      :collapsed-icon-size="22"
      :collapsed-width="64"
      :options="menuOptions"
      :value="(currentRoute.meta && currentRoute.meta.activeMenu as string) || (currentRoute.name as string)"
      @update:value="handleMenuSelect"
    />
  </n-scrollbar>
</template>

<style lang="scss">
.side-menu:not(.n-menu--collapsed) {
  .n-menu-item-content {
    &::before {
      left: 5px;
      right: 5px;
    }
    &.n-menu-item-content--selected,
    &:hover {
      &::before {
        border-left: 4px solid var(--primary-color);
      }
    }
  }
}
</style>
