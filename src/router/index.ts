import type { App } from 'vue'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import { setupRouterGuard } from './guard'
import { EMPTY_ROUTE, NOT_FOUND_ROUTE, basicRoutes } from './routes'
import { isNullOrWhitespace } from '@/utils'
import { useAuthStore, useRouterStore, useUserStore } from '@/store'
import type { RouteType, RoutesType } from '~/typings/router'

const isHash = import.meta.env.VITE_USE_HASH === 'true'
export const router = createRouter({
  history: isHash ? createWebHashHistory('/') : createWebHistory('/'),
  routes: basicRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export async function setupRouter(app: App) {
  await addDynamicRoutes()
  setupRouterGuard(router)
  app.use(router)
}

export async function addDynamicRoutes() {
  const authStore = useAuthStore()

  const token = authStore.getToken

  // 没有token情况
  if (isNullOrWhitespace(token)) {
    router.addRoute(EMPTY_ROUTE)
    authStore.toLogin()
    return
  }

  // 有token的情况
  try {
    const userStore = useUserStore()
    const routerStore = useRouterStore()
    !userStore.userId && (await userStore.getUserInfo())
    const accessRoutes = routerStore.generateRoutes(userStore.role)
    accessRoutes.forEach((route: RouteType) => {
      !router.hasRoute(route.name) && router.addRoute(route)
    })
    router.hasRoute(EMPTY_ROUTE.name) && router.removeRoute(EMPTY_ROUTE.name)
    router.addRoute(NOT_FOUND_ROUTE)
  }
  catch (error) {
    console.error(error)
  }
}

export async function resetRouter() {
  const basicRouteNames = getRouteNames(basicRoutes)
  router.getRoutes().forEach((route) => {
    const name = route.name as string
    if (!basicRouteNames.includes(name))
      router.removeRoute(name)
  })
}

export function getRouteNames(routes: RoutesType) {
  return routes.map(route => getRouteName(route)).flat(1)
}

function getRouteName(route: RouteType) {
  const names = [route.name]
  if (route.children && route.children.length)
    names.push(...route.children.map(item => getRouteName(item as RouteType)).flat(1))

  return names
}
